"use client";
import AppLayout from '@/src/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { ArrowLeft, Settings, UserPlus, PlusCircle } from 'lucide-react';
import { mockGroups, mockExpenses } from '@/src/data/mockData';
import { useNavigation } from '@/src/contexts/navigationContext';

interface GroupDetailPageProps {
  groupId: string;
}

export default function GroupDetailPage({ groupId }: GroupDetailPageProps) {
  const { navigate } = useNavigation();
  const group = mockGroups.find(g => g.id === groupId);

  if (!group) {
    return (
      <AppLayout currentPage="groups" navigate={navigate}>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Group not found</p>
          <Button onClick={() => navigate('groups')} className="mt-4">
            Go to Groups
          </Button>
        </div>
      </AppLayout>
    );
  }

  const groupExpenses = mockExpenses.filter(e => e.group?.id === groupId);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trip': return '✈️';
      case 'home': return '🏠';
      case 'couple': return '❤️';
      default: return '📁';
    }
  };

  return (
    <AppLayout currentPage="groups" navigate={navigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('groups')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="text-4xl">{getCategoryIcon(group.category)}</div>
              <div>
                <h1 className="mb-0">{group.name}</h1>
                {group.description && (
                  <p className="text-muted-foreground">{group.description}</p>
                )}
              </div>
            </div>
          </div>
          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Group Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-muted-foreground">Total spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-[#1cc29f]">
                ${groupExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-muted-foreground">Your balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl ${
                group.totalBalance > 0 
                  ? 'text-green-600' 
                  : group.totalBalance < 0 
                  ? 'text-orange-600' 
                  : 'text-muted-foreground'
              }`}>
                {group.totalBalance === 0 
                  ? 'Settled' 
                  : `$${Math.abs(group.totalBalance).toFixed(2)}`
                }
              </div>
              {group.totalBalance !== 0 && (
                <p className="text-muted-foreground mt-1">
                  {group.totalBalance > 0 ? 'you are owed' : 'you owe'}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-muted-foreground">Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{groupExpenses.length}</div>
              <p className="text-muted-foreground mt-1">transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Members */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Members ({group.members.length})</CardTitle>
              <Button variant="outline" size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Add member
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.members.map(member => (
                <div
                  key={member.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-[#1cc29f] text-white">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p>{member.name}</p>
                    <p className="text-muted-foreground">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Group expenses</CardTitle>
              <Button
                size="sm"
                onClick={() => navigate('add-expense', { groupId: group.id })}
                className="bg-[#1cc29f] hover:bg-[#17a588]"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add expense
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {groupExpenses.length > 0 ? (
              <div className="space-y-3">
                {groupExpenses.map(expense => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => navigate('expense-detail', { expenseId: expense.id })}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gray-200">
                          {expense.paidBy.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="truncate">{expense.description}</p>
                        <p className="text-muted-foreground">
                          {expense.paidBy.name} paid • {expense.category}
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
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No expenses in this group yet</p>
                <p className="mt-2">Add your first expense to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
