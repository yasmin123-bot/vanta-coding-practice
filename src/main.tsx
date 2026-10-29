import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/space-grotesk';
import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/500.css';
import '@fontsource/ibm-plex-sans-arabic/600.css';
import '@fontsource/jetbrains-mono/400.css';
import './styles/tokens.css';
import './styles/global.css';
import './styles/learning-system.css';
import './styles/student-portal.css';
import './styles/practice-studio.css';
import App from './App';
import { AuthProvider } from './auth/AuthProvider';
import { StudentProgressProvider } from './state/StudentProgressProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <StudentProgressProvider>
        <App />
      </StudentProgressProvider>
    </AuthProvider>
  </React.StrictMode>,
);
