import { Alert, Text, View } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native'; // 1. Importe o hook
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import { useAuth } from '../context/AuthContext';
import { globalStyles } from '../styles/globalStyles';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const navigation = useNavigation(); // 2. Inicialize o hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    try {
      await signIn(email, password);
      // 3. Se o login funcionar (sem erros), navegue para a Home
      navigation.navigate('HomeTabs'); 
    } catch (error) {
      Alert.alert('Erro', 'Usuário ou senha inválidos.');
    }
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>SIGAC</Text>
      <Text style={globalStyles.subtitle}>Portal do Aluno</Text>

      <AppInput 
        placeholder="E-mail ou RA" 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none" 
      />
      <AppInput 
        placeholder="Senha" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />
      
      <AppButton title="Entrar" onPress={handleLogin} />
      
      <Text style={globalStyles.footerText}>Acesso exclusivo para alunos</Text>
    </View>
  );
}