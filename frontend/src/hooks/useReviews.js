import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';

export const useReviews = (managerId, limit = 20, offset = 0) => {
  return useQuery({
    queryKey: ['reviews', managerId, limit, offset],
    queryFn: () => api.getReviews(managerId, limit, offset),
    enabled: !!managerId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createReview,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.manager_id] });
      queryClient.invalidateQueries({ queryKey: ['managers', variables.manager_id] });
      queryClient.invalidateQueries({ queryKey: ['managers', 'search'] });
      queryClient.invalidateQueries({ queryKey: ['managers', 'trending'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
