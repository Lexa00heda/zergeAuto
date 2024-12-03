import { cancelReservation, cancelReservationCookie } from "./cancelReseravation.js";

export async function cancelPrevReservation(did, cookies) {
    return new Promise((resolve, reject) => {
        const reservationurl = `https://developer.samsung.com/remotetestlab/rtl/api/v1/devices/reservation`;
        fetch(reservationurl, { method: 'GET', headers: { 'Cookie': cookies, } }).then((e => {
            try {
                e.json().then(re => {
                    console.log("reservation:",re)
                    if (did != "" && re.length!=0) {
                        re.forEach((element) => {
                            try{
                                (async()=>{
                                if (element.deviceId != did) {
                                    // console.log(element.deviceId)
                                    // await cancelReservation(element.deviceId, element.reservationId)
                                    await cancelReservationCookie(element.deviceId, element.reservationId,cookies)
                                    console.log(`Reservation not previous device of id ${element.deviceId} cancelled`)
                                    resolve()
                                }else{
                                    resolve()
                                }
                            })()
                            }catch{
                                reject()
                            }
                        });
                    }
                    else {
                        resolve()
                    }
                })
            } catch (e) {
                reject(e)
            }

        })).catch((e) => {
            reject(e)
        })
    });
}