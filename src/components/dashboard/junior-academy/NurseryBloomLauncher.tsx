import React from 'react';

/**
 * CAMPUSCONNECT -> NURSERY BLOOM GATEWAY
 * 
 * Instructions for Implementation:
 * 1. Copy this file into your CampusConnect 'components' folder.
 * 2. Ensure Tailwind CSS is configured in your project.
 * 3. Import and use this component in your Dashboard.
 */

const NurseryBloomLauncher: React.FC = () => {
  // The official URL of your Nursery Bloom deployment
  const APP_BASE_URL = "https://nursery-bloom-825774943692.us-west1.run.app";

  const handleLaunch = () => {
    /**
     * GENERATE SECURE HANDSHAKE
     * Nursery Bloom requires a 'token' URL parameter > 10 chars.
     * We combine a random string with a timestamp for uniqueness.
     */
    const salt = Math.random().toString(36).substring(2, 12);
    const timestamp = Date.now().toString(36);
    const secureToken = `${salt}${timestamp}`;

    // Construct the authenticated URL
    const authenticatedUrl = `${APP_BASE_URL}?token=${secureToken}`;

    // Open in a new tab to keep CampusConnect active in the background
    const bloomWindow = window.open(authenticatedUrl, '_blank', 'noopener,noreferrer');
    
    if (bloomWindow) {
      bloomWindow.focus();
    }
  };

  return (
    <div className="group relative p-8 max-w-sm bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-pink-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50" />
      
      <div className="relative z-10">
        {/* App Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-400 rounded-2xl flex items-center justify-center text-white text-3xl mb-6 shadow-lg rotate-3 group-hover:rotate-12 transition-transform border-4 border-white">
          <i className="fas fa-graduation-cap"></i>
        </div>

        {/* Info */}
        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-2">
          Nursery <span className="text-pink-500">Bloom</span>
        </h3>
        <p className="text-slate-400 text-sm font-bold leading-relaxed mb-8">
          Interactive AI learning suite including Phonics, Numeracy, and the AI Buddy Tutor.
        </p>

        {/* Action Button */}
        <button 
          onClick={handleLaunch}
          className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-pink-600 transition-all uppercase text-xs tracking-[0.2em] shadow-[0_8px_0_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none"
        >
          <i className="fas fa-rocket text-yellow-400 group-hover:animate-bounce"></i>
          Launch App
        </button>

        {/* Connection Status */}
        <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Systems Live</span>
          </div>
          <i className="fas fa-shield-halved text-slate-200 text-sm"></i>
        </div>
      </div>
    </div>
  );
};

export default NurseryBloomLauncher;
