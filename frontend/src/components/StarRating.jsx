import { Star } from 'lucide-react';
import { useState } from 'react';

export const StarRating = ({
  rating = 0,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  showValue = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayRating;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={`
                ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                transition-transform duration-100
                focus:outline-none
              `}
            >
              <Star
                className={`
                  ${sizes[size]}
                  ${isFilled ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-slate-300'}
                  transition-colors duration-100
                `}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="ml-2 text-sm font-medium text-slate-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export const RatingInput = ({ label, value, onChange, required }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      <StarRating
        rating={value}
        interactive
        onChange={onChange}
        size="lg"
      />
    </div>
  );
};
