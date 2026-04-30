import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';
import Home from './pages/Home';

// Lazy load pages for better performance
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Stats = lazy(() => import('./pages/Stats'));
const About = lazy(() => import('./pages/About'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const Practice = lazy(() => import('./pages/Practice'));
const Race = lazy(() => import('./pages/Race'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const NotFound = lazy(() => import('./pages/NotFound'));

import { useThemeStore, applyTheme } from './store/useThemeStore';

// Apply persisted theme immediately before first render (avoids flash)
const persistedRaw = localStorage.getItem('theme-storage');
if (persistedRaw) {
  try {
    const { state } = JSON.parse(persistedRaw);
    if (state?.theme) applyTheme(state.theme);
  } catch (_) { /* ignore */ }
}

function App() {
  const theme = useThemeStore((s) => s.theme);

  // Keep in sync if theme changes in another tab
  React.useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<Loading fullScreen />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/about" element={<About />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/login" element={<Login />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/race" element={<Race />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
