"use client"
import { useSignupForm } from '@/src/hooks/useAuthForm';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { AuthFormProvider } from '@/src/contexts/authFormContext';
import { SignupRequest } from '@/src/services/interfaces/IAuthService';
import { Wallet, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useState } from 'react';

function SignupPageContent() {
  const { formData, fieldErrors, handleFieldChange, handleFormSubmit, isLoading, navigate } = useSignupForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pt-12 pb-2 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto shadow-lg">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Create Your Account</CardTitle>
              <CardDescription className="text-base text-gray-600 mt-3 px-4">
                 Create your free account and start managing expenses in minutes
              </CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={handleFormSubmit}>
            <CardContent className="space-y-4 px-8">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name')(e.target.value)}
                    className={`h-14 pl-12 bg-gray-50 border-0 rounded-xl text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500 ${fieldErrors.name ? 'ring-2 ring-red-500' : ''}`}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-sm text-red-500 pl-2">{fieldErrors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email')(e.target.value)}
                    className={`h-14 pl-12 bg-gray-50 border-0 rounded-xl text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500 ${fieldErrors.email ? 'ring-2 ring-red-500' : ''}`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-sm text-red-500 pl-2">{fieldErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleFieldChange('password')(e.target.value)}
                    className={`h-14 pl-12 pr-12 bg-gray-50 border-0 rounded-xl text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500 ${fieldErrors.password ? 'ring-2 ring-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-sm text-red-500 pl-2">{fieldErrors.password}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={formData.confirmPassword || ''}
                    onChange={(e) => handleFieldChange('confirmPassword')(e.target.value)}
                    className={`h-14 pl-12 pr-12 bg-gray-50 border-0 rounded-xl text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500 ${fieldErrors.confirmPassword ? 'ring-2 ring-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-sm text-red-500 pl-2">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-6 px-8 pb-12 mt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white text-base font-semibold rounded-xl shadow-lg"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>

              <div className="w-full">
                <p className="text-center text-sm text-gray-500 mb-4">Or sign up with</p>
                <div className="flex justify-center gap-4">
                  <button
                    type="button"
                    className="w-14 h-14 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                  >
                    <img src="/google-icon.svg" alt="Google" className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    className="w-14 h-14 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                  >
                    <img src="/facebook-icon.svg" alt="Facebook" className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    className="w-14 h-14 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                  >
                    <img src="/apple-icon.svg" alt="Apple" className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="text-center text-sm">
                <span className="text-gray-600">Already have an account?</span>
                <button
                  type="button"
                  onClick={() => navigate('login')}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold ml-1"
                >
                  Sign in
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const initialData: SignupRequest = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  return (
    <AuthFormProvider initialData={initialData}>
      <SignupPageContent />
    </AuthFormProvider>
  );
}