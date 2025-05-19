import { React, useEffect, useState } from "react";
import { getProductReviews } from "../services/reviewService";
import ReviewItem from "./ReviewItem";

import Pagination from "./Pagination";

const ProductReview = (product_id) => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1); // Số trang tổng cộng
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // console.log("Start Loading", isLoading);
        // console.log("Review id", product_id.product_id);
        const data = await getProductReviews(
          currentPage,
          5,
          product_id.product_id
        );
        // console.log("Review data", data);
        setReviews(data.data.content);
        setPageSize(data.data.pagination.pageSize);
        // console.log("Page size:", pageSize);
        const reviewsArray = Array.isArray(reviews) ? reviews : [];
        reviewsArray.map((review) => {
          // Xử lý từng review
        });
        // setReviews(review_list.review);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false); // Kết thúc trạng thái loading
        // console.log("Loading complete", isLoading);
      }
    };
    fetchReviews();
  }, [currentPage, product_id]);
  return (
    <div>
      <section
        aria-labelledby="reviews-heading"
        className="border-t border-gray-200 pt-10 lg:pt-16"
      >
        <h2 id="reviews-heading" className="font-extrabold">
          Đánh giá sản phẩm
        </h2>
        {isLoading ? ( // Hiển thị khi loading
          <div className="flex justify-center items-center">
            <span className="text-gray-500">Loading reviews...</span>
          </div>
        ) : (
          <div>
            {reviews.length === 0 ? ( // Kiểm tra nếu không có đánh giá
              <div className="text-center text-gray-500">
                Hiện chưa có đánh giá cho sản phẩm này
              </div>
            ) : (
              <div>
                <div className="space-y-10">
                  {reviews.map((review, index) => (
                    <ReviewItem key={index} review={review} />
                  ))}
                </div>
                <Pagination
                  totalPages={pageSize}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                />
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductReview;
