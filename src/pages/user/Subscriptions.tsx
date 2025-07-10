
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Star, Zap, Crown, User } from 'lucide-react';

const UserSubscriptions = () => {
  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: '/month',
      description: 'Perfect for eco-conscious beginners',
      icon: User,
      color: 'from-slate-600 to-slate-700',
      borderColor: 'border-slate-600',
      popular: false,
      features: [
        { name: 'Basic eco-tracking', included: true },
        { name: 'Personal impact dashboard', included: true },
        { name: 'Meal opt-in/out tracking', included: true },
        { name: 'Weekly eco-reports', included: true },
        { name: 'Basic EcoBot chat', included: true },
        { name: 'Advanced analytics', included: false },
        { name: 'Community challenges', included: false },
        { name: 'Carbon offset marketplace', included: false },
        { name: 'Premium EcoBot features', included: false },
        { name: 'Priority support', included: false }
      ]
    },
    {
      name: 'Eco Warrior',
      price: '₹99',
      period: '/month',
      description: 'For dedicated environmental champions',
      icon: Star,
      color: 'from-emerald-600 to-green-600',
      borderColor: 'border-emerald-500',
      popular: true,
      features: [
        { name: 'Advanced eco-tracking', included: true },
        { name: 'Detailed impact analytics', included: true },
        { name: 'Smart meal recommendations', included: true },
        { name: 'Daily & weekly reports', included: true },
        { name: 'Enhanced EcoBot with tips', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Community challenges', included: true },
        { name: 'Carbon offset suggestions', included: true },
        { name: 'Premium EcoBot features', included: false },
        { name: 'Priority support', included: false }
      ]
    },
    {
      name: 'Planet Guardian',
      price: '₹199',
      period: '/month',
      description: 'Maximum impact for eco-leaders',
      icon: Crown,
      color: 'from-purple-600 to-indigo-600',
      borderColor: 'border-purple-500',
      popular: false,
      features: [
        { name: 'Premium eco-tracking suite', included: true },
        { name: 'AI-powered insights', included: true },
        { name: 'Personalized eco-goals', included: true },
        { name: 'Real-time impact tracking', included: true },
        { name: 'AI EcoBot with predictions', included: true },
        { name: 'Comprehensive analytics', included: true },
        { name: 'Exclusive eco-challenges', included: true },
        { name: 'Carbon offset marketplace', included: true },
        { name: 'Premium EcoBot features', included: true },
        { name: 'Priority support', included: true }
      ]
    }
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Choose Your Eco Journey 🌱</h1>
        <p className="text-xl text-slate-400 mb-2">Amplify your environmental impact</p>
        <p className="text-slate-500">All plans help you make a difference, choose what fits your commitment level</p>
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
                    {plan.name === 'Free' ? 'Start Free Journey 🌱' : 'Upgrade Impact 🚀'}
                  </Button>
                  
                  {plan.name !== 'Free' && (
                    <p className="text-center text-xs text-slate-500 mt-3">
                      7-day free trial • Cancel anytime
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Additional Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
        <Card className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 backdrop-blur-md border-emerald-700/50">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-full">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Guaranteed Impact</h3>
            </div>
            <p className="text-emerald-100 leading-relaxed">
              Every plan helps you make a measurable difference. Track your CO₂ savings, 
              food waste reduction, and compare your impact with real-world equivalents 
              like cars off the road and trees planted.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-md border-blue-700/50">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Star className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Community Driven</h3>
            </div>
            <p className="text-blue-100 leading-relaxed">
              Join a community of like-minded eco-warriors. Share achievements, 
              participate in challenges, and inspire others to make sustainable choices. 
              Together, we can create a bigger impact.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Common Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
            <CardContent className="p-6">
              <h4 className="font-semibold text-white mb-2">Can I change plans anytime?</h4>
              <p className="text-slate-400 text-sm">Yes! Upgrade or downgrade your plan at any time. Your impact data stays with you always.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
            <CardContent className="p-6">
              <h4 className="font-semibold text-white mb-2">How do you calculate CO₂ savings?</h4>
              <p className="text-slate-400 text-sm">We use established environmental data to calculate real-world equivalents from your meal choices and waste reduction.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
            <CardContent className="p-6">
              <h4 className="font-semibold text-white mb-2">Is my data private?</h4>
              <p className="text-slate-400 text-sm">Absolutely! Your personal eco-journey data is private. We only show aggregated, anonymous community trends.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
            <CardContent className="p-6">
              <h4 className="font-semibold text-white mb-2">What payment methods do you accept?</h4>
              <p className="text-slate-400 text-sm">We accept all major credit cards, UPI, and digital wallets. All payments are secure and encrypted.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserSubscriptions;
