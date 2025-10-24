import { useState } from 'react';
import { Heart, Coins, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { hapticFeedback } from '@/lib/telegram';
import { animated, useSpring } from 'react-spring';
import { useSwipes } from '@/hooks/useSwipes';
import { CoinsDisplay } from '@/components/CoinsDisplay';
import profile1 from '@/assets/profile-1.jpg';
import profile2 from '@/assets/profile-2.jpg';
import profile3 from '@/assets/profile-3.jpg';
import profile4 from '@/assets/profile-4.jpg';

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
    name: 'Анастасия',
    age: 27,
    city: 'Москва',
    interests: ['Баскетбол', 'Мода', 'Путешествия'],
    photo: profile1,
    telegram: '@anastasia_basketball'
  },
  {
    id: 2,
    name: 'Элина',
    age: 25,
    city: 'Москва',
    interests: ['NBA', 'Спорт', 'Музыка'],
    photo: profile2,
    telegram: '@elina_hoops'
  },
  {
    id: 3,
    name: 'Полина',
    age: 20,
    city: 'Москва',
    interests: ['Баскетбол', 'Кино', 'Стритбол'],
    photo: profile3,
    telegram: '@polina_sports'
  },
  {
    id: 4,
    name: 'Rish',
    age: 20,
    city: 'Москва',
    interests: ['Стритбол', 'Фотография', 'Спорт'],
    photo: profile4,
    telegram: '@rish_streetball'
  }
];

export default function Dating() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchMove, setTouchMove] = useState<{ x: number; y: number } | null>(null);
  const { swipesAvailable, useSwipe, buySwipes, canBuySwipes } = useSwipes();

  const currentProfile = profiles[currentIndex];

  const getDragTransform = () => {
    if (!touchStart || !touchMove) return { x: 0, rotate: 0 };
    const deltaX = touchMove.x - touchStart.x;
    const rotate = deltaX / 20;
    return { x: deltaX, rotate };
  };

  const drag = getDragTransform();

  const cardSpring = useSpring({
    transform: direction === 'left' 
      ? 'translateX(-150%) rotate(-20deg)' 
      : direction === 'right' 
      ? 'translateX(150%) rotate(20deg)' 
      : touchStart && touchMove
      ? `translateX(${drag.x}px) rotate(${drag.rotate}deg)`
      : 'translateX(0%) rotate(0deg)',
    opacity: direction ? 0 : 1,
    config: { duration: direction ? 300 : 0 }
  });

  const handleSwipe = async (liked: boolean) => {
    const success = await useSwipe();
    if (!success) return;

    setDirection(liked ? 'right' : 'left');
    hapticFeedback.medium();

    if (liked) {
      const isMatch = Math.random() > 0.7;
      if (isMatch) {
        setMatches(prev => prev + 1);
        hapticFeedback.success();
        toast.success('Это мэтч! 🎉', {
          description: `${currentProfile.name} тоже лайкнул(а) тебя!`,
        });
      } else {
        toast('Лайк отправлен', {
          description: 'Ждем взаимности...',
        });
      }
    }

    setTimeout(() => {
      setDirection(null);
      setCurrentIndex(prev => prev + 1);
    }, 300);
  };

  const handleBuySwipes = async () => {
    hapticFeedback.light();
    await buySwipes();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (swipesAvailable === 0) return;
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchMove({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || swipesAvailable === 0) return;
    const touch = e.touches[0];
    setTouchMove({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchMove || swipesAvailable === 0) {
      setTouchStart(null);
      setTouchMove(null);
      return;
    }

    const deltaX = touchMove.x - touchStart.x;
    const threshold = 100;

    if (Math.abs(deltaX) > threshold) {
      const liked = deltaX > 0;
      handleSwipe(liked);
    }

    setTouchStart(null);
    setTouchMove(null);
  };

  if (currentIndex >= profiles.length) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center px-4 sm:px-6">
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
    <div className="fixed inset-0 bg-background overflow-hidden flex flex-col">
      {/* Фоновые эффекты */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1),transparent_50%)]" />

      <div className="relative z-10 flex-1 flex flex-col px-4 sm:px-6 py-4 pb-20 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="mb-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <CoinsDisplay />
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Heart className="w-4 h-4 text-primary fill-current" />
              <span className="font-bold text-sm">Мэтчей: {matches}</span>
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold neon-text text-center mb-2">МЭТЧ</h1>
          
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

        {/* Profile Card - Flex grow to fill space */}
        <div className="flex-1 flex items-center justify-center mb-3">
          {currentIndex < profiles.length ? (
            <animated.div 
              key={currentIndex} 
              style={cardSpring as any} 
              className="w-full touch-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Card className="relative overflow-hidden bg-card/50 backdrop-blur border-2 border-primary/30">
                {/* Swipe indicators */}
                {touchStart && touchMove && (
                  <>
                    {drag.x > 50 && (
                      <div className="absolute top-8 right-8 z-10 bg-primary/90 text-black px-6 py-3 rounded-lg font-bold text-xl rotate-12 shadow-lg">
                        ЛАЙК
                      </div>
                    )}
                    {drag.x < -50 && (
                      <div className="absolute top-8 left-8 z-10 bg-red-500/90 text-white px-6 py-3 rounded-lg font-bold text-xl -rotate-12 shadow-lg">
                        НЕТ
                      </div>
                    )}
                  </>
                )}
                
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
          ) : null}
        </div>

        {/* Индикатор прогресса - Fixed at bottom */}
        <div className="flex-shrink-0">
          {/* Индикатор прогресса */}
          <div className="flex justify-center gap-1">
            {profiles.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
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
    </div>
  );
}
