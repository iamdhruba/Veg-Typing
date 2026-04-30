import React from 'react';
import { Link } from 'react-router-dom';

const Footer = React.memo(() => {
  return (
    <footer className="bg-transparent mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 sm:px-8 md:px-12 py-6 md:py-8 max-w-7xl mx-auto gap-6 md:gap-0 text-center md:text-left">
        <div className="font-manrope text-[10px] tracking-widest uppercase text-on-background/40">
          © 2026 VEG. PRECISION
        </div>
        <div className="flex items-center gap-4 md:gap-8 flex-wrap justify-center">
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
