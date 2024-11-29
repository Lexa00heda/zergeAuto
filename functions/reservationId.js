export async function getReservationId(did,cookies) {
    return new Promise((resolve, reject) =>{
        const reservationurl = `https://developer.samsung.com/remotetestlab/rtl/api/v1/devices/reservation`;
        fetch(reservationurl, { method: 'GET', headers:  { 'Cookie': cookies, } }).then((e=>{
            try {
                e.json().then(re=>{
                    // console.log(re)
                    if(re.length == 0){
                        console.log("reservation array is empty")
                        reject()
                    }
                    re.forEach(element => {
                        if(element.deviceId===did){
                            // console.log(element)
                            const reserve = element["reservationId"]
                            const name = element["deviceName"]
                            const location = element["location"]
                            console.log(`reservation Id: ${reserve}`)
                            resolve({reserve,name,location})

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