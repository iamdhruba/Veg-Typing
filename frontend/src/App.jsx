import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import Stats from './pages/Stats';
import About from './pages/About';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Practice from './pages/Practice';
import Race from './pages/Race';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

import { useThemeStore, applyTheme } from './store/useThemeStore';

// Apply persisted theme immediately before first render (avoids flash)
const persistedRaw = localStorage.getItem('theme-storage');
if (persistedRaw) {
  try {
    const { state } = JSON.parse(persistedRaw);
    if (state?.theme) applyTheme(state.theme);
  } catch (_) {}
}

function App() {
  const theme = useThemeStore((s) => s.theme);

  // Keep in sync if theme changes in another tab
  React.useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
        <Navbar />
        <main className="flex-grow">
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
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
