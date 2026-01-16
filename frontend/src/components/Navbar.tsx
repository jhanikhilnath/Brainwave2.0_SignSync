import { Home, Map, Trophy, User, Flame } from 'lucide-react';

export type ActivePage = 'Home' | 'Learn' | 'Leaderboard' | 'Profile';

interface NavbarProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
}

export function Navbar({ activePage, onPageChange }: NavbarProps) {
  const navItems = [
    { name: 'Home' as ActivePage, icon: Home, label: 'Dash' },
    { name: 'Learn' as ActivePage, icon: Map, label: 'Journey' },
    { name: 'Leaderboard' as ActivePage, icon: Trophy, label: 'Ranks' },
    { name: 'Profile' as ActivePage, icon: User, label: 'Profile' },
  ];

  return (
    <nav className="w-full bg-background border-b-4 border-border px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo Area */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-primary flex items-center justify-center border-4 border-background shadow-pixel">
          <span className="text-xl">👾</span>
        </div>
        <div className="hidden md:flex flex-col">
          <h1 className="text-lg text-foreground font-bold tracking-tight leading-none font-pixel">
            ISL<span className="text-primary">QUEST</span>
          </h1>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-2 md:gap-4 bg-card px-2 py-1 border-4 border-border max-w-full overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activePage === item.name;
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => onPageChange(item.name)}
              className={`
                flex items-center gap-2 px-3 py-2 font-retro text-lg transition-all duration-100 whitespace-nowrap
                ${isActive
                  ? 'bg-primary text-primary-foreground font-bold shadow-pixel transform -translate-y-0.5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'}
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Stats / User Area */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-card border-4 border-border">
          <Flame className="w-4 h-4 text-primary fill-primary" />
          <span className="text-primary font-retro text-lg font-bold">12</span>
        </div>
        <div className="w-10 h-10 bg-gradient-to-tr from-secondary to-primary p-0.5">
          <div className="w-full h-full bg-background flex items-center justify-center text-xl">
            🧒
          </div>
        </div>
      </div>
    </nav>
  );
}
