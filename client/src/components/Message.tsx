import "../App.css";

import { useChess } from "../context/ChessContext";
import { MessageData } from "../types/types";

const Message = ({ message }: { message: MessageData }) => {
  const { you } = useChess();

  // check if the message is from the user and generate the message style with daisy ui
  const isMyMessage = message.sender === you?.username;
  const messageStyle = isMyMessage ? "bg-sky-400" : "bg-rose-400";
  const messagePosition = isMyMessage ? "chat-end" : "chat-start";

  return (
    <div className={`chat ${messagePosition}`}>
      <div
        className={`chat-bubble ${messageStyle} bg-opacity-20  backdrop-blur-xl`}
      >
        {message.message}
      </div>
    </div>
  );
};

export default Message;
