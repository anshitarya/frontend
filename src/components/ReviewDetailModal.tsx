import React, { useState, useEffect } from 'react';
import { X, Star, Copy, RefreshCw, MapPin, Calendar, Sparkles } from 'lucide-react';
import { Review, SuggestedReply } from '../types/api';
import { apiService } from '../services/api';

interface ReviewDetailModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({
  review,
  isOpen,
  onClose,
}) => {
  const [suggestedReply, setSuggestedReply] = useState<SuggestedReply | null>(null);
  const [loadingReply, setLoadingReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (suggestedReply) {
      setReplyText(suggestedReply.reply);
    }
  }, [suggestedReply]);

  const handleSuggestReply = async () => {
    if (!review) return;

    setLoadingReply(true);
    try {
      const reply = await apiService.suggestReply(review.id);
      setSuggestedReply(reply);
      setReplyText(reply.reply);
    } catch (error) {
      console.error('Error getting suggested reply:', error);
    } finally {
      setLoadingReply(false);
    }
  };

  const handleCopyReply = () => {
    navigator.clipboard.writeText(replyText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      case 'neutral':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!isOpen || !review) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Review #{review.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Review Details */}
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm font-medium">{review.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-600">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <div className="flex mr-3">{getRatingStars(review.rating)}</div>
                <span className="text-lg font-medium">({review.rating}/5)</span>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                {review.sentiment && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(
                      review.sentiment
                    )}`}
                  >
                    {review.sentiment}
                  </span>
                )}
                {review.topic && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {review.topic}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Review Text</h3>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {review.text}
                </p>
              </div>
            </div>

            {/* Suggested Reply */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Suggested Reply</h3>
                <button
                  onClick={handleSuggestReply}
                  disabled={loadingReply}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loadingReply ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span>
                    {suggestedReply ? 'Regenerate' : 'Generate Reply'}
                  </span>
                </button>
              </div>

              {suggestedReply && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      AI-Generated Reply
                    </label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={6}
                      className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <p className="mb-1">
                        <strong>Reasoning:</strong> {suggestedReply.reasoning_log}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span>Tags:</span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {suggestedReply.tags.sentiment}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {suggestedReply.tags.topic}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyReply}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Copy className="h-4 w-4" />
                    <span>{copySuccess ? 'Copied!' : 'Copy Reply'}</span>
                  </button>
                </div>
              )}

              {loadingReply && (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-indigo-600" />
                  <span className="ml-2 text-gray-600">
                    Generating AI response...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailModal;