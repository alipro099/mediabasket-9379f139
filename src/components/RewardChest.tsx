import { useState } from 'react';
import { Gift, Coins, Ticket, ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { hapticFeedback } from '@/lib/telegram';

type RewardType = 'coins' | 'ticket' | 'merch';

interface Reward {
  type: RewardType;
  amount?: number;
  item?: string;
}

interface RewardChestProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed: (reward: Reward) => void;
}

export const RewardChest = ({ isOpen, onClose, onRewardClaimed }: RewardChestProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);

  const generateReward = (): Reward => {
    const random = Math.random();
    
    if (random < 0.7) {
      // 70% - коины
      const amount = Math.floor(Math.random() * 450) + 50; // 50-500
      return { type: 'coins', amount };
    } else if (random < 0.9) {
      // 20% - билет
      return { type: 'ticket', item: 'Билет на матч' };
    } else {
      // 10% - мерч
      const merchItems = ['Футболка', 'Кепка', 'Шарф', 'Браслет'];
      return { type: 'merch', item: merchItems[Math.floor(Math.random() * merchItems.length)] };
    }
  };

  const handleOpenChest = () => {
    setIsOpening(true);
    hapticFeedback.medium();

    setTimeout(() => {
      const newReward = generateReward();
      setReward(newReward);
      setIsOpening(false);
      onRewardClaimed(newReward);
      hapticFeedback.success();
    }, 1500);
  };

  const handleClose = () => {
    setReward(null);
    onClose();
  };

  const getRewardIcon = () => {
    if (!reward) return null;
    
    switch (reward.type) {
      case 'coins':
        return <Coins className="w-16 h-16 text-primary" />;
      case 'ticket':
        return <Ticket className="w-16 h-16 text-blue-500" />;
      case 'merch':
        return <ShoppingBag className="w-16 h-16 text-purple-500" />;
    }
  };

  const getRewardText = () => {
    if (!reward) return '';
    
    switch (reward.type) {
      case 'coins':
        return `${reward.amount} коинов`;
      case 'ticket':
        return reward.item;
      case 'merch':
        return reward.item;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {reward ? 'Поздравляем! 🎉' : 'Ваша награда'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-8">
          {!reward ? (
            <>
              <div
                className={cn(
                  "relative w-32 h-32 transition-transform duration-500",
                  isOpening && "animate-bounce scale-110"
                )}
              >
                <Gift className="w-32 h-32 text-primary" />
                {isOpening && (
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                )}
              </div>

              <Button
                onClick={handleOpenChest}
                disabled={isOpening}
                size="lg"
                className="w-full max-w-xs"
              >
                {isOpening ? 'Открываем...' : 'Открыть сундук'}
              </Button>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-500">
                {getRewardIcon()}
                <div className="text-center">
                  <p className="text-2xl font-bold">{getRewardText()}</p>
                  <p className="text-muted-foreground mt-2">
                    {reward.type === 'coins' && 'Добавлено на ваш баланс'}
                    {reward.type === 'ticket' && 'Доступен в разделе Дом'}
                    {reward.type === 'merch' && 'Доступен в магазине мерча'}
                  </p>
                </div>
              </div>

              <Button onClick={handleClose} size="lg" className="w-full max-w-xs">
                Отлично!
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};