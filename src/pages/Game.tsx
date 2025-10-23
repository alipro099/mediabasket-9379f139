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
  rotation: number;
  radius: number;
}

export default function Game() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  
  const ballRef = useRef<Ball>({ x: 0, y: 0, vx: 0, vy: 0, rotation: 0, radius: 25 });
  const isThrowingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const trajectoryRef = useRef<{ x: number; y: number }[]>([]);
  const animationFrameRef = useRef<number>();
  const ballImageRef = useRef<HTMLImageElement>();
  const logoImageRef = useRef<HTMLImageElement>();
  const lastScoreRef = useRef(0);

  // Game constants
  const BALL_RADIUS = 25;
  const HOOP_CENTER_X = 0.5; // Relative to canvas width
  const HOOP_Y = 120;
  const HOOP_WIDTH = 70;
  const HOOP_DEPTH = 8;
  const GRAVITY = 0.6;
  const DAMPING = 0.85;
  const BACKBOARD_WIDTH = 100;
  const BACKBOARD_HEIGHT = 80;

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

  // Initialize ball position
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    ballRef.current.x = canvas.width / 2;
    ballRef.current.y = canvas.height - 100;
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const oldX = ballRef.current.x;
      const oldY = ballRef.current.y;
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Adjust ball position on resize
      if (!isThrowingRef.current) {
        ballRef.current.x = canvas.width / 2;
        ballRef.current.y = canvas.height - 100;
      } else if (oldWidth > 0) {
        ballRef.current.x = (oldX / oldWidth) * canvas.width;
        ballRef.current.y = (oldY / oldHeight) * canvas.height;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0f0a');
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Court markings
      drawCourt(ctx, canvas.width, canvas.height);

      // Hoop and backboard
      drawHoop(ctx, canvas.width);

      // Ball physics
      if (isThrowingRef.current) {
        const ball = ballRef.current;
        ball.vy += GRAVITY;
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.rotation += ball.vx * 0.1;

        const hoopX = canvas.width * HOOP_CENTER_X;
        const hoopTop = HOOP_Y;
        const hoopBottom = HOOP_Y + 5;

        // Check if ball enters hoop from above
        if (
          ball.y >= hoopTop &&
          ball.y <= hoopBottom + 30 &&
          Math.abs(ball.x - hoopX) < HOOP_WIDTH / 2 - ball.radius &&
          ball.vy > 0
        ) {
          // Successful shot
          handleScore(true);
          resetBall();
        }

        // Check bounds
        if (ball.y > canvas.height + ball.radius * 2 || ball.x < -ball.radius * 2 || ball.x > canvas.width + ball.radius * 2) {
          handleScore(false);
          resetBall();
        }
      }

      // Draw trajectory preview
      if (dragStartRef.current && !isThrowingRef.current) {
        drawTrajectory(ctx, trajectoryRef.current);
      }

      // Draw ball
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
    
    isThrowingRef.current = false;
    ballRef.current = {
      x: canvas.width / 2,
      y: canvas.height - 100,
      vx: 0,
      vy: 0,
      rotation: 0,
      radius: BALL_RADIUS
    };
    dragStartRef.current = null;
    trajectoryRef.current = [];
  };

  const drawCourt = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Center line
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.15)';
    ctx.lineWidth = 2;
    ctx.setLineDash([15, 15]);
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Three-point arc (decorative)
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.1)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(width * HOOP_CENTER_X, HOOP_Y + 100, 180, 0, Math.PI);
    ctx.stroke();

    // Floor line
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height - 80);
    ctx.lineTo(width, height - 80);
    ctx.stroke();
  };

  const drawHoop = (ctx: CanvasRenderingContext2D, width: number) => {
    const hoopX = width * HOOP_CENTER_X;

    // Backboard with logo
    ctx.save();
    
    // Backboard shadow
    ctx.shadowColor = 'rgba(34, 197, 94, 0.5)';
    ctx.shadowBlur = 25;
    
    // Backboard
    const gradient = ctx.createLinearGradient(
      hoopX - BACKBOARD_WIDTH / 2,
      HOOP_Y - BACKBOARD_HEIGHT - 15,
      hoopX + BACKBOARD_WIDTH / 2,
      HOOP_Y - 15
    );
    gradient.addColorStop(0, '#f0f0f0');
    gradient.addColorStop(0.5, '#ffffff');
    gradient.addColorStop(1, '#f0f0f0');
    ctx.fillStyle = gradient;
    
    ctx.fillRect(
      hoopX - BACKBOARD_WIDTH / 2,
      HOOP_Y - BACKBOARD_HEIGHT - 15,
      BACKBOARD_WIDTH,
      BACKBOARD_HEIGHT
    );

    // Backboard border
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.strokeRect(
      hoopX - BACKBOARD_WIDTH / 2,
      HOOP_Y - BACKBOARD_HEIGHT - 15,
      BACKBOARD_WIDTH,
      BACKBOARD_HEIGHT
    );

    // Logo on backboard
    if (logoImageRef.current && logoImageRef.current.complete) {
      ctx.shadowBlur = 0;
      ctx.drawImage(
        logoImageRef.current,
        hoopX - 40,
        HOOP_Y - BACKBOARD_HEIGHT + 5,
        80,
        60
      );
    }

    ctx.restore();

    // Hoop support
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(hoopX, HOOP_Y - 15);
    ctx.lineTo(hoopX, HOOP_Y);
    ctx.stroke();

    // Hoop ring
    ctx.save();
    ctx.shadowColor = '#ff6b35';
    ctx.shadowBlur = 20;
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(hoopX, HOOP_Y, HOOP_WIDTH / 2, HOOP_DEPTH, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Net
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const x1 = hoopX + Math.cos(angle) * (HOOP_WIDTH / 2);
      const y1 = HOOP_Y + Math.sin(angle) * HOOP_DEPTH;
      const x2 = hoopX + Math.cos(angle) * (HOOP_WIDTH / 2 - 8);
      const y2 = HOOP_Y + 35 + Math.sin(angle) * 2;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(
        (x1 + x2) / 2,
        (y1 + y2) / 2 + 5,
        x2,
        y2
      );
      ctx.stroke();
    }
  };

  const drawBall = (ctx: CanvasRenderingContext2D, ball: Ball) => {
    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.rotate(ball.rotation);

    // Ball shadow
    if (!isThrowingRef.current || ball.y < canvasRef.current!.height - 100) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 8;
    }

    if (ballImageRef.current && ballImageRef.current.complete) {
      ctx.drawImage(
        ballImageRef.current,
        -ball.radius,
        -ball.radius,
        ball.radius * 2,
        ball.radius * 2
      );
    } else {
      // Fallback
      const ballGradient = ctx.createRadialGradient(-5, -5, 0, 0, 0, ball.radius);
      ballGradient.addColorStop(0, '#22c55e');
      ballGradient.addColorStop(1, '#166534');
      ctx.fillStyle = ballGradient;
      ctx.beginPath();
      ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Ball lines
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-ball.radius, 0);
      ctx.lineTo(ball.radius, 0);
      ctx.moveTo(0, -ball.radius);
      ctx.lineTo(0, ball.radius);
      ctx.stroke();
    }

    ctx.restore();
  };

  const drawTrajectory = (ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) => {
    if (points.length < 2) return;

    ctx.save();
    points.forEach((point, i) => {
      const alpha = 1 - (i / points.length) * 0.7;
      const size = 4 - (i / points.length) * 2;
      
      ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  };

  const handleScore = (success: boolean) => {
    if (success) {
      const newScore = score + 2;
      const newCombo = combo + 1;
      
      setScore(newScore);
      setCombo(newCombo);
      
      if (newScore > bestScore) {
        setBestScore(newScore);
      }
      
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
    
    lastScoreRef.current = score;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isThrowingRef.current) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const ball = ballRef.current;
    const distance = Math.sqrt((x - ball.x) ** 2 + (y - ball.y) ** 2);
    
    if (distance < ball.radius * 3) {
      dragStartRef.current = { x, y };
      hapticFeedback.light();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStartRef.current || isThrowingRef.current) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const dx = x - dragStartRef.current.x;
    const dy = y - dragStartRef.current.y;

    // Calculate trajectory preview
    const points: { x: number; y: number }[] = [];
    const ball = ballRef.current;
    let px = ball.x;
    let py = ball.y;
    let vx = -dx * 0.2;
    let vy = -dy * 0.2;

    for (let i = 0; i < 50; i++) {
      if (i % 3 === 0) {
        points.push({ x: px, y: py });
      }
      vy += GRAVITY;
      px += vx;
      py += vy;
      
      if (py > canvas.height || px < 0 || px > canvas.width) break;
    }

    trajectoryRef.current = points;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!dragStartRef.current || isThrowingRef.current) return;
    e.preventDefault();
    
    const touch = e.changedTouches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const dx = x - dragStartRef.current.x;
    const dy = y - dragStartRef.current.y;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 10) {
      ballRef.current.vx = -dx * 0.2;
      ballRef.current.vy = -dy * 0.2;
      isThrowingRef.current = true;
      hapticFeedback.medium();
    }

    dragStartRef.current = null;
    trajectoryRef.current = [];
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
      {!isThrowingRef.current && score === 0 && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-fade-in">
          <Card className="px-6 py-3 bg-black/90 backdrop-blur-md border-2 border-primary/60 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
            <p className="text-sm text-center text-foreground font-semibold">
              🏀 <span className="text-primary font-black">Потяните мяч</span> для прицеливания и отпустите!
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
