import { BrowserRouter, Routes, Route } from 'react-router';
import { LandingPage } from './pages/LandingPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminItemsPage } from './pages/AdminItemsPage';
import { AdminSwapsPage } from './pages/AdminSwapsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SwapReviewPage } from './pages/SwapReviewPage';
import { ScrollToTop } from './components/routing/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/swap-review/:token" element={<SwapReviewPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/items" element={<AdminItemsPage />} />
        <Route path="/admin/swaps" element={<AdminSwapsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
