// import { useRef } from "react";
// const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
//   const inputRef = useRef();
//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     const userMessage = inputRef.current.value.trim();
//     if (!userMessage) return;
//     inputRef.current.value = "";

//     // console.log(userMessage);
//     //Update chat history with the user's message
//     setChatHistory((history) => [
//       ...history,
//       { role: "user", text: userMessage },
//     ]);

//     setTimeout(() => {
//       setChatHistory((history) => [
//         ...history,
//         { role: "model", text: "Đang soạn tin..." },
//       ]);
//       generateBotResponse([
//         ...chatHistory,
//         { role: "user", text: `Dựa vào những thông tin đã cung cấp, hãy trả lời câu hỏi sau: ${userMessage}` },
//       ]);
//     }, 600);
//   };
//   return (
//     <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
//       <input
//         ref={inputRef}
//         type="text"
//         placeholder="Nhập Tin Nhắn..."
//         className="message-input"
//         required
//       />
//       <button className="material-symbols-rounded">arrow_upward</button>
//     </form>
//   );
// };
// export default ChatForm;
import { useRef } from "react";

const ChatForm = ({
  chatHistory,
  setChatHistory,
  generateBotResponse,
  supportConversationId,
  sendMessage,
  customerId,
  supportStaffId,
}) => {
  const inputRef = useRef();
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;

    console.log("User nhập:", userMessage); // Kiểm tra tin nhắn user

    inputRef.current.value = "";

    setChatHistory((history) => [
      ...history,
      { role: "user", text: userMessage },
    ]);

    if (supportConversationId) {
      try {
        console.log(
          "Gửi tin nhắn tới nhân viên, conversationId:",
          supportConversationId
        );

        const messageData = {
          conversationId: supportConversationId,
          senderId: customerId,
          receiverId: supportStaffId,
          senderRole: "customer",
          message: userMessage,
          isBot: true, // vì chatbot gửi
        };

        await sendMessage(messageData);

        // setChatHistory((history) => [
        //   ...history,
        //   { role: "model", text: "✉️ Tin nhắn đã gửi đến nhân viên hỗ trợ" },
        // ]);
        return;
      } catch (error) {
        console.error("Lỗi gửi tin nhắn:", error);
      }
    }

    console.log("Chạy AI bot phản hồi cho câu hỏi:", userMessage);

    setTimeout(() => {
      setChatHistory((history) => {
        const updatedHistory = [
          ...history,
          { role: "model", text: "Đang soạn tin..." },
        ];

        generateBotResponse([
          ...updatedHistory.slice(0, -1), // Lấy lịch sử trước "Đang soạn tin..."
          {
            role: "user",
            text: `Dựa vào những thông tin đã cung cấp, hãy trả lời câu hỏi sau: ${userMessage}`,
          },
        ]);

        return updatedHistory;
      });
    }, 600);
  };

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Nhập Tin Nhắn..."
        className="message-input"
        required
      />
      <button className="material-symbols-rounded">arrow_upward</button>
    </form>
  );
};
export default ChatForm;
