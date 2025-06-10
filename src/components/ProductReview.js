import { React, useEffect, useState } from "react";
import { getProductReviews } from "../services/reviewService";
import ReviewItem from "./ReviewItem";
import Pagination from "./Pagination";

const ProductReview = (product_id) => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1); // Tổng số trang
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        console.log("Fetching reviews for product ID:", product_id.productId);
        setLoading(true);
        const data = await getProductReviews(
          currentPage,
          5,
          product_id.productId
        );
        setReviews(data.data.content);
        setPageSize(data.data.pagination.pageSize);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [currentPage, product_id]);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 rounded-xl ">
      <section
        aria-labelledby="reviews-heading"
        className="border-t border-gray-200 dark:border-gray-700 pt-10 lg:pt-16"
      >
        <h2
          id="reviews-heading"
          className="font-extrabold text-2xl text-gray-900 dark:text-white"
        >
          Đánh giá sản phẩm
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <span className="text-gray-500 dark:text-gray-300">
              Đang tải đánh giá...
            </span>
          </div>
        ) : (
          <div>
            {reviews.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-300 py-8">
                Hiện chưa có đánh giá cho sản phẩm này
              </div>
            ) : (
              <div>
                <div className="space-y-10">
                  {reviews.map((review, index) => (
                    <ReviewItem key={index} review={review} />
                  ))}
                </div>
                <div className="mt-8">
                  <Pagination
                    totalPages={pageSize}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductReview;
