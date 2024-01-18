import {ENCRYPTIONKEYFILE} from "./const.ts";

const getEncryptionKey = (): Promise<CryptoKey> => {
    const jwk = JSON.parse(Deno.readTextFileSync(ENCRYPTIONKEYFILE))
    return crypto.subtle.importKey(
        'jwk',
        jwk,
        { name: "AES-GCM", length: 256 },
        false,
        ['encrypt', 'decrypt']
    )
}

export const encrypt = async (plainText: string): Promise<{ iv: ArrayBuffer, cipherText: ArrayBuffer }> => {
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const cipherText = await crypto.subtle.encrypt(
        {name: "AES-GCM", iv},
        await getEncryptionKey(),
        new TextEncoder().encode(plainText)
    );
    return {iv, cipherText}
}

export const decrypt = async (iv: ArrayBuffer, cipherText: ArrayBuffer): Promise<string> => {
    return new TextDecoder().decode(await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        await getEncryptionKey(),
        cipherText
    ));
}


