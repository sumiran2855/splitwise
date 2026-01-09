import { useState, useEffect } from 'react';

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Failed to parse user data:', error);
          localStorage.removeItem('user');
        }
      }
    }
    setLoading(false);
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}
