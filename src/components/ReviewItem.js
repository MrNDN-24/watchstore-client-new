import React from "react";
import { useEffect, useState } from "react";
import userAvatarImg from "../assets/user_avatar.jpg";
const ReviewItem = ({ review }) => {
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // console.log("Review:", review);
        // const data = await getReviewById(review_id);
        // SetReview(data);
        // console.log("Review:", data.review.user_id);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row">
        <div className="order-2 mt-6 sm:ml-16 sm:mt-0">
          <div className="mt-3 space-y-6 text-base text-gray-600">
            <p>{review?.comment}</p>
          </div>
        </div>

        <div className="order-1 flex items-center sm:flex-col sm:items-center">
          <img
            src={review?.user_id.avatar || userAvatarImg}
            alt={review?.user_id.username}
            className="h-12 w-12 rounded-full"
          />

          <div className="ml-4 sm:ml-0 sm:mt-4">
            <p className="text-sm font-medium text-gray-900">
              {review?.user_id.username}
            </p>
            <div className="mt-2 flex items-center">
              {/* <!-- Active: "text-gray-900", Default: "text-gray-200" --> */}
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`h-5 w-5 flex-shrink-0 ${
                    index < review?.rating ? "text-yellow-500" : "text-gray-200"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    // fill-rule="evenodd"
                    d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                    // clip-rule="evenodd"
                  />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
