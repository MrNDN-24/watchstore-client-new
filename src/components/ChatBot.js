// Import component và stylesheet
import ChatBotIcon from "./ChatBotIcon";
import "../styles/ChatBot.css";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";

// Import hook và service
import { useState, useRef, useEffect } from "react";
import { companyInfo } from "./WatchStoreDetail";
import { getProductChatBot } from "../services/productService";
import { getOrder } from "../services/orderService";
import { getDiscounts } from "../services/discountService.js";
import { fetchUserData } from "../services/userService.js";

//service chat tư vấn
import {
  createConversation,
  closeConversation,
} from "../services/conversationService.js";
import {
  sendMessage,
  getMessagesByConversation,
} from "../services/messageService.js";
import { removeFromQueue } from "../services/supportQueueService.js";
import { jwtDecode } from "jwt-decode";

//Socket.io
import { io } from "socket.io-client";

// Component chính của chatbot
const ChatBot = () => {
  // State quản lý dữ liệu sản phẩm, lịch sử chat và hiển thị
  const [productInfo, setProductInfo] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatBot, setShowChatBot] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [supportStaffId, setSupportStaffId] = useState(null);
  const chatBodyRef = useRef();

  // State để lưu ID cuộc hội thoại đang chat với nhân viên (nếu có)
  const [supportConversationId, setSupportConversationId] = useState(null);
  const [isWaitingForSupport, setIsWaitingForSupport] = useState(false);

  // Socket kết nối
  const socketRef = useRef(null);

  const latestConversationIdRef = useRef(null);

  useEffect(() => {
    latestConversationIdRef.current = supportConversationId;
  }, [supportConversationId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !socketRef.current) {
      const decoded = jwtDecode(token);
      const userId = decoded.userId || decoded._id || decoded.id;
      setCustomerId(userId);
      console.log("Decoded userId:", userId);
      socketRef.current = io("http://localhost:5000");
      socketRef.current.emit("join", userId);

      // Lắng nghe event
      socketRef.current.on(
        "support:assigned",
        ({ message, conversation, staffId }) => {
          console.log("Received support:assigned event", message, conversation);
          setIsWaitingForSupport(false);
          setSupportConversationId(conversation._id);
          setSupportStaffId(staffId);

          // 👇 JOIN thêm vào room conversationId
          socketRef.current.emit("join", conversation._id);
          latestConversationIdRef.current = conversation._id;

          (async () => {
            try {
              const response = await getMessagesByConversation(
                conversation._id
              );
              const messages = response.messages || [];

              const staffMessages = messages.map((msg) => ({
                role: msg.senderRole === "staff" ? "model" : "user",
                text: msg.message,
                isFromStaff: msg.senderRole === "staff",
              }));

              setChatHistory((prev) => [
                ...prev.filter((msg) => !msg.hideInchat),
                ...staffMessages,
                {
                  role: "model",
                  text: "✅ Nhân viên đã vào phòng hỗ trợ. Bạn có thể bắt đầu trò chuyện.",
                },
              ]);
            } catch (error) {
              console.error("Lỗi khi lấy tin nhắn:", error);
            }
          })();
        }
      );
      // ** Lắng nghe event closed **
      socketRef.current.on("conversation:closed", (data) => {
        console.log("Cuộc trò chuyện đã bị đóng:", data);
        setChatHistory((prev) => [
          ...prev,
          {
            role: "model",
            text: "🔴 Cuộc trò chuyện đã kết thúc bởi nhân viên hỗ trợ. Nếu cần, bạn có thể bắt đầu lại hoặc hỏi trợ giúp khác.",
          },
        ]);
        setSupportConversationId(null);
        setIsWaitingForSupport(false);
      });
      socketRef.current.on("receive_message", (message) => {
        console.log("Nhận tin nhắn từ nhân viên:", message);

        // Kiểm tra conversationId khớp không
        if (message.conversationId === latestConversationIdRef.current) {
          // Nếu message gửi bởi chính user hiện tại (khách), đã add rồi, bỏ qua không thêm nữa
          if (message.senderId === userId) {
            console.log("Bỏ qua tin nhắn do chính mình gửi");
            return;
          }

          // Xác định role và isFromStaff cho message
          const isFromStaff = message.senderRole === "staff";

          setChatHistory((prev) => [
            ...prev,
            {
              role: isFromStaff ? "model" : "user",
              text: message.message,
              isFromStaff,
            },
          ]);
        }
      });
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off("receive_message");
    };
  }, []);

  // Gọi API lấy sản phẩm khi mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductChatBot();
        const products = response?.data;
        if (!Array.isArray(products)) return;

        // Format danh sách sản phẩm
        const formatted = products
          .map((p) => {
            const brandName = p.brand_id?.name || "Không rõ hãng";
            const categoryNames =
              p.category_ids?.map((c) => c.name).join(", ") || "Không rõ";
            const styleNames =
              p.style_ids?.map((s) => s.name).join(", ") || "Không rõ";
            return (
              `👉 ${p.name} (${brandName})\n` +
              `💰 Giá: ${
                p.discount_price
                  ? `${p.discount_price}₫ (gốc ${p.price}₫)`
                  : `${p.price}₫`
              }\n` +
              `🏷️ Dành cho: ${p.gender}, Phân loại: ${categoryNames}, Kiểu dáng: ${styleNames}\n` +
              `🎨 Mặt số: ${p.dialColor || "Không rõ"}, Kháng nước: ${
                p.waterResistance || "Không rõ"
              }\n` +
              `⭐ Đánh giá: ${p.product_rating}/5\n`
            );
          })
          .join("\n\n");

        setProductInfo(`\n\n📦 Danh sách sản phẩm nổi bật:\n${formatted}`);
      } catch (error) {
        console.error("Lỗi khi load sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  // Khi có sản phẩm thì push message mở đầu vào lịch sử chat
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

  // Tự động scroll xuống khi có message mới
  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  // Hàm phản hồi tin nhắn của bot
  const generateBotResponse = async (history) => {
    if (isWaitingForSupport) {
      return;
    }
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Đang soạn tin..."),
        { role: "model", text, isError },
      ]);
    };

    const userMessage = history[history.length - 1].text.toLowerCase();

    const token = localStorage.getItem("token");
    let customerId = null;

    if (token) {
      try {
        const decoded = jwtDecode(token);
        customerId = decoded.userId || decoded.id || decoded._id;
      } catch (err) {
        console.error("Token không hợp lệ:", err);
        updateHistory("🔒 Token không hợp lệ. Vui lòng đăng nhập lại.");
        return;
      }
    }

    // === Yêu cầu tư vấn với nhân viên ===
    if (/nhân viên|hỗ trợ viên|tư vấn viên|gặp người thật/i.test(userMessage)) {
      if (!token || !customerId) {
        updateHistory(
          "🔒 Vui lòng đăng nhập để được kết nối với nhân viên hỗ trợ."
        );
        return;
      }

      try {
        if (!supportConversationId) {
          const convoRes = await createConversation(customerId);
          const convoId = convoRes?.conversationId;
          const conversationStatus = convoRes?.status;

          console.log("📥 convoId:", convoId, "status:", conversationStatus);

          if (!convoId) {
            updateHistory(
              "❌ Lỗi khi tạo kết nối với nhân viên. Vui lòng thử lại."
            );
            return;
          }

          setSupportConversationId(convoId);
          //await sendMessage(convoId, userMessage);

          if (conversationStatus === "waiting") {
            setIsWaitingForSupport(true);
            updateHistory(
              "⏳ Bạn đã được đưa vào hàng chờ. Vui lòng đợi nhân viên hỗ trợ."
            );
          } else if (conversationStatus === "active") {
            setIsWaitingForSupport(false); // ✅ đang active thì không cần chờ
            updateHistory("✅ Bạn đang trò chuyện với nhân viên hỗ trợ.");
          } else {
            updateHistory(
              "🤔 Cuộc trò chuyện đang ở trạng thái không xác định."
            );
          }
        } else {
          updateHistory(
            "🔄 Bạn đang được kết nối với nhân viên hỗ trợ, vui lòng chờ phản hồi."
          );
        }
        return;
      } catch (error) {
        console.error("Lỗi khi kết nối với nhân viên:", error);
        updateHistory(
          "⚠️ Lỗi kết nối với nhân viên hỗ trợ, vui lòng thử lại.",
          true
        );
      }
    }

    // === Hủy chờ hỗ trợ ===
    if (
      /hủy chờ|thoát hàng chờ|không cần tư vấn|ngừng chờ/i.test(userMessage)
    ) {
      console.log("==== DEBUG HỦY CHỜ ====");
      console.log("supportConversationId:", supportConversationId);
      console.log("isWaitingForSupport:", isWaitingForSupport);

      if (supportConversationId) {
        try {
          console.log("Bắt đầu removeFromQueue");
          await removeFromQueue(customerId);
          console.log("Đã remove khỏi queue");

          console.log("Bắt đầu closeConversation");
          await closeConversation(supportConversationId);
          console.log("Đã đóng cuộc hội thoại");

          setSupportConversationId(null);
          // setIsWaitingForSupport(false);
          updateHistory("✅ Bạn đã hủy chờ thành công...");
        } catch (error) {
          console.error("Lỗi khi hủy chờ:", error);
          updateHistory("⚠️ Lỗi khi hủy chờ, vui lòng thử lại sau.", true);
        }
      } else {
        console.log("Không vào được if, điều kiện không thỏa.");
        updateHistory(
          "❌ Bạn hiện không ở trong hàng chờ hoặc không có cuộc trò chuyện nào đang hoạt động."
        );
      }
      return;
    }

    // Trả lời nếu người dùng hỏi về mã giảm giá / hạng khách hàng
    const containsDiscountKeyword =
      /(mã giảm giá|voucher|chương trình giảm|ưu đãi|khuyến mãi|rank|hạng khách hàng)/i.test(
        userMessage
      );
    if (containsDiscountKeyword) {
      const token = localStorage.getItem("token");
      if (!token) {
        updateHistory(
          "🔒 Vui lòng đăng nhập để xem các chương trình ưu đãi dành riêng cho bạn."
        );
        return;
      }

      try {
        const profile = await fetchUserData();
        const discountData = await getDiscounts();
        if (!profile || !discountData) {
          updateHistory(
            "⚠️ Không thể lấy thông tin ưu đãi hiện tại. Vui lòng thử lại sau."
          );
          return;
        }

        const rank = profile.rank || "bronze";
        const currentDiscounts = discountData.ongoingDiscounts || [];

        if (currentDiscounts.length === 0) {
          updateHistory(
            `📭 Hiện tại chưa có chương trình nào đang diễn ra cho hạng **${rank.toUpperCase()}**.`
          );
          return;
        }

        const discountList = currentDiscounts
          .map((d, idx) => {
            const formattedValue = d.discountValue
              ? new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(d.discountValue)
              : "?";

            return `🎁 ${idx + 1}. ${
              d.programName
            } - Giảm ${formattedValue} - HSD đến ${new Date(
              d.expirationDate
            ).toLocaleDateString("vi-VN")}`;
          })
          .join("\n");

        updateHistory(
          `🌟 Hạng của bạn: **${rank.toUpperCase()}**\n\nCác chương trình đang diễn ra:\n${discountList}`
        );
        return;
      } catch (err) {
        updateHistory("🚨 Có lỗi khi lấy dữ liệu chương trình giảm giá.", true);
        return;
      }
    }

    // Trả lời nếu người dùng hỏi về đơn hàng
    const isOrderDetailQuery = /đơn\s*#?(\d+)/i.exec(userMessage);
    const containsOrderKeyword =
      /(đơn hàng|order|mua hàng|vận chuyển|giao hàng|trạng thái)/i.test(
        userMessage
      );
    if (containsOrderKeyword || isOrderDetailQuery) {
      const token = localStorage.getItem("token");
      if (!token) {
        updateHistory(
          "🛑 Bạn cần đăng nhập để xem thông tin đơn hàng của mình."
        );
        return;
      }

      try {
        const orderData = await getOrder();
        const orders = orderData?.orders || [];

        if (orders.length === 0) {
          updateHistory("📭 Bạn chưa có đơn hàng nào trong hệ thống.");
          return;
        }

        // Lọc đơn theo trạng thái nếu có
        const filtered = orders.filter((order) => {
          if (userMessage.includes("đã giao"))
            return order.deliveryStatus === "Đã giao";
          if (
            userMessage.includes("đang giao") ||
            userMessage.includes("đang vận chuyển")
          )
            return order.deliveryStatus === "Đang vận chuyển";
          if (userMessage.includes("đã xác nhận"))
            return order.deliveryStatus === "Đã xác nhận";
          if (userMessage.includes("chờ xử lý"))
            return order.deliveryStatus === "Chờ xử lý";
          if (userMessage.includes("đã hủy"))
            return order.deliveryStatus === "Đã hủy";
          return true;
        });

        // Nếu hỏi chi tiết đơn hàng cụ thể
        if (isOrderDetailQuery) {
          const index = parseInt(isOrderDetailQuery[1]) - 1;
          const hasFilteredStatus = [
            "đã giao",
            "đang giao",
            "đã xác nhận",
            "chờ xử lý",
            "đã hủy",
          ].some((k) => userMessage.includes(k));
          const sourceOrders = hasFilteredStatus ? filtered : orders;

          if (index >= 0 && index < sourceOrders.length) {
            const order = sourceOrders[index];
            const date = new Date(order.createdAt).toLocaleDateString("vi-VN");
            const total = order.total_price?.toLocaleString("vi-VN") || "0";
            const status = order.deliveryStatus || "Chưa cập nhật";

            const details = order.products?.length
              ? order.products
                  .map((item, i) => {
                    const name = item.product_id?.name || "Sản phẩm không rõ";
                    const qty = item.quantity || 0;
                    const priceAfterDiscount =
                      item.discounted_Price ||
                      item.price ||
                      item.product_id?.discounted_Price ||
                      item.product_id?.price ||
                      0;
                    const priceFormatted =
                      priceAfterDiscount.toLocaleString("vi-VN");

                    return `🛒 ${
                      i + 1
                    }. ${name} - Số lượng: ${qty} - Giá: ${priceFormatted}₫`;
                  })
                  .join("\n")
              : "Không có chi tiết đơn hàng.";

            updateHistory(
              `📄 Chi tiết đơn hàng #${
                index + 1
              }:\n📅 Ngày: ${date}\n💰 Tổng: ${total}₫\n🚚 Trạng thái: ${status}\n\n${details}`
            );
            return;
          } else {
            updateHistory("❌ Không tìm thấy đơn hàng với số thứ tự đó.");
            return;
          }
        }

        // Nếu không chỉ định đơn, trả về danh sách đơn hàng
        const formattedOrders = filtered.map((order, idx) => {
          const date = new Date(order.createdAt).toLocaleDateString("vi-VN");
          const total = order.total_price?.toLocaleString("vi-VN") || "0";
          const status = order.deliveryStatus || "Chưa cập nhật";

          return `📦 Đơn #${
            idx + 1
          } - Ngày: ${date}\n💰 Tổng: ${total}₫ - 🚚 Trạng thái: ${status}`;
        });

        updateHistory(
          `🧾 Đây là các đơn hàng của bạn:\n\n${formattedOrders.join("\n\n")}`
        );
        return;
      } catch (err) {
        updateHistory("⚠️ Có lỗi xảy ra khi truy xuất đơn hàng.", true);
        return;
      }
    }

    // Nếu không phải các loại trên → gọi API AI Gemini trả lời
    try {
      const mappedHistory = history.map(({ role, text }) => ({
        role,
        parts: [{ text }],
      }));

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: mappedHistory }),
      };

      const response = await fetch(
        process.env.REACT_APP_CHAT_BOT_AI_GEMINI,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message || "Có lỗi xảy ra!");

      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };
  // Có thể bổ sung hàm đóng cuộc hội thoại khi đóng chatbot hoặc kết thúc
  const closeSupportConversation = async () => {
    if (supportConversationId) {
      await closeConversation(supportConversationId);
      await removeFromQueue(supportConversationId);
      setSupportConversationId(null);
    }
  };

  // Bổ sung gọi closeSupportConversation khi tắt chatbot
  const toggleChatBot = () => {
    if (showChatBot) {
      closeSupportConversation();
    }
    setShowChatBot((prev) => !prev);
  };
  // Giao diện chính chatbot
  return (
    <div className={`container ${showChatBot ? "show-chatbot" : ""}`}>
      {/* <button
        onClick={() => setShowChatBot((prev) => !prev)}
        id="chatbot-toggler"
      >
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button> */}
      <button
        // onClick={() => setShowChatBot((prev) => !prev)}
        onClick={toggleChatBot}
        id="chatbot-toggler"
      >
        {showChatBot ? (
          <span className="material-symbols-rounded">close</span>
        ) : (
          <ChatBotIcon />
        )}
      </button>
      <div className="chatbot-popup">
        {/* Header */}
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

        {/* Body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatBotIcon />
            <p className="message-text">
              Xin chào! <br /> Tôi có thể giúp gì được cho bạn?
            </p>
          </div>
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Footer */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
            supportConversationId={supportConversationId}
            sendMessage={sendMessage}
            customerId={customerId}
            supportStaffId={supportStaffId}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
