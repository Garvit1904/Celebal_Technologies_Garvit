
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import TablePage from './pages/TablePage';
import CalendarPage from './pages/CalendarPage';
import KanbanPage from './pages/KanbanPage';
import { useTheme } from './hooks/useTheme';

const App: React.FC = () => {
  const { theme } = useTheme(); // Initialize theme

  return (
    <HashRouter>
      <div className={`flex h-screen overflow-hidden ${theme}`}>
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-secondary-100 dark:bg-secondary-900 p-6 transition-colors duration-300">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tables" element={<TablePage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/kanban" element={<KanbanPage />} />
              {/* Add more routes as needed */}
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
