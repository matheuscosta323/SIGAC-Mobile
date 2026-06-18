import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import EnviarScreen from '../screens/EnviarScreen';
import HistoricoScreen from '../screens/HistoricoScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#666',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Início') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Enviar') iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
          else if (route.name === 'Histórico') iconName = focused ? 'time' : 'time-outline';
          else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Enviar" component={EnviarScreen} />
      <Tab.Screen name="Histórico" component={HistoricoScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // Usuário autenticado: exibe as telas do app
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
      ) : (
        // Usuário não autenticado: exibe a tela de login
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}
