import WebSocket from 'ws';
import fs from 'fs';
const device = process.argv[2]
const logFile = fs.createWriteStream('websocket_messages.txt', { flags: 'a' });
// const url = `wss://${process.argv[3]}/channels/${device}/events`;
// const url1 = `wss://${process.argv[3]}/channels/${device}/test`;
const url2 = `wss://${process.argv[3]}/channels/${device}/logs`;
// const url3 = `wss://${process.argv[3]}/channels/${device}/audio`;
// const url4 = `wss://${process.argv[3]}/channels/${device}/fileUpload`;
const key = process.argv[4];
const socket = new WebSocket(url2, [key], {
    rejectUnauthorized: false // Disable SSL verification (not recommended for production)
});

// Event listener for when the connection is opened
socket.on('open', () => {
    console.log('WebSocket connection established.');
    socket.send(`{"wifi-SSID":true}`);

    // Close the WebSocket connection After 3.5 hours
    setTimeout(() => {
        console.log('Closing WebSocket after 3 and a half hours...');
        socket.close();
      }, (30 * 60 * 60 * 1000) + (30 * 60 * 1000)); // 3.5 hours in milliseconds
      
      // Senting message in evey 10 min
      const intervalId = setInterval(() => {
        console.log('Sending a message to the WebSocket server...');
        socket.send(`{"wifi-SSID":true}`);
        // socket.send('{"keyboard":{"key":"Tab"}}');
      }, 1 * 60 * 1000);

      // Event listener for when the connection is closed
      socket.on('close', () => {
        clearInterval(intervalId);
        console.log('WebSocket wifi_reset connection closed.');
    });
    
});

socket.on('message', (message) => {
    console.log('message from server:', message.toString('utf8'));
    logFile.write(`${new Date().toISOString()} - ${message}\n`);
});

// Event listener for errors
socket.on('error', (error) => {
    console.error('WebSocket error:', error);
});