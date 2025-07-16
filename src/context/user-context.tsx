
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export type UserType = 'buyer' | 'farmer' | 'admin';

interface UserContextType {
  uid: string | null;
  userType: UserType;
  setUserType: (type: UserType) => void;
  userName: string;
  setUserName: (name: string) => void;
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [uid, setUid] = useState<string | null>(null);
  const [userType, setUserType] = useState<UserType>('buyer');
  const [userName, setUserName] = useState('Guest');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        setUid(firebaseUser.uid);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.fullName);
          setUserType(userData.role);
          setUserEmail(userData.email);
        } else {
          // Handle case where user exists in Auth but not Firestore
          setUserName('Guest');
          setUserType('buyer');
          setUserEmail(null);
        }
      } else {
        // User is signed out
        setUid(null);
        setUserName('Guest');
        setUserType('buyer');
        setUserEmail(null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ uid, userType, setUserType, userName, setUserName, userEmail, setUserEmail, isLoading }}>
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
