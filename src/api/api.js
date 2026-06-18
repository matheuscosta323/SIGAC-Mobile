import AsyncStorage from '@react-native-async-storage/async-storage';

// Troque pelo IP/URL do seu servidor backend
// Em desenvolvimento local com Expo, use o IP da sua máquina (ex: http://192.168.1.10:5000)
// Em produção, use a URL do servidor (ex: https://sigac-api.exemplo.com)
const BASE_URL = 'http://SEU_IP_AQUI:5000/api';

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
    // Lança o erro com a mensagem que veio do backend
    const error = new Error(data.message || 'Erro na requisição.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
