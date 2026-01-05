"use client"
import { useSignupForm } from '@/src/hooks/useAuthForm';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';

function SignupPageContent() {
  const { formData, fieldErrors, handleFieldChange, handleFormSubmit, isLoading, navigate } = useSignupForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1cc29f] to-[#17a588] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#1cc29f]" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
          </div>
          <h1 className="text-white mb-2">SplitWise</h1>
          <p className="text-white/90">Join thousands sharing expenses</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Get started with SplitWise today</CardDescription>
          </CardHeader>
          <form onSubmit={handleFormSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name')(e.target.value)}
                  className={`bg-input-background ${fieldErrors.name ? 'border-red-500' : ''}`}
                />
                {fieldErrors.name && (
                  <p className="text-sm text-red-500">{fieldErrors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email')(e.target.value)}
                  className={`bg-input-background ${fieldErrors.email ? 'border-red-500' : ''}`}
                />
                {fieldErrors.email && (
                  <p className="text-sm text-red-500">{fieldErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleFieldChange('password')(e.target.value)}
                  className={`bg-input-background ${fieldErrors.password ? 'border-red-500' : ''}`}
                />
                {fieldErrors.password && (
                  <p className="text-sm text-red-500">{fieldErrors.password}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword || ''}
                  onChange={(e) => handleFieldChange('confirmPassword')(e.target.value)}
                  className={`bg-input-background ${fieldErrors.confirmPassword ? 'border-red-500' : ''}`}
                />
                {fieldErrors.confirmPassword && (
                  <p className="text-sm text-red-500">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3 mt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1cc29f] hover:bg-[#17a588]"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
              <div className="text-center">
                <span className="text-muted-foreground mr-1">Already have an account?</span>
                <button
                  type="button"
                  onClick={() => navigate('login')}
                  className="text-[#1cc29f] hover:underline"
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
  return <SignupPageContent />;
}
