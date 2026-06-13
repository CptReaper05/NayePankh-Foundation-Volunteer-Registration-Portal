import React, { createContext, useContext, useState, useEffect } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Clear storage on initial load (page refresh) to force log out
    localStorage.clear();
  }, []);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <ModalContext.Provider value={{ isLoginOpen, openLogin, closeLogin, user, login, logout }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
