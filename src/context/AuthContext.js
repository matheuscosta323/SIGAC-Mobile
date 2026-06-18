import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { request } from '../api/api';

/**
 * Decodifica o payload de um JWT sem verificar a assinatura.
 * NÃO usa atob() — que não existe no Hermes/React Native —
 * e sim uma implementação base64 pura em JS.
 */
function decodeJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    // Converte base64url → base64 padrão
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Padding manual
    const padded = base64 + '=='.slice(0, (4 - (base64.length % 4)) % 4);

    // Decodifica manualmente sem atob (não disponível no Hermes)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let bytes = '';
    let buffer = 0;
    let bitsCollected = 0;

    for (const char of padded) {
      if (char === '=') break;
      const val = chars.indexOf(char);
      if (val === -1) continue;
      buffer = (buffer << 6) | val;
      bitsCollected += 6;
      if (bitsCollected >= 8) {
        bitsCollected -= 8;
        bytes += String.fromCharCode((buffer >> bitsCollected) & 0xff);
      }
    }

    return JSON.parse(bytes);
  } catch {
    return null;
  }
}

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const storedToken = await AsyncStorage.getItem('@token');
      const storedUser = await AsyncStorage.getItem('@user');

      if (storedToken && storedUser) {
        const payload = decodeJwtPayload(storedToken);
        if (payload && payload.role === 'aluno') {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          await AsyncStorage.multiRemove(['@token', '@user']);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha: password }),
    });

    const payload = decodeJwtPayload(data.access_token);

    if (!payload) {
      throw new Error('Token inválido recebido do servidor.');
    }

    if (payload.role !== 'aluno') {
      throw new Error('Acesso restrito a alunos. Use o portal web para outros perfis.');
    }

    const userData = {
      id: payload.sub,
      nome: payload.nome,
      role: payload.role,
    };

    await AsyncStorage.setItem('@token', data.access_token);
    await AsyncStorage.setItem('@user', JSON.stringify(userData));

    setToken(data.access_token);
    setUser(userData);
  }

  async function signOut() {
    await AsyncStorage.multiRemove(['@token', '@user']);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
