import { cancelReservation, cancelReservationCookie } from "./cancelReseravation.js";

export async function cancelPrevReservation(did, cookies) {
    return new Promise((resolve, reject) => {
        const reservationurl = `https://developer.samsung.com/remotetestlab/rtl/api/v1/devices/reservation`;
        fetch(reservationurl, { method: 'GET', headers: { 'Cookie': cookies, } }).then((e => {
            try {
                e.json().then(re => {
                    if(Array.isArray(re)){  
                        console.log(re)
                        if (did != "") {
                            re.forEach(async (element) => {
                                try{
                                    if (element.deviceId != did) {
                                        // console.log(element.deviceId)
                                        // await cancelReservation(element.deviceId, element.reservationId)
                                        await cancelReservationCookie(element.deviceId, element.reservationId,cookies)
                                        console.log(`Reservation not previous device of id ${element.deviceId} cancelled`)
        
                                    }
                                }catch{
                                    reject()
                                }
                            });
                        }
                        else {
                            // re.forEach(async (element) => {
                            //     try{
                            //     // console.log(element.deviceId)
                            //     await cancelReservationCookie(element.deviceId, element.reservationId,cookies)
                            //     console.log(`Reservation not previous device of id ${element.deviceId} cancelled`)
    
                            // });
                        }
                    }
                    resolve()
                })
            } catch (e) {
                reject(e)
            }

        })).catch((e) => {
            reject(e)
        })
    });
}