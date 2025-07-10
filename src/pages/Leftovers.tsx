
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, Calendar, TrendingDown, Leaf } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LeftoverEntry {
  id: string;
  date: string;
  mealType: string;
  quantity: number;
  category: string;
  notes: string;
  waste: number;
}

const Leftovers = () => {
  const [entries, setEntries] = useState<LeftoverEntry[]>([
    {
      id: '1',
      date: '2024-01-10',
      mealType: 'Lunch',
      quantity: 12,
      category: 'Rice',
      notes: 'Less demand than expected',
      waste: 5
    },
    {
      id: '2',
      date: '2024-01-10',
      mealType: 'Dinner',
      quantity: 8,
      category: 'Vegetables',
      notes: 'Curry leftover',
      waste: 3
    },
    {
      id: '3',
      date: '2024-01-09',
      mealType: 'Breakfast',
      quantity: 15,
      category: 'Bread',
      notes: 'Weekend low attendance',
      waste: 7
    },
    {
      id: '4',
      date: '2024-01-09',
      mealType: 'Lunch',
      quantity: 6,
      category: 'Dal',
      notes: 'Good portion control',
      waste: 2
    }
  ]);

  const [formData, setFormData] = useState({
    mealType: '',
    quantity: '',
    category: '',
    notes: '',
    waste: ''
  });

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  const categories = ['Rice', 'Dal', 'Vegetables', 'Bread', 'Curry', 'Snacks', 'Other'];

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

    const newEntry: LeftoverEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mealType: formData.mealType,
      quantity: parseFloat(formData.quantity),
      category: formData.category,
      notes: formData.notes,
      waste: parseFloat(formData.waste) || 0
    };

    setEntries([newEntry, ...entries]);
    setFormData({
      mealType: '',
      quantity: '',
      category: '',
      notes: '',
      waste: ''
    });

    toast({
      title: "Leftover Logged! 🌿",
      description: "Successfully recorded today's leftover data.",
    });
  };

  const totalQuantity = entries.reduce((sum, entry) => sum + entry.quantity, 0);
  const totalWaste = entries.reduce((sum, entry) => sum + entry.waste, 0);
  const avgReduction = totalWaste > 0 ? ((totalQuantity - totalWaste) / totalQuantity * 100) : 0;

  const todayEntries = entries.filter(entry => entry.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Leftover Management 📝</h1>
        <p className="text-slate-400">Track and analyze food leftover patterns</p>
      </div>

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
                <p className="text-2xl font-bold text-white">{totalQuantity} kg</p>
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
                <p className="text-2xl font-bold text-white">{totalWaste} kg</p>
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
                <p className="text-slate-400 text-sm">Reduction Rate</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Log Form */}
        <Card className="lg:col-span-1 bg-slate-800/50 backdrop-blur-md border-slate-700/50">
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
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="space-y-2">
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

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                Log Leftover Entry
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* History List */}
        <Card className="lg:col-span-2 bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Recent Leftover History</CardTitle>
            <CardDescription className="text-slate-400">
              Latest entries and patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {entries.map((entry) => (
                <div key={entry.id} className="border border-slate-700/50 rounded-lg p-4 bg-slate-700/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                          {entry.mealType}
                        </Badge>
                        <Badge variant="outline" className="text-blue-400 border-blue-400">
                          {entry.category}
                        </Badge>
                        <span className="text-slate-400 text-sm">{entry.date}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-white">
                          <strong>{entry.quantity} kg</strong> leftover
                        </span>
                        <span className="text-red-400">
                          <strong>{entry.waste} kg</strong> waste
                        </span>
                        <span className="text-emerald-400">
                          <strong>{((entry.quantity - entry.waste) / entry.quantity * 100).toFixed(1)}%</strong> saved
                        </span>
                      </div>
                      {entry.notes && (
                        <p className="text-slate-400 text-sm mt-2 italic">"{entry.notes}"</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leftovers;
