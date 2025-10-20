import { useEffect } from 'react';
import { Calendar, Video, Ticket, ShoppingBag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WalletBadge } from '@/components/WalletBadge';
import { initTelegram } from '@/lib/telegram';

const Index = () => {
  useEffect(() => {
    initTelegram();
  }, []);

  const matches = [
    {
      id: 1,
      home: 'ЦСКА',
      away: 'Спартак',
      date: '20 окт, 19:00',
      venue: 'ВТБ Арена',
    },
    {
      id: 2,
      home: 'Зенит',
      away: 'Локомотив',
      date: '21 окт, 18:30',
      venue: 'Газпром Арена',
    },
  ];

  const videos = [
    { id: 1, title: 'Лучшие моменты матча', views: '15К' },
    { id: 2, title: 'Интервью с капитаном', views: '8К' },
    { id: 3, title: 'Обзор тура', views: '22К' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 bg-card/95 backdrop-blur-lg border-b border-border p-4 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MDEIA BASKET
            </h1>
            <p className="text-xs text-muted-foreground">Лига Ставок</p>
          </div>
          <WalletBadge />
        </div>
      </header>

      <div className="p-4 space-y-6">
        <Card className="p-6 bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 text-9xl opacity-10">🏀</div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">Добро пожаловать!</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Следи за матчами, играй в фэнтези и зарабатывай коины
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Расписание
              </Button>
              <Button size="sm" variant="outline">
                О лиге
              </Button>
            </div>
          </div>
        </Card>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Ближайшие матчи
            </h2>
            <Button variant="ghost" size="sm">Все</Button>
          </div>
          <div className="space-y-3">
            {matches.map((match) => (
              <Card key={match.id} className="p-4 hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 text-center">
                    <div className="font-bold text-lg">{match.home}</div>
                  </div>
                  <div className="px-4">
                    <div className="text-2xl font-bold text-primary">VS</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="font-bold text-lg">{match.away}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{match.date}</span>
                  <span>{match.venue}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              Медиа
            </h2>
            <Button variant="ghost" size="sm">Все видео</Button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {videos.map((video) => (
              <Card key={video.id} className="p-4 hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Video className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{video.title}</h3>
                    <p className="text-xs text-muted-foreground">{video.views} просмотров</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <Ticket className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-bold mb-1">Билеты</h3>
            <p className="text-xs text-muted-foreground">На матчи</p>
          </Card>

          <Card className="p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <ShoppingBag className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-bold mb-1">Мерч</h3>
            <p className="text-xs text-muted-foreground">Официальный</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
