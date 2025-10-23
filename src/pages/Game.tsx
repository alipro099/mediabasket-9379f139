import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import { toast } from 'sonner';

export default function Game() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 80 });
  const [isAnimating, setIsAnimating] = useState(false);
  const ballRef = useRef<HTMLDivElement>(null);

  const handleShoot = () => {
    if (isAnimating) return;
    
    hapticFeedback.light();
    setIsAnimating(true);

    // Анимация броска
    const success = Math.random() > 0.4; // 60% шанс попадания
    
    if (success) {
      setScore(prev => prev + 1);
      hapticFeedback.success();
      toast.success('+1 очко! 🏀');
    } else {
      hapticFeedback.error();
    }

    // Сброс позиции мяча
    setTimeout(() => {
      setBallPosition({ x: 50, y: 80 });
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Заголовок */}
      <header className="p-4 flex items-center justify-between bg-card/50 backdrop-blur">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/tasks')}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-lg font-bold">Игра</h1>
          <p className="text-xs text-muted-foreground">Зарабатывай очки</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/tasks')}
          className="text-xs"
        >
          Задания
        </Button>
      </header>

      {/* Счетчик очков */}
      <div className="absolute top-24 left-4 z-10">
        <Card className="p-4 bg-card/80 backdrop-blur">
          <p className="text-xs text-muted-foreground mb-1">Очки</p>
          <p className="text-3xl font-bold text-primary">{score}</p>
        </Card>
      </div>

      {/* Игровое поле */}
      <div className="relative h-[calc(100vh-200px)] mt-4">
        {/* Кольцо */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10">
          <div className="relative">
            {/* Щит */}
            <div className="w-48 h-32 bg-destructive rounded-lg shadow-2xl" />
            {/* Кольцо */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
              <div className="w-24 h-24 border-4 border-muted rounded-full relative">
                {/* Сетка */}
                <div className="absolute inset-0 flex justify-around pt-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-px h-16 bg-muted/50" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Мяч */}
        <div 
          ref={ballRef}
          className={`absolute w-16 h-16 rounded-full bg-primary shadow-2xl cursor-pointer transition-all duration-1000 ${
            isAnimating ? 'translate-y-[-400px] scale-75' : ''
          }`}
          style={{
            left: `${ballPosition.x}%`,
            top: `${ballPosition.y}%`,
            transform: `translate(-50%, -50%) ${isAnimating ? 'translateY(-400px) scale(0.75)' : ''}`,
          }}
          onClick={handleShoot}
        >
          {/* Линии мяча */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-0.5 bg-background/30" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center rotate-90">
            <div className="w-full h-0.5 bg-background/30" />
          </div>
        </div>

        {/* Пол */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-secondary to-transparent">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-orange-900/20" />
        </div>

        {/* Инструкция */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <Card className="p-4 bg-card/80 backdrop-blur">
            <p className="text-sm">Свайпай мяч вверх для броска 🏀</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
