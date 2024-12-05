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
import { checkMining } from './functions/checkUsed.js';
import { adbConnect } from './websocket/adbConnect.js';
import { getDevice } from './functions/getDevices.js';
import { getLocationsName } from './functions/getLocationsName.js';
import path from 'path';
import WebSocket from 'ws';
import { cancelPrevReservation } from './functions/cancelPrevReservation.js';
import { error } from 'console';
import { screenZ } from './websocket/screenZ.js';
import { runExec } from './functions/runExec.js';

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


// let today_credits_left = 40
// // fetch device
// let did = 6650;
let credit = 16;
// let cookies = await readCookies(process.argv[2]);
let cookies = await readCookiesWithSession(process.argv[2]);
const daily_limit = 40
// let cancel
// cancel = true

const locations = { 0: "Russia", 1: "India", 2: "Korea", 3: "Brazil", 4: "Vietnam", 5: "UK", 6: "USA", 7: "Poland" }
const locationsArray = getLocationsName(0,1,2,3,4,5,6,7)
const device_model_list = { 0: { "device": "Galaxy A", "id": 124 }, 1: { "device": "Galaxy S", "id": 125 }, 2: { "device": "Galaxy Z", "id": 126 }, 3: { "device": "Galaxy F&M", "id": 127 }, 4: { "device": "Galaxy TAB", "id": 128 } }
let modelindex = (Number(process.argv[2]) - 1) % 5;
// let modelindex = 3;
let device_model_id = device_model_list[modelindex]["id"]
const vpn_locations = getLocationsName(3)
const eventAliveLocation = getLocationsName(0)
// const ignoreDevice = getLocationsName(0)
// let ignoreDevice = getLocationsName(0, 1, 3, 4, 5, 6, 7)
let ignoreDevice = getLocationsName(0,3)
const ignoreDeviceFirst  = ignoreDevice
let devices = await getDevice(device_model_id, ignoreDevice)
const readedCookie = await readCookiesFile()
const implementSecurity = true;
let local_websocket;
let rdb_websocket;
let resets;
let vpn
let ls
let mineStart;
let totalTimeOUt;
let connecc;
let connec;
if (device_model_list[modelindex % 5]["device"] == "Galaxy F&M" && implementSecurity) {
    ignoreDevice = [...new Set([...ignoreDevice, ...getLocationsName(2)])];
    console.log("ignored device: ",ignoreDevice)
}
async function fetchData(devices) {
    const did = Number(devices)
    let device
    let base_url
    let token
    let name
    let reserve
    let location
    let isMining;
    let timeOutWait1;
    let timeOutWait2;
    try {
        if (device_model_list[modelindex % 5]["device"] == "Galaxy Z") {
            timeOutWait1 = (1000 * 60 * 15);
            timeOutWait2 = (1000 * 60 * 15);
        } else {
            timeOutWait1 = (1000 * 60 * 15);
            timeOutWait2 = (1000 * 60 * 15);

        }
        // cookies = await readCookies(process.argv[2]);
        const user = await fetch("https://developer.samsung.com/remotetestlab/rtl/api/v1/users/me", { method: 'GET', headers: { 'Cookie': cookies }, });
        const userData = await user.json()
        console.log(userData)
        // // checking new user
        readedCookie["totalCredit"] = userData["point"]
        if (readedCookie["user"] === userData["email"]) {
            console.log("User already exist")
            cookies = readedCookie["cookies"]
            readedCookie["totalCredit"] = userData["point"]
            readedCookie["cookies"] = await readCookiesWithSession(process.argv[2])
            await writeCookieFile(readedCookie);

        } else {
            readedCookie["user"] = userData["email"]
            readedCookie["indexCookie"] = process.argv[2]
            readedCookie["totalCredit"] = userData["point"]
            readedCookie["startCredit"] = userData["point"]
            readedCookie["device"] = {}
            readedCookie["finishList"] = {}
            readedCookie["deadList"] = {}
            readedCookie["finishCount"] = 0
            readedCookie["today_credits_left"] = daily_limit
            readedCookie["Totalcount"] = 0
            readedCookie["last_device"] = ""
            readedCookie["cookies"] = await readCookiesWithSession(process.argv[2])
            await writeCookieFile(readedCookie);
            cookies = readedCookie["cookies"]
            const freeCredit = `https://developer.samsung.com/remotetestlab/rtl/api/v1/users/getFreeCredit`;
            const credit = await fetch(freeCredit, { method: 'POST', headers: { 'Cookie': cookies, } });
            try {
                console.log(await credit.json())
                if (credit.ok) {
                    readedCookie["totalCredit"] = readedCookie["totalCredit"] + 10
                    readedCookie["startCredit"] = readedCookie["startCredit"] + 10
                    if (readedCookie["startCredit"] < daily_limit) {
                        readedCookie["today_credits_left"] = daily_limit - (daily_limit - readedCookie["startCredit"])
                    }
                }
            } catch {
                console.log("credit added")
            }
        }
        const optionCookie = {
            'Cookie': cookies,
        }

        try {
            if (readedCookie.device[did]["checked"]) {
                console.log("Already used device id..")
                device = readedCookie.device[did]["device"]
                base_url = readedCookie.device[did]["base_url"]
                token = readedCookie.device[did]["token"]
                name = readedCookie.device[did]["name"]
                reserve = readedCookie.device[did]["reservation_Id"]
                location = readedCookie.device[did]["location"]
                isMining = await checkMining(did)
                console.log("isMining: ", isMining)
            } else {
                throw new Error(`error`);
            }
        } catch {
            console.log("new device...")
            try{
                isMining = await checkMining(did)
            }catch{
                console.log("Error while checking mining Nicehash.May be maintainance")
                isMining = false
            }
            if (isMining) {
                console.log("Already mining... Select another device")
                return
            }
            console.log(did)
            const startUrl = `https://developer.samsung.com/remotetestlab/rtl/api/v1/devices/webclient/start?did=${did}&tsg=${credit}&_ts=${Date.now()}`;
            const start = await fetch(startUrl, { method: 'POST', headers: optionCookie });
            try {
                const created = await start.json()
                console.log(created)
                if (created.code == 410) {
                    if (created.message.split(" ").slice(0, -1).join(" ") == "Limit credit use every day") {
                        readedCookie["today_credits_left"] = daily_limit - Number(created.message.split(" ").slice(-1)[0].split("/")[0].replace("(", ""))
                        await writeCookieFile(readedCookie);
                    }
                }
                return
            } catch {
                console.log("Device created")
            }
            const device_details = parseCookies(start.headers.get('set-cookie'))
            console.log(device_details)
            device = Object.entries(device_details)[1][0].split("_")[3]
            base_url = device_details[`WEB_CLIENT_GATEWAY_${device}`]
            token = device_details[`WEB_CLIENT_TOKEN_${device}`]
            name = device_details[`WEB_CLIENT_NAME_${device}`]
            readedCookie["cookies"] = await appendCookie(device, base_url, token, name)
            readedCookie["last_device"] = did
            readedCookie["Totalcount"] = readedCookie["Totalcount"] + 1
            isMining = await checkMining(did)
            readedCookie["totalCredit"] = readedCookie["totalCredit"]
            console.log("isMining: ", isMining)
            readedCookie["totalCredit"] = readedCookie["totalCredit"] - credit
            readedCookie.device[did] = { "device": device, "base_url": base_url, "token": token, "name": name, "credit": credit, "maxTime": `${credit * (1 / 4)}hr`, "checked": true, "reservation_Id": reserve, "error": false, "finished": false, "termux": false, "created_on": new Date().toLocaleString(), "force_cancel": false, "isMining": isMining, "cancelled": false, "error": false }
            await writeCookieFile(readedCookie);
        }
        //handled if fetch not done
        async function fetchDataWithTimeout(url, option) {
            return new Promise((resolves, rejects) => {
                try{
                    const deviceFetchTimeOut = setTimeout(() => {
                        rejects(new Error("Timeout occurred"));
                    }, 20000);
                    fetch(url, option).then((e) => { clearTimeout(deviceFetchTimeOut); resolves(e) }).catch(e => { rejects(e) });
                }catch(e){
                    rejects(e)
                }
                // Set the timeout to reject the promise after 1000ms if not resolved
            });
        }
        const url = `https://${base_url}/device/${device}`;
        const url1 = `wss://${base_url}/channels/${device}/events`;

        // //intialize device
        // const initial = await fetch(url, options(token));
        const initial = await fetchDataWithTimeout(url, options(token));
        if (!initial.ok) {
            console.log(initial)
            throw new Error(`HTTP error! Status: ${initial.status}`);
        }
        const data = await initial.json();
        // console.log(data)

        // //reseting wifi
        if (readedCookie.device[did].reservation_Id == null) {
            // console.log("435345345")
            const data = await getReservationId(did, readedCookie["cookies"])
            console.log("reservation: ", data)
            readedCookie.device[did].name ? readedCookie.device[did].name.replace(" ", "") : readedCookie.device[did].name = data.name.replace(/\s+/g, '');
            readedCookie.device[did].reservation_Id = data.reserve
            location = data.location.split(" ")[0]
            readedCookie.device[did].location = location
            await writeCookieFile(readedCookie);

        }
        if (!readedCookie.device[did]["finished"] && !readedCookie.device[did]["error"]) {
            await stayAwake(base_url, device, token);
            resets = await wifiReset(url1, token)
            resets.on('message', (message) => {
                console.log('message from server:', message.toString('utf8'));
                resets.send(`{"wifi-reset":true}`);
            });
            await wait(18000)
            resets.close()
            // console.log("here")
        }
        // adb to device
        // // local websocket
        let messages;
        let a = 0;
        let b = 1;
        let c = 0;
        let k = 0;
        let connectCondition = false
        let totalTimeOUtCondition = false
        let conditionMet = false;
        await new Promise((resolves, rejects) => {
            (async () => {
                try{
                const deviceFetchTimeOut = setTimeout(() => {
                    rejects(new Error("Timeout occurred"));
                }, 20000);
                local_websocket = await localWebsocket()
                
                    rdb_websocket = await rdbSocket(`wss://${base_url}/channels/${device}/rdb`, token)
                clearTimeout(deviceFetchTimeOut);
                resolves()
            }catch(e){
                rejects(e)
            }
            })()
        })
        //getting reservation id
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
        await new Promise((resolve, reject) => {
            if (!readedCookie.device[did]["error"]) {
                totalTimeOUt = setTimeout(() => {
                    if (!totalTimeOUtCondition) {
                        console.log("total time exceed 8 min ");
                        if (ls) {
                            if (!ls.killed) {
                                ls.kill('SIGKILL')

                            }
                        }
                        if (vpn) {
                            if (!vpn.killed) {
                                vpn.kill('SIGKILL')
                            }
                        }
                        if (mineStart) {
                            if (!mineStart.killed) {
                                mineStart.kill('SIGKILL')

                            }
                        }
                        // local_websocket.close()
                        // rdb_websocket.close()
                        reject()
                    }
                }, timeOutWait1);
            } else {
                if (readedCookie.device[did]["errorCount"] > 1) {
                    totalTimeOUt = setTimeout(() => {
                        if (!totalTimeOUtCondition) {
                            console.log("total time exceed 10 min ");
                            if (ls) {
                                if (!ls.killed) {
                                    ls.kill('SIGKILL')

                                }
                            }
                            if (vpn) {
                                if (!vpn.killed) {
                                    vpn.kill('SIGKILL')
                                }
                            }
                            if (mineStart) {
                                if (!mineStart.killed) {
                                    mineStart.kill('SIGKILL')

                                }
                            }
                            // local_websocket.close()
                            // rdb_websocket.close()
                            reject()
                        }
                    }, timeOutWait2);

                } else {
                    totalTimeOUt = setTimeout(() => {
                        if (!totalTimeOUtCondition) {
                            console.log("total time exceed 8 min");
                            if (ls) {
                                if (!ls.killed) {
                                    ls.kill('SIGKILL')

                                }
                            }
                            if (vpn) {
                                if (!vpn.killed) {
                                    vpn.kill('SIGKILL')
                                }
                            }
                            if (mineStart) {
                                if (!mineStart.killed) {
                                    mineStart.kill('SIGKILL')

                                }
                            }
                            // local_websocket.close()
                            // rdb_websocket.close()
                            reject()
                        }
                    }, timeOutWait1);
                }
            }
            connecc = setTimeout(() => {
                if (!connectCondition) {
                    console.log("rdb Connection not done properly");
                    local_websocket.close()
                    rdb_websocket.close()
                    // resets.close();
                    resolve()
                } else {
                    console.log("rdb Connection done properly");
                }
            }, 15000);
            rdb_websocket.on("close", () => {
                if (!c > 0) {
                    console.log("closing ws connection before connecting rb ")
                    reject()
                } else {
                    if (!readedCookie.device[did]["finished"]) {
                        console.log("closing ws connection while excuting")
                    }
                    resolve()
                }
            })
            rdb_websocket.on('message', (message) => {
                (async () => {
                    connectCondition = true
                    clearTimeout(connecc)
                    if (k == 0) {
                        connec = setTimeout(() => {
                            if (!conditionMet) {
                                console.log("Connection not done properly");
                                reject();
                            } else {
                                console.log("Connection done properly");
                            }
                        }, 10000);
                    }
                    k = k + 1
                    try {
                        if (message.toString('utf8').slice(0, 4) == "AUTH") {
                            local_websocket.send(message)
                        }
                        if (message.toString('utf8').slice(0, 4) == "CNXN") {
                            conditionMet = true
                            clearTimeout(connec)
                            local_websocket.send(message)
                            c = c + 1
                            if (c == 1) {
                                if (readedCookie.device[did]["finished"] && !readedCookie.device[did]["cancelled"] || isMining) {
                                    console.log("Work already done")
                                    if (isMining) {
                                        console.log("Device is already in mining")
                                    }
                                    if (eventAliveLocation.includes(readedCookie.device[did]["location"])) {
                                        //create event websocket to keep alive (test)
                                        const childs = spawn('node', [path.join(process.cwd(), '/websocket/eventAlive.js'), readedCookie.device[did]["device"], readedCookie.device[did]["base_url"], readedCookie.device[did]["token"]], {
                                            detached: true,
                                            stdio: 'ignore' // Detach from the parent's stdio (optional)
                                        });
                                        childs.unref();  // Make sure the parent process doesn't wait for the child to finish
                                        console.log('Child process detached. Parent can exit independently.');
                                        await wait(2000)
                                    }
                                    //cancelling reservation
                                    await cancelReservation(did, readedCookie.device[did]["reservation_Id"])
                                    readedCookie.device[did]["force_cancel"] = true
                                    console.log("reservation cancelled")
                                    await wait(4000)
                                    // await wait( (30 * 60 * 60 * 1000) + (30 * 60 * 1000))
                                    cookies = await readCookies(process.argv[2]);
                                    const user = await fetch("https://developer.samsung.com/remotetestlab/rtl/api/v1/users/me", { method: 'GET', headers: { 'Cookie': cookies }, });
                                    const userData = await user.json()
                                    readedCookie.device[did]["cancelled"] = true
                                    readedCookie["finishCount"] = readedCookie["finishCount"] + 1
                                    try {
                                        readedCookie.finishList[readedCookie.device[did]["location"]]["count"] = readedCookie.finishList[readedCookie.device[did]["location"]]["count"] + 1
                                    } catch {
                                        readedCookie.finishList[readedCookie.device[did]["location"]] = { "count": 1 }
                                    }
                                    console.log(`points before:${readedCookie["totalCredit"]}, points after:${userData["point"]}`)
                                    readedCookie["today_credits_left"] = daily_limit - (readedCookie["startCredit"] - userData["point"])
                                    await writeCookieFile(readedCookie)
                                    await wait(4000)
                                    resolve()
                                }
                                if (!isMining && !readedCookie.device[did]["finished"]) {
                                    // let code = await runCommandSpawn("bash", ["./scripts/startMine.sh"])
                                    // if (code != 0) {
                                    //     reject()
                                    // }
                                    // await wait(1000000000)
                                    await wait(3000)
                                    if (device_model_list[modelindex % 5]["device"] == "Galaxy Z") {
                                        const adbCommand = 'adb shell cmd device_state state 3';
                                        try {
                                            await runExec(adbCommand);  // Wait for the command to finish
                                            console.log('display state changed output:');
                                        } catch (error) {
                                            console.error('Error:', error);
                                        }
                                    }
                                    // await wait(300000)
                                    await new Promise((resolves, rejects) => {
                                        mineStart = spawn("bash", ["./scripts/startMine.sh"], { shell: true });
                                        mineStart.stdout.on("data", data => {
                                            console.log("mine:", `${data}`);
                                        });

                                        mineStart.stderr.on("data", data => {
                                            console.log(`stderr mine: ${data}`);
                                        });

                                        mineStart.on('error', (error) => {
                                            console.log(`error mine: ${error.message}`);
                                            rejects(error);
                                        });

                                        mineStart.on("close", (code) => {
                                            console.log(`mine child process exited with code ${code}`);
                                            if (code != 0) {
                                                rejects(code)
                                            } else {
                                                resolves(code)
                                            }
                                        })
                                    })
                                    await wait(8000);
                                    await new Promise((resolve, reject) => {
                                        exec(`adb shell "run-as com.termux files/usr/bin/sh -lic 'export PATH=/data/data/com.termux/files/usr/bin:$PATH; export
LD_PRELOAD=/data/data/com.termux/files/usr/lib/libtermux-exec.so; export HOME=/data/data/com.termux/files/home; cd \$HOME; echo \"export device='${name}'\" >> ~/.bashrc && echo \"export did='${did}'\" >> ~/.bashrc && ping -c 1 8.8.8.8'"`, async (error, stdout, stderr) => {
                                            if (error) {
                                                console.log("error: ", error)
                                                readedCookie.device[did]["error"] = true;
                                                await writeCookieFile(readedCookie)
                                                reject(error);
                                            } else {
                                                if (stdout) {
                                                    console.log("stdout: ", stdout)
                                                    console.log("Fine network")
                                                    resolve()
                                                }
                                            }
                                        })
                                    })
                                    const exit_code = await new Promise((resolve, reject) => {
                                        let exit_code = 1
                                        ls = spawn("bash", ["./scripts/adbMine.sh"], { shell: true });
                                        ls.stdout.on("data", data => {
                                            console.log(`stdout ls: ${data}`);
                                        });

                                        ls.stderr.on("data", data => {
                                            console.log(`stderr ls: ${data}`);
                                        });

                                        ls.on('error', (error) => {
                                            console.log(`error ls: ${error.message}`);
                                            reject(error);
                                        });

                                        ls.on("close", (code) => {
                                            console.log(`ls child process exited with code ${code}`);
                                            exit_code = code
                                            if (code != 0) {
                                                reject(code)
                                            } else {
                                                // // vpn setup
                                                if (vpn_locations.includes(location)) {
                                                    vpn = spawn("bash", ["./scripts/vpn.sh"], { shell: true });
                                                    vpn.stdout.on("data", data => {
                                                        console.log(`stdout vpn: ${data}`);
                                                    });

                                                    vpn.stderr.on("data", data => {
                                                        console.log(`stderr vpn: ${data}`);
                                                    });

                                                    vpn.on('error', (error) => {
                                                        console.log(`error vpn: ${error.message}`);
                                                        reject(error);
                                                    });

                                                    vpn.on("close", code => {
                                                        if (code != 0) {
                                                            exit_code = code
                                                            reject(code)
                                                        } else {
                                                            console.log(`vpn child process exited with code ${code}`);
                                                            console.log(`vpn finished`);
                                                            readedCookie.device[readedCookie["last_device"]].error = false
                                                            exit_code = code
                                                            resolve(code)
                                                        }
                                                    });
                                                } else {
                                                    resolve(exit_code)
                                                }

                                            }
                                        });
                                    })
                                    if (exit_code == 0) {
                                        readedCookie.device[did]["finished"] = true
                                        readedCookie.device[did]["finished_on"] = new Date().toLocaleString()
                                        readedCookie.device[did]["finished_Timestamp"] = Date.now();
                                        readedCookie.device[readedCookie["last_device"]].error = false
                                        totalTimeOUtCondition = true
                                        clearTimeout(totalTimeOUt)
                                        console.log(`finished`);
                                        await wait(3000)
                                        // await wait(300000000)
                                        resolve(exit_code)
                                    } else {
                                        reject(exit_code)
                                    }

                                } else {
                                    console.log("already done")
                                }
                            }
                            c = c + 1;
                        } else {
                            local_websocket.send(message)
                        }
                    } catch (e) {
                        reject("error", e)
                    }
                })()
            });
        })
        local_websocket.close()
        rdb_websocket.close()
        // resets.close();
        if (ls) {
            if (!ls.killed) {
                ls.kill('SIGKILL')

            }
        }
        if (vpn) {
            if (!vpn.killed) {
                vpn.kill('SIGKILL')
            }
        }
        if (mineStart) {
            if (!mineStart.killed) {
                mineStart.kill('SIGKILL')

            }
        }
        clearTimeout(totalTimeOUt)
        clearTimeout(connecc)
        clearTimeout(connec)

    } catch (error) {
        console.error('Fetch error:', error.message);
        clearTimeout(totalTimeOUt)
        clearTimeout(connecc)
        clearTimeout(connec)
        if (ls) {
            if (!ls.killed) {
                ls.kill('SIGKILL')

            }
        }
        if (vpn) {
            if (!vpn.killed) {
                vpn.kill('SIGKILL')
            }
        }
        if (mineStart) {
            if (!mineStart.killed) {
                mineStart.kill('SIGKILL')

            }
        }
        if (local_websocket != null && rdb_websocket != null) {
            local_websocket.close()
            rdb_websocket.close()
            // resets.close();
        }
        throw new Error(`error`);
        // if(error.message!="warning"){
        // }
    }
}

let count = 0;
let recheckCount = 0;
(async function () {
    while (true) {
        try {
            console.log("count: ", count, "length: ", devices.length)
            if ((readedCookie["last_device"] != "" && readedCookie.device[readedCookie["last_device"]].cancelled) || readedCookie["last_device"] == "") {
                if (count >= devices.length || devices.length == 0) {
                    recheckCount = recheckCount + 1
                    if (recheckCount > 4) {
                        console.log("recheckCount: ", recheckCount)
                        modelindex = modelindex + 1
                        device_model_id = device_model_list[modelindex % 5]["id"]
                        recheckCount = 0
                        if (device_model_list[modelindex % 5]["device"] == "Galaxy F&M" && implementSecurity) {
                            ignoreDevice = [...new Set([...ignoreDevice, ...getLocationsName(2)])];
                            console.log("ignored device: ",ignoreDevice)
                        }
                        // ignoreDevice = ignoreDeviceFirst
                    }
                    devices = await getDevice(device_model_id, ignoreDevice)
                    let i
                    if (devices.length == 0) {
                        for (i = 0; i < 5; i++) {
                            console.log("no device is available for ", device_model_list[modelindex % 5]["device"], "for locations in", locationsArray.filter(ele=>!ignoreDevice.includes(ele)).join(", "), ".retrying ", i, "...")
                            devices = await getDevice(device_model_id, ignoreDevice)
                            if (devices.length != 0) {
                                count = 0
                                break
                            } else {
                                await wait(1000 * 6)
                            }
                        }
                        if (i >= 5) {
                            console.log("recheckCount: ", recheckCount)
                            modelindex = modelindex + 1
                            device_model_id = device_model_list[modelindex % 5]["id"]
                            console.log("device model changed to ", device_model_list[modelindex % 5]["device"])
                            count = 0
                            if (device_model_list[modelindex % 5]["device"] == "Galaxy F&M" && implementSecurity) {
                                ignoreDevice = [...new Set([...ignoreDevice, ...getLocationsName(2)])];
                                console.log("ignored device: ",ignoreDevice)
                            }
                            // ignoreDevice = ignoreDeviceFirst
                            // process.exit(0);
                        }
                    } else {
                        count = 0
                    }
                }
            }
            // await cancelPrevReservation(readedCookie["last_device"], readedCookie["cookies"])
            await cancelPrevReservation(readedCookie["last_device"], cookies)
            if (devices.length != 0 || !readedCookie.device[readedCookie["last_device"]].cancelled) {
                if (readedCookie["last_device"] != "") {
                    if (!readedCookie.device[readedCookie["last_device"]].cancelled) {
                        console.log("prevoius device: ", readedCookie["last_device"])
                        await fetchData(readedCookie["last_device"])
                    } else {
                        console.log(devices[count])
                        await fetchData(devices[count])
                        if ((readedCookie.device[readedCookie["last_device"]].cancelled && readedCookie["totalCredit"] < credit) || readedCookie["today_credits_left"] < credit) {
                            break
                        }
                    }
                    count = count + 1
                } else {
                    console.log(devices[count])
                    await fetchData(devices[count])
                    if ((readedCookie.device[readedCookie["last_device"]].cancelled && readedCookie["totalCredit"] < credit) || readedCookie["today_credits_left"] < credit || readedCookie["startCredit"] < credit) {
                        break
                    }
                    count = count + 1
                }
            }
        } catch (e) {
            try {
                clearTimeout(totalTimeOUt)
                clearTimeout(connecc)
                clearTimeout(connec)
                if (ls) {
                    if (!ls.killed) {
                        ls.kill('SIGKILL')

                    }
                }
                if (vpn) {
                    if (!vpn.killed) {
                        vpn.kill('SIGKILL')
                    }
                }
                if (mineStart) {
                    if (!mineStart.killed) {
                        mineStart.kill('SIGKILL')

                    }
                }
                if (rdb_websocket != null) {
                    if (rdb_websocket.readyState === WebSocket.OPEN) {
                        rdb_websocket.close()
                    }
                    if (local_websocket.readyState === WebSocket.OPEN) {
                        local_websocket.close()
                    }
                    // if (resets.readyState === WebSocket.OPEN) {
                    //     resets.close();
                    // }
                }
                if (readedCookie["last_device"] != "") {
                    try {
                        console.log("error: ", e)
                        if (readedCookie.device[readedCookie["last_device"]].error == false) {
                            readedCookie.device[readedCookie["last_device"]].error = true
                            readedCookie.device[readedCookie["last_device"]].errorCount = 1
                            await writeCookieFile(readedCookie)
                        } else {
                            if (readedCookie.device[readedCookie["last_device"]].errorCount > 2) {
                                readedCookie["cookies"] = await readCookiesWithSession(process.argv[2])
                                await wait(4000)
                                try {
                                    await cancelReservation(readedCookie["last_device"], readedCookie.device[readedCookie["last_device"]]["reservation_Id"])
                                } catch {
                                    try {
                                        const data = await getReservationId(readedCookie["last_device"], readedCookie["cookies"])
                                        readedCookie.device[readedCookie["last_device"]].reservation_Id = data.reserve
                                        await cancelReservation(readedCookie["last_device"], readedCookie.device[readedCookie["last_device"]]["reservation_Id"])
                                    } catch {
                                        console.log("cant able to get reservation id,cancelling...")
                                        readedCookie.device[readedCookie["last_device"]]["cancelled"] = true
                                    }
                                }
                                readedCookie.device[readedCookie["last_device"]]["force_cancel"] = true
                                cookies = await readCookies(process.argv[2]);
                                const user = await fetch("https://developer.samsung.com/remotetestlab/rtl/api/v1/users/me", { method: 'GET', headers: { 'Cookie': cookies }, });
                                try {
                                    readedCookie.deadList[readedCookie.device[readedCookie["last_device"]]["location"]]["count"] = readedCookie.deadList[readedCookie.device[readedCookie["last_device"]]["location"]]["count"] + 1
                                } catch {
                                    readedCookie.deadList[readedCookie.device[readedCookie["last_device"]]["location"]] = { "count": 1 }
                                }
                                count = count + 1
                                const userData = await user.json()
                                readedCookie.device[readedCookie["last_device"]]["cancelled"] = true
                                console.log(userData)
                                console.log(`points before:${readedCookie["totalCredit"]}, points after:${userData["point"]}`)
                                readedCookie["today_credits_left"] = daily_limit - (readedCookie["startCredit"] - userData["point"])
                                await writeCookieFile(readedCookie)
                                console.log("reservation cancelled")
                            } else {
                                if (readedCookie.device[readedCookie["last_device"]].errorCount == null) {
                                    readedCookie.device[readedCookie["last_device"]].errorCount = 1
                                }
                                readedCookie.device[readedCookie["last_device"]].errorCount = readedCookie.device[readedCookie["last_device"]].errorCount + 1
                            }
                        }
                    } catch {

                    }
                } else {
                    if (readedCookie["today_credits_left"] < credit || readedCookie["startCredit"] < credit) {
                        break
                    }
                }
            } catch {
                await writeCookieFile(readedCookie)
                count = count + 1
            }
        }
        await wait(8000);
    }
})();
