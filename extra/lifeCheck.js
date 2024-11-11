import { readCookiesFile } from "../functions/cookies/readCookieFile.js";
import fsp from 'fs/promises'
export async function lifeCheck() {
    const readedCookie = await readCookiesFile()
    const devices = Object.keys(readedCookie["device"])
    const startUrl = `https://zergpool.com/api/walletEx?address=bc1qlh4dpprjt5kzm6zmgj2vpyhvvyhhsey4hhjt3g`;
    fetch(startUrl, { method: 'GET' }).then(async (result) => {
        const rigs = await result.json();
        const indexes = rigs["miners"].reduce((acc, rig, index) => {
            acc.push(rig.ID.split("-SM")[0]);
            return acc;
        }, []);
        const commonElements = devices.filter(element => indexes.includes(element));
        const notInArray2 = devices.filter(element => !indexes.includes(element));
        const data = {}
        data["live"]= {}
        data.live["devices"]={}
        data.live["total"]= commonElements.length
        data["dead"]= {}
        data.dead["devices"]={}
        data.dead["total"]= notInArray2.length
        commonElements.forEach(e=>{
            data.live.devices[e] = { "name":readedCookie.device[e].name,"location":readedCookie.device[e].location,"time":readedCookie.device[e].maxTime,"creation":readedCookie.device[e].created_on}
        })
        notInArray2.forEach(e=>{
            data.dead.devices[e] = { "name":readedCookie.device[e].name,"location":readedCookie.device[e].location,"time":readedCookie.device[e].maxTime,"creation":readedCookie.device[e].created_on}
        })
        fsp.writeFile( "./extra/data.json", JSON.stringify(data,null,2), "utf8" ).then().catch();
        // console.log(commonElements);
        // console.log(notInArray2);
        console.log(data)
    })

}

lifeCheck().then((e)=>{

})