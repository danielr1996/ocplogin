import {encodeBase64, promptSecret} from "../deps.ts";
import {encrypt} from "../crypto.ts";
import {CREDENTIALSFILE} from "../const.ts";

export const login = async (): Promise<void> => {
    const username = prompt("Please enter username: ")
    const password = promptSecret("Please enter password: ")
    if(password === null){
        return Promise.reject('aborted')
    }
    const {iv, cipherText} = await encrypt(password)
    await Deno.writeTextFile(CREDENTIALSFILE,JSON.stringify({username, iv: encodeBase64(iv), password: encodeBase64(cipherText)}))
}