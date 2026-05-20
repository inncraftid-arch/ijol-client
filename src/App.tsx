import { BrowserRouter, Routes, Route } from 'react-router';
import { LandingPage } from './pages/LandingPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ScrollToTop } from './components/routing/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        {/* Future routes: <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
