
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, Calendar, TrendingDown, Leaf, RefreshCw, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { toast } from '@/hooks/use-toast';
import { localStorageService, LeftoverData } from '@/services/localStorageService';

const Leftovers = () => {
  const [leftovers, setLeftovers] = useState<LeftoverData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    mealType: '',
    quantity: '',
    category: '',
    notes: '',
    waste: ''
  });

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  const categories = ['Rice', 'Dal', 'Vegetables', 'Bread', 'Curry', 'Snacks', 'Meat', 'Other'];

  useEffect(() => {
    loadLeftovers();
  }, []);

  const loadLeftovers = () => {
    const data = localStorageService.getLeftovers();
    setLeftovers(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.mealType || !formData.quantity || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newLeftover = localStorageService.addLeftover({
      date: new Date().toISOString().split('T')[0],
      mealType: formData.mealType,
      quantity: parseFloat(formData.quantity),
      category: formData.category,
      notes: formData.notes,
      waste: parseFloat(formData.waste) || 0
    });

    setLeftovers([newLeftover, ...leftovers]);
    setFormData({
      mealType: '',
      quantity: '',
      category: '',
      notes: '',
      waste: ''
    });
    setShowAddForm(false);

    toast({
      title: "Leftover Logged! 🌿",
      description: "Successfully recorded today's leftover data.",
    });
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Date,Meal Type,Category,Quantity (kg),Waste (kg),Reduction %,Notes\n" +
      leftovers.map(entry => 
        `${entry.date},${entry.mealType},${entry.category},${entry.quantity},${entry.waste},${entry.reduction.toFixed(1)},${entry.notes}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leftovers_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Data Exported! 📊",
      description: "Leftover data has been exported to CSV.",
    });
  };

  // Calculate statistics
  const totalQuantity = leftovers.reduce((sum, entry) => sum + entry.quantity, 0);
  const totalWaste = leftovers.reduce((sum, entry) => sum + entry.waste, 0);
  const avgReduction = leftovers.length > 0 ? leftovers.reduce((sum, entry) => sum + entry.reduction, 0) / leftovers.length : 0;
  const todayEntries = leftovers.filter(entry => entry.date === new Date().toISOString().split('T')[0]);

  // Chart data
  const weeklyTrend = leftovers.slice(0, 7).reverse().map(entry => ({
    day: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
    quantity: entry.quantity,
    waste: entry.waste,
    saved: entry.quantity - entry.waste
  }));

  const categoryBreakdown = categories.map(category => {
    const categoryData = leftovers.filter(entry => entry.category === category);
    const totalQty = categoryData.reduce((sum, entry) => sum + entry.quantity, 0);
    return {
      name: category,
      value: totalQty,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'][categories.indexOf(category)]
    };
  }).filter(item => item.value > 0);

  const reductionTrend = leftovers.slice(0, 10).reverse().map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    reduction: entry.reduction,
    meal: entry.mealType
  }));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Leftover Management 📝</h1>
          <p className="text-slate-400">Track and analyze food leftover patterns</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={exportData} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={loadLeftovers} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Log Leftover
          </Button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Log Today's Leftovers 🌿
            </CardTitle>
            <CardDescription className="text-slate-400">
              Record leftover quantities and details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mealType" className="text-slate-300">Meal Type *</Label>
                <Select value={formData.mealType} onValueChange={(value) => setFormData({...formData, mealType: value})}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {mealTypes.map((type) => (
                      <SelectItem key={type} value={type} className="text-white hover:bg-slate-700">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-slate-300">Food Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="text-white hover:bg-slate-700">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-slate-300">Leftover Quantity (kg) *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  placeholder="0.0"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="waste" className="text-slate-300">Actual Waste (kg)</Label>
                <Input
                  id="waste"
                  type="number"
                  step="0.1"
                  value={formData.waste}
                  onChange={(e) => setFormData({...formData, waste: e.target.value})}
                  placeholder="0.0"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="notes" className="text-slate-300">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional observations or reasons..."
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  rows={3}
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3 flex gap-3">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Log Leftover Entry
                </Button>
                <Button type="button" onClick={() => setShowAddForm(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Package className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Logged</p>
                <p className="text-2xl font-bold text-white">{totalQuantity.toFixed(1)} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Actual Waste</p>
                <p className="text-2xl font-bold text-white">{totalWaste.toFixed(1)} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Avg Reduction</p>
                <p className="text-2xl font-bold text-white">{avgReduction.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Calendar className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Today's Entries</p>
                <p className="text-2xl font-bold text-white">{todayEntries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Weekly Leftover Trend</CardTitle>
            <CardDescription className="text-slate-400">
              Daily quantities and waste reduction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrend}>
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
                  <Bar dataKey="quantity" fill="#3b82f6" name="Total Quantity (kg)" />
                  <Bar dataKey="waste" fill="#ef4444" name="Waste (kg)" />
                  <Bar dataKey="saved" fill="#10b981" name="Saved (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Category Breakdown</CardTitle>
            <CardDescription className="text-slate-400">
              Leftover distribution by food category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
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
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryBreakdown.map((entry, index) => (
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
      </div>

      {/* Recent Entries Table */}
      <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Recent Leftover History</CardTitle>
          <CardDescription className="text-slate-400">
            Latest entries and patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300">Date</th>
                  <th className="text-left py-3 px-4 text-slate-300">Meal</th>
                  <th className="text-left py-3 px-4 text-slate-300">Category</th>
                  <th className="text-left py-3 px-4 text-slate-300">Quantity</th>
                  <th className="text-left py-3 px-4 text-slate-300">Waste</th>
                  <th className="text-left py-3 px-4 text-slate-300">Reduction</th>
                  <th className="text-left py-3 px-4 text-slate-300">Notes</th>
                </tr>
              </thead>
              <tbody>
                {leftovers.slice(0, 10).map((entry) => (
                  <tr key={entry.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                    <td className="py-3 px-4 text-white">{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                        {entry.mealType}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        {entry.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-white font-medium">{entry.quantity} kg</td>
                    <td className="py-3 px-4 text-red-400 font-medium">{entry.waste} kg</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${entry.reduction > 70 ? 'text-emerald-400' : entry.reduction > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {entry.reduction.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate">
                      {entry.notes || 'No notes'}
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

export default Leftovers;
