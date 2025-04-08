import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Plus, ArrowLeft } from "lucide-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import helicopterService from '../services/helicopterService';
import authService from '../services/authService';

const AdminAddHelicopter = () => {
  const [model, setModel] = useState('');
  const [capacity, setCapacity] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [helicopters, setHelicopters] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    if (!authService.isAdmin()) {
      toast({
        title: "Access Denied",
        description: "You must be an admin to access this page.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [navigate, toast]);

  // Fetch existing helicopters
  useEffect(() => {
    const fetchHelicopters = async () => {
      try {
        const data = await helicopterService.getAllHelicopters();
        setHelicopters(data);
      } catch (error) {
        console.error('Error fetching helicopters:', error);
        toast({
          title: "Error",
          description: "Failed to load helicopters. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchHelicopters();
  }, [toast]);

  const handleUpload = (file) => {
    if (file) {
      setImageUrl(file.cdnUrl); // Save the uploaded image URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!model || !capacity || !imageUrl) {
      setError('Please fill in all fields and upload an image.');
      setIsLoading(false);
      return;
    }

    try {
      const helicopterData = {
        model,
        capacity: parseInt(capacity),
        image_url: imageUrl
      };

      await helicopterService.addHelicopter(helicopterData);

      setSuccess('Helicopter added successfully!');
      
      // Clear form fields
      setModel('');
      setCapacity('');
      setImageUrl('');
      
      // Refresh helicopter list
      const updatedHelicopters = await helicopterService.getAllHelicopters();
      setHelicopters(updatedHelicopters);
      
      toast({
        title: "Success",
        description: "Helicopter added successfully!",
      });
    } catch (err) {
      console.error('Error adding helicopter:', err);
      setError(err.message || 'Failed to add helicopter. Please try again.');
      toast({
        title: "Error",
        description: err.message || "Failed to add helicopter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this helicopter?')) {
      return;
    }

    try {
      await helicopterService.deleteHelicopter(id);
      
      // Refresh helicopter list
      const updatedHelicopters = await helicopterService.getAllHelicopters();
      setHelicopters(updatedHelicopters);
      
      toast({
        title: "Success",
        description: "Helicopter deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting helicopter:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete helicopter. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Button 
            variant="outline" 
            className="mr-4" 
            onClick={() => navigate('/admin-dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Manage Helicopters</h1>
        </div>
        
        <Tabs defaultValue="add" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="add">Add Helicopter</TabsTrigger>
            <TabsTrigger value="list">Helicopter List</TabsTrigger>
          </TabsList>
          
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add New Helicopter</CardTitle>
                <CardDescription>
                  Add a new helicopter to the fleet. All fields are required.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && (
                  <Alert className="mb-4">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="e.g., Bell 407"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        placeholder="e.g., 6"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Upload Image</Label>
                    <div className="border rounded-md p-4">
                      <FileUploaderRegular
                        pubkey="2a4bb720cf8bcd6b97e7"
                        onFileUploadSuccess={handleUpload}
                        sourceList="local, camera, facebook, gdrive"
                        cameraModes="photo, video"
                        classNameUploader="uc-dark"
                      />
                    </div>
                  </div>
                  
                  {imageUrl && (
                    <div className="mt-4">
                      <Label>Preview</Label>
                      <div className="mt-2 border rounded-md overflow-hidden max-w-xs">
                        <img
                          src={imageUrl}
                          alt="Helicopter preview"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding..." : "Add Helicopter"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Helicopter Fleet</CardTitle>
                <CardDescription>
                  Manage your existing helicopters
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {helicopters.length === 0 ? (
                  <p className="text-center py-4 text-gray-500">No helicopters found</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {helicopters.map((helicopter) => (
                      <Card key={helicopter.id} className="overflow-hidden">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={helicopter.image_url} 
                            alt={helicopter.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg">{helicopter.name}</h3>
                          <p className="text-sm text-gray-500">Capacity: {helicopter.capacity} passengers</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-end">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(helicopter.id)}
                          >
                            Delete
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminAddHelicopter; 