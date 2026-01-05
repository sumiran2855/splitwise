import { ReactNode } from 'react';
import { House, Users, UsersRound, PlusCircle, Activity, DollarSign, Settings, User, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { currentUser } from '../data/mockData';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1cc29f]">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
              </div>
              <span className="text-[#1cc29f]">SplitWise</span>
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
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#e6f9f5] text-[#1cc29f]'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => navigate('add-expense')}
                className="bg-[#1cc29f] hover:bg-[#17a588] hidden sm:flex"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add expense
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="bg-[#1cc29f] text-white">
                        {currentUser.initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="text-muted-foreground">{currentUser.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('profile')}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-border">
          <nav className="flex items-center justify-around px-2 py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-[#1cc29f]'
                      : 'text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Mobile FAB */}
      <button
        onClick={() => navigate('add-expense')}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#1cc29f] hover:bg-[#17a588] text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40"
      >
        <PlusCircle className="w-6 h-6" />
      </button>
    </div>
  );
}