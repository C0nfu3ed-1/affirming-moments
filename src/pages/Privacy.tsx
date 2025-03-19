
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Separator } from '@/components/ui/separator';
import { fadeIn } from '@/lib/animations';

const Privacy = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <motion.div 
          className="container mx-auto px-4 max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Privacy Policy</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8">
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-semibold text-primary-600 dark:text-primary-400 mb-4">Your Privacy is Our Priority</h2>
              
              <p className="text-lg mb-6">
                At Affirming Me Today, we value your privacy and are committed to protecting your personal information. 
                <strong className="text-primary-700 dark:text-primary-300"> We do not sell, rent, or trade your information with any third parties.</strong>
              </p>
              
              <Separator className="my-6" />
              
              <h3 className="text-xl font-semibold mb-3">Information We Collect</h3>
              <p className="mb-4">
                We collect minimal information necessary to provide our affirmation services:
              </p>
              <ul className="list-disc list-inside mb-6 space-y-2">
                <li>Name and email address for account creation and communication</li>
                <li>Preferences related to affirmation categories and delivery times</li>
                <li>Optional: Phone number if you choose to receive affirmations via text</li>
                <li>Usage data to improve our service</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">How We Use Your Information</h3>
              <p className="mb-4">
                We use your information solely for:
              </p>
              <ul className="list-disc list-inside mb-6 space-y-2">
                <li>Delivering personalized affirmations based on your preferences</li>
                <li>Communicating service updates and important information</li>
                <li>Improving our content and user experience</li>
                <li>Processing optional donations</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">Data Security</h3>
              <p className="mb-6">
                We implement appropriate security measures to protect your personal information. 
                All data is encrypted during transmission and at rest. We regularly review our 
                security practices to ensure your information remains protected.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Your Rights</h3>
              <p className="mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside mb-6 space-y-2">
                <li>Access and update your personal information</li>
                <li>Request deletion of your data</li>
                <li>Opt out of communications</li>
                <li>Receive a copy of your data</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">Cookies and Similar Technologies</h3>
              <p className="mb-6">
                We use cookies to enhance your experience on our website. You can manage cookie 
                preferences through your browser settings. Disabling cookies may limit some 
                functionality of our service.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Changes to This Policy</h3>
              <p className="mb-6">
                We may update this privacy policy from time to time. We will notify you of any 
                significant changes via email or through the service. We encourage you to review 
                this policy periodically.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
              <p className="mb-6">
                If you have questions or concerns about this privacy policy or our data practices, 
                please contact us at privacy@affirmingmetoday.com.
              </p>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-10">
                Last updated: {new Date().toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}
              </p>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
