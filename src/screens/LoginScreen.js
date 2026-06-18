import { Alert, Text, View, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import { useAuth } from '../context/AuthContext';
import { globalStyles } from '../styles/globalStyles';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha o e-mail e a senha.');
      return;
    }

    setLoading(true);
    try {
      await signIn(email.trim(), password);
      // O AppNavigator detecta automaticamente que o usuário está autenticado
      // e redireciona para HomeTabs — não é necessário navegar manualmente aqui.
    } catch (error) {
      // Mensagens de erro específicas do backend ou da validação de perfil
      const msg =
        error.message === 'Acesso restrito a alunos. Use o portal web para outros perfis.'
          ? error.message
          : 'E-mail ou senha inválidos.';
      Alert.alert('Erro ao entrar', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>SIGAC</Text>
      <Text style={globalStyles.subtitle}>Portal do Aluno</Text>

      <AppInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
      />
      <AppInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#002D56" style={{ marginTop: 15 }} />
      ) : (
        <AppButton title="Entrar" onPress={handleLogin} />
      )}

      <Text style={globalStyles.footerText}>Acesso exclusivo para alunos</Text>
    </View>
  );
}
