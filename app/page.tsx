"use client";
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Users, DollarSign, BarChart3, Shield } from 'lucide-react';
import { useNavigation } from '@/src/contexts/navigationContext';

export default function WelcomePage() {
  const { navigate } = useNavigation();
  const features = [
    {
      icon: Users,
      title: 'Split with friends',
      description: 'Easily divide expenses with friends, family, or roommates',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: DollarSign,
      title: 'Track balances',
      description: 'Keep track of who owes what and settle up with ease',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: BarChart3,
      title: 'Get insights',
      description: 'Visualize your spending patterns and make better decisions',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Shield,
      title: 'Stay organized',
      description: 'Create groups for trips, households, and events',
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1cc29f] to-[#17a588] flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-white text-5xl mb-4">Welcome to SplitWise</h1>
          <p className="text-white/90 text-xl max-w-2xl mx-auto">
            The easiest way to share expenses with friends and keep track of who owes what
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-full ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center space-y-4">
          <Button
            onClick={() => navigate('login')}
            size="lg"
            className="bg-white text-[#1cc29f] hover:bg-gray-100 px-12 h-14"
          >
            Get started
          </Button>
          <p className="text-white/80">
            Join millions of users splitting expenses worldwide
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-16 text-center">
          <div>
            <div className="text-4xl text-white mb-2">10M+</div>
            <p className="text-white/80">Active users</p>
          </div>
          <div>
            <div className="text-4xl text-white mb-2">$2B+</div>
            <p className="text-white/80">Settled up</p>
          </div>
          <div>
            <div className="text-4xl text-white mb-2">180+</div>
            <p className="text-white/80">Countries</p>
          </div>
        </div>
      </div>
    </div>
  );
}