import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useTypingStore } from '../store/useTypingStore';

const Navbar = () => {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const setResult = useTypingStore(s => s.setResult);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-surface/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-12 py-6 max-w-7xl mx-auto">
        <Link 
          to="/" 
          onClick={() => setResult(null)}
          className="text-3xl font-black tracking-tighter text-primary flex items-center gap-2"
        >
          VEG.
        </Link>
        <nav className="flex items-center gap-8">
          <Link 
            to="/" 
            onClick={() => setResult(null)}
            className="font-manrope tracking-tighter uppercase font-bold text-xs text-on-background/60 hover:text-primary transition-colors duration-200"
          >
            TEST
          </Link>
          <Link to="/practice" className="font-manrope tracking-tighter uppercase font-bold text-xs text-on-background/60 hover:text-primary transition-colors duration-200">PRACTICE</Link>
          <Link to="/race" className="font-manrope tracking-tighter uppercase font-bold text-xs text-on-background/60 hover:text-primary transition-colors duration-200">ARENA</Link>
          <Link to="/leaderboard" className="font-manrope tracking-tighter uppercase font-bold text-xs text-on-background/60 hover:text-primary transition-colors duration-200">LEADERBOARD</Link>
          <Link to="/settings" className="font-manrope tracking-tighter uppercase font-bold text-xs text-on-background/60 hover:text-primary transition-colors duration-200">SETTINGS</Link>
        </nav>
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/stats" aria-label="View Stats" className="material-symbols-outlined text-on-background/60 hover:text-primary transition-colors">analytics</Link>
              <button onClick={handleLogout} aria-label="Logout" className="text-[10px] font-bold uppercase text-on-background/60 hover:text-primary">Logout</button>
            </>
          ) : (
            <Link to="/login" aria-label="Login" className="text-[10px] font-bold uppercase text-on-background/60 hover:text-primary px-4 py-2">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
