import { useState } from 'react';
import { Heart, X, Coins, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { hapticFeedback } from '@/lib/telegram';
import { animated, useSpring } from 'react-spring';
import { useSwipes } from '@/hooks/useSwipes';
import { CoinsDisplay } from '@/components/CoinsDisplay';

interface UserProfile {
  id: number;
  name: string;
  age: number;
  city: string;
  interests: string[];
  photo: string;
  telegram: string;
}

const profiles: UserProfile[] = [
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const { swipesAvailable, useSwipe, buySwipes, canBuySwipes } = useSwipes();

  const currentProfile = profiles[currentIndex];

  const cardSpring = useSpring({
    transform: direction === 'left' 
      ? 'translateX(-150%) rotate(-20deg)' 
      : direction === 'right' 
      ? 'translateX(150%) rotate(20deg)' 
      : 'translateX(0%) rotate(0deg)',
    opacity: direction ? 0 : 1,
    config: { duration: 300 }
  });

  const handleSwipe = async (liked: boolean) => {
    const success = await useSwipe();
    if (!success) return;

    setDirection(liked ? 'right' : 'left');
    hapticFeedback.medium();

    setTimeout(() => {
      if (liked) {
        const isMatch = Math.random() > 0.7;
        if (isMatch) {
          setMatches(prev => prev + 1);
          hapticFeedback.success();
          toast.success('Это мэтч! 🎉', {
            description: `${profiles[currentIndex].name} тоже лайкнул(а) тебя!`,
          });
        } else {
          toast('Лайк отправлен', {
            description: 'Ждем взаимности...',
          });
        }
      }
      
      setCurrentIndex(prev => prev + 1);
      setDirection(null);
    }, 300);
  };

  const handleBuySwipes = async () => {
    hapticFeedback.light();
    await buySwipes();
  };

  if (currentIndex >= profiles.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 pb-24">
        <Card className="p-6 sm:p-8 text-center max-w-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Профили закончились!</h2>
          <p className="text-muted-foreground mb-4">Возвращайтесь позже за новыми знакомствами</p>
          <Button onClick={() => setCurrentIndex(0)} className="bg-primary hover:bg-primary/90 text-black">
            Начать сначала
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 py-6 pb-24 relative overflow-hidden">
      {/* Фоновые эффекты */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1),transparent_50%)]" />

      <div className="relative z-10 max-w-md mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-4">
            <CoinsDisplay />
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Heart className="w-4 h-4 text-primary fill-current" />
              <span className="font-bold text-sm">Мэтчей: {matches}</span>
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold neon-text text-center mb-3">DATING</h1>
          
          {/* Swipes counter and buy button */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-card/50 rounded-full border border-primary/20">
              <span className="text-sm font-semibold">Свайпов: {swipesAvailable}</span>
            </div>
            {swipesAvailable < 5 && (
              <Button
                onClick={handleBuySwipes}
                disabled={!canBuySwipes}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-black"
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Купить (100 <Coins className="w-3 h-3 inline" />)
              </Button>
            )}
          </div>
        </div>

        {currentIndex < profiles.length ? (
          <animated.div style={cardSpring as any}>
            <Card className="relative overflow-hidden bg-card/50 backdrop-blur border-2 border-primary/30">
              {/* Фото */}
              <div className="relative h-[400px] sm:h-96 overflow-hidden">
                <img 
                  src={currentProfile.photo} 
                  alt={currentProfile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Информация */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                <div className="mb-3">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-1">
                    {currentProfile.name}, {currentProfile.age}
                  </h2>
                  <p className="text-xs sm:text-sm opacity-90 flex items-center gap-1">
                    📍 {currentProfile.city}
                  </p>
                  <p className="text-xs sm:text-sm opacity-90 mt-1">
                    ⚡️ {currentProfile.telegram}
                  </p>
                </div>

                {/* Интересы */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                  {currentProfile.interests.map((interest, idx) => (
                    <Badge 
                      key={idx}
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30 text-xs"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </animated.div>
        ) : (
          <Card className="p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Профили закончились!</h2>
            <p className="text-muted-foreground">Возвращайтесь позже за новыми знакомствами</p>
          </Card>
        )}

        {/* Кнопки действий */}
        <div className="flex justify-center gap-4 sm:gap-6 mt-4 sm:mt-6">
          <Button
            onClick={() => handleSwipe(false)}
            disabled={currentIndex >= profiles.length || swipesAvailable === 0}
            size="lg"
            className="rounded-full w-14 h-14 sm:w-16 sm:h-16 bg-card/50 hover:bg-red-500 border-2 border-red-500 text-red-500 hover:text-white disabled:opacity-50"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </Button>
          <Button
            onClick={() => handleSwipe(true)}
            disabled={currentIndex >= profiles.length || swipesAvailable === 0}
            size="lg"
            className="rounded-full w-14 h-14 sm:w-16 sm:h-16 bg-card/50 hover:bg-primary border-2 border-primary text-primary hover:text-black disabled:opacity-50"
          >
            <Heart className="w-6 h-6 sm:w-8 sm:h-8" />
          </Button>
        </div>

        {/* Индикатор прогресса */}
        <div className="mt-4 sm:mt-6 flex justify-center gap-1">
          {profiles.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all ${
                idx < currentIndex 
                  ? 'w-6 sm:w-8 bg-primary' 
                  : idx === currentIndex 
                  ? 'w-8 sm:w-12 bg-primary' 
                  : 'w-6 sm:w-8 bg-primary/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
