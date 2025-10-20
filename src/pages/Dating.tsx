import { useState } from 'react';
import { Heart, X, MapPin, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WalletBadge } from '@/components/WalletBadge';
import { hapticFeedback } from '@/lib/telegram';
import { toast } from 'sonner';

const profiles = [
  {
    id: 1,
    name: 'Анна',
    age: 24,
    city: 'Москва',
    team: 'ЦСКА',
    photo: '👩',
  },
  {
    id: 2,
    name: 'Дмитрий',
    age: 27,
    city: 'Санкт-Петербург',
    team: 'Зенит',
    photo: '👨',
  },
  {
    id: 3,
    name: 'Екатерина',
    age: 23,
    city: 'Москва',
    team: 'Спартак',
    photo: '👩',
  },
];

const Dating = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProfile = profiles[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      hapticFeedback.success();
      toast.success('Лайк отправлен! 💚');
    } else {
      hapticFeedback.light();
    }

    setTimeout(() => {
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        toast.info('Пока больше нет профилей');
        setCurrentIndex(0);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 bg-card/95 backdrop-blur-lg border-b border-border p-4 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Знакомства</h1>
          <WalletBadge />
        </div>
      </header>

      <div className="p-4 space-y-6">
        {currentProfile ? (
          <Card className="relative overflow-hidden border-2 border-border">
            <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <div className="text-9xl">{currentProfile.photo}</div>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <h2 className="text-2xl font-bold">
                  {currentProfile.name}, {currentProfile.age}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{currentProfile.city}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>Любимая команда: {currentProfile.team}</span>
              </div>
            </div>

            <div className="flex gap-4 p-6 pt-0">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-2 hover:bg-destructive/10 hover:border-destructive"
                onClick={() => handleSwipe('left')}
              >
                <X className="w-6 h-6 text-destructive" />
              </Button>
              <Button
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={() => handleSwipe('right')}
              >
                <Heart className="w-6 h-6" />
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Нет доступных профилей</p>
          </Card>
        )}

        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Усиль свой профиль
          </h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-between">
              <span>Дополнительные свайпы</span>
              <span className="text-primary font-bold">200 коинов</span>
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <span>Подсветка профиля</span>
              <span className="text-primary font-bold">500 коинов</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dating;
