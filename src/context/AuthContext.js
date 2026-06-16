import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { request } from '../api/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStorageData(); }, []);

  async function loadStorageData() {
    const storedToken = await AsyncStorage.getItem('@token');
    const storedUser = await AsyncStorage.getItem('@user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }

  async function signIn(email, password) {
    const data = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    setToken(data.token);
    setUser(data.user);
    await AsyncStorage.setItem('@token', data.token);
    await AsyncStorage.setItem('@user', JSON.stringify(data.user));
  }

  return <AuthContext.Provider value={{ user, token, loading, signIn }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);