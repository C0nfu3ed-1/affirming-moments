
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { fadeIn } from '@/lib/animations';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <motion.div 
          className="container mx-auto px-4 max-w-2xl"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Contact Us</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We'd love to hear from you
            </p>
          </div>
          
          <Card className="shadow-md mb-12">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <Mail className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                </div>
                
                <h2 className="text-2xl font-semibold">Get in Touch</h2>
                
                <p className="text-gray-600 dark:text-gray-400 max-w-lg">
                  This is a personal passion project, so please understand there may be 
                  delays in responding to your inquiries. We appreciate your patience and support.
                </p>
                
                <div className="mt-4">
                  <p className="font-medium text-lg">Email us at:</p>
                  <a 
                    href="mailto:hello@affirmingmetoday.com" 
                    className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                  >
                    hello@affirmingmetoday.com
                  </a>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-6">
                  We typically respond within 3-5 business days.
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

export default Contact;
