import { useChess } from "../../context/ChessContext";
import socket from "../../socket/socket";
import { MessageData } from "../../types/types";

import { BsFillSendFill } from "react-icons/bs";
import { BsEmojiSunglassesFill } from "react-icons/bs";
import { useEffect, useState, useRef } from "react";
import Message from "../Message";
import toast from "react-hot-toast";
import EmoteSelector from "./EmoteSelector";
import EmoteMessageBox from "./EmoteMessageBox";

const RoomInfoSec = () => {
  const { roomInfo, you, friend } = useChess();

  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [showEmoteSelector, setShowEmoteSelector] = useState(false);
  const [yourEmote, setYourEmote] = useState<{
    sender: string;
    emoteUrl: string;
  } | null>(null);
  const [friendEmote, setFriendEmote] = useState<{
    sender: string;
    emoteUrl: string;
  } | null>(null);

  const [messages, setMessages] = useState<MessageData[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");

  const [copyRoomId, setCopyRoomId] = useState<boolean>(false);

  const handleSendMessage = () => {
    if (!roomInfo || !you) return;
    if (messageInput.trim() === "") return;

    const message: MessageData = {
      roomId: roomInfo?.roomId,
      message: messageInput,
      sender: you?.username,
    };

    socket.emit("message:send", message);

    setMessageInput("");
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleEmoteSelect = (gifUrl: string) => {
    if (!roomInfo || !you || yourEmote) {
      toast.error("Wait a moment for sending another emote");
      setShowEmoteSelector(false);
      return;
    }

    socket.emit("emote:send", {
      roomId: roomInfo.roomId,
      emoteUrl: gifUrl,
      sender: you.username,
    });

    setShowEmoteSelector(false);
    // set your emote
    setYourEmote({ sender: you.username, emoteUrl: gifUrl });

    // Clear emote after 5 seconds
    setTimeout(() => {
      setYourEmote((prev) => (prev?.sender === you.username ? null : prev));
    }, 5000);
  };

  const handleReceiveEmote = (data: { sender: string; emoteUrl: string }) => {
    setFriendEmote(data);

    // Clear emote after 5 seconds
    setTimeout(() => {
      setFriendEmote((prev) => (prev?.sender === data.sender ? null : prev));
    }, 5000);
  };

  const handleReceiveMessage = (newMessage: MessageData) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomInfo?.roomId || "");
    setCopyRoomId(true);
    toast.success("Room ID copied to clipboard");
  };

  useEffect(() => {
    socket.on("message:receive", handleReceiveMessage);
    socket.on("emote:receive", handleReceiveEmote);

    return () => {
      socket.off("message:receive", handleReceiveMessage);
      socket.off("emote:receive", handleReceiveEmote);
    };
  }, []);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* players section */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-white text-lg font-semibold mb-3">Players</h3>
        <div className="flex flex-col gap-2">
          {you && (
            <div className="flex items-center gap-2 relative">
              <div className="flex items-center gap-2 text-white">
                <span className="bg-green-500 w-2 h-2 rounded-full"></span>
                <span>
                  {you.username} (You) - {you.color === "w" ? "White" : "Black"}
                </span>
              </div>
              {/* your emote show box */}
              {yourEmote && yourEmote.sender === you.username && (
                <EmoteMessageBox emoteUrl={yourEmote.emoteUrl} />
              )}
            </div>
          )}
          {friend && (
            <div className="flex items-center gap-2 relative">
              <div className="flex items-center gap-2 text-white">
                <span className="bg-green-500 w-2 h-2 rounded-full"></span>
                <span>
                  {friend.username} - {friend.color === "w" ? "White" : "Black"}
                </span>
              </div>
              {/* friend emote show box */}
              {friendEmote && friendEmote.sender === friend.username && (
                <EmoteMessageBox emoteUrl={friendEmote.emoteUrl} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* chat section */}
      <div className="flex-grow flex flex-col gap-2">
        {/* chat messages */}
        <div className="text-white max-h-[55vh] h-full overflow-auto overflow-x-hidden p-2">
          {messages.map((message, index) => (
            <div key={index} ref={lastMessageRef} className="mb-2">
              <Message message={message} />
            </div>
          ))}
        </div>

        {/* input section */}
        <div className="flex items-center gap-2 bg-gray-800 p-2 pr-4 rounded-lg relative">
          <input
            type="text"
            placeholder="Message"
            className="flex-grow bg-transparent border-none outline-none text-white"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />

          {/* emote button */}
          <button
            className="text-gray-400 text-2xl font-semibold hover:text-white self-end relative"
            onClick={() => setShowEmoteSelector(!showEmoteSelector)}
          >
            <BsEmojiSunglassesFill />
          </button>

          {/* send button */}
          <button
            className="text-gray-400 text-2xl font-semibold hover:text-white"
            onClick={handleSendMessage}
          >
            <BsFillSendFill />
          </button>

          {/* emote selector */}
          {showEmoteSelector && (
            <EmoteSelector handleEmoteSelect={handleEmoteSelect} />
          )}
        </div>
      </div>

      {/* functional buttons */}
      <div>
        <div className="flex items-center gap-2 justify-evenly">
          <button
            onClick={handleCopyRoomId}
            className={`bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-all duration-300 ${
              copyRoomId ? "" : "button_breath_light"
            }`}
          >
            <p className="text-white text-md font-semibold">Copy Room ID</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default RoomInfoSec;
