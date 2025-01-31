
import React, { lazy, Suspense, useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from './routes';
import { UserProvider } from './context/UserContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import socket from './utils/socket/socket';
const App = () => {
  const router = React.useMemo(() => createBrowserRouter(routes), []);
  const queryClient = React.useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {  
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }), []);

  useEffect(() => {
    // Listen for notifications
    socket.on('notification', (notification) => {
      console.log(notification.message); // Display the notification message
      // You can also update the UI here, e.g., show a toast notification
    });

    // Clean up the listener on component unmount
    return () => {
      socket.off('notification');
    };
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          <UserProvider>
            <RouterProvider router={router} />
          </UserProvider>
        </Suspense>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default React.memo(App);