import React, { lazy, Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from './routes';
import { UserProvider } from './context/UserContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const App = () => {
  // Create router once outside of render to avoid recreation
  const router = React.useMemo(() => createBrowserRouter(routes), []);

  // Create a client
  const queryClient = React.useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 30, // 30 minutes
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }), []);

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
