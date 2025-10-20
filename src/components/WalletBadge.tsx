import { Coins } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';

export const WalletBadge = () => {
  const wallet = useUserStore((state) => state.wallet);

  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-full",
      "bg-gradient-to-r from-primary/20 to-accent/20",
      "border border-primary/30",
      "shadow-lg shadow-primary/20"
    )}>
      <Coins className="w-5 h-5 text-primary animate-pulse" />
      <span className="font-bold text-foreground">
        {wallet?.balance?.toLocaleString() || 0}
      </span>
    </div>
  );
};
