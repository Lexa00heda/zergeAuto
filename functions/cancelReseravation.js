import { readCookiesFile } from "../cookies/readCookieFile.js";
import { writeCookieFile } from "../cookies/writeCookieFile.js";
export async function cancelReservation(did,reservationId) {
    return new Promise((resolve, reject) =>{
        readCookiesFile().then(user=>{
            const reservationurl = `https://developer.samsung.com/remotetestlab/rtl/api/v1/devices/cancel-reservation?seq=${reservationId}&force=1`;
            fetch(reservationurl, { method: 'POST', headers:  { 'Cookie': user["cookies"], } }).then((e=>{
                if(e.status==200){
                    user.credit = user.credit + (user.device[`${did}`].credit-1)
                    user.device[`${did}`]["cancelled"]=true
                    // delete user.device[`${did}`]
                    writeCookieFile(user)
                    resolve(e)
                }else{
                    reject(e)
                }
            })).catch((e)=>{
                reject(e)
            })
        }).catch(e=>{
            reject(e)
        })
    });
}

// cancelReservation(12108,8395846).then(r=>{
//     console.log(r)
// }).catch(e=>{
//     console.log(e)
// })