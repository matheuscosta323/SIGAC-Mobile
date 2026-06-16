import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Olá, João Silva!</Text>
        <Text style={styles.infoText}>ADS • 2024.1</Text>
      </View>

      {/* Card de Progresso */}
      <View style={[globalStyles.card, styles.progressCard]}>
        <Text style={styles.cardHeader}>Progresso Total</Text>
        <View style={styles.progressRow}>
          <View>
            <Text style={styles.hoursText}>72h</Text>
            <Text style={styles.subHoursText}>de 100h obrigatórias</Text>
          </View>
          <View style={styles.circlePlaceholder}>
            <Text style={{color:'#FFD700', fontWeight: 'bold'}}>72%</Text>
          </View>
        </View>
        <Text style={styles.statusText}>📈 Faltam 28 horas para concluir</Text>
      </View>

      {/* Horas por Área */}
      <Text style={styles.sectionTitle}>Horas por Área</Text>
      <ProgressBar label="Ensino" current={28} total={40} color="#2196F3" />
      <ProgressBar label="Pesquisa" current={10} total={30} color="#00C853" />
      <ProgressBar label="Extensão" current={30} total={30} color="#6200EA" />

      {/* Status das Solicitações */}
      <Text style={styles.sectionTitle}>Status das Solicitações</Text>
      <View style={styles.statusContainer}>
        <StatusCard count="3" title="Pendentes" color="#FF9800" bgColor="#FFF3E0" />
        <StatusCard count="8" title="Aprovadas" color="#4CAF50" bgColor="#E8F5E9" />
        <StatusCard count="1" title="Rejeitadas" color="#F44336" bgColor="#FFEBEE" />
      </View>
      
      <View style={{ height: 40 }} /> 
    </ScrollView>
  );
}

// Componentes Auxiliares
function ProgressBar({ label, current, total, color }) {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressLabels}>
        <Text style={{fontWeight: 'bold', color: '#002D56'}}>{label}</Text>
        <Text style={{color: '#666'}}>{current}h / {total}h</Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${(current/total)*100}%`, backgroundColor: color }]} />
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
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { marginBottom: 20, marginTop: 20 },
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#002D56' },
  infoText: { color: '#666', fontSize: 14 },
  progressCard: { backgroundColor: '#002D56', padding: 20 },
  cardHeader: { color: '#fff', fontSize: 14 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
  hoursText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  subHoursText: { color: '#fff', opacity: 0.8 },
  circlePlaceholder: { width: 60, height: 60, borderRadius: 30, borderWidth: 3, borderColor: '#FFD700', justifyContent: 'center', alignItems: 'center' },
  statusText: { color: '#FFD700', marginTop: 10, fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#002D56', marginBottom: 15, marginTop: 10 },
  progressContainer: { marginBottom: 15 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  barBackground: { height: 8, backgroundColor: '#eee', borderRadius: 4 },
  barFill: { height: 8, borderRadius: 4 },
  statusContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  statusCard: { width: '30%', alignItems: 'center', padding: 10, borderRadius: 12 },
  countText: { fontSize: 20, fontWeight: 'bold' },
  titleText: { fontSize: 10, fontWeight: 'bold', marginTop: 5 }
});