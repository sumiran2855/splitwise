"use client";
import AppLayout from '@/src/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Calendar, Tag, Users, DollarSign } from 'lucide-react';
import { mockExpenses } from '@/src/data/mockData';
import { toast } from 'sonner';
import { useNavigation } from '@/src/contexts/navigationContext';

interface ExpenseDetailPageProps {
  expenseId: string;
}

export default function ExpenseDetailPage({ expenseId }: ExpenseDetailPageProps) {
  const { navigate } = useNavigation();
  const expense = mockExpenses.find(e => e.id === expenseId);

  if (!expense) {
    return (
      <AppLayout currentPage="dashboard" navigate={navigate}>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Expense not found</p>
          <Button onClick={() => navigate('dashboard')} className="mt-4">
            Go to Dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }

  const handleDelete = () => {
    toast.success('Expense deleted successfully');
    navigate('dashboard');
  };

  return (
    <AppLayout currentPage="dashboard" navigate={navigate}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('dashboard')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1>Expense details</h1>
              <p className="text-muted-foreground">{expense.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>

        {/* Amount Card */}
        <Card className="bg-gradient-to-br from-[#1cc29f] to-[#17a588] text-white border-0">
          <CardContent className="p-8 text-center">
            <p className="text-white/80 mb-2">Total amount</p>
            <div className="text-5xl mb-2">
              ${expense.amount.toFixed(2)}
            </div>
            <p className="text-white/90">{expense.currency}</p>
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#e6f9f5] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#1cc29f]" />
              </div>
              <div>
                <p className="text-muted-foreground">Date</p>
                <p>{expense.date.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#e6f9f5] flex items-center justify-center">
                <Tag className="w-5 h-5 text-[#1cc29f]" />
              </div>
              <div>
                <p className="text-muted-foreground">Category</p>
                <p>{expense.category}</p>
              </div>
            </div>

            {expense.group && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#e6f9f5] flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#1cc29f]" />
                </div>
                <div>
                  <p className="text-muted-foreground">Group</p>
                  <p>{expense.group.name}</p>
                </div>
              </div>
            )}

            {expense.notes && (
              <div className="pt-4 border-t border-border">
                <p className="text-muted-foreground mb-1">Notes</p>
                <p>{expense.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paid By */}
        <Card>
          <CardHeader>
            <CardTitle>Paid by</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-[#1cc29f] text-white">
                  {expense.paidBy.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p>{expense.paidBy.name}</p>
                <p className="text-muted-foreground">{expense.paidBy.email}</p>
              </div>
              <div className="text-right">
                <p>${expense.amount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Split Between */}
        <Card>
          <CardHeader>
            <CardTitle>Split between {expense.splitBetween.length} people</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expense.splitBetween.map((split) => (
                <div
                  key={split.user.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gray-200">
                      {split.user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p>{split.user.name}</p>
                    <p className="text-muted-foreground">${split.amount.toFixed(2)}</p>
                  </div>
                  <Badge variant={split.paid ? 'default' : 'secondary'} className={split.paid ? 'bg-green-100 text-green-700' : ''}>
                    {split.paid ? 'Paid' : 'Pending'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
