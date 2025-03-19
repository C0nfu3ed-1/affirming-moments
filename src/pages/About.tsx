
import { motion } from 'framer-motion';
import { Heart, Clock, Users } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { fadeIn, staggerContainer, cardAnimation } from '@/lib/animations';

const About = () => {
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
            <h1 className="text-3xl md:text-4xl font-bold mb-3">About Affirming Me Today</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our mission is to help people build a positive mindset through daily affirmations.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="relative rounded-xl overflow-hidden w-64 h-64 shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                    alt="Founder of Affirming Me Today" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-2/3">
                <h2 className="text-2xl font-bold mb-4 text-primary-600">Our Story</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Affirming Me Today began as a personal journey toward mental wellbeing. After experiencing the powerful impact of daily affirmations firsthand, our founder Sarah became passionate about bringing this practice to others in an accessible way.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  What started as texts to friends has grown into a service that touches thousands of lives daily. We believe that small, consistent reminders of your worth and potential can create profound shifts in mindset over time.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Our team is dedicated to crafting thoughtful, impactful affirmations tailored to various life situations. We work with mental health professionals to ensure our content is both uplifting and psychologically sound.
                </p>
              </div>
            </div>
          </div>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <motion.div variants={cardAnimation}>
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Our Values</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We believe in compassion, authenticity, and the power of positive thinking. Every affirmation we share is created with intention and care.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={cardAnimation}>
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Our Approach</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We focus on consistency and personalization. Regular, relevant affirmations create lasting mental patterns that support your personal growth.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={cardAnimation}>
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Our Community</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We're proud to serve a diverse community of individuals seeking to improve their mental wellbeing and embrace a more positive outlook on life.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
          
          <div className="bg-primary-50 dark:bg-gray-900 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">Sarah Miller</h3>
                <p className="text-primary-600 font-medium mb-2">Founder & CEO</p>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Mental health advocate and affirmation enthusiast driven by a passion for positive psychology.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" />
                  <AvatarFallback>JW</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">James Wilson</h3>
                <p className="text-primary-600 font-medium mb-2">Content Director</p>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Former therapist who brings clinical expertise to our affirmation development process.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" />
                  <AvatarFallback>LJ</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">Lisa Johnson</h3>
                <p className="text-primary-600 font-medium mb-2">Community Manager</p>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Dedicated to creating meaningful connections within our community of affirmation users.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
