import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ResultCard = ({ result, onRestart }) => {
  const chartData = result.wpmHistory.map((wpm, i) => ({ time: i + 1, wpm }));

  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-8 md:px-12 relative min-h-[calc(100vh-200px)] h-auto py-8 flex flex-col justify-center overflow-hidden">
      <div className="fixed inset-0 bg-noise pointer-events-none opacity-20"></div>
      
      {/* Hero Section - Optimized */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-primary"></span>
            <span className="uppercase tracking-[0.5em] text-[10px] font-black text-primary">PERFORMANCE DIAGNOSTIC</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-none text-on-background">Session Complete</h1>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col items-end">
          <div className="relative group">
            <div className="relative flex items-baseline gap-4">
              <span className="text-5xl md:text-7xl font-black text-on-background tracking-tighter leading-none">{result.wpm}</span>
              <span className="text-xl font-bold text-on-background/50 uppercase tracking-widest">WPM</span>
            </div>
          </div>
          <div className="w-32 h-[2px] bg-primary mt-2 origin-right"></div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 mb-4 relative z-10">
        <div className="col-span-12 lg:col-span-3 flex lg:flex-col justify-between lg:justify-start gap-6">
          {[
            { label: 'Accuracy', value: result.accuracy, unit: '%' },
            { label: 'Raw Velocity', value: result.rawWpm, unit: 'WPM' },
            { label: 'Consistency', value: result.consistency, unit: '%' }
          ].map((item) => (
            <div key={item.label} className="group cursor-default flex-1 lg:flex-none">
              <span className="uppercase tracking-[0.4em] text-[9px] font-black text-on-background/50 group-hover:text-primary transition-colors">{item.label}</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black text-on-background">{item.value}</span>
                <span className="text-sm font-bold text-on-background/50">{item.unit}</span>
              </div>
              <div className="w-full h-[1px] bg-outline/20 mt-2 group-hover:bg-primary/30 transition-colors"></div>
            </div>
          ))}
        </div>

        <div className="col-span-12 lg:col-span-6 bg-surface-container border border-outline/10 p-8 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-primary/20"></div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="uppercase tracking-[0.4em] text-[10px] font-black text-on-background/60">Velocity Flux Map</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary animate-pulse"></div>
              <span className="uppercase tracking-[0.3em] text-[8px] font-bold text-on-background/50">LIVE_STREAM</span>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ background: 'var(--surface-container)', border: '1px solid var(--primary)', borderRadius: '0px', fontSize: '10px', fontWeight: 'bold' }}
                  itemStyle={{ color: 'var(--primary)' }}
                  cursor={{ stroke: 'var(--primary)', strokeWidth: 1 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="wpm" 
                  stroke="var(--primary)" 
                  strokeWidth={3} 
                  fill="url(#colorWpm)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3">
          <div className="bg-surface-container border border-outline/10 p-6 h-full flex flex-col">
            <h3 className="uppercase tracking-[0.3em] text-[10px] font-black text-on-background/50 mb-6 border-b border-outline/10 pb-4">Diagnostics</h3>
            <div className="flex-grow space-y-4">
              {[
                { label: 'Correct', value: result.characters.correct, color: 'bg-correct', total: result.characters.correct + result.characters.incorrect },
                { label: 'Incorrect', value: result.characters.incorrect, color: 'bg-error', total: result.characters.correct + result.characters.incorrect },
                { label: 'Extra', value: result.characters.extra, color: 'bg-outline/50', total: 100 },
                { label: 'Missed', value: result.characters.missed, color: 'bg-outline/50', total: 100 },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center group">
                  <div className="space-y-1">
                    <span className="uppercase tracking-[0.1em] text-[9px] font-black text-on-background/50">{item.label}</span>
                    <div className="h-[1px] w-12 bg-outline/10 overflow-hidden">
                      <div 
                        className={`h-full ${item.color}`} 
                        style={{ width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className={`text-4xl font-light tracking-tighter ${item.value > 0 ? 'text-on-background' : 'text-on-background/20'}`}>
                    {String(item.value).padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="flex flex-col sm:flex-row gap-4 justify-center items-center py-8 border-t border-outline/10 relative z-10 w-full">
        <button 
          onClick={onRestart}
          className="relative group overflow-hidden bg-primary py-4 px-8 sm:px-12 active:scale-[0.95] transition-all duration-300 shadow-xl shadow-primary/20 flex-1 w-full max-w-xs"
        >
          <span className="relative uppercase tracking-[0.3em] text-[10px] font-black text-white">Retest</span>
        </button>
        
        <button 
          onClick={() => {
            const text = `🚀 My Nepali Typing Results on VEG!
🔥 Speed: ${result.wpm} WPM
🎯 Accuracy: ${result.accuracy}%
📉 Consistency: ${result.consistency}%
🌐 Language: ${result.language === 'unicode' ? 'ROMANIZED UNICODE' : result.language.toUpperCase()}
⌨️ Master your Nepali typing at: ${window.location.origin}`;
            navigator.clipboard.writeText(text);
            alert('Results copied to clipboard! Ready to share.');
          }}
          className="relative group overflow-hidden border border-outline/20 py-4 px-8 sm:px-12 hover:bg-on-background/5 active:scale-[0.95] transition-all duration-300 flex-1 w-full max-w-xs"
        >
          <span className="relative uppercase tracking-[0.3em] text-[10px] font-black text-on-background/50 group-hover:text-primary transition-colors">Share Report</span>
        </button>
      </section>

    </div>
  );
};

export default ResultCard;
