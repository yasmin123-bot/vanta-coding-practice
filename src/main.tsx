import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/manrope';
import '@fontsource-variable/noto-sans-arabic';
import '@fontsource/jetbrains-mono/400.css';
import './styles/tokens.css';
import './styles/global.css';
import './styles/learning-system.css';
import './styles/student-portal.css';
import './styles/practice-studio.css';
import './styles/mabda.css';
import './styles/app-shell.css';
import App from './App';
import { AuthProvider } from './auth/AuthProvider';
import { StudentProgressProvider } from './state/StudentProgressProvider';
import { ThemeProvider } from './state/ThemeProvider';
import { AppNavigationProvider } from './state/AppNavigationProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <StudentProgressProvider>
          <AppNavigationProvider>
            <App />
          </AppNavigationProvider>
        </StudentProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
