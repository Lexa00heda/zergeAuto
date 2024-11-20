import { cancelReservation } from "./cancelReseravation.js";

export async function cancelPrevReservation(did, cookies) {
    return new Promise((resolve, reject) => {
        const reservationurl = `https://developer.samsung.com/remotetestlab/rtl/api/v1/devices/reservation`;
        fetch(reservationurl, { method: 'GET', headers: { 'Cookie': cookies, } }).then((e => {
            try {
                e.json().then(re => {
                    console.log(re)
                    if (did != "") {
                        re.forEach(async (element) => {

                            if (element.deviceId != did) {
                                // console.log(element.deviceId)
                                await cancelReservation(element.deviceId, element.reservationId)
                                console.log(`Reservation not previous device of id ${element.deviceId} cancelled`)

                            }
                        });
                    }
                    else {
                        re.forEach(async (element) => {
                            // console.log(element.deviceId)
                            await cancelReservation(element.deviceId, element.reservationId)
                            console.log(`Reservation not previous device of id ${element.deviceId} cancelled`)

                        });
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