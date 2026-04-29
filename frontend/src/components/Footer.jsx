import React from 'react';
import { Link } from 'react-router-dom';

const Footer = React.memo(() => {
  return (
    <footer className="bg-transparent mt-auto">
      <div className="flex justify-between items-center w-full px-12 py-8 max-w-7xl mx-auto">
        <div className="font-manrope text-[10px] tracking-widest uppercase text-on-background/40">
          © 2026 VEG. PRECISION
        </div>
        <div className="flex items-center gap-8">
          <Link className="font-manrope text-[10px] tracking-widest uppercase text-on-background/40 hover:text-on-background/70 dark:hover:text-zinc-100 transition-all active:scale-95" to="/about">ABOUT</Link>
          <a className="font-manrope text-[10px] tracking-widest uppercase text-on-background/40 hover:text-on-background/70 dark:hover:text-zinc-100 transition-all active:scale-95" href="https://github.com/iamdhruba" target="_blank" rel="noopener noreferrer">GITHUB</a>
          <a className="font-manrope text-[10px] tracking-widest uppercase text-on-background/40 hover:text-on-background/70 dark:hover:text-zinc-100 transition-all active:scale-95" href="https://instagram.com/saydhruba" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
          <a className="font-manrope text-[10px] tracking-widest uppercase text-on-background/40 hover:text-on-background/70 dark:hover:text-zinc-100 transition-all active:scale-95" href="https://www.facebook.com/dhruba.chy.9" target="_blank" rel="noopener noreferrer">FACEBOOK</a>
          <Link className="font-manrope text-[10px] tracking-widest uppercase text-on-background/40 hover:text-on-background/70 dark:hover:text-zinc-100 transition-all active:scale-95" to="/terms">TERMS</Link>
          <Link className="font-manrope text-[10px] tracking-widest uppercase text-on-background/40 hover:text-on-background/70 dark:hover:text-zinc-100 transition-all active:scale-95" to="/privacy">PRIVACY</Link>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
