export async function getDevice(id, ignore = []) {
    return new Promise((resolve, reject) => {
        const deviceUrl = `https://developer.samsung.com/remotetestlab/rtl/api/v1/products?os=${id}`;
        const devices = []
        fetch(deviceUrl, { method: 'GET', }).then((e => {
            try {
                e.json().then(re => {
                    re.productList.forEach(element => {
                        element.devices.forEach(elements => {
                            // console.log(elements.deviceId)
                            if (ignore.length != 0) {
                                if (!ignore.includes(elements.location.split(" ")[0])) {
                                    if(elements.waiting == null){
                                        devices.push(elements.deviceId)
                                    }
                                }
                            } else if(elements.waiting == null){
                                devices.push(elements.deviceId)
                            }
                        });
                    });
                    if( Math.random() < 0.5){
                        devices.reverse()
                    }
                    resolve(devices)
                })
            } catch (e) {
                reject(e)
            }

        })).catch((e) => {
            reject(e)
        })
    });
}