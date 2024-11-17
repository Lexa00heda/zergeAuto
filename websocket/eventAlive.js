import WebSocket from 'ws';
import fs from 'fs';
const device = process.argv[2]
const logFile = fs.createWriteStream('websocket_messages.txt', { flags: 'a' });
const url = `wss://${process.argv[3]}/channels/${device}/events`;
const url1 = `wss://${process.argv[3]}/channels/${device}/test`;
const url2 = `wss://${process.argv[3]}/channels/${device}/logs`;
const url3 = `wss://${process.argv[3]}/channels/${device}/audio`;
const url4 = `wss://${process.argv[3]}/channels/${device}/fileUpload`;
const key = process.argv[4];
const socket = new WebSocket(url, [key], {
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
});

// Event listener for errors
socket.on('error', (error) => {
    console.error('WebSocket error:', error);
});

const socket1 = new WebSocket(url1, [key], {
    rejectUnauthorized: false // Disable SSL verification (not recommended for production)
});

// Event listener for when the connection is opened
socket1.on('open', () => {
    console.log('WebSocket connection established1.');
    socket1.send(`{"wifi-SSID":true}`);

    // Close the WebSocket connection After 3.5 hours
    setTimeout(() => {
        console.log('Closing WebSocket after 3 and a half hours...');
        socket1.close();
      }, (30 * 60 * 60 * 1000) + (30 * 60 * 1000)); // 3.5 hours in milliseconds
      
      // Senting message in evey 10 min
      const intervalId = setInterval(() => {
        console.log('Sending a message to the WebSocket server1...');
        socket1.send(`{"wifi-SSID":true}`);
        // socket.send('{"keyboard":{"key":"Tab"}}');
      }, 1 * 60 * 1000);

      // Event listener for when the connection is closed
      socket1.on('close', () => {
        clearInterval(intervalId);
        console.log('WebSocket 1 connection closed.');
    });
    
});

socket1.on('message', (message) => {
    console.log('message from server1:', message.toString('utf8'));
});

// Event listener for errors
socket1.on('error', (error) => {
    console.error('WebSocket error1:', error);
});
const socket2 = new WebSocket(url2, [key], {
    rejectUnauthorized: false // Disable SSL verification (not recommended for production)
});

// Event listener for when the connection is opened
socket2.on('open', () => {
    console.log('WebSocket connection established2.');
    socket2.send(`{"wifi-SSID":true}`);

    // Close the WebSocket connection After 3.5 hours
    setTimeout(() => {
        console.log('Closing WebSocket after 3 and a half hours...');
        socket2.close();
      }, (30 * 60 * 60 * 1000) + (30 * 60 * 1000)); // 3.5 hours in milliseconds
      
      // Senting message in evey 10 min
      const intervalId = setInterval(() => {
        console.log('Sending a message to the WebSocket server2...');
        socket2.send(`{"wifi-SSID":true}`);
        // socket.send('{"keyboard":{"key":"Tab"}}');
      }, 1 * 60 * 1000);

      // Event listener for when the connection is closed
      socket2.on('close', () => {
        clearInterval(intervalId);
        console.log('WebSocket 2 connection closed.');
    });
    
});

socket2.on('message', (message) => {
    console.log('message from server2:', message.toString('utf8'));
    logFile.write(`${new Date().toISOString()} - ${message}\n`);
});

// Event listener for errors
socket2.on('error', (error) => {
    console.error('WebSocket error2:', error);
});
const socket3 = new WebSocket(url3, [key], {
    rejectUnauthorized: false // Disable SSL verification (not recommended for production)
});

// Event listener for when the connection is opened
socket3.on('open', () => {
    console.log('WebSocket connection established3.');
    socket3.send(`{"wifi-SSID":true}`);

    // Close the WebSocket connection After 3.5 hours
    setTimeout(() => {
        console.log('Closing WebSocket after 3 and a half hours...');
        socket3.close();
      }, (30 * 60 * 60 * 1000) + (30 * 60 * 1000)); // 3.5 hours in milliseconds
      
      // Senting message in evey 10 min
      const intervalId = setInterval(() => {
        console.log('Sending a message to the WebSocket server3...');
        socket3.send(`{"wifi-SSID":true}`);
        // socket.send('{"keyboard":{"key":"Tab"}}');
      }, 1 * 60 * 1000);

      // Event listener for when the connection is closed
      socket3.on('close', () => {
        clearInterval(intervalId);
        console.log('WebSocket 3 connection closed.');
    });
    
});

socket3.on('message', (message) => {
    console.log('message from server3:', message.toString('utf8'));
});

// Event listener for errors
socket3.on('error', (error) => {
    console.error('WebSocket error3:', error);
});
const socket4 = new WebSocket(url4, [key], {
    rejectUnauthorized: false // Disable SSL verification (not recommended for production)
});

// Event listener for when the connection is opened
socket4.on('open', () => {
    console.log('WebSocket4 connection established.');
    socket4.send(`{"wifi-SSID":true}`);

    // Close the WebSocket connection After 3.5 hours
    setTimeout(() => {
        console.log('Closing WebSocket after 3 and a half hours...');
        socket4.close();
      }, (30 * 60 * 60 * 1000) + (30 * 60 * 1000)); // 3.5 hours in milliseconds
      
      // Senting message in evey 10 min
      const intervalId = setInterval(() => {
        console.log('Sending a message to the WebSocket server4...');
        socket4.send(`{"wifi-SSID":true}`);
        // socket.send('{"keyboard":{"key":"Tab"}}');
      }, 1 * 60 * 1000);

      // Event listener for when the connection is closed
      socket4.on('close', () => {
        clearInterval(intervalId);
        console.log('WebSocket 4 connection closed.');
    });
    
});

socket4.on('message', (message) => {
    console.log('message from server4:', message.toString('utf8'));
    
});

// Event listener for errors
socket4.on('error', (error) => {
    console.error('WebSocket error4:', error);
});

