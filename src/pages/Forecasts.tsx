
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { TrendingUp, Calendar, Target, BarChart3, Plus, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { localStorageService, ForecastData } from '@/services/localStorageService';

const Forecasts = () => {
  const [forecasts, setForecasts] = useState<ForecastData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    mealType: '',
    predictedDemand: '',
    optOutRate: '',
    actualDemand: ''
  });

  useEffect(() => {
    loadForecasts();
  }, []);

  const loadForecasts = () => {
    const data = localStorageService.getForecasts();
    setForecasts(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.mealType || !formData.predictedDemand || !formData.optOutRate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newForecast = localStorageService.addForecast({
      date: formData.date,
      mealType: formData.mealType,
      predictedDemand: parseFloat(formData.predictedDemand),
      optOutRate: parseFloat(formData.optOutRate),
      actualDemand: formData.actualDemand ? parseFloat(formData.actualDemand) : undefined,
      accuracy: formData.actualDemand ? 
        (100 - Math.abs(parseFloat(formData.actualDemand) - parseFloat(formData.predictedDemand)) / parseFloat(formData.predictedDemand) * 100) : 
        undefined
    });

    setForecasts([newForecast, ...forecasts]);
    setFormData({ date: '', mealType: '', predictedDemand: '', optOutRate: '', actualDemand: '' });
    setShowAddForm(false);

    toast({
      title: "Forecast Added! 📊",
      description: "New forecast prediction has been saved successfully.",
    });
  };

  // Chart data preparation
  const weeklyForecast = forecasts.slice(0, 7).reverse().map(f => ({
    day: new Date(f.date).toLocaleDateString('en-US', { weekday: 'short' }),
    predicted: f.predictedDemand,
    actual: f.actualDemand || null,
    optOut: f.optOutRate
  }));

  const accuracyTrend = forecasts.filter(f => f.accuracy).slice(0, 10).reverse().map(f => ({
    date: new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    accuracy: f.accuracy,
    meal: f.mealType
  }));

  // Calculate insights
  const avgAccuracy = forecasts.filter(f => f.accuracy).reduce((sum, f) => sum + (f.accuracy || 0), 0) / forecasts.filter(f => f.accuracy).length || 0;
  const avgOptOut = forecasts.reduce((sum, f) => sum + f.optOutRate, 0) / forecasts.length || 0;
  const totalPredictions = forecasts.length;
  const todaysForecast = forecasts.find(f => f.date === new Date().toISOString().split('T')[0]);

  const insights = [
    {
      title: 'Forecast Accuracy',
      value: `${avgAccuracy.toFixed(1)}%`,
      subtitle: 'Average prediction accuracy',
      icon: Target,
      color: 'text-emerald-400'
    },
    {
      title: 'Avg Opt-out Rate',
      value: `${avgOptOut.toFixed(1)}%`,
      subtitle: 'Across all predictions',
      icon: TrendingUp,
      color: 'text-blue-400'
    },
    {
      title: 'Total Predictions',
      value: totalPredictions.toString(),
      subtitle: 'Forecasts generated',
      icon: BarChart3,
      color: 'text-purple-400'
    },
    {
      title: "Today's Forecast",
      value: todaysForecast ? `${todaysForecast.predictedDemand}` : 'N/A',
      subtitle: todaysForecast ? `${todaysForecast.optOutRate}% opt-out` : 'No prediction yet',
      icon: Calendar,
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Demand Forecasts 📈</h1>
          <p className="text-slate-400">Predictive analytics for sustainable mess management</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={loadForecasts} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Forecast
          </Button>
        </div>
      </div>

      {/* Add Forecast Form */}
      {showAddForm && (
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Create New Forecast</CardTitle>
            <CardDescription className="text-slate-400">
              Add a new demand prediction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-slate-300">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mealType" className="text-slate-300">Meal Type *</Label>
                <Select value={formData.mealType} onValueChange={(value) => setFormData({...formData, mealType: value})}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Select meal" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal) => (
                      <SelectItem key={meal} value={meal} className="text-white hover:bg-slate-700">
                        {meal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="predictedDemand" className="text-slate-300">Predicted Demand *</Label>
                <Input
                  id="predictedDemand"
                  type="number"
                  value={formData.predictedDemand}
                  onChange={(e) => setFormData({...formData, predictedDemand: e.target.value})}
                  placeholder="Number of meals"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="optOutRate" className="text-slate-300">Opt-out Rate (%) *</Label>
                <Input
                  id="optOutRate"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.optOutRate}
                  onChange={(e) => setFormData({...formData, optOutRate: e.target.value})}
                  placeholder="0-100"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="actualDemand" className="text-slate-300">Actual Demand</Label>
                <Input
                  id="actualDemand"
                  type="number"
                  value={formData.actualDemand}
                  onChange={(e) => setFormData({...formData, actualDemand: e.target.value})}
                  placeholder="Optional"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-5 flex gap-3">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Add Forecast
                </Button>
                <Button type="button" onClick={() => setShowAddForm(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Forecast */}
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">7-Day Demand Forecast</CardTitle>
            <CardDescription className="text-slate-400">
              Predicted vs actual meal demand
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyForecast}>
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

        {/* Accuracy Trend */}
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Forecast Accuracy Trend</CardTitle>
            <CardDescription className="text-slate-400">
              Prediction accuracy over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={accuracyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[80, 100]} />
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
                    dataKey="accuracy" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                    name="Accuracy %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Forecasts Table */}
      <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Recent Forecasts</CardTitle>
          <CardDescription className="text-slate-400">
            Latest prediction entries and their accuracy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300">Date</th>
                  <th className="text-left py-3 px-4 text-slate-300">Meal</th>
                  <th className="text-left py-3 px-4 text-slate-300">Predicted</th>
                  <th className="text-left py-3 px-4 text-slate-300">Actual</th>
                  <th className="text-left py-3 px-4 text-slate-300">Opt-out %</th>
                  <th className="text-left py-3 px-4 text-slate-300">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {forecasts.slice(0, 10).map((forecast) => (
                  <tr key={forecast.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                    <td className="py-3 px-4 text-white">{new Date(forecast.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-slate-300">{forecast.mealType}</td>
                    <td className="py-3 px-4 text-blue-400 font-medium">{forecast.predictedDemand}</td>
                    <td className="py-3 px-4 text-emerald-400 font-medium">
                      {forecast.actualDemand || 'Pending'}
                    </td>
                    <td className="py-3 px-4 text-yellow-400">{forecast.optOutRate}%</td>
                    <td className="py-3 px-4">
                      {forecast.accuracy ? (
                        <span className={`font-medium ${forecast.accuracy > 95 ? 'text-emerald-400' : forecast.accuracy > 90 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {forecast.accuracy.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-slate-500">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Forecasts;
