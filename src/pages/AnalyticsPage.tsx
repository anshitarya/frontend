import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Analytics } from '../types/api';
import { apiService } from '../services/api';
import { Loader2, TrendingUp, MessageSquare, Star } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiService.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const SENTIMENT_COLORS = {
    positive: '#22c55e',
    neutral: '#eab308',
    negative: '#ef4444'
  };

  const TOPIC_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#f97316', '#ec4899', '#6366f1', '#84cc16'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button
          onClick={loadAnalytics}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!analytics) return null;

  const sentimentData = Object.entries(analytics.sentiment_counts).map(([sentiment, count]) => ({
    sentiment: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
    count,
    color: SENTIMENT_COLORS[sentiment as keyof typeof SENTIMENT_COLORS] || '#6b7280'
  }));

  const topicData = Object.entries(analytics.topic_counts).map(([topic, count], index) => ({
    topic: topic.charAt(0).toUpperCase() + topic.slice(1),
    count,
    color: TOPIC_COLORS[index % TOPIC_COLORS.length]
  }));

  return (
    <div className="space-y-8">
      <div className="text-center sm:text-left">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          <h1 className="text-3xl font-bold tracking-tight">📊 Analytics Dashboard</h1>
        </div>
        <p className="mt-2 text-gray-600 text-lg">
          Comprehensive insights into your customer feedback and review trends.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Reviews</p>
              <p className="text-3xl font-bold">{analytics.total_reviews}</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <MessageSquare className="h-8 w-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Average Rating</p>
              <p className="text-3xl font-bold">{analytics.avg_rating ? analytics.avg_rating.toFixed(1) : '0'}/5</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <Star className="h-8 w-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Positive Reviews</p>
              <p className="text-3xl font-bold">{analytics.sentiment_counts.positive || 0}</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <TrendingUp className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sentiment Distribution */}
        <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-xl border border-blue-100/50 p-8 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            📊 Sentiment Distribution
          </h3>
          <div className="bg-white/50 rounded-xl p-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="sentiment" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Bar dataKey="count" fill="url(#sentimentGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic Distribution */}
        <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-2xl shadow-xl border border-purple-100/50 p-8 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            🏷️ Topics Distribution
          </h3>
          <div className="bg-white/50 rounded-xl p-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topicData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.topic} ${((entry.percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {topicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Sentiment Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sentiment Breakdown</h3>
          <div className="space-y-3">
            {sentimentData.map((item) => (
              <div key={item.sentiment} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded mr-3" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{item.sentiment}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">{item.count} reviews</span>
                  <span className="text-sm font-medium text-gray-900">
                    {((item.count / analytics.total_reviews) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Topic Breakdown</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {topicData.map((item) => (
              <div key={item.topic} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded mr-3" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{item.topic}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">{item.count} reviews</span>
                  <span className="text-sm font-medium text-gray-900">
                    {((item.count / analytics.total_reviews) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;