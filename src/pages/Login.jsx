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
    
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please provide both email and password",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Determine which login method to use early
      const loginMethod = isAdminLogin ? authService.adminLogin : authService.login;
      const destination = isAdminLogin ? '/admin-dashboard' : '/user-dashboard';
      const successTitle = isAdminLogin ? "Admin login successful" : "Login successful";
      
      // Execute the login
      const userData = await loginMethod(email, password);
      
      // Handle remember me option
      if (!rememberMe) {
        sessionStorage.setItem('session_only', 'true');
      }
      
      // Show success toast and navigate immediately
      toast({
        title: successTitle,
        description: "Welcome back!",
      });
      
      // Navigate directly without further processing
      navigate(destination);
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
                {isAdminLogin ? "Admin login - Enter your credentials" : "Enter your email and password to access your account"}
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
                    autoComplete="email"
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
                    autoComplete={isAdminLogin ? "current-password" : "current-password"}
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
                  {isLoading ? "Signing in..." : `Sign in ${isAdminLogin ? 'as Admin' : ''}`}
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
