import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'danger' | 'success' | 'warning' | 'brand';
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function GlassCard({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'md',
  onClick,
  style,
  ...props
}: GlassCardProps) {
  const paddingClasses = {
    sm: 'card-pad-sm',
    md: 'card-pad',
    lg: 'card-pad-lg'
  };

  const variantClasses = {
    default: '',
    danger: 'card-danger',
    success: 'card-success',
    warning: 'card-warning',
    brand: 'card-brand'
  };

  return (
    <div 
      className={`glass-card ${paddingClasses[padding]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}