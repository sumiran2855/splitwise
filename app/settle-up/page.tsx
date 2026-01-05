"use client";
import AppLayout from '@/src/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';
import { ArrowLeft, DollarSign, CreditCard, Building2, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { mockFriends, currentUser } from '@/src/data/mockData';
import type { Page, NavigationState } from '@/src/contexts/navigationContext';

interface SettleUpPageProps {
  navigate: (page: Page, state?: NavigationState) => void;
  friendId?: string;
}

export default function SettleUpPage({ navigate, friendId }: SettleUpPageProps) {
  const friend = mockFriends.find(f => f.id === friendId);
  const [amount, setAmount] = useState(friend ? Math.abs(friend.balance).toFixed(2) : '');
  const [paymentMethod, setPaymentMethod] = useState('');

  if (!friend) {
    return (
      <AppLayout currentPage="balances" navigate={navigate}>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Friend not found</p>
          <Button onClick={() => navigate('balances')} className="mt-4">
            Go to Balances
          </Button>
        </div>
      </AppLayout>
    );
  }

  const isOwed = friend.balance > 0;

  const handleSettle = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    toast.success(`Payment of $${parseFloat(amount).toFixed(2)} recorded!`);
    navigate('balances');
  };

  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: DollarSign },
    { value: 'card', label: 'Credit/Debit Card', icon: CreditCard },
    { value: 'bank', label: 'Bank Transfer', icon: Building2 },
    { value: 'venmo', label: 'Venmo', icon: Smartphone },
    { value: 'paypal', label: 'PayPal', icon: Smartphone },
  ];

  return (
    <AppLayout currentPage="balances" navigate={navigate}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('balances')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1>Settle up</h1>
            <p className="text-muted-foreground">Record a payment</p>
          </div>
        </div>

        {/* Friend Info */}
        <Card className={isOwed ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-[#1cc29f] text-white text-xl">
                    {friend.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="mb-1">{friend.name}</h3>
                  <p className={isOwed ? 'text-green-700' : 'text-orange-700'}>
                    {isOwed ? 'owes you' : 'you owe'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-4xl ${isOwed ? 'text-green-600' : 'text-orange-600'}`}>
                  ${Math.abs(friend.balance).toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settlement Form */}
        <form onSubmit={handleSettle}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment details</CardTitle>
                <CardDescription>
                  {isOwed 
                    ? `Record a payment from ${friend.name}` 
                    : `Record a payment to ${friend.name}`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
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
                  <p className="text-muted-foreground">
                    Outstanding balance: ${Math.abs(friend.balance).toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Payment method</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <label
                          key={method.value}
                          className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            paymentMethod === method.value
                              ? 'border-[#1cc29f] bg-[#e6f9f5]'
                              : 'border-border hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.value}
                            checked={paymentMethod === method.value}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="sr-only"
                          />
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            paymentMethod === method.value ? 'bg-[#1cc29f]' : 'bg-gray-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              paymentMethod === method.value ? 'text-white' : 'text-gray-600'
                            }`} />
                          </div>
                          <span className="flex-1">{method.label}</span>
                          {paymentMethod === method.value && (
                            <div className="w-5 h-5 rounded-full bg-[#1cc29f] flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="bg-[#e6f9f5] border-[#1cc29f]">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current balance:</span>
                    <span className={isOwed ? 'text-green-600' : 'text-orange-600'}>
                      ${Math.abs(friend.balance).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment amount:</span>
                    <span className="text-[#1cc29f]">
                      ${parseFloat(amount || '0').toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#1cc29f]/20">
                    <div className="flex justify-between">
                      <span>New balance:</span>
                      <span className={
                        Math.abs(friend.balance) - parseFloat(amount || '0') === 0
                          ? 'text-[#1cc29f]'
                          : isOwed ? 'text-green-600' : 'text-orange-600'
                      }>
                        {Math.abs(friend.balance) - parseFloat(amount || '0') <= 0
                          ? 'Settled up ✓'
                          : `$${(Math.abs(friend.balance) - parseFloat(amount || '0')).toFixed(2)}`
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('balances')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#1cc29f] hover:bg-[#17a588]"
              >
                Record payment
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
