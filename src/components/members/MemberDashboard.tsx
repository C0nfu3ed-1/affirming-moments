
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import DashboardHeader from './DashboardHeader';
import StatusCard from './StatusCard';
import DonationCard from './DonationCard';
import PreferenceCards from './PreferenceCards';

const MemberDashboard = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    selectedCategories,
    selectedTime,
    handleCategoryChange,
    handleTimeChange,
    savePreferences,
    cancelSubscription
  } = useUserPreferences();
  
  const handleSavePreferences = async () => {
    const success = await savePreferences();
    // Additional logic can be added here if needed
  };
  
  const handleDeleteSubscription = async () => {
    if (window.confirm("Are you sure you want to cancel your subscription? You will no longer receive daily affirmations.")) {
      const success = await cancelSubscription();
      if (success) {
        navigate('/');
      }
    }
  };
  
  const handleDonation = () => {
    window.open('https://paypal.com', '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-fade-in">
      <DashboardHeader onCancelSubscription={handleDeleteSubscription} />
      
      {/* Status Card */}
      <StatusCard />
      
      {/* Donation Card */}
      <DonationCard onDonate={handleDonation} />
      
      {/* Preference Cards */}
      <PreferenceCards
        selectedCategories={selectedCategories}
        selectedTime={selectedTime}
        onCategoryChange={handleCategoryChange}
        onTimeChange={handleTimeChange}
      />
      
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
