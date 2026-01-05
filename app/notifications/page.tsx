"use client";
import AppLayout from '@/src/components/AppLayout';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Bell, DollarSign, Users, UserPlus, CheckCircle2, XCircle } from 'lucide-react';
import { mockFriends, mockGroups, currentUser } from '@/src/data/mockData';
import { toast } from 'sonner';
import { useNavigation } from '@/src/contexts/navigationContext';

interface Notification {
  id: string;
  type: 'expense' | 'payment' | 'friend_request' | 'group_invite' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  user?: typeof mockFriends[0];
  actionable?: boolean;
}

export default function NotificationsPage() {
  const { navigate } = useNavigation();
  const notifications: Notification[] = [
    {
      id: 'n1',
      type: 'payment',
      title: 'Payment received',
      message: 'James Wilson paid you $80.00',
      timestamp: new Date('2025-01-02T14:20:00'),
      read: false,
      user: mockFriends[3],
    },
    {
      id: 'n2',
      type: 'expense',
      title: 'New expense added',
      message: 'Emma Davis added "Electricity bill" in Apartment 4B',
      timestamp: new Date('2025-01-02T10:15:00'),
      read: false,
      user: mockFriends[2],
    },
    {
      id: 'n3',
      type: 'friend_request',
      title: 'Friend request',
      message: 'Jennifer Smith wants to connect with you',
      timestamp: new Date('2025-01-01T18:30:00'),
      read: false,
      actionable: true,
    },
    {
      id: 'n4',
      type: 'group_invite',
      title: 'Group invitation',
      message: 'You were invited to join "Weekend Getaway"',
      timestamp: new Date('2025-01-01T15:45:00'),
      read: false,
      actionable: true,
    },
    {
      id: 'n5',
      type: 'reminder',
      title: 'Payment reminder',
      message: 'You owe Lisa Anderson $67.25',
      timestamp: new Date('2025-01-01T09:00:00'),
      read: true,
      user: mockFriends[5],
    },
    {
      id: 'n6',
      type: 'expense',
      title: 'Expense updated',
      message: 'Sarah Williams updated "Dinner at restaurant"',
      timestamp: new Date('2024-12-31T20:10:00'),
      read: true,
      user: mockFriends[0],
    },
    {
      id: 'n7',
      type: 'payment',
      title: 'Payment reminder sent',
      message: 'Reminder sent to Mike Chen for $23.75',
      timestamp: new Date('2024-12-30T16:00:00'),
      read: true,
      user: mockFriends[1],
    },
  ];

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'expense':
        return <Bell className="w-5 h-5 text-blue-600" />;
      case 'friend_request':
        return <UserPlus className="w-5 h-5 text-purple-600" />;
      case 'group_invite':
        return <Users className="w-5 h-5 text-orange-600" />;
      case 'reminder':
        return <Bell className="w-5 h-5 text-yellow-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'bg-green-100';
      case 'expense':
        return 'bg-blue-100';
      case 'friend_request':
        return 'bg-purple-100';
      case 'group_invite':
        return 'bg-orange-100';
      case 'reminder':
        return 'bg-yellow-100';
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
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleAccept = (notificationId: string) => {
    toast.success('Request accepted');
  };

  const handleDecline = (notificationId: string) => {
    toast.success('Request declined');
  };

  const markAllAsRead = () => {
    toast.success('All notifications marked as read');
  };

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <Card className={`hover:shadow-md transition-shadow ${!notification.read ? 'border-l-4 border-l-[#1cc29f]' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 rounded-full ${getNotificationColor(notification.type)} flex items-center justify-center flex-shrink-0`}>
            {getNotificationIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-medium">{notification.title}</p>
                  {!notification.read && (
                    <Badge className="bg-[#1cc29f] text-white">New</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{notification.message}</p>
              </div>
              <span className="text-muted-foreground whitespace-nowrap flex-shrink-0">
                {formatTime(notification.timestamp)}
              </span>
            </div>

            {notification.user && (
              <div className="flex items-center space-x-2 mt-3">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs bg-gray-200">
                    {notification.user.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground">{notification.user.name}</span>
              </div>
            )}

            {notification.actionable && (
              <div className="flex items-center space-x-2 mt-4">
                <Button
                  size="sm"
                  onClick={() => handleAccept(notification.id)}
                  className="bg-[#1cc29f] hover:bg-[#17a588]"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDecline(notification.id)}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Decline
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout currentPage="dashboard" navigate={navigate}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-1">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadNotifications.length} unread notifications
            </p>
          </div>
          {unreadNotifications.length > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications Tabs */}
        <Tabs defaultValue="unread" className="w-full">
          <TabsList>
            <TabsTrigger value="unread">
              Unread ({unreadNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All ({notifications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unread" className="mt-6">
            {unreadNotifications.length > 0 ? (
              <div className="space-y-3">
                {unreadNotifications.map(notification => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">
                    You have no unread notifications
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <div className="space-y-3">
              {notifications.map(notification => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
