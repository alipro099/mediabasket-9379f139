import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { hapticFeedback } from '@/lib/telegram';
import basketballHoop from '@/assets/basketball-hoop.jpg';
import greenBasketball from '@/assets/green-basketball.png';
import { CoinsDisplay } from '@/components/CoinsDisplay';
import { Button } from '@/components/ui/button';
import { CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Game() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  
  const ballRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 36,
    isDragging: false,
    isFlying: false
  });
  
  const hoopRef = useRef({
    x: 0,
    y: 350,
    width: 140,
    height: 20,
    backboardWidth: 200,
    backboardHeight: 120
  });
  
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const animationFrameRef = useRef<number>();
  const ballImageRef = useRef<HTMLImageElement | null>(null);
  const hoopImageRef = useRef<HTMLImageElement | null>(null);

  const GRAVITY = 0.6;
  const BOUNCE_FACTOR = 0.5;
  const FRICTION = 0.98;

  useEffect(() => {
    const ballImg = new Image();
    ballImg.src = greenBasketball;
    ballImg.onload = () => {
      ballImageRef.current = ballImg;
    };

    const hoopImg = new Image();
    hoopImg.src = basketballHoop;
    hoopImg.onload = () => {
      hoopImageRef.current = hoopImg;
    };

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      hoopRef.current.x = canvas.width / 2;
      
      if (!ballRef.current.isFlying) {
        ballRef.current.x = canvas.width / 2;
        ballRef.current.y = canvas.height - 120;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#1a2a1a');
      bgGradient.addColorStop(1, '#0a0f0a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawHoop(ctx, canvas.width, canvas.height);

      if (ballRef.current.isFlying) {
        ballRef.current.vy += GRAVITY;
        ballRef.current.x += ballRef.current.vx;
        ballRef.current.y += ballRef.current.vy;
        ballRef.current.vx *= FRICTION;

        const hoop = hoopRef.current;
        const ball = ballRef.current;

        const backboardLeft = hoop.x - hoop.backboardWidth / 2;
        const backboardRight = hoop.x + hoop.backboardWidth / 2;
        const backboardTop = hoop.y - hoop.backboardHeight;
        const backboardBottom = hoop.y;

        if (ball.x + ball.radius > backboardLeft && 
            ball.x - ball.radius < backboardRight &&
            ball.y - ball.radius < backboardBottom &&
            ball.y - ball.radius > backboardTop) {
          if (ball.x < backboardLeft + 20 || ball.x > backboardRight - 20) {
            ball.vx = -ball.vx * BOUNCE_FACTOR;
            ball.x = ball.x < hoop.x ? backboardLeft - ball.radius : backboardRight + ball.radius;
            hapticFeedback.light();
          }
        }

        const hoopLeft = hoop.x - hoop.width / 2;
        const hoopRight = hoop.x + hoop.width / 2;
        const hoopTop = hoop.y;
        const hoopBottom = hoop.y + hoop.height;

        if (ball.y > hoopTop && ball.y < hoopTop + 50 &&
            ball.x > hoopLeft + 15 && ball.x < hoopRight - 15 &&
            ball.vy > 0) {
          handleScore(true);
          resetBall();
        }

        if (ball.y + ball.radius > hoopTop && 
            ball.y - ball.radius < hoopBottom &&
            ((ball.x + ball.radius > hoopLeft && ball.x < hoopLeft + 20) ||
             (ball.x - ball.radius < hoopRight && ball.x > hoopRight - 20))) {
          ball.vy = -ball.vy * BOUNCE_FACTOR;
          ball.vx = ball.vx * BOUNCE_FACTOR;
          hapticFeedback.medium();
        }

        if (ball.y > canvas.height + 100) {
          handleScore(false);
          resetBall();
        }

        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
          ball.vx = -ball.vx * BOUNCE_FACTOR;
          ball.x = ball.x < canvas.width / 2 ? ball.radius : canvas.width - ball.radius;
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
    ballRef.current.y = canvas.height - 120;
    ballRef.current.vx = 0;
    ballRef.current.vy = 0;
    ballRef.current.isFlying = false;
    ballRef.current.isDragging = false;
  };

  const drawHoop = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const hoop = hoopRef.current;
    
    if (hoopImageRef.current) {
      ctx.save();
      
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 10;
      
      ctx.drawImage(
        hoopImageRef.current,
        hoop.x - hoop.backboardWidth / 2,
        hoop.y - hoop.backboardHeight,
        hoop.backboardWidth,
        hoop.backboardHeight
      );
      
      ctx.restore();
      
      ctx.save();
      ctx.fillStyle = '#00FF66';
      ctx.shadowColor = '#00FF66';
      ctx.shadowBlur = 15;
      ctx.fillRect(hoop.x - hoop.width / 2, hoop.y, hoop.width, hoop.height);
      ctx.restore();
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 10; i++) {
        const x = hoop.x - hoop.width / 2 + (i / 9) * hoop.width;
        ctx.beginPath();
        ctx.moveTo(x, hoop.y + hoop.height);
        ctx.lineTo(x + Math.sin(i) * 3, hoop.y + hoop.height + 50);
        ctx.stroke();
      }
    }
  };

  const drawBall = (ctx: CanvasRenderingContext2D) => {
    const ball = ballRef.current;
    
    if (ballImageRef.current) {
      ctx.save();
      
      if (!ball.isFlying) {
        ctx.shadowColor = 'rgba(0, 255, 102, 0.6)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;
      }
      
      ctx.drawImage(
        ballImageRef.current,
        ball.x - ball.radius,
        ball.y - ball.radius,
        ball.radius * 2,
        ball.radius * 2
      );
      
      ctx.restore();
    }
  };

  const handleScore = (success: boolean) => {
    if (success) {
      const newScore = score + 2;
      setScore(newScore);
      hapticFeedback.success();
      
      toast.success('🏀 SCORE +2', {
        duration: 1200,
      });
    } else {
      hapticFeedback.error();
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
      const power = Math.min(dist / time / 40, 30);
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
        <div className="flex items-center justify-between pointer-events-auto px-4">
          <CoinsDisplay />
          
          <Card className="px-6 py-3 bg-black/80 backdrop-blur-sm border-primary/40 shadow-[0_0_20px_rgba(0,255,102,0.4)]">
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Счёт</p>
              <p className="text-4xl font-black text-primary tabular-nums">{score}</p>
            </div>
          </Card>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/tasks')}
            className="rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-black"
          >
            <CheckSquare className="w-5 h-5" />
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