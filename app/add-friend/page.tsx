"use client";
import AppLayout from '@/src/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { ArrowLeft, Mail, UserPlus, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigation } from '@/src/contexts/navigationContext';

export default function AddFriendPage() {
  const { navigate } = useNavigation();
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success(`Invitation sent to ${email}`);
      setEmail('');
    } else {
      toast.error('Please enter an email address');
    }
  };

  const suggestedFriends = [
    { name: 'Jennifer Smith', email: 'jennifer.s@email.com', mutualFriends: 5 },
    { name: 'David Brown', email: 'david.b@email.com', mutualFriends: 3 },
    { name: 'Maria Garcia', email: 'maria.g@email.com', mutualFriends: 7 },
  ];

  return (
    <AppLayout currentPage="friends" navigate={navigate}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('friends')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1>Add friend</h1>
            <p className="text-muted-foreground">Invite someone to share expenses</p>
          </div>
        </div>

        {/* Invite by Email */}
        <Card>
          <CardHeader>
            <CardTitle>Invite by email</CardTitle>
            <CardDescription>Send an invitation to join SplitEase</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="friend@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-input-background"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#1cc29f] hover:bg-[#17a588]"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send invitation
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search Users */}
        <Card>
          <CardHeader>
            <CardTitle>Search users</CardTitle>
            <CardDescription>Find people already on SplitEase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input-background"
                />
              </div>
              
              {searchQuery && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No users found</p>
                  <p className="mt-1">Try inviting them by email instead</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Suggested Friends */}
        <Card>
          <CardHeader>
            <CardTitle>Suggested friends</CardTitle>
            <CardDescription>People you might know</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestedFriends.map((friend, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#1cc29f] text-white flex items-center justify-center">
                      {friend.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p>{friend.name}</p>
                      <p className="text-muted-foreground">
                        {friend.mutualFriends} mutual friends
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success(`Friend request sent to ${friend.name}`)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Import Contacts */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="mb-2">Import from contacts</h3>
              <p className="text-muted-foreground mb-4">
                Find friends from your phone or email contacts
              </p>
              <Button variant="outline">
                Import contacts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
