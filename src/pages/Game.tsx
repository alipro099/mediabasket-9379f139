import { useState, useRef, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Cylinder, Box } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { hapticFeedback } from '@/lib/telegram';
import * as THREE from 'three';

function Basketball({ position, onShoot }: { position: [number, number, number]; onShoot: (success: boolean) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isShooting, setIsShooting] = useState(false);
  const [shootProgress, setShootProgress] = useState(0);
  const [velocity, setVelocity] = useState({ x: 0, y: 0, z: 0 });
  const { camera } = useThree();

  useFrame(() => {
    if (meshRef.current && !isShooting) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }

    if (isShooting && shootProgress < 1) {
      const newProgress = shootProgress + 0.015;
      setShootProgress(newProgress);

      if (meshRef.current) {
        // Параболическая траектория с учетом velocity
        const arc = Math.sin(newProgress * Math.PI) * (3 + velocity.y * 2);
        const forward = newProgress * (6 + velocity.z);
        const sideways = velocity.x * newProgress * 2;
        
        meshRef.current.position.set(
          position[0] + sideways,
          position[1] + arc,
          position[2] - forward
        );

        // Вращение во время полета
        meshRef.current.rotation.x += 0.25;
        meshRef.current.rotation.y += 0.15;
      }

      if (newProgress >= 1) {
        // Проверка попадания - зависит от точности броска
        const accuracy = 1 - Math.abs(velocity.x) * 0.3 - Math.abs(velocity.y - 0.5) * 0.4;
        const success = Math.random() < accuracy;
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

  const handlePointerDown = (e: any) => {
    if (!isShooting) {
      e.stopPropagation();
      const startY = e.point.y;
      const startX = e.point.x;

      const handlePointerMove = (moveEvent: any) => {
        const deltaY = moveEvent.point.y - startY;
        const deltaX = moveEvent.point.x - startX;
        
        // Визуализация натяжения
        if (meshRef.current && !isShooting) {
          meshRef.current.position.y = position[1] + Math.min(deltaY * 0.5, 0);
        }
      };

      const handlePointerUp = (upEvent: any) => {
        const deltaY = upEvent.point.y - startY;
        const deltaX = upEvent.point.x - startX;
        
        // Вычисляем силу и направление броска
        const power = Math.min(Math.abs(deltaY) * 2, 2);
        const direction = Math.max(0.2, Math.min(power, 1.5));
        
        setVelocity({
          x: -deltaX * 0.5, // Боковое отклонение
          y: direction, // Высота броска
          z: direction // Сила вперед
        });
        
        setIsShooting(true);
        hapticFeedback.medium();
        
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
      };

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    }
  };

  return (
    <Sphere 
      ref={meshRef} 
      args={[0.5, 32, 32]} 
      position={position} 
      onPointerDown={handlePointerDown}
    >
      <meshStandardMaterial 
        color="#22c55e" 
        metalness={0.4}
        roughness={0.3}
        emissive="#22c55e"
        emissiveIntensity={0.3}
      />
    </Sphere>
  );
}

function Hoop() {
  return (
    <group position={[0, 3, -6]}>
      {/* Щит */}
      <Box args={[2.5, 1.8, 0.15]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#ff6600" 
          metalness={0.6} 
          roughness={0.2}
          emissive="#ff6600"
          emissiveIntensity={0.1}
        />
      </Box>
      
      {/* Кольцо */}
      <Cylinder args={[0.5, 0.5, 0.08, 32]} position={[0, -0.6, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial 
          color="#dc2626" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#dc2626"
          emissiveIntensity={0.2}
        />
      </Cylinder>

      {/* Сетка */}
      {[...Array(16)].map((_, i) => (
        <Cylinder 
          key={i}
          args={[0.015, 0.015, 0.7, 8]} 
          position={[
            Math.cos((i / 16) * Math.PI * 2) * 0.45,
            -1,
            0.4 + Math.sin((i / 16) * Math.PI * 2) * 0.45
          ]}
          rotation={[Math.PI / 5, 0, 0]}
        >
          <meshStandardMaterial color="#ffffff" opacity={0.7} transparent />
        </Cylinder>
      ))}
    </group>
  );
}

function Court() {
  return (
    <>
      {/* Пол */}
      <Box args={[25, 0.1, 25]} position={[0, -0.5, 0]}>
        <meshStandardMaterial 
          color="#0a0a0a"
          metalness={0.1}
          roughness={0.8}
        />
      </Box>
      
      {/* Центральный круг */}
      <Cylinder args={[2.5, 2.5, 0.05, 32]} position={[0, -0.4, 0]}>
        <meshStandardMaterial 
          color="#22c55e" 
          emissive="#22c55e" 
          emissiveIntensity={0.4}
          metalness={0.3}
        />
      </Cylinder>

      {/* Линии разметки */}
      {[-4, 4].map((x) => (
        <Box key={x} args={[0.15, 0.05, 12]} position={[x, -0.4, -3]}>
          <meshStandardMaterial 
            color="#22c55e" 
            emissive="#22c55e" 
            emissiveIntensity={0.6}
          />
        </Box>
      ))}
      
      {/* Трехочковая дуга */}
      {[...Array(20)].map((_, i) => {
        const angle = (i / 19) * Math.PI - Math.PI / 2;
        const radius = 5;
        return (
          <Box 
            key={`arc-${i}`}
            args={[0.15, 0.05, 0.3]} 
            position={[
              Math.cos(angle) * radius, 
              -0.4, 
              -6 + Math.sin(angle) * radius
            ]}
            rotation={[0, -angle, 0]}
          >
            <meshStandardMaterial 
              color="#22c55e" 
              emissive="#22c55e" 
              emissiveIntensity={0.5}
            />
          </Box>
        );
      })}
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
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Header с кнопкой заданий */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent">
        <div className="flex items-center justify-between">
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

      {/* 3D Игра на весь экран */}
      <Canvas 
        camera={{ position: [0, 2.5, 7], fov: 65 }} 
        className="w-full h-full"
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[-10, 10, 10]} intensity={0.7} color="#22c55e" />
        <spotLight 
          position={[0, 12, -3]} 
          intensity={1.5} 
          angle={0.8} 
          penumbra={0.5}
          castShadow
          color="#ffffff"
        />
        <pointLight position={[0, 1, 5]} intensity={0.5} color="#22c55e" />
        
        <Court />
        <Hoop />
        <Basketball position={[0, 0.5, 4]} onShoot={handleShoot} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 4}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Инструкция внизу */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
        <Card className="px-6 py-3 bg-black/80 backdrop-blur border-2 border-primary/50">
          <p className="text-sm text-center text-foreground font-medium">
            🏀 <span className="text-primary font-bold">Потяни и отпусти</span> мяч для броска!
          </p>
        </Card>
      </div>
    </div>
  );
}
