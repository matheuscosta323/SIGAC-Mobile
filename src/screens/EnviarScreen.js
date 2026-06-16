import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EnviarScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Nova Atividade</Text>

      <Text style={styles.label}>Categoria *</Text>
      <View style={styles.inputContainer}><Text style={{color: '#666'}}>Selecione a categoria</Text></View>

      <Text style={styles.label}>Título da Atividade *</Text>
      <TextInput style={styles.input} placeholder="Ex: Curso de React Avançado" />

      <View style={styles.row}>
        <View style={{flex: 1, marginRight: 10}}>
          <Text style={styles.label}>Carga Horária *</Text>
          <TextInput style={styles.input} placeholder="20" keyboardType="numeric" />
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.label}>Data *</Text>
          <TextInput style={styles.input} placeholder="dd/mm/aaaa" />
        </View>
      </View>

      <Text style={styles.label}>Descrição</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder="Descreva brevemente a atividade realizada..." multiline />

      <TouchableOpacity style={styles.uploadBox}>
        <Ionicons name="cloud-upload-outline" size={30} color="#FF9800" />
        <Text style={styles.uploadText}>Anexar Comprovante</Text>
        <Text style={styles.uploadSubText}>PDF, PNG ou JPG (máx 10MB)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#002D56', marginBottom: 20 },
  label: { fontSize: 14, color: '#002D56', marginBottom: 5, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15 },
  inputContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15 },
  row: { flexDirection: 'row' },
  textArea: { height: 100, textAlignVertical: 'top' },
  uploadBox: { 
    borderWidth: 2, 
    borderColor: '#FFD700', 
    borderStyle: 'dashed', 
    borderRadius: 10, 
    padding: 30, 
    alignItems: 'center', 
    backgroundColor: '#FFFBF0',
    marginTop: 10 
  },
  uploadText: { fontWeight: 'bold', color: '#002D56', marginTop: 10 },
  uploadSubText: { fontSize: 12, color: '#666' }
});

