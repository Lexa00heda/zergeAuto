import fetch from 'node-fetch';
import https from 'https';
import { wifiReset } from './websocket/wifiReset.js';
import { localWebsocket } from './websocket/localSocket.js';
import { rdbSocket } from './websocket/rdbSocket.js';
import { readCookies, parseCookies, readCookiesWithSession } from './functions/readCookie.js';
import { readCookiesFile } from './functions/cookies/readCookieFile.js';
import { writeCookieFile } from './functions/cookies/writeCookieFile.js';
import { appendCookie } from './functions/cookies/appendCookie.js';
import { getReservationId } from './functions/reservationId.js';
import { spawn, exec } from 'child_process';
import { runCommandSpawn } from './functions/runSpawn.js';
import { wait } from './functions/wait.js';
import { stayAwake } from './functions/stayAwake.js';
import { cancelReservation } from './functions/cancelReseravation.js';
import fsp from 'fs/promises'
import { checkMining,checkMiningDevice } from './functions/checkUsed.js';
import { adbConnect } from './websocket/adbConnect.js';
// import myJson from './user.json' assert { type: 'json' };
const productUrl = `https://developer.samsung.com/remotetestlab/rtl/api/v1/products?os=125`;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
const agent = new https.Agent({
    rejectUnauthorized: false
});

const options = (token) => {
    return {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        agent: agent
    }
};


let credits;
let totalCredit;

// // fetch device
let did = 9076;
let credit = 8;
let cancel
// cancel = true
let device
let base_url
let token
let name
let reserve
let isMining;
let isMining1;
const readedCookie = await readCookiesFile()

async function fetchData() {
    try {
        let cookies = await readCookies(process.argv[2]);
        const user = await fetch("https://developer.samsung.com/remotetestlab/rtl/api/v1/users/me", { method: 'GET', headers: { 'Cookie': cookies }, });
        const userData = await user.json()
        console.log(userData)
        // const readedCookie = await readCookiesFile()
        // // checking new user
        if (readedCookie["user"] === userData["email"]) {
            console.log("User already exist")
            cookies = readedCookie["cookies"]
            credits = readedCookie["credit"]
            totalCredit = userData["point"]
            readedCookie["cookies"] = await readCookiesWithSession(process.argv[2])
            await writeCookieFile(readedCookie);

        } else {
            credits = 40
            readedCookie["credit"] = credits
            readedCookie["user"] = userData["email"]
            totalCredit = userData["point"]
            readedCookie["totalCredit"] = totalCredit
            readedCookie["device"] = {}
            readedCookie["cookies"] = await readCookiesWithSession(process.argv[2])
            await writeCookieFile(readedCookie);
            // await fsp.writeFile( "user.json", JSON.stringify(readedCookie,null,2), "utf8" );
            cookies = readedCookie["cookies"]
            const freeCredit = `https://developer.samsung.com/remotetestlab/rtl/api/v1/users/getFreeCredit`;
            const credit = await fetch(freeCredit, { method: 'POST', headers: { 'Cookie': cookies, } });
            try {
                console.log(await credit.json())
                if (credit.ok) {
                    totalCredit = totalCredit + 10
                }
            } catch {
                console.log("credit added")
            }
        }
        const optionCookie = {
            'Cookie': cookies,
        }
        // fetch product list
        const product = await fetch(productUrl, { method: 'GET', headers: optionCookie });
        const result = await product.json();
        // console.log(result["productList"][0]["devices"]);

        try {
            if (readedCookie.device[did]["checked"]) {
                console.log("Already used device id..")
                device = readedCookie.device[did]["device"]
                base_url = readedCookie.device[did]["base_url"]
                token = readedCookie.device[did]["token"]
                name = readedCookie.device[did]["name"]
                reserve = readedCookie.device[did]["reservation_Id"]
                cancel ? readedCookie.device[did]["force_cancel"] = cancel : readedCookie.device[did]["force_cancel"] = false
                isMining1 = await checkMining(did)
                isMining = await checkMiningDevice(name)
                console.log("isMining: ",isMining)
                console.log("isMining1: ",isMining1)
                if (!isMining || !isMining1) {
                    // if(readedCookie.device[did]["finished"]==false){
                    //     readedCookie.device[did]["termux"] = false
                    // }
                    readedCookie.device[did]["finished"] = false
                }
                // return;
            } else {
                throw new Error(`error`);
            }
        } catch {
            if (cancel != null) {
                throw new Error(`Error:Cancelling reservation before creation`);
            }
            console.log("new device...")
            isMining1 = await checkMining(did)
            if(isMining1){
                console.log("Already mining... Select another device")
                return
            }
            const startUrl = `https://developer.samsung.com/remotetestlab/rtl/api/v1/devices/webclient/start?did=${did}&tsg=${credit}&_ts=${Date.now()}`;
            const start = await fetch(startUrl, { method: 'POST', headers: optionCookie });
            try {
                console.log(await start.json())
                return
            } catch {
                console.log("Device created")
                credits = credits - credit;
                totalCredit = totalCredit - credit
                readedCookie["credit"] = credits
                readedCookie["totalCredit"] = totalCredit
            }
            const device_details = parseCookies(start.headers.get('set-cookie'))
            console.log(device_details)
            device = Object.entries(device_details)[1][0].split("_")[3]
            base_url = device_details[`WEB_CLIENT_GATEWAY_${device}`]
            token = device_details[`WEB_CLIENT_TOKEN_${device}`]
            name = device_details[`WEB_CLIENT_NAME_${device}`]
            readedCookie["cookies"] = await appendCookie(device, base_url, token, name)
            readedCookie["last_device"] = did
            isMining1 = await checkMining(did)
            isMining = await checkMiningDevice(name)
            console.log("isMining: ",isMining)
            console.log("isMining1: ",isMining1)
            readedCookie.device[did] = { "device": device, "base_url": base_url, "token": token, "name": name, "credit": credit, "checked": true, "reservation_Id": reserve, "error": false, "finished": false, "termux": false, "created_on": new Date().toLocaleString(), "force_cancel": false, "isMining": isMining }
            await writeCookieFile(readedCookie);
        }

        // force cancel reservation
        // if(readedCookie.device[did]["force_cancel"]){
        //     cancelReservation(did,readedCookie.device[did]["reservation_Id"]).then(e=>{
        //         console.log("reservation cancelled")
        //     }).catch(e=>{
        //         console.log(e)
        //     })
        //     return
        // }

        const url = `https://${base_url}/device/${device}`;
        const url1 = `wss://${base_url}/channels/${device}/events`;

        // //intialize device
        const initial = await fetch(url, options(token));
        if (!initial.ok) {
            // throw new Error(`HTTP error! Status: ${initial.status}`);
            console.log(initial)
        }
        const data = await initial.json();
        // console.log(data);
        
        // //reseting wifi
        if (!readedCookie.device[did]["finished"] || isMining || isMining1) {
            await stayAwake(base_url, device, token);

            // if (readedCookie.device[did]["force_cancel"]) {
            //     cancelReservation(did, readedCookie.device[did]["reservation_Id"]).then(e => {
            //         console.log("reservation cancelled")
            //     }).catch(e => {
            //         console.log(e)
            //     })
            //     // return
            // }
            // return;

            // const reset = await wifiReset(url1, token)
            // reset.on('message', (message) => {
            //     console.log('message from server:', message.toString('utf8'));
            //     reset.send(`{"wifi-SSID":true}`);
            //     reset.send(`{"wifi-reset":true}`);
            //     reset.close();
            // });
            // console.log("here")
        }

        // adb to device
        // // local websocket
        let messages;
        let a = 0;
        let b = 1;
        let c = 0;
        const local_websocket = await localWebsocket()
        const rdb_websocket = await rdbSocket(`wss://${base_url}/channels/${device}/rdb`, token)
        

        //getting reservation id
        if (readedCookie.device[did].reservation_Id == null) {
            const data = await getReservationId(did, readedCookie["cookies"])
            readedCookie.device[did].name = data.name
            readedCookie.device[did].reservation_Id = data.reserve
            await writeCookieFile(readedCookie);

        }
        local_websocket.send(`{"serial":"${device}","manufacturer":"samsung","symbol":"${name ? name : "SM-F741U"}","name":"${name ? name : "SM-F741U"}"}`);

        local_websocket.on('message', (message) => {
            if (b == 1) {
                messages = message
                rdb_websocket.send(messages)
                b = b + 1;
            }
            if (message.toString('utf8').slice(0, 4) == "AUTH") {
                rdb_websocket.send(message)
            } else {
                if (a > 0) {
                    rdb_websocket.send(message)
                }
                a = a + 1;
            }
        });
        // // rdb socket
        rdb_websocket.on('message', (message) => {
            if (message.toString('utf8').slice(0, 4) == "AUTH") {
                local_websocket.send(message)
            }
            if (message.toString('utf8').slice(0, 4) == "CNXN") {
                local_websocket.send(message)
                if (c == 1) {
                    // let ls = spawn(adbCommand, adbArgs, { shell: true });
                    c = c + 1
                    // await adbConnect(url1, token)
                    // adbConnect(url1, token).then((e)=>{
                    if (readedCookie.device[did]["error"] == false) {
                        if (readedCookie.device[did]["finished"] || isMining || isMining1) {
                            console.log("Work already done")
                            if (isMining || isMining1) {
                                console.log("Device is already in mining")
                            }
                            if (readedCookie.device[did]["force_cancel"]) {
                                cancelReservation(did, readedCookie.device[did]["reservation_Id"]).then(e => {
                                    console.log("reservation cancelled")
                                }).catch(e => {
                                    console.log(e)
                                })
                                // return
                            }
                            return;
                        }
                        if (!readedCookie.device[did]["termux"]) {
                            runCommandSpawn("bash", ["./startMine.sh"]).then(e => {
                                wait(7000).then(s => {
                                    readedCookie.device[did]["termux"] = true
                                    if (readedCookie.device[did]["force_cancel"]) {
                                        cancelReservation(did, readedCookie.device[did]["reservation_Id"]).then(e => {
                                            console.log("reservation cancelled")
                                        }).catch(e => {
                                            console.log(e)
                                        })
                                        return
                                    }
                                    exec(`adb shell "run-as com.termux files/usr/bin/sh -lic 'export PATH=/data/data/com.termux/files/usr/bin:$PATH; export
LD_PRELOAD=/data/data/com.termux/files/usr/lib/libtermux-exec.so; export HOME=/data/data/com.termux/files/home; cd \$HOME; echo \"export device='${name}'\" >> ~/.bashrc && echo \"export did='${did}'\" >> ~/.bashrc && ping -c 1 8.8.8.8'"`, (error, stdout, stderr) => {
                                        if (error) {
                                            console.log("error: ", error)
                                            // console.log("error: ")
                                            readedCookie.device[did]["error"] = true;
                                            readedCookie.device[did]["errorCheck"] = 1;
                                            writeCookieFile(readedCookie).then(() => {
                                                return;
                                            })
                                        }
                                        if (stdout) {
                                            console.log("stdout: ", stdout)
                                            // console.log("stdout: ")
                                            console.log("Fine network")
                                            let ls = spawn("./adbMine.sh", { shell: true });
                                            ls.stdout.on("data", data => {
                                                console.log(`stdout: ${data}`);
                                                // // force cancel reservation
                                            });

                                            ls.stderr.on("data", data => {
                                                console.log(`stderr: ${data}`);
                                            });

                                            ls.on('error', (error) => {
                                                console.log(`error: ${error.message}`);
                                            });

                                            ls.on("close", code => {
                                                console.log(`child process exited with code ${code}`);
                                                // // vpn setup
                                                if(true){
                                                    let vpn = spawn("./vpn.sh", { shell: true });
                                                    vpn.stdout.on("data", data => {
                                                        console.log(`stdout: ${data}`);
                                                        // // force cancel reservation
                                                    });
        
                                                    vpn.stderr.on("data", data => {
                                                        console.log(`stderr: ${data}`);
                                                    });
        
                                                    vpn.on('error', (error) => {
                                                        console.log(`error: ${error.message}`);
                                                    });
        
                                                    vpn.on("close", code => {
                                                        console.log(`child process exited with code ${code}`);
                                                        console.log(`vpn finished`);
                                                    });
                                                }
                                                readedCookie.device[did]["finished"] = true
                                                readedCookie.device[did]["finished_on"] = new Date().toLocaleString()
                                                console.log(`finished`);
                                                writeCookieFile(readedCookie).then(() => {
                                                    return;
                                                })
                                            });
                                        }
                                    });
                                })

                            })
                        } else {
                            wait(7000).then(s => {
                                if (readedCookie.device[did]["force_cancel"]) {
                                    cancelReservation(did, readedCookie.device[did]["reservation_Id"]).then(e => {
                                        console.log("reservation cancelled")
                                    }).catch(e => {
                                        console.log(e)
                                    })
                                    return
                                }
                                exec(`adb shell "run-as com.termux files/usr/bin/sh -lic 'export PATH=/data/data/com.termux/files/usr/bin:$PATH; export
LD_PRELOAD=/data/data/com.termux/files/usr/lib/libtermux-exec.so; export HOME=/data/data/com.termux/files/home; cd \$HOME; echo \"export device='${name}'\" >> ~/.bashrc && echo \"export did='${did}'\" >> ~/.bashrc && ping -c 1 8.8.8.8'"`, (error, stdout, stderr) => {
                                    if (error) {
                                        console.log("error: ", error)
                                        // console.log("error: ")
                                        readedCookie.device[did]["error"] = true;
                                        readedCookie.device[did]["errorCheck"] = 1;
                                        writeCookieFile(readedCookie).then(() => {
                                            return;
                                        })
                                    }
                                    if (stdout) {
                                        console.log("stdout: ", stdout)
                                        // console.log("stdout: ")
                                        console.log("Fine network")

                                        let ls = spawn("./adbMine.sh", { shell: true });
                                        ls.stdout.on("data", data => {
                                            console.log(`stdout: ${data}`);
                                        });

                                        ls.stderr.on("data", data => {
                                            console.log(`stderr: ${data}`);
                                        });

                                        ls.on('error', (error) => {
                                            console.log(`error: ${error.message}`);
                                        });

                                        ls.on("close", code => {
                                            console.log(`child process exited with code ${code}`);
                                            // // vpn setup
                                            if(true){
                                                let vpn = spawn("./vpn.sh", { shell: true });
                                                vpn.stdout.on("data", data => {
                                                    console.log(`stdout: ${data}`);
                                                    // // force cancel reservation
                                                });
    
                                                vpn.stderr.on("data", data => {
                                                    console.log(`stderr: ${data}`);
                                                });
    
                                                vpn.on('error', (error) => {
                                                    console.log(`error: ${error.message}`);
                                                });
    
                                                vpn.on("close", code => {
                                                    console.log(`child process exited with code ${code}`);
                                                    console.log(`vpn finished`);
                                                });
                                            }
                                            readedCookie.device[did]["finished"] = true
                                            readedCookie.device[did]["finished_on"] = new Date().toLocaleString()
                                            console.log(`finished`);
                                            writeCookieFile(readedCookie).then(() => {
                                                return;
                                            })
                                        });
                                    }
                                });
                            })
                        }
                    } else {
                        wait(7000).then(s => {
                            exec(`adb shell "run-as com.termux files/usr/bin/sh -lic 'export PATH=/data/data/com.termux/files/usr/bin:$PATH; export
LD_PRELOAD=/data/data/com.termux/files/usr/lib/libtermux-exec.so; export HOME=/data/data/com.termux/files/home; cd \$HOME; echo \"export device='${name}'\" >> ~/.bashrc && echo \"export did='${did}'\" >> ~/.bashrc && ping -c 1 8.8.8.8'"`, (error, stdout, stderr) => {
                                if (readedCookie.device[did]["force_cancel"]) {
                                    cancelReservation(did, readedCookie.device[did]["reservation_Id"]).then(e => {
                                        console.log("reservation cancelled")
                                    }).catch(e => {
                                        console.log(e)
                                    })
                                    return
                                }
                                if (error) {
                                    // console.log("error")
                                    console.log("error: ", error)
                                    readedCookie.device[did]["error"] = true;
                                    readedCookie.device[did]["errorCheck"] = readedCookie.device[did]["errorCheck"] + 1;
                                    writeCookieFile(readedCookie).then(() => {
                                        return;
                                    })
                                    if (readedCookie.device[did]["errorCheck"] >= 4) {
                                        cancelReservation(did, readedCookie.device[did]["reservation_Id"]).then(e => {
                                            console.log("reservation cancelled")
                                        })
                                    }

                                }
                                if (stdout) {
                                    console.log("Fine network")
                                    let ls = spawn("./adbMine.sh", { shell: true });
                                    ls.stdout.on("data", data => {
                                        console.log(`stdout: ${data}`);
                                    });

                                    ls.stderr.on("data", data => {
                                        console.log(`stderr: ${data}`);
                                    });

                                    ls.on('error', (error) => {
                                        console.log(`error: ${error.message}`);
                                    });

                                    ls.on("close", code => {
                                        readedCookie.device[did]["error"] = false;
                                        // // vpn setup
                                        if(true){
                                            let vpn = spawn("./vpn.sh", { shell: true });
                                            vpn.stdout.on("data", data => {
                                                console.log(`stdout: ${data}`);
                                                // // force cancel reservation
                                            });

                                            vpn.stderr.on("data", data => {
                                                console.log(`stderr: ${data}`);
                                            });

                                            vpn.on('error', (error) => {
                                                console.log(`error: ${error.message}`);
                                            });

                                            vpn.on("close", code => {
                                                console.log(`child process exited with code ${code}`);
                                                console.log(`vpn finished`);
                                            });
                                        }
                                        readedCookie.device[did]["finished"] = true
                                        readedCookie.device[did]["finished_on"] = new Date().toLocaleString()
                                        console.log(`finished`);
                                        writeCookieFile(readedCookie).then(() => {
                                            console.log(`child process exited with code ${code}`);
                                            return;
                                        })
                                    });
                                }
                            });
                        })
                    }
                    // })
                }
                c = c + 1;
            } else {
                local_websocket.send(message)
            }

        });


    } catch (error) {
        console.error('Fetch error:', error.message);
        if(readedCookie.device[did]!=null){
            if (readedCookie.device[did]["force_cancel"]) {
                cancelReservation(did, readedCookie.device[did]["reservation_Id"]).then(e => {
                    console.log("reservation cancelled")
                }).catch(e => {
                    console.log(e)
                })
                return
            }
        }
    }
}

fetchData();
