"use client";
import AppLayout from '@/src/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { ArrowLeft, Mail, UserPlus, Search, Users, Contact } from 'lucide-react';
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
      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        {/* Header - Enhanced with gradient and better spacing */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl opacity-50 blur-3xl -z-10" />
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('friends')}
              className="w-12 h-12 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Add friend
              </h1>
              <p className="text-gray-500 text-base font-medium mt-1">Invite someone to share expenses</p>
            </div>
          </div>
        </div>

        {/* Invite by Email - Professional gradient card */}
        <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
          <CardHeader className="relative z-10 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Invite by email</CardTitle>
                <CardDescription className="text-gray-500 font-medium mt-0.5">Send an invitation to join SplitEase</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 relative z-10">
            <form onSubmit={handleInvite} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email address</Label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-indigo-600 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="friend@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <Mail className="w-5 h-5 mr-2" />
                Send invitation
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search Users - Enhanced with modern styling */}
        <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
          <CardHeader className="relative z-10 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Search users</CardTitle>
                <CardDescription className="text-gray-500 font-medium mt-0.5">Find people already on SplitEase</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 relative z-10">
            <div className="space-y-4">
              <div className="relative group/search">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/search:text-blue-600 transition-colors" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              {searchQuery && (
                <div className="text-center py-12 px-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-lg font-bold text-gray-900 mb-2">No users found</p>
                  <p className="text-base text-gray-500">Try inviting them by email instead</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Suggested Friends - Professional list design */}
        <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Suggested friends</CardTitle>
                <CardDescription className="text-gray-500 font-medium mt-0.5">People you might know</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {suggestedFriends.map((friend, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-5 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 group/friend"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-base shadow-md group-hover/friend:shadow-lg transition-shadow">
                      {friend.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{friend.name}</p>
                      <p className="text-sm text-gray-500 font-medium mt-0.5">
                        {friend.mutualFriends} mutual friends
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success(`Friend request sent to ${friend.name}`)}
                    className="h-10 px-4 font-semibold border-2 border-purple-200 text-purple-700 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-200 rounded-xl"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Import Contacts - Enhanced call-to-action card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-600/20 rounded-full blur-2xl -ml-16 -mb-16" />
          <CardContent className="p-8 relative z-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors">
                <Contact className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Import from contacts</h3>
              <p className="text-white/90 font-medium mb-6 max-w-md mx-auto">
                Find friends from your phone or email contacts
              </p>
              <Button 
                variant="outline"
                className="h-12 px-8 bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white font-semibold hover:bg-white hover:text-emerald-600 transition-all duration-300 rounded-xl"
              >
                <Contact className="w-5 h-5 mr-2" />
                Import contacts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
