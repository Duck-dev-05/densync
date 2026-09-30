import React from 'react';

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: string;
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = '1.5rem',
  className = ''
}: ResponsiveGridProps) {
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gap,
    gridTemplateColumns: `repeat(${columns.mobile}, 1fr)`,
  };

  return (
    <div 
      className={`responsive-grid ${className}`} 
      style={gridStyle}
      data-mobile={columns.mobile}
      data-tablet={columns.tablet}
      data-desktop={columns.desktop}
    >
      {children}
    </div>
  );
}