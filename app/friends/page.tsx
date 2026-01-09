"use client";
import AppLayout from '@/src/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { UserPlus, Search, ArrowRight } from 'lucide-react';
import { mockFriends } from '@/src/data/mockData';
import { useState } from 'react';
import { useNavigation } from '@/src/contexts/navigationContext';

export default function FriendsPage() {
  const { navigate } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFriends = mockFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate friends by balance status
  const friendsOweYou = filteredFriends.filter(f => f.balance > 0);
  const youOweFriends = filteredFriends.filter(f => f.balance < 0);
  const settledFriends = filteredFriends.filter(f => f.balance === 0);

  const FriendCard = ({ friend }: { friend: typeof mockFriends[0] }) => (
    <Card 
      className="group border-0 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden bg-white"
      onClick={() => navigate('settle-up', { friendId: friend.id })}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative">
              <Avatar className="w-16 h-16 ring-3 ring-indigo-100 group-hover:ring-indigo-200 transition-all">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg">
                  {friend.initials}
                </AvatarFallback>
              </Avatar>
              {friend.balance !== 0 && (
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${
                  friend.balance > 0 
                    ? 'bg-emerald-500 text-white text-xs font-bold' 
                    : 'bg-orange-500 text-white text-xs font-bold'
                }`}>
                  {friend.balance > 0 ? '+' : '-'}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xl text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">
                {friend.name}
              </h4>
              <p className="text-sm text-gray-500 truncate">{friend.email}</p>
            </div>
          </div>
          <div className="text-right ml-4">
            {friend.balance === 0 ? (
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                  Settled ✓
                </span>
              </div>
            ) : (
              <div className={`text-right space-y-1 ${friend.balance > 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
                <p className="text-2xl font-black">${Math.abs(friend.balance).toFixed(2)}</p>
                <p className="text-xs font-semibold uppercase tracking-wide">
                  {friend.balance > 0 ? 'owes you' : 'you owe'}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout currentPage="friends" navigate={navigate}>
      <div className="space-y-8 pb-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl opacity-50 blur-xl -z-10" />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                Friends
              </h1>
              <p className="text-gray-600 font-medium text-lg">
                {mockFriends.length} total • {mockFriends.filter(f => f.balance !== 0).length} with balances
              </p>
            </div>
            <Button
              onClick={() => navigate('add-friend')}
              className="h-14 px-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add friend
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <Input
                placeholder="Search friends by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-16 h-14 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
              />
            </div>
          </CardContent>
        </Card>

        {/* Friends List */}
        {friendsOweYou.length > 0 && (
          <div>
            <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-8 bg-emerald-600 rounded-full" />
                  <CardTitle className="text-2xl font-bold text-emerald-800">
                    Friends who owe you ({friendsOweYou.length})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {friendsOweYou.map(friend => (
                    <FriendCard key={friend.id} friend={friend} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {youOweFriends.length > 0 && (
          <div>
            <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-8 bg-orange-600 rounded-full" />
                  <CardTitle className="text-2xl font-bold text-orange-800">
                    Friends you owe ({youOweFriends.length})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {youOweFriends.map(friend => (
                    <FriendCard key={friend.id} friend={friend} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {settledFriends.length > 0 && (
          <div>
            <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-gray-100">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-8 bg-gray-400 rounded-full" />
                  <CardTitle className="text-2xl font-bold text-gray-700">
                    Settled up ({settledFriends.length})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {settledFriends.map(friend => (
                    <FriendCard key={friend.id} friend={friend} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {filteredFriends.length === 0 && (
          <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardContent className="p-16 text-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-200 to-purple-200 mx-auto mb-6 flex items-center justify-center shadow-xl">
                <UserPlus className="w-12 h-12 text-indigo-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {searchQuery ? 'No friends found' : 'No friends yet'}
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                {searchQuery 
                  ? 'Try a different search term or add new friends' 
                  : 'Add friends to start sharing expenses together'
                }
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => navigate('add-friend')}
                  className="h-16 px-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-3xl"
                  size="lg"
                >
                  <UserPlus className="w-6 h-6 mr-3" />
                  Add your first friend
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
