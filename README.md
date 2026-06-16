# SIGAC — Sistema de Gestão de Atividades Complementares

> Aplicativo mobile desenvolvido para os alunos do curso de **Análise e Desenvolvimento de Sistemas (ADS)** do **Senac PE**, com o objetivo de descentralizar e agilizar o processo de validação de horas complementares.

---

## 📋 Sobre o Projeto

O **SIGAC** permite que o aluno, diretamente pelo celular:

- Envie comprovantes de atividades complementares (Cursos, Eventos, Palestras)
- Acompanhe o status das solicitações (Pendentes, Aprovadas ou Rejeitadas)
- Visualize seu perfil acadêmico e histórico detalhado de atividades

---

## 🖥️ Status das Telas

O projeto encontra-se em fase de **prototipagem de alta fidelidade**, com navegação e interface finalizadas.

| Tela | Status | Descrição |
|---|---|---|
| Login |  Pronta | Interface finalizada; estrutura de autenticação pronta para integração |
| Início (Home) |  Pronta | Dashboard com resumo das horas e atividades recentes |
| Enviar |  Pronta | Formulário completo com campos de input e área de upload (UI) |
| Histórico |  Pronta | Listagem dinâmica com filtros por status e badges coloridos |
| Perfil |  Pronta | Detalhes do aluno, cursos vinculados e opções de conta |

---

##  Tecnologias Utilizadas

- [React Native](https://reactnative.dev/) `0.81.5`
- [Expo](https://expo.dev/) `~54.0.34`
- [React Navigation](https://reactnavigation.org/) — Stack + Bottom Tabs
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) — persistência local
- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) — upload de comprovantes

---

## Estrutura do Projeto

```
sigac-app/
├── src/
│   ├── api/
│   │   └── api.js              # Requisições
│   ├── components/
│   │   ├── AppButton.js        # Botão reutilizável
│   │   └── AppInput.js         # Input reutilizável
│   ├── context/
│   │   └── AuthContext.js      # Contexto de autenticação
│   ├── navigation/
│   │   └── AppNavigator.js     # Navegação principal
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── HomeScreen.js
│   │   ├── EnviarScreen.js
│   │   ├── HistoricoScreen.js
│   │   └── PerfilScreen.js
│   └── styles/
│       └── globalStyles.js     # Estilos globais
├── App.js
├── index.js
└── package.json
```

---

##  Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [Expo Go](https://expo.dev/client) instalado no celular (Android ou iOS)

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/sigac-app.git
cd sigac-app
```

**2. Instale as dependências**
```bash
npm install
```

**3. Inicie o projeto**
```bash
npx expo start
```

**4. Abra no celular**

Abra o aplicativo **Expo Go** no seu celular e escaneie o **QR Code** que aparecer no terminal.

---

##  Dependências

| Pacote | Versão |
|---|---|
| @react-native-async-storage/async-storage | 2.2.0 |
| @react-navigation/bottom-tabs | ^7.18.0 |
| @react-navigation/native | ^7.3.1 |
| @react-navigation/native-stack | ^7.17.3 |
| expo | ~54.0.34 |
| expo-image-picker | ~17.0.11 |
| expo-status-bar | ~3.0.9 |
| react | 19.1.0 |
| react-native | 0.81.5 |
| react-native-safe-area-context | ~5.6.0 |
| react-native-screens | ~4.16.0 |

---

##  Autora

Desenvolvido por **Dayane Oliveira**  
Curso de Análise e Desenvolvimento de Sistemas — Senac PE

---

##  Licença

Este projeto é de uso acadêmico.
