
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import authService from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let userData;
      
      if (isAdminLogin) {
        // Try admin login
        userData = await authService.adminLogin(email, password);
        toast({
          title: "Admin login successful",
          description: "Welcome back, admin!",
        });
        
        // Check if superadmin
        if (userData.is_superadmin) {
          navigate('/admin-dashboard');
        } else {
          navigate('/admin-dashboard');
        }
      } else {
        // Regular user login
        userData = await authService.login(email, password);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate('/user-dashboard');
      }
      
      // If "Remember me" is not checked, set a session storage flag
      if (!rememberMe) {
        sessionStorage.setItem('session_only', 'true');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md">
          <Card className="w-full">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
              <CardDescription className="text-center">
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm font-medium text-dejair-600 hover:text-dejair-800">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                  />
                  <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Remember me
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="adminLogin" 
                    checked={isAdminLogin}
                    onCheckedChange={setIsAdminLogin}
                  />
                  <Label htmlFor="adminLogin" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Log in as administrator
                  </Label>
                </div>
                <Button type="submit" className="w-full bg-dejair-600 hover:bg-dejair-700" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
              
              <div className="mt-4 text-center text-sm">
                <p>
                  Don't have an account?{" "}
                  <Link to="/signup" className="font-medium text-dejair-600 hover:text-dejair-800">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-gray-500 text-center">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
