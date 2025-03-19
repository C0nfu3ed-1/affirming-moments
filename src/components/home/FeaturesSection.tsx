
import { FC } from 'react';
import { 
  MessageSquare, 
  Clock, 
  Sparkles, 
  UserCheck, 
  Heart, 
  ArrowRight 
} from 'lucide-react';
import FeatureCard from '@/components/home/FeatureCard';
import { Button } from '@/components/ui/button';

const FeaturesSection: FC = () => {
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
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
  );
};

export default FeaturesSection;
