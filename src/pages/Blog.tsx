
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fadeIn } from '@/lib/animations';

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <motion.div 
          className="container mx-auto px-4 max-w-3xl"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Our Blog</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Insights, tips, and stories to support your affirmation journey
            </p>
          </div>
          
          <Card className="shadow-md mb-12">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                </div>
                
                <h2 className="text-2xl font-semibold">Coming Soon</h2>
                
                <p className="text-gray-600 dark:text-gray-400 max-w-lg">
                  We're working hard to bring you valuable content about positive affirmations, 
                  mindfulness practices, and personal growth. Our blog will be launching soon!
                </p>
                
                <div className="mt-4 flex flex-col items-center">
                  <p className="font-medium text-lg mb-3">Want to be notified when we launch?</p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button variant="default" asChild>
                      <a href="/#signup">Sign Up for Updates</a>
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Be the first to read our articles and get exclusive insights.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
