import { useState, useRef, useEffect } from 'react';
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
  radius: number;
  isFlying: boolean;
}

export default function Game() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  
  const ballRef = useRef<Ball>({ x: 0, y: 0, vx: 0, vy: 0, radius: 30, isFlying: false });
  const swipeStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const swipeCurrentRef = useRef<{ x: number; y: number } | null>(null);
  const animationFrameRef = useRef<number>();
  const ballImageRef = useRef<HTMLImageElement>();
  const logoImageRef = useRef<HTMLImageElement>();

  // Game constants
  const BALL_RADIUS = 30;
  const HOOP_X = 0.5; // Center
  const HOOP_Y = 150;
  const HOOP_WIDTH = 80;
  const HOOP_RADIUS = 40;
  const GRAVITY = 0.8;
  const BACKBOARD_WIDTH = 120;
  const BACKBOARD_HEIGHT = 90;

  // Load images
  useEffect(() => {
    const ballImg = new Image();
    ballImg.src = basketballBall;
    ballImg.onload = () => {
      ballImageRef.current = ballImg;
    };

    const logoImg = new Image();
    logoImg.src = mediaBasketLogo;
    logoImg.onload = () => {
      logoImageRef.current = logoImg;
    };
  }, []);

  // Game loop
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
        ballRef.current.y = canvas.height - 120;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0f1810');
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawCourt(ctx, canvas.width, canvas.height);
      drawHoop(ctx, canvas.width);

      // Ball physics
      if (ballRef.current.isFlying) {
        const ball = ballRef.current;
        ball.vy += GRAVITY;
        ball.x += ball.vx;
        ball.y += ball.vy;

        const hoopX = canvas.width * HOOP_X;
        
        // Check if scored
        if (
          ball.y > HOOP_Y - 10 &&
          ball.y < HOOP_Y + 30 &&
          Math.abs(ball.x - hoopX) < HOOP_RADIUS - ball.radius &&
          ball.vy > 0
        ) {
          handleScore(true);
          resetBall();
        }

        // Check bounds
        if (ball.y > canvas.height + 50 || ball.x < -50 || ball.x > canvas.width + 50) {
          handleScore(false);
          resetBall();
        }
      }

      // Draw swipe trajectory
      if (swipeStartRef.current && swipeCurrentRef.current && !ballRef.current.isFlying) {
        drawSwipeLine(ctx);
      }

      drawBall(ctx, ballRef.current);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const resetBall = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    ballRef.current = {
      x: canvas.width / 2,
      y: canvas.height - 120,
      vx: 0,
      vy: 0,
      radius: BALL_RADIUS,
      isFlying: false
    };
    swipeStartRef.current = null;
    swipeCurrentRef.current = null;
  };

  const drawCourt = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Floor line
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.2)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, height - 100);
    ctx.lineTo(width, height - 100);
    ctx.stroke();
  };

  const drawHoop = (ctx: CanvasRenderingContext2D, width: number) => {
    const hoopX = width * HOOP_X;

    // Backboard
    ctx.save();
    ctx.shadowColor = 'rgba(34, 197, 94, 0.6)';
    ctx.shadowBlur = 20;
    
    const gradient = ctx.createLinearGradient(
      hoopX - BACKBOARD_WIDTH / 2,
      HOOP_Y - BACKBOARD_HEIGHT - 20,
      hoopX + BACKBOARD_WIDTH / 2,
      HOOP_Y - 20
    );
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.5, '#f5f5f5');
    gradient.addColorStop(1, '#ffffff');
    ctx.fillStyle = gradient;
    
    ctx.fillRect(
      hoopX - BACKBOARD_WIDTH / 2,
      HOOP_Y - BACKBOARD_HEIGHT - 20,
      BACKBOARD_WIDTH,
      BACKBOARD_HEIGHT
    );

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.strokeRect(
      hoopX - BACKBOARD_WIDTH / 2,
      HOOP_Y - BACKBOARD_HEIGHT - 20,
      BACKBOARD_WIDTH,
      BACKBOARD_HEIGHT
    );

    // Logo
    if (logoImageRef.current && logoImageRef.current.complete) {
      ctx.shadowBlur = 0;
      ctx.drawImage(
        logoImageRef.current,
        hoopX - 45,
        HOOP_Y - BACKBOARD_HEIGHT + 10,
        90,
        65
      );
    }

    ctx.restore();

    // Hoop ring
    ctx.save();
    ctx.shadowColor = '#ff6b35';
    ctx.shadowBlur = 25;
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(hoopX, HOOP_Y, HOOP_RADIUS, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Net
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const x1 = hoopX + Math.cos(angle) * HOOP_RADIUS;
      const y1 = HOOP_Y + Math.sin(angle) * HOOP_RADIUS;
      const x2 = hoopX + Math.cos(angle) * (HOOP_RADIUS - 10);
      const y2 = HOOP_Y + 40 + Math.sin(angle) * 5;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(
        (x1 + x2) / 2,
        (y1 + y2) / 2 + 10,
        x2,
        y2
      );
      ctx.stroke();
    }
  };

  const drawBall = (ctx: CanvasRenderingContext2D, ball: Ball) => {
    ctx.save();

    // Shadow
    if (!ball.isFlying || ball.y < canvasRef.current!.height - 150) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 8;
      ctx.shadowOffsetY = 10;
    }

    if (ballImageRef.current && ballImageRef.current.complete) {
      ctx.drawImage(
        ballImageRef.current,
        ball.x - ball.radius,
        ball.y - ball.radius,
        ball.radius * 2,
        ball.radius * 2
      );
    } else {
      const ballGradient = ctx.createRadialGradient(
        ball.x - 8, 
        ball.y - 8, 
        0, 
        ball.x, 
        ball.y, 
        ball.radius
      );
      ballGradient.addColorStop(0, '#22c55e');
      ballGradient.addColorStop(1, '#166534');
      ctx.fillStyle = ballGradient;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  const drawSwipeLine = (ctx: CanvasRenderingContext2D) => {
    if (!swipeStartRef.current || !swipeCurrentRef.current) return;

    const start = swipeStartRef.current;
    const current = swipeCurrentRef.current;

    // Draw arrow
    ctx.save();
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.setLineDash([]);
    
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(current.x, current.y);
    ctx.stroke();

    // Arrow head
    const angle = Math.atan2(current.y - start.y, current.x - start.x);
    const headLength = 20;
    
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(current.x, current.y);
    ctx.lineTo(
      current.x - headLength * Math.cos(angle - Math.PI / 6),
      current.y - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      current.x - headLength * Math.cos(angle + Math.PI / 6),
      current.y - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  const handleScore = (success: boolean) => {
    if (success) {
      const newScore = score + 2;
      const newCombo = combo + 1;
      
      setScore(newScore);
      setCombo(newCombo);
      
      hapticFeedback.success();
      
      if (newCombo > 1) {
        toast.success(`🔥 ${newCombo}x КОМБО! +2 очка`, {
          duration: 1500,
        });
      } else {
        toast.success('🏀 ПОПАЛ! +2 очка', {
          duration: 1200,
        });
      }
    } else {
      setCombo(0);
      hapticFeedback.error();
      toast.error('💥 Мимо!', {
        duration: 1000,
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (ballRef.current.isFlying) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    swipeStartRef.current = { x, y, time: Date.now() };
    swipeCurrentRef.current = { x, y };
    hapticFeedback.light();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeStartRef.current || ballRef.current.isFlying) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    swipeCurrentRef.current = { x, y };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!swipeStartRef.current || !swipeCurrentRef.current || ballRef.current.isFlying) return;
    e.preventDefault();

    const dx = swipeCurrentRef.current.x - swipeStartRef.current.x;
    const dy = swipeCurrentRef.current.y - swipeStartRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 30) {
      const timeDiff = (Date.now() - swipeStartRef.current.time) / 1000;
      const speed = Math.min(distance / timeDiff / 100, 15);
      
      ballRef.current.vx = (dx / distance) * speed;
      ballRef.current.vy = (dy / distance) * speed;
      ballRef.current.isFlying = true;
      hapticFeedback.medium();
    }

    swipeStartRef.current = null;
    swipeCurrentRef.current = null;
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

      {/* Instructions */}
      {!ballRef.current.isFlying && score === 0 && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-fade-in">
          <Card className="px-6 py-4 bg-black/90 backdrop-blur-md border-2 border-primary/60 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
            <p className="text-base text-center text-foreground font-semibold">
              👆 <span className="text-primary font-black">Свайпните</span> для броска!
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
