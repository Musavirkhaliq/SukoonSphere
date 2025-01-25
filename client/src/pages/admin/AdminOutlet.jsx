import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

const AdminOutlet = () => {
    const { user, loading } = useUser();
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'admin') {
                navigate('/');
                toast.error('Unauthorized access');
            } else {
                setIsAuthorized(true);
            }
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="min-h-screen ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow rounded-lg">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex">
                            <NavLink
                                to="/admin"
                                end
                                className={({ isActive }) =>
                                    `${
                                        isActive
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } md:w-1/4 py-4 px-4 text-center border-b-2 font-medium text-sm`
                                }
                            >
                                Inbox
                            </NavLink>
                            <NavLink
                                to="/admin/suggestions"
                                className={({ isActive }) =>
                                    `${
                                        isActive
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } md:w-1/4 py-4 px-4 text-center border-b-2 font-medium text-sm`
                                }
                            >
                                User Suggestions
                            </NavLink>
                        </nav>
                    </div>
                    <div className="p-4">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOutlet;