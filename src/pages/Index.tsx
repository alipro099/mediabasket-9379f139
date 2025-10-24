import { useState, useEffect } from 'react';
import { initTelegram } from '@/lib/telegram';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin, Youtube, Send, Instagram, ShoppingBag } from 'lucide-react';
import seasonLogo from '@/assets/season-logo.jpg';
import LoadingScreen from '@/components/LoadingScreen';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initTelegram();
  }, []);

  if (isLoading) {
    return <LoadingScreen onLoadComplete={() => setIsLoading(false)} />;
  }

  const matches = [
    { date: '24.10.2025', team1: 'Спартак', team2: 'Динамо', time: '19:00', venue: 'МСА Лужники' },
    { date: '25.10.2025', team1: 'ЦСКА', team2: 'Зенит', time: '20:00', venue: 'ВТБ Арена' },
    { date: '26.10.2025', team1: 'Локомотив', team2: 'Краснодар', time: '18:30', venue: 'РЖД Арена' },
  ];

  return (
    <div className="min-h-screen p-6 pb-24 relative overflow-hidden">
      {/* Фоновые эффекты */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.8))]" />

      {/* Контент */}
      <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
        {/* Логотип и название */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 blur-2xl opacity-40 bg-primary rounded-full" />
            <img 
              src={seasonLogo} 
              alt="Media Basket" 
              className="w-32 h-32 object-contain relative z-10 rounded-xl border-2 border-primary mx-auto"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold neon-text">MEDIA BASKET</h1>
            <p className="text-primary text-lg font-semibold">Сезон 6 • Осень 2025</p>
          </div>
        </div>

        {/* Медиа и мерч */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Медиа</h2>
          <div className="grid grid-cols-2 gap-3">
            <a 
              href="https://youtube.com/@mediabasket" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="p-4 bg-card/50 backdrop-blur border-primary/20 hover:border-primary hover:bg-primary/10 transition-all cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <Youtube className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">YouTube</span>
                </div>
              </Card>
            </a>
            
            <a 
              href="https://t.me/mediabasket" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="p-4 bg-card/50 backdrop-blur border-primary/20 hover:border-primary hover:bg-primary/10 transition-all cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <Send className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">Telegram</span>
                </div>
              </Card>
            </a>
            
            <a 
              href="https://instagram.com/mediabasket" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="p-4 bg-card/50 backdrop-blur border-primary/20 hover:border-primary hover:bg-primary/10 transition-all cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <Instagram className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">Instagram</span>
                </div>
              </Card>
            </a>
            
            <a 
              href="https://mediabasket.store" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="p-4 bg-card/50 backdrop-blur border-primary/20 hover:border-primary hover:bg-primary/10 transition-all cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <ShoppingBag className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">Мерч</span>
                </div>
              </Card>
            </a>
          </div>
        </div>

        {/* Расписание матчей */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Ближайшие матчи</h2>
          {matches.map((match, idx) => (
            <Card key={idx} className="p-4 bg-card/50 backdrop-blur border-primary/20 hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{match.date} • {match.time}</span>
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {match.team1} vs {match.team2}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{match.venue}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
