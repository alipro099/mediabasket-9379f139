import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X } from 'lucide-react';

export default function Dating() {
  return (
    <div className="min-h-screen pb-20 px-4 flex items-center justify-center">
      <Card className="p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Знакомства</h2>
        <p className="text-muted-foreground mb-6">
          Раздел в разработке. Скоро здесь можно будет находить друзей среди фанатов баскетбола!
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" size="lg" className="rounded-full w-14 h-14">
            <X className="w-6 h-6" />
          </Button>
          <Button variant="default" size="lg" className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90">
            <Heart className="w-6 h-6" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
