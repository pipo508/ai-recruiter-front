import { useEffect, useRef } from 'react';
import { MAX_CIRCLES, SPEED_MULTIPLIER } from '../../constants/constants';

const SimpleAnimatedBackground = () => {
  const canvasRef = useRef(null);
  const circles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const generateCircle = (x = Math.random() * canvas.width, y = Math.random() * canvas.height) => ({
      x,
      y,
      radius: Math.random() * 20 + 10,
      speedX: (Math.random() - 0.5) * SPEED_MULTIPLIER,
      speedY: (Math.random() - 0.5) * SPEED_MULTIPLIER,
      color: `rgba(59, 131, 246, ${Math.random() * 0.5 + 0.3})`,
    });

    for (let i = 0; i < 20; i++) {
      circles.current.push(generateCircle());
    }

    const drawCircles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      circles.current.forEach((circle) => {
        circle.x += circle.speedX;
        circle.y += circle.speedY;

        if (circle.x - circle.radius < 0 || circle.x + circle.radius > canvas.width) circle.speedX *= -1;
        if (circle.y - circle.radius < 0 || circle.y + circle.radius > canvas.height) circle.speedY *= -1;

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
      });

      requestAnimationFrame(drawCircles);
    };

    drawCircles();

    const handleClick = (e) => {
      for (let i = 0; i < 10; i++) {
        circles.current.push(generateCircle(e.clientX, e.clientY));
      }

      while (circles.current.length > MAX_CIRCLES) {
        circles.current.shift();
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full" style={{ backgroundColor: 'rgba(59, 131, 246, 0.16)' }} />;
};

export default SimpleAnimatedBackground;