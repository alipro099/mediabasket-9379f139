import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { hapticFeedback } from '@/lib/telegram';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
}

export default function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Первый бросок',
      description: 'Сделай первый бросок в игре',
      reward: 50,
      completed: false,
    },
    {
      id: '2',
      title: 'Точный снайпер',
      description: 'Попади 5 раз подряд',
      reward: 100,
      completed: false,
    },
    {
      id: '3',
      title: 'Мастер броска',
      description: 'Набери 100 очков',
      reward: 150,
      completed: false,
    },
    {
      id: '4',
      title: 'Подписка на канал',
      description: 'Подпишись на Telegram-канал Media Basket',
      reward: 200,
      completed: false,
    },
    {
      id: '5',
      title: 'Пригласи друга',
      description: 'Пригласи друга в игру',
      reward: 300,
      completed: false,
    },
  ]);

  const [totalCompleted, setTotalCompleted] = useState(0);

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.completed) return;

    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, completed: true } : t
    ));
    setTotalCompleted(prev => prev + task.reward);
    
    hapticFeedback.success();
    toast.success(`+${task.reward} очков!`, {
      description: task.title,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-background p-6 pb-24 relative overflow-hidden">
      {/* Фоновые эффекты */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]" />
      
      {/* Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/game')}
            className="rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-black"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <h1 className="text-3xl font-bold neon-text">ЗАДАНИЯ</h1>
          
          <div className="w-10" />
        </div>

        {/* Счётчик очков */}
        <Card className="p-4 bg-card/50 backdrop-blur border-2 border-primary/50">
          <div className="flex items-center justify-center gap-3">
            <Coins className="w-8 h-8 text-primary" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Всего заработано</p>
              <p className="text-3xl font-bold text-primary">{totalCompleted}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Список заданий */}
      <div className="relative z-10 space-y-4">
        {tasks.map((task) => (
          <Card 
            key={task.id}
            className={`p-5 transition-all ${
              task.completed 
                ? 'bg-card/30 backdrop-blur border-primary/30 opacity-70' 
                : 'bg-card/60 backdrop-blur border-primary/50 hover:border-primary'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {task.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {task.description}
                </p>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-primary" />
                  <span className="text-primary font-bold">+{task.reward}</span>
                </div>
              </div>

              <Button
                onClick={() => handleCompleteTask(task.id)}
                disabled={task.completed}
                size="lg"
                className={
                  task.completed
                    ? 'bg-primary/20 text-primary cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90 text-black'
                }
              >
                {task.completed ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Готово
                  </>
                ) : (
                  'Выполнить'
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
