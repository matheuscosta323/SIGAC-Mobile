import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';

export default function PerfilScreen() {
  const { user, signOut } = useAuth();
  const { cursos, cursoAtivo, loadingCursos, selecionarCurso } = useCourse();

  // Iniciais do nome para o avatar
  const iniciais = user?.nome
    ? user.nome.split(' ').slice(0, 2).map(p => p[0].toUpperCase()).join('')
    : '?';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Meu Perfil</Text>

      {/* Card do Usuário */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{iniciais}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName} numberOfLines={1}>{user?.nome ?? 'Aluno'}</Text>
          <Text style={styles.userInfo}>Aluno</Text>
        </View>
      </View>

      {/* Seleção de Cursos */}
      <Text style={styles.sectionTitle}>Meus Cursos</Text>
      <Text style={styles.sectionHint}>Toque em um curso para ver seu dashboard</Text>

      {loadingCursos ? (
        <ActivityIndicator size="small" color="#002D56" style={{ marginVertical: 20 }} />
      ) : cursos.length === 0 ? (
        <View style={globalStyles.card}>
          <Text style={{ color: '#666', textAlign: 'center' }}>Nenhum curso vinculado.</Text>
        </View>
      ) : (
        cursos.map(curso => {
          const ativo = cursoAtivo?.id === curso.id;
          return (
            <TouchableOpacity
              key={curso.id}
              onPress={() => selecionarCurso(curso)}
              activeOpacity={0.75}
            >
              <View style={[globalStyles.card, styles.courseCard, ativo && styles.courseCardActive]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.courseTitle, ativo && styles.courseTitleActive]}>
                    {curso.nome}
                  </Text>
                  <Text style={styles.courseSubtitle}>{curso.carga_horaria}h complementares</Text>
                </View>
                {ativo && (
                  <Ionicons name="checkmark-circle" size={22} color="#FFD700" />
                )}
              </View>
            </TouchableOpacity>
          );
        })
      )}

      {/* Opções */}
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>Notificações</Text>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>Configurações</Text>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Ionicons name="log-out-outline" size={18} color="#D32F2F" style={{ marginRight: 6 }} />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: '#fff', padding: 20 },
  header:            { fontSize: 22, fontWeight: 'bold', color: '#002D56', marginBottom: 20, marginTop: 10 },
  userCard:          { backgroundColor: '#002D56', padding: 20, borderRadius: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatar:            { width: 56, height: 56, borderRadius: 28, backgroundColor: '#4a6582', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText:        { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  userName:          { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  userInfo:          { color: '#ccc', fontSize: 12, marginTop: 2 },
  sectionTitle:      { fontSize: 16, fontWeight: 'bold', color: '#002D56', marginBottom: 4 },
  sectionHint:       { fontSize: 12, color: '#999', marginBottom: 12 },
  courseCard:        { flexDirection: 'row', alignItems: 'center', marginBottom: 10, padding: 15, borderWidth: 1, borderColor: '#eee' },
  courseCardActive:  { borderColor: '#FFD700', borderWidth: 2, backgroundColor: '#FFFBEA' },
  courseTitle:       { fontWeight: 'bold', color: '#002D56', fontSize: 14 },
  courseTitleActive: { color: '#002D56' },
  courseSubtitle:    { fontSize: 12, color: '#666', marginTop: 3 },
  menuItem:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
  menuText:          { color: '#333', fontSize: 15 },
  logoutButton:      { marginTop: 24, padding: 15, borderRadius: 8, backgroundColor: '#FFF5F5', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFCDD2' },
  logoutText:        { color: '#D32F2F', fontWeight: 'bold' },
});
