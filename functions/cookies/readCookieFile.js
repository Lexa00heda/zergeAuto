import fsp from 'fs/promises'
export async function readCookiesFile() {
    return new Promise((resolve, reject) =>{
        fsp.readFile('./user.json', 'utf8').then(data=>{
            const myJson = JSON.parse(data);
            resolve(myJson)
        }).catch(e=>reject(e))
    });
}