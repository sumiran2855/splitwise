"use client";
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Users, DollarSign, BarChart3, Shield, ArrowRight, CheckCircle, Wallet } from 'lucide-react';
import { useNavigation } from '@/src/contexts/navigationContext';

export default function WelcomePage() {
  const { navigate } = useNavigation();
  const features = [
    {
      icon: Users,
      title: 'Split with Friends',
      description: 'Easily divide expenses with friends, family, or roommates',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      icon: DollarSign,
      title: 'Track Balances',
      description: 'Keep track of who owes what and settle up with ease',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: BarChart3,
      title: 'Get Insights',
      description: 'Visualize your spending patterns and make better decisions',
      color: 'bg-violet-50 text-violet-600',
    },
    {
      icon: Shield,
      title: 'Stay Organized',
      description: 'Create groups for trips, households, and events',
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  const benefits = [
    'No ads, no premium features locked away',
    'Free for personal use, forever',
    'Sync across all your devices',
    'Secure and private'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/60 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div className="text-gray-900 text-2xl font-bold">SplitEase</div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-block mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200/50">
            <span className="text-gray-700 text-sm font-medium">Trusted by 10M+ users worldwide</span>
          </div>

          <h1 className="text-gray-900 text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Share Expenses<br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Effortlessly</span>
          </h1>

          <p className="text-gray-700 text-lg sm:text-xl max-w-2xl mx-auto mb-8 px-4">
            The easiest way to share expenses with friends and keep track of who owes what
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <Button
              onClick={() => navigate('login')}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 h-12 sm:h-14 text-base sm:text-lg font-semibold shadow-xl w-full sm:w-auto"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 lg:mb-20 px-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 sm:p-12 mb-16 lg:mb-20 mx-4 border border-gray-200/50 shadow-xl">
          <h2 className="text-gray-900 text-2xl sm:text-3xl font-bold mb-8 text-center">
            Why Choose SplitEase?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-base sm:text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 text-center px-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 shadow-lg">
            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">10M+</div>
            <p className="text-gray-700 text-base sm:text-lg font-medium">Active Users</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 shadow-lg">
            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">$2B+</div>
            <p className="text-gray-700 text-base sm:text-lg font-medium">Settled Up</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 shadow-lg">
            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">180+</div>
            <p className="text-gray-700 text-base sm:text-lg font-medium">Countries</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/40 backdrop-blur-sm border-t border-gray-200/50 mt-12 lg:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-gray-600 text-sm">
            © 2024 SplitEase. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}