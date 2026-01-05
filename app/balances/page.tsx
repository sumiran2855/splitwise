"use client";
import AppLayout from '@/src/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { mockFriends } from '@/src/data/mockData';
import { useNavigation } from '@/src/contexts/navigationContext';

export default function BalancesPage() {
  const { navigate } = useNavigation();
  const friendsOweYou = mockFriends.filter(f => f.balance > 0).sort((a, b) => b.balance - a.balance);
  const youOweFriends = mockFriends.filter(f => f.balance < 0).sort((a, b) => a.balance - b.balance);
  
  const totalOwed = friendsOweYou.reduce((sum, f) => sum + f.balance, 0);
  const totalOwe = Math.abs(youOweFriends.reduce((sum, f) => sum + f.balance, 0));

  const BalanceCard = ({ friend }: { friend: typeof mockFriends[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-[#1cc29f] text-white">
                {friend.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="truncate">{friend.name}</p>
              <p className="text-muted-foreground truncate">{friend.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 ml-4">
            <div className="text-right">
              <p className={`${friend.balance > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                ${Math.abs(friend.balance).toFixed(2)}
              </p>
              <p className="text-muted-foreground">
                {friend.balance > 0 ? 'owes you' : 'you owe'}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => navigate('settle-up', { friendId: friend.id })}
              className="bg-[#1cc29f] hover:bg-[#17a588]"
            >
              Settle
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout currentPage="balances" navigate={navigate}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-1">Balances</h1>
          <p className="text-muted-foreground">
            Track who owes what
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-700">You are owed</CardTitle>
                <ArrowUpRight className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl text-green-600 mb-2">
                ${totalOwed.toFixed(2)}
              </div>
              <p className="text-green-700">
                from {friendsOweYou.length} {friendsOweYou.length === 1 ? 'person' : 'people'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-orange-700">You owe</CardTitle>
                <ArrowDownRight className="w-5 h-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl text-orange-600 mb-2">
                ${totalOwe.toFixed(2)}
              </div>
              <p className="text-orange-700">
                to {youOweFriends.length} {youOweFriends.length === 1 ? 'person' : 'people'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Balances Tabs */}
        <Tabs defaultValue="owed" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="owed">
              You are owed ({friendsOweYou.length})
            </TabsTrigger>
            <TabsTrigger value="owe">
              You owe ({youOweFriends.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="owed" className="mt-6">
            {friendsOweYou.length > 0 ? (
              <div className="space-y-3">
                {friendsOweYou.map(friend => (
                  <BalanceCard key={friend.id} friend={friend} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
                    <ArrowUpRight className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="mb-2">No one owes you</h3>
                  <p className="text-muted-foreground">
                    When friends owe you money, they'll appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="owe" className="mt-6">
            {youOweFriends.length > 0 ? (
              <div className="space-y-3">
                {youOweFriends.map(friend => (
                  <BalanceCard key={friend.id} friend={friend} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-orange-100 mx-auto mb-4 flex items-center justify-center">
                    <ArrowDownRight className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="mb-2">You don't owe anyone</h3>
                  <p className="text-muted-foreground">
                    You're all settled up! 🎉
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
