import React from 'react';
import AdminOutlet from '../pages/admin/AdminOutlet';
import Inbox from '../pages/admin/Inbox';
import UserSuggestions from '../pages/admin/UserSuggestions';

export const adminRoutes = {
    path: '/admin',
    element: <AdminOutlet />,
    children: [
        {
            index: true,
            element: <Inbox />
        },
        {
            path: 'suggestions',
            element: <UserSuggestions />
        }
    ]
};
