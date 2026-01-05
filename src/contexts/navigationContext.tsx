'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export type Page = 
  | 'welcome'
  | 'login' 
  | 'signup' 
  | 'forgot-password'
  | 'dashboard' 
  | 'friends' 
  | 'groups' 
  | 'group-detail'
  | 'add-expense' 
  | 'expense-detail'
  | 'activity' 
  | 'balances'
  | 'settings'
  | 'profile'
  | 'add-friend'
  | 'create-group'
  | 'settle-up'
  | 'insights'
  | 'notifications';

export interface NavigationState {
  groupId?: string;
  expenseId?: string;
  friendId?: string;
}

interface NavigationContextType {
  currentPage: Page;
  navState: NavigationState;
  isAuthenticated: boolean;
  navigate: (page: Page, state?: NavigationState) => void;
  setAuthenticated: (authenticated: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('welcome');
  const [navState, setNavState] = useState<NavigationState>({});

  const navigate = (page: Page, state?: NavigationState) => {
    setCurrentPage(page);
    setNavState(state || {});
    
    // Map pages to Next.js routes
    const routeMap: Record<Page, string> = {
      'welcome': '/',
      'login': '/auth/login',
      'signup': '/auth/signup',
      'forgot-password': '/auth/forgot-password',
      'dashboard': '/dashboard',
      'friends': '/friends',
      'groups': '/groups',
      'group-detail': state?.groupId ? `/group/${state.groupId}` : '/groups',
      'add-expense': '/add-expense',
      'expense-detail': state?.expenseId ? `/expense/${state.expenseId}` : '/dashboard',
      'activity': '/activity',
      'balances': '/balances',
      'settings': '/settings',
      'profile': '/profile',
      'add-friend': '/add-friend',
      'create-group': '/create-group',
      'settle-up': '/settle-up',
      'insights': '/insights',
      'notifications': '/notifications',
    };

    const route = routeMap[page];
    if (route) {
      router.push(route);
    }
  };

  const setAuthenticated = (authenticated: boolean) => {
    setIsAuthenticated(authenticated);
    if (authenticated) {
      navigate('dashboard');
    } else {
      navigate('login');
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        currentPage,
        navState,
        isAuthenticated,
        navigate,
        setAuthenticated,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}
