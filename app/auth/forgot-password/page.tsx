"use client"
import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { useNavigation } from '@/src/contexts/navigationContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { navigate } = useNavigation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSent(true);
      toast.success('Password reset link sent to your email');
    } else {
      toast.error('Please enter your email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1cc29f] to-[#17a588] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#1cc29f]" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
          </div>
          <h1 className="text-white mb-2">SplitWise</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reset password</CardTitle>
            <CardDescription>
              {sent 
                ? "We've sent you a password reset link" 
                : "Enter your email to receive a reset link"}
            </CardDescription>
          </CardHeader>
          {!sent ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input-background"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3 mt-4">
                <Button type="submit" className="w-full bg-[#1cc29f] hover:bg-[#17a588]">
                  Send reset link
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('login')}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </Button>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-4 mt-4">
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-[#e6f9f5] mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#1cc29f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-muted-foreground mb-6">
                  Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                </p>
                <Button
                  onClick={() => navigate('login')}
                  className="bg-[#1cc29f] hover:bg-[#17a588]"
                >
                  Return to login
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
