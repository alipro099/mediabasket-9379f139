import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { hapticFeedback } from '@/lib/telegram';

export default function Game() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  
  const ballRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 35,
    isDragging: false,
    isFlying: false
  });
  
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const animationFrameRef = useRef<number>();

  const BALL_RADIUS = 40;
  const HOOP_X = 0.5;
  const HOOP_Y = 200;
  const HOOP_WIDTH = 120;
  const HOOP_HEIGHT = 18;
  const BACKBOARD_WIDTH = 160;
  const BACKBOARD_HEIGHT = 110;
  const GRAVITY = 0.5;


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      if (!ballRef.current.isFlying) {
        ballRef.current.x = canvas.width / 2;
        ballRef.current.y = canvas.height - 100;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#0a1f0a');
      bgGradient.addColorStop(1, '#000000');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawHoop(ctx, canvas.width);

      if (ballRef.current.isFlying) {
        ballRef.current.vy += GRAVITY;
        ballRef.current.x += ballRef.current.vx;
        ballRef.current.y += ballRef.current.vy;

        const hoopCenterX = canvas.width * HOOP_X;
        const hoopLeft = hoopCenterX - HOOP_WIDTH / 2;
        const hoopRight = hoopCenterX + HOOP_WIDTH / 2;

        if (
          ballRef.current.y >= HOOP_Y - 10 &&
          ballRef.current.y <= HOOP_Y + 40 &&
          ballRef.current.x > hoopLeft + 10 &&
          ballRef.current.x < hoopRight - 10 &&
          ballRef.current.vy > 0
        ) {
          handleScore(true);
          resetBall();
        }

        if (ballRef.current.y > canvas.height + 100) {
          handleScore(false);
          resetBall();
        }
      }

      drawBall(ctx);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const resetBall = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    ballRef.current.x = canvas.width / 2;
    ballRef.current.y = canvas.height - 100;
    ballRef.current.vx = 0;
    ballRef.current.vy = 0;
    ballRef.current.isFlying = false;
    ballRef.current.isDragging = false;
  };


  const drawHoop = (ctx: CanvasRenderingContext2D, width: number) => {
    const hoopX = width * HOOP_X;

    // Backboard
    ctx.save();
    const bgGrad = ctx.createLinearGradient(
      hoopX - BACKBOARD_WIDTH / 2, HOOP_Y - BACKBOARD_HEIGHT - 20,
      hoopX + BACKBOARD_WIDTH / 2, HOOP_Y - 20
    );
    bgGrad.addColorStop(0, '#4A9FD8');
    bgGrad.addColorStop(0.5, '#5AB4E8');
    bgGrad.addColorStop(1, '#4A9FD8');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(
      hoopX - BACKBOARD_WIDTH / 2,
      HOOP_Y - BACKBOARD_HEIGHT - 20,
      BACKBOARD_WIDTH,
      BACKBOARD_HEIGHT
    );

    // Orange border
    ctx.strokeStyle = '#FF6B35';
    ctx.lineWidth = 8;
    ctx.strokeRect(
      hoopX - BACKBOARD_WIDTH / 2,
      HOOP_Y - BACKBOARD_HEIGHT - 20,
      BACKBOARD_WIDTH,
      BACKBOARD_HEIGHT
    );
    ctx.restore();

    // Yellow hoop rectangle
    ctx.save();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.roundRect(
      hoopX - HOOP_WIDTH / 2 + 10,
      HOOP_Y - 40,
      HOOP_WIDTH - 20,
      50,
      8
    );
    ctx.stroke();
    ctx.restore();

    // Orange hoop base
    ctx.save();
    ctx.fillStyle = '#FF6B35';
    ctx.fillRect(
      hoopX - HOOP_WIDTH / 2,
      HOOP_Y,
      HOOP_WIDTH,
      HOOP_HEIGHT
    );
    ctx.restore();

    // White net
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 12; i++) {
      const x = hoopX - HOOP_WIDTH / 2 + (i / 11) * HOOP_WIDTH;
      ctx.beginPath();
      ctx.moveTo(x, HOOP_Y + HOOP_HEIGHT);
      ctx.lineTo(x + Math.sin(i) * 5, HOOP_Y + HOOP_HEIGHT + 60);
      ctx.stroke();
    }
  };

  const drawBall = (ctx: CanvasRenderingContext2D) => {
    const ball = ballRef.current;
    ctx.save();

    // Shadow
    if (!ball.isFlying) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 15;
    }

    // Orange basketball
    const grad = ctx.createRadialGradient(
      ball.x - 12, ball.y - 12, 5,
      ball.x, ball.y, ball.radius
    );
    grad.addColorStop(0, '#FF8C42');
    grad.addColorStop(1, '#D2691E');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Basketball lines
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    
    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(ball.x - ball.radius + 5, ball.y);
    ctx.lineTo(ball.x + ball.radius - 5, ball.y);
    ctx.stroke();
    
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y - ball.radius + 5);
    ctx.lineTo(ball.x, ball.y + ball.radius - 5);
    ctx.stroke();
    
    // Curved lines
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius * 0.6, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius * 0.6, Math.PI / 2, -Math.PI / 2);
    ctx.stroke();

    ctx.restore();
  };

  const handleScore = (success: boolean) => {
    if (success) {
      const newScore = score + 2;
      const newCombo = combo + 1;
      setScore(newScore);
      setCombo(newCombo);
      hapticFeedback.success();
      
      toast.success(newCombo > 1 ? `🔥 ${newCombo}x КОМБО! +2` : '🏀 +2', {
        duration: 1200,
      });
    } else {
      setCombo(0);
      hapticFeedback.error();
      toast.error('Мимо', { duration: 800 });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (ballRef.current.isFlying) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const dx = x - ballRef.current.x;
    const dy = y - ballRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < ballRef.current.radius + 30) {
      touchStartRef.current = { x, y, time: Date.now() };
      ballRef.current.isDragging = true;
      hapticFeedback.light();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!ballRef.current.isDragging || !touchStartRef.current) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!ballRef.current.isDragging || !touchStartRef.current) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.changedTouches[0];
    const endX = touch.clientX - rect.left;
    const endY = touch.clientY - rect.top;

    const dx = endX - touchStartRef.current.x;
    const dy = endY - touchStartRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const time = (Date.now() - touchStartRef.current.time) / 1000;

    if (dist > 20 && time > 0) {
      const power = Math.min(dist / time / 50, 25);
      ballRef.current.vx = (dx / dist) * power;
      ballRef.current.vy = (dy / dist) * power;
      ballRef.current.isFlying = true;
      hapticFeedback.medium();
    }

    ballRef.current.isDragging = false;
    touchStartRef.current = null;
  };

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-3 bg-gradient-to-b from-black/95 via-black/70 to-transparent pointer-events-none">
        <div className="flex items-center justify-between pointer-events-auto">
          <Card className="px-4 py-2.5 bg-black/80 backdrop-blur-sm border-primary/40 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Счёт</p>
                <p className="text-2xl font-black text-primary tabular-nums">{score}</p>
              </div>
              {combo > 1 && (
                <>
                  <div className="h-10 w-px bg-primary/30" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Комбо</p>
                    <p className="text-2xl font-black text-orange-500 tabular-nums animate-pulse">{combo}x</p>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Button 
            size="lg"
            onClick={() => navigate('/tasks')}
            className="bg-gradient-to-r from-primary to-green-400 hover:from-green-400 hover:to-primary text-black font-bold shadow-[0_0_25px_rgba(34,197,94,0.6)] transition-all"
          >
            <ClipboardList className="w-5 h-5 mr-2" />
            Задания
          </Button>
        </div>
      </div>

      {/* Game canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  );
}
