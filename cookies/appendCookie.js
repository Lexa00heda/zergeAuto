import fsp from 'fs/promises'
import { readCookiesFile } from './readCookieFile.js';
export async function appendCookie(device,gateway,token,name) {
    return new Promise((resolve, reject) =>{
        readCookiesFile().then(a=>{
            const cookies = a["cookies"].split('; ');
            const cookieIndex = cookies.findIndex(c => c.startsWith("WEB_CLIENT_DATA" + '='));
            if (cookieIndex > -1) {
                // Update existing cookie
                cookies[cookieIndex] = `WEB_CLIENT_DATA=${cookies[cookieIndex].split("=")[1]}--${device}`;
            } else {
                // Add new cookie
                cookies.push(`WEB_CLIENT_DATA=${device}`);
            }
            cookies.push(`WEB_CLIENT_GATEWAY_${device}=${gateway}`)
            cookies.push(`WEB_CLIENT_TOKEN_${device}=${token}`)
            cookies.push(`WEB_CLIENT_NAME_${device}=${name}`)
        
            resolve(cookies.join('; '))
        }).catch(e=>reject(e))
    });
}