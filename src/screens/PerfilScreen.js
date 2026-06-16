import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';

export default function PerfilScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Meu Perfil</Text>

      {/* Card de Usuário */}
      <View style={styles.userCard}>
        <View style={styles.avatar}><Text style={styles.avatarText}>JS</Text></View>
        <View>
          <Text style={styles.userName}>João Silva</Text>
          <Text style={styles.userInfo}>RA: 123456</Text>
          <Text style={styles.userInfo}>joao.silva@aluno.senac.br</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Meus Cursos</Text>
      
      {/* Cursos */}
      <View style={[globalStyles.card, styles.courseCardActive]}>
        <Text style={styles.courseTitle}>Análise e Desenvolvimento de Sistemas</Text>
        <Text style={styles.courseSubtitle}>ADS-2024</Text>
        <Ionicons name="checkmark-circle-outline" size={20} style={styles.checkIcon} />
      </View>

      <View style={[globalStyles.card, styles.courseCard]}>
        <Text style={styles.courseTitle}>Gestão Comercial</Text>
        <Text style={styles.courseSubtitle}>GC-2024</Text>
      </View>

      {/* Opções */}
      <TouchableOpacity style={styles.menuItem}><Text>Notificações</Text><Ionicons name="chevron-forward" size={20} color="#666"/></TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}><Text>Configurações</Text><Ionicons name="chevron-forward" size={20} color="#666"/></TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#002D56', marginBottom: 20 },
  userCard: { backgroundColor: '#002D56', padding: 20, borderRadius: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#4a6582', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  userName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  userInfo: { color: '#ccc', fontSize: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#002D56', marginBottom: 10 },
  courseCardActive: { borderColor: '#FFD700', borderWidth: 1, marginBottom: 10, padding: 15 },
  courseCard: { marginBottom: 10, padding: 15 },
  courseTitle: { fontWeight: 'bold', color: '#002D56' },
  courseSubtitle: { fontSize: 12, color: '#666' },
  checkIcon: { position: 'absolute', right: 15, top: 15, color: '#FFD700' },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
  logoutButton: { marginTop: 20, padding: 15, borderRadius: 8, backgroundColor: '#FFF5F5', alignItems: 'center', borderWidth: 1, borderColor: '#FFCDD2' },
  logoutText: { color: '#D32F2F', fontWeight: 'bold' }
});