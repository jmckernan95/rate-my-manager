import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';

export const useSearchManagers = (query, company) => {
  return useQuery({
    queryKey: ['managers', 'search', query, company],
    queryFn: () => api.searchManagers(query, company),
    enabled: true,
  });
};

export const useTrendingManagers = (limit = 5) => {
  return useQuery({
    queryKey: ['managers', 'trending', limit],
    queryFn: () => api.getTrendingManagers(limit),
  });
};

export const useManager = (id) => {
  return useQuery({
    queryKey: ['managers', id],
    queryFn: () => api.getManager(id),
    enabled: !!id,
  });
};

export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: api.getCompanies,
  });
};

export const useCreateManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createManager,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managers'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};
