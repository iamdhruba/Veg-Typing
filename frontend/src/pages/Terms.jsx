import React from 'react';
import SEO from '../components/SEO';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto w-full px-12 py-24">
      <SEO
        title="Terms of Service | VEG Nepali Typewriter"
        description="Terms and conditions for using the VEG Nepali typing platform."
        path="/terms"
      />
      <h1 className="text-4xl font-black mb-8 tracking-tighter text-primary uppercase">Terms of Service</h1>
      
      <div className="space-y-12 text-sm text-on-background/70 leading-relaxed font-manrope">
        <section>
          <h2 className="text-xs font-bold text-on-background uppercase tracking-[0.2em] mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using VEG Nepali Typewriter, you accept and agree to be bound by the terms and provision of this agreement. 
            This project is proudly built and maintained by <a href="https://github.com/iamdhruba" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Dhruba</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-bold text-on-background uppercase tracking-[0.2em] mb-4">2. Usage License</h2>
          <p>
            VEG is an open platform designed for typing practice and competitive racing. You may use it freely for educational and personal purposes. 
            You must not use our service for any illegal or unauthorized purpose, nor may you, in the use of the Service, violate any laws in your jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-bold text-on-background uppercase tracking-[0.2em] mb-4">3. Multiplayer & Leaderboards</h2>
          <p>
            While participating in multiplayer races and global leaderboards, you agree to maintain fair play. We employ heuristics to detect botting and scripting. 
            Any account found manipulating typing speed via scripts (such as exceeding human limits of 350 WPM continuously) will be permanently banned from the leaderboards.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-bold text-on-background uppercase tracking-[0.2em] mb-4">4. Modifications to Service</h2>
          <p>
            We reserve the right at any time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-bold text-on-background uppercase tracking-[0.2em] mb-4">5. Contact</h2>
          <p>
            For inquiries, connect with the creator on <a href="https://instagram.com/saydhruba" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Instagram</a> or <a href="https://www.facebook.com/dhruba.chy.9" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
