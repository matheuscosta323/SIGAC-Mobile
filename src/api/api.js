import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://sigac-back-6jy9.onrender.com';

export async function request(endpoint, options = {}) {
  const token = await AsyncStorage.getItem('@token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Erro na requisição.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
