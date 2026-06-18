import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { request } from '../api/api';

const CourseContext = createContext({});

export function CourseProvider({ children }) {
  const [cursos, setCursos] = useState([]);
  const [cursoAtivo, setCursoAtivo] = useState(null); // { id, nome, carga_horaria }
  const [loadingCursos, setLoadingCursos] = useState(true);

  const carregarCursos = useCallback(async () => {
    try {
      setLoadingCursos(true);
      const data = await request('/api/relatorios/meus-cursos');

      if (data.success && data.cursos.length > 0) {
        setCursos(data.cursos);

        // Tenta restaurar o curso ativo salvo anteriormente
        const salvo = await AsyncStorage.getItem('@curso_ativo');
        if (salvo) {
          const cursoPersistido = JSON.parse(salvo);
          // Confirma que o curso ainda existe nos vínculos atuais
          const ainda = data.cursos.find(c => c.id === cursoPersistido.id);
          if (ainda) {
            setCursoAtivo(ainda);
            return;
          }
        }
        // Padrão: primeiro curso da lista
        setCursoAtivo(data.cursos[0]);
        await AsyncStorage.setItem('@curso_ativo', JSON.stringify(data.cursos[0]));
      }
    } catch {
      // Silencia — HomeScreen trata o erro de carregamento do dashboard
    } finally {
      setLoadingCursos(false);
    }
  }, []);

  useEffect(() => {
    carregarCursos();
  }, [carregarCursos]);

  async function selecionarCurso(curso) {
    setCursoAtivo(curso);
    await AsyncStorage.setItem('@curso_ativo', JSON.stringify(curso));
  }

  async function limparCurso() {
    setCursos([]);
    setCursoAtivo(null);
    await AsyncStorage.removeItem('@curso_ativo');
  }

  return (
    <CourseContext.Provider value={{ cursos, cursoAtivo, loadingCursos, selecionarCurso, carregarCursos, limparCurso }}>
      {children}
    </CourseContext.Provider>
  );
}

export const useCourse = () => useContext(CourseContext);
