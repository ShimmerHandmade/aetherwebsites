
import React, { useEffect, useRef } from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ParticlesBackgroundProps {
  element: BuilderElement;
}

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({ element }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { props } = element;
  
  const particleColor = props?.particleColor || "#4f46e5";
  const particleCount = props?.particleCount || 50;
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas dimensions to match container
    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    
    // Initial resize
    resizeCanvas();
    
    // Listen for resize events
    window.addEventListener("resize", resizeCanvas);
    
    // Create particles
    const particles: {
      x: number;
      y: number;
      radius: number;
      dx: number;
      dy: number;
    }[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        dx: (Math.random() - 0.5) * 1,
        dy: (Math.random() - 0.5) * 1,
      });
    }
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
        
        // Move particles
        p.x += p.dx;
        p.y += p.dy;
        
        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
    };
    
    animate();
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [particleColor, particleCount]);
  
  return (
    <div className="relative w-full h-full min-h-[200px]">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <div className="relative z-10 p-4">
        {element.content || props?.content || "Particles Background"}
      </div>
    </div>
  );
};

export default ParticlesBackground;
