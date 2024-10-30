import https from 'https'
export async function stayAwake(url,device,token) {
    return new Promise((resolve, reject) =>{
    const agent = new https.Agent({ rejectUnauthorized: false });
    const payload = {
        type: 'stay_awake',
        state: '1'
    };

    try {
        fetch(`https://${url}/device/${device}/developerOptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
            agent: agent
        }).then(e=>{          
            if (!e.ok) {
                reject(e.status)
            }
            console.log("stay awake")
            resolve(e.status)
        })


    } catch (error) {
        reject(error)
    }
    })
}
