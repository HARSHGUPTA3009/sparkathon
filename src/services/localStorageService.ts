
// Local Storage Service for EcoMess Admin Data
export interface ForecastData {
  id: string;
  date: string;
  mealType: string;
  predictedDemand: number;
  actualDemand?: number;
  optOutRate: number;
  accuracy?: number;
  createdAt: string;
}

export interface LeftoverData {
  id: string;
  date: string;
  mealType: string;
  quantity: number;
  category: string;
  notes: string;
  waste: number;
  reduction: number;
  createdAt: string;
}

export interface SubscriptionData {
  id: string;
  userId: string;
  userEmail: string;
  planName: string;
  planPrice: number;
  status: 'active' | 'inactive' | 'cancelled';
  startDate: string;
  endDate?: string;
  features: string[];
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  avgOptOutRate: number;
  totalCO2Saved: number;
  wasteReduction: number;
  lastUpdated: string;
}

class LocalStorageService {
  private readonly FORECAST_KEY = 'ecomess-forecasts';
  private readonly LEFTOVER_KEY = 'ecomess-leftovers';
  private readonly SUBSCRIPTION_KEY = 'ecomess-subscriptions';
  private readonly STATS_KEY = 'ecomess-admin-stats';

  // Forecast Methods
  getForecasts(): ForecastData[] {
    const data = localStorage.getItem(this.FORECAST_KEY);
    return data ? JSON.parse(data) : this.getDefaultForecasts();
  }

  saveForecasts(forecasts: ForecastData[]): void {
    localStorage.setItem(this.FORECAST_KEY, JSON.stringify(forecasts));
  }

  addForecast(forecast: Omit<ForecastData, 'id' | 'createdAt'>): ForecastData {
    const forecasts = this.getForecasts();
    const newForecast: ForecastData = {
      ...forecast,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    forecasts.unshift(newForecast);
    this.saveForecasts(forecasts);
    return newForecast;
  }

  updateForecast(id: string, updates: Partial<ForecastData>): void {
    const forecasts = this.getForecasts();
    const index = forecasts.findIndex(f => f.id === id);
    if (index !== -1) {
      forecasts[index] = { ...forecasts[index], ...updates };
      this.saveForecasts(forecasts);
    }
  }

  // Leftover Methods
  getLeftovers(): LeftoverData[] {
    const data = localStorage.getItem(this.LEFTOVER_KEY);
    return data ? JSON.parse(data) : this.getDefaultLeftovers();
  }

  saveLeftovers(leftovers: LeftoverData[]): void {
    localStorage.setItem(this.LEFTOVER_KEY, JSON.stringify(leftovers));
  }

  addLeftover(leftover: Omit<LeftoverData, 'id' | 'createdAt' | 'reduction'>): LeftoverData {
    const leftovers = this.getLeftovers();
    const reduction = Math.max(0, ((leftover.quantity - leftover.waste) / leftover.quantity) * 100);
    const newLeftover: LeftoverData = {
      ...leftover,
      id: Date.now().toString(),
      reduction,
      createdAt: new Date().toISOString()
    };
    leftovers.unshift(newLeftover);
    this.saveLeftovers(leftovers);
    return newLeftover;
  }

  // Subscription Methods
  getSubscriptions(): SubscriptionData[] {
    const data = localStorage.getItem(this.SUBSCRIPTION_KEY);
    return data ? JSON.parse(data) : this.getDefaultSubscriptions();
  }

  saveSubscriptions(subscriptions: SubscriptionData[]): void {
    localStorage.setItem(this.SUBSCRIPTION_KEY, JSON.stringify(subscriptions));
  }

  addSubscription(subscription: Omit<SubscriptionData, 'id' | 'createdAt'>): SubscriptionData {
    const subscriptions = this.getSubscriptions();
    const newSubscription: SubscriptionData = {
      ...subscription,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    subscriptions.unshift(newSubscription);
    this.saveSubscriptions(subscriptions);
    return newSubscription;
  }

  updateSubscription(id: string, updates: Partial<SubscriptionData>): void {
    const subscriptions = this.getSubscriptions();
    const index = subscriptions.findIndex(s => s.id === id);
    if (index !== -1) {
      subscriptions[index] = { ...subscriptions[index], ...updates };
      this.saveSubscriptions(subscriptions);
    }
  }

  // Stats Methods
  getAdminStats(): AdminStats {
    const data = localStorage.getItem(this.STATS_KEY);
    return data ? JSON.parse(data) : this.getDefaultStats();
  }

  updateAdminStats(stats: Partial<AdminStats>): void {
    const currentStats = this.getAdminStats();
    const updatedStats = {
      ...currentStats,
      ...stats,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(this.STATS_KEY, JSON.stringify(updatedStats));
  }

  // Default Data
  private getDefaultForecasts(): ForecastData[] {
    return [
      {
        id: '1',
        date: new Date().toISOString().split('T')[0],
        mealType: 'Lunch',
        predictedDemand: 245,
        actualDemand: 240,
        optOutRate: 65,
        accuracy: 97.9,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        mealType: 'Dinner',
        predictedDemand: 220,
        optOutRate: 68,
        createdAt: new Date().toISOString()
      }
    ];
  }

  private getDefaultLeftovers(): LeftoverData[] {
    return [
      {
        id: '1',
        date: new Date().toISOString().split('T')[0],
        mealType: 'Lunch',
        quantity: 12,
        category: 'Rice',
        notes: 'Less demand than expected',
        waste: 5,
        reduction: 58.3,
        createdAt: new Date().toISOString()
      }
    ];
  }

  private getDefaultSubscriptions(): SubscriptionData[] {
    return [
      {
        id: '1',
        userId: 'user1',
        userEmail: 'userA@ecomess.com',
        planName: 'Eco Warrior',
        planPrice: 99,
        status: 'active',
        startDate: '2024-01-01',
        features: ['Advanced eco-tracking', 'Community challenges', 'Premium support'],
        createdAt: new Date().toISOString()
      }
    ];
  }

  private getDefaultStats(): AdminStats {
    return {
      totalUsers: 156,
      activeSubscriptions: 89,
      totalRevenue: 12450,
      avgOptOutRate: 67.5,
      totalCO2Saved: 2340,
      wasteReduction: 45.2,
      lastUpdated: new Date().toISOString()
    };
  }
}

export const localStorageService = new LocalStorageService();
