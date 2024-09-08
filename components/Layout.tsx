// components/Layout.tsx
import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      {children}
    </div>
  );
};

export default Layout;
