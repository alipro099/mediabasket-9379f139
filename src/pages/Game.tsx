import { useState, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Cylinder, Box, Text } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { hapticFeedback } from '@/lib/telegram';
import * as THREE from 'three';

function Basketball({ position, onShoot }: { position: [number, number, number]; onShoot: (success: boolean) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isShooting, setIsShooting] = useState(false);
  const [shootProgress, setShootProgress] = useState(0);

  useFrame(() => {
    if (meshRef.current && !isShooting) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }

    if (isShooting && shootProgress < 1) {
      const newProgress = shootProgress + 0.02;
      setShootProgress(newProgress);

      if (meshRef.current) {
        // Параболическая траектория
        const arc = Math.sin(newProgress * Math.PI) * 3;
        const forward = newProgress * 5;
        meshRef.current.position.set(
          position[0],
          position[1] + arc,
          position[2] - forward
        );

        // Вращение во время полета
        meshRef.current.rotation.x += 0.2;
        meshRef.current.rotation.y += 0.1;
      }

      if (newProgress >= 1) {
        // Проверка попадания (60% шанс)
        const success = Math.random() > 0.4;
        onShoot(success);
        setIsShooting(false);
        setShootProgress(0);
        
        // Возврат мяча
        setTimeout(() => {
          if (meshRef.current) {
            meshRef.current.position.set(...position);
          }
        }, 500);
      }
    }
  });

  const handleClick = () => {
    if (!isShooting) {
      setIsShooting(true);
      hapticFeedback.light();
    }
  };

  return (
    <Sphere ref={meshRef} args={[0.4, 32, 32]} position={position} onClick={handleClick}>
      <meshStandardMaterial 
        color="#00ff00" 
        metalness={0.3}
        roughness={0.4}
        emissive="#00ff00"
        emissiveIntensity={0.2}
      />
    </Sphere>
  );
}

function Hoop() {
  return (
    <group position={[0, 2, -5]}>
      {/* Щит */}
      <Box args={[2, 1.5, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ff6600" metalness={0.5} roughness={0.3} />
      </Box>
      
      {/* Кольцо */}
      <Cylinder args={[0.45, 0.45, 0.05, 32]} position={[0, -0.5, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#ff0000" metalness={0.8} roughness={0.2} />
      </Cylinder>

      {/* Сетка */}
      {[...Array(12)].map((_, i) => (
        <Cylinder 
          key={i}
          args={[0.01, 0.01, 0.6, 8]} 
          position={[
            Math.cos((i / 12) * Math.PI * 2) * 0.4,
            -0.8,
            0.3 + Math.sin((i / 12) * Math.PI * 2) * 0.4
          ]}
          rotation={[Math.PI / 6, 0, 0]}
        >
          <meshStandardMaterial color="#ffffff" opacity={0.6} transparent />
        </Cylinder>
      ))}
    </group>
  );
}

function Court() {
  return (
    <>
      {/* Пол */}
      <Box args={[20, 0.1, 20]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      
      {/* Разметка центра */}
      <Cylinder args={[2, 2, 0.05, 32]} position={[0, -0.4, 0]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.3} />
      </Cylinder>

      {/* Линии */}
      {[-3, 3].map((x) => (
        <Box key={x} args={[0.1, 0.05, 10]} position={[x, -0.4, -2]}>
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
        </Box>
      ))}
    </>
  );
}

export default function Game() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const handleShoot = useCallback((success: boolean) => {
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
  }, []);

  const accuracy = attempts > 0 ? Math.round((score / (attempts * 3)) * 100) : 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-black"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-primary neon-text">ИГРА</h1>
            <p className="text-xs text-muted-foreground">Кликай по мячу!</p>
          </div>

          <div className="w-10" />
        </div>
      </div>

      {/* Статистика */}
      <div className="absolute top-20 left-4 right-4 z-10 flex gap-3">
        <Card className="flex-1 p-3 bg-black/60 backdrop-blur border-primary">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Очки</p>
              <p className="text-2xl font-bold text-primary">{score}</p>
            </div>
          </div>
        </Card>

        <Card className="flex-1 p-3 bg-black/60 backdrop-blur border-primary">
          <div>
            <p className="text-xs text-muted-foreground">Точность</p>
            <p className="text-2xl font-bold text-primary">{accuracy}%</p>
          </div>
        </Card>

        <Card className="flex-1 p-3 bg-black/60 backdrop-blur border-primary">
          <div>
            <p className="text-xs text-muted-foreground">Броски</p>
            <p className="text-2xl font-bold text-foreground">{attempts}</p>
          </div>
        </Card>
      </div>

      {/* 3D Игра */}
      <Canvas camera={{ position: [0, 2, 6], fov: 60 }} className="h-screen">
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, 10, 10]} intensity={0.5} color="#00ff00" />
        <spotLight 
          position={[0, 10, 0]} 
          intensity={1} 
          angle={0.6} 
          penumbra={0.5}
          castShadow
        />
        
        <Court />
        <Hoop />
        <Basketball position={[0, 0.5, 3]} onShoot={handleShoot} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>

      {/* Инструкция */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
        <Card className="p-4 bg-black/80 backdrop-blur border-2 border-primary">
          <p className="text-sm text-center text-foreground">
            🏀 <span className="text-primary font-bold">Кликай по мячу</span> для броска!
          </p>
        </Card>
      </div>
    </div>
  );
}
