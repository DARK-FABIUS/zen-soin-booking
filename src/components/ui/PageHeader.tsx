
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children }) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl md:text-4xl font-light text-foreground mb-2">
        {title}
      </h1>
      {subtitle && (
        <p className="text-muted-foreground text-lg font-light">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
};

export default PageHeader;
