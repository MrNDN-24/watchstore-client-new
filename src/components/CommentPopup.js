import React, { useState } from "react";
import { Star } from "lucide-react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full relative z-10 shadow-lg dark:shadow-black/50">
        {children}
      </div>
    </div>
  );
};
export default function CommentPopup({
  isOpen,
  onClose,
  productName,
  onSubmit,
}) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleStarHover = (value) => {
    setHoveredRating(value);
  };

  const handleSubmit = () => {
    onSubmit?.({
      rating,
      comment,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 dark:text-white">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold dark:text-white">
            Viết đánh giá
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Đánh giá {productName}
          </p>
        </div>

        {/* Rating */}
        <div>
          <p className="text-sm mb-2 dark:text-gray-300">Đánh giá của bạn</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                className="text-2xl focus:outline-none"
                onClick={() => handleStarClick(value)}
                onMouseEnter={() => handleStarHover(value)}
                onMouseLeave={() => setHoveredRating(0)}
                aria-label={`${value} star`}
              >
                <Star
                  className={`w-8 h-8 ${
                    value <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400 dark:text-gray-600"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <textarea
            className="w-full p-2 border rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500
              border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-900
              text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={handleSubmit}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </Modal>
  );
}
