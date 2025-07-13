
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Users, Package, Car, TreePine, Zap, Award } from 'lucide-react';
import { localStorageService } from '@/services/localStorageService';
import Confetti from 'react-confetti';

const Dashboard = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [adminStats, setAdminStats] = useState(localStorageService.getAdminStats());

  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateWindowDimensions();
    window.addEventListener('resize', updateWindowDimensions);
    
    // Load fresh data
    setAdminStats(localStorageService.getAdminStats());
    
    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, []);

  // Calculate real stats from stored data
  const forecasts = localStorageService.getForecasts();
  const leftovers = localStorageService.getLeftovers();
  const subscriptions = localStorageService.getSubscriptions();

  const optOutData = [
    { name: 'Opted In', value: 35, color: '#ef4444' },
    { name: 'Opted Out', value: 65, color: '#10b981' }
  ];

  const weeklyTrend = [
    { day: 'Mon', optOut: 62, co2Saved: 45 },
    { day: 'Tue', optOut: 58, co2Saved: 52 },
    { day: 'Wed', optOut: 71, co2Saved: 68 },
    { day: 'Thu', optOut: 65, co2Saved: 61 },
    { day: 'Fri', optOut: 73, co2Saved: 72 },
    { day: 'Sat', optOut: 45, co2Saved: 38 },
    { day: 'Sun', optOut: 41, co2Saved: 35 }
  ];

  const leftoverData = leftovers.slice(0, 7).map(entry => ({
    day: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
    amount: entry.quantity
  }));

  const handleMilestoneClick = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const stats = [
    {
      title: 'Total Users',
      value: adminStats.totalUsers.toString(),
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-emerald-400'
    },
    {
      title: 'Active Subscriptions',
      value: subscriptions.filter(s => s.status === 'active').length.toString(),
      change: '+8.3%',
      trend: 'up',
      icon: TreePine,
      color: 'text-green-400'
    },
    {
      title: 'Total Forecasts',
      value: forecasts.length.toString(),
      change: '+15%',
      trend: 'up',
      icon: Package,
      color: 'text-blue-400'
    },
    {
      title: 'Total Revenue',
      value: `₹${adminStats.totalRevenue.toLocaleString()}`,
      change: '+6.2%',
      trend: 'up',
      icon: Zap,
      color: 'text-yellow-400'
    }
  ];

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard 🎛️</h1>
          <p className="text-slate-400">Monitor and manage the EcoMess system</p>
        </div>
        <div 
          className="cursor-pointer"
          onClick={handleMilestoneClick}
        >
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Award className="w-5 h-5" />
              System Running Smoothly! 🎉
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <Card key={index} className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-slate-700/50`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                    <TrendIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opt-out Pie Chart */}
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">System Status Overview</CardTitle>
            <CardDescription className="text-slate-400">
              Current operational metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={optOutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {optOutData.map((entry, index) => (
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
              {optOutData.map((entry, index) => (
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

        {/* Weekly Trend */}
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Weekly Performance Trend</CardTitle>
            <CardDescription className="text-slate-400">
              System efficiency and sustainability metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend}>
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
                    dataKey="optOut" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    name="Opt-out %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="co2Saved" 
                    stroke="#34d399" 
                    strokeWidth={2}
                    dot={{ fill: '#34d399', strokeWidth: 2, r: 3 }}
                    name="CO₂ Saved (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 backdrop-blur-md border-blue-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <p className="text-blue-100 text-lg">Latest Forecasts</p>
                <p className="text-2xl font-bold text-white">{forecasts.length} predictions</p>
                <p className="text-blue-300 text-sm">Active monitoring</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-md border-orange-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <Package className="w-8 h-8 text-orange-400" />
              </div>
              <div>
                <p className="text-orange-100 text-lg">Leftover Tracking</p>
                <p className="text-2xl font-bold text-white">{leftovers.length} entries</p>
                <p className="text-orange-300 text-sm">Waste management</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md border-purple-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <p className="text-purple-100 text-lg">User Subscriptions</p>
                <p className="text-2xl font-bold text-white">{subscriptions.length} accounts</p>
                <p className="text-purple-300 text-sm">Revenue management</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leftover Trends */}
      {leftoverData.length > 0 && (
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Recent Leftover Trends</CardTitle>
            <CardDescription className="text-slate-400">
              Food waste tracking over recent entries (kg)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leftoverData}>
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
                  <Bar 
                    dataKey="amount" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    name="Leftovers (kg)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
