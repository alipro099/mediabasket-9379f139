import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initTelegram } from '@/lib/telegram';
import { Button } from '@/components/ui/button';
import { Gamepad2, Users } from 'lucide-react';
import seasonLogo from '@/assets/season-logo.jpg';
import LoadingScreen from '@/components/LoadingScreen';

export default function Index() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initTelegram();
  }, []);

  if (isLoading) {
    return <LoadingScreen onLoadComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Фоновые эффекты */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.8))]" />

      {/* Контент */}
      <div className="relative z-10 text-center space-y-8 max-w-lg w-full">
        {/* Логотип */}
        <div className="relative">
          <div className="absolute inset-0 blur-3xl opacity-40 bg-primary rounded-full" />
          <img 
            src={seasonLogo} 
            alt="Media Basket" 
            className="w-48 h-48 object-contain mx-auto relative z-10 rounded-2xl shadow-2xl border-4 border-primary"
          />
        </div>

        {/* Название */}
        <div className="space-y-3">
          <h1 className="text-6xl font-bold neon-text tracking-tight">
            MEDIA BASKET
          </h1>
          <p className="text-primary text-2xl font-semibold tracking-wider">
            ЛИГА СТАВОК
          </p>
          <p className="text-muted-foreground text-lg">
            Сезон 6 • Осень 2025
          </p>
        </div>

        {/* Кнопки */}
        <div className="space-y-4 pt-8">
          <Button
            size="lg"
            onClick={() => navigate('/game')}
            className="w-full h-16 text-xl font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-black border-2 border-primary shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all hover:shadow-[0_0_50px_rgba(34,197,94,0.7)]"
          >
            <Gamepad2 className="w-8 h-8 mr-3" />
            ИГРАТЬ
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/dating')}
            className="w-full h-16 text-xl font-bold border-2 border-primary text-primary hover:bg-primary hover:text-black transition-all"
          >
            <Users className="w-8 h-8 mr-3" />
            ЗНАКОМСТВА
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-8 space-y-2">
          <p className="text-sm text-muted-foreground">
            Telegram Mini App
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>Powered by</span>
            <span className="text-primary font-semibold">ASIA-ST71</span>
          </div>
        </div>
      </div>
    </div>
  );
}
