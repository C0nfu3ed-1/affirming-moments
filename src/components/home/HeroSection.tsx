
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 right-0 bottom-0 -z-10">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-violet-200 rounded-full filter blur-3xl opacity-20 animate-pulse-slow animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left space-y-6">
            <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-2 animate-fade-in">
              Empower Your Day
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in animation-delay-200">
              <span className="block">Transform Your Day with</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-500">Affirming Me Today</span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 animate-fade-in animation-delay-400">
              Receive personalized daily affirmations that inspire, motivate, and help you cultivate a positive mindset. Your journey to personal growth starts with one message.
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4 animate-fade-in animation-delay-600">
              <Button 
                size="lg" 
                className="bg-primary-600 hover:bg-primary-700 text-white rounded-full px-8 group transition-all duration-300 transform hover:scale-105"
                asChild
              >
                <a href="#signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full px-8 border-gray-300 hover:border-primary-500 hover:text-primary-600 transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>
          
          {/* Hero Image/Illustration */}
          <div className="relative">
            <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-700 hover:scale-[1.02] hover:shadow-primary-500/20">
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <span className="text-lg font-semibold">✨</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Today's Affirmation</p>
                    <h3 className="font-semibold">Morning Positivity</h3>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 mb-6">
                  <p className="italic text-lg text-gray-700 dark:text-gray-300">
                    "I am capable of amazing things. Today, I choose courage over comfort and growth over fear."
                  </p>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">9:00 AM</span>
                  <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">Delivered</span>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-1/4 -right-10 w-20 h-20 bg-yellow-200 rounded-full filter blur-xl opacity-50 animate-float"></div>
            <div className="absolute bottom-1/4 left-0 w-12 h-12 bg-primary-300 rounded-full filter blur-xl opacity-60 animate-float animation-delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
