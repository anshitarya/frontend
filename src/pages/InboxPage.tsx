import React, { useState, useEffect, useCallback } from 'react';
import { ReviewsList, Review } from '../types/api';
import { apiService } from '../services/api';
import ReviewFilters from '../components/ReviewFilters';
import ReviewCard from '../components/ReviewCard';
import ReviewDetailModal from '../components/ReviewDetailModal';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const InboxPage: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewsList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  
  // Filter states
  const [location, setLocation] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const loadReviews = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const params: any = { page, page_size: 20 };
      if (location) params.location = location;
      if (sentiment) params.sentiment = sentiment;
      if (searchQuery) params.q = searchQuery;

      const data = await apiService.getReviews(params);
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [location, sentiment, searchQuery]);

  useEffect(() => {
    loadReviews(currentPage);
  }, [location, sentiment, searchQuery, currentPage, loadReviews]);

  const handleClearFilters = () => {
    setLocation('');
    setSentiment('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
  };

  if (error) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-red-50 to-rose-100 rounded-xl border border-red-200">
        <div className="text-red-700 mb-4 text-lg font-medium">⚠️ Error: {error}</div>
        <button
          onClick={() => loadReviews(currentPage)}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          <h1 className="text-3xl font-bold tracking-tight">📥 Review Inbox</h1>
        </div>
        <p className="mt-2 text-gray-600 text-lg">
          Manage and respond to customer reviews with AI-powered insights.
        </p>
        {reviews && (
          <div className="mt-4 inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg px-4 py-2 border border-blue-200">
            <span className="text-blue-700 font-semibold">{reviews.total} reviews found</span>
          </div>
        )}
      </div>
      <ReviewFilters
        location={location}
        sentiment={sentiment}
        searchQuery={searchQuery}
        onLocationChange={setLocation}
        onSentimentChange={setSentiment}
        onSearchChange={setSearchQuery}
        onClearFilters={handleClearFilters}
      />

      {loading ? (
        <div className="flex items-center justify-center py-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
            <span className="text-gray-700 text-lg font-medium">Loading reviews...</span>
          </div>
        </div>
      ) : !reviews?.reviews.length ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No reviews found</div>
          <p className="text-sm text-gray-400">
            Try adjusting your filters or check back later.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {reviews.reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onClick={() => handleReviewClick(review)}
              />
            ))}
          </div>

          {/* Pagination */}
          {reviews.total_pages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === reviews.total_pages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {(currentPage - 1) * 20 + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * 20, reviews.total)}
                    </span>{' '}
                    of <span className="font-medium">{reviews.total}</span> results
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {Array.from({ length: Math.min(5, reviews.total_pages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === page
                              ? 'bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === reviews.total_pages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <ReviewDetailModal
        review={selectedReview}
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    </div>
  );
};

export default InboxPage;