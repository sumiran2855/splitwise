'use client';

import AppLayout from '@/src/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import { ArrowUpRight, ArrowDownRight, Users, TrendingUp } from 'lucide-react';
import { mockFriends, mockGroups, mockExpenses, currentUser } from '@/src/data/mockData';
import { useNavigation } from '@/src/contexts/navigationContext';

export default function DashboardPage() {
  const { navigate, setAuthenticated } = useNavigation();

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
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="mb-1">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">Here's your expense overview</p>
        </div>

        {/* Balance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-[#1cc29f] to-[#17a588] text-white border-0">
            <CardHeader className="pb-3">
              <CardDescription className="text-white/80">Total balance</CardDescription>
              <CardTitle className="text-3xl">
                ${Math.abs(netBalance).toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">
                {netBalance > 0 ? 'You are owed' : netBalance < 0 ? 'You owe' : 'All settled up'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-1 text-green-600" />
                You are owed
              </CardDescription>
              <CardTitle className="text-3xl text-green-600">
                ${totalOwed.toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                From {mockFriends.filter(f => f.balance > 0).length} people
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center">
                <ArrowDownRight className="w-4 h-4 mr-1 text-orange-600" />
                You owe
              </CardDescription>
              <CardTitle className="text-3xl text-orange-600">
                ${totalOwe.toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To {mockFriends.filter(f => f.balance < 0).length} people
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('friends')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Friends</CardTitle>
                  <CardDescription>Active connections</CardDescription>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">{mockFriends.length}</div>
              <p className="text-muted-foreground">
                {friendsWithBalances.length} with outstanding balances
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('groups')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Groups</CardTitle>
                  <CardDescription>Shared expenses</CardDescription>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">{mockGroups.length}</div>
              <p className="text-muted-foreground">
                {mockExpenses.filter(e => e.group).length} group expenses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white cursor-pointer hover:shadow-lg transition-shadow border-0"
            onClick={() => navigate('insights')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white mb-2">Insights & Reports</h3>
                  <p className="text-white/90">View spending trends and analytics</p>
                </div>
                <TrendingUp className="w-10 h-10 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer hover:shadow-lg transition-shadow border-0"
            onClick={() => navigate('notifications')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white mb-2">Notifications</h3>
                  <p className="text-white/90">Stay updated on all activities</p>
                </div>
                <div className="relative">
                  <svg className="w-10 h-10 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs">3</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Expenses */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent expenses</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('activity')}
                >
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => navigate('expense-detail', { expenseId: expense.id })}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-[#1cc29f] text-white">
                          {expense.paidBy.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="truncate">{expense.description}</p>
                        <p className="text-muted-foreground">
                          {expense.paidBy.name} paid
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p>${expense.amount.toFixed(2)}</p>
                      <p className="text-muted-foreground">
                        {expense.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Outstanding Balances */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Outstanding balances</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('balances')}
                >
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {friendsWithBalances.length > 0 ? (
                  friendsWithBalances.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => navigate('settle-up', { friendId: friend.id })}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gray-200">
                            {friend.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{friend.name}</p>
                          <p className="text-muted-foreground">
                            {friend.balance > 0 ? 'owes you' : 'you owe'}
                          </p>
                        </div>
                      </div>
                      <div className={`${friend.balance > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                        ${Math.abs(friend.balance).toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No outstanding balances</p>
                    <p className="mt-2">You're all settled up! 🎉</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}