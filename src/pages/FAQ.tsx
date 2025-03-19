
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { QuestionCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from '@/components/ui/accordion';
import { fadeIn } from '@/lib/animations';

const FAQ = () => {
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
          <div className="text-center mb-10">
            <QuestionCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find answers to common questions about our affirmation service and how it can help you on your journey to a more positive mindset.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-semibold text-lg">
                  What is Affirming Me Today?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  Affirming Me Today is a service that delivers personalized daily affirmations straight to your inbox or phone. 
                  We help you maintain a positive mindset through consistent, thoughtfully crafted messages designed to inspire, 
                  motivate, and support your personal growth journey.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-semibold text-lg">
                  How much does the service cost?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  Our basic service is free, with optional donation-based support. We believe everyone deserves access to tools 
                  that support mental wellbeing. If you find value in our service, you can choose to support us with a donation 
                  of any amount, but it's completely optional.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-semibold text-lg">
                  How do I customize my affirmations?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  After signing up, you'll have access to your member dashboard where you can select your preferred affirmation 
                  categories and specify delivery times. You can update these preferences anytime to ensure your affirmations 
                  stay relevant to your current needs and goals.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-semibold text-lg">
                  Can I receive affirmations via text message?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  Yes! You can choose to receive affirmations via email, SMS text message, or both. If you select SMS delivery, 
                  standard message and data rates from your carrier may apply. You can opt out of SMS messages at any time 
                  through your member dashboard.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left font-semibold text-lg">
                  Do you sell my personal information?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  <strong>Absolutely not.</strong> We take your privacy seriously and never sell, rent, or trade your information 
                  with third parties. Your personal data is only used to deliver the service you signed up for. For more details, 
                  please review our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left font-semibold text-lg">
                  How do I cancel my subscription?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  You can easily manage or cancel your subscription at any time through your member dashboard. There's no 
                  commitment and no cancellation fees. If you need assistance, our support team is always happy to help.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left font-semibold text-lg">
                  What types of affirmations do you offer?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  We offer a wide range of affirmation categories, including but not limited to: self-love, confidence, 
                  career success, anxiety relief, gratitude, abundance, health and wellness, creative inspiration, and 
                  relationship harmony. You can select multiple categories that resonate with your current life situation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger className="text-left font-semibold text-lg">
                  How often will I receive affirmations?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  By default, you'll receive one affirmation daily at your preferred time. In your member dashboard, 
                  you can adjust the frequency to match your preferences, whether that's daily, multiple times a day, 
                  or fewer times per week.
                </AccordionContent>
              </AccordionItem>
              
            </Accordion>
            
            <div className="mt-10 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Still have questions? We're here to help!
              </p>
              <a 
                href="mailto:support@affirmingmetoday.com" 
                className="text-primary hover:underline font-medium"
              >
                Contact our support team
              </a>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
