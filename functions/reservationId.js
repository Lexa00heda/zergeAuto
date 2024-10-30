export async function getReservationId(did,cookies) {
    return new Promise((resolve, reject) =>{
        const reservationurl = `https://developer.samsung.com/remotetestlab/rtl/api/v1/devices/reservation`;
        fetch(reservationurl, { method: 'GET', headers:  { 'Cookie': cookies, } }).then((e=>{
            try {
                e.json().then(re=>{
                    // console.log(re)
                    re.forEach(element => {
                        if(element.deviceId===did){
                            const reserve = element["reservationId"]
                            console.log(`reservation Id: ${reserve}`)
                            resolve(reserve)

                        }
                    });
                })
                // return
            } catch(e){
                reject(e)
            }

        })).catch((e)=>{
            reject(e)
        })
    });
}