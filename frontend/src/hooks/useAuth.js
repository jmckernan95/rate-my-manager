import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const store = useAuthStore();

  useEffect(() => {
    // Check auth status on mount
    if (store.token && !store.user) {
      store.checkAuth();
    }
  }, []);

  return store;
};

export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  return { isAuthenticated, isLoading };
};
