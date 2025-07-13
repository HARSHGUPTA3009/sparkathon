
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, TrendingUp, RefreshCw, Plus, Edit, Eye, Crown, Star, User, Search } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { toast } from '@/hooks/use-toast';
import { localStorageService, SubscriptionData } from '@/services/localStorageService';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    userEmail: '',
    planName: '',
    planPrice: '',
    status: 'active' as 'active' | 'inactive' | 'cancelled',
    startDate: '',
    endDate: ''
  });

  const planOptions = [
    { name: 'Free', price: 0, features: ['Basic eco-tracking', 'Personal dashboard', 'Weekly reports'] },
    { name: 'Eco Warrior', price: 99, features: ['Advanced tracking', 'Community challenges', 'Premium support'] },
    { name: 'Planet Guardian', price: 199, features: ['AI insights', 'Carbon marketplace', 'Priority support'] }
  ];

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = () => {
    const data = localStorageService.getSubscriptions();
    setSubscriptions(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userEmail || !formData.planName || !formData.planPrice || !formData.startDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const selectedPlan = planOptions.find(p => p.name === formData.planName);
    const newSubscription = localStorageService.addSubscription({
      userId: `user_${Date.now()}`,
      userEmail: formData.userEmail,
      planName: formData.planName,
      planPrice: parseFloat(formData.planPrice),
      status: formData.status,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      features: selectedPlan?.features || []
    });

    setSubscriptions([newSubscription, ...subscriptions]);
    setFormData({
      userEmail: '',
      planName: '',
      planPrice: '',
      status: 'active',
      startDate: '',
      endDate: ''
    });
    setShowAddForm(false);

    toast({
      title: "Subscription Added! 🎉",
      description: "New subscription has been created successfully.",
    });
  };

  const updateSubscriptionStatus = (id: string, status: 'active' | 'inactive' | 'cancelled') => {
    localStorageService.updateSubscription(id, { status });
    loadSubscriptions();
    toast({
      title: "Status Updated",
      description: `Subscription status changed to ${status}.`,
    });
  };

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.planName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
  const totalRevenue = subscriptions.filter(s => s.status === 'active').reduce((sum, s) => sum + s.planPrice, 0);
  const monthlyRevenue = totalRevenue; // Assuming monthly billing
  const churnRate = (subscriptions.filter(s => s.status === 'cancelled').length / subscriptions.length * 100) || 0;

  // Chart data
  const planDistribution = planOptions.map(plan => {
    const count = subscriptions.filter(s => s.planName === plan.name && s.status === 'active').length;
    return {
      name: plan.name,
      value: count,
      color: plan.name === 'Free' ? '#64748b' : plan.name === 'Eco Warrior' ? '#10b981' : '#8b5cf6'
    };
  }).filter(item => item.value > 0);

  const revenueData = [
    { month: 'Jan', revenue: 8500 },
    { month: 'Feb', revenue: 9200 },
    { month: 'Mar', revenue: 10100 },
    { month: 'Apr', revenue: 11300 },
    { month: 'May', revenue: 12100 },
    { month: 'Jun', revenue: totalRevenue }
  ];

  const statusStats = [
    { status: 'Active', count: activeSubscriptions, color: '#10b981' },
    { status: 'Inactive', count: subscriptions.filter(s => s.status === 'inactive').length, color: '#f59e0b' },
    { status: 'Cancelled', count: subscriptions.filter(s => s.status === 'cancelled').length, color: '#ef4444' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Subscription Management 💳</h1>
          <p className="text-slate-400">Monitor and manage user subscriptions</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={loadSubscriptions} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Subscription
          </Button>
        </div>
      </div>

      {/* Add Subscription Form */}
      {showAddForm && (
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Create New Subscription</CardTitle>
            <CardDescription className="text-slate-400">
              Add a new user subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userEmail" className="text-slate-300">User Email *</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) => setFormData({...formData, userEmail: e.target.value})}
                  placeholder="user@example.com"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="planName" className="text-slate-300">Plan *</Label>
                <Select value={formData.planName} onValueChange={(value) => {
                  const plan = planOptions.find(p => p.name === value);
                  setFormData({...formData, planName: value, planPrice: plan?.price.toString() || ''});
                }}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {planOptions.map((plan) => (
                      <SelectItem key={plan.name} value={plan.name} className="text-white hover:bg-slate-700">
                        {plan.name} - ₹{plan.price}/month
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="planPrice" className="text-slate-300">Price (₹) *</Label>
                <Input
                  id="planPrice"
                  type="number"
                  value={formData.planPrice}
                  onChange={(e) => setFormData({...formData, planPrice: e.target.value})}
                  placeholder="99"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-slate-300">Status *</Label>
                <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'cancelled') => setFormData({...formData, status: value})}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="active" className="text-white hover:bg-slate-700">Active</SelectItem>
                    <SelectItem value="inactive" className="text-white hover:bg-slate-700">Inactive</SelectItem>
                    <SelectItem value="cancelled" className="text-white hover:bg-slate-700">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-slate-300">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-slate-300">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3 flex gap-3">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Create Subscription
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
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Active Subscriptions</p>
                <p className="text-2xl font-bold text-white">{activeSubscriptions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <DollarSign className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Monthly Revenue</p>
                <p className="text-2xl font-bold text-white">₹{monthlyRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Growth Rate</p>
                <p className="text-2xl font-bold text-white">+12.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <TrendingUp className="w-5 h-5 text-red-400 rotate-180" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Churn Rate</p>
                <p className="text-2xl font-bold text-white">{churnRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Revenue Trend</CardTitle>
            <CardDescription className="text-slate-400">
              Monthly revenue growth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
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
                    formatter={(value) => [`₹${value}`, 'Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Plan Distribution</CardTitle>
            <CardDescription className="text-slate-400">
              Active subscriptions by plan type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
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
              {planDistribution.map((entry, index) => (
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

      {/* Filters and Search */}
      <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by email or plan name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-white hover:bg-slate-700">All Status</SelectItem>
                <SelectItem value="active" className="text-white hover:bg-slate-700">Active</SelectItem>
                <SelectItem value="inactive" className="text-white hover:bg-slate-700">Inactive</SelectItem>
                <SelectItem value="cancelled" className="text-white hover:bg-slate-700">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Subscription Details</CardTitle>
          <CardDescription className="text-slate-400">
            Manage all user subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300">User</th>
                  <th className="text-left py-3 px-4 text-slate-300">Plan</th>
                  <th className="text-left py-3 px-4 text-slate-300">Price</th>
                  <th className="text-left py-3 px-4 text-slate-300">Status</th>
                  <th className="text-left py-3 px-4 text-slate-300">Start Date</th>
                  <th className="text-left py-3 px-4 text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.slice(0, 20).map((subscription) => {
                  const PlanIcon = subscription.planName === 'Free' ? User : 
                                  subscription.planName === 'Eco Warrior' ? Star : Crown;
                  
                  return (
                    <tr key={subscription.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-300" />
                          </div>
                          <span className="text-white">{subscription.userEmail}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <PlanIcon className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{subscription.planName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white font-medium">₹{subscription.planPrice}/month</td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant="outline" 
                          className={`${
                            subscription.status === 'active' ? 'text-emerald-400 border-emerald-400' :
                            subscription.status === 'inactive' ? 'text-yellow-400 border-yellow-400' :
                            'text-red-400 border-red-400'
                          }`}
                        >
                          {subscription.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {new Date(subscription.startDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateSubscriptionStatus(
                              subscription.id, 
                              subscription.status === 'active' ? 'inactive' : 'active'
                            )}
                          >
                            {subscription.status === 'active' ? 'Pause' : 'Activate'}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscriptions;
