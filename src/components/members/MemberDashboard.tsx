
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Check, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import CategorySelection from './CategorySelection';
import TimeSelection from './TimeSelection';
import { getUserPreferences, updateUserPreferences } from '@/lib/preferences';
import { supabase } from '@/lib/supabase';

const MemberDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('morning');
  const [userId, setUserId] = useState<string | null>(null);
  
  // Fetch current user and their preferences
  useEffect(() => {
    const fetchUserAndPreferences = async () => {
      setIsLoading(true);
      
      // Get current authenticated user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      const currentUserId = session.user.id;
      setUserId(currentUserId);
      
      // Fetch user preferences
      const { preferences } = await getUserPreferences(currentUserId);
      
      if (preferences) {
        setSelectedCategories(preferences.categories || []);
        setSelectedTime(preferences.time_preference || 'morning');
      }
      
      setIsLoading(false);
    };
    
    fetchUserAndPreferences();
  }, [navigate]);
  
  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };
  
  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };
  
  const handleSavePreferences = async () => {
    if (!userId) {
      toast.error('You must be logged in to save preferences');
      return;
    }
    
    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }
    
    setIsLoading(true);
    
    const result = await updateUserPreferences(
      userId,
      selectedCategories,
      selectedTime,
      true // Keep the user active
    );
    
    setIsLoading(false);
    
    if (result.error) {
      toast.error('Failed to save preferences');
    } else {
      toast.success('Your preferences have been saved');
    }
  };
  
  const handleDeleteSubscription = async () => {
    if (!userId) {
      toast.error('You must be logged in to cancel your subscription');
      return;
    }
    
    if (window.confirm("Are you sure you want to cancel your subscription? You will no longer receive daily affirmations.")) {
      setIsLoading(true);
      
      const result = await updateUserPreferences(
        userId,
        selectedCategories,
        selectedTime,
        false // Set the user as inactive
      );
      
      setIsLoading(false);
      
      if (result.error) {
        toast.error('Failed to cancel subscription');
      } else {
        toast.success('Your subscription has been cancelled');
        navigate('/');
      }
    }
  };
  
  const handleDonation = () => {
    window.open('https://paypal.com', '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Affirmation Dashboard</h1>
        <Button 
          variant="outline" 
          className="border-red-300 hover:border-red-500 text-red-600 hover:bg-red-50"
          onClick={handleDeleteSubscription}
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Cancel Subscription
        </Button>
      </div>
      
      {/* Status Card */}
      <Card className="mb-8 border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center mr-4">
              <Check className="w-5 h-5 text-green-700 dark:text-green-300" />
            </div>
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-300">Subscription Active</h3>
              <p className="text-sm text-green-600 dark:text-green-400">You're all set to receive daily affirmations!</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Donation Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-0 shadow-lg mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-xl font-semibold mb-2">Support Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md">
                Your donation helps us provide affirmations to those who need them most
                but can't afford it. Every contribution makes a difference.
              </p>
            </div>
            <Button 
              onClick={handleDonation}
              className="flex items-center px-6 py-5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Donate via PayPal
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Category Selection */}
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <span className="mr-2">Affirmation Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategorySelection
              onChange={handleCategoryChange}
              selectedCategories={selectedCategories}
            />
          </CardContent>
        </Card>
        
        {/* Time Selection */}
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>Delivery Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TimeSelection
              onChange={handleTimeChange}
              selectedTime={selectedTime}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Save Button */}
      <div className="flex justify-center mb-12">
        <Button 
          onClick={handleSavePreferences}
          className="px-8 py-6 bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
};

export default MemberDashboard;
