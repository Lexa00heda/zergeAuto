import { readCookiesFile } from "./cookies/readCookieFile.js";
import { writeCookieFile } from "./cookies/writeCookieFile.js";
export async function cancelReservation(did, reservationId) {
    const user = await readCookiesFile()
    const reservationurl = `https://developer.samsung.com/remotetestlab/rtl/api/v1/devices/cancel-reservation?seq=${reservationId}&force=1`;
    const e = await fetch(reservationurl, { method: 'POST', headers: { 'Cookie': user["cookies"], } })
    // console.log(e)
    if (e.status == 200) {
        // user.credit = user.credit + (user.device[`${did}`].credit - 1)
        // user.device[`${did}`]["cancelled"] = true
        // delete user.device[`${did}`]
        // await writeCookieFile(user)
        return e.status
    } else {
        throw new Error(e);
    }
}
export async function cancelReservationCookie(did, reservationId,cookie) {
    // const user = await readCookiesFile()
    const reservationurl = `https://developer.samsung.com/remotetestlab/rtl/api/v1/devices/cancel-reservation?seq=${reservationId}&force=1`;
    const e = await fetch(reservationurl, { method: 'POST', headers: { 'Cookie': cookie, } })
    // console.log(e)
    if (e.status == 200) {
        // user.credit = user.credit + (user.device[`${did}`].credit - 1)
        // user.device[`${did}`]["cancelled"] = true
        // delete user.device[`${did}`]
        // await writeCookieFile(user)
        return e.status
    } else {
        throw new Error(e);
    }
}

// cancelReservation(8090, 8590802)