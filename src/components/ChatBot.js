import ChatBotIcon from "./ChatBotIcon";
import "../styles/ChatBot.css";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import { useState, useRef } from "react";
import { useEffect } from "react";
import { companyInfo } from "./WatchStoreDetail";
import { getProductChatBot } from "../services/productService";
const ChatBot = () => {
  const [productInfo, setProductInfo] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductChatBot();
        console.log("===> Kết quả getProducts:", response);

        // Sửa ở đây, vì API chatbot trả về { success: true, data: [...] }
        const products = response?.data;

        if (!Array.isArray(products)) {
          console.warn("⚠️ 'products' không phải là mảng:", products);
          return;
        }

        const formatted = products
          .map((p) => {
            const brandName = p.brand_id?.name || "Không rõ hãng";
            return `👉 ${p.name} (${brandName}) - ${p.price}₫`;
          })
          .join("\n");

        setProductInfo(`\n\n📦 Danh sách sản phẩm nổi bật:\n${formatted}`);
      } catch (error) {
        console.error("Lỗi khi load sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  //   const [chatHistory, setChatHistory] = useState([
  //     {
  //       hideInchat: true,
  //       role: "model",
  //       text: companyInfo,
  //     },
  //   ]);
  const [chatHistory, setChatHistory] = useState([]);
  useEffect(() => {
    if (productInfo) {
      setChatHistory([
        {
          hideInchat: true,
          role: "model",
          text: companyInfo + productInfo,
        },
      ]);
    }
  }, [productInfo]);
  const [showChatBot, setShowChatBot] = useState(false);

  const chatBodyRef = useRef();
  const generateBotResponse = async (history) => {
    //Helper function to update chat history
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Đang soạn tin..."),
        { role: "model", text, isError },
      ]);
    };
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
    // console.log(history);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents: history }),
    };
    try {
      const response = await fetch(
        process.env.REACT_APP_CHAT_BOT_AI_GEMINI,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message || "Có lỗi xảy ra!");
      // Clean and update chat history with bot's response
      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();

      updateHistory(apiResponseText);

      //   console.log(data);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };
  useEffect(() => {
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);
  return (
    <div className={`container ${showChatBot ? "show-chatbot" : ""}`}>
      <button
        onClick={() => setShowChatBot((prev) => !prev)}
        id="chatbot-toggler"
      >
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>
      <div className="chatbot-popup">
        {/*ChatBot Header  */}
        <div className="chat-header">
          <div className="header-info">
            <ChatBotIcon />
            <h2 className="logo-text">WatchBot</h2>
          </div>
          <button
            onClick={() => setShowChatBot((prev) => !prev)}
            className="material-symbols-rounded"
          >
            arrow_downward
          </button>
        </div>
        {/*ChatBot Body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatBotIcon />
            <p className="message-text">
              Xin chào!!! <br /> Tôi có thể giúp gì được cho bạn?
            </p>
          </div>

          {/* Render the chat history  */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/*ChatBot Footer */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
