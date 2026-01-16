import { Map, Target, Flame, Crown, Zap, Play } from 'lucide-react';

export function HomePage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      {/* Welcome Banner */}
      <div className="mb-8 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-primary/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 grid-bg"></div>
        <h1 className="text-3xl md:text-4xl mb-2 text-foreground font-bold font-pixel pixel-text-shadow relative z-10">
          Welcome back, Explorer! 🦁
        </h1>
        <p className="text-primary text-xl relative z-10">Ready for another adventure?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Flame, value: '12', label: 'Day Streak', accent: 'primary' },
          { icon: Target, value: '85%', label: 'Accuracy', accent: 'secondary' },
          { icon: Map, value: '48', label: 'Signs Found', accent: 'accent' },
          { icon: Crown, value: '1,250', label: 'Jungle XP', accent: 'primary' }
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg p-4 md:p-6 hover:-translate-y-1 transition-transform">
            <div className="flex items-center gap-3 md:gap-4">
              <div className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl border-2 ${stat.accent === 'primary' ? 'bg-primary/20 border-primary/50' :
                  stat.accent === 'secondary' ? 'bg-secondary/20 border-secondary/50' :
                    'bg-accent/20 border-accent/50'
                }`}>
                <stat.icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.accent === 'primary' ? 'text-primary' :
                    stat.accent === 'secondary' ? 'text-secondary' :
                      'text-accent'
                  }`} />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Learning */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-accent/30 shadow-xl p-6 md:p-8 mb-8">
        <h2 className="text-2xl mb-4 text-primary font-bold font-pixel">Continue Expedition</h2>
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 bg-black/20 rounded-xl p-4 border border-white/5">
          <div className="w-20 h-20 bg-primary flex items-center justify-center text-4xl rounded-xl border-2 border-white/20 shadow-lg transform rotate-3">
            👋
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl mb-1 text-foreground font-bold">Basic Greetings</h3>
            <p className="text-muted-foreground mb-3">Learn to say hello with signs!</p>
            <div className="w-full bg-background/50 h-4 border border-white/10 rounded-full overflow-hidden">
              <div className="bg-accent h-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: '60%' }}></div>
            </div>
          </div>
          <button className="bg-accent hover:bg-accent/80 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2">
            <Play className="w-5 h-5" />
            Resume
          </button>
        </div>
      </div>

      {/* Daily Goal */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-secondary/30 shadow-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 justify-center md:justify-start font-pixel text-secondary">
              <Zap className="w-6 h-6" /> Daily Quest
            </h2>
            <p className="text-muted-foreground text-lg">Complete 3 more lessons to find the hidden treasure!</p>
          </div>
          <div className="text-center bg-black/20 p-4 rounded-xl border border-white/5">
            <p className="text-4xl font-bold text-secondary">2/5</p>
            <p className="text-sm text-muted-foreground uppercase">Missions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
