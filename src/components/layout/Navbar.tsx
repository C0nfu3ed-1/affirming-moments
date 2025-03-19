
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-2 bg-white/80 dark:bg-black/80 shadow-md backdrop-blur-md' 
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 transition-transform hover:scale-[1.02] duration-300"
        >
          <span className="text-primary-600 text-2xl font-display font-bold">
            Affirming Me Today
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
          <AuthButtons />
        </nav>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-gray-950 pt-20 animate-fade-in">
          <div className="container mx-auto px-4 py-8 flex flex-col items-center gap-6">
            <NavLinks isMobile />
            <AuthButtons isMobile />
          </div>
        </div>
      )}
    </header>
  );
};

const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => {
  const location = useLocation();
  const baseClasses = "relative font-medium transition-colors duration-300";
  const mobileClasses = isMobile ? "text-lg py-3" : "";
  
  const isActive = (path: string) => location.pathname === path;
  
  const activeClasses = "text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-500 after:rounded-full after:transform after:scale-x-100 after:transition-transform after:duration-300";
  const inactiveClasses = "text-gray-700 dark:text-gray-300 hover:text-primary-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-500 after:rounded-full after:transform after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300";

  return (
    <>
      <Link 
        to="/" 
        className={`${baseClasses} ${mobileClasses} ${isActive('/') ? activeClasses : inactiveClasses}`}
      >
        Home
      </Link>
      <Link 
        to="/about" 
        className={`${baseClasses} ${mobileClasses} ${isActive('/about') ? activeClasses : inactiveClasses}`}
      >
        About
      </Link>
      <Link 
        to="/faq" 
        className={`${baseClasses} ${mobileClasses} ${isActive('/faq') ? activeClasses : inactiveClasses}`}
      >
        FAQ
      </Link>
    </>
  );
};

const AuthButtons = ({ isMobile = false }: { isMobile?: boolean }) => {
  const location = useLocation();
  const flexDirection = isMobile ? "flex-col w-full" : "flex-row";
  
  return (
    <div className={`flex items-center gap-3 ${flexDirection}`}>
      <Button 
        variant="ghost" 
        className={`text-gray-700 dark:text-gray-300 hover:text-primary-500 hover:bg-primary-50 ${isMobile ? 'w-full py-6' : ''}`}
        asChild
      >
        <Link to="/login">Sign In</Link>
      </Button>
      <Button 
        className={`bg-primary-600 hover:bg-primary-700 text-white ${isMobile ? 'w-full py-6' : ''}`}
        asChild
      >
        <Link to="/#signup">Get Started</Link>
      </Button>
    </div>
  );
};

export default Navbar;
