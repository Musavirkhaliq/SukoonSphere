import React, { Suspense } from 'react';
import LoadingSpinner from '@/components/loaders/LoadingSpinner';
import RequestToContribute from '@/pages/about/helpDesk/RequestToContribute';
import GetAKey from '@/pages/about/helpDesk/GetAKey';

export const contributerRoutes = [
    {
        path: "/user/request-contributor",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <RequestToContribute />
            </Suspense>
        ),
    },
    {
        path: 'get-a-key',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <GetAKey />
            </Suspense>
        ),
    }


];
