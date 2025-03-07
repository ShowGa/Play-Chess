import SocketIO from "socket.io-client";

const socket = SocketIO("http://localhost:8080");

console.log("Socket client initialize");

export default socket;
