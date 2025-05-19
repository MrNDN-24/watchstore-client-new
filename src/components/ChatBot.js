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

// Component chính của chatbot
const ChatBot = () => {
  // State quản lý dữ liệu sản phẩm, lịch sử chat và hiển thị
  const [productInfo, setProductInfo] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatBot, setShowChatBot] = useState(false);
  const chatBodyRef = useRef();

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
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Đang soạn tin..."),
        { role: "model", text, isError },
      ]);
    };

    const userMessage = history[history.length - 1].text.toLowerCase();

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

  // Giao diện chính chatbot
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
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBot;

// import ChatBotIcon from "./ChatBotIcon";
// import "../styles/ChatBot.css";
// import ChatForm from "./ChatForm";
// import ChatMessage from "./ChatMessage";
// import { useState, useRef, useEffect } from "react";
// import { companyInfo } from "./WatchStoreDetail";
// import { getProductChatBot } from "../services/productService";
// import { getOrder } from "../services/orderService"; // Đảm bảo đường dẫn đúng
// import { getDiscounts } from "../services/discountService.js";
// import { fetchUserData } from "../services/userService.js";

// const ChatBot = () => {
//   const [productInfo, setProductInfo] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const [showChatBot, setShowChatBot] = useState(false);
//   const chatBodyRef = useRef();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await getProductChatBot();
//         const products = response?.data;

//         if (!Array.isArray(products)) return;

//         const formatted = products
//           .map((p) => {
//             const brandName = p.brand_id?.name || "Không rõ hãng";
//             const categoryNames =
//               p.category_ids?.map((c) => c.name).join(", ") || "Không rõ";
//             const styleNames =
//               p.style_ids?.map((s) => s.name).join(", ") || "Không rõ";
//             return (
//               `👉 ${p.name} (${brandName})\n` +
//               `💰 Giá: ${
//                 p.discount_price
//                   ? `${p.discount_price}₫ (gốc ${p.price}₫)`
//                   : `${p.price}₫`
//               }\n` +
//               `🏷️ Dành cho: ${p.gender}, Phân loại: ${categoryNames}, Kiểu dáng: ${styleNames}\n` +
//               `🎨 Mặt số: ${p.dialColor || "Không rõ"}, Kháng nước: ${
//                 p.waterResistance || "Không rõ"
//               }\n` +
//               `⭐ Đánh giá: ${p.product_rating}/5\n`
//             );
//           })
//           .join("\n\n");

//         setProductInfo(`\n\n📦 Danh sách sản phẩm nổi bật:\n${formatted}`);
//       } catch (error) {
//         console.error("Lỗi khi load sản phẩm:", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     if (productInfo) {
//       setChatHistory([
//         {
//           hideInchat: true,
//           role: "model",
//           text: companyInfo + productInfo,
//         },
//       ]);
//     }
//   }, [productInfo]);

//   useEffect(() => {
//     chatBodyRef.current?.scrollTo({
//       top: chatBodyRef.current.scrollHeight,
//       behavior: "smooth",
//     });
//   }, [chatHistory]);

//   const generateBotResponse = async (history) => {
//     const updateHistory = (text, isError = false) => {
//       setChatHistory((prev) => [
//         ...prev.filter((msg) => msg.text !== "Đang soạn tin..."),
//         { role: "model", text, isError },
//       ]);
//     };

//     const userMessage = history[history.length - 1].text.toLowerCase();

//     const containsDiscountKeyword =
//       /(mã giảm giá|voucher|chương trình giảm|ưu đãi|khuyến mãi|rank|hạng khách hàng)/i.test(
//         userMessage
//       );

//     if (containsDiscountKeyword) {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         updateHistory(
//           "🔒 Vui lòng đăng nhập để xem các chương trình ưu đãi dành riêng cho bạn."
//         );
//         return;
//       }

//       try {
//         const profile = await fetchUserData();
//         const discountData = await getDiscounts();

//         if (!profile || !discountData) {
//           updateHistory(
//             "⚠️ Không thể lấy thông tin ưu đãi hiện tại. Vui lòng thử lại sau."
//           );
//           return;
//         }

//         const rank = profile.rank || "bronze";
//         const currentDiscounts = discountData.ongoingDiscounts || [];

//         if (currentDiscounts.length === 0) {
//           updateHistory(
//             `📭 Hiện tại chưa có chương trình nào đang diễn ra cho hạng **${rank.toUpperCase()}**.`
//           );
//           return;
//         }

//         const discountList = currentDiscounts
//           .map((d, idx) => {
//             const formattedValue = d.discountValue
//               ? new Intl.NumberFormat("vi-VN", {
//                   style: "currency",
//                   currency: "VND",
//                 }).format(d.discountValue)
//               : "?";

//             return `🎁 ${idx + 1}. ${
//               d.programName
//             } - Giảm ${formattedValue} - HSD đến ${new Date(
//               d.expirationDate
//             ).toLocaleDateString("vi-VN")}`;
//           })
//           .join("\n");

//         updateHistory(
//           `🌟 Hạng của bạn: **${rank.toUpperCase()}**\n\nCác chương trình đang diễn ra:\n${discountList}`
//         );
//         return;
//       } catch (err) {
//         updateHistory("🚨 Có lỗi khi lấy dữ liệu chương trình giảm giá.", true);
//         return;
//       }
//     }
//     const isOrderDetailQuery = /đơn\s*#?(\d+)/i.exec(userMessage);
//     const containsOrderKeyword =
//       /(đơn hàng|order|mua hàng|vận chuyển|giao hàng|trạng thái)/i.test(
//         userMessage
//       );

//     if (containsOrderKeyword || isOrderDetailQuery) {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         updateHistory(
//           "🛑 Bạn cần đăng nhập để xem thông tin đơn hàng của mình."
//         );
//         return;
//       }

//       try {
//         const orderData = await getOrder();
//         const orders = orderData?.orders || [];

//         if (orders.length === 0) {
//           updateHistory("📭 Bạn chưa có đơn hàng nào trong hệ thống.");
//           return;
//         }

//         // Nếu chỉ yêu cầu danh sách đơn hàng đã giao chẳng hạn
//         const filtered = orders.filter((order) => {
//           if (userMessage.includes("đã giao")) {
//             return order.deliveryStatus === "Đã giao";
//           } else if (
//             userMessage.includes("đang giao") ||
//             userMessage.includes("đang vận chuyển")
//           ) {
//             return order.deliveryStatus === "Đang vận chuyển";
//           } else if (userMessage.includes("đã xác nhận")) {
//             return order.deliveryStatus === "Đã xác nhận";
//           } else if (userMessage.includes("chờ xử lý")) {
//             return order.deliveryStatus === "Chờ xử lý";
//           } else if (userMessage.includes("đã hủy")) {
//             return order.deliveryStatus === "Đã hủy";
//           }
//           // Nếu không yêu cầu trạng thái cụ thể, trả về tất cả đơn hàng
//           return true;
//         });

//         // 👉 Nếu người dùng hỏi chi tiết đơn hàng #n
//         if (isOrderDetailQuery) {
//           const index = parseInt(isOrderDetailQuery[1]) - 1;

//           const hasFilteredStatus =
//             userMessage.includes("đã giao") ||
//             userMessage.includes("đang giao") ||
//             userMessage.includes("đã xác nhận") ||
//             userMessage.includes("chờ xử lý") ||
//             userMessage.includes("đã hủy");

//           const sourceOrders = hasFilteredStatus ? filtered : orders;

//           if (index >= 0 && index < sourceOrders.length) {
//             const order = sourceOrders[index];
//             const date = new Date(order.createdAt).toLocaleDateString("vi-VN");
//             const total = order.total_price?.toLocaleString("vi-VN") || "0";
//             const status = order.deliveryStatus || "Chưa cập nhật";

//             const details = order.products?.length
//               ? order.products
//                   .map((item, i) => {
//                     const name = item.product_id?.name || "Sản phẩm không rõ";
//                     const qty = item.quantity || 0;

//                     // Giả sử có giá sau giảm trong item.price hoặc item.discountedPrice
//                     const priceAfterDiscount =
//                       item.discounted_Price ||
//                       item.price ||
//                       item.product_id?.discounted_Price ||
//                       item.product_id?.price ||
//                       0;

//                     const priceFormatted =
//                       priceAfterDiscount.toLocaleString("vi-VN");

//                     return `🛒 ${
//                       i + 1
//                     }. ${name} - Số lượng: ${qty} - Giá: ${priceFormatted}₫`;
//                   })
//                   .join("\n")
//               : "Không có chi tiết đơn hàng.";
//             updateHistory(
//               `📄 Chi tiết đơn hàng #${
//                 index + 1
//               }:\n📅 Ngày: ${date}\n💰 Tổng: ${total}₫\n🚚 Trạng thái: ${status}\n\n${details}`
//             );
//             return;
//           } else {
//             updateHistory("❌ Không tìm thấy đơn hàng với số thứ tự đó.");
//             return;
//           }
//         }

//         const formattedOrders = filtered.map((order, idx) => {
//           const date = new Date(order.createdAt).toLocaleDateString("vi-VN");
//           const total = order.total_price?.toLocaleString("vi-VN") || "0";
//           const status = order.deliveryStatus || "Chưa cập nhật";

//           return `📦 Đơn #${
//             idx + 1
//           } - Ngày: ${date}\n💰 Tổng: ${total}₫ - 🚚 Trạng thái: ${status}`;
//         });

//         updateHistory(
//           `🧾 Đây là các đơn hàng của bạn:\n\n${formattedOrders.join("\n\n")}`
//         );
//         return;
//       } catch (err) {
//         updateHistory("⚠️ Có lỗi xảy ra khi truy xuất đơn hàng.", true);
//         return;
//       }
//     }

//     // Nếu không liên quan đến đơn hàng → gọi AI
//     try {
//       const mappedHistory = history.map(({ role, text }) => ({
//         role,
//         parts: [{ text }],
//       }));

//       const requestOptions = {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ contents: mappedHistory }),
//       };

//       const response = await fetch(
//         process.env.REACT_APP_CHAT_BOT_AI_GEMINI,
//         requestOptions
//       );
//       const data = await response.json();

//       if (!response.ok) throw new Error(data.error.message || "Có lỗi xảy ra!");

//       const apiResponseText = data.candidates[0].content.parts[0].text
//         .replace(/\*\*(.*?)\*\*/g, "$1")
//         .trim();

//       updateHistory(apiResponseText);
//     } catch (error) {
//       updateHistory(error.message, true);
//     }
//   };

//   return (
//     <div className={`container ${showChatBot ? "show-chatbot" : ""}`}>
//       <button
//         onClick={() => setShowChatBot((prev) => !prev)}
//         id="chatbot-toggler"
//       >
//         <span className="material-symbols-rounded">mode_comment</span>
//         <span className="material-symbols-rounded">close</span>
//       </button>

//       <div className="chatbot-popup">
//         {/* Header */}
//         <div className="chat-header">
//           <div className="header-info">
//             <ChatBotIcon />
//             <h2 className="logo-text">WatchBot</h2>
//           </div>
//           <button
//             onClick={() => setShowChatBot((prev) => !prev)}
//             className="material-symbols-rounded"
//           >
//             arrow_downward
//           </button>
//         </div>

//         {/* Body */}
//         <div ref={chatBodyRef} className="chat-body">
//           <div className="message bot-message">
//             <ChatBotIcon />
//             <p className="message-text">
//               Xin chào!!! <br /> Tôi có thể giúp gì được cho bạn?
//             </p>
//           </div>

//           {chatHistory.map((chat, index) => (
//             <ChatMessage key={index} chat={chat} />
//           ))}
//         </div>

//         {/* Footer */}
//         <div className="chat-footer">
//           <ChatForm
//             chatHistory={chatHistory}
//             setChatHistory={setChatHistory}
//             generateBotResponse={generateBotResponse}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatBot;
