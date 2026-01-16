import { useState } from 'react';
import { Navbar, ActivePage } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { LearnPage } from './components/LearnPage';
import { LeaderboardPage } from './components/LeaderboardPage';
import { ProfilePage } from './components/ProfilePage';
import { LessonPage } from './components/LessonPage';
import { LandingPage } from './components/LandingPage';
import { AlphabetLevelsPage } from './components/AlphabetLevelsPage';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [activePage, setActivePage] = useState<ActivePage>('Home');
  const [currentLesson, setCurrentLesson] = useState<{ id: number; title: string } | null>(null);
  const [isInAlphabetLevel, setIsInAlphabetLevel] = useState(false);

  // Lesson IDs:
  // 1: Alphabet Signs (Container) -> Opens AlphabetLevelsPage
  // 11-14: Alphabet Mini-Courses
  // 15: Alphabet Quiz
  // 2+: Other Lessons (Numbers, etc.)
  const lessons = [
    { id: 11, title: 'Vowels' },
    { id: 12, title: 'Everyday Consonants' },
    { id: 13, title: 'Building Block' },
    { id: 14, title: 'Rare Consonants' },
    { id: 15, title: 'Alphabet Quiz' },
    // Placeholders for others if they become playable
    { id: 2, title: 'Numbers (0-100)' },
  ];

  const handleStartLesson = (lessonId: number, lessonTitle: string) => {
    // If user clicks "Alphabet Signs" (ID 1), go to Alphabet Sub-levels
    if (lessonId === 1) {
      setIsInAlphabetLevel(true);
    } else {
      // Otherwise start a regular lesson
      setCurrentLesson({ id: lessonId, title: lessonTitle });
    }
  };

  const handleBackFromLesson = () => {
    setCurrentLesson(null);
    // Note: We don't change isInAlphabetLevel here, so we return to whatever view we came from
    // If we were in Alphabet Levels, we stay there. If we were in Jungle Map (direct lesson), we return there.
  };

  const handleBackToMap = () => {
    setIsInAlphabetLevel(false);
  };

  const handleNextLesson = () => {
    if (currentLesson) {
      const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
      if (currentIndex < lessons.length - 1) {
        const nextLesson = lessons[currentIndex + 1];
        setCurrentLesson({ id: nextLesson.id, title: nextLesson.title });
      }
    }
  };

  const handlePreviousLesson = () => {
    if (currentLesson) {
      const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
      if (currentIndex > 0) {
        const prevLesson = lessons[currentIndex - 1];
        setCurrentLesson({ id: prevLesson.id, title: prevLesson.title });
      }
    }
  };

  const renderPage = () => {
    if (currentLesson) {
      const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
      return (
        <LessonPage
          lessonTitle={currentLesson.title}
          onBack={handleBackFromLesson}
          onNext={handleNextLesson}
          onPrevious={handlePreviousLesson}
          hasPrevious={currentIndex > 0}
          hasNext={currentIndex < lessons.length - 1}
        />
      );
    }

    switch (activePage) {
      case 'Home':
        return <HomePage />;
      case 'Learn':
        if (isInAlphabetLevel) {
          return <AlphabetLevelsPage onStartLesson={handleStartLesson} onBack={handleBackToMap} />;
        }
        return <LearnPage onStartLesson={handleStartLesson} />;
      case 'Leaderboard':
        return <LeaderboardPage />;
      case 'Profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  // Show Landing Page if user hasn't started yet
  if (!hasStarted) {
    return <LandingPage onGetStarted={() => setHasStarted(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar activePage={activePage} onPageChange={(page) => {
        setActivePage(page);
        setIsInAlphabetLevel(false); // Reset sub-level nav when switching main tabs
        setCurrentLesson(null);
      }} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}
