import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTypingStore } from '../store/useTypingStore';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';
import { getRandomWords } from '../utils/wordLists';
import { getPersonalizedWords } from '../utils/weakKeys';
import ModeSelector from '../components/ModeSelector';
import TypingBox from '../components/TypingBox';
import ResultCard from '../components/ResultCard';
import SEO from '../components/SEO';
import { Toaster, toast } from 'react-hot-toast';

const Home = () => {
  const language = useTypingStore(s => s.language);
  const mode = useTypingStore(s => s.mode);
  const duration = useTypingStore(s => s.duration);
  const customText = useTypingStore(s => s.customText);
  const setMode = useTypingStore(s => s.setMode);
  const [words, setWords] = useState([]);
  const result = useTypingStore(s => s.result);
  const setResult = useTypingStore(s => s.setResult);
  const [testId, setTestId] = useState(0); 
  const user = useAuthStore(s => s.user);

  const navigate = useNavigate();
  const location = useLocation();

  const handleRestart = () => {
    setResult(null);
    setTestId(prev => prev + 1);
  };

  useEffect(() => {
    const loadWords = async () => {
      try {
        if (mode === 'custom' && customText) {
          setWords(customText.trim().split(/\s+/));
        } else if (mode === 'ai') {
          try {
            const { data } = await api.get('/results/me?page=1&limit=20');
            const resultsData = data.results || data;
            setWords(getPersonalizedWords(language, resultsData, 100));
          } catch (e) {
            setWords(getRandomWords(language, 100));
          }
        } else {
          setWords(getRandomWords(language, 500));
        }
      } catch (error) {
        console.error('Error loading words:', error);
        toast.error('Failed to load words. Using default set.');
        setWords(getRandomWords(language, 500));
      }
    };
    loadWords();
    // We don't necessarily want to clear result here if it's coming from the store and we just mounted
    // But for a new test (id change), we might.
    // However, the location.key logic will handle resetting when navigating.
  }, [language, mode, duration, testId, customText, location.key]);

  useEffect(() => {
    if (location.pathname === '/') {
      setResult(null);
    }
  }, [location.key]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        // Prevent accidental restarts unless test is finished or result is shown
        if (result || document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault();
          handleRestart();
        }
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate('/settings');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, result]);

  const handleFinish = async (finalResult) => {
    console.log('Test finished, result:', finalResult);
    setResult(finalResult);
    toast.success('Test Completed!', {
      style: {
        background: 'var(--surface)',
        color: 'var(--primary)',
        border: '1px solid var(--primary)',
        borderRadius: '0px'
      }
    });

    // Save to backend if logged in
    if (user) {
      console.log('User logged in, attempting to save...');
      console.log('Payload:', {
        language: finalResult.language,
        mode: finalResult.mode || 'time',
        duration: finalResult.duration,
        wpm: finalResult.wpm,
        accuracy: finalResult.accuracy,
        wpmHistory: finalResult.wpmHistory,
        charData: finalResult.charData
      });
      try {
        await api.post('/results', {
          language: finalResult.language,
          mode: finalResult.mode || 'time',
          duration: finalResult.duration,
          wpm: finalResult.wpm,
          accuracy: finalResult.accuracy,
          wpmHistory: finalResult.wpmHistory,
          charData: finalResult.charData
        });

        console.log('Result saved successfully!');

        // Fetch updated user to reflect new personal bests and stats locally
        const userRes = await api.get('/auth/me');
        useAuthStore.getState().setUser(userRes.data);

        useAuthStore.getState().checkAchievements({
          wpm: finalResult.wpm,
          accuracy: finalResult.accuracy,
          duration: finalResult.duration,
          language: finalResult.language
        });
      } catch (error) {
        console.error('Failed to save result:', error);
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        const msg = error.code === 'ECONNABORTED' || !error.response
          ? 'Server is waking up, result not saved. Try again shortly.'
          : 'Failed to save result.';
        toast.error(msg, {
          style: {
            background: 'var(--surface)',
            color: 'var(--error)',
            border: '1px solid var(--error)',
            borderRadius: '0px'
          }
        });
      }
    }
  };



  return (
    <div className={`max-w-7xl mx-auto w-full px-4 sm:px-8 md:px-12 py-8 md:py-16 flex flex-col items-center justify-center min-h-[80vh] ${result ? 'py-4' : ''}`}>
      <SEO
        title="VEG — #1 Nepali Typing Online | Preeti & Unicode Speed Test"
        description="Master Nepali typing online for free. Practice Preeti, Unicode, and English layouts with real-time WPM tracking, accuracy analytics, and AI drills."
        path="/"
        keywords="nepali typing online, online nepali typing, typing test, WPM test, Nepali speed test, Preeti keyboard online, नेपाली टाइपिङ अनलाइन"
      />
      <Toaster position="bottom-center" />
      
      {!result ? (
        <>
          <ModeSelector />
          <TypingBox 
            key={`${language}-${mode}-${duration}-${testId}`}
            words={words} 
            mode={mode} 
            duration={duration} 
            language={language}
            onFinish={handleFinish}
            pbWpm={user?.personalBests?.[language]?.wpm || 0}
          />
          <div className="mt-16 md:mt-24 text-on-background/50 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] flex flex-col sm:flex-row gap-4 sm:gap-8 items-center">
            <button 
              onClick={(e) => { e.preventDefault(); handleRestart(); document.querySelector('input')?.focus(); }} 
              className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer group outline-none"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              <kbd className="bg-surface-container-high px-2 py-1 text-on-background/70 group-hover:text-primary group-hover:bg-primary/10 transition-colors">tab</kbd> 
              restart
            </button>
            <button 
              onClick={() => navigate('/settings')} 
              className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer group outline-none"
            >
              <span className="material-symbols-outlined text-[14px]">settings</span>
              <kbd className="bg-surface-container-high px-2 py-1 text-on-background/70 group-hover:text-primary group-hover:bg-primary/10 transition-colors">esc</kbd> 
              settings
            </button>
          </div>
        </>
      ) : (
        <ResultCard result={result} onRestart={handleRestart} />
      )}
    </div>
  );
};

export default Home;
