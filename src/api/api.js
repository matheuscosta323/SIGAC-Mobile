export async function request(endpoint, options = {}) {
  // Simulando um tempo de espera (delay) como se fosse um servidor real
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulando a resposta do Login
  if (endpoint === '/auth/login') {
    return {
      token: 'fake-jwt-token-123',
      user: { name: 'Aluno Exemplo', email: 'exemplo@aluno.senac.br' }
    };
  }
  
  throw new Error('Rota não encontrada no mock');
}