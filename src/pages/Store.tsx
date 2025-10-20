import { ShoppingCart, Ticket, Gift, Zap, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WalletBadge } from '@/components/WalletBadge';
import { hapticFeedback } from '@/lib/telegram';
import { toast } from 'sonner';

const products = [
  {
    id: 1,
    title: 'Билет на матч',
    description: 'Промокод на скидку 20%',
    price: 1000,
    type: 'ticket',
    icon: Ticket,
  },
  {
    id: 2,
    title: 'Промокод на мерч',
    description: 'Скидка 500₽ на любой товар',
    price: 800,
    type: 'promo',
    icon: Gift,
  },
  {
    id: 3,
    title: 'Буст фэнтези',
    description: 'Удвоение очков на тур',
    price: 500,
    type: 'boost',
    icon: Zap,
  },
  {
    id: 4,
    title: 'VIP в знакомствах',
    description: 'Подсветка профиля на неделю',
    price: 600,
    type: 'dating_privilege',
    icon: Heart,
  },
];

const Store = () => {
  const handlePurchase = (product: typeof products[0]) => {
    hapticFeedback.success();
    toast.success(`Куплено: ${product.title}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 bg-card/95 backdrop-blur-lg border-b border-border p-4 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Магазин</h1>
          <WalletBadge />
        </div>
      </header>

      <div className="p-4 space-y-6">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-bold">Трать коины с пользой</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Покупай билеты, бусты и эксклюзивные привилегии
          </p>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <product.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{product.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-primary" />
                      <span className="font-bold text-lg text-primary">{product.price}</span>
                    </div>
                    <Button
                      onClick={() => handlePurchase(product)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Купить
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 bg-muted/30">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Твои покупки
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-card rounded-lg">
              <div className="flex items-center gap-3">
                <Ticket className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-semibold text-sm">Промокод на билет</div>
                  <div className="text-xs text-muted-foreground">BASKET2024</div>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Копировать
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Store;

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
