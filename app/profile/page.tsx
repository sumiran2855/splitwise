"use client";
import AppLayout from '@/src/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { ArrowLeft, Camera, Mail, Phone, MapPin, Calendar, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigation } from '@/src/contexts/navigationContext';
import { useProfile } from '@/src/hooks/useProfile';
import { useCurrentUser } from '@/src/hooks/useCurrentUser';
import { Skeleton } from '@/src/components/ui/skeleton';

export default function ProfilePage() {
  const { navigate } = useNavigation();
  const { user: currentUser, loading: userLoading } = useCurrentUser();
  const { 
    profile, 
    loading: profileLoading, 
    updateProfile, 
    handleAvatarUpload,
    isUploadingAvatar,
    tempAvatar
  } = useProfile(currentUser?.id ? currentUser.id : 'skip');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setName(profile.fullName);
      setPhone(profile.phone || '');
      setLocation(profile.location || '');
    }
    if (currentUser) {
      setEmail(currentUser.email);
    }
  }, [profile, currentUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || isSubmitting) return;

    setIsSubmitting(true);
    const success = await updateProfile({
      fullName: name,
      phone: phone || undefined,
      location: location || undefined,
    });
    setIsSubmitting(false);
  };

  const handleAvatarClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await handleAvatarUpload(file);
      }
    };
    input.click();
  };

  const loading = userLoading || profileLoading;

  if (loading) {
    return (
      <AppLayout currentPage="profile" navigate={navigate}>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" disabled>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <Skeleton className="w-32 h-32 rounded-full" />
                <div className="flex-1 text-center md:text-left">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-64 mb-4" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!currentUser) {
    return (
      <AppLayout currentPage="profile" navigate={navigate}>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center py-12">
            <h1 className="mb-2">Profile not available</h1>
            <p className="text-muted-foreground">Please log in to view your profile</p>
            <Button
              onClick={() => navigate('login')}
              className="mt-4 bg-[#1cc29f] hover:bg-[#17a588]"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Calculate stats (placeholder - will be implemented with actual expense API)
  const totalExpenses = 0;
  const totalPaid = 0;
  const memberSince = currentUser.createdAt.trim().split("T")[0];

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
                  {tempAvatar ? (
                    <img src={tempAvatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  ) : profile?.avatar ? (
                    <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-[#1cc29f] to-[#17a588] text-white text-4xl">
                      {(name || profile?.fullName || currentUser?.name || 'User').split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <button
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#1cc29f] text-white flex items-center justify-center hover:bg-[#17a588] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                  disabled={isUploadingAvatar}
                >
                  {isUploadingAvatar ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="mb-1">{name || profile?.fullName || currentUser?.name || 'User'}</h2>
                <p className="text-muted-foreground mb-4">{email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className="bg-[#e6f9f5] text-[#1cc29f]">
                    <Calendar className="w-3 h-3 mr-1" />
                    Member since {(new Date(memberSince)).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
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
              <div className="text-3xl text-[#1cc29f]">0</div>
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
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-input-background"
                    />
                  </div>
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save changes'}
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
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent expenses</p>
                <p className="mt-2">Start adding expenses to see your activity here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout >
  );
}
