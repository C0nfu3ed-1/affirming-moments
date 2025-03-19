
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
  ArrowRight,
  DollarSign
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
        
        {/* Donation Section - Moved before testimonials */}
        <section className="py-20 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-3">
                Support Our Mission
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Help Us Spread Positivity
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Your donation helps us provide affirmations to those who need them most but can't afford it.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-4">Make a Difference Today</h3>
                    <p className="mb-6 text-gray-600 dark:text-gray-300">
                      Every contribution, no matter how small, helps us reach more people with our positive affirmations. Our mission is to make daily positivity accessible to everyone.
                    </p>
                    <ul className="space-y-3 mb-8">
                      {[
                        "Support development of new affirmation categories",
                        "Help us reach underserved communities",
                        "Enable free services for those who can't afford it",
                        "Fund our technology and delivery systems"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center mr-3 mt-0.5">
                            <svg className="h-4 w-4 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-600 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={handleDonation}
                      className="group px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white w-full md:w-auto rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <DollarSign className="w-5 h-5 mr-2" />
                      <span>Donate via PayPal</span>
                      <span className="ml-1 transition-all duration-500 opacity-0 max-w-0 group-hover:max-w-xs group-hover:opacity-100 overflow-hidden whitespace-nowrap">
                        &nbsp;— Thank you!
                      </span>
                    </Button>
                  </div>
                  <div className="bg-primary-500 p-8 md:p-12 text-white flex flex-col justify-center items-center">
                    <div className="border-4 border-white/30 rounded-full w-24 h-24 flex items-center justify-center mb-6">
                      <DollarSign className="w-12 h-12" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-4">Our Commitment</h3>
                      <p className="mb-6 opacity-90">
                        We pledge to use 100% of donations to improve our service and help more people experience the benefits of daily positive affirmations.
                      </p>
                      <div className="flex flex-col space-y-4">
                        {[
                          { amount: "$5", description: "Helps sponsor one person for a month" },
                          { amount: "$20", description: "Supports technology development" },
                          { amount: "$50", description: "Funds outreach to new communities" }
                        ].map((tier, i) => (
                          <div key={i} className="flex items-center justify-between border border-white/20 rounded-lg p-3 bg-white/10 backdrop-blur-sm">
                            <div className="font-bold text-xl">{tier.amount}</div>
                            <div className="text-sm opacity-90">{tier.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
