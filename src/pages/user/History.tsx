
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';

const UserHistory = () => {
  // Simulated user meal history
  const [mealHistory] = useState([
    { date: '2024-01-15', meal: 'Lunch', status: 'taken', waste: false },
    { date: '2024-01-15', meal: 'Dinner', status: 'opted-out', waste: false },
    { date: '2024-01-14', meal: 'Lunch', status: 'taken', waste: true },
    { date: '2024-01-14', meal: 'Dinner', status: 'opted-out', waste: false },
    { date: '2024-01-13', meal: 'Lunch', status: 'opted-out', waste: false },
    { date: '2024-01-13', meal: 'Dinner', status: 'taken', waste: false },
    { date: '2024-01-12', meal: 'Lunch', status: 'taken', waste: false },
    { date: '2024-01-12', meal: 'Dinner', status: 'opted-out', waste: false },
    { date: '2024-01-11', meal: 'Lunch', status: 'opted-out', waste: false },
    { date: '2024-01-11', meal: 'Dinner', status: 'taken', waste: true },
  ]);

  const getStatusIcon = (status: string, waste: boolean) => {
    if (status === 'opted-out') return <X className="w-4 h-4 text-emerald-400" />;
    if (waste) return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    return <Check className="w-4 h-4 text-green-400" />;
  };

  const getStatusBadge = (status: string, waste: boolean) => {
    if (status === 'opted-out') {
      return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Opted Out 🌱</Badge>;
    }
    if (waste) {
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Taken but Wasted 😬</Badge>;
    }
    return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Taken & Finished ✅</Badge>;
  };

  const stats = {
    totalMeals: mealHistory.length,
    optedOut: mealHistory.filter(m => m.status === 'opted-out').length,
    taken: mealHistory.filter(m => m.status === 'taken').length,
    wasted: mealHistory.filter(m => m.waste).length,
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Your Meal History 📊</h1>
        <p className="text-slate-400">Track your eco-choices and impact over time</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalMeals}</p>
            <p className="text-sm text-slate-400">Total Meals</p>
          </CardContent>
        </Card>

        <Card className="bg-emerald-900/30 backdrop-blur-md border-emerald-700/50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <X className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400">{stats.optedOut}</p>
            <p className="text-sm text-emerald-300">Opted Out</p>
          </CardContent>
        </Card>

        <Card className="bg-green-900/30 backdrop-blur-md border-green-700/50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Check className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">{stats.taken - stats.wasted}</p>
            <p className="text-sm text-green-300">Clean Plates</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-900/30 backdrop-blur-md border-yellow-700/50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-yellow-400">{stats.wasted}</p>
            <p className="text-sm text-yellow-300">Wasted</p>
          </CardContent>
        </Card>
      </div>

      {/* Meal History */}
      <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Recent Meal Decisions
          </CardTitle>
          <CardDescription className="text-slate-400">
            Your latest choices and their environmental impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mealHistory.map((meal, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-slate-600/50 rounded-full">
                    {getStatusIcon(meal.status, meal.waste)}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {meal.meal} - {new Date(meal.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {meal.status === 'opted-out' 
                        ? 'Helped reduce food waste! 🌱' 
                        : meal.waste 
                        ? 'Room for improvement next time' 
                        : 'Great job finishing your meal! 👏'
                      }
                    </p>
                  </div>
                </div>
                <div>
                  {getStatusBadge(meal.status, meal.waste)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact Summary */}
      <Card className="bg-gradient-to-r from-emerald-900/50 to-green-900/50 backdrop-blur-md border-emerald-700/50">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Your Eco Impact Summary 🌍</h3>
            <p className="text-emerald-100 mb-4">
              You've opted out of <span className="font-bold text-emerald-400">{stats.optedOut}</span> meals, 
              helping prevent food waste and reduce your carbon footprint!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-emerald-800/30 p-3 rounded-lg">
                <p className="text-emerald-300">
                  <span className="font-semibold">Opt-out Rate:</span> {Math.round((stats.optedOut / stats.totalMeals) * 100)}%
                </p>
              </div>
              <div className="bg-green-800/30 p-3 rounded-lg">
                <p className="text-green-300">
                  <span className="font-semibold">Clean Plate Rate:</span> {Math.round(((stats.taken - stats.wasted) / stats.taken) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserHistory;
