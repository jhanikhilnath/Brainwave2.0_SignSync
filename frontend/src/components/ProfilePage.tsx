import { Award, Flame, Target, Calendar, Trophy, Star, Map, Settings } from 'lucide-react';

export function ProfilePage() {
  const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first lesson', icon: '🎯', earned: true },
    { id: 2, name: 'Week Warrior', description: '7 day streak', icon: '🔥', earned: true },
    { id: 3, name: 'Alphabet Master', description: 'Master the ISL alphabet', icon: '✍️', earned: true },
    { id: 4, name: 'Number Ninja', description: 'Master all numbers', icon: '🔢', earned: true },
    { id: 5, name: 'Perfect Score', description: 'Get 100% on a lesson', icon: '💯', earned: true },
    { id: 6, name: 'Social Butterfly', description: 'Complete greetings module', icon: '👋', earned: false },
    { id: 7, name: 'Month Milestone', description: '30 day streak', icon: '📅', earned: false },
    { id: 8, name: 'Top 10', description: 'Reach top 10 on leaderboard', icon: '🏆', earned: false },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 pb-24">
      {/* Profile Header */}
      <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 md:p-8 mb-6 md:mb-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-5xl md:text-6xl rounded-full shadow-lg border-4 border-white/5">
            🧒
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl mb-2 text-foreground font-bold font-pixel tracking-wide">Explorer Passport</h1>
            <p className="text-muted-foreground mb-4 flex items-center gap-2 justify-center md:justify-start text-lg">
              <Map className="w-4 h-4" /> Exploring since Jan 2026
            </p>

            <div className="flex gap-4 justify-center md:justify-start">
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-bold transition-all">
                Update Photo
              </button>
              <button className="px-4 py-2 bg-transparent hover:bg-white/5 border border-white/10 rounded-full text-sm font-bold transition-all flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>

          <div className="text-center bg-black/20 p-6 rounded-2xl border border-white/5 min-w-[200px]">
            <div className="text-3xl md:text-4xl mb-1 text-primary font-bold font-pixel">Level 5</div>
            <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden border border-white/5 mt-2">
              <div className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" style={{ width: '60%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-mono">1,250 XP to Lvl 6</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-8">
        {[
          { icon: Flame, value: '12', label: 'Streak', accent: 'primary', color: 'text-orange-500' },
          { icon: Target, value: '85%', label: 'Accuracy', accent: 'secondary', color: 'text-blue-500' },
          { icon: Calendar, value: '32', label: 'Days Active', accent: 'accent', color: 'text-green-500' },
          { icon: Trophy, value: '#10', label: 'Rank', accent: 'primary', color: 'text-yellow-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-md rounded-2xl p-4 md:p-6 text-center hover:bg-white/10 transition-all border border-white/5 group hover:-translate-y-1 shadow-lg">
            <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-2xl md:text-3xl mb-1 font-bold text-foreground font-mono">{stat.value}</p>
            <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest font-bold">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 md:p-8 mb-6 md:mb-8 shadow-xl">
        <h2 className="text-xl md:text-2xl mb-6 text-foreground font-bold flex items-center gap-3 font-pixel">
          <Award className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" /> Badges & Trophies
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-2xl border transition-all text-center group cursor-pointer ${achievement.earned
                  ? 'bg-gradient-to-br from-white/10 to-transparent border-white/10 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(var(--primary),0.2)]'
                  : 'bg-black/20 border-white/5 opacity-50 grayscale hover:opacity-70'
                }`}
            >
              <div className="text-4xl md:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{achievement.icon}</div>
              <p className={`text-sm font-bold mb-1 ${achievement.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                {achievement.name}
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                {achievement.description}
              </p>
              {achievement.earned && (
                <div className="mt-3">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mx-auto animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Learning Activity */}
      <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 md:p-8 shadow-xl">
        <h2 className="text-xl md:text-2xl mb-6 font-bold flex items-center gap-3 font-pixel text-blue-400">
          <Map className="w-6 h-6" /> Trail Log
        </h2>
        <div className="space-y-4">
          {[
            { icon: '✓', title: 'Completed: Basic Greetings - Lesson 6', time: '2 hours ago', xp: '+50 XP', accent: 'accent', bg: 'bg-green-500/20 text-green-400' },
            { icon: '🔥', title: '12 Day Streak Achievement!', time: 'Today', xp: '+100 XP', accent: 'primary', bg: 'bg-orange-500/20 text-orange-400' },
            { icon: '⬆️', title: 'Leveled up to Level 5!', time: 'Yesterday', xp: 'Level Up!', accent: 'secondary', bg: 'bg-blue-500/20 text-blue-400' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-black/20 rounded-2xl border border-white/5 hover:bg-white/5 transition-colors">
              <div className={`w-12 h-12 flex items-center justify-center text-xl rounded-full ${activity.bg}`}>
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-foreground truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              <div className={`font-bold text-sm px-3 py-1 rounded-full border border-white/10 bg-white/5 ${activity.xp.includes('Level') ? 'text-yellow-400' : 'text-foreground'
                }`}>{activity.xp}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
