"use client";
import AppLayout from '@/src/components/AppLayout';
import { Card, CardContent } from '@/src/components/ui/card';
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { UserPlus, Search } from 'lucide-react';
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
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate('settle-up', { friendId: friend.id })}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-[#1cc29f] text-white">
                {friend.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{friend.name}</p>
              <p className="text-muted-foreground">{friend.email}</p>
            </div>
          </div>
          <div className="text-right">
            {friend.balance === 0 ? (
              <span className="text-muted-foreground">Settled up</span>
            ) : (
              <>
                <p className={`${friend.balance > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                  ${Math.abs(friend.balance).toFixed(2)}
                </p>
                <p className="text-muted-foreground">
                  {friend.balance > 0 ? 'owes you' : 'you owe'}
                </p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout currentPage="friends" navigate={navigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-1">Friends</h1>
            <p className="text-muted-foreground">
              {mockFriends.length} friends • {mockFriends.filter(f => f.balance !== 0).length} with balances
            </p>
          </div>
          <Button
            onClick={() => navigate('add-friend')}
            className="bg-[#1cc29f] hover:bg-[#17a588]"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add friend
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>

        {/* Friends List */}
        {friendsOweYou.length > 0 && (
          <div>
            <h3 className="mb-3 text-green-600">Friends who owe you</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friendsOweYou.map(friend => (
                <FriendCard key={friend.id} friend={friend} />
              ))}
            </div>
          </div>
        )}

        {youOweFriends.length > 0 && (
          <div>
            <h3 className="mb-3 text-orange-600">Friends you owe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {youOweFriends.map(friend => (
                <FriendCard key={friend.id} friend={friend} />
              ))}
            </div>
          </div>
        )}

        {settledFriends.length > 0 && (
          <div>
            <h3 className="mb-3 text-muted-foreground">Settled up</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settledFriends.map(friend => (
                <FriendCard key={friend.id} friend={friend} />
              ))}
            </div>
          </div>
        )}

        {filteredFriends.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2">No friends found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try a different search term' : 'Add friends to start sharing expenses'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => navigate('add-friend')}
                  className="bg-[#1cc29f] hover:bg-[#17a588]"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
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
