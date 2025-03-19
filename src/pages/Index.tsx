
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import SignupForm from '@/components/home/SignupForm';
import FeaturesSection from '@/components/home/FeaturesSection';
import DonationSection from '@/components/home/DonationSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

const Index = () => {
  // Scroll to section if URL has hash
  useEffect(() => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const handleDonation = () => {
    window.open('https://paypal.com', '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* Donation Section */}
        <DonationSection onDonation={handleDonation} />
        
        {/* Testimonials Section */}
        <TestimonialsSection />
        
        {/* CTA & Signup */}
        <SignupForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
