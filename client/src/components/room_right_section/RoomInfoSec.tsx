import { useChess } from "../../context/ChessContext";
import socket from "../../socket/socket";
import { Message } from "../../types/types";

import { PiShareNetworkFill } from "react-icons/pi";
import { BsFillSendFill } from "react-icons/bs";
import { BsEmojiSunglassesFill } from "react-icons/bs";
import { useEffect, useState } from "react";

const RoomInfoSec = () => {
  const { roomInfo, you, friend } = useChess();

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");

  const handleSendMessage = () => {
    if (!roomInfo || !you) return;
    if (messageInput.trim() === "") return;

    const message: Message = {
      roomId: roomInfo?.roomId,
      message: messageInput,
      sender: you?.username,
      // receiver: friend?.username
    };

    socket.emit("message:send", message);

    setMessageInput("");
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleReceiveMessage = (newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  useEffect(() => {
    socket.on("message:receive", handleReceiveMessage);

    return () => {
      socket.off("message:receive", handleReceiveMessage);
    };
  }, []);

  return (
    <>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-white text-lg font-semibold mb-3">Players</h3>
        <div className="flex flex-col gap-2">
          {you && (
            <div className="flex items-center gap-2 text-white">
              <span className="bg-green-500 w-2 h-2 rounded-full"></span>
              <span>
                {you.username} (You) - {you.color === "w" ? "White" : "Black"}
              </span>
            </div>
          )}
          {friend && (
            <div className="flex items-center gap-2 text-white">
              <span className="bg-green-500 w-2 h-2 rounded-full"></span>
              <span>
                {friend.username} - {friend.color === "w" ? "White" : "Black"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* chat section */}
      <div className="flex-grow flex flex-col gap-2">
        {/* chat messages */}
        {/* make the message box not to expend */}
        <div className="text-white max-h-[60vh] overflow-auto p-2">
          {messages.map((message, index) => (
            <div key={index}>
              <span>{message.sender}</span>
              <span>{message.message}</span>
            </div>
          ))}
        </div>

        {/* input section */}
        <div className="flex items-center gap-2 bg-gray-800 p-2 pr-4 rounded-lg">
          <input
            type="text"
            placeholder="Message"
            className="flex-grow bg-transparent border-none outline-none text-white"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />

          <button className="text-gray-400 text-2xl font-semibold hover:text-white self-end">
            <BsEmojiSunglassesFill />
          </button>
          <button
            className="text-gray-400 text-2xl font-semibold hover:text-white"
            onClick={handleSendMessage}
          >
            <BsFillSendFill />
          </button>
        </div>
      </div>

      {/* functional buttons */}
      <div>
        <div className="flex items-center">
          <button
            onClick={() =>
              navigator.clipboard.writeText(roomInfo?.roomId || "")
            }
          >
            <p className="text-white text-2xl font-semibold">
              <PiShareNetworkFill />
            </p>
          </button>
        </div>
      </div>
    </>
  );
};

export default RoomInfoSec;
