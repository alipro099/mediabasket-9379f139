import { CheckCircle2, Youtube, Instagram, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WalletBadge } from '@/components/WalletBadge';
import { hapticFeedback } from '@/lib/telegram';
import { toast } from 'sonner';

const tasks = [
  {
    id: 1,
    title: 'Подпишись на YouTube канал',
    icon: Youtube,
    reward: 100,
    type: 'follow',
    completed: false,
  },
  {
    id: 2,
    title: 'Подпишись в Instagram',
    icon: Instagram,
    reward: 100,
    type: 'follow',
    completed: false,
  },
  {
    id: 3,
    title: 'Посмотри трансляцию матча',
    icon: ExternalLink,
    reward: 200,
    type: 'watch_stream',
    completed: false,
  },
  {
    id: 4,
    title: 'Сделай заказ в Самокате',
    icon: ExternalLink,
    reward: 500,
    type: 'order',
    completed: false,
  },
];

const Tasks = () => {
  const handleTaskClick = (task: typeof tasks[0]) => {
    hapticFeedback.medium();
    toast.success(`Открыто задание: ${task.title}`);
  };

  const claimReward = (task: typeof tasks[0]) => {
    hapticFeedback.success();
    toast.success(`Получено ${task.reward} коинов!`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 bg-card/95 backdrop-blur-lg border-b border-border p-4 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Задания</h1>
          <WalletBadge />
        </div>
      </header>

      <div className="p-4 space-y-4">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
          <h2 className="text-lg font-bold mb-2">Выполняй задания</h2>
          <p className="text-sm text-muted-foreground">
            Зарабатывай коины за подписки и активности с партнёрами
          </p>
        </Card>

        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id} className="p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <task.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{task.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Coins className="w-4 h-4 text-primary" />
                    <span className="font-bold text-primary">+{task.reward}</span>
                  </div>
                </div>
                {task.completed ? (
                  <Button size="sm" variant="outline" disabled>
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Выполнено
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleTaskClick(task)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Выполнить
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 bg-muted/30">
          <h3 className="font-bold mb-3">История наград</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-card rounded-lg">
              <span className="text-sm">Подписка на Telegram</span>
              <span className="text-primary font-bold">+50</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-card rounded-lg">
              <span className="text-sm">Просмотр видео</span>
              <span className="text-primary font-bold">+100</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Tasks;

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
