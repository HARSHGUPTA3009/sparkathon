
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { TrendingUp, Calendar, Target, BarChart3 } from 'lucide-react';

const Forecasts = () => {
  // Simulated forecast data
  const demandForecast = [
    { day: 'Today', predicted: 245, actual: 240, optOut: 65 },
    { day: 'Tomorrow', predicted: 220, actual: null, optOut: 68 },
    { day: 'Wed', predicted: 235, actual: null, optOut: 63 },
    { day: 'Thu', predicted: 210, actual: null, optOut: 71 },
    { day: 'Fri', predicted: 195, actual: null, optOut: 75 },
    { day: 'Sat', predicted: 280, actual: null, optOut: 45 },
    { day: 'Sun', predicted: 290, actual: null, optOut: 42 }
  ];

  const historicalTrend = [
    { week: 'Week 1', optIn: 78, optOut: 22, leftoverReduction: 15 },
    { week: 'Week 2', optIn: 72, optOut: 28, leftoverReduction: 22 },
    { week: 'Week 3', optIn: 65, optOut: 35, leftoverReduction: 28 },
    { week: 'Week 4', optIn: 58, optOut: 42, leftoverReduction: 35 },
    { week: 'Week 5', optIn: 52, optOut: 48, leftoverReduction: 41 },
    { week: 'Week 6', optIn: 47, optOut: 53, leftoverReduction: 43 },
    { week: 'Week 7', optIn: 41, optOut: 59, leftoverReduction: 48 },
    { week: 'Week 8', optIn: 38, optOut: 62, leftoverReduction: 52 }
  ];

  const leftoverTrend = [
    { month: 'Jan', amount: 45, reduction: 12 },
    { month: 'Feb', amount: 38, reduction: 15 },
    { month: 'Mar', amount: 32, reduction: 16 },
    { month: 'Apr', amount: 28, reduction: 13 },
    { month: 'May', amount: 24, reduction: 14 },
    { month: 'Jun', amount: 22, reduction: 8 }
  ];

  const insights = [
    {
      title: 'Peak Demand Prediction',
      value: '290 meals',
      subtitle: 'Expected this Sunday',
      icon: Calendar,
      color: 'text-blue-400'
    },
    {
      title: 'Opt-out Target',
      value: '75%',
      subtitle: 'Achievable by Friday',
      icon: Target,
      color: 'text-emerald-400'
    },
    {
      title: 'Leftover Reduction',
      value: '52%',
      subtitle: 'This month vs last',
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      title: 'Forecast Accuracy',
      value: '94.2%',
      subtitle: 'Last 30 days average',
      icon: BarChart3,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Demand Forecasts 📈</h1>
        <p className="text-slate-400">Predictive analytics for sustainable mess management</p>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          
          return (
            <Card key={index} className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-700/50">
                    <Icon className={`w-5 h-5 ${insight.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm">{insight.title}</p>
                    <p className="text-xl font-bold text-white">{insight.value}</p>
                    <p className="text-slate-500 text-xs mt-1">{insight.subtitle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Forecasts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Demand Forecast */}
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">7-Day Demand Forecast</CardTitle>
            <CardDescription className="text-slate-400">
              Predicted meal demand and opt-out rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={demandForecast}>
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
                    dataKey="predicted" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    name="Predicted Demand"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                    name="Actual Demand"
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Historical Opt-out Trend */}
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Historical Opt-out Trends</CardTitle>
            <CardDescription className="text-slate-400">
              8-week progression of sustainable choices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="week" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="optOut" 
                    stackId="1"
                    stroke="#10b981" 
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="Opt-out %"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="optIn" 
                    stackId="1"
                    stroke="#ef4444" 
                    fill="#ef4444"
                    fillOpacity={0.4}
                    name="Opt-in %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leftover Reduction Forecast */}
      <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Leftover Reduction Over Time</CardTitle>
          <CardDescription className="text-slate-400">
            Monthly leftover quantities and reduction percentage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leftoverTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="month" stroke="#94a3b8" />
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
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  name="Leftovers (kg)"
                />
                <Bar 
                  dataKey="reduction" 
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Reduction %"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Predictions Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 backdrop-blur-md border-blue-700/50">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Tomorrow's Prediction</h3>
            <p className="text-3xl font-bold text-blue-400 mb-1">220 meals</p>
            <p className="text-blue-200 text-sm">68% expected opt-out rate</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-900/50 to-green-900/50 backdrop-blur-md border-emerald-700/50">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Weekly Target</h3>
            <p className="text-3xl font-bold text-emerald-400 mb-1">70% opt-out</p>
            <p className="text-emerald-200 text-sm">On track to achieve by Thursday</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md border-purple-700/50">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Monthly Goal</h3>
            <p className="text-3xl font-bold text-purple-400 mb-1">60% reduction</p>
            <p className="text-purple-200 text-sm">Leftover waste minimization</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Forecasts;
