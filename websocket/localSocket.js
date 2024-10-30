import WebSocket from 'ws';
export async function localWebsocket() {
    return new Promise((resolve, reject) => {
        const socket = new WebSocket('ws://127.0.0.1:8888',{
            rejectUnauthorized: false // Disable SSL verification
        });
        // Event listener for when the connection is opened
        socket.on('open', () => {
            console.log('WebSocket connection established.');
            console.log('URL:', socket.url);
            resolve(socket);
        });

        // Event listener for errors
        socket.on('error', (error) => {
            console.error('WebSocket error:', error);
            reject(error); // Reject the promise on error
        });

        // Event listener for when the connection is closed
        socket.on('close', () => {
            console.log('WebSocket local connection closed.');
        });
    });
}
