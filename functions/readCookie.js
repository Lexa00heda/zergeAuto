import fs from 'fs';
import { readCookiesFile } from './cookies/readCookieFile.js';
import { writeCookieFile } from './cookies/writeCookieFile.js';
export async function readCookies(count) {
    return new Promise((resolve, reject) =>{
        fs.readFile(`./cookies/cookies${count}.txt`, 'utf8',(err, data) => {
            if (err) {
                return reject('Error reading cookies file: ' + err);
            }
            let cookies = data.split('\n')
            .map(line => line.split('='))
            .filter(parts => parts.length === 2)
            .map(parts => `${parts[0].trim()}=${parts[1].trim()}`)
            .join('; '); // Join cookies into a single string
            resolve(cookies);
        });
    });
}
export async function readCookiesWithSession(count) {
    return new Promise((resolve, reject) =>{
        fs.readFile(`./cookies/cookies${count}.txt`, 'utf8',(err, data) => {
            if (err) {
                return reject('Error reading cookies file: ' + err);
            }
            let cookies = data.split('\n')
            .map(line => line.split('='))
            .filter(parts => parts.length === 2)
            .map(parts => `${parts[0].trim()}=${parts[1].trim()}`)
            .join('; '); // Join cookies into a single string
            const optionCookie = {
                'Cookie': cookies, // Set the cookies in the header
                // 'Content-Type': 'application/json'
            }
            
            const startUrl = `https://developer.samsung.com/remotetestlab/rtl/api/v1/devices/reservation`;
            fetch(startUrl, {method: 'GET',headers:optionCookie}).then(start=>{
                if(start.headers.get('set-cookie')!=null){
                    const setCookie = parseCookies(start.headers.get('set-cookie'))
                    for (const [key, value] of Object.entries(setCookie)) {
                      cookies =`${cookies}; ${key}=${value}`;
                    }
                    console.log(cookies)
                }
                resolve(cookies);

            })
        });
    });
}

export function parseCookies(setCookieHeader) {
    const cookies = {};
    const cookieArray = setCookieHeader.split(', '); // Split if multiple cookies are set

    cookieArray.forEach(cookie => {
        const [nameValue, ...attributes] = cookie.split('; ');
        const [name, value] = nameValue.split('=');
        cookies[`${name}`] = value;
    });

    return cookies;
}
// readCookiesWithSession().then(async(e)=>{
//     const user = await readCookiesFile()
//     user["cookies"] = e
//     await writeCookieFile(user)
// })