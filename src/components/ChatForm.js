import { useRef } from "react";

const ChatForm = ({
  chatHistory,
  setChatHistory,
  generateBotResponse,
  supportConversationId,
  sendMessage,
  customerId,
  supportStaffId,
  isWaitingForSupport,
  removeFromQueue,
  setSupportConversationId,
  setIsWaitingForSupport,
  closeConversation,
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

    // === Hủy chờ hỗ trợ (PHẢI ĐẶT TRÊN) ===
    if (
      /hủy chờ|thoát hàng chờ|không cần tư vấn|ngừng chờ/i.test(userMessage)
    ) {
      console.log("==== DEBUG HỦY CHỜ ====");
      console.log("supportConversationId:", supportConversationId);
      console.log("isWaitingForSupport:", isWaitingForSupport);

      if (supportConversationId && isWaitingForSupport) {
        try {
          console.log("Bắt đầu removeFromQueue");
          await removeFromQueue(customerId);
          console.log("Đã remove khỏi queue");

          setSupportConversationId(null);
          setIsWaitingForSupport(false);
          setChatHistory((history) => [
            ...history,
            {
              role: "model",
              text: "✅ Bạn đã hủy chờ thành công. Nếu cần, bạn có thể kết nối lại bất cứ lúc nào.",
            },
          ]);
        } catch (error) {
          console.error("Lỗi khi hủy chờ:", error);
          setChatHistory((history) => [
            ...history,
            {
              role: "model",
              text: "⚠️ Lỗi khi hủy chờ, vui lòng thử lại sau.",
            },
          ]);
        }
      } else {
        setChatHistory((history) => [
          ...history,
          {
            role: "model",
            text: "❌ Bạn hiện không ở trong hàng chờ hoặc không có cuộc trò chuyện nào đang hoạt động.",
          },
        ]);
      }
      return;
    }

    // === Kết thúc cuộc trò chuyện ===
    if (/kết thúc|đóng cuộc trò chuyện|hoàn tất/i.test(userMessage)) {
      console.log("==== DEBUG KẾT THÚC CUỘC TRÒ CHUYỆN ====");
      if (supportConversationId) {
        try {
          await closeConversation(supportConversationId);
          setSupportConversationId(null);
          setIsWaitingForSupport(false);
          setChatHistory((history) => [
            ...history,
            {
              role: "model",
              text: "✅ Cuộc trò chuyện đã được kết thúc. Cảm ơn bạn đã liên hệ!",
            },
          ]);
        } catch (error) {
          console.error("Lỗi khi kết thúc cuộc trò chuyện:", error);
          setChatHistory((history) => [
            ...history,
            {
              role: "model",
              text: "⚠️ Lỗi khi kết thúc cuộc trò chuyện, vui lòng thử lại sau.",
            },
          ]);
        }
      } else {
        setChatHistory((history) => [
          ...history,
          {
            role: "model",
            text: "❌ Hiện không có cuộc trò chuyện nào để kết thúc.",
          },
        ]);
      }
      return;
    }
    // Nếu đang chờ kết nối hỗ trợ thì hiển thị thông báo và return
    if (supportConversationId && isWaitingForSupport) {
      setChatHistory((history) => [
        ...history,
        {
          role: "model",
          text: "🔄 Bạn đang được kết nối với nhân viên hỗ trợ, vui lòng chờ phản hồi.",
        },
      ]);
      return;
    }
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
