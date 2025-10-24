import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { hapticFeedback } from '@/lib/telegram';
import { CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { CoinsDisplay } from '@/components/CoinsDisplay';

interface Player {
  id: string;
  name: string;
  position: 'professional' | 'mediaplayer' | 'media';
  team: string;
  price: number;
}

const POSITION_LABELS = {
  professional: 'Профессионал',
  mediaplayer: 'Медиаигрок',
  media: 'Медиа'
};

export default function Fantasy() {
  const [budget] = useState(1200);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  const availablePlayers: Player[] = [
    { id: '1', name: 'VUK', position: 'professional', team: 'AUF', price: 1000 },
    { id: '2', name: 'TY GLOVER', position: 'mediaplayer', team: 'BLATO', price: 900 },
    { id: '3', name: 'MOZZY', position: 'mediaplayer', team: 'ROCKET', price: 900 },
    { id: '4', name: 'RJRELOADED', position: 'mediaplayer', team: 'КАЧАЕТ РОССИЯ', price: 800 },
    { id: '5', name: 'PATRICK SANDER', position: 'media', team: 'AUF', price: 800 },
    { id: '6', name: 'SERGE', position: 'mediaplayer', team: 'AUF', price: 800 },
    { id: '7', name: 'ГАРИ', position: 'professional', team: 'GOATS', price: 800 },
    { id: '8', name: 'АЛЕКС', position: 'media', team: 'FLAVA', price: 400 },
    { id: '9', name: 'ДИМА', position: 'media', team: 'БК 10', price: 300 },
    { id: '10', name: 'МАКСИМ', position: 'professional', team: 'HOOPS', price: 200 },
    { id: '11', name: 'ИВАН', position: 'mediaplayer', team: 'Favela Basket', price: 100 },
  ];

  const spentBudget = selectedPlayers.reduce(
    (sum, player) => sum + (player?.price || 0),
    0
  );
  const remainingBudget = budget - spentBudget;
  const selectedCount = selectedPlayers.length;
  const MAX_PLAYERS = 3;

  const handleSelectPlayer = (player: Player) => {
    hapticFeedback.light();

    const isSelected = selectedPlayers.some(p => p.id === player.id);
    
    if (isSelected) {
      setSelectedPlayers(prev => prev.filter(p => p.id !== player.id));
      toast.success('Игрок убран из команды');
      return;
    }

    if (selectedCount >= MAX_PLAYERS) {
      toast.error(`Максимум ${MAX_PLAYERS} игрока в команде!`);
      hapticFeedback.error();
      return;
    }

    if (player.price > remainingBudget) {
      toast.error('Недостаточно бюджета!');
      hapticFeedback.error();
      return;
    }

    setSelectedPlayers(prev => [...prev, player]);
    toast.success(`${player.name} добавлен в команду!`);
    hapticFeedback.success();
  };

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 py-6 pb-24 relative overflow-hidden">
      {/* Фоновые эффекты */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex justify-end mb-4">
            <CoinsDisplay />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold neon-text text-center mb-4">ФЭНТЕЗИ</h1>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Card className="p-2 sm:p-3 bg-card/50 backdrop-blur border-primary/20">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Бюджет</p>
                <p className="text-base sm:text-lg font-bold text-primary">${budget}</p>
              </div>
            </Card>
            <Card className="p-2 sm:p-3 bg-card/50 backdrop-blur border-primary/20">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Потрачено</p>
                <p className="text-base sm:text-lg font-bold text-red-500">${spentBudget}</p>
              </div>
            </Card>
            <Card className="p-2 sm:p-3 bg-card/50 backdrop-blur border-primary/20">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Осталось</p>
                <p className="text-base sm:text-lg font-bold text-green-500">${remainingBudget}</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Моя команда */}
        <Card className="p-3 sm:p-4 bg-card/50 backdrop-blur border-primary/20 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-bold">Моя команда ({selectedCount}/{MAX_PLAYERS})</h2>
          </div>
          
          {selectedPlayers.length > 0 ? (
            <div className="space-y-2">
              {selectedPlayers.map((player) => (
                <div key={player.id} className="flex justify-between items-center p-2 sm:p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div>
                    <p className="font-semibold text-sm sm:text-base">{player.name}</p>
                    <p className="text-xs text-muted-foreground">{POSITION_LABELS[player.position]} • {player.team}</p>
                  </div>
                  <p className="text-primary font-bold text-sm sm:text-base">${player.price}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4 text-sm">Выбери игроков для своей команды</p>
          )}
        </Card>

        {/* Доступные игроки */}
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-bold">Доступные игроки</h2>
          </div>
          
          {availablePlayers.map((player) => {
            const isSelected = selectedPlayers.some(p => p.id === player.id);
            
            return (
              <Card 
                key={player.id}
                className={`p-3 sm:p-4 transition-all ${
                  isSelected 
                    ? 'bg-primary/20 border-primary' 
                    : 'bg-card/50 backdrop-blur border-primary/20 hover:border-primary'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1 w-full">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-base sm:text-lg font-bold">{player.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {POSITION_LABELS[player.position]}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{player.team}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-primary font-bold text-sm sm:text-base">${player.price}</span>
                    <Button
                      onClick={() => handleSelectPlayer(player)}
                      size="sm"
                      className={
                        isSelected
                          ? 'bg-primary/20 text-primary cursor-default'
                          : 'bg-primary hover:bg-primary/90 text-black'
                      }
                    >
                      {isSelected && <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
                      {isSelected ? 'Выбран' : 'Выбрать'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Правила */}
        <Card className="p-3 sm:p-4 bg-card/50 backdrop-blur border-primary/20">
          <h3 className="font-bold mb-2 sm:mb-3 text-sm sm:text-base">Правила фэнтези</h3>
          <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
            <li>• Бюджет: 1200 монет</li>
            <li>• Выбери 3 игроков для своей команды</li>
            <li>• Очки начисляются за реальные действия игроков</li>
            <li>• Победитель получает призы!</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
