const KJUR = require('jsrsasign');
// https://www.npmjs.com/package/jsrsasign

export async function generateSignature(key: string | undefined, secret: string | undefined, meetingNumber: string | undefined, role: number) {
    if (!key) {
        throw new Error('No SDK client ID was provided to generate a signature for the call!');
    } else if (!secret) {
        throw new Error('No SDK client secret was provided to generate a signature for the call!');
    } else if (!meetingNumber) {
        throw new Error('No meeting number was provided to generate a signature for the call!');
    }

    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2;
    const oHeader = { alg: 'HS256', typ: 'JWT' };

    const oPayload = {
        sdkKey: key,
        appKey: key,
        mn: meetingNumber,
        role: role,
        iat: iat,
        exp: exp,
        tokenExp: exp,
    };

    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    console.log(sHeader);
    console.log(sPayload);
    console.log(secret);
    const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, secret);
    return sdkJWT;
}
