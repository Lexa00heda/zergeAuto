import WebSocket from 'ws';
export async function rdbSocket(url, key) {
    return new Promise((resolve, reject) => {
        const socket = new WebSocket(url, [key], {
            rejectUnauthorized: false,// Disable SSL verification (not recommended for production)
        });
        // Event listener for when the connection is opened
        // socket._socket._destroy(new Error("Some error"), () => {
        //     console.log("Socket destroyed!");
        //   })
        socket.on('open', () => {
            // socket.set
            console.log('WebSocket connection established.');
            console.log('URL:', socket.url);
            // socket.close()
            // socket.send(messages);
            console.log("sented")
            resolve(socket);
        });

        // Event listener for errors
        socket.on('error', (error) => {
            console.error('WebSocket error:', error);
            reject(error); // Reject the promise on error
        });

        // Event listener for when the connection is closed
        socket.on('close', () => {
            console.log('WebSocket rdb connection closed.');
        });
    });
}
