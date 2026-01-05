"use client";
import AppLayout from '@/src/components/AppLayout';
import { Card, CardContent } from '@/src/components/ui/card';
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';
import { DollarSign, Plus, Trash2, Users } from 'lucide-react';
import { mockActivities } from '@/src/data/mockData';
import { useNavigation } from '@/src/contexts/navigationContext';

export default function ActivityPage() {
  const { navigate } = useNavigation();
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'expense_added':
        return <Plus className="w-5 h-5 text-blue-600" />;
      case 'payment_made':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'expense_deleted':
        return <Trash2 className="w-5 h-5 text-red-600" />;
      case 'group_created':
        return <Users className="w-5 h-5 text-purple-600" />;
      default:
        return <Plus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'expense_added':
        return 'bg-blue-100';
      case 'payment_made':
        return 'bg-green-100';
      case 'expense_deleted':
        return 'bg-red-100';
      case 'group_created':
        return 'bg-purple-100';
      default:
        return 'bg-gray-100';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Group activities by date
  const groupedActivities = mockActivities.reduce((groups, activity) => {
    const date = activity.timestamp.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, typeof mockActivities>);

  return (
    <AppLayout currentPage="activity" navigate={navigate}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-1">Activity</h1>
          <p className="text-muted-foreground">
            Recent updates and transactions
          </p>
        </div>

        {/* Activity Timeline */}
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, activities]) => (
            <div key={date}>
              <h3 className="mb-3 text-muted-foreground">{date}</h3>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <Card 
                    key={activity.id}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      activity.expense ? 'hover:border-[#1cc29f]' : ''
                    }`}
                    onClick={() => {
                      if (activity.expense) {
                        navigate('expense-detail', { expenseId: activity.expense.id });
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center flex-shrink-0`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs bg-gray-200">
                                    {activity.user.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{activity.user.name}</span>
                              </div>
                              <p className="text-muted-foreground truncate">{activity.description}</p>
                            </div>
                            <span className="text-muted-foreground whitespace-nowrap flex-shrink-0">
                              {formatTime(activity.timestamp)}
                            </span>
                          </div>
                          {activity.expense && (
                            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                              <span className="text-muted-foreground">{activity.expense.category}</span>
                              <span className="text-[#1cc29f]">
                                ${activity.expense.amount.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {mockActivities.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2">No activity yet</h3>
              <p className="text-muted-foreground">
                Start adding expenses to see your activity here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
