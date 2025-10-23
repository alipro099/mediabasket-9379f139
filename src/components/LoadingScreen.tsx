import { useEffect, useState } from 'react';
import seasonLogo from '@/assets/season-logo.jpg';

export default function LoadingScreen({ onLoadComplete }: { onLoadComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onLoadComplete(), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="text-center space-y-8 px-4">
        {/* Логотип */}
        <div className="relative">
          <div className="absolute inset-0 blur-3xl opacity-50 bg-primary rounded-full" />
          <img 
            src={seasonLogo} 
            alt="Media Basket" 
            className="w-64 h-64 object-contain mx-auto relative z-10 animate-pulse"
          />
        </div>

        {/* Название */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold neon-text tracking-tight">
            MEDIA BASKET
          </h1>
          <p className="text-primary text-xl font-semibold tracking-wider">
            ЛИГА СТАВОК
          </p>
        </div>

        {/* Прогресс бар */}
        <div className="max-w-xs mx-auto space-y-2">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-muted-foreground text-sm">Загрузка {progress}%</p>
        </div>
      </div>
    </div>
  );
}
