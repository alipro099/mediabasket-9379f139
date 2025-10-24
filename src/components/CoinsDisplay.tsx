import { useEffect } from 'react';
import { Coins } from 'lucide-react';
import { useCoinsStore } from '@/stores/coinsStore';
import { cn } from '@/lib/utils';

interface CoinsDisplayProps {
  className?: string;
}

export const CoinsDisplay = ({ className }: CoinsDisplayProps) => {
  const { balance, isLoading, fetchBalance } = useCoinsStore();

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20",
      className
    )}>
      <Coins className="w-5 h-5 text-primary" />
      <span className="font-bold text-lg">
        {isLoading ? '...' : balance.toLocaleString()}
      </span>
    </div>
  );
};