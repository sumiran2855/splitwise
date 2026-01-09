import { ReactNode } from 'react';
import { House, Users, UsersRound, PlusCircle, Activity, DollarSign, Settings, User, LogOut, Wallet } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useProfileContext } from '../contexts/profileContext';
import type { Page, NavigationState } from '../contexts/navigationContext';
import { useNavigation } from '../contexts/navigationContext';

interface AppLayoutProps {
  children: ReactNode;
  currentPage: Page;
  navigate?: (page: Page, state?: NavigationState) => void;
  onLogout?: () => void;
}

export default function AppLayout({ children, currentPage, navigate: propNavigate, onLogout }: AppLayoutProps) {
  const contextNavigate = useNavigation();
  const { user: currentUser, loading: userLoading } = useCurrentUser();
  
  const { profile } = useProfileContext();
  
  const navigate = propNavigate || contextNavigate.navigate;
  
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      contextNavigate.setAuthenticated(false);
    }
  };
  const navItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: House },
    { id: 'friends' as Page, label: 'Friends', icon: Users },
    { id: 'groups' as Page, label: 'Groups', icon: UsersRound },
    { id: 'activity' as Page, label: 'Activity', icon: Activity },
    { id: 'balances' as Page, label: 'Balances', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">SplitEase</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => navigate('add-expense')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hidden sm:flex rounded-xl h-10"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add expense
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                    <Avatar className="w-10 h-10 ring-2 ring-indigo-100 ring-offset-2">
                      {profile?.avatar ? (
                        <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                          {(profile?.fullName || currentUser?.name || 'User').split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl border-0 shadow-xl bg-white/95 backdrop-blur-sm mt-3">
                  <div className="px-3 py-2">
                    <p className="font-semibold text-gray-900">{profile?.fullName || currentUser?.name}</p>
                    <p className="text-sm text-gray-500">{currentUser?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('profile')} className="cursor-pointer rounded-lg">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('settings')} className="cursor-pointer rounded-lg">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer rounded-lg hover:bg-red-50">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200/50 bg-white/60 backdrop-blur-sm">
          <nav className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                      : 'text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Mobile FAB */}
      <button
        onClick={() => navigate('add-expense')}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 z-40"
      >
        <PlusCircle className="w-6 h-6" />
      </button>
    </div>
  );
}