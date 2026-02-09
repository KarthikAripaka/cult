'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      fullWidth = true,
      size = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      w-full px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
      transition-all duration-200 ease-out
      disabled:bg-gray-100 disabled:cursor-not-allowed
    `;

    const sizes = {
      sm: 'py-2 text-sm',
      md: 'py-3 text-base',
      lg: 'py-4 text-lg',
    };

    const labelStyles = `
      block text-sm font-medium text-gray-700 mb-1
    `;

    const errorStyles = `
      border-red-500 focus:ring-red-500
    `;

    return (
      <div className={clsx(fullWidth && 'w-full')}>
        {label && (
          <label className={labelStyles}>
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            baseStyles,
            sizes[size],
            error && errorStyles,
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
