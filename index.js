import fetch from 'node-fetch';
import https from 'https';
import { wifiReset } from './websocket/wifiReset.js';
import { localWebsocket } from './websocket/localSocket.js';
import { rdbSocket } from './websocket/rdbSocket.js';
import { readCookies, parseCookies, readCookiesWithSession } from './functions/readCookie.js';
import { readCookiesFile } from './cookies/readCookieFile.js';
import { writeCookieFile } from './cookies/writeCookieFile.js';
import { appendCookie } from './cookies/appendCookie.js';
import { getReservationId } from './functions/reservationId.js';
import { spawn, exec } from 'child_process';
import { runCommandSpawn } from './functions/runSpawn.js';
import { wait } from './functions/wait.js';
import { stayAwake } from './functions/stayAwake.js';
import { cancelReservation } from './functions/cancelReseravation.js';
import fsp from 'fs/promises'
import { checkMining } from './functions/checkUsed.js';
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
async function fetchData() {
    try {
        let cookies = await readCookies();
        const user = await fetch("https://developer.samsung.com/remotetestlab/rtl/api/v1/users/me", { method: 'GET', headers: { 'Cookie': cookies }, });
        const userData = await user.json()
        console.log(userData)
        const readedCookie = await readCookiesFile()
        // // checking new user
        if (readedCookie["user"] === userData["email"]) {
            console.log("User already exist")
            cookies = readedCookie["cookies"]
            credits = readedCookie["credit"]
            totalCredit = userData["point"]

        } else {
            credits = 40
            readedCookie["credit"] = credits
            readedCookie["user"] = userData["email"]
            totalCredit = userData["point"]
            readedCookie["totalCredit"] = totalCredit
            readedCookie["device"] = {}
            readedCookie["cookies"] = await readCookiesWithSession()
            // await fsp.writeFile( "user.json", JSON.stringify(readedCookie), "utf8" );
            await writeCookieFile(readedCookie);
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
        // const cookies ="locale=en-US; _ga=GA1.1.2144638647.1729542979; sa_did=9glDcbpCVTo6yOyA1I30fxkp84DHqJpR; _ga_LCSMK6BNH8=GS1.1.1729542979.1.0.1729542983.56.0.0; sa_id=bdcd3d47c2209292476e8426052ff940b7b801e2a78c3a958a7d179c91273d607c2a5e6483fd0702c784c60103ebb6c03cd2d0051de2a3ef5bc05ef787f525ec49696deaa7344a393b34b51828a69264ec54bae9eeef691dee57a1ec6c806e7ccb9251838a6795299393f3d1737955092a62ebdd25fcdc271d65e062377525194b629d1e2a960aadfd31a5ae37d1949025a0c05d57cb64e6ba6983c008da49eb7afb0eb0ac31de1a68e87a50408213d6687d6696579f7f292a8c75ce8170fdbc2619cae66ec2718aa1cab5a804a5d0da90cb518174f0dfd4b79bfedf6188e853a275c32d32a86c51441cfdf810f5f25355b178e5961339457cf50887b0cfda26; sa_state=ngjwbvtUG29ONsaaqVRwcYKpFUi5SF1j; SD_PORTAL_SSID=NByhVA9WEpoEhNcwUbjZffGqBdqylEh%2BQMX7PkbElN1g892K25MyCRJdt0XrC%2BfhhGfioFKTTUithIyssvjZcDsRd9mBxPricf%2Bh%2BJIm%2BJVF4xgrWTNWCwJshZ6QX3OI3yxUXR1V9RIIQ3NO4uMb1OtfxZde6V4W1HHYJPzFHAEuA6sseklrJOCe3zR1AqAqpJZBBKfStm5odzGWVAxEG%2Fv7JiKQQdlxBo7eO4b6K2WKySpSlUiGkq9518u4FitAhvYE%2F5T%2B6Q7fSi913d9GiZyarxBqL0BM6Fel33gPL9kwDm6gUbyxKVVT08DfOVKZosP2rpr8StjXLe7ioa56vfrNZhBPE3CI1tdnau5ZroAdgDAYMfz8jiTtGgyyrfKB; sdp_samsung_com_jwt=YuuKN%2FWY5mLJisXSKPJJBOoVxx54nrSZAGGzvYKgAsDtgCBL0HhCEOPbLbGLPINXiK2od7TVBeRXTQWsYFxWgBaFA%2FRCKegdY6l%2Begi7c0wX6E9eBvYdxC5dyQ36yllOEd2bf4leSHze4csl%2BNY%2B9Sk7VWD20Va0RL0LUS3xa8G%2FI6OiA%2FeV5EgkWF%2BgHreFonmjOBhpGVF9lrU3P2Au9BWcy502S6Sh%2BMT31Sv4%2BBXXiFQkgTtA6%2BDWQZAN6XyNTqieGy0YSiUmSFF9%2Bw%2BjdHc%2FN%2B8tM%2Bqg7vqMefotdx9OEy0DuQ1R%2B83K64vheRoTVpB6z2yUBUl8yC8beB7gXnbs8MYAQ5nDQr9NQmVaTL4snqIacuQa2pUDbU4%2BuKqdQTEgF4GOfzWV6MC8n%2FbC%2FRQU3Y5Hfw%2F1h98JR0uuMumzL0KXEMaQ4glJutUtXLQr; RTL-XSRF-TOKEN=1bc79622-9888-4f62-93b2-7cdf2ea6627a; RTL-XSRF-TOKEN-SIG=d80bdcb35cc081068af8992c6ab7f3db; RTL_FRONT_SESSIONID=MGJlZDMyNzItYWVkYy00ZDI2LWE2ZTQtYjBkNDEwYWRkNzM1"
        // fetch product list
        const product = await fetch(productUrl, { method: 'GET', headers: optionCookie });
        const result = await product.json();
        // console.log(result["productList"][0]["devices"]);

        // // fetch device
        let did = 12245;
        let credit = 8;
        let cancel
        cancel = true
        let device
        let base_url
        let token
        let name
        let reserve
        let isMining;
        try {
            if (readedCookie.device[did]["checked"]) {
                console.log("Already used device id..")
                device = readedCookie.device[did]["device"]
                base_url = readedCookie.device[did]["base_url"]
                token = readedCookie.device[did]["token"]
                name = readedCookie.device[did]["name"]
                reserve = readedCookie.device[did]["reservation_Id"]
                cancel? readedCookie.device[did]["force_cancel"] = cancel : readedCookie.device[did]["force_cancel"] = false
                isMining = await checkMining(name)
                if(!isMining){
                    readedCookie.device[did]["termux"] = false
                    readedCookie.device[did]["finished"] = false

                }
                // return;
            }else{
                throw new Error(`error`);
            }
        } catch {
            if(cancel !=null){
                throw new Error(`Error:Cancelling reservation before creation`);
            }
            console.log("new device...")
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
            isMining = await checkMining(name)
            console.log()
            readedCookie.device[did] = { "device": device, "base_url": base_url, "token": token, "name": name, "credit": credit, "checked": true, "reservation_Id": reserve, "error": false, "finished": false, "termux": false, "created_on": new Date().toLocaleString(), "force_cancel": false,"isMining":isMining}
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
        if (!readedCookie.device[did]["finished"] || isMining) {
            await stayAwake(base_url, device, token);
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
            reserve = await getReservationId(did, readedCookie["cookies"])
            readedCookie.device[did].reservation_Id = reserve
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
                    if (readedCookie.device[did]["error"] == false) {
                        if (readedCookie.device[did]["finished"] || isMining){
                            console.log("Work already done")
                            if(isMining){
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
                            runCommandSpawn("bash", ["/Users/salwankajas/Projects/automation/InputKeyboard/startMine.sh"]).then(e => {
                                wait(7000).then(s => {
                                    readedCookie.device[did]["termux"] = true
                                    exec(`adb shell "run-as com.termux files/usr/bin/sh -lic 'export PATH=/data/data/com.termux/files/usr/bin:$PATH; export
LD_PRELOAD=/data/data/com.termux/files/usr/lib/libtermux-exec.so; export HOME=/data/data/com.termux/files/home; cd \$HOME; echo \"export device='${name}'\" >> ~/.bashrc && ping -c 1 8.8.8.8'"`, (error, stdout, stderr) => {
                                        if (readedCookie.device[did]["force_cancel"]) {
                                            cancelReservation(did, readedCookie.device[did]["reservation_Id"]).then(e => {
                                                console.log("reservation cancelled")
                                            }).catch(e => {
                                                console.log(e)
                                            })
                                            return
                                        }
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
                                exec(`adb shell "run-as com.termux files/usr/bin/sh -lic 'export PATH=/data/data/com.termux/files/usr/bin:$PATH; export
LD_PRELOAD=/data/data/com.termux/files/usr/lib/libtermux-exec.so; export HOME=/data/data/com.termux/files/home; cd \$HOME; echo \"export device='${name}'\" >> ~/.bashrc && ping -c 1 8.8.8.8'"`, (error, stdout, stderr) => {
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

                                        if (readedCookie.device[did]["force_cancel"]) {
                                            cancelReservation(did, readedCookie.device[did]["reservation_Id"]).then(e => {
                                                console.log("reservation cancelled")
                                            }).catch(e => {
                                                console.log(e)
                                            })
                                            return
                                        }

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
LD_PRELOAD=/data/data/com.termux/files/usr/lib/libtermux-exec.so; export HOME=/data/data/com.termux/files/home; cd \$HOME; echo \"export device='${name}'\" >> ~/.bashrc && ping -c 1 8.8.8.8'"`, (error, stdout, stderr) => {
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
                }
                c = c + 1;
            } else {
                local_websocket.send(message)
            }

        });


    } catch (error) {
        console.error('Fetch error:', error.message);
    }
}

fetchData();
