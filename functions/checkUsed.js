export async function checkMining(deviceName) {
    return new Promise((resolve, reject) => {
        let size = 1;
        const startUrl = `https://api2.nicehash.com/main/api/v2/mining/external/64159907-b518-4708-aa8c-00ae8080ae59/rigs2?path=&page=0&sort=NAME&size=${size}`;
        fetch(startUrl, { method: 'GET' }).then(async (result) => {
            const results = await result.json();
            size = results["totalRigs"]
            const startUrl = `https://api2.nicehash.com/main/api/v2/mining/external/64159907-b518-4708-aa8c-00ae8080ae59/rigs2?path=&page=0&sort=NAME&size=${size}`;
            const rigsDetail = await fetch(startUrl, { method: 'GET' })
            const rigs = await rigsDetail.json()
            // const index = rigs["miningRigs"].findIndex(rig => rig.rigId.split("-").slice(0,3).join("-") === deviceName)
            const indexes = rigs["miningRigs"].reduce((acc, rig, index) => {
                if (rig.rigId.split("-").slice(0, 3).join("-") === deviceName) {
                    acc.push(index);
                }
                return acc;
            }, []);
            if (indexes === null) {
                resolve(false)
            } else {
                indexes.forEach(index => {
                    if (rigs["miningRigs"][index].minerStatus == "OFFLINE") {
                        // resolve(false)
                    } else {
                        resolve(true)
                    }
                });
                resolve(false)
            }
        })
    });
}

// checkMining("SM-X818U-US05a").then((e) => {
//     console.log(e)
// })