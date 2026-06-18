import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CourseProvider, useCourse } from './src/context/CourseContext';
import AppNavigator from './src/navigation/AppNavigator';
import { ActivityIndicator, View } from 'react-native';
import { useEffect } from 'react';

function AuthWrapper() {
  const { user, loading } = useAuth();
  const { carregarCursos, limparCurso } = useCourse();

  // Carrega cursos quando o usuário loga; limpa quando desloga
  useEffect(() => {
    if (user) {
      carregarCursos();
    } else {
      limparCurso();
    }
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#002D56" />
      </View>
    );
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AuthWrapper />
        </NavigationContainer>
      </CourseProvider>
    </AuthProvider>
  );
}
