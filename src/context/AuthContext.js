import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("onAuthStateChanged - user:", user); // Debug log
      if (user) {
        console.log("User UID:", user.uid); // Debug log
        console.log("Firestore DB instance:", db); // Debug log
        const userRef = doc(db, 'users', user.uid);
        console.log("User Ref:", userRef); // Debug log
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            console.log("User role data:", userSnap.data()); // Debug log
            setCurrentUser({ ...user, role: userSnap.data().role });
          } else {
            console.log("No user role document found for UID:", user.uid); // Debug log
            setCurrentUser(user); 
          }
        } catch (error) {
          console.error("Error fetching user role from Firestore:", error); // Catch specific error
          setCurrentUser(user); // Still set user even if role fetch fails
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
