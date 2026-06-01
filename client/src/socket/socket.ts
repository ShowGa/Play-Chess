import toast from "react-hot-toast";
import SocketIO from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

const socket = SocketIO(API_URL || "http://localhost:8080");

socket.on("connect_error", () => {
  toast.error("Server is now shut down");
});

// console.log("Socket client initialize");

export default socket;
