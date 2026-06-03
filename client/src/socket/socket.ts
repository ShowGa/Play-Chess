import toast from "react-hot-toast";
import SocketIO from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

const socket = SocketIO(API_URL || "http://localhost:8080", {
  autoConnect: false,
});

socket.on("connect", () => {
  toast.success("Connect to server successfully");
});

socket.on("connect_error", () => {
  toast.error("Server is now shut down");
});

socket.on("server:idle_timeout", () => {
  toast.error(
    "You have being kick for not moving in 5 minutes ! Please rejoin again .",
  );
});

// console.log("Socket client initialize");

export default socket;
