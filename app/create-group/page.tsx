"use client";
import AppLayout from '@/src/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';
import { Checkbox } from '@/src/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { mockFriends, groupCategories } from '@/src/data/mockData';
import type { Page, NavigationState } from '@/src/contexts/navigationContext';

interface CreateGroupPageProps {
  navigate: (page: Page, state?: NavigationState) => void;
}

export default function CreateGroupPage({ navigate }: CreateGroupPageProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('other');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleToggleMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error('Please enter a group name');
      return;
    }

    toast.success('Group created successfully!');
    navigate('groups');
  };

  return (
    <AppLayout currentPage="groups" navigate={navigate}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('groups')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1>Create group</h1>
            <p className="text-muted-foreground">Set up a new expense group</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Group Info */}
            <Card>
              <CardHeader>
                <CardTitle>Group information</CardTitle>
                <CardDescription>Basic details about your group</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Group name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Trip to Bali"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="What's this group for?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-input-background resize-none"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
                <CardDescription>Choose a category for your group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {groupCategories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        category === cat.value
                          ? 'border-[#1cc29f] bg-[#e6f9f5]'
                          : 'border-border hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{cat.icon}</div>
                      <p className={category === cat.value ? 'text-[#1cc29f]' : ''}>
                        {cat.label}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Members */}
            <Card>
              <CardHeader>
                <CardTitle>Add members</CardTitle>
                <CardDescription>
                  Select friends to add to this group
                  {selectedMembers.length > 0 && ` • ${selectedMembers.length} selected`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockFriends.map(friend => (
                    <label
                      key={friend.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={selectedMembers.includes(friend.id)}
                        onCheckedChange={() => handleToggleMember(friend.id)}
                      />
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-[#1cc29f] text-white">
                          {friend.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p>{friend.name}</p>
                        <p className="text-muted-foreground">{friend.email}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {mockFriends.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No friends added yet</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={() => navigate('add-friend')}
                    >
                      Add friends
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('groups')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#1cc29f] hover:bg-[#17a588]"
              >
                Create group
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
