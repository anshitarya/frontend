export interface Review {
  id: number;
  location: string;
  rating: number;
  text: string;
  date: string;
  sentiment?: string;
  topic?: string;
}

export interface ReviewsList {
  reviews: Review[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface SuggestedReply {
  reply: string;
  tags: {
    sentiment: string;
    topic: string;
  };
  reasoning_log: string;
}

export interface Analytics {
  sentiment_counts: { [key: string]: number };
  topic_counts: { [key: string]: number };
  total_reviews: number;
  avg_rating: number;
}

export interface SimilarReview {
  id: number;
  text: string;
  location: string;
  rating: number;
  similarity_score: number;
}

export interface SearchResults {
  results: SimilarReview[];
  query: string;
}

export interface ApiError {
  detail: string;
}