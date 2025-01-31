// src/utils/socket/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:5100', {
    transports: ['websocket'], // Optional: specify transport methods
    reconnection: true, // Enable reconnection
});

export default socket;