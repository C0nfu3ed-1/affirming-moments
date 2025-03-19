
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Separator } from '@/components/ui/separator';
import { fadeIn } from '@/lib/animations';

const Terms = () => {
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
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Terms of Service</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8">
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-semibold text-primary-600 dark:text-primary-400 mb-4">Welcome to Affirming Me Today</h2>
              
              <p className="text-lg mb-6">
                By using our services, you agree to these Terms of Service. Please read them carefully.
                <strong className="text-primary-700 dark:text-primary-300"> We do not sell, rent, or trade your information with any third parties.</strong>
              </p>
              
              <Separator className="my-6" />
              
              <h3 className="text-xl font-semibold mb-3">1. Service Description</h3>
              <p className="mb-6">
                Affirming Me Today provides daily affirmations delivered through email and/or SMS to 
                registered users. Our service is designed to promote positive thinking and personal growth.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">2. Account Registration</h3>
              <p className="mb-6">
                To use our services, you must create an account with accurate and complete information.
                You are responsible for maintaining the confidentiality of your account credentials and 
                for all activities that occur under your account.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">3. Communication Preferences</h3>
              <p className="mb-4">
                By registering for our service, you consent to receive:
              </p>
              <ul className="list-disc list-inside mb-6 space-y-2">
                <li>Daily affirmations via email and/or SMS</li>
                <li>Service-related announcements</li>
                <li>Occasional updates about new features or offerings</li>
              </ul>
              <p className="mb-6 font-medium">
                You can opt out of SMS messages at any time through your member dashboard. 
                Message and data rates may apply based on your mobile carrier's rates.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">4. User Privacy</h3>
              <p className="mb-6">
                We respect your privacy and are committed to protecting your personal information.
                <strong> We do not sell, rent, or share your personal information with third parties for marketing purposes.</strong> 
                For more details on how we collect, use, and protect your information, please review our Privacy Policy.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">5. User Conduct</h3>
              <p className="mb-6">
                You agree not to use our service to engage in any illegal or unauthorized activity, 
                impersonate others, or interfere with the proper functioning of the service.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">6. Subscription and Donations</h3>
              <p className="mb-6">
                Our service may offer subscription options and/or accept donations. All payments 
                are processed through secure third-party payment processors. Refunds are handled 
                in accordance with our refund policy, which is available upon request.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">7. Intellectual Property</h3>
              <p className="mb-6">
                All content provided through our service, including affirmations, texts, graphics, 
                logos, and software, is owned by Affirming Me Today and protected by intellectual 
                property laws. You may not reproduce, distribute, or create derivative works without 
                our explicit permission.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">8. Termination</h3>
              <p className="mb-6">
                We reserve the right to suspend or terminate your access to our service if you 
                violate these Terms of Service or engage in fraudulent activity. You can terminate 
                your account at any time through your member dashboard.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">9. Limitation of Liability</h3>
              <p className="mb-6">
                To the maximum extent permitted by law, Affirming Me Today shall not be liable 
                for any indirect, incidental, special, consequential, or punitive damages resulting 
                from your use or inability to use our service.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">10. Changes to Terms</h3>
              <p className="mb-6">
                We may modify these Terms of Service from time to time. We will notify you of 
                significant changes via email or through our service. Your continued use of our 
                service after such modifications constitutes your acceptance of the updated terms.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">11. Contact Us</h3>
              <p className="mb-6">
                If you have questions or concerns about these Terms of Service, please contact us at 
                terms@affirmingmetoday.com.
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

export default Terms;
