import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { 
  Review, 
  ReviewsList, 
  SuggestedReply, 
  Analytics, 
  SearchResults 
} from '../types/api';

class ApiService {
  private api: AxiosInstance;
  private apiKey: string = 'dev-api-key-change-me'; // Default for dev

  constructor(baseURL: string = process.env.REACT_APP_API_URL || 'https://review-management-system-x8un.onrender.com/api') {
    // Log the API URL for debugging
    console.log('API Service initialized with baseURL:', baseURL);
    
    this.api = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth header
    this.api.interceptors.request.use((config: any) => {
      if (this.apiKey) {
        config.headers.Authorization = `Bearer ${this.apiKey}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: any) => {
        if (error.response?.data?.detail) {
          throw new Error(error.response.data.detail);
        }
        throw error;
      }
    );
  }

  setApiKey(key: string) {
    this.apiKey = key;
  }

  async getReviews(params: {
    location?: string;
    sentiment?: string;
    q?: string;
    page?: number;
    page_size?: number;
  } = {}): Promise<ReviewsList> {
    const response = await this.api.get('/reviews', { params });
    return response.data;
  }

  async getReview(id: number): Promise<Review> {
    const response = await this.api.get(`/reviews/${id}`);
    return response.data;
  }

  async suggestReply(reviewId: number): Promise<SuggestedReply> {
    const response = await this.api.post(`/reviews/${reviewId}/suggest-reply`);
    return response.data;
  }

  async getAnalytics(): Promise<Analytics> {
    const response = await this.api.get('/analytics');
    return response.data;
  }

  async getLocations(): Promise<string[]> {
    const response = await this.api.get('/locations');
    return response.data;
  }

  async searchSimilarReviews(query: string, k: number = 5): Promise<SearchResults> {
    const response = await this.api.get('/search', {
      params: { q: query, k }
    });
    return response.data;
  }

  async ingestReviews(reviews: Partial<Review>[]): Promise<{ message: string; created_count: number }> {
    const response = await this.api.post('/ingest', { reviews });
    return response.data;
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.api.get('/health');
    return response.data;
  }
}

export const apiService = new ApiService();