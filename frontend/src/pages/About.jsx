import React from 'react';
import SEO from '../components/SEO';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto w-full px-12 py-24">
      <SEO
        title="About VEG Typewriter — High-Performance Nepali Typing Online"
        description="Learn about VEG, the high-performance online typing test designed to help you master Nepali typing online with precision and velocity."
        path="/about"
        keywords="nepali typing online, online nepali typing, about VEG typewriter, high-performance typing, typing platform"
      />
      <h1 className="text-6xl font-black mb-12 tracking-tighter text-primary">VEG.</h1>
      
      <div className="space-y-12 text-lg text-on-background/60 leading-relaxed font-manrope">
        <section>
          <h2 className="text-xs font-bold text-primary uppercase tracking-[0.4em] mb-4">The Philosophy</h2>
          <p>
            VEG (वेग) is more than a typing test; it is a signature of precision and velocity. Born from the need for a high-performance 
            typing experience for the Nepali language, it combines the mechanical soul of a vintage typewriter with the 
            monolithic aesthetics of high-speed computation.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-bold text-primary uppercase tracking-[0.4em] mb-4">Supported Scripts</h2>
          <p>
            We support multiple input methods to cater to every typist. From the traditional <span className="text-on-background">Preeti</span> layout 
            to modern <span className="text-on-background">Unicode</span> inputs, our engine ensures 
            low-latency feedback and precise character mapping.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-bold text-primary uppercase tracking-[0.4em] mb-4">Open Source</h2>
          <p>
            Built by typists, for typists. Our code is open, our precision is verifiable. Check out the repository on <a href="https://github.com/iamdhruba" target="_blank" rel="noopener noreferrer" className="text-on-background hover:underline">GitHub</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-bold text-primary uppercase tracking-[0.4em] mb-4">Connect</h2>
          <p>
            Follow the journey and get updates on <a href="https://instagram.com/saydhruba" target="_blank" rel="noopener noreferrer" className="text-on-background hover:underline">Instagram</a> or connect on <a href="https://www.facebook.com/dhruba.chy.9" target="_blank" rel="noopener noreferrer" className="text-on-background hover:underline">Facebook</a>.
          </p>
        </section>
      </div>

      <div className="mt-24 pt-12 border-t border-outline/20 flex justify-between items-center">
        <div className="text-[10px] text-on-background/40 font-bold uppercase tracking-widest">Version 1.0.4 - "Velvet"</div>
        <div className="flex gap-8">
           <a href="https://github.com/iamdhruba" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm font-bold">Creator: Dhruba</a>
           <a href="/terms" className="text-primary hover:underline text-sm font-bold">Terms</a>
           <a href="/privacy" className="text-primary hover:underline text-sm font-bold">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default About;
