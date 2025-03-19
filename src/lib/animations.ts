
import { CSSProperties } from "react";

export const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.4, ease: "easeIn" }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const cardAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: [0.22, 1, 0.36, 1] 
    }
  }
};

export const slideIn = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    x: '100%',
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
};

export const shimmerEffect: CSSProperties = {
  backgroundImage: `linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 20%,
    rgba(255, 255, 255, 0.5) 60%,
    rgba(255, 255, 255, 0) 100%
  )`,
  backgroundSize: '200% 100%',
  backgroundPosition: '-200% 0',
  animation: 'shimmer 2s infinite linear'
};

export const scaleUp = {
  hover: {
    scale: 1.05,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.15 }
  }
};
