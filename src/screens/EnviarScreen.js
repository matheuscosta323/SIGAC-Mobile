// EnviarScreen.js
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function EnviarScreen() {
  // Belfort: Funcionalidade
  const [uploading, setUploading] = useState(false);

  const upload = async () => {
    try {
      const documentoEscolhido = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (documentoEscolhido.canceled || !documentoEscolhido.assets) {
        return;
      }

      const assetArquivo = documentoEscolhido.assets[0];
      setUploading(true);

      const uploadUrl = 'https://servidor.com/upload'; // substituir pela URL do servidor

      const formData = new FormData();
      
      const fileObject = {
        uri: assetArquivo.uri,
        type: assetArquivo.mimeType || 'application/octet-stream',
        name: assetArquivo.name || 'arquivo',
      };
      
      formData.append('arquivo', fileObject);

      const resposta = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      setUploading(false);

      if (resposta.status === 200 || resposta.status === 201) {
        Alert.alert('Sucesso', 'Arquivo upado com sucesso.');
        const responseBody = await resposta.text();
        console.log('Respostas do servidor', responseBody);
      } else {
        Alert.alert('Upload falho', `Servidor respondeu com código ${resposta.status}`);
      }

    } catch (error) {
      setUploading(false);
      Alert.alert('Erro', 'Um erro ocorreu fazendo o upload.');
      console.error(error);
    }
  };

  const handleUpload = () => {
    if (uploading) {
      Alert.alert('Aviso', 'Upload em andamento...');
      return;
    }
    upload();
  };

  // Dayane: Layout
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Nova Atividade</Text>

      <Text style={styles.label}>Categoria *</Text>
      <View style={styles.inputContainer}>
        <Text style={{color: '#666'}}>Selecione a categoria</Text>
      </View>

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
      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="Descreva brevemente a atividade realizada..." 
        multiline 
      />

      <TouchableOpacity 
        style={[styles.uploadBox, uploading && styles.uploadBoxDisabled]}
        onPress={handleUpload}
        disabled={uploading}
      >
        <Ionicons 
          name={uploading ? "hourglass-outline" : "cloud-upload-outline"} 
          size={30} 
          color={uploading ? "#999" : "#FF9800"} 
        />
        <Text style={[styles.uploadText, uploading && styles.uploadTextDisabled]}>
          {uploading ? 'Enviando...' : 'Anexar Comprovante'}
        </Text>
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
  uploadBoxDisabled: {
    opacity: 0.7,
    borderColor: '#999',
  },
  uploadText: { fontWeight: 'bold', color: '#002D56', marginTop: 10 },
  uploadTextDisabled: { color: '#999' },
  uploadSubText: { fontSize: 12, color: '#666' }
});
