import {parseArgs} from "./deps.ts";
import {login} from "./cli/login.ts";
import {generateKey} from "./cli/generatekey.ts";
import refresh from "./cli/refresh.ts";
import {MissingCredentialsError, OCPAuthenticationError, OCPUnknownError} from "./types.ts";

try{
    const {_: [module]} = parseArgs(Deno.args)

    switch(module){
        case 'refresh':
        case undefined:
            await refresh()
            break
        case 'login':
            await login()
            break
        case 'generatekey':
            await generateKey()
            break
    }
}catch (e){
    if (e instanceof OCPAuthenticationError) {
        console.log(e.message)
    } else if (e instanceof OCPUnknownError) {
        console.log(e.details)
    } else if (e instanceof MissingCredentialsError) {
        console.log(e.message)
    } else {
        throw e
    }
}