import React from 'react';
import { Review } from '../types/api';
import { Star, MapPin, Calendar } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
  onClick: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onClick }) => {
  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200';
      case 'negative':
        return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200';
      case 'neutral':
        return 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-200';
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div
      className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl shadow-lg border border-blue-100/50 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer backdrop-blur-sm"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
            #{review.id}
          </div>
          <div className="flex items-center bg-white/60 rounded-lg px-2 py-1">
            <MapPin className="h-3 w-3 text-blue-600 mr-1" />
            <span className="text-sm text-gray-700 font-medium">{review.location}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {review.sentiment && (
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getSentimentColor(review.sentiment)}`}>
              {review.sentiment}
            </span>
          )}
          {review.topic && (
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200">
              {review.topic}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center mb-3 bg-white/40 rounded-lg p-2">
        <div className="flex mr-2">{getRatingStars(review.rating)}</div>
        <span className="text-sm text-gray-700 font-medium">({review.rating}/5)</span>
      </div>

      <div className="bg-white/50 rounded-lg p-3 mb-3">
        <p className="text-gray-800 text-sm leading-relaxed line-clamp-2">{review.text}</p>
      </div>

      <div className="flex items-center text-xs text-gray-600 bg-white/30 rounded-lg px-2 py-1 w-fit">
        <Calendar className="h-3 w-3 mr-1 text-blue-600" />
        {new Date(review.date).toLocaleDateString()}
      </div>
    </div>
  );
};

export default ReviewCard;