import { useEffect, useRef } from 'react';
import { 
  MAX_PARTICLES, MAX_PARTICLES_MOBILE, MAX_DISTANCE, FORCE_MULTIPLIER,
  PARTICLE_RADIUS_MIN, PARTICLE_RADIUS_MAX, SPEED_MAX,
  CLICK_PARTICLE_RADIUS_MIN, CLICK_PARTICLE_RADIUS_MAX, CLICK_SPEED_MAX 
} from '../../constants/constants';

const ModernAnimatedBackground = () => {
  const canvasRef = useRef(null);
  const mousePosition = useRef({ x: null, y: null });
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // Detectar si es un dispositivo móvil
    const isMobile = window.innerWidth < 768;
    const adjustedParticleCount = isMobile ? 30 : 150; // Nueva cantidad de partículas
    const adjustedMaxParticles = isMobile ? MAX_PARTICLES_MOBILE : MAX_PARTICLES;

    // Inicializar partículas
    particles.current = Array.from({ length: adjustedParticleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * (PARTICLE_RADIUS_MAX - PARTICLE_RADIUS_MIN) + PARTICLE_RADIUS_MIN,
      speedX: (Math.random() - 0.5) * SPEED_MAX,
      speedY: (Math.random() - 0.5) * SPEED_MAX,
    }));

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p, index) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        const distance = Math.sqrt(
          (mousePosition.current.x - p.x) ** 2 +
          (mousePosition.current.y - p.y) ** 2
        );

        if (distance < MAX_DISTANCE) {
          const forceDirectionX = (p.x - mousePosition.current.x) / distance;
          const forceDirectionY = (p.y - mousePosition.current.y) / distance;
          const force = (MAX_DISTANCE - distance) / MAX_DISTANCE;
          const directionX = forceDirectionX * force * FORCE_MULTIPLIER;
          const directionY = forceDirectionY * force * FORCE_MULTIPLIER;

          p.x += directionX;
          p.y += directionY;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();

        for (let j = index + 1; j < particles.current.length; j++) {
          const p2 = particles.current[j];
          const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);

          if (dist < (isMobile ? 100 : 150)) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / (isMobile ? 100 : 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(drawParticles);
    };

    drawParticles();

    const handleMouseMove = (e) => {
      mousePosition.current.x = e.clientX;
      mousePosition.current.y = e.clientY;
    };

    const handleClick = (e) => {
      const particlesToAdd = isMobile ? 5 : 10;

      while (particles.current.length + particlesToAdd > adjustedMaxParticles) {
        particles.current.shift();
      }

      for (let i = 0; i < particlesToAdd; i++) {
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          radius: Math.random() * (CLICK_PARTICLE_RADIUS_MAX - CLICK_PARTICLE_RADIUS_MIN) + CLICK_PARTICLE_RADIUS_MIN,
          speedX: (Math.random() - 0.5) * CLICK_SPEED_MAX,
          speedY: (Math.random() - 0.5) * CLICK_SPEED_MAX,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full" style={{ backgroundColor: 'rgba(59, 131, 246, 0.16)' }} />;
};

export default ModernAnimatedBackground;
