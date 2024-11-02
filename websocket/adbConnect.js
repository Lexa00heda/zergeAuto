import WebSocket from 'ws';
export async function adbConnect(url, key) {
    return new Promise((resolve, reject) => {
        const socket = new WebSocket(url, [key], {
            rejectUnauthorized: false // Disable SSL verification (not recommended for production)
        });

        // Event listener for when the connection is opened
        socket.on('open', () => {
            console.log('WebSocket connection established.');
            console.log('Connection Details:');
            console.log('URL:', socket.url);
            console.log('Ready State:', socket.readyState);
            console.log('Protocol:', socket.protocol);
            console.log('Buffered Amount:', socket.bufferedAmount);

            // You can send messages here if needed
            socket.send(`{"keyboard":{"key":"Tab"}}`);
            socket.send(`{"keyboard":{"key":" "}}`);
            socket.send(`{"keyboard":{"key":"Tab"}}`);
            socket.send(`{"keyboard":{"key":"Tab"}}`);
            socket.send(`{"keyboard":{"key":"Tab"}}`);
            socket.send(`{"keyboard":{"key":"Enter"}}`);
            console.log("Messages sent");

            resolve(socket); // Resolve the promise with the socket instance
        });

        // Event listener for errors
        socket.on('error', (error) => {
            console.error('WebSocket error:', error);
            reject(error); // Reject the promise on error
        });

        // Event listener for when the connection is closed
        socket.on('close', () => {
            console.log('WebSocket wifi_reset connection closed.');
        });
    });
}
