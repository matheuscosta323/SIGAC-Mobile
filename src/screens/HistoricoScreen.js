import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';

const dados = [
  { id: '1', titulo: 'Curso de React Avançado', data: '15/04/2026', horas: '20h', area: 'Ensino', status: 'Aprovada' },
  { id: '2', titulo: 'Workshop Git & GitHub', data: '10/04/2026', horas: '8h', area: 'Ensino', status: 'Pendente' },
  { id: '3', titulo: 'Palestra sobre IA', data: '05/04/2026', horas: '4h', area: 'Extensão', status: 'Rejeitada' },
];

export default function HistoricoScreen() {
  const [filtro, setFiltro] = useState('Todas');

  const renderItem = ({ item }) => (
    <View style={[globalStyles.card, styles.itemCard]}>
      <View style={styles.headerRow}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) + '20', borderColor: getStatusColor(item.status) }]}>
          <Text style={{ color: getStatusColor(item.status), fontSize: 10, fontWeight: 'bold' }}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.subText}>📅 {item.data} • 🎓 {item.horas} • 📚 {item.area}</Text>
      <TouchableOpacity><Text style={styles.link}>Ver detalhes > </Text></TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Histórico</Text>
      
      {/* Filtros */}
      <View style={styles.filterContainer}>
        {['Todas', 'Pendentes', 'Aprovadas', 'Rejeitadas'].map(f => (
          <TouchableOpacity key={f} style={[styles.filterBtn, filtro === f && styles.filterBtnActive]} onPress={() => setFiltro(f)}>
            <Text style={filtro === f ? {color: '#fff'} : {color: '#002D56'}}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList 
        data={dados}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

function getStatusColor(status) {
  if (status === 'Aprovada') return '#4CAF50';
  if (status === 'Pendente') return '#FF9800';
  return '#F44336';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#002D56', marginBottom: 20 },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  filterBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#ddd' },
  filterBtnActive: { backgroundColor: '#002D56' },
  itemCard: { padding: 15, marginBottom: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { fontWeight: 'bold', color: '#002D56', fontSize: 16 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, borderWidth: 1 },
  subText: { fontSize: 12, color: '#666', marginVertical: 8 },
  link: { color: '#FFD700', fontWeight: 'bold', fontSize: 12 }
});