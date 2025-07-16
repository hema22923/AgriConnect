
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserType = 'buyer' | 'farmer' | 'admin';

interface UserContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  userName: string;
  setUserName: (name: string) => void;
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userType, setUserType] = useState<UserType>('buyer');
  const [userName, setUserName] = useState('Guest');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userType, setUserType, userName, setUserName, userEmail, setUserEmail }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
