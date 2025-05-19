import ChatBotIcon from "./ChatBotIcon";

const ChatMessage = ({ chat }) => {
  return (
    !chat.hideInchat && (
      <div
        className={`message ${chat.role === "model" ? "bot" : "user"}-message ${
          chat.isError ? "error" : ""
        }`}
      >
        {chat.role === "model" && <ChatBotIcon />}
        <p className="message-text" style={{ whiteSpace: 'pre-line' }}>{chat.text}</p>
      </div>
    )
  );
};
export default ChatMessage;
