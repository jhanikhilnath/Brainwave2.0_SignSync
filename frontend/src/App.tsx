import { useState } from 'react';
import { Navbar, ActivePage } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { LearnPage } from './components/LearnPage';
import { LeaderboardPage } from './components/LeaderboardPage';
import { ProfilePage } from './components/ProfilePage';
import { LessonPage } from './components/LessonPage';
import { LandingPage } from './components/LandingPage';
import { AlphabetLevelsPage } from './components/AlphabetLevelsPage';
import { NumbersLevelsPage } from './components/NumbersLevelsPage';
import { GreetingsLevelsPage } from './components/GreetingsLevelsPage';
import { SocialLevelsPage } from './components/SocialLevelsPage';
import { DailyActivitiesLevelsPage } from './components/DailyActivitiesLevelsPage';
import { FoodLevelsPage } from './components/FoodLevelsPage';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [activePage, setActivePage] = useState<ActivePage>('Home');
  const [currentLesson, setCurrentLesson] = useState<{ id: number; title: string } | null>(null);
  const [isInAlphabetLevel, setIsInAlphabetLevel] = useState(false);
  const [isInNumbersLevel, setIsInNumbersLevel] = useState(false);
  const [isInGreetingsLevel, setIsInGreetingsLevel] = useState(false);
  const [isInSocialLevel, setIsInSocialLevel] = useState(false);
  const [isInDailyActivitiesLevel, setIsInDailyActivitiesLevel] = useState(false);
  const [isInFoodLevel, setIsInFoodLevel] = useState(false);

  // Lesson IDs:
  // 1: Alphabet Signs (Container) -> Opens AlphabetLevelsPage
  // 11-14: Alphabet Mini-Courses
  // 15: Alphabet Quiz
  // 2: Numbers (Container) -> Opens NumbersLevelsPage
  // 20-29: Numbers Mini-Courses
  // 3: Basic Greetings (Container) -> Opens GreetingsLevelsPage
  // 30-37: Greetings Mini-Courses
  // 4: Social Relationships (Container) -> Opens SocialLevelsPage
  // 40-44: Social Mini-Courses
  // 5: Daily Activities (Container) -> Opens DailyActivitiesLevelsPage
  // 50-60: Daily Activities Mini-Courses
  // 6: Food & Drinks (Container) -> Opens FoodLevelsPage
  // 61-68: Food & Drinks Mini-Courses
  const lessons = [
    { id: 11, title: 'Vowels' },
    { id: 12, title: 'Everyday Consonants' },
    { id: 13, title: 'Building Block' },
    { id: 14, title: 'Rare Consonants' },
    { id: 15, title: 'Alphabet Quiz' },
    { id: 20, title: 'Number 0' },
    { id: 21, title: 'Number 1' },
    { id: 22, title: 'Number 2' },
    { id: 23, title: 'Number 3' },
    { id: 24, title: 'Number 4' },
    { id: 25, title: 'Number 5' },
    { id: 26, title: 'Number 6' },
    { id: 27, title: 'Number 7' },
    { id: 28, title: 'Number 8' },
    { id: 29, title: 'Number 9' },
    { id: 30, title: "I'm Good" },
    { id: 31, title: 'I want Food' },
    { id: 32, title: 'All_Gone' },
    { id: 33, title: 'ok fine' },
    { id: 34, title: 'not fine' },
    { id: 35, title: 'See' },
    { id: 36, title: 'Stop' },
    { id: 37, title: 'How_Many' },
    { id: 40, title: 'Mother' },
    { id: 41, title: 'Baby' },
    { id: 42, title: 'Man' },
    { id: 43, title: 'Friend (Social relationship)' },
    { id: 44, title: 'Marry (Relational)' },
    { id: 50, title: 'College' },
    { id: 51, title: 'Work' },
    { id: 52, title: 'Write' },
    { id: 53, title: 'Call' },
    { id: 54, title: 'Pray' },
    { id: 55, title: 'Stand' },
    { id: 56, title: 'Watch' },
    { id: 57, title: 'Hang' },
    { id: 58, title: 'Become' },
    { id: 59, title: 'Assistance' },
    { id: 60, title: 'Camp' },
    { id: 61, title: 'Meat' },
    { id: 62, title: 'Bowl (Utensil)' },
    { id: 63, title: 'I want Food' },
    { id: 64, title: 'Water' },
    { id: 65, title: 'Tea' },
    { id: 66, title: 'Milk' },
    { id: 67, title: 'Rice' },
    { id: 68, title: 'Hungry' },
  ];

  const handleStartLesson = (lessonId: number, lessonTitle: string) => {
    // If user clicks "Alphabet Signs" (ID 1), go to Alphabet Sub-levels
    if (lessonId === 1) {
      setIsInAlphabetLevel(true);
      setIsInNumbersLevel(false);
      setIsInGreetingsLevel(false);
      setIsInSocialLevel(false);
      setIsInDailyActivitiesLevel(false);
      setIsInFoodLevel(false);
    } else if (lessonId === 2) {
      // If user clicks "Numbers" (ID 2), go to Numbers Sub-levels
      setIsInNumbersLevel(true);
      setIsInAlphabetLevel(false);
      setIsInGreetingsLevel(false);
      setIsInSocialLevel(false);
      setIsInDailyActivitiesLevel(false);
      setIsInFoodLevel(false);
    } else if (lessonId === 3) {
      // If user clicks "Greetings" (ID 3), go to Greetings Sub-levels
      setIsInGreetingsLevel(true);
      setIsInAlphabetLevel(false);
      setIsInNumbersLevel(false);
      setIsInSocialLevel(false);
      setIsInDailyActivitiesLevel(false);
      setIsInFoodLevel(false);
    } else if (lessonId === 4) {
      // If user clicks "Social" (ID 4), go to Social Sub-levels
      setIsInSocialLevel(true);
      setIsInAlphabetLevel(false);
      setIsInNumbersLevel(false);
      setIsInGreetingsLevel(false);
      setIsInDailyActivitiesLevel(false);
      setIsInFoodLevel(false);
    } else if (lessonId === 5) {
      // If user clicks "Daily Activities" (ID 5), go to Daily Activities Sub-levels
      setIsInDailyActivitiesLevel(true);
      setIsInAlphabetLevel(false);
      setIsInNumbersLevel(false);
      setIsInGreetingsLevel(false);
      setIsInSocialLevel(false);
      setIsInFoodLevel(false);
    } else if (lessonId === 6) {
      // If user clicks "Food" (ID 6), go to Food Sub-levels
      setIsInFoodLevel(true);
      setIsInAlphabetLevel(false);
      setIsInNumbersLevel(false);
      setIsInGreetingsLevel(false);
      setIsInSocialLevel(false);
      setIsInDailyActivitiesLevel(false);
    } else {
      // Otherwise start a regular lesson
      setCurrentLesson({ id: lessonId, title: lessonTitle });
    }
  };

  const handleBackFromLesson = () => {
    setCurrentLesson(null);
    // Note: We don't change sub-level state here, so we return to whatever view we came from
  };

  const handleBackToMap = () => {
    setIsInAlphabetLevel(false);
    setIsInNumbersLevel(false);
    setIsInGreetingsLevel(false);
    setIsInSocialLevel(false);
    setIsInDailyActivitiesLevel(false);
    setIsInFoodLevel(false);
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
          lessonId={currentLesson.id}
          lessonTitle={currentLesson.title}
          targetSign={currentLesson.title}
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
        if (isInNumbersLevel) {
          return <NumbersLevelsPage onStartLesson={handleStartLesson} onBack={handleBackToMap} />;
        }
        if (isInGreetingsLevel) {
          return <GreetingsLevelsPage onStartLesson={handleStartLesson} onBack={handleBackToMap} />;
        }
        if (isInSocialLevel) {
          return <SocialLevelsPage onStartLesson={handleStartLesson} onBack={handleBackToMap} />;
        }
        if (isInDailyActivitiesLevel) {
          return <DailyActivitiesLevelsPage onStartLesson={handleStartLesson} onBack={handleBackToMap} />;
        }
        if (isInFoodLevel) {
          return <FoodLevelsPage onStartLesson={handleStartLesson} onBack={handleBackToMap} />;
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
        setIsInNumbersLevel(false);
        setIsInGreetingsLevel(false);
        setIsInSocialLevel(false);
        setIsInDailyActivitiesLevel(false);
        setIsInFoodLevel(false);
        setCurrentLesson(null);
      }} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}
