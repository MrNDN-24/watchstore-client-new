import ChatBotIcon from "./ChatBotIcon";
import StaffIcon from "./StaffIcon"
const ChatMessage = ({ chat }) => {
  if (chat.hideInchat) return null;

  return (
    <div
      className={`message ${
        chat.role === "model" 
          ? (chat.isFromStaff ? "staff" : "bot") 
          : "user"
      }-message ${chat.isError ? "error" : ""}`}
    >
      {chat.role === "model" && (
        chat.isFromStaff ? (
          <StaffIcon/> 
        ) : (
          <ChatBotIcon /> // Icon bot
        )
      )}
      <p className="message-text" style={{ whiteSpace: 'pre-line' }}>
        {chat.text}
      </p>
    </div>
  );
};

export default ChatMessage;