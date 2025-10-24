import { Home, Gamepad2, Trophy, Users, MessageCircle, Heart, ListTodo } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { hapticFeedback } from '@/lib/telegram';

const tabs = [
  { icon: Home, label: 'Хаб', path: '/' },
  { icon: Gamepad2, label: 'Игра', path: '/game' },
  { icon: ListTodo, label: 'Задания', path: '/tasks' },
  { icon: Trophy, label: 'Фэнтези', path: '/fantasy' },
  { icon: Heart, label: 'Мэтч', path: '/dating' },
  { icon: MessageCircle, label: 'Чат', path: '/chat' },
];

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabClick = (path: string) => {
    hapticFeedback.light();
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => handleTabClick(path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all",
                "hover:bg-secondary/50 active:scale-95",
                isActive && "bg-primary/10"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
