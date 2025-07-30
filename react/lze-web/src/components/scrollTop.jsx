import React, { createContext, useState, useEffect } from 'react';

export const ScrollContext = createContext(false);


export const ScrollTop = ({ children }) => {
  const [isScroll, setIsScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScroll(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ScrollContext.Provider value={isScroll}>
      {children}
    </ScrollContext.Provider>
  );
};
