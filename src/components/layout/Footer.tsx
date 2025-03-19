
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-display font-bold text-primary-600 inline-block mb-4">
              Affirming Me Today
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Daily affirmations to help you live a more positive, 
              empowered life. Start your journey to self-improvement today.
            </p>
          </div>
          
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <FooterLink href="/faq">FAQ</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 sm:mb-0">
            © {new Date().getFullYear()} Affirming Me Today. All rights reserved.
          </p>
          <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            Made with <Heart size={14} className="text-red-500 mx-1" /> for a positive world
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <Link 
      to={href} 
      className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
    >
      {children}
    </Link>
  </li>
);

export default Footer;
