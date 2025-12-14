import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { Transactions } from './pages/Transactions';
import { Queue } from './pages/Queue';
import { Cards } from './pages/Cards';
import { Loans } from './pages/Loans';
import { Products } from './pages/Products';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import { LanguageProvider } from './contexts/LanguageContext';
import { seedDemoData } from './utils/dataSeed';

function App() {
  useEffect(() => {
    // Initialize demo data on app start
    seedDemoData().catch(console.error);
  }, []);

  return (
    <LanguageProvider>
      <Router>
        <Routes>
          {/* Protected routes with main layout */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="queue" element={<Queue />} />
            <Route path="cards" element={<Cards />} />
            <Route path="loans" element={<Loans />} />
            <Route path="products" element={<Products />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;