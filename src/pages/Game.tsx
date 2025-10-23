import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { hapticFeedback } from '@/lib/telegram';
import basketballBall from '@/assets/basketball-ball.png';
import mediaBasketLogo from '@/assets/media-basket-logo.jpg';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  isFlying: boolean;
}

export default function Game() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [ball, setBall] = useState<Ball>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    rotation: 0,
    isFlying: false,
  });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [trajectory, setTrajectory] = useState<{ x: number; y: number }[]>([]);
  const animationFrameRef = useRef<number>();
  const ballImageRef = useRef<HTMLImageElement>();
  const logoImageRef = useRef<HTMLImageElement>();

  // Константы игры
  const BALL_RADIUS = 30;
  const HOOP_X = 0.5; // Центр экрана (относительно canvas width)
  const HOOP_Y = 0.25; // Верхняя четверть экрана
  const HOOP_WIDTH = 80;
  const HOOP_HEIGHT = 10;
  const GRAVITY = 0.5;
  const BACKBOARD_WIDTH = 120;
  const BACKBOARD_HEIGHT = 90;

  // Загрузка изображений
  useEffect(() => {
    const ballImg = new Image();
    ballImg.src = basketballBall;
    ballImageRef.current = ballImg;

    const logoImg = new Image();
    logoImg.src = mediaBasketLogo;
    logoImageRef.current = logoImg;
  }, []);

  // Игровой цикл
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Установка размеров canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Рисуем фон
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0a0a');
      gradient.addColorStop(1, '#1a1a1a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Рисуем разметку площадки
      drawCourt(ctx, canvas.width, canvas.height);

      // Рисуем кольцо и щит
      drawHoop(ctx, canvas.width, canvas.height);

      // Обновляем физику мяча
      if (ball.isFlying) {
        const newBall = { ...ball };
        newBall.vy += GRAVITY;
        newBall.x += newBall.vx;
        newBall.y += newBall.vy;
        newBall.rotation += newBall.vx * 0.05;

        // Проверка попадания в кольцо
        const hoopX = canvas.width * HOOP_X;
        const hoopY = canvas.height * HOOP_Y;
        
        if (
          Math.abs(newBall.x - hoopX) < HOOP_WIDTH / 2 &&
          newBall.y > hoopY - BALL_RADIUS &&
          newBall.y < hoopY + BALL_RADIUS &&
          newBall.vy > 0
        ) {
          handleScore(true);
          newBall.isFlying = false;
          newBall.x = canvas.width / 2;
          newBall.y = canvas.height - 150;
          newBall.vx = 0;
          newBall.vy = 0;
          newBall.rotation = 0;
        }

        // Проверка выхода за границы
        if (newBall.y > canvas.height + BALL_RADIUS) {
          handleScore(false);
          newBall.isFlying = false;
          newBall.x = canvas.width / 2;
          newBall.y = canvas.height - 150;
          newBall.vx = 0;
          newBall.vy = 0;
          newBall.rotation = 0;
        }

        setBall(newBall);
      }

      // Рисуем траекторию
      if (trajectory.length > 0 && !ball.isFlying) {
        drawTrajectory(ctx, trajectory);
      }

      // Рисуем мяч
      drawBall(ctx, ball.x || canvas.width / 2, ball.y || canvas.height - 150, ball.rotation);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [ball, trajectory]);

  const drawCourt = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Центральная линия
    ctx.strokeStyle = '#22c55e40';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Трехочковая дуга (декоративная)
    ctx.strokeStyle = '#22c55e30';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(width * HOOP_X, height * HOOP_Y + 50, 200, 0, Math.PI);
    ctx.stroke();
  };

  const drawHoop = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const hoopX = width * HOOP_X;
    const hoopY = height * HOOP_Y;

    // Щит с логотипом
    ctx.save();
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 20;
    
    // Фон щита
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(
      hoopX - BACKBOARD_WIDTH / 2,
      hoopY - BACKBOARD_HEIGHT - 20,
      BACKBOARD_WIDTH,
      BACKBOARD_HEIGHT
    );

    // Логотип на щите
    if (logoImageRef.current && logoImageRef.current.complete) {
      ctx.drawImage(
        logoImageRef.current,
        hoopX - 50,
        hoopY - BACKBOARD_HEIGHT - 10,
        100,
        70
      );
    }

    ctx.restore();

    // Крепление
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(hoopX, hoopY - 20);
    ctx.lineTo(hoopX, hoopY);
    ctx.stroke();

    // Кольцо
    ctx.save();
    ctx.shadowColor = '#ff6600';
    ctx.shadowBlur = 15;
    ctx.strokeStyle = '#ff6600';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(hoopX, hoopY, HOOP_WIDTH / 2, HOOP_HEIGHT, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Сетка
    ctx.strokeStyle = '#ffffff80';
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const x1 = hoopX + Math.cos(angle) * (HOOP_WIDTH / 2);
      const y1 = hoopY + Math.sin(angle) * HOOP_HEIGHT;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1, y1 + 30);
      ctx.stroke();
    }
  };

  const drawBall = (ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Тень мяча
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;

    if (ballImageRef.current && ballImageRef.current.complete) {
      ctx.drawImage(
        ballImageRef.current,
        -BALL_RADIUS,
        -BALL_RADIUS,
        BALL_RADIUS * 2,
        BALL_RADIUS * 2
      );
    } else {
      // Запасной вариант
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(0, 0, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  const drawTrajectory = (ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) => {
    ctx.strokeStyle = '#22c55e60';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    points.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const handleScore = (success: boolean) => {
    setAttempts(prev => prev + 1);
    
    if (success) {
      setScore(prev => prev + 3);
      hapticFeedback.success();
      toast.success('🔥 ТРИ ОЧКА!', {
        duration: 1500,
      });
    } else {
      hapticFeedback.error();
      toast.error('💥 Мимо!', {
        duration: 1000,
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (ball.isFlying) return;
    
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const ballX = ball.x || canvas.width / 2;
    const ballY = ball.y || canvas.height - 150;

    // Проверяем, что тап был по мячу
    const distance = Math.sqrt((x - ballX) ** 2 + (y - ballY) ** 2);
    if (distance < BALL_RADIUS * 2) {
      setDragStart({ x, y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStart || ball.isFlying) return;
    
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const dx = dragStart.x - x;
    const dy = dragStart.y - y;

    // Вычисляем траекторию
    const points = [];
    const startX = ball.x || canvas.width / 2;
    const startY = ball.y || canvas.height - 150;
    let px = startX;
    let py = startY;
    let vx = dx * 0.15;
    let vy = dy * 0.15;

    for (let i = 0; i < 30; i++) {
      points.push({ x: px, y: py });
      vy += GRAVITY;
      px += vx;
      py += vy;
      if (py > canvas.height) break;
    }

    setTrajectory(points);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!dragStart || ball.isFlying) return;
    
    const touch = e.changedTouches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const dx = dragStart.x - x;
    const dy = dragStart.y - y;

    // Запускаем мяч
    setBall({
      x: ball.x || canvas.width / 2,
      y: ball.y || canvas.height - 150,
      vx: dx * 0.15,
      vy: dy * 0.15,
      rotation: 0,
      isFlying: true,
    });

    setDragStart(null);
    setTrajectory([]);
    hapticFeedback.medium();
  };

  const accuracy = attempts > 0 ? Math.round((score / (attempts * 3)) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Header с кнопкой заданий */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent pointer-events-none">
        <div className="flex items-center justify-between pointer-events-auto">
          <Card className="px-4 py-2 bg-black/70 backdrop-blur border-primary/30">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Очки</p>
                <p className="text-xl font-bold text-primary">{score}</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-xs text-muted-foreground">Точность</p>
                <p className="text-xl font-bold text-primary">{accuracy}%</p>
              </div>
            </div>
          </Card>

          <Button 
            size="lg"
            onClick={() => navigate('/tasks')}
            className="bg-primary/90 hover:bg-primary text-black font-bold shadow-[0_0_20px_rgba(34,197,94,0.5)]"
          >
            <ClipboardList className="w-5 h-5 mr-2" />
            Задания
          </Button>
        </div>
      </div>

      {/* Canvas игры */}
      <canvas
        ref={canvasRef}
        className="w-full h-full touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Инструкция внизу */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <Card className="px-6 py-3 bg-black/80 backdrop-blur border-2 border-primary/50">
          <p className="text-sm text-center text-foreground font-medium">
            🏀 <span className="text-primary font-bold">Потяни и отпусти</span> мяч для броска!
          </p>
        </Card>
      </div>
    </div>
  );
}
