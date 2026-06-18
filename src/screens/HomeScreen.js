import { useEffect, useState, useCallback } from 'react';
import {
  ScrollView, Text, View, StyleSheet,
  ActivityIndicator, RefreshControl, Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import { request } from '../api/api';
import { globalStyles } from '../styles/globalStyles';

export default function HomeScreen() {
  const { user } = useAuth();
  const { cursoAtivo, loadingCursos, cursosCarregados } = useCourse();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = useCallback(async () => {
    if (!cursoAtivo) return;
    try {
      const data = await request(`/api/relatorios/dashboard-aluno?id_curso=${cursoAtivo.id}`);
      setDashboard(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o dashboard.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [cursoAtivo]);

  useEffect(() => {
    if (!cursosCarregados) return; // aguarda carregamento inicial
    setLoading(true);
    setDashboard(null);
    fetchDashboard();
  }, [fetchDashboard, cursosCarregados]);

  function onRefresh() {
    setRefreshing(true);
    fetchDashboard();
  }

  // Ainda carregando os cursos
  if (loadingCursos || !cursosCarregados) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#002D56" />
      </View>
    );
  }

  // Cursos carregados mas nenhum vinculado
  if (!cursoAtivo) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#666', textAlign: 'center', paddingHorizontal: 30 }}>
          Nenhum curso vinculado.{'\n'}Fale com a coordenação.
        </Text>
      </View>
    );
  }

  // Carregando dashboard do curso
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#002D56" />
      </View>
    );
  }

  const progresso = dashboard?.progresso ?? {};
  const areas = dashboard?.horas_por_area ?? [];
  const solicitacoes = dashboard?.solicitacoes ?? {};
  const horasAprovadas = progresso.horas_aprovadas ?? 0;
  const cargaTotal = progresso.carga_horaria_total ?? 0;
  const percentual = progresso.percentual ?? 0;
  const faltam = Math.max(0, cargaTotal - horasAprovadas);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#002D56']} />}
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Olá, {user?.nome?.split(' ')[0] ?? 'Aluno'}!</Text>
        <Text style={styles.infoText}>{cursoAtivo.nome}</Text>
      </View>

      <View style={[globalStyles.card, styles.progressCard]}>
        <Text style={styles.cardHeader}>Progresso Total</Text>
        <View style={styles.progressRow}>
          <View>
            <Text style={styles.hoursText}>{horasAprovadas}h</Text>
            <Text style={styles.subHoursText}>de {cargaTotal}h obrigatórias</Text>
          </View>
          <View style={styles.circlePlaceholder}>
            <Text style={{ color: '#FFD700', fontWeight: 'bold' }}>{percentual}%</Text>
          </View>
        </View>
        {faltam > 0
          ? <Text style={styles.statusText}>📈 Faltam {faltam}h para concluir</Text>
          : <Text style={styles.statusText}>🎉 Carga horária concluída!</Text>
        }
      </View>

      {areas.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Horas por Área</Text>
          {areas.map(area => (
            <ProgressBar
              key={area.area}
              label={area.area}
              current={area.horas_aprovadas}
              total={area.limite_horas}
            />
          ))}
        </>
      )}

      <Text style={styles.sectionTitle}>Solicitações</Text>
      <View style={styles.statusContainer}>
        <StatusCard count={solicitacoes.pendentes ?? 0} title="Pendentes"  color="#FF9800" bgColor="#FFF3E0" />
        <StatusCard count={solicitacoes.aprovadas ?? 0} title="Aprovadas"  color="#4CAF50" bgColor="#E8F5E9" />
        <StatusCard count={solicitacoes.recusadas ?? 0} title="Recusadas"  color="#F44336" bgColor="#FFEBEE" />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const AREA_COLORS = { Ensino: '#2196F3', Pesquisa: '#00C853', Extensão: '#6200EA', default: '#FF9800' };

function ProgressBar({ label, current, total }) {
  const color = AREA_COLORS[label] ?? AREA_COLORS.default;
  const pct = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressLabels}>
        <Text style={{ fontWeight: 'bold', color: '#002D56' }}>{label}</Text>
        <Text style={{ color: '#666' }}>{current}h / {total}h</Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function StatusCard({ count, title, color, bgColor }) {
  return (
    <View style={[globalStyles.card, styles.statusCard, { backgroundColor: bgColor, borderColor: color, borderWidth: 1 }]}>
      <Text style={[styles.countText, { color }]}>{count}</Text>
      <Text style={[styles.titleText, { color }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: '#fff', padding: 20 },
  centered:          { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header:            { marginBottom: 20, marginTop: 20 },
  welcomeText:       { fontSize: 22, fontWeight: 'bold', color: '#002D56' },
  infoText:          { color: '#666', fontSize: 14 },
  progressCard:      { backgroundColor: '#002D56', padding: 20 },
  cardHeader:        { color: '#fff', fontSize: 14 },
  progressRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
  hoursText:         { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  subHoursText:      { color: '#fff', opacity: 0.8 },
  circlePlaceholder: { width: 60, height: 60, borderRadius: 30, borderWidth: 3, borderColor: '#FFD700', justifyContent: 'center', alignItems: 'center' },
  statusText:        { color: '#FFD700', marginTop: 10, fontSize: 12 },
  sectionTitle:      { fontSize: 18, fontWeight: 'bold', color: '#002D56', marginBottom: 15, marginTop: 10 },
  progressContainer: { marginBottom: 15 },
  progressLabels:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  barBackground:     { height: 8, backgroundColor: '#eee', borderRadius: 4 },
  barFill:           { height: 8, borderRadius: 4 },
  statusContainer:   { flexDirection: 'row', justifyContent: 'space-between' },
  statusCard:        { width: '30%', alignItems: 'center', padding: 10, borderRadius: 12 },
  countText:         { fontSize: 20, fontWeight: 'bold' },
  titleText:         { fontSize: 10, fontWeight: 'bold', marginTop: 5 },
});
