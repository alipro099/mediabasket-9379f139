import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Coins } from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import { toast } from 'sonner';

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
  const [budget] = useState(1600);
  const [selectedPlayers, setSelectedPlayers] = useState<Record<string, Player | null>>({
    professional: null,
    mediaplayer: null,
    media: null
  });

  const availablePlayers: Player[] = [
    { id: '1', name: 'VUK', position: 'professional', team: 'AUF', price: 1000 },
    { id: '2', name: 'TY GLOVER', position: 'mediaplayer', team: 'BLATO', price: 900 },
    { id: '3', name: 'MOZZY', position: 'mediaplayer', team: 'ROCKET', price: 900 },
    { id: '4', name: 'RJRELOADED', position: 'mediaplayer', team: 'КАЧАЕТ РОССИЯ', price: 800 },
    { id: '5', name: 'PATRICK SANDER', position: 'media', team: 'AUF', price: 800 },
    { id: '6', name: 'SERGE', position: 'mediaplayer', team: 'AUF', price: 800 },
    { id: '7', name: 'ГАРИ', position: 'professional', team: 'GOATS', price: 800 },
  ];

  const spentBudget = Object.values(selectedPlayers).reduce(
    (sum, player) => sum + (player?.price || 0),
    0
  );
  const remainingBudget = budget - spentBudget;
  const selectedCount = Object.values(selectedPlayers).filter(Boolean).length;

  const handleSelectPlayer = (player: Player) => {
    hapticFeedback.light();

    if (selectedPlayers[player.position]?.id === player.id) {
      setSelectedPlayers(prev => ({
        ...prev,
        [player.position]: null
      }));
      toast.success('Игрок убран из команды');
      return;
    }

    if (player.price > remainingBudget) {
      toast.error('Недостаточно бюджета!');
      hapticFeedback.error();
      return;
    }

    setSelectedPlayers(prev => ({
      ...prev,
      [player.position]: player
    }));
    toast.success(`${player.name} добавлен в команду!`);
    hapticFeedback.success();
  };

  return (
    <div className="min-h-screen pb-20 px-4">
      <header className="py-6">
        <h1 className="text-2xl font-bold">Фэнтези</h1>
        <p className="text-sm text-muted-foreground">Собери свою команду</p>
      </header>

      {/* Бюджет */}
      <Card className="p-4 mb-6 bg-primary/10 border-primary/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Остаток бюджета</span>
          <span className="text-xs text-primary">из {budget}</span>
        </div>
        <div className="flex items-center gap-2">
          <Coins className="w-6 h-6 text-primary" />
          <span className="text-3xl font-bold text-primary">{remainingBudget}</span>
        </div>
        <div className="mt-2 text-right">
          <span className="text-xs text-primary font-medium">{selectedCount}/3 игроков</span>
        </div>
      </Card>

      {/* Твоя команда */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold">Твоя команда</h2>
        </div>

        <div className="space-y-3">
          {Object.entries(POSITION_LABELS).map(([position, label]) => (
            <div key={position} className="bg-card/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="font-medium">
                {selectedPlayers[position as keyof typeof selectedPlayers]?.name || 'Не выбран'}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Доступные игроки */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold">⭐ Доступные игроки</span>
        </div>

        <div className="space-y-3">
          {availablePlayers.map((player) => {
            const isSelected = selectedPlayers[player.position]?.id === player.id;
            
            return (
              <Card 
                key={player.id} 
                className={`p-4 transition-all ${
                  isSelected 
                    ? 'bg-primary/20 border-primary' 
                    : 'bg-card/80 border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{player.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{POSITION_LABELS[player.position]}</span>
                      <span>•</span>
                      <span>{player.team}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary px-2 py-1 bg-primary/10 rounded-full">
                      {player.price}
                    </span>
                    <Button
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => handleSelectPlayer(player)}
                      className={isSelected ? "bg-primary hover:bg-primary/90" : ""}
                    >
                      {isSelected ? 'Выбран' : 'Выбрать'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Правила */}
      <Card className="p-4 bg-card/50">
        <h3 className="font-bold mb-3">Правила фэнтези</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Бюджет: 1600 монет</li>
          <li>• Выбери 3 игроков: Профессионал, Медиаигрок, Медиа</li>
          <li>• Очки начисляются за реальные действия игроков</li>
          <li>• Победитель получает призы!</li>
        </ul>
      </Card>
    </div>
  );
}
