import { BrowserRouter, Routes, Route } from 'react-router';
import { LandingPage } from './pages/LandingPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminItemsPage } from './pages/AdminItemsPage';
import { ScrollToTop } from './components/routing/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/items" element={<AdminItemsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
