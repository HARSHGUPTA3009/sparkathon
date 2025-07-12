
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Lock, Eye, EyeOff, AlertCircle, UserPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [username, setUsername] = useState('');
  const { signIn, signUp, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUpMode) {
        console.log('Sign up attempt for:', email);
        const { error } = await signUp(email, password, username);
        
        if (error) {
          console.error('Sign up error:', error);
          let errorMessage = "Unable to create account. Please try again.";
          
          if (error.message.includes('already registered')) {
            errorMessage = "An account with this email already exists. Try signing in instead.";
            setIsSignUpMode(false);
          } else if (error.message.includes('weak password')) {
            errorMessage = "Password is too weak. Please use at least 6 characters.";
          } else if (error.message.includes('invalid email')) {
            errorMessage = "Please enter a valid email address.";
          }
          
          toast({
            title: "Sign up failed",
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account created! 🎉",
            description: "Please check your email to verify your account.",
          });
        }
      } else {
        console.log('Sign in attempt for:', email);
        const { error } = await signIn(email, password);
        
        if (error) {
          console.error('Sign in error:', error);
          let errorMessage = "Please check your credentials and try again.";
          
          if (error.message.includes('Invalid login credentials')) {
            errorMessage = "Invalid email or password.";
          } else if (error.message.includes('Email not confirmed')) {
            errorMessage = "Please check your email and click the confirmation link.";
          } else if (error.message.includes('Too many requests')) {
            errorMessage = "Too many login attempts. Please wait a moment and try again.";
          }
          
          toast({
            title: "Sign in failed",
            description: errorMessage,
            variant: "destructive",
            action: (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsSignUpMode(true)}
              >
                Sign Up Instead
              </Button>
            ),
          });
        } else {
          toast({
            title: "Welcome back! 🌿",
            description: "Successfully signed in to EcoMess Admin",
          });
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
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
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4 animate-pulse">
            <Leaf className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 animate-slide-up">EcoMess Admin</h1>
          <p className="text-slate-400 animate-slide-up animation-delay-200">
            Admin Portal Access
          </p>
        </div>

        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 shadow-2xl animate-slide-up animation-delay-300">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center gap-2">
              {isSignUpMode ? <UserPlus className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              {isSignUpMode ? 'Create Admin Account' : 'Admin Login'}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {isSignUpMode 
                ? "Create a new admin account to access the dashboard"
                : "Sign in to access the admin dashboard"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Admin Credentials Helper - Only show for login */}
            {!isSignUpMode && (
              <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600/50">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-400">Existing Admin Accounts</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <div>📧 anshu@ecomess.com</div>
                  <div>📧 harsh@ecomess.com</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400 transition-colors"
                  required
                />
              </div>

              {isSignUpMode && (
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-300">Username (Optional)</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400 transition-colors"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignUpMode ? "Create a secure password" : "Enter admin password"}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400 transition-colors pr-10"
                    required
                    minLength={isSignUpMode ? 6 : undefined}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {isSignUpMode ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  isSignUpMode ? 'Create Admin Account 🎉' : 'Sign In to Admin 🔐'
                )}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-slate-400 hover:text-white"
                  onClick={() => setIsSignUpMode(!isSignUpMode)}
                >
                  {isSignUpMode 
                    ? 'Already have an account? Sign in'
                    : 'Need an account? Sign up'
                  }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
