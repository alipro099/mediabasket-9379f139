import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hapticFeedback } from '@/lib/telegram';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
}

export default function Tasks() {
  const navigate = useNavigate();
  const [completedTotal, setCompletedTotal] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Подпишись на телеграм канал',
      description: 'Подпишись на наш официальный канал',
      reward: 50,
      completed: false
    },
    {
      id: '2',
      title: 'Поделись приложением',
      description: 'Отправь мини-апп 3 друзьям',
      reward: 100,
      completed: false
    },
    {
      id: '3',
      title: 'Собери команду в фэнтези',
      description: 'Создай свою первую команду',
      reward: 150,
      completed: false
    },
    {
      id: '4',
      title: 'Посети игру',
      description: 'Приди на любую игру сезона',
      reward: 200,
      completed: false
    },
    {
      id: '5',
      title: 'Сделай 10 бросков',
      description: 'Забрось 10 мячей в кольцо',
      reward: 75,
      completed: false
    }
  ]);

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.completed) return;

    hapticFeedback.success();
    
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: true } : t
    ));
    
    setCompletedTotal(prev => prev + task.reward);
    toast.success(`+${task.reward} очков! 🎉`);
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="p-4 flex items-center justify-between bg-card/50 backdrop-blur sticky top-0 z-10">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-center flex-1">
          <h1 className="text-lg font-bold">Задания</h1>
          <p className="text-xs text-muted-foreground">Выполняй и получай очки</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Всего</p>
          <p className="text-lg font-bold text-primary">{completedTotal}</p>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-4">
        {tasks.map((task) => (
          <Card 
            key={task.id} 
            className={`p-4 transition-all ${
              task.completed 
                ? 'bg-primary/10 border-primary/20 opacity-60' 
                : 'bg-card/80 border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                task.completed 
                  ? 'border-primary bg-primary' 
                  : 'border-muted'
              }`}>
                {task.completed && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-bold mb-1">{task.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">+{task.reward}</span>
                  <Button
                    size="sm"
                    variant={task.completed ? "secondary" : "default"}
                    onClick={() => handleCompleteTask(task.id)}
                    disabled={task.completed}
                    className={task.completed ? "" : "bg-primary hover:bg-primary/90"}
                  >
                    {task.completed ? 'Выполнено' : 'Выполнить'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
