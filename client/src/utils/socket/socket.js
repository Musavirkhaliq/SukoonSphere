// src/utils/socket/socket.js
import { io } from 'socket.io-client';

const socket = io('https://www.sukoonsphere.org', {
    transports: ['websocket'], // Optional: specify transport methods
    reconnection: true, // Enable reconnection
});

export default socket;