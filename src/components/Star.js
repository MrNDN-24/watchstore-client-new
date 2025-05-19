import { Star } from "lucide-react";

const RatingStars = ({ stars }) => {
  const totalStars = 5;

  const renderStars = () => {
    const starsArray = [];
    const fullStars = Math.floor(stars);
    const hasHalfStar = stars % 1 !== 0;

    // Thêm các sao đầy đủ
    for (let i = 0; i < fullStars; i++) {
      starsArray.push(
        <Star
          key={`full-${i}`}
          className="w-5 h-5 text-yellow-400 fill-yellow-400"
        />
      );
    }

    // Thêm nửa sao nếu có
    if (hasHalfStar) {
      starsArray.push(
        <div key="half" className="relative w-5 h-5">
          <Star className="absolute w-5 h-5 text-gray-300" />
          <div className="absolute w-[10px] h-5 overflow-hidden">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      );
    }

    // Thêm các sao còn lại (không được fill)
    const remainingStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      starsArray.push(
        <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
      );
    }

    return starsArray;
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">{renderStars()}</div>
      <span className="text-sm font-medium text-gray-600">
        ({stars?.toFixed(1)})
      </span>
    </div>
  );
};

export default RatingStars;
