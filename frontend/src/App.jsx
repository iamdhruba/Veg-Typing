import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
              <AnimatedRoutes />
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/leaderboard" element={<PageTransition><Leaderboard /></PageTransition>} />
        <Route path="/stats" element={<PageTransition><Stats /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/practice" element={<PageTransition><Practice /></PageTransition>} />
        <Route path="/race" element={<PageTransition><Race /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
