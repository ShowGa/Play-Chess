import SocketIO from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

const socket = SocketIO(API_URL || "http://localhost:8080");

console.log("Socket client initialize");

export default socket;
