import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#002D56' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 30, color: '#002D56' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 8, marginBottom: 15, backgroundColor: '#f9f9f9', fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: '#002D56', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonDanger: { backgroundColor: '#D32F2F' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  footerText: { textAlign: 'center', marginTop: 20, color: '#002D56', fontSize: 12 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#eee', elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#002D56', marginBottom: 5 },
  cardText: { fontSize: 14, color: '#444', marginBottom: 5 }
});