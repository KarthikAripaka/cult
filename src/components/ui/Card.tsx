'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  hoverEffect?: boolean;
}

const Card = ({
  children,
  variant = 'default',
  hoverEffect = false,
  className,
  ...props
}: CardProps) => {
  const variants = {
    default: 'bg-white border border-gray-100',
    elevated: 'bg-white shadow-lg',
    outlined: 'bg-white border-2 border-gray-200',
  };

  return (
    <motion.div
      className={clsx(
        variants[variant],
        hoverEffect && 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
