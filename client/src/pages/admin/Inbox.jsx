import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import customFetch from '@/utils/customFetch';
import { FaCheck, FaTimes, FaSpinner, FaSearch } from 'react-icons/fa';

const Inbox = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('name'); // 'name' or 'email'

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await customFetch.get('/user/contributor-requests');
            setRequests(response.data.requests);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id) => {
        try {
            await customFetch.patch(`/user/accept-contributor/${id}`);
            toast.success('Request accepted successfully');
            fetchRequests(); // Refresh the list
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to accept request');
        }
    };

    const handleReject = async (id) => {
        try {
            await customFetch.delete(`/user/contributor-request/${id}`);
            toast.success('removed from requests');
            fetchRequests(); // Refresh the list
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to reject request');
        }
    };

    const filteredRequests = () => {
        if (!searchTerm) return requests;

        const term = searchTerm.toLowerCase();
        return requests.filter(request => {
            if (searchBy === 'name') {
                return request.fullname.toLowerCase().includes(term);
            } else {
                return request.email.toLowerCase().includes(term);
            }
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <FaSpinner className="animate-spin text-4xl text-[var(--primary)]" />
            </div>
        );
    }

    const displayedRequests = filteredRequests();

    return (
        <div className="max-w-7xl mx-auto">
        <div className="space-y-6 md:p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Contributor Requests
            </h2>
            <span className="self-start px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              {displayedRequests.length} Request{displayedRequests.length !== 1 ? 's' : ''}
            </span>
          </div>
  
          {/* Search Section */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search by ${searchBy}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-gray-400"
              />
            </div>
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 cursor-pointer hover:bg-gray-50"
            >
              <option value="name">Search by Name</option>
              <option value="email">Search by Email</option>
            </select>
          </div>
  
          {/* Results Section */}
          {displayedRequests.length === 0 ? (
            <div className="text-center py-16 px-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No matching requests found' : 'No pending requests'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {displayedRequests.map((request) => (
                <div
                  key={request._id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-md p-6 border border-gray-100 hover:border-blue-100 transition duration-200"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1 min-w-0 space-y-3">
                      <h3 className="text-xl font-semibold text-gray-900 break-words">
                        {request.fullname}
                      </h3>
                      <p className="text-gray-600 break-words">{request.email}</p>
                      <p className="text-gray-700 leading-relaxed break-words">
                        {request.message}
                      </p>
                    </div>
                    <div className="flex sm:flex-col gap-3 self-start">
                      {request.status === 'pending' && (
                        <button
                          onClick={() => handleAccept(request._id)}
                          className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition duration-200 shadow-sm hover:shadow group-hover:scale-105"
                          title="Accept Request"
                        >
                          <FaCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleReject(request._id)}
                        className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition duration-200 shadow-sm hover:shadow group-hover:scale-105"
                        title="Reject Request"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span
                      className={`text-sm font-medium px-4 py-1.5 rounded-full ${
                        request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>        
    );
};

export default Inbox;