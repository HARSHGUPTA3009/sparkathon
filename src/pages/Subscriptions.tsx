
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Star, Zap, Crown, Users } from 'lucide-react';

const Subscriptions = () => {
  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: '/month',
      description: 'Perfect for small mess operations',
      icon: Users,
      color: 'from-slate-600 to-slate-700',
      borderColor: 'border-slate-600',
      popular: false,
      features: [
        { name: 'Basic analytics dashboard', included: true },
        { name: 'Up to 100 students', included: true },
        { name: 'Manual leftover logging', included: true },
        { name: 'Weekly reports', included: true },
        { name: 'Email support', included: true },
        { name: 'Advanced forecasting', included: false },
        { name: 'Real-time notifications', included: false },
        { name: 'API access', included: false },
        { name: 'Custom integrations', included: false },
        { name: 'Priority support', included: false }
      ]
    },
    {
      name: 'Pro',
      price: '₹2,999',
      period: '/month',
      description: 'Advanced features for growing institutions',
      icon: Star,
      color: 'from-emerald-600 to-green-600',
      borderColor: 'border-emerald-500',
      popular: true,
      features: [
        { name: 'Advanced analytics dashboard', included: true },
        { name: 'Up to 1,000 students', included: true },
        { name: 'Automated leftover tracking', included: true },
        { name: 'Daily & weekly reports', included: true },
        { name: 'Email & chat support', included: true },
        { name: 'Advanced forecasting', included: true },
        { name: 'Real-time notifications', included: true },
        { name: 'Basic API access', included: true },
        { name: 'Custom integrations', included: false },
        { name: 'Priority support', included: false }
      ]
    },
    {
      name: 'Enterprise',
      price: '₹9,999',
      period: '/month',
      description: 'Complete solution for large institutions',
      icon: Crown,
      color: 'from-purple-600 to-indigo-600',
      borderColor: 'border-purple-500',
      popular: false,
      features: [
        { name: 'Premium analytics suite', included: true },
        { name: 'Unlimited students', included: true },
        { name: 'AI-powered optimization', included: true },
        { name: 'Real-time reports & alerts', included: true },
        { name: '24/7 dedicated support', included: true },
        { name: 'Predictive analytics', included: true },
        { name: 'Smart notifications', included: true },
        { name: 'Full API access', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'Priority support', included: true }
      ]
    }
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan 💸</h1>
        <p className="text-xl text-slate-400 mb-2">Scale your sustainable mess management</p>
        <p className="text-slate-500">All plans include core eco-tracking features</p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          
          return (
            <div key={index} className="relative">
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-emerald-500 text-white px-4 py-1 text-sm font-medium">
                    <Zap className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <Card className={`h-full bg-slate-800/50 backdrop-blur-md border-2 ${plan.borderColor} hover:bg-slate-800/70 transition-all duration-300 ${plan.popular ? 'scale-105 shadow-2xl' : 'hover:scale-102'}`}>
                <CardHeader className="text-center pb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} mb-4 mx-auto`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-slate-400 mb-4">
                    {plan.description}
                  </CardDescription>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          feature.included 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {feature.included ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                        </div>
                        <span className={`text-sm ${
                          feature.included ? 'text-slate-300' : 'text-slate-500'
                        }`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                        : plan.name === 'Free'
                        ? 'bg-slate-600 hover:bg-slate-700 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                    size="lg"
                  >
                    {plan.name === 'Free' ? 'Get Started Free' : 'Upgrade Now'}
                  </Button>
                  
                  {plan.name !== 'Free' && (
                    <p className="text-center text-xs text-slate-500 mt-3">
                      30-day money-back guarantee
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
        <Card className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 backdrop-blur-md border-emerald-700/50">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-full">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Eco Impact Guarantee</h3>
            </div>
            <p className="text-emerald-100 leading-relaxed">
              All plans help reduce food waste by at least 30% within the first month. 
              Track your environmental impact with real-time CO₂ savings and waste reduction metrics.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-md border-blue-700/50">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Dedicated Support</h3>
            </div>
            <p className="text-blue-100 leading-relaxed">
              Get personalized onboarding, training sessions, and ongoing support to maximize 
              your sustainability goals. Our team helps you achieve better results faster.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
            <CardContent className="p-6">
              <h4 className="font-semibold text-white mb-2">Can I change plans anytime?</h4>
              <p className="text-slate-400 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
            <CardContent className="p-6">
              <h4 className="font-semibold text-white mb-2">Is there a setup fee?</h4>
              <p className="text-slate-400 text-sm">No setup fees for any plan. Start tracking your sustainability impact immediately.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
            <CardContent className="p-6">
              <h4 className="font-semibold text-white mb-2">What payment methods do you accept?</h4>
              <p className="text-slate-400 text-sm">We accept all major credit cards, UPI, and bank transfers for annual plans.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
            <CardContent className="p-6">
              <h4 className="font-semibold text-white mb-2">Do you offer custom pricing?</h4>
              <p className="text-slate-400 text-sm">Yes, for institutions with 2000+ students, we offer custom pricing and features.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
