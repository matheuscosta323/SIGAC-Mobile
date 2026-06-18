import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { request } from '../api/api';

/**
 * Decodifica o payload de um JWT sem verificar a assinatura.
 * A verificação real acontece no servidor a cada requisição autenticada.
 */
function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaura sessão salva ao iniciar o app
  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const storedToken = await AsyncStorage.getItem('@token');
      const storedUser = await AsyncStorage.getItem('@user');

      if (storedToken && storedUser) {
        // Valida que o token armazenado ainda pertence a um aluno
        const payload = decodeJwtPayload(storedToken);
        if (payload && payload.role === 'aluno') {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          // Token inválido ou de outro perfil: limpa o storage
          await AsyncStorage.multiRemove(['@token', '@user']);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email, password) {
    // 1. Chama o endpoint real do backend
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha: password }),
    });

    // 2. Decodifica o token para extrair as informações do usuário
    const payload = decodeJwtPayload(data.access_token);

    if (!payload) {
      throw new Error('Token inválido recebido do servidor.');
    }

    // 3. Garante que apenas alunos possam fazer login no app mobile
    if (payload.role !== 'aluno') {
      throw new Error('Acesso restrito a alunos. Use o portal web para outros perfis.');
    }

    // 4. Monta o objeto de usuário a partir do payload JWT
    const userData = {
      id: payload.sub,          // "sub" = identity (id do usuário)
      nome: payload.nome,
      role: payload.role,
    };

    // 5. Persiste token e usuário no AsyncStorage
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
