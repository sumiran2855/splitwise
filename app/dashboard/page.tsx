'use client';

import AppLayout from '@/src/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import { ArrowUpRight, ArrowDownRight, Users, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { mockFriends, mockGroups, mockExpenses } from '@/src/data/mockData';
import { useNavigation } from '@/src/contexts/navigationContext';
import { useCurrentUser } from '@/src/hooks/useCurrentUser';

export default function DashboardPage() {
  const { navigate, setAuthenticated } = useNavigation();
  const { user } = useCurrentUser();

  const handleLogout = () => {
    setAuthenticated(false);
  };

  // Calculate total balances
  const totalOwed = mockFriends
    .filter(f => f.balance > 0)
    .reduce((sum, f) => sum + f.balance, 0);
  
  const totalOwe = Math.abs(
    mockFriends
      .filter(f => f.balance < 0)
      .reduce((sum, f) => sum + f.balance, 0)
  );

  const netBalance = totalOwed - totalOwe;

  // Recent expenses
  const recentExpenses = mockExpenses
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  // Friends with balances
  const friendsWithBalances = mockFriends
    .filter(f => f.balance !== 0)
    .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))
    .slice(0, 5);

  return (
    <AppLayout currentPage="dashboard" navigate={navigate} onLogout={handleLogout}>
      <div className="space-y-6 sm:space-y-8 pb-8">
        {/* Welcome Section - Enhanced with better typography hierarchy */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl opacity-50 blur-3xl -z-10" />
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 text-base sm:text-lg font-medium">Here's your expense overview</p>
        </div>

        {/* Balance Overview Cards - Professional glassmorphism effect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white border-0 shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl -ml-16 -mb-16" />
            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <CardDescription className="text-white/80 font-semibold text-sm uppercase tracking-wider">Net Balance</CardDescription>
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
              </div>
              <CardTitle className="text-4xl sm:text-5xl font-black">
                ${Math.abs(netBalance).toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center space-x-2">
                {netBalance > 0 && <ArrowUpRight className="w-5 h-5 text-emerald-300" />}
                {netBalance < 0 && <ArrowDownRight className="w-5 h-5 text-orange-300" />}
                <p className="text-white/95 font-semibold text-base">
                  {netBalance > 0 ? 'You are owed' : netBalance < 0 ? 'You owe' : 'All settled up'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <CardDescription className="flex items-center font-semibold text-gray-500 text-sm uppercase tracking-wide">
                  <ArrowUpRight className="w-4 h-4 mr-1.5 text-emerald-600" />
                  You are owed
                </CardDescription>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <CardTitle className="text-4xl sm:text-5xl text-emerald-600 font-black">
                ${totalOwed.toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="w-4 h-4" />
                <p className="font-medium">
                  From {mockFriends.filter(f => f.balance > 0).length} {mockFriends.filter(f => f.balance > 0).length === 1 ? 'person' : 'people'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group sm:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <CardDescription className="flex items-center font-semibold text-gray-500 text-sm uppercase tracking-wide">
                  <ArrowDownRight className="w-4 h-4 mr-1.5 text-orange-600" />
                  You owe
                </CardDescription>
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Activity className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <CardTitle className="text-4xl sm:text-5xl text-orange-600 font-black">
                ${totalOwe.toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="w-4 h-4" />
                <p className="font-medium">
                  To {mockFriends.filter(f => f.balance < 0).length} {mockFriends.filter(f => f.balance < 0).length === 1 ? 'person' : 'people'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats - Modern card design with better visual hierarchy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-lg group overflow-hidden relative" onClick={() => navigate('friends')}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-1">Friends</CardTitle>
                  <CardDescription className="text-gray-500 font-medium">Active connections</CardDescription>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-baseline space-x-3">
                <div className="text-5xl font-black text-gray-900">{mockFriends.length}</div>
                <div className="text-sm text-gray-500 font-medium pb-1">total</div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-gray-600 font-medium flex items-center">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                  {friendsWithBalances.length} with outstanding balances
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-lg group overflow-hidden relative" onClick={() => navigate('groups')}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-1">Groups</CardTitle>
                  <CardDescription className="text-gray-500 font-medium">Shared expenses</CardDescription>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-baseline space-x-3">
                <div className="text-5xl font-black text-gray-900">{mockGroups.length}</div>
                <div className="text-sm text-gray-500 font-medium pb-1">active</div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-gray-600 font-medium flex items-center">
                  <span className="w-2 h-2 rounded-full bg-purple-500 mr-2" />
                  {mockExpenses.filter(e => e.group).length} group expenses
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links - Enhanced with modern gradients and better spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Card 
            className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white cursor-pointer hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:-translate-y-1 border-0 shadow-xl group"
            onClick={() => navigate('insights')}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <CardContent className="p-6 sm:p-8 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:scale-105 transition-transform">Insights & Reports</h3>
                  <p className="text-white/90 font-medium">View spending trends and analytics</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors ml-4">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 text-white cursor-pointer hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-1 border-0 shadow-xl group"
            onClick={() => navigate('notifications')}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <CardContent className="p-6 sm:p-8 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:scale-105 transition-transform">Notifications</h3>
                  <p className="text-white/90 font-medium">Stay updated on all activities</p>
                </div>
                <div className="relative ml-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold shadow-lg animate-pulse">3</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity - Professional layout with better visual separation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Expenses */}
          <Card className="bg-white border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <div className="w-2 h-6 bg-indigo-600 rounded-full mr-3" />
                    Recent expenses
                  </CardTitle>
                  <CardDescription className="text-gray-500 mt-1 ml-5">Latest transactions</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('activity')}
                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold"
                >
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {recentExpenses.map((expense, index) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 sm:p-5 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 cursor-pointer transition-all duration-200 group"
                    onClick={() => navigate('expense-detail', { expenseId: expense.id })}
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <Avatar className="w-12 h-12 ring-2 ring-indigo-100 group-hover:ring-indigo-200 transition-all">
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-base">
                          {expense.paidBy.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate group-hover:text-indigo-700 transition-colors">{expense.description}</p>
                        <p className="text-sm text-gray-500 font-medium mt-0.5">
                          Paid by {expense.paidBy.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-black text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">${expense.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500 font-medium mt-0.5">
                        {expense.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Outstanding Balances */}
          <Card className="bg-white border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <div className="w-2 h-6 bg-emerald-600 rounded-full mr-3" />
                    Outstanding balances
                  </CardTitle>
                  <CardDescription className="text-gray-500 mt-1 ml-5">Who owes what</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('balances')}
                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold"
                >
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {friendsWithBalances.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {friendsWithBalances.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-4 sm:p-5 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 cursor-pointer transition-all duration-200 group"
                      onClick={() => navigate('settle-up', { friendId: friend.id })}
                    >
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <Avatar className="w-12 h-12 ring-2 ring-gray-100 group-hover:ring-gray-200 transition-all">
                          <AvatarFallback className="bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 font-bold text-base">
                            {friend.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-gray-900 truncate">{friend.name}</p>
                          <p className="text-sm font-medium mt-0.5">
                            <span className={friend.balance > 0 ? 'text-emerald-600' : 'text-orange-600'}>
                              {friend.balance > 0 ? 'owes you' : 'you owe'}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className={`font-black text-xl ml-4 ${friend.balance > 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
                        ${Math.abs(friend.balance).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-xl font-bold text-gray-900 mb-2">No outstanding balances</p>
                  <p className="text-base text-gray-500">You're all settled up! 🎉</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
