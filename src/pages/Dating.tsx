import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X, MapPin, User, ArrowLeft, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { hapticFeedback } from '@/lib/telegram';
import { useSpring, animated } from 'react-spring';

interface UserProfile {
  id: number;
  name: string;
  age: number;
  city: string;
  interests: string[];
  photo: string;
  telegram: string;
}

const mockProfiles: UserProfile[] = [
  {
    id: 1,
    name: 'Алексей',
    age: 25,
    city: 'Москва',
    interests: ['Баскетбол', 'NBA', 'Игры'],
    photo: '🏀',
    telegram: '@alexey_basket'
  },
  {
    id: 2,
    name: 'Мария',
    age: 23,
    city: 'Санкт-Петербург',
    interests: ['Баскетбол', 'Путешествия', 'Фотография'],
    photo: '🌟',
    telegram: '@maria_bball'
  },
  {
    id: 3,
    name: 'Дмитрий',
    age: 28,
    city: 'Казань',
    interests: ['NBA', 'Фэнтези-спорт', 'Музыка'],
    photo: '🎵',
    telegram: '@dima_nba'
  },
  {
    id: 4,
    name: 'Анна',
    age: 24,
    city: 'Екатеринбург',
    interests: ['Баскетбол', 'Кино', 'Кулинария'],
    photo: '🎬',
    telegram: '@anna_hoops'
  }
];

export default function Dating() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<string[]>([]);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const currentProfile = mockProfiles[currentIndex];

  const [props, api] = useSpring(() => ({
    x: 0,
    rotation: 0,
    config: { tension: 300, friction: 30 }
  }));

  const handleSwipe = (like: boolean) => {
    if (!currentProfile) return;

    hapticFeedback.light();
    setDirection(like ? 'right' : 'left');

    // Анимация свайпа
    api.start({
      x: like ? 400 : -400,
      rotation: like ? 20 : -20,
      config: { duration: 300 },
      onRest: () => {
        if (like) {
          // Симуляция взаимного лайка (50% шанс)
          const isMatch = Math.random() > 0.5;
          if (isMatch) {
            setMatches(prev => [...prev, currentProfile.telegram]);
            toast.success(`🎉 Взаимный лайк! ${currentProfile.telegram}`, {
              duration: 3000,
            });
            hapticFeedback.success();
          } else {
            toast('❤️ Лайк отправлен!', { duration: 1500 });
          }
        }

        // Следующая карточка
        if (currentIndex < mockProfiles.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          toast('Карточки закончились! 🎭', {
            description: 'Загрузим больше участников позже',
            duration: 2000,
          });
          setCurrentIndex(0);
        }

        // Сброс анимации
        api.set({ x: 0, rotation: 0 });
        setDirection(null);
      }
    });
  };

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Загрузка профилей...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-black"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-primary neon-text">ЗНАКОМСТВА</h1>
            <p className="text-xs text-muted-foreground">Найди друзей по интересам</p>
          </div>

          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full border-2 border-primary text-primary"
          >
            <Zap className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Matches Counter */}
      {matches.length > 0 && (
        <div className="absolute top-24 right-4 z-20">
          <Card className="p-3 bg-primary text-black border-0">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 fill-current" />
              <span className="font-bold">{matches.length}</span>
            </div>
          </Card>
        </div>
      )}

      {/* Карточки */}
      <div className="flex items-center justify-center min-h-screen p-4 pt-32 pb-32">
        <animated.div
          style={props as any}
          className="w-full max-w-md"
        >
          <Card className="relative overflow-hidden border-2 border-primary bg-card">
            {/* Фото/Эмодзи профиля */}
            <div className="h-96 bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center relative">
              <div className="text-9xl">{currentProfile.photo}</div>
              
              {/* Индикатор свайпа */}
              {direction === 'right' && (
                <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                  <Heart className="w-32 h-32 text-primary animate-pulse" />
                </div>
              )}
              {direction === 'left' && (
                <div className="absolute inset-0 bg-destructive/40 flex items-center justify-center">
                  <X className="w-32 h-32 text-destructive animate-pulse" />
                </div>
              )}
            </div>

            {/* Информация */}
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-3xl font-bold">
                  {currentProfile.name}, {currentProfile.age}
                </h2>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{currentProfile.city}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {currentProfile.interests.map((interest, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full border border-primary"
                  >
                    {interest}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="font-mono">{currentProfile.telegram}</span>
              </div>
            </div>
          </Card>
        </animated.div>
      </div>

      {/* Кнопки действий */}
      <div className="absolute bottom-8 left-0 right-0 z-20 px-4">
        <div className="max-w-md mx-auto flex justify-center gap-6">
          <Button 
            size="lg"
            variant="outline"
            className="w-20 h-20 rounded-full border-4 border-destructive text-destructive hover:bg-destructive hover:text-white"
            onClick={() => handleSwipe(false)}
          >
            <X className="w-8 h-8" />
          </Button>

          <Button 
            size="lg"
            className="w-24 h-24 rounded-full bg-primary hover:bg-primary/90 text-black border-4 border-primary shadow-[0_0_30px_rgba(34,197,94,0.5)]"
            onClick={() => handleSwipe(true)}
          >
            <Heart className="w-10 h-10 fill-current" />
          </Button>
        </div>
      </div>

      {/* Прогресс */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <p className="text-xs text-muted-foreground">
          {currentIndex + 1} / {mockProfiles.length}
        </p>
      </div>
    </div>
  );
}
