import { ProfileCard, ProfileDetails } from '@/components'
import customFetch from '@/utils/customFetch';
import React from 'react'
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const UserProfile = () => {
    const groups = [
        {
            id: 1,
            name: 'Mindfulness Practices',
            image: 'https://example.com/image_mindfulness.jpg',
        },
        {
            id: 2,
            name: 'Coping with Anxiety',
            image: 'https://example.com/image_anxiety.jpg',
        },
        {
            id: 3,
            name: 'Therapy Techniques',
            image: 'https://example.com/image_therapy.jpg',
        },
        {
            id: 4,
            name: 'Depression Support Group',
            image: 'https://example.com/image_depression.jpg',
        },
        {
            id: 5,
            name: 'Stress Management Workshops',
            image: 'https://example.com/image_stress.jpg',
        }
    ];
    const { id: paramId } = useParams()
    const { data: user = {}, refetch: fetchUserById } = useQuery({
        queryKey: ['user', paramId],
        queryFn: async () => {
            const { data } = await customFetch.get(`user/user-details/${paramId}`);
            return data;
        },
        staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
        cacheTime: 1000 * 60 * 30, // Cache persists for 30 minutes
    });

    return (
        <>
            <div className='relative max-w-7xl mx-auto p-4 lg:p-8'>
                <div className='grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8'>
                    {/* Profile Card Section */}
                    <div className="md:col-span-3">
                        <div className="lg:sticky top-[80px] transition-all duration-300 hover:shadow-lg rounded-2xl">
                            <ProfileCard fetchUserById={fetchUserById} user={user} />
                        </div>
                    </div>

                    {/* Main Content Section */}
                    <div className='md:col-span-9'>
                        <div className='bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 lg:p-6'>
                            <ProfileDetails user={user} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserProfile