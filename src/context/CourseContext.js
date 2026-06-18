import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useState, useCallback } from 'react';
import { request } from '../api/api';

const CourseContext = createContext({});

export function CourseProvider({ children }) {
  const [cursos, setCursos] = useState([]);
  const [cursoAtivo, setCursoAtivo] = useState(null);
  const [loadingCursos, setLoadingCursos] = useState(false);
  const [cursosCarregados, setCursosCarregados] = useState(false);

  // Chamado explicitamente pelo App após o login (ou na restauração de sessão)
  const carregarCursos = useCallback(async () => {
    try {
      setLoadingCursos(true);
      const data = await request('/api/relatorios/meus-cursos');

      if (data.success && data.cursos.length > 0) {
        setCursos(data.cursos);

        const salvo = await AsyncStorage.getItem('@curso_ativo');
        if (salvo) {
          const cursoPersistido = JSON.parse(salvo);
          const ainda = data.cursos.find(c => c.id === cursoPersistido.id);
          if (ainda) {
            setCursoAtivo(ainda);
            return;
          }
        }
        // Padrão: primeiro da lista
        setCursoAtivo(data.cursos[0]);
        await AsyncStorage.setItem('@curso_ativo', JSON.stringify(data.cursos[0]));
      } else {
        setCursos([]);
        setCursoAtivo(null);
      }
    } catch (e) {
      console.warn('Erro ao carregar cursos:', e.message);
      setCursos([]);
      setCursoAtivo(null);
    } finally {
      setLoadingCursos(false);
      setCursosCarregados(true);
    }
  }, []);

  async function selecionarCurso(curso) {
    setCursoAtivo(curso);
    await AsyncStorage.setItem('@curso_ativo', JSON.stringify(curso));
  }

  async function limparCurso() {
    setCursos([]);
    setCursoAtivo(null);
    setCursosCarregados(false);
    await AsyncStorage.removeItem('@curso_ativo');
  }

  return (
    <CourseContext.Provider value={{
      cursos, cursoAtivo, loadingCursos, cursosCarregados,
      selecionarCurso, carregarCursos, limparCurso,
    }}>
      {children}
    </CourseContext.Provider>
  );
}

export const useCourse = () => useContext(CourseContext);
