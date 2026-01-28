import React, { useState } from 'react';
import { Search, ExternalLink, Loader2 } from 'lucide-react';
import { SearchResults, SimilarReview } from '../types/api';
import { apiService } from '../services/api';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const searchResults = await apiService.searchSimilarReviews(query, 10);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getRatingStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Similar Reviews Search</h1>
          <p className="mt-2 text-sm text-gray-700">
            Find reviews similar to your query using AI-powered semantic search.
          </p>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <form onSubmit={handleSearch}>
          <div className="flex">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter search query (e.g., 'slow service', 'great food', 'parking issues')..."
                className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="ml-3 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </button>
          </div>
        </form>

        {query && (
          <div className="mt-4 text-sm text-gray-600">
            <p>
              <strong>How it works:</strong> Our AI analyzes the semantic meaning of your query 
              and finds reviews with similar themes, topics, and sentiment patterns using 
              TF-IDF vectorization and cosine similarity.
            </p>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Search Results for "{results.query}"
            </h3>
            <span className="text-sm text-gray-600">
              {results.results.length} similar reviews found
            </span>
          </div>

          {results.results.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No similar reviews found</p>
              <p className="text-sm mt-2">
                Try adjusting your search terms or using different keywords.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.results.map((review: SimilarReview, index: number) => (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          Review #{review.id}
                        </span>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className="text-sm text-gray-600">{review.location}</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-yellow-600">
                            {getRatingStars(review.rating)} ({review.rating}/5)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getSimilarityColor(
                          review.similarity_score
                        )}`}
                      >
                        {(review.similarity_score * 100).toFixed(1)}% match
                      </span>
                      <button
                        onClick={() => {
                          // In a real app, this would navigate to the review detail
                          window.open(`#/review/${review.id}`, '_blank');
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View full review"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {!results && !loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">
            How to use Semantic Search
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Enter keywords or phrases describing what you're looking for</li>
            <li>• The AI will find reviews with similar meaning, not just exact word matches</li>
            <li>• Try queries like "poor customer service", "food quality issues", or "great atmosphere"</li>
            <li>• Results are ranked by similarity score (higher = more similar)</li>
            <li>• Use this to identify patterns and common themes across reviews</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchPage;