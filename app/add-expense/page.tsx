"use client";
import AppLayout from '@/src/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';
import { Checkbox } from '@/src/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { mockFriends, mockGroups, expenseCategories, currentUser } from '@/src/data/mockData';
import { useNavigation } from '@/src/contexts/navigationContext';

export default function AddExpensePage({ groupId }: { groupId?: string }) {
  const { navigate } = useNavigation();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(groupId || 'none');
  const [paidBy, setPaidBy] = useState(currentUser.id);
  const [splitWith, setSplitWith] = useState<string[]>([currentUser.id]);
  const [notes, setNotes] = useState('');

  const selectedGroupData = mockGroups.find(g => g.id === selectedGroup);
  const availableMembers = selectedGroupData?.members || mockFriends.slice(0, 5);

  const handleToggleMember = (memberId: string) => {
    if (splitWith.includes(memberId)) {
      setSplitWith(splitWith.filter(id => id !== memberId));
    } else {
      setSplitWith([...splitWith, memberId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (splitWith.length === 0) {
      toast.error('Please select at least one person to split with');
      return;
    }

    toast.success('Expense added successfully!');
    navigate('dashboard');
  };

  const splitAmount = splitWith.length > 0 ? (parseFloat(amount) || 0) / splitWith.length : 0;

  return (
    <AppLayout currentPage="add-expense" navigate={navigate}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('dashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1>Add expense</h1>
            <p className="text-muted-foreground">Record a new shared expense</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Expense details</CardTitle>
                <CardDescription>Enter the basic information about the expense</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Dinner at restaurant"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-input-background"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-7 bg-input-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-input-background">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="group">Group (optional)</Label>
                  <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger className="bg-input-background">
                      <SelectValue placeholder="No group (personal expense)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No group</SelectItem>
                      {mockGroups.map(group => (
                        <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional details..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-input-background resize-none"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Paid By */}
            <Card>
              <CardHeader>
                <CardTitle>Paid by</CardTitle>
                <CardDescription>Who paid for this expense?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[currentUser, ...availableMembers.filter(m => m.id !== currentUser.id)].map(member => (
                    <label
                      key={member.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        paidBy === member.id 
                          ? 'border-[#1cc29f] bg-[#e6f9f5]' 
                          : 'border-transparent hover:bg-muted'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paidBy"
                        value={member.id}
                        checked={paidBy === member.id}
                        onChange={(e) => setPaidBy(e.target.value)}
                        className="sr-only"
                      />
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-[#1cc29f] text-white">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p>{member.name}</p>
                        {member.id === currentUser.id && (
                          <p className="text-muted-foreground">You</p>
                        )}
                      </div>
                      {paidBy === member.id && (
                        <div className="w-5 h-5 rounded-full bg-[#1cc29f] flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Split With */}
            <Card>
              <CardHeader>
                <CardTitle>Split with</CardTitle>
                <CardDescription>
                  Select who should share this expense
                  {splitWith.length > 0 && ` • $${splitAmount.toFixed(2)} per person`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[currentUser, ...availableMembers.filter(m => m.id !== currentUser.id)].map(member => (
                    <label
                      key={member.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={splitWith.includes(member.id)}
                        onCheckedChange={() => handleToggleMember(member.id)}
                      />
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-[#1cc29f] text-white">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p>{member.name}</p>
                        {member.id === currentUser.id && (
                          <p className="text-muted-foreground">You</p>
                        )}
                      </div>
                      {splitWith.includes(member.id) && (
                        <span className="text-muted-foreground">
                          ${splitAmount.toFixed(2)}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('dashboard')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#1cc29f] hover:bg-[#17a588]"
              >
                Add expense
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
