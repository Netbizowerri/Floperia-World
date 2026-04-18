import { motion, useReducedMotion } from 'motion/react';
import { ReactNode } from 'react';

interface AccessibleMotionProps {
  children: ReactNode;
  initial?: any;
  animate?: any;
  transition?: any;
  className?: string;
}

export const AccessibleFadeIn = ({ children, initial, animate, transition, className }: AccessibleMotionProps) => {
  const shouldReduceMotion = useReducedMotion();

  const accessibleInitial = shouldReduceMotion ? { opacity: 0 } : (initial || { opacity: 0, y: 20 });
  const accessibleAnimate = shouldReduceMotion ? { opacity: 1 } : (animate || { opacity: 1, y: 0 });

  return (
    <motion.div
      initial={accessibleInitial}
      animate={accessibleAnimate}
      transition={transition || { duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
