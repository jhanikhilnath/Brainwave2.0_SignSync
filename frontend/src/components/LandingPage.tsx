import { ArrowRight, Code, Trophy, Users, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [displayText, setDisplayText] = useState('');
  const phrase = "Master Indian Sign Language";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(phrase.slice(0, i + 1));
      i++;
      if (i > phrase.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden font-mono pt-20 px-4 pb-10 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/src/assets/landing-bg.jpg')` }}>

      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Main Content Wrapper - Ensure z-10 to sit above overlay */}
      <div className="relative z-10 w-full flex flex-col items-center">

        {/* Background Grid Animation (CSS powered in theme.css) */}

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto z-10 mb-16">


          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight" style={{ fontFamily: '"Press Start 2P"' }}>
            START YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">ISL ADVENTURE</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 h-8 font-bold">
            {displayText}<span className="animate-pulse">_</span>
          </p>

          <button
            onClick={onGetStarted}
            className="bg-primary hover:bg-primary/90 text-black text-lg px-8 py-4 flex items-center gap-3 mx-auto rounded-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold font-pixel uppercase"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="mt-6 text-sm text-gray-500">Free forever • No credit card required</p>
        </div>

        {/* Feature Dashboard "Holo-Deck" */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto z-10">
          {/* Card 1 */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col gap-4 group hover:bg-white/10 transition-all shadow-xl">
            <div className="w-12 h-12 bg-blue-900/50 border border-blue-500/30 flex items-center justify-center rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-lg">
              <Code className="w-6 h-6 text-blue-400 group-hover:text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 font-[vt323]">Interactive Lessons</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Learn alphabet, numbers, and phrases through gamified coding challenges.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col gap-4 group hover:bg-white/10 transition-all shadow-xl">
            <div className="w-12 h-12 bg-purple-900/50 border border-purple-500/30 flex items-center justify-center rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-colors shadow-lg">
              <Trophy className="w-6 h-6 text-purple-400 group-hover:text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 font-[vt323]">Quests & Ranks</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Complete daily streaks, earn XP, and climb the global leaderboard.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col gap-4 group hover:bg-white/10 transition-all shadow-xl">
            <div className="w-12 h-12 bg-green-900/50 border border-green-500/30 flex items-center justify-center rounded-xl group-hover:bg-green-500 group-hover:text-white transition-colors shadow-lg">
              <Users className="w-6 h-6 text-green-400 group-hover:text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 font-[vt323]">Community</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Join thousands of learners in our discord and share your progress.
              </p>
            </div>
          </div>
        </div>

        {/* Footer / Decor */}
        <footer className="mt-20 border-t border-white/10 pt-8 w-full max-w-6xl flex justify-between items-center text-gray-500 text-xs">
          <div>© 2024 SignSync. All rights reserved.</div>
          <div className="flex gap-4">
            <Star className="w-4 h-4" />
            <span>Built with React & Pixel Love</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
