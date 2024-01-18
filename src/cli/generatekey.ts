import {ENCRYPTIONKEYFILE} from "../const.ts";

export const generateKey = async (): Promise<void> => {
    const encryptionKey = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ['encrypt', 'decrypt']
    )

    const jwk = await crypto.subtle.exportKey('jwk',encryptionKey)
    await Deno.writeTextFile(ENCRYPTIONKEYFILE,JSON.stringify(jwk,null,2))
}