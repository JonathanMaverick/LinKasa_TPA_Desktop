import { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@renderer/config/firebase';
import { useNavigate } from 'react-router-dom';
import UserContextType from '@renderer/model/UserContextType';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {

  const [errorMessage, setError] = useState('');
  const [username,setUsername] = useState('');
  const [roles, setRoles] = useState('');
  const navigate = useNavigate();

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userData = await getDoc(doc(db, 'users', user.uid));
          setUsername(userData.data()?.name);
          setRoles(userData.data()?.roles);
          navigate('/home');
        } catch (error) {
          setError('Error fetching user data');
        }
      } else {
        setUsername('');
        setRoles('');
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (error) {
      setError('Account invalid');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      alert("Error occured")
    }
  };

  return (
    <UserContext.Provider
      value={{
       username,
       errorMessage,
       roles,
       login,
       logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserAuth = () => {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return user;
};
