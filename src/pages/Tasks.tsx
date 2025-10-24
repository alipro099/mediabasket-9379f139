import { useState } from 'react';
import { ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { hapticFeedback } from '@/lib/telegram';
import { CoinsDisplay } from '@/components/CoinsDisplay';
import { RewardChest } from '@/components/RewardChest';
import { useCoinsStore } from '@/stores/coinsStore';
import { TASKS, Task } from '@/constants/tasks';
import { generateReward } from '@/lib/rewards';

interface TaskState extends Task {
  completed: boolean;
  pending?: boolean;
}

export default function Tasks() {
  const navigate = useNavigate();
  const { addCoins } = useCoinsStore();
  const [tasks, setTasks] = useState<TaskState[]>(
    TASKS.map(task => ({ ...task, completed: false, pending: false }))
  );
  const [chestOpen, setChestOpen] = useState(false);
  const [currentReward, setCurrentReward] = useState<ReturnType<typeof generateReward> | null>(null);

  const handleTaskClick = (task: TaskState) => {
    if (task.completed) return;

    // For tasks with links, open the link and mark as pending
    if (task.link) {
      window.open(task.link, '_blank');
      setTasks(tasks.map(t =>
        t.id === task.id ? { ...t, pending: true } : t
      ));
      hapticFeedback.light();
      toast.info('Вернитесь после выполнения', {
        description: 'Нажмите "Подтвердить" когда выполните задание',
      });
    } else {
      // For game tasks, just complete directly
      completeTask(task);
    }
  };

  const completeTask = (task: TaskState) => {
    const reward = generateReward(task.reward);
    setCurrentReward(reward);
    
    setTasks(tasks.map(t =>
      t.id === task.id ? { ...t, completed: true, pending: false } : t
    ));
    
    setChestOpen(true);
    hapticFeedback.success();
  };

  const handleRewardClaimed = async () => {
    if (currentReward?.type === 'coins' && currentReward.amount) {
      await addCoins(currentReward.amount, 'task_completion');
    }
    setChestOpen(false);
    setCurrentReward(null);
  };

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 py-6 pb-24 relative overflow-hidden">
      {/* Фоновые эффекты */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]" />
      
      {/* Header */}
      <div className="relative z-10 mb-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/game')}
            className="rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-black"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <h1 className="text-2xl sm:text-3xl font-bold neon-text">ЗАДАНИЯ</h1>
          
          <CoinsDisplay className="hidden sm:flex" />
          <div className="w-10 sm:hidden" />
        </div>

        {/* Мобильный счетчик коинов */}
        <div className="sm:hidden mb-4">
          <CoinsDisplay className="w-full justify-center" />
        </div>
      </div>

      {/* Список заданий */}
      <div className="relative z-10 space-y-3 sm:space-y-4 max-w-2xl mx-auto">
        {tasks.map((task) => (
          <Card 
            key={task.id}
            className={`p-4 sm:p-5 transition-all ${
              task.completed 
                ? 'bg-card/30 backdrop-blur border-primary/30 opacity-70' 
                : 'bg-card/60 backdrop-blur border-primary/50 hover:border-primary'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1 w-full">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    {task.title}
                  </h3>
                  {task.type === 'partner' && (
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-semibold whitespace-nowrap">
                      Партнёр
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {task.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Награда:</span>
                  <span className="text-primary font-bold">{task.reward} коинов</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-auto">
                {task.pending && !task.completed && (
                  <Button
                    onClick={() => completeTask(task)}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-black w-full sm:w-auto"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Подтвердить
                  </Button>
                )}
                
                {!task.pending && !task.completed && (
                  <Button
                    onClick={() => handleTaskClick(task)}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-black w-full sm:w-auto"
                  >
                    {task.link && <ExternalLink className="w-4 h-4 mr-2" />}
                    {task.link ? 'Перейти' : 'Выполнить'}
                  </Button>
                )}

                {task.completed && (
                  <Button
                    disabled
                    size="lg"
                    className="bg-primary/20 text-primary cursor-not-allowed w-full sm:w-auto"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Готово
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Reward Chest */}
      <RewardChest 
        isOpen={chestOpen}
        onClose={() => setChestOpen(false)}
        onRewardClaimed={handleRewardClaimed}
      />
    </div>
  );
}
