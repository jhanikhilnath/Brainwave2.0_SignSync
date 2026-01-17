import { Lock, Star, Play, Check } from 'lucide-react';
import journeyBg from '@/assets/journey-bg.jpg';

interface LearnPageProps {
  onStartLesson: (lessonId: number, lessonTitle: string) => void;
}

export function LearnPage({ onStartLesson }: LearnPageProps) {
  const pathPositions = [
    { top: '88%', left: '50%' },
    { top: '74%', left: '30%' },
    { top: '58%', left: '65%' },
    { top: '44%', left: '35%' },
    { top: '28%', left: '60%' },
    { top: '12%', left: '45%' },
  ];

  const lessons = [
    { id: 1, title: 'Alphabet Signs', status: 'completed', stars: 3 },
    { id: 2, title: 'Numbers(0-9)', status: 'completed', stars: 2 },
    {
      id: 3,
      title: 'Basic Greetings and Phrases',
      status: 'in-progress',
      stars: 0,
    },
    { id: 4, title: 'Social Relationships', status: 'in-progress', stars: 0 },
    { id: 5, title: 'Daily Activities', status: 'in-progress', stars: 0 },
    { id: 6, title: 'Food & Drinks', status: 'in-progress', stars: 0 },
  ];

  return (
    <div className='flex-1 bg-accent/30 font-mono flex flex-col lg:flex-row overflow-hidden'>
      {/* Left Sidebar - Glass Instructions */}
      <div className='hidden lg:flex w-80 flex-col justify-center items-end p-8 z-10 relative'>
        <div className='bg-white/10 backdrop-blur-md text-white p-6 rounded-3xl shadow-xl relative w-full max-w-xs border border-white/20'>
          <h3
            className='font-bold text-xl mb-2 text-primary'
            style={{ fontFamily: '"Press Start 2P"' }}
          >
            JOURNEY
          </h3>
          <p className='text-gray-200 font-medium leading-relaxed font-[VT323] text-xl'>
            Your adventure begins here! <br />
            <br />
            Complete each checkpoint to unlock new mysteries of sign language.
          </p>
          {/* Decorative Glass Orbs */}
          <div className='absolute -right-4 top-10 w-8 h-8 bg-primary/20 backdrop-blur-md rounded-full border border-white/10'></div>
          <div className='absolute -right-2 top-14 w-6 h-6 bg-primary/20 backdrop-blur-md rounded-full border border-white/10'></div>
        </div>
      </div>

      {/* Center - Map Area */}
      <div className='flex-1 h-full relative overflow-y-auto no-scrollbar'>
        <div className='max-w-[600px] mx-auto relative pb-16 min-h-full'>
          {/* Background Map Image */}
          <img
            src={journeyBg}
            alt='Jungle Path Map'
            className='w-full h-auto max-h-[calc(100vh-8rem)] block select-none pointer-events-none object-contain'
          />

          {/* Level Nodes */}
          {lessons.map((lesson, index) => {
            const pos = pathPositions[index] || { top: '0', left: '0' };
            const isLocked = lesson.status === 'locked';
            const isCompleted = lesson.status === 'completed';
            const isCurrent = lesson.status === 'in-progress';

            return (
              <div
                key={lesson.id}
                className='absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10'
                style={{ top: pos.top, left: pos.left }}
              >
                {/* Level Button */}
                <button
                  onClick={() =>
                    !isLocked && onStartLesson(lesson.id, lesson.title)
                  }
                  disabled={isLocked}
                  className={`
                    w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full border-4 shadow-lg transition-all transform
                    ${
                      isLocked
                        ? 'bg-muted border-gray-600 cursor-not-allowed grayscale'
                        : isCompleted
                          ? 'bg-primary border-white hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(255,208,38,0.6)]'
                          : 'bg-accent border-white hover:scale-110 animate-bounce-slow shadow-[0_0_20px_rgba(59,130,246,0.6)]'
                    }
                    `}
                >
                  {isCompleted ? (
                    <Check className='w-8 h-8 md:w-10 md:h-10 text-black' />
                  ) : isLocked ? (
                    <Lock className='w-6 h-6 md:w-8 md:h-8 text-black/50' />
                  ) : (
                    <Play className='w-8 h-8 md:w-10 md:h-10 text-white fill-white ml-1' />
                  )}
                </button>

                {/* Stars for Completed Levels */}
                {isCompleted && (
                  <div className='flex gap-0.5 mt-1 absolute -top-4 md:-top-5 w-full justify-center'>
                    {[...Array(3)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 md:w-5 md:h-5 ${
                          i < lesson.stars
                            ? 'text-primary fill-primary drop-shadow-md'
                            : 'text-muted fill-muted'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Label */}
                <div
                  className={`
                    mt-2 px-3 py-1 font-bold text-xs md:text-sm whitespace-nowrap rounded-full border-2
                    ${
                      isLocked
                        ? 'bg-black/50 text-gray-400 border-gray-600 backdrop-blur-sm'
                        : isCurrent
                          ? 'bg-accent/80 text-white border-white backdrop-blur-md shadow-lg'
                          : 'bg-black/50 text-white border-white/30 backdrop-blur-sm'
                    }
                    `}
                >
                  {lesson.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Sidebar - Stats & Quest */}
      <div className='hidden lg:flex w-80 flex-col p-8 z-10 gap-8 h-full justify-center'>
        {/* Stats Panel */}
        <div className='bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl'>
          <h3 className='text-gray-400 text-sm font-bold uppercase mb-4'>
            Current Session
          </h3>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-white'>XP Gained</span>
            <span className='text-primary font-bold'>120 XP</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-white'>Streak</span>
            <span className='text-orange-500 font-bold'>12 Days</span>
          </div>
        </div>

        {/* Daily Quest */}
        <div className='bg-white/5 backdrop-blur-md rounded-2xl border border-primary/30 p-6 shadow-xl relative overflow-hidden'>
          <div className='absolute top-0 right-0 p-4 opacity-10'>
            <Star className='w-20 h-20 text-primary' />
          </div>
          <h3 className='text-primary text-sm font-bold uppercase mb-2 flex items-center gap-2 relative z-10'>
            <Star className='w-4 h-4 fill-primary' /> Daily Quest
          </h3>
          <p className='text-white text-lg mb-4 font-[VT323] relative z-10'>
            Complete 2 Lessons
          </p>

          {/* Progress Bar Container */}
          <div className='w-full bg-black/40 h-3 rounded-full overflow-hidden relative z-10'>
            {/* Fill */}
            <div className='bg-green-500 h-full w-[40%] shadow-[0_0_10px_rgba(34,197,94,0.5)]'></div>
          </div>
          <div className='flex justify-between mt-2 text-xs text-gray-400 font-bold relative z-10'>
            <span>2 / 5 XP</span>
            <span>REWARD: 50 GEMS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
