import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { format } from 'date-fns';
import SEO from '../components/SEO';
import { useAuthStore } from '../store/useAuthStore';

const Leaderboard = () => {
  const user = useAuthStore(s => s.user);
  const [leaderboard, setLeaderboard] = useState([]);
  const [language, setLanguage] = useState('english');
  const [duration, setDuration] = useState(30);
  const [timeframe, setTimeframe] = useState('alltime');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async (pageNum = page, reset = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/leaderboard?language=${language}&duration=${duration}&timeframe=${timeframe}&page=${pageNum}&limit=50`);
      const newData = response.data.results || response.data;
      
      if (reset) {
        setLeaderboard(newData);
      } else {
        setLeaderboard(prev => [...prev, ...newData]);
      }
      
      setHasMore(response.data.pagination?.hasMore || false);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setLeaderboard([]);
    fetchLeaderboard(1, true);
  }, [language, duration, timeframe]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchLeaderboard(page + 1, false);
    }
  };

  const top3 = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto w-full px-4 sm:px-8 md:px-12 py-8 sm:py-16"
    >
      <SEO
        title="Nepali Typing Leaderboard — Fastest Typists in Nepal | VEG"
        description="See who types the fastest in Nepal! Global leaderboard rankings for Preeti, Unicode, and English typing. Compare your WPM with the best typists."
        path="/leaderboard"
        keywords="typing leaderboard, fastest Nepali typist, WPM ranking, typing competition Nepal"
      />
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Global Dominance Matrix</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
            Hall of Fame
          </h1>
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-auto">
          {/* Timeframe Selector */}
          <div className="flex bg-surface-container/10 p-1 self-start lg:self-end">
            {[
              { id: 'alltime', label: 'All Time' },
              { id: 'weekly', label: 'Weekly' },
              { id: 'daily', label: 'Daily' }
            ].map((tf) => (
              <button 
                key={tf.id}
                onClick={() => setTimeframe(tf.id)}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === tf.id ? 'bg-primary text-white' : 'text-on-background/50 hover:text-on-background/80'}`}
              >
                {tf.label}
              </button>
            ))}
          </div>
          
          {/* Language Selector */}
          <div className="flex flex-wrap bg-surface-container/10 p-1">
            {['english', 'preeti', 'unicode'].map((lang) => (
              <button 
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${language === lang ? 'bg-primary text-white' : 'text-on-background/50 hover:text-on-background/80'}`}
              >
                {lang}
              </button>
            ))}
          </div>
          {/* Duration Selector */}
          <div className="flex bg-surface-container/10 p-1 self-start lg:self-end">
            {[15, 30, 60, 120].map((d) => (
              <button 
                key={d}
                onClick={() => setDuration(d)}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${duration === d ? 'bg-primary text-white' : 'text-on-background/50 hover:text-on-background/80'}`}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>
      </header>

      {loading && page === 1 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full"
          />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-on-background/40 animate-pulse">Calculating Ranks...</p>
        </div>
      ) : (
        <>
          {/* Podium Overhaul */}
          <div className="grid grid-cols-12 gap-1 px-1 mb-20 items-end">
            {/* Rank 2 */}
            <motion.div variants={itemVars} className="col-span-12 lg:col-span-3 order-2 lg:order-1">
              {top3[1] && (
                <div className="bg-surface-container p-10 h-52 flex flex-col justify-end relative group overflow-hidden border border-outline/10">
                  <div className="absolute top-8 right-8 flex flex-col items-end">
                    <span className="text-[9px] font-black text-on-background/30 uppercase tracking-widest mb-1">Position</span>
                    <span className="text-xl font-black text-on-background/50">02</span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-black uppercase tracking-tight truncate mb-4 text-on-background/80">{top3[1].userId?.username}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-primary/80">{top3[1].wpm}</span>
                      <span className="text-[10px] font-black text-on-background/40">WPM</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Rank 1 */}
            <motion.div variants={itemVars} className="col-span-12 lg:col-span-6 order-1 lg:order-2">
              {top3[0] && (
                <div className="bg-primary/5 backdrop-blur-xl p-14 h-[360px] flex flex-col justify-center relative overflow-hidden group shadow-2xl border border-primary/20">
                  <div className="absolute top-10 right-10 flex flex-col items-end">
                    <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest mb-1">Global Leader</span>
                    <span className="text-4xl font-black text-primary">01</span>
                  </div>
                  <div className="flex items-center gap-4 mb-8 relative z-10">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-xl font-black text-primary">👑</span>
                    </div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Current Champion</p>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black text-on-background uppercase tracking-tighter mb-6 truncate relative z-10 max-w-full">
                    {top3[0].userId?.username}
                  </h2>
                  <div className="flex items-baseline gap-4 relative z-10">
                    <span className="text-7xl font-black text-primary">{top3[0].wpm}</span>
                    <span className="text-[10px] font-black text-on-background/50 uppercase tracking-[0.2em]">Words Per Minute</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Rank 3 */}
            <motion.div variants={itemVars} className="col-span-12 lg:col-span-3 order-3 lg:order-3">
              {top3[2] && (
                <div className="bg-surface-container p-10 h-44 flex flex-col justify-end relative group overflow-hidden border border-outline/10">
                  <div className="absolute top-8 right-8 flex flex-col items-end">
                    <span className="text-[9px] font-black text-on-background/30 uppercase tracking-widest mb-1">Position</span>
                    <span className="text-xl font-black text-on-background/50">03</span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-black uppercase tracking-tight truncate mb-4 text-on-background/80">{top3[2].userId?.username}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-primary/80">{top3[2].wpm}</span>
                      <span className="text-[10px] font-black text-on-background/40">WPM</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          <div className="py-20">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-outline/20 to-transparent" />
          </div>

          {/* List Overhaul */}
          <motion.div variants={itemVars} className="bg-surface-container/30 border border-outline/10">
            <div className="grid grid-cols-12 gap-2 sm:gap-8 px-4 sm:px-10 py-6 bg-surface-container-high/50">
              <div className="col-span-2 sm:col-span-1 text-[8px] sm:text-[10px] font-black text-on-background/40 uppercase tracking-[0.1em] sm:tracking-[0.3em]">Rank</div>
              <div className="col-span-6 text-[8px] sm:text-[10px] font-black text-on-background/40 uppercase tracking-[0.1em] sm:tracking-[0.3em]">Competitor</div>
              <div className="col-span-4 sm:col-span-2 text-[8px] sm:text-[10px] font-black text-on-background/40 uppercase tracking-[0.1em] sm:tracking-[0.3em] text-right">Velocity</div>
              <div className="col-span-12 sm:col-span-3 text-[10px] font-black text-on-background/40 uppercase tracking-[0.3em] text-right hidden sm:block">Precision</div>
            </div>
            <div className="">
              {leaderboard.map((r, i) => {
                const isMe = user && r.userId?._id === user._id;
                return (
                  <motion.div 
                    key={r._id}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                    className={`grid grid-cols-12 gap-2 sm:gap-8 px-4 sm:px-10 py-4 sm:py-8 items-center transition-colors group ${isMe ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                  >
                  <div className="col-span-2 sm:col-span-1">
                    <span className={`text-lg sm:text-xl font-black ${i < 3 ? 'text-primary' : 'text-on-background/20'}`}>
                      {i + 1 < 10 ? `0${i + 1}` : i + 1}
                    </span>
                  </div>
                  <div className="col-span-6 flex items-center gap-2 sm:gap-6">
                    <div className="hidden sm:flex w-10 h-10 bg-surface-container-high items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                      <span className="text-xs font-black text-on-background/30 relative z-10">{r.userId?.username?.[0].toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-black uppercase tracking-tight text-on-background/80 group-hover:text-primary transition-colors truncate max-w-[100px] sm:max-w-[200px]">{r.userId?.username}</p>
                      <p className="text-[8px] sm:text-[10px] font-bold text-on-background/40 uppercase tracking-widest mt-1 hidden sm:block">{format(new Date(r.timestamp), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <div className="col-span-4 sm:col-span-2 text-right">
                    <div className="flex items-baseline justify-end gap-1 sm:gap-2">
                      <span className="text-xl sm:text-2xl font-black text-on-background/80">{r.wpm}</span>
                      <span className="text-[8px] sm:text-[10px] font-black text-on-background/40">WPM</span>
                    </div>
                  </div>
                  <div className="col-span-12 sm:col-span-3 text-right hidden sm:block">
                    <div className="flex flex-col items-end">
                      <p className="text-lg font-black text-on-background/60">{r.accuracy}%</p>
                      <div className="w-24 h-[2px] bg-outline/20 mt-2 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${r.accuracy}%` }}
                          className="h-full bg-primary/30"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
              {leaderboard.length === 0 && !loading && (
                <div className="p-32 text-center">
                  <p className="text-on-background/20 font-mono text-[10px] uppercase tracking-[0.4em]">No competitive data in current matrix</p>
                </div>
              )}
            </div>
            
            {/* Load More Button */}
            {hasMore && !loading && leaderboard.length > 0 && (
              <div className="p-8 flex justify-center border-t border-outline/10">
                <button
                  onClick={loadMore}
                  className="px-8 py-4 bg-primary/10 hover:bg-primary/20 text-primary font-black text-[10px] uppercase tracking-widest transition-colors"
                >
                  Load More Competitors
                </button>
              </div>
            )}
            
            {/* Loading More Indicator */}
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
          
          {/* Error Message */}
          {error && (
            <div className="mt-8 p-6 bg-error/10 border border-error/20 text-center">
              <p className="text-error font-bold text-sm">{error}</p>
              <button
                onClick={() => fetchLeaderboard(1, true)}
                className="mt-4 px-6 py-2 bg-error/20 hover:bg-error/30 text-error font-black text-[10px] uppercase tracking-widest transition-colors"
              >
                Retry
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Leaderboard;
