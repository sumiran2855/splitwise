"use client";
import AppLayout from '@/src/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Badge } from '@/src/components/ui/badge';
import { PlusCircle, Search, Users } from 'lucide-react';
import { mockGroups } from '@/src/data/mockData';
import { useState } from 'react';
import { useNavigation } from '@/src/contexts/navigationContext';

export default function GroupsPage() {
  const { navigate } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = mockGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trip': return '✈️';
      case 'home': return '🏠';
      case 'couple': return '❤️';
      default: return '📁';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trip': return 'bg-blue-100 text-blue-700';
      case 'home': return 'bg-green-100 text-green-700';
      case 'couple': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AppLayout currentPage="groups" navigate={navigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-1">Groups</h1>
            <p className="text-muted-foreground">
              {mockGroups.length} active groups
            </p>
          </div>
          <Button
            onClick={() => navigate('create-group')}
            className="bg-[#1cc29f] hover:bg-[#17a588]"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create group
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>

        {/* Groups Grid */}
        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map(group => (
              <Card 
                key={group.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('group-detail', { groupId: group.id })}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-2xl">{getCategoryIcon(group.category)}</div>
                    <Badge className={getCategoryColor(group.category)}>
                      {group.category}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-1">{group.name}</CardTitle>
                  {group.description && (
                    <CardDescription className="line-clamp-2">
                      {group.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Members */}
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {group.members.length} members
                      </span>
                    </div>

                    {/* Member Avatars */}
                    <div className="flex -space-x-2">
                      {group.members.slice(0, 4).map(member => (
                        <Avatar key={member.id} className="w-8 h-8 border-2 border-white">
                          <AvatarFallback className="bg-[#1cc29f] text-white text-xs">
                            {member.initials}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {group.members.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                          +{group.members.length - 4}
                        </div>
                      )}
                    </div>

                    {/* Balance */}
                    <div className="pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Your balance</span>
                        <span className={`${
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
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2">No groups found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try a different search term' : 'Create a group to share expenses with multiple people'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => navigate('create-group')}
                  className="bg-[#1cc29f] hover:bg-[#17a588]"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create your first group
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
