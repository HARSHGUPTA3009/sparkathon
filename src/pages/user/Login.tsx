
import { useState } from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Lock, UserRound } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const UserLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, createPassword, hasPassword } = useUserAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleCreatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Please use at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    createPassword(newPassword);
    toast({
      title: "Welcome to EcoMess! 🌱",
      description: "Your password has been created. You can now log in!",
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = login(username, password);
      if (success) {
        toast({
          title: "Welcome back! 🌿",
          description: "Ready to make an eco-impact today?",
        });
      } else {
        toast({
          title: "Login failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
            <Leaf className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">EcoMess</h1>
          <p className="text-slate-400">Your personal eco-impact tracker</p>
        </div>

        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center gap-2">
              {!hasPassword ? (
                <>
                  <UserRound className="w-5 h-5" />
                  Create Your Account
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Welcome Back
                </>
              )}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {!hasPassword 
                ? "Set up your password to start tracking your eco-impact"
                : "Enter your credentials to continue your eco-journey"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!hasPassword ? (
              <form onSubmit={handleCreatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-slate-300">Create Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Choose a secure password"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Create Account & Start! 🌱
                </Button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-300">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In & Continue! 🌿'}
                </Button>
              </form>
            )}
            
            <div className="mt-6 p-4 bg-emerald-900/20 rounded-lg">
              <p className="text-xs text-emerald-300 text-center">
                🌍 Demo: user1 / anshubhess
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserLogin;
