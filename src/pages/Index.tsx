import { useEffect } from 'react';
import { initTelegram } from '@/lib/telegram';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, MapPin } from 'lucide-react';
import seasonLogo from '@/assets/season-logo.jpg';

export default function Index() {
  useEffect(() => {
    initTelegram();
  }, []);

  const matches = [
    {
      id: 1,
      homeTeam: 'Команда A',
      awayTeam: 'Команда B',
      date: '25 Октября',
      time: '19:00',
      venue: 'Арена Север',
      status: 'Скоро'
    },
    {
      id: 2,
      homeTeam: 'Команда C',
      awayTeam: 'Команда D',
      date: '26 Октября',
      time: '20:00',
      venue: 'Арена Юг',
      status: 'Скоро'
    },
    {
      id: 3,
      homeTeam: 'Команда E',
      awayTeam: 'Команда F',
      date: '27 Октября',
      time: '18:30',
      venue: 'Центральная арена',
      status: 'Скоро'
    }
  ];

  return (
    <div className="min-h-screen pb-20 px-4">
      <header className="py-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Media Basket</h1>
          <p className="text-sm text-muted-foreground">Сезон 6 • Осень 2025</p>
        </div>
      </header>

      <div className="mb-8">
        <img 
          src={seasonLogo} 
          alt="2K25 Сезон 6" 
          className="w-full rounded-2xl shadow-xl"
        />
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Расписание игр</h2>
          <span className="text-sm text-primary font-medium">{matches.length} матча</span>
        </div>

        <div className="space-y-4">
          {matches.map((match) => (
            <Card key={match.id} className="p-4 bg-card/80 backdrop-blur border-border hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg">{match.homeTeam} vs {match.awayTeam}</h3>
                <span className="text-xs text-primary font-medium px-2 py-1 bg-primary/10 rounded-full">
                  {match.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{match.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{match.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{match.venue}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
