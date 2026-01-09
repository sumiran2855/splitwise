"use client"
import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Wallet, Mail, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pt-12 pb-2 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto shadow-lg">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {sent ? "Check Your Email" : "Reset Password"}
              </CardTitle>
              <CardDescription className="text-base text-gray-600 mt-3 px-4">
                {sent 
                  ? "We've sent you a password reset link to your email address" 
                  : "Enter your email and we'll send you instructions to reset your password"}
              </CardDescription>
            </div>
          </CardHeader>
          {!sent ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 px-8">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 pl-12 bg-gray-50 border-0 rounded-xl text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 px-8 pb-12 mt-4">
                <Button 
                  type="submit" 
                  className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white text-base font-semibold rounded-xl shadow-lg"
                >
                  Send Reset Link
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('login')}
                  className="w-full h-12 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl font-medium"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="px-8 pb-12">
              <div className="text-center py-6 space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-gray-600 leading-relaxed px-4">
                  Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                </p>
                <Button
                  onClick={() => navigate('login')}
                  className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white text-base font-semibold rounded-xl shadow-lg"
                >
                  Return to Login
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
