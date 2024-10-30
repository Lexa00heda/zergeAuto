import fsp from 'fs/promises'
export async function writeCookieFile(cookie) {
    return new Promise((resolve, reject) =>{
        fsp.writeFile( "user.json", JSON.stringify(cookie,null,2), "utf8" ).then(e=>resolve(e)).catch(e=>reject(e));
    });
}