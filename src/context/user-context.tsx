
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
  address: string | null;
  setAddress: (address: string | null) => void;
  city: string | null;
  setCity: (city: string | null) => void;
  zip: string | null;
  setZip: (zip: string | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Helper function to introduce a small delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [uid, setUid] = useState<string | null>(null);
  const [userType, setUserType] = useState<UserType>('buyer');
  const [userName, setUserName] = useState('Guest');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [zip, setZip] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setIsLoading(true);
      if (firebaseUser) {
        await delay(100); 
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        setUid(firebaseUser.uid);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.fullName || 'User');
          setUserType(userData.role || 'buyer');
          setUserEmail(userData.email || null);
          setAddress(userData.address || null);
          setCity(userData.city || null);
          setZip(userData.zip || null);
        } else {
          setUserName('Guest');
          setUserType('buyer');
          setUserEmail(null);
          setAddress(null);
          setCity(null);
          setZip(null);
        }
      } else {
        setUid(null);
        setUserName('Guest');
        setUserType('buyer');
        setUserEmail(null);
        setAddress(null);
        setCity(null);
        setZip(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ 
        uid, 
        userType, setUserType, 
        userName, setUserName, 
        userEmail, setUserEmail,
        address, setAddress,
        city, setCity,
        zip, setZip,
        isLoading 
    }}>
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
