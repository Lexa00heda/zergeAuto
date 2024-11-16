// export async function checkMining(did) {
//     return new Promise((resolve, reject) => {
//         const startUrl = `https://zergpool.com/api/walletEx?address=bc1qlh4dpprjt5kzm6zmgj2vpyhvvyhhsey4hhjt3g`;
//         fetch(startUrl, { method: 'GET' }).then(async (result) => {
//             const rigs = await result.json();
//             const indexes = rigs["miners"].reduce((acc, rig, index) => {
//                 if (rig.ID.split("-SM")[0] == did) {
//                     acc.push(index);
//                 }
//                 return acc;
//             }, []);

//             if (indexes.length === 0) {
//                 resolve(false)
//             } else {
//                 resolve(true)
//             }
//         })
//     });
// }

// checkMining(8947).then((e) => {
//         console.log(e)
//     })

export async function checkMining(did) {
    return new Promise((resolve, reject) => {
        let size = 1;
        const startUrl = `https://api2.nicehash.com/main/api/v2/mining/external/64159907-b518-4708-aa8c-00ae8080ae59/rigs2?path=&page=0&sort=NAME&size=${size}`;
        fetch(startUrl, { method: 'GET' }).then(async (result) => {
            const results = await result.json();
            size = results["totalRigs"]
            const startUrl = `https://api2.nicehash.com/main/api/v2/mining/external/64159907-b518-4708-aa8c-00ae8080ae59/rigs2?path=&page=0&sort=NAME&size=${size}`;
            const rigsDetail = await fetch(startUrl, { method: 'GET' })
            const rigs = await rigsDetail.json()
            // const index = rigs["miningRigs"].findIndex(rig => rig.rigId.split("-up")[0] === deviceName)
            const indexes = rigs["miningRigs"].reduce((acc, rig, index) => {
                if (rig.rigId.split("-SM")[0] == did) {
                    acc.push(index);
                }
                return acc;
            }, []);
            if (indexes === null) {
                resolve(false)
            } else {
                indexes.forEach(index => {
                    // console.log(rigs["miningRigs"][index])
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