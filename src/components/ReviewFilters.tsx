import React, { useEffect, useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { apiService } from '../services/api';

interface ReviewFiltersProps {
  location: string;
  sentiment: string;
  searchQuery: string;
  onLocationChange: (location: string) => void;
  onSentimentChange: (sentiment: string) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
}

const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  location,
  sentiment,
  searchQuery,
  onLocationChange,
  onSentimentChange,
  onSearchChange,
  onClearFilters,
}) => {
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations = await apiService.getLocations();
        setAvailableLocations(locations);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
        // Fallback to empty array
        setAvailableLocations([]);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  const hasActiveFilters = location || sentiment || searchQuery;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <select
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            disabled={loadingLocations}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
          >
            <option value="">{loadingLocations ? 'Loading...' : 'All locations'}</option>
            {availableLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sentiment
          </label>
          <select
            value={sentiment}
            onChange={(e) => onSentimentChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Text
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search reviews..."
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewFilters;