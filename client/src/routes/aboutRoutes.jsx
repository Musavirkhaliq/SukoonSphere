import LoadingSpinner from '@/components/loaders/LoadingSpinner';
import { boardMembersLoader } from '@/loaders/boardMembersLoader';
import React, { lazy, Suspense } from 'react';

const OurTeam = lazy(() => import('../pages/about/OurTeam'));
const MentalHealth = lazy(() => import('../pages/about/MentalHealth'));
const AboutUs = lazy(() => import('../pages/about/AboutUs'));
const ContactUs = lazy(() => import('../pages/about/ContactUs'));

export const aboutRoutes = [
    {
        path: '/about/our-team',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <OurTeam />
            </Suspense>
        ),
        loader: boardMembersLoader
    },
    {
        path: 'about/mental-health',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <MentalHealth />
            </Suspense>
        ),
    },
    {
        path: '/about-us',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <AboutUs />
            </Suspense>
        ),
    },
    {
        path: 'contact-us',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <ContactUs />
            </Suspense>
        ),
    },

];
