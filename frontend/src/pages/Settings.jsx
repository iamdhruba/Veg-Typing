import React from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { useTypingStore } from '../store/useTypingStore';
import api from '../services/api';
import SEO from '../components/SEO';

const THEME_META = [
  {
    id: 'obsidian',
    name: 'Obsidian',
    description: 'Deep black & crimson red.',
    bg: '#121414',
    accent: '#D30026',
  },
  {
    id: 'midas',
    name: 'Midas',
    description: 'Golden amber & deep obsidian.',
    bg: '#0a0a0a',
    accent: '#f59e0b',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    description: 'Matrix inspired digital green.',
    bg: '#060d0b',
    accent: '#00d68a',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep oceanic blue & cobalt.',
    bg: '#0a0b10',
    accent: '#4e9af1',
  },
  {
    id: 'light',
    name: 'Paper',
    description: 'Crisp white & monolith red.',
    bg: '#ffffff',
    accent: '#d30026',
  },
];

const Settings = () => {
  const theme = useThemeStore(s => s.theme);
  const setTheme = useThemeStore(s => s.setTheme);
  const language = useTypingStore(s => s.language);
  const setLanguage = useTypingStore(s => s.setLanguage);
  const soundEnabled = useTypingStore(s => s.soundEnabled);
  const setSoundEnabled = useTypingStore(s => s.setSoundEnabled);
  const caretStyle = useTypingStore(s => s.caretStyle);
  const setCaretStyle = useTypingStore(s => s.setCaretStyle);
  const fontSize = useTypingStore(s => s.fontSize);
  const setFontSize = useTypingStore(s => s.setFontSize);
  const showKeyboard = useTypingStore(s => s.showKeyboard);
  const setShowKeyboard = useTypingStore(s => s.setShowKeyboard);

  const handleWipeData = async () => {
    if (window.confirm('CRITICAL ACTION: This will permanently erase your entire typing history and personal bests. Are you sure you want to proceed?')) {
      try {
        await api.delete('/results/me');
        alert('Telemetry data purged successfully.');
      } catch (error) {
        console.error('Purge failed:', error);
        alert('System failure: Could not purge data.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-8 md:px-12 py-8 sm:py-16">
      <SEO
        title="Settings — VEG Typewriter"
        description="Configure your VEG typewriter settings, choose themes, and manage your data."
        path="/settings"
        keywords="typewriter settings, VEG config"
      />
      <h1 className="text-3xl sm:text-5xl font-black mb-10 sm:mb-20 tracking-tighter uppercase text-on-background">System Configuration</h1>

      <div className="space-y-4">
        {/* Visual Environment */}
        <section className="bg-surface-container/5 p-4 sm:p-10 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px w-4 bg-primary/40" />
            <h3 className="text-[10px] font-black text-on-background/40 uppercase tracking-[0.3em]">Visual Environment</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {THEME_META.map((t) => {
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-6 p-6 text-left transition-all relative group ${
                    isActive
                      ? 'bg-primary/5'
                      : 'bg-surface-container hover:bg-surface-container-high'
                  }`}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                  <div className="flex flex-shrink-0 gap-1">
                    <div style={{ backgroundColor: t.bg }} className="w-9 h-9" />
                    <div style={{ backgroundColor: t.accent }} className="w-9 h-9" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`font-black text-xs uppercase tracking-wider ${isActive ? 'text-primary' : 'text-on-background/70'}`}>{t.name}</p>
                    <p className="text-[10px] text-on-background/50 uppercase mt-0.5">{t.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <div className="py-8">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-outline/20 to-transparent" />
        </div>

        {/* Experience */}
        <section className="bg-surface-container/5 p-4 sm:p-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px w-4 bg-primary/40" />
            <h3 className="text-[10px] font-black text-on-background/50 uppercase tracking-[0.3em]">Experience</h3>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 bg-surface-container p-4 sm:p-8">
            <div>
              <p className="font-black text-xs uppercase tracking-widest text-on-surface">Typing Sound</p>
              <p className="text-[10px] text-on-surface/60 uppercase mt-1 tracking-wider">Mechanical feedback on every stroke.</p>
            </div>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-14 h-7 relative transition-colors ${soundEnabled ? 'bg-primary/20' : 'bg-surface-container-high'}`}
            >
              <div className={`absolute top-1.5 w-4 h-4 transition-all ${soundEnabled ? 'right-1.5 bg-primary' : 'left-1.5 bg-on-surface/40'}`}></div>
            </button>
          </div>
        </section>

        <div className="py-8">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-outline/20 to-transparent" />
        </div>

        {/* Language & Script */}
        <section className="bg-surface-container/5 p-4 sm:p-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px w-4 bg-primary/40" />
            <h3 className="text-[10px] font-black text-on-background/50 uppercase tracking-[0.3em]">Language & Script</h3>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 bg-surface-container p-4 sm:p-8">
            <div>
              <p className="font-black text-xs uppercase tracking-widest text-on-surface">Primary Language</p>
              <p className="text-[10px] text-on-surface/60 uppercase mt-1 tracking-wider">Used for the interface and default tests.</p>
            </div>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-surface-container-high text-on-surface text-[10px] font-black uppercase tracking-widest px-6 py-3 outline-none cursor-pointer hover:bg-surface-container-low transition-colors"
            >
              <option value="english">English</option>
              <option value="preeti">Preeti (Nepali)</option>
              <option value="unicode">Unicode (Nepali)</option>
            </select>
          </div>
        </section>

        {/* UI Customization */}
        <section className="bg-surface-container/5 p-4 sm:p-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px w-4 bg-primary/40" />
            <h3 className="text-[10px] font-black text-on-background/50 uppercase tracking-[0.3em]">Typing Interface</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 bg-surface-container p-4 sm:p-8 mb-2">
            <div>
              <p className="font-black text-xs uppercase tracking-widest text-on-surface">Caret Style</p>
              <p className="text-[10px] text-on-surface/60 uppercase mt-1 tracking-wider">Cursor appearance during tests.</p>
            </div>
            <select 
              value={caretStyle}
              onChange={(e) => setCaretStyle(e.target.value)}
              className="bg-surface-container-high text-on-surface text-[10px] font-black uppercase tracking-widest px-6 py-3 outline-none cursor-pointer hover:bg-surface-container-low transition-colors"
            >
              <option value="line">Line ( | )</option>
              <option value="block">Block ( █ )</option>
              <option value="underline">Underline ( _ )</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 bg-surface-container p-4 sm:p-8 mb-2">
            <div>
              <p className="font-black text-xs uppercase tracking-widest text-on-surface">Font Size</p>
              <p className="text-[10px] text-on-surface/60 uppercase mt-1 tracking-wider">Adjust text size in the typing arena.</p>
            </div>
            <select 
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="bg-surface-container-high text-on-surface text-[10px] font-black uppercase tracking-widest px-6 py-3 outline-none cursor-pointer hover:bg-surface-container-low transition-colors"
            >
              <option value="text-2xl">Standard</option>
              <option value="text-3xl">Large</option>
              <option value="text-4xl">Massive</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 bg-surface-container p-4 sm:p-8">
            <div>
              <p className="font-black text-xs uppercase tracking-widest text-on-surface">Virtual Guide Keyboard</p>
              <p className="text-[10px] text-on-surface/60 uppercase mt-1 tracking-wider">Show a live keyboard on the test screen highlighting the next key.</p>
            </div>
            <button 
              onClick={() => setShowKeyboard(!showKeyboard)}
              className={`w-14 h-6 rounded-full transition-colors relative ${showKeyboard ? 'bg-primary' : 'bg-surface-container-high'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${showKeyboard ? 'left-9' : 'left-1'}`} />
            </button>
          </div>
        </section>

        {/* Data Management */}
        <section className="bg-surface-container/5 p-4 sm:p-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px w-4 bg-primary/40" />
            <h3 className="text-[10px] font-black text-on-background/50 uppercase tracking-[0.3em]">Data Management</h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 bg-surface-container p-4 sm:p-8">
              <div>
                <p className="font-black text-xs uppercase tracking-widest text-on-surface">Export Telemetry</p>
                <p className="text-[10px] text-on-surface/60 uppercase mt-1 tracking-wider">Download your typing history as JSON.</p>
              </div>
              <button 
                onClick={async () => {
                  try {
                    const response = await api.get('/results/me');
                    const data = JSON.stringify(response.data, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `veg-stats-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                  } catch (e) { alert('Export failed'); }
                }}
                className="px-8 py-3 bg-surface-container-high text-on-background/80 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary/10 hover:text-primary transition-all"
              >
                Download JSON
              </button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 bg-surface-container p-4 sm:p-8 border-t border-outline/5">
              <div>
                <p className="font-black text-xs uppercase tracking-widest text-on-surface">Import Telemetry</p>
                <p className="text-[10px] text-on-surface/60 uppercase mt-1 tracking-wider">Restore history from a JSON backup.</p>
              </div>
              <label className="px-8 py-3 bg-surface-container-high text-on-background/80 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
                Upload JSON
                <input 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = async (event) => {
                      try {
                        const data = JSON.parse(event.target.result);
                        alert('Importing data... please wait.');
                        for (const result of data) {
                          await api.post('/results', result);
                        }
                        alert('Telemetry restored successfully.');
                        window.location.reload();
                      } catch (err) { alert('Import failed: Invalid format'); }
                    };
                    reader.readAsText(file);
                  }}
                />
              </label>
            </div>
          </div>
        </section>

        <div className="py-8">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-outline/20 to-transparent" />
        </div>

        {/* Destructive Actions */}
        <section className="bg-primary/5 p-4 sm:p-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px w-4 bg-primary/40" />
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Destructive Actions</h3>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 bg-surface-container p-4 sm:p-8">
            <div>
              <p className="font-black text-xs uppercase tracking-widest text-primary">Clear Statistics</p>
              <p className="text-[10px] text-on-surface/60 uppercase mt-1 tracking-wider">This action cannot be undone.</p>
            </div>
            <button 
              onClick={handleWipeData}
              className="px-8 py-3 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary/20 transition-colors"
            >
              Wipe Data
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
