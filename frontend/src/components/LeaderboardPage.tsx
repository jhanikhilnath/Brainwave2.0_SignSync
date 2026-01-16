import { Trophy, Crown, Clock } from 'lucide-react';
import { useState } from 'react';
import leaderboardBg from '@/assets/leaderboard-bg.jpg';

export function LeaderboardPage() {
  const topUsers = [
    { rank: 1, name: 'Priya Sharma', xp: 5480, streak: 45, avatar: '👩‍🚀' },
    { rank: 2, name: 'Rahul Verma', xp: 4920, streak: 32, avatar: '👨‍🎤' },
    { rank: 3, name: 'Simran K.', xp: 4100, streak: 28, avatar: '🧙‍♀️' },
    { rank: 4, name: 'Arjun Singh', xp: 3850, streak: 21, avatar: '🦊' },
    { rank: 5, name: 'You', xp: 3200, streak: 12, avatar: '👾', isCurrentUser: true },
    { rank: 6, name: 'Nisha P.', xp: 2900, streak: 15, avatar: '🐼' },
  ];

  return (
    <div className="w-full h-full min-h-screen relative p-4 bg-cover bg-center bg-fixed font-[VT323]"
      style={{ backgroundImage: `url('/src/assets/leaderboard-bg.jpg')` }}>

      {/* Overlay to ensure readability */}
      <div className="fixed inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <br></br>
          <h1 className="text-5xl md:text-6xl text-primary font-bold drop-shadow-[4px_4px_0_#000]" style={{ fontFamily: '"Press Start 2P"' }}>
            LEADERBOARD
          </h1>
          <br></br>
          <div className="flex justify-center gap-4 mt-6">
            <button className="bg-primary hover:bg-primary/90 text-black px-6 py-2 rounded-full font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
              <Clock className="w-4 h-4" /> This Week
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-bold backdrop-blur-md transition-all border border-white/10">
              All Time
            </button>
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>


        {/* Podium Section */}
        <div className="flex items-end justify-center gap-4 md:gap-8 mb-16 h-80">
          {/* 2nd Place */}
          <div className="flex flex-col items-center z-0">
            <div className="w-24 h-24 rounded-full border-4 border-gray-400 overflow-hidden shadow-xl mb-4 relative flex items-center justify-center bg-gray-800">
              <span className="text-4xl">{topUsers[1].avatar}</span>
              <div className="absolute bottom-0 w-full bg-gray-400 text-black text-center text-xs font-bold py-1">#2</div>
            </div>
            <div className="text-white font-bold text-xl mb-1">{topUsers[1].name}</div>
            <div className="text-primary text-sm">{topUsers[1].xp} XP</div>
            <div className="h-32 w-24 bg-gray-600/50 backdrop-blur-md rounded-t-2xl border-x-2 border-t-2 border-white/10 mt-2 flex items-end justify-center pb-4 shadow-lg">
              <div className="text-4xl opacity-50 font-bold text-white">2</div>
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center z-10">
            <Crown className="w-12 h-12 text-primary mb-2 animate-bounce filter drop-shadow-[0_0_10px_rgba(255,208,38,0.8)]" />
            <div className="w-32 h-32 rounded-full border-4 border-primary overflow-hidden shadow-[0_0_20px_rgba(255,208,38,0.5)] mb-4 relative flex items-center justify-center bg-gray-800">
              <span className="text-6xl">{topUsers[0].avatar}</span>
              <div className="absolute bottom-0 w-full bg-primary text-black text-center text-sm font-bold py-1">#1</div>
            </div>
            <div className="text-white font-bold text-2xl mb-1">{topUsers[0].name}</div>
            <div className="text-primary font-bold">{topUsers[0].xp} XP</div>
            <div className="h-48 w-32 bg-primary/20 backdrop-blur-md rounded-t-2xl border-x-2 border-t-2 border-primary/30 mt-2 flex items-end justify-center pb-4 relative shadow-[0_0_30px_rgba(255,208,38,0.2)]">
              <div className="text-6xl text-primary font-bold">1</div>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center z-0">
            <div className="w-24 h-24 rounded-full border-4 border-orange-700 overflow-hidden shadow-xl mb-4 relative flex items-center justify-center bg-gray-800">
              <span className="text-4xl">{topUsers[2].avatar}</span>
              <div className="absolute bottom-0 w-full bg-orange-700 text-white text-center text-xs font-bold py-1">#3</div>
            </div>
            <div className="text-white font-bold text-xl mb-1">{topUsers[2].name}</div>
            <div className="text-primary text-sm">{topUsers[2].xp} XP</div>
            <div className="h-24 w-24 bg-orange-900/50 backdrop-blur-md rounded-t-2xl border-x-2 border-t-2 border-white/10 mt-2 flex items-end justify-center pb-4 shadow-lg">
              <div className="text-4xl opacity-50 font-bold text-white">3</div>
            </div>
          </div>
        </div>

        {/* The List */}
        <div className="space-y-4 pb-20">
          {topUsers.slice(3).map((user) => (
            <div
              key={user.rank}
              className={`
                        bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex items-center gap-6 shadow-lg hover:bg-white/10 transition-all
                        ${user.isCurrentUser ? 'border-primary/50 bg-primary/10 shadow-[0_0_15px_rgba(255,208,38,0.2)]' : ''}
                    `}
            >
              <div className="text-2xl text-gray-400 w-8 font-bold">{user.rank}</div>

              <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-black rounded-full flex items-center justify-center text-2xl border border-white/20 shadow-inner">
                {user.avatar}
              </div>

              <div className="flex-1">
                <div className={`text-xl font-bold ${user.isCurrentUser ? 'text-primary' : 'text-white'}`}>
                  {user.name}
                </div>
                <div className="text-sm text-gray-500">Streak: {user.streak} days</div>
              </div>

              <div className="text-right">
                <div className="text-primary font-bold text-xl">{user.xp}</div>
                <div className="text-xs text-gray-500">XP</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
