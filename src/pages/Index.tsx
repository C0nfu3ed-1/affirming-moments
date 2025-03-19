
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import SignupForm from '@/components/home/SignupForm';
import FeatureCard from '@/components/home/FeatureCard';
import { 
  MessageSquare, 
  Clock, 
  Sparkles, 
  UserCheck, 
  Heart, 
  ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-3">
                Our Features
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Thoughtfully Designed for You
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Everything you need to bring positivity into your daily routine.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={MessageSquare}
                title="Personalized Affirmations"
                description="Select from various categories to receive affirmations that resonate with you and your goals."
              />
              <FeatureCard
                icon={Clock}
                title="Customizable Timing"
                description="Choose when you want to receive your affirmations or opt for a surprise at random times."
                delay={100}
              />
              <FeatureCard
                icon={Sparkles}
                title="Quality Content"
                description="Our affirmations are crafted by experts in positive psychology to maximize impact."
                delay={200}
              />
              <FeatureCard
                icon={UserCheck}
                title="Easy Management"
                description="Simple interface to update your preferences or manage your subscription anytime."
                delay={300}
              />
              <FeatureCard
                icon={Heart}
                title="Donation Based"
                description="Support our mission to spread positivity with optional donations for those who can afford to help."
                delay={400}
              />
              <div className="flex items-center justify-center p-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 animate-fade-in animation-delay-500">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-3">And Much More...</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Discover all the features designed to enhance your experience.
                  </p>
                  <Button variant="ghost" className="text-primary-600 group">
                    Learn more 
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-3">
                Testimonials
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Our Users Say
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Hear from people who have transformed their daily routines with our affirmations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah J.",
                  role: "Teacher",
                  content: "These daily affirmations have completely changed my morning routine. I feel more centered and positive throughout the day.",
                },
                {
                  name: "Michael T.",
                  role: "Entrepreneur",
                  content: "As someone who deals with a lot of pressure, these affirmations help me stay grounded and focused on what really matters.",
                  featured: true,
                },
                {
                  name: "Elena R.",
                  role: "Healthcare Professional",
                  content: "The personalized categories are perfect. I choose affirmations that align with my goals, and they arrive just when I need them.",
                }
              ].map((testimonial, i) => (
                <div 
                  key={i}
                  className={`rounded-xl p-6 shadow-lg border transition-all duration-300 animate-fade-in animation-delay-${i*200} ${
                    testimonial.featured 
                      ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20 transform hover:scale-105' 
                      : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 transform hover:scale-102'
                  }`}
                >
                  <div className="mb-4">
                    {"★★★★★".split('').map((star, j) => (
                      <span key={j} className="text-yellow-400 text-lg">
                        {star}
                      </span>
                    ))}
                  </div>
                  <p className="italic mb-6 text-gray-700 dark:text-gray-300">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold mr-3">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA & Signup */}
        <SignupForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
