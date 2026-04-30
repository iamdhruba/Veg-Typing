import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { useAchievements } from '../hooks/useAchievements';
import HeatmapKeyboard from '../components/practice/HeatmapKeyboard';
import SEO from '../components/SEO';

const Stats = () => {
  const user = useAuthStore(s => s.user);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heatmapMode, setHeatmapMode] = useState('english');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async (pageNum = 1, reset = false) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/results/me?page=${pageNum}&limit=100`);
      const newResults = data.results || data;
      
      if (reset) {
        setResults(newResults);
      } else {
        setResults(prev => [...prev, ...newResults]);
      }
      
      setHasMore(data.pagination?.hasMore || false);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setError('Failed to load statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(1, true);
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchStats(page + 1, false);
    }
  };

  // Memoize charData at the top level
  const globalCharData = useMemo(() => {
    const data = {};
    results.forEach(r => {
      if (r.charData) {
        Object.entries(r.charData).forEach(([char, charInfo]) => {
          if (!data[char]) data[char] = { correct: 0, incorrect: 0 };
          data[char].correct += charInfo.correct;
          data[char].incorrect += charInfo.incorrect;
        });
      }
    });
    return data;
  }, [results]);

  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const { achievements, unlockedCount } = useAchievements(results);

  if (loading && page === 1) return (
    <div className="flex flex-col items-center justify-center py-32 gap-6">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full"
      />
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-on-background/40 animate-pulse">Accessing Telemetry...</p>
    </div>
  );

  const bestWpm = results.length > 0 ? Math.max(...results.map(r => r.wpm)) : 0;
  const avgWpm = results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.wpm, 0) / results.length) : 0;
  const avgAcc = results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.accuracy, 0) / results.length) : 0;

  // Check if user is logged in (after all hooks)
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <p className="text-2xl font-black text-on-background/60">Please log in to view your stats</p>
        <a 
          href="/login" 
          className="px-8 py-4 bg-primary text-on-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-colors"
        >
          Go to Login
        </a>
      </div>
    );
  }

  const handleExportCSV = () => {
    if (results.length === 0) return;
    const headers = ['Date', 'Language', 'Mode', 'Duration (s)', 'WPM', 'Accuracy (%)'];
    const rows = results.map(r => [
      new Date(r.timestamp).toLocaleString(),
      r.language,
      r.mode,
      r.duration,
      r.wpm,
      r.accuracy
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `veg_typing_telemetry_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      variants={containerVars}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto w-full px-6 py-20"
    >
      <SEO
        title="My Typing Stats — Performance & Heatmaps | VEG"
        description="View your Nepali typing history, WPM progress, and character accuracy heatmaps for Preeti and Unicode layouts."
        path="/stats"
        keywords="typing stats, Nepali typing heatmap, WPM history"
      />
      <header className="mb-16 flex justify-between items-end">
        <div>
          <h1 className="text-6xl font-black mb-4 tracking-tighter uppercase text-on-background">Personal Matrix</h1>
          <p className="text-[10px] font-black text-on-background/40 uppercase tracking-[0.4em]">Performance Intelligence Report</p>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-outline/20 bg-surface-container-low hover:bg-surface-container transition-colors group"
          >
            <span className="material-symbols-outlined text-sm text-on-background/60 group-hover:text-primary transition-colors">download</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-on-background/60 group-hover:text-primary transition-colors">Export CSV</span>
          </button>
          <div className="w-px h-8 bg-outline/10"></div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-black text-primary">{unlockedCount}/{achievements.length}</p>
              <p className="text-[9px] font-bold text-on-background/30 uppercase tracking-widest">Badges Earned</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl">🏆</div>
          </div>
        </div>
      </header>

      {/* Achievements Section */}
      <motion.div variants={itemVars} className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
          {achievements.map((a) => (
            <div 
              key={a.id}
              className={`p-6 border border-outline/5 flex flex-col items-center text-center group relative overflow-hidden transition-all ${a.isUnlocked ? 'bg-surface-container-high/40' : 'bg-surface-container-low grayscale opacity-40'}`}
            >
              <span className="text-3xl mb-3 block group-hover:scale-125 transition-transform">{a.icon}</span>
              <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${a.isUnlocked ? 'text-on-background' : 'text-on-background/40'}`}>{a.name}</p>
              <p className="text-[8px] font-medium text-on-background/30 uppercase tracking-tighter leading-tight">{a.desc}</p>
              {a.isUnlocked && <div className="absolute top-0 right-0 w-8 h-8 bg-primary/20 flex items-center justify-center text-[10px] rotate-45 translate-x-4 -translate-y-4">✓</div>}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-1">
        {[
          { label: 'Highest Velocity', value: bestWpm, unit: 'WPM', accent: 'text-primary' },
          { label: 'Mean Velocity', value: avgWpm, unit: 'WPM', accent: 'text-on-background/80' },
          { label: 'Precision Index', value: avgAcc, unit: '%', accent: 'text-on-background/60' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            variants={itemVars}
            className="bg-surface-container-low border border-outline/10 p-10 flex flex-col justify-between h-48 group overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <p className="text-[10px] font-black text-on-background/40 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-baseline gap-4">
              <span className={`text-6xl font-black tracking-tighter ${stat.accent}`}>{stat.value}</span>
              <span className="text-[10px] font-black text-on-background/30 uppercase">{stat.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="py-12">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-outline/20 to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 mb-1">
        {/* Main Chart Card */}
        <motion.div variants={itemVars} className="lg:col-span-2 bg-surface-container-low border border-outline/10 p-12 relative overflow-hidden">
          <div className="flex justify-between items-center mb-16 relative z-10">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-1 text-on-background/40">Velocity Progression</h3>
              <p className="text-[9px] font-bold text-on-background/20 uppercase tracking-wider">Last 100 sessions mapped</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-on-background/80">{results.length}</p>
              <p className="text-[9px] font-bold text-on-background/20 uppercase tracking-widest">Total Logs</p>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[...results].reverse()}>
                <defs>
                  <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis dataKey="timestamp" hide />
                <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip 
                  cursor={{ stroke: 'var(--primary)', strokeWidth: 1 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-surface-container-high p-4 shadow-2xl backdrop-blur-xl border-l-2 border-primary">
                          <p className="text-[10px] font-bold text-on-background/40 uppercase mb-2">Telemetry Point</p>
                          <p className="text-2xl font-black text-primary">{payload[0].value} WPM</p>
                          {payload[1] && <p className="text-[10px] font-bold text-on-background/50">{payload[1].value}% ACCURACY</p>}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="wpm" 
                  stroke="var(--primary)" 
                  strokeWidth={4}
                  fill="url(#glow)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Identity Details */}
        <motion.div variants={itemVars} className="bg-surface-container-low border border-outline/10 p-12 flex flex-col justify-center items-center text-center">
          <div className="w-36 h-36 bg-surface-container-high rounded-full flex items-center justify-center mb-10 relative">
            <div className="absolute inset-0 border border-primary/20 rounded-full animate-ping opacity-5" />
            <span className="text-5xl font-black text-primary/60">{user?.username?.[0]?.toUpperCase() || 'U'}</span>
          </div>
          <p className="text-2xl font-black text-on-background uppercase tracking-tighter mb-2">{user?.username || 'User'}</p>
          <p className="text-[10px] text-on-background/40 uppercase tracking-[0.2em] mb-12">{user?.email || ''}</p>
          <div className="w-full space-y-2">
            <div className="bg-surface-container-high/40 p-4 flex justify-between items-center border border-outline/5">
              <span className="text-[9px] font-black text-on-background/30 uppercase tracking-widest">Joined</span>
              <span className="text-xs font-black text-on-background/60 uppercase tracking-tighter">{user?.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : 'N/A'}</span>
            </div>
            <div className="bg-surface-container-high/40 p-4 flex justify-between items-center border border-outline/5">
              <span className="text-[9px] font-black text-on-background/30 uppercase tracking-widest">Status</span>
              <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest">Active Matrix</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="py-12">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-outline/20 to-transparent" />
      </div>

      {/* Heatmap Section */}
      <motion.div variants={itemVars} className="bg-surface-container/5 backdrop-blur-md p-12 mb-1">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-background/40">Character Accuracy Matrix</h3>
            <p className="text-[9px] font-bold text-on-background/20 uppercase tracking-widest mt-1">Layout Performance Mapping</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex bg-surface-container p-1 gap-1">
              {['english', 'preeti', 'unicode'].map(l => (
                <button
                  key={l}
                  onClick={() => setHeatmapMode(l)}
                  className={`px-4 py-2 text-[8px] font-black uppercase tracking-widest transition-all ${heatmapMode === l ? 'bg-primary text-white' : 'text-on-background/40 hover:text-on-background/60'}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary/40 border border-primary/60" />
                <span className="text-[8px] font-bold text-on-background/30 uppercase">Excellent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500/20 border border-yellow-500/40" />
                <span className="text-[8px] font-bold text-on-background/30 uppercase">Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-error/20 border border-error/40" />
                <span className="text-[8px] font-bold text-on-background/30 uppercase">Critical</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto pb-6">
          <div className="min-w-[800px]">
            <HeatmapKeyboard 
              mode={heatmapMode} 
              charData={globalCharData} 
            />
          </div>
        </div>
      </motion.div>

      <div className="py-12">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-outline/20 to-transparent" />
      </div>

      {/* Operational Log */}
      <motion.div variants={itemVars} className="bg-surface-container-low border border-outline/10 mt-1">
        <div className="p-10 flex justify-between items-center bg-surface-container-high/50">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-background/40">Operational Log</h3>
          <span className="text-[9px] font-black text-on-background/20 uppercase tracking-widest">Session History</span>
        </div>
        <div className="">
          {results.map((r, i) => (
            <motion.div 
              key={r._id} 
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
              className="flex flex-col md:flex-row items-center justify-between p-8 gap-8 transition-colors"
            >
              <div className="flex items-center gap-12 w-full md:w-auto">
                <div className="text-on-background/10 font-mono text-[10px]">0{i+1}</div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-on-background/60">{r.language}</p>
                  <p className="text-[9px] font-bold text-on-background/20 uppercase tracking-widest mt-1">{format(new Date(r.timestamp), 'MMM dd | HH:mm')}</p>
                </div>
              </div>
              <div className="flex gap-16 w-full md:w-auto justify-between md:justify-end items-center">
                <div className="text-right">
                  <p className="text-[9px] font-bold text-on-background/20 uppercase mb-1">Accuracy</p>
                  <p className="text-xl font-black text-on-background/50">{r.accuracy}%</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-on-background/20 uppercase mb-1">Velocity</p>
                  <div className="flex items-baseline justify-end gap-2">
                    <span className="text-3xl font-black text-primary/80">{r.wpm}</span>
                    <span className="text-[10px] font-black text-on-background/40">WPM</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {hasMore && !loading && results.length > 0 && (
          <div className="p-8 flex justify-center border-t border-outline/10">
            <button
              onClick={loadMore}
              className="px-8 py-4 bg-primary/10 hover:bg-primary/20 text-primary font-black text-[10px] uppercase tracking-widest transition-colors"
            >
              Load More Sessions
            </button>
          </div>
        )}
        
        {loading && page > 1 && (
          <div className="p-8 flex justify-center border-t border-outline/10">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full"
            />
          </div>
        )}
      </motion.div>
      
      {error && (
        <div className="mt-8 p-6 bg-error/10 border border-error/20 text-center">
          <p className="text-error font-bold text-sm">{error}</p>
          <button
            onClick={() => fetchStats(1, true)}
            className="mt-4 px-6 py-2 bg-error/20 hover:bg-error/30 text-error font-black text-[10px] uppercase tracking-widest transition-colors"
          >
            Retry
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Stats;
