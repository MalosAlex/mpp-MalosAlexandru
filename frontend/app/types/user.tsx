"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type User = {
  username: string;
  is_admin: boolean;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User) => void;
  getAdmin: () => boolean;
  getIsLogged: () => boolean;
  getUsername: () => string | undefined;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const getAdmin = () => {
    return user?.is_admin ?? false;
  };

  const getUsername = () => {
    return user?.username;
  }

  // Optionally load user from localStorage or API on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("userInfo");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const getIsLogged = () => {
    return user != null
  }

  return (
    <UserContext.Provider value={{ user, setUser, getAdmin, getIsLogged, getUsername }}>
      {children}
    </UserContext.Provider>
  );

}

// Custom hook for consuming the context
export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
