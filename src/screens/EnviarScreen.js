import { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '../context/AuthContext'; // Ajuste o caminho conforme necessário

const API_BASE_URL = 'https://sigac-back-6jy9.onrender.com';

export default function EnviarScreen() {
  // Usando o hook useAuth que já está definido no AuthContext
  const { token } = useAuth();
  
  const [cursos, setCursos] = useState([]);
  const [regras, setRegras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form fields
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [selectedRegra, setSelectedRegra] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [data, setData] = useState('');
  const [descricao, setDescricao] = useState('');
  const [arquivo, setArquivo] = useState(null);
  
  // Dropdown states
  const [showCursoDropdown, setShowCursoDropdown] = useState(false);
  const [showRegraDropdown, setShowRegraDropdown] = useState(false);

  // Buscar cursos quando tiver token
  useEffect(() => {
    if (token) {
      fetchCursos();
    }
  }, [token]);

  // Buscar regras quando curso muda
  useEffect(() => {
    if (selectedCurso && token) {
      fetchRegras(selectedCurso.id);
    } else {
      setRegras([]);
      setSelectedRegra(null);
    }
  }, [selectedCurso, token]);

  const fetchCursos = async () => {
    if (!token) {
      Alert.alert('Erro', 'Token de autenticação não disponível');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/cursos/listar`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 401 || response.status === 403) {
        Alert.alert('Sessão expirada', 'Faça login novamente');
        return;
      }
      
      const data = await response.json();
      setCursos(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os cursos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegras = async (cursoId) => {
    if (!token) {
      Alert.alert('Erro', 'Token de autenticação não disponível');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/regras/listar?curso_id=${cursoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 401 || response.status === 403) {
        Alert.alert('Sessão expirada', 'Faça login novamente');
        return;
      }
      
      const data = await response.json();
      setRegras(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as regras');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        Alert.alert('Erro', 'O arquivo deve ter no máximo 10MB');
        return;
      }

      setArquivo(file);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao selecionar o arquivo');
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    // Validar token
    if (!token) {
      Alert.alert('Erro', 'Token de autenticação não disponível. Faça login novamente.');
      return;
    }

    // Validar campos obrigatórios
    if (!selectedCurso) {
      Alert.alert('Erro', 'Selecione um curso');
      return;
    }
    if (!selectedRegra) {
      Alert.alert('Erro', 'Selecione uma regra de atividade');
      return;
    }
    if (!titulo.trim()) {
      Alert.alert('Erro', 'Preencha o título da atividade');
      return;
    }
    if (!cargaHoraria.trim() || isNaN(cargaHoraria)) {
      Alert.alert('Erro', 'Preencha a carga horária com um número válido');
      return;
    }
    if (!data.trim()) {
      Alert.alert('Erro', 'Preencha a data');
      return;
    }
    if (!arquivo) {
      Alert.alert('Erro', 'Selecione um arquivo para upload');
      return;
    }

    try {
      setUploading(true);

      // Preparar FormData
      const formData = new FormData();
      formData.append('carga_horaria_solicitada', parseInt(cargaHoraria));
      formData.append('id_curso', selectedCurso.id);
      formData.append('id_regra_atividade', selectedRegra.id);
      formData.append('titulo', titulo.trim());
      formData.append('nome_arquivo', arquivo.name);
      
      // Anexar arquivo
      formData.append('arquivo', {
        uri: arquivo.uri,
        name: arquivo.name,
        type: arquivo.mimeType || 'application/octet-stream',
      });

      const response = await fetch(`${API_BASE_URL}/api/certificados/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.status === 401 || response.status === 403) {
        Alert.alert('Sessão expirada', 'Faça login novamente');
        return;
      }

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Atividade enviada com sucesso!');
        // Resetar formulário
        setSelectedCurso(null);
        setSelectedRegra(null);
        setTitulo('');
        setCargaHoraria('');
        setData('');
        setDescricao('');
        setArquivo(null);
        setRegras([]);
      } else {
        Alert.alert('Erro', result.message || 'Erro ao enviar atividade');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao enviar atividade. Tente novamente.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const renderDropdown = (items, selectedItem, onSelect, show, setShow, placeholder, disabled = false) => {
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity 
          style={[styles.dropdownHeader, disabled && styles.dropdownDisabled]}
          onPress={() => !disabled && setShow(!show)}
          disabled={disabled}
        >
          <Text style={selectedItem ? styles.dropdownText : styles.dropdownPlaceholder}>
            {selectedItem ? selectedItem.nome : placeholder}
          </Text>
          <Ionicons name={show ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
        </TouchableOpacity>
        {show && items.length > 0 && (
          <View style={styles.dropdownList}>
            <ScrollView nestedScrollEnabled style={{ maxHeight: 150 }}>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    onSelect(item);
                    setShow(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item.nome}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        {show && items.length === 0 && !disabled && (
          <View style={styles.dropdownList}>
            <Text style={styles.dropdownEmptyText}>Nenhum item disponível</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Nova Atividade</Text>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9800" />
        </View>
      )}

      {!token && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={24} color="#ff4444" />
          <Text style={styles.errorText}>
            Token de autenticação não encontrado. Faça login novamente.
          </Text>
        </View>
      )}

      <Text style={styles.label}>Curso *</Text>
      {renderDropdown(
        cursos,
        selectedCurso,
        setSelectedCurso,
        showCursoDropdown,
        setShowCursoDropdown,
        'Selecione o curso',
        !token || loading
      )}

      <Text style={styles.label}>Regra de Atividade *</Text>
      {renderDropdown(
        regras,
        selectedRegra,
        setSelectedRegra,
        showRegraDropdown,
        setShowRegraDropdown,
        selectedCurso ? 'Selecione a regra' : 'Selecione um curso primeiro',
        !token || loading || !selectedCurso
      )}

      <Text style={styles.label}>Título da Atividade *</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ex: Curso de React Avançado" 
        value={titulo}
        onChangeText={setTitulo}
        editable={!!token}
      />

      <View style={styles.row}>
        <View style={{flex: 1, marginRight: 10}}>
          <Text style={styles.label}>Carga Horária *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="20" 
            keyboardType="numeric" 
            value={cargaHoraria}
            onChangeText={setCargaHoraria}
            editable={!!token}
          />
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.label}>Data *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="dd/mm/aaaa" 
            value={data}
            onChangeText={setData}
            editable={!!token}
          />
        </View>
      </View>

      <Text style={styles.label}>Descrição</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="Descreva brevemente a atividade realizada..." 
        multiline 
        value={descricao}
        onChangeText={setDescricao}
        editable={!!token}
      />

      <TouchableOpacity 
        style={[styles.uploadBox, !token && styles.uploadBoxDisabled]} 
        onPress={pickDocument}
        disabled={!token}
      >
        <Ionicons name="cloud-upload-outline" size={30} color="#FF9800" />
        <Text style={styles.uploadText}>
          {arquivo ? arquivo.name : 'Anexar Comprovante'}
        </Text>
        <Text style={styles.uploadSubText}>
          {arquivo ? `${(arquivo.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, PNG ou JPG (máx 10MB)'}
        </Text>
      </TouchableOpacity>

      {arquivo && (
        <TouchableOpacity 
          style={styles.removeFileButton} 
          onPress={() => setArquivo(null)}
        >
          <Ionicons name="close-circle" size={20} color="#ff4444" />
          <Text style={styles.removeFileText}>Remover arquivo</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={[styles.submitButton, (uploading || !token) && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={uploading || !token}
      >
        {uploading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Enviar Atividade</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#002D56', marginBottom: 20 },
  label: { fontSize: 14, color: '#002D56', marginBottom: 5, fontWeight: '600' },
  
  dropdownContainer: { marginBottom: 15 },
  dropdownHeader: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dropdownDisabled: {
    backgroundColor: '#f5f5f5',
    opacity: 0.7,
  },
  dropdownText: { color: '#002D56', fontSize: 14 },
  dropdownPlaceholder: { color: '#666', fontSize: 14 },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#fff',
    maxHeight: 150,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: { color: '#002D56', fontSize: 14 },
  dropdownEmptyText: { 
    padding: 12, 
    textAlign: 'center', 
    color: '#666',
    fontSize: 14 
  },
  
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 15 
  },
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
    opacity: 0.5,
  },
  uploadText: { fontWeight: 'bold', color: '#002D56', marginTop: 10 },
  uploadSubText: { fontSize: 12, color: '#666' },
  
  removeFileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  removeFileText: { color: '#ff4444', marginLeft: 5, fontSize: 14 },
  
  submitButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    color: '#c62828',
    marginLeft: 10,
    flex: 1,
  },
});
