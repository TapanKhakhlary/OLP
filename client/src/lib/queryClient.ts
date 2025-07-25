import { QueryClient } from '@tanstack/react-query';
import { apiRequest } from './api';

// Create a query client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.message?.includes('Unauthorized')) return false;
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Default query function that uses our API client
queryClient.setDefaultOptions({
  queries: {
    queryFn: async ({ queryKey }) => {
      const [url] = queryKey as [string];
      // Remove /api prefix since apiRequest adds it
      const cleanUrl = url.startsWith('/api') ? url.slice(4) : url;
      return apiRequest(cleanUrl);
    },
  },
});

export { apiRequest };