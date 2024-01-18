import {pipe} from "../utils.ts";
import {YAML,decodeBase64} from '../deps.ts';
import {Cluster, KubeConfig, MissingCredentialsError, OCPAuthenticationError, OCPUnknownError} from "../types.ts";
import {decrypt} from "../crypto.ts";
import {CLUSTERSFILE, CREDENTIALSFILE} from "../const.ts";

const getCredentials = async(cluster: Cluster): Promise<Cluster>=>{
    try{
        const {iv, password: cipherText, username} = JSON.parse(Deno.readTextFileSync(CREDENTIALSFILE))
        const password = await decrypt(decodeBase64(iv), decodeBase64(cipherText))
        return {...cluster, password, username}
    }catch (e){
        throw new MissingCredentialsError()
    }
}

const getToken = async(cluster: Cluster): Promise<Cluster>=>{
    const headers = new Headers({
        'Authorization': 'Basic ' + btoa(cluster.username + ":" + cluster.password),
        'X-CSRF-Token':crypto.randomUUID()
    })
    const res = await fetch(`${cluster.url}/oauth/authorize?client_id=openshift-challenging-client&response_type=token`, {headers, redirect: 'manual'})
    if([401,403].includes(res.status)){
        throw new OCPAuthenticationError(cluster.username)
    }
    if(res.status !== 302){
        throw new OCPUnknownError(await res.text())
    }
    const token = new URL(res.headers.get('Location') || '').hash
        .substring(1)
        .split("&")
        .map(s=>s.split('='))
        .filter(([k])=>k==="access_token")
        .flat()
        .slice(1)
        .shift()
    return {...cluster,token}
}

const readConfig = async(cluster: Cluster): Promise<Cluster>=>{
    const config = YAML.parse(await Deno.readTextFile(`${Deno.env.get("HOME")}/.kube/${cluster.name}`)) as KubeConfig
    return {...cluster,config}
}

const patchConfig = (cluster: Cluster): Cluster=>{
    //TODO: match by username instead of index
    //@ts-ignore
    cluster.config.users[0].user.token = cluster.token
    return {...cluster}
}

const writeConfig = async(cluster: Cluster): Promise<void>=>{
    await Deno.writeTextFile(`${Deno.env.get("HOME")}/.kube/${cluster.name}`, YAML.stringify(cluster.config || {}))
}

const logConfig = (mode: 'token' | 'full' = 'token') => async (cluster: Cluster): Promise<Cluster>=>{
    switch(mode){
        case 'token':
            console.log({name: cluster.name, token: cluster.token})
            break
        case 'full':
            console.log(cluster)
            break
    }
    return cluster
}

const refresh = pipe(
    getCredentials,
    getToken,
    readConfig,
    patchConfig,
    logConfig(),
    writeConfig,
)

export default async()=>{
    const clusters: Cluster[] = JSON.parse(Deno.readTextFileSync(CLUSTERSFILE))
    await Promise.all(clusters.map(refresh))
}
