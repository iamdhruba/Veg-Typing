import React from 'react';
import SEO from '../components/SEO';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto w-full px-12 py-24">
      <SEO
        title="Privacy Policy | VEG Nepali Typewriter"
        description="Privacy policy and data handling for VEG Nepali Typewriter."
        path="/privacy"
      />
      <h1 className="text-4xl font-black mb-8 tracking-tighter text-primary uppercase">Privacy Policy</h1>
      
      <div className="space-y-12 text-sm text-on-background/70 leading-relaxed font-manrope">
        <section>
          <h2 className="text-xs font-bold text-on-background uppercase tracking-[0.2em] mb-4">1. Information We Collect</h2>
          <p>
            When you use VEG Typewriter, we collect basic performance metrics (such as WPM and accuracy) to provide you with detailed statistics and place you on the global leaderboards. 
            If you create an account, we store your username and securely encrypted password.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-bold text-on-background uppercase tracking-[0.2em] mb-4">2. How We Use Your Data</h2>
          <p>
            Your data is used strictly to enhance your experience—to track your progress over time, generate heatmaps of your weak keys, and populate the multiplayer and global leaderboards. 
            We do not sell, rent, or share your personal data with third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-bold text-on-background uppercase tracking-[0.2em] mb-4">3. Local Storage</h2>
          <p>
            We use your browser's Local Storage to persist your UI preferences (such as Caret Style, Font Size, and Sound toggles) and guest-level typing progress. 
            You have full control over this data and can wipe it anytime from the Settings page.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-bold text-on-background uppercase tracking-[0.2em] mb-4">4. Open Source & Transparency</h2>
          <p>
            VEG is maintained transparently. The source code is available on <a href="https://github.com/iamdhruba" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a> by its creator, Dhruba. You can inspect how data is processed locally and via our backend services.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-bold text-on-background uppercase tracking-[0.2em] mb-4">5. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or wish to request data deletion, please reach out to Dhruba on <a href="https://instagram.com/saydhruba" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Instagram</a> or <a href="https://www.facebook.com/dhruba.chy.9" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
