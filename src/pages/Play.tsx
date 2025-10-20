import { useState } from 'react';
import { Gamepad2, Trophy, Gift } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WalletBadge } from '@/components/WalletBadge';
import { hapticFeedback } from '@/lib/telegram';
import { toast } from 'sonner';

const Play = () => {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const startGame = () => {
    hapticFeedback.medium();
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(60);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    setIsPlaying(false);
    hapticFeedback.success();
    toast.success(`Игра окончена! Ваш счет: ${score}`);
  };

  const makeShot = () => {
    const hit = Math.random() > 0.3;
    if (hit) {
      setScore((prev) => prev + 2);
      hapticFeedback.success();
    } else {
      hapticFeedback.light();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 bg-card/95 backdrop-blur-lg border-b border-border p-4 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Игры</h1>
          <WalletBadge />
        </div>
      </header>

      <div className="p-4 space-y-6">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
          <div className="flex items-center gap-3 mb-4">
            <Gamepad2 className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-bold">Попади в кольцо</h2>
              <p className="text-sm text-muted-foreground">Забей максимум за 60 секунд!</p>
            </div>
          </div>

          {!isPlaying ? (
            <Button onClick={startGame} className="w-full bg-primary hover:bg-primary/90">
              Начать игру
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">{score}</div>
                  <div className="text-xs text-muted-foreground">Очки</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">{timeLeft}</div>
                  <div className="text-xs text-muted-foreground">Секунд</div>
                </div>
              </div>

              <div className="bg-secondary/50 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
                <Button
                  onClick={makeShot}
                  size="lg"
                  className="w-32 h-32 rounded-full bg-primary hover:bg-primary/90 text-2xl font-bold shadow-lg shadow-primary/50"
                >
                  🏀
                </Button>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="w-6 h-6 text-primary" />
            <h3 className="font-bold text-lg">Твои сундуки</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['Малый', 'Средний', 'Большой'].map((chest) => (
              <Button
                key={chest}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
              >
                <Trophy className="w-8 h-8 text-primary" />
                <span className="text-xs">{chest}</span>
              </Button>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-muted/30">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Таблица лидеров
          </h3>
          <div className="space-y-2">
            {[
              { name: 'Андрей М.', score: 156 },
              { name: 'Мария К.', score: 143 },
              { name: 'Дмитрий П.', score: 138 },
            ].map((player, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-card rounded">
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">#{i + 1}</span>
                  <span className="text-sm">{player.name}</span>
                </div>
                <span className="font-semibold">{player.score}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Play;
