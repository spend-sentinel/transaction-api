
const id:string | undefined = process.env['IsraelID'];
const card6Digits:string | undefined = process.env['card6Digits'];
const password:string | undefined = process.env['isracardPassword'];

export const getCredentials = () => {
    if (undefined == id || undefined == card6Digits || password == undefined) {
        throw "Credentials are not in env variables"
    }
    return {
        id: id,
        card6Digits: card6Digits,
        password: password
    };
}