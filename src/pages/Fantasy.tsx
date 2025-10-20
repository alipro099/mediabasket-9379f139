import { Trophy, Users, TrendingUp, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WalletBadge } from '@/components/WalletBadge';

const Fantasy = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 bg-card/95 backdrop-blur-lg border-b border-border p-4 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Фэнтези</h1>
          <WalletBadge />
        </div>
      </header>

      <div className="p-4 space-y-6">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-bold">Моя команда</h2>
              <p className="text-sm text-muted-foreground">Собери лучший состав</p>
            </div>
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90">
            Создать команду
          </Button>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer">
            <Users className="w-6 h-6 text-accent mb-2" />
            <h3 className="font-semibold mb-1">Лиги</h3>
            <p className="text-xs text-muted-foreground">Соревнуйся с друзьями</p>
          </Card>

          <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer">
            <TrendingUp className="w-6 h-6 text-accent mb-2" />
            <h3 className="font-semibold mb-1">Рейтинг</h3>
            <p className="text-xs text-muted-foreground">Топ игроков</p>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-primary" />
            <h3 className="font-bold text-lg">Магазин бустов</h3>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Удвоение очков капитана', price: 500 },
              { name: 'Дополнительный трансфер', price: 300 },
              { name: 'Защита от травм', price: 400 },
            ].map((boost) => (
              <div key={boost.name} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <span className="text-sm">{boost.name}</span>
                <Button size="sm" variant="outline">
                  {boost.price} <Coins className="w-4 h-4 ml-1 text-primary" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Fantasy;

function Coins(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  );
}
