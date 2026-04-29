import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import SEO from '../components/SEO';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const setUser = useAuthStore(s => s.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = isLogin 
        ? await authService.login({ email: formData.email, password: formData.password })
        : await authService.register(formData);
      setUser(user);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      setError(data?.errors?.[0]?.msg || data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="max-w-md mx-auto w-full px-8 py-24">
      <SEO
        title="Login — VEG Typewriter"
        description="Login to VEG typewriter to save your typing stats, progress, and compete in multiplayer races."
        path="/login"
        keywords="login VEG, typewriter login"
      />
      <h1 className="text-4xl font-black mb-12 tracking-tighter uppercase text-center">
        {isLogin ? 'Initialize Session' : 'Create Identity'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div>
            <label className="text-[10px] font-bold text-on-background/50 uppercase tracking-widest mb-2 block">Username</label>
            <input 
              type="text" 
              className="w-full bg-surface-container border border-outline/20 px-4 py-3 outline-none focus:border-primary transition-colors"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
        )}
        <div>
          <label className="text-[10px] font-bold text-on-background/50 uppercase tracking-widest mb-2 block">Email</label>
          <input 
            type="email" 
            className="w-full bg-surface-container border border-outline/20 px-4 py-3 outline-none focus:border-primary transition-colors"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-on-background/50 uppercase tracking-widest mb-2 block">Password</label>
          <input 
            type="password" 
            className="w-full bg-surface-container border border-outline/20 px-4 py-3 outline-none focus:border-primary transition-colors"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          {!isLogin && <p className="text-[10px] text-on-background/40 mt-1">Min 6 characters</p>}
        </div>

        {error && <p className="text-primary text-xs font-bold uppercase">{error}</p>}

        <button 
          type="submit"
          className="w-full bg-primary-container text-white py-4 font-bold hover:opacity-90 transition-all uppercase tracking-widest"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-xs font-bold text-on-background/50 hover:text-primary uppercase tracking-widest"
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;
