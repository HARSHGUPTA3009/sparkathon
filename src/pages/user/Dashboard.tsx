
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Utensils, TrendingUp, TreePine, Car, Zap, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';
import { toast } from '@/hooks/use-toast';

const UserDashboard = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [nextMealOptOut, setNextMealOptOut] = useState(false);
  const [userStats, setUserStats] = useState({
    totalOptOuts: 12,
    totalOptIns: 8,
    co2SavedKg: 2.4,
    streakDays: 5
  });

  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateWindowDimensions();
    window.addEventListener('resize', updateWindowDimensions);
    
    // Load user preferences
    const savedOptOut = localStorage.getItem('next-meal-opt-out');
    if (savedOptOut) {
      setNextMealOptOut(JSON.parse(savedOptOut));
    }
    
    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, []);

  const handleOptOutToggle = (checked: boolean) => {
    setNextMealOptOut(checked);
    localStorage.setItem('next-meal-opt-out', JSON.stringify(checked));
    
    if (checked) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Update stats
      setUserStats(prev => ({
        ...prev,
        totalOptOuts: prev.totalOptOuts + 1,
        co2SavedKg: prev.co2SavedKg + 0.2
      }));
      
      toast({
        title: "Amazing! 🌱",
        description: "You're helping the planet with every choice!",
      });
    }
  };

  // Simulated data
  const optInOutData = [
    { name: 'Opted Out', value: userStats.totalOptOuts, color: '#10b981' },
    { name: 'Opted In', value: userStats.totalOptIns, color: '#3b82f6' }
  ];

  const weeklyImpact = [
    { day: 'Mon', co2Saved: 0.3 },
    { day: 'Tue', co2Saved: 0.5 },
    { day: 'Wed', co2Saved: 0.2 },
    { day: 'Thu', co2Saved: 0.4 },
    { day: 'Fri', co2Saved: 0.6 },
    { day: 'Sat', co2Saved: 0.3 },
    { day: 'Sun', co2Saved: 0.1 }
  ];

  const drivingKmSaved = (userStats.co2SavedKg * 8).toFixed(1);
  const treesEquivalent = (userStats.co2SavedKg / 0.3).toFixed(1);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          colors={['#10b981', '#34d399', '#6ee7b7', '#a7f3d0']}
        />
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Your Eco Impact 🌍</h1>
        <p className="text-slate-400">Every small choice makes a big difference!</p>
      </div>

      {/* Quick Toggle Card */}
      <Card className="bg-gradient-to-r from-emerald-900/50 to-green-900/50 backdrop-blur-md border-emerald-700/50 hover:bg-emerald-900/60 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Utensils className="w-6 h-6 text-emerald-400" />
            Tomorrow's Lunch Decision
          </CardTitle>
          <CardDescription className="text-emerald-100">
            {nextMealOptOut ? "You're skipping tomorrow's lunch to help the planet! 🌱" : "Will you join tomorrow's lunch?"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Switch
                checked={nextMealOptOut}
                onCheckedChange={handleOptOutToggle}
                className="data-[state=checked]:bg-emerald-500"
              />
              <span className="text-white font-medium">
                {nextMealOptOut ? "Opt Out to Help 🌍" : "Opt In for Lunch"}
              </span>
            </div>
            {nextMealOptOut && (
              <div className="flex items-center gap-2 text-emerald-300">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Great choice!</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Opt-outs</p>
                <p className="text-2xl font-bold text-emerald-400">{userStats.totalOptOuts}</p>
              </div>
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">CO₂ Saved</p>
                <p className="text-2xl font-bold text-green-400">{userStats.co2SavedKg}kg</p>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TreePine className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Driving Skipped</p>
                <p className="text-2xl font-bold text-blue-400">{drivingKmSaved}km</p>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Car className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Streak Days</p>
                <p className="text-2xl font-bold text-yellow-400">{userStats.streakDays}</p>
              </div>
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opt In/Out Pie Chart */}
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Your Meal Choices</CardTitle>
            <CardDescription className="text-slate-400">
              Your personal opt-in vs opt-out pattern
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={optInOutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {optInOutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {optInOutData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-slate-300 text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Impact Chart */}
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Weekly CO₂ Impact</CardTitle>
            <CardDescription className="text-slate-400">
              Your daily environmental contribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyImpact}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="co2Saved" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    name="CO₂ Saved (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact Equivalents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 backdrop-blur-md border-blue-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Car className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <p className="text-blue-100 text-lg">🎉 You saved equivalent to</p>
                <p className="text-2xl font-bold text-white">~{drivingKmSaved} km drive skipped! 🚗</p>
                <p className="text-blue-300 text-sm">Based on your {userStats.co2SavedKg}kg CO₂ saved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-md border-green-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-full">
                <TreePine className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <p className="text-green-100 text-lg">Your personal impact</p>
                <p className="text-2xl font-bold text-white">~{treesEquivalent} trees helped! 🌳</p>
                <p className="text-green-300 text-sm">Equivalent tree CO₂ absorption</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
