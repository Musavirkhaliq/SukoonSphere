import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import customFetch from '@/utils/customFetch';
import { FaSpinner, FaTrash, FaCheck, FaSearch, FaSort } from 'react-icons/fa';

const UserSuggestions = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            const response = await customFetch.get('/user/suggestions');
            setSuggestions(response.data.suggestions || []);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            toast.error(error.response?.data?.error || 'Failed to fetch suggestions');
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (suggestionId, newStatus) => {
        if (actionLoading) return;
        setActionLoading(true);
        try {
            await customFetch.patch(`/user/suggestions/${suggestionId}/status`, {
                status: newStatus
            });
            setSuggestions(suggestions.map(suggestion =>
                suggestion._id === suggestionId
                    ? { ...suggestion, status: newStatus }
                    : suggestion
            ));
            toast.success('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error(error.response?.data?.error || 'Failed to update status');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (suggestionId) => {
        if (!window.confirm('Are you sure you want to delete this suggestion?')) return;
        if (actionLoading) return;
        setActionLoading(true);
        try {
            await customFetch.delete(`/user/suggestions/${suggestionId}`);
            setSuggestions(suggestions.filter(suggestion => suggestion._id !== suggestionId));
            toast.success('Suggestion deleted successfully');
        } catch (error) {
            console.error('Error deleting suggestion:', error);
            toast.error(error.response?.data?.error || 'Failed to delete suggestion');
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'implemented':
                return 'bg-green-100 text-green-800';
            case 'reviewed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const filteredAndSortedSuggestions = () => {
        let filtered = [...suggestions];

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(s => s.status === statusFilter);
        }

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(s =>
                s.message.toLowerCase().includes(term) ||
                s.user?.name?.toLowerCase().includes(term)
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'status':
                    return a.status.localeCompare(b.status);
                default: // 'newest'
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        return filtered;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
        );
    }

    const filteredSuggestions = filteredAndSortedSuggestions();

    return (
        <div className="max-w-7xl mx-auto md:px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-2 justify-between ">
        <h2 className="text-2xl font-bold text-gray-900">User Suggestions</h2>
        <span className="self-start px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          {filteredSuggestions.length} suggestion{filteredSuggestions.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 md:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search suggestions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition duration-200"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl text-gray-800 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 cursor-pointer hover:bg-gray-100"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="implemented">Implemented</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl text-gray-800 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 cursor-pointer hover:bg-gray-100"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="status">By Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Suggestions List */}
      {filteredSuggestions.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">No suggestions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion._id}
              className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-100 hover:shadow-md transition duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-grow space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-semibold text-gray-900">
                      {suggestion.user?.name || 'Anonymous'}
                    </span>
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {new Date(suggestion.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {suggestion.message}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={suggestion.status}
                      onChange={(e) => handleStatusUpdate(suggestion._id, e.target.value)}
                      className="text-sm border border-gray-200 rounded-lg px-4 py-2 text-gray-800 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 cursor-pointer hover:bg-gray-100 disabled:opacity-50"
                      disabled={actionLoading}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="implemented">Implemented</option>
                    </select>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(
                        suggestion.status
                      )}`}
                    >
                      {suggestion.status.charAt(0).toUpperCase() + suggestion.status.slice(1)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(suggestion._id)}
                  className="p-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition duration-200 group-hover:scale-105 disabled:opacity-50"
                  disabled={actionLoading}
                  title="Delete Suggestion"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    );
};

export default UserSuggestions;
