"use client";
import AppLayout from '@/src/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { ArrowLeft, Camera, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { currentUser, mockExpenses, mockFriends, mockGroups } from '@/src/data/mockData';
import { useNavigation } from '@/src/contexts/navigationContext';

export default function ProfilePage() {
  const { navigate } = useNavigation();
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [location, setLocation] = useState('San Francisco, CA');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };

  // Calculate stats
  const totalExpenses = mockExpenses.filter(e => e.paidBy.id === currentUser.id).length;
  const totalPaid = mockExpenses
    .filter(e => e.paidBy.id === currentUser.id)
    .reduce((sum, e) => sum + e.amount, 0);
  const memberSince = new Date('2023-01-15');

  return (
    <AppLayout currentPage="profile" navigate={navigate}>
      <div className="max-w-4xl mx-auto space-y-6">
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
            <h1>Profile</h1>
            <p className="text-muted-foreground">Manage your personal information</p>
          </div>
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarFallback className="bg-gradient-to-br from-[#1cc29f] to-[#17a588] text-white text-4xl">
                    {currentUser.initials}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#1cc29f] text-white flex items-center justify-center hover:bg-[#17a588] transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="mb-1">{currentUser.name}</h2>
                <p className="text-muted-foreground mb-4">{currentUser.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className="bg-[#e6f9f5] text-[#1cc29f]">
                    <Calendar className="w-3 h-3 mr-1" />
                    Member since {memberSince.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-[#1cc29f]">{totalExpenses}</div>
              <p className="text-muted-foreground mt-1">transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total paid</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-[#1cc29f]">${totalPaid.toFixed(2)}</div>
              <p className="text-muted-foreground mt-1">lifetime</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-[#1cc29f]">{mockGroups.length}</div>
              <p className="text-muted-foreground mt-1">groups</p>
            </CardContent>
          </Card>
        </div>

        {/* Edit Profile */}
        <form onSubmit={handleSave}>
          <Card>
            <CardHeader>
              <CardTitle>Personal information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-input-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 bg-input-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10 bg-input-background"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto bg-[#1cc29f] hover:bg-[#17a588]"
                >
                  Save changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Your latest expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockExpenses
                .filter(e => e.paidBy.id === currentUser.id)
                .slice(0, 5)
                .map(expense => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => navigate('expense-detail', { expenseId: expense.id })}
                  >
                    <div className="flex-1">
                      <p className="truncate">{expense.description}</p>
                      <p className="text-muted-foreground">
                        {expense.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-[#1cc29f]">${expense.amount.toFixed(2)}</p>
                      <p className="text-muted-foreground">{expense.category}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
