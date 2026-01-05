"use client";
import AppLayout from '@/src/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Label } from '@/src/components/ui/label';
import { Switch } from '@/src/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { ArrowLeft, Bell, Globe, Lock, CreditCard, Users, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Page, NavigationState } from '@/src/contexts/navigationContext';

interface SettingsPageProps {
  navigate: (page: Page, state?: NavigationState) => void;
  onLogout: () => void;
}

export default function SettingsPage({ navigate, onLogout }: SettingsPageProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [expenseReminders, setExpenseReminders] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <AppLayout currentPage="settings" navigate={navigate}>
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
            <h1>Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences</p>
          </div>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-[#1cc29f]" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Manage how you receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email notifications</Label>
                <p className="text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push notifications</Label>
                <p className="text-muted-foreground">Get notified on your device</p>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Expense reminders</Label>
                <p className="text-muted-foreground">Weekly summary of balances</p>
              </div>
              <Switch
                checked={expenseReminders}
                onCheckedChange={setExpenseReminders}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-[#1cc29f]" />
              <CardTitle>Preferences</CardTitle>
            </div>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Default currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency" className="bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language" className="bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="it">Italiano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-[#1cc29f]" />
              <CardTitle>Privacy & Security</CardTitle>
            </div>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Change password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Two-factor authentication
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Privacy settings
            </Button>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-[#1cc29f]" />
              <CardTitle>Payment methods</CardTitle>
            </div>
            <CardDescription>Manage your saved payment options</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <CreditCard className="w-4 h-4 mr-2" />
              Add payment method
            </Button>
          </CardContent>
        </Card>

        {/* Groups */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-[#1cc29f]" />
              <CardTitle>Group settings</CardTitle>
            </div>
            <CardDescription>Default settings for new groups</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Default split method
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Group notifications
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Trash2 className="w-5 h-5 text-destructive" />
              <CardTitle className="text-destructive">Danger zone</CardTitle>
            </div>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start text-destructive border-destructive/50 hover:bg-destructive/10">
              Delete all data
            </Button>
            <Button variant="outline" className="w-full justify-start text-destructive border-destructive/50 hover:bg-destructive/10">
              Delete account
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onLogout}
            className="flex-1"
          >
            Logout
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-[#1cc29f] hover:bg-[#17a588]"
          >
            Save changes
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
