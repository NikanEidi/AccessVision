import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Globe, ArrowRight, Terminal, Cpu } from 'lucide-react';

export default function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [cardsVisible, setCardsVisible] = useState([false, false, false]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isGlitching, setIsGlitching] = useState(false);
  const [card3DRotation, setCard3DRotation] = useState([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const matrixCanvasRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const cursorCanvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const fullName = "NIKAN EIDI";

  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 1024 && !('ontouchstart' in window));
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullName.length) {
        setTypedText(fullName.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 200);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    if (!hasAnimated) {
      setTimeout(() => setCardsVisible([true, false, false]), 200);
      setTimeout(() => setCardsVisible([true, true, false]), 350);
      setTimeout(() => setCardsVisible([true, true, true]), 500);
      setHasAnimated(true);
    }
  }, [hasAnimated]);

  useEffect(() => {
    const triggerGlitch = () => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 300);
      setTimeout(triggerGlitch, Math.random() * 3000 + 5000);
    };
    const timeout = setTimeout(triggerGlitch, Math.random() * 3000 + 5000);
    return () => clearTimeout(timeout);
  }, []);

  const handleLinkClick = (e, url) => {
    e.preventDefault();
    setIsGlitching(true);
    
    setTimeout(() => setCardsVisible([true, true, false]), 100);
    setTimeout(() => setCardsVisible([true, false, false]), 200);
    setTimeout(() => setCardsVisible([false, false, false]), 300);
    
    setTimeout(() => setTypedText('N1K@N 31D1'), 400);
    setTimeout(() => setTypedText('NIK4N E!DI'), 500);
    setTimeout(() => setTypedText('N!KAN EID!'), 600);
    setTimeout(() => setTypedText('NIKAN EIDI'), 700);
    
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
      
      setTimeout(() => {
        setCardsVisible([true, false, false]);
        setTimeout(() => setCardsVisible([true, true, false]), 100);
        setTimeout(() => setCardsVisible([true, true, true]), 200);
        setIsGlitching(false);
      }, 300);
    }, 1000);
  };

  const handleCardMouseMove = (e, index) => {
    if (!isDesktop) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    setCard3DRotation(prev => {
      const newRotation = [...prev];
      newRotation[index] = { x: y * 12, y: x * 12 };
      return newRotation;
    });
  };

  const handleCardMouseLeave = (index) => {
    if (!isDesktop) return;
    setCard3DRotation(prev => {
      const newRotation = [...prev];
      newRotation[index] = { x: 0, y: 0 };
      return newRotation;
    });
  };

  useEffect(() => {
    if (!isDesktop) return;
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDesktop]);

  useEffect(() => {
    if (!isDesktop) return;
    const canvas = cursorCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const trails = [];
    const maxTrails = 35;

    class BinaryTrail {
      constructor(x, y, isLeft) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 70 + 35;
        this.x = x + Math.cos(angle) * distance;
        this.y = y + Math.sin(angle) * distance;
        this.isLeft = isLeft;
        this.char = Math.random() > 0.5 ? '1' : '0';
        this.opacity = 1;
        this.size = Math.random() * 12 + 18;
        this.life = 50;
        this.vx = (Math.random() - 0.5) * 5;
        this.vy = (Math.random() - 0.5) * 5;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 8;
      }

      update() {
        this.opacity -= 0.02;
        this.life--;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.vx *= 0.92;
        this.vy *= 0.92;
      }

      draw() {
        const color = this.isLeft ? '111, 41, 255' : '40, 255, 133';
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.font = `bold ${this.size}px "Share Tech Mono", monospace`;
        ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `rgba(${color}, ${this.opacity})`;
        ctx.fillText(this.char, 0, 0);
        ctx.restore();
      }
    }

    let frameCount = 0;
    const animate = () => {
      frameCount++;
      if (frameCount % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const isLeft = mouseRef.current.x < canvas.width / 2;
        trails.push(new BinaryTrail(mouseRef.current.x, mouseRef.current.y, isLeft));
        
        if (trails.length > maxTrails) {
          trails.shift();
        }
        
        for (let i = trails.length - 1; i >= 0; i--) {
          trails[i].update();
          trails[i].draw();
          
          if (trails[i].life <= 0) {
            trails.splice(i, 1);
          }
        }
      }
      
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isDesktop]);

  useEffect(() => {
    const canvas = matrixCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: false });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ<>[]{}()'.split('');
    const fontSize = window.innerWidth < 768 ? 12 : 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(0).map(() => ({
      y: Math.random() * -100,
      speed: Math.random() * 0.7 + 0.4
    }));

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px "Share Tech Mono", monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i].y * fontSize;
        
        const isLeft = x < canvas.width / 2;
        const color = isLeft ? '111, 41, 255' : '40, 255, 133';
        
        ctx.fillStyle = `rgba(${color}, 0.85)`;
        ctx.fillText(char, x, y);
        
        if (drops[i].y * fontSize > 20 && Math.random() > 0.975) {
          ctx.fillStyle = `rgba(255, 255, 255, 1)`;
          ctx.fillText(char, x, y);
        }
        
        if (y > canvas.height && Math.random() > 0.95) {
          drops[i].y = 0;
        }
        drops[i].y += drops[i].speed;
      }
    };

    const interval = setInterval(draw, 35);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const newColumns = Math.floor(canvas.width / fontSize);
      drops.length = newColumns;
      for (let i = 0; i < newColumns; i++) {
        if (!drops[i]) {
          drops[i] = { y: Math.random() * -100, speed: Math.random() * 0.7 + 0.4 };
        }
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.3;
        this.vy = (Math.random() - 0.5) * 1.3;
        this.size = Math.random() * 3.5 + 1.5;
        this.alpha = Math.random() * 0.8 + 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        const isLeft = this.x < canvas.width / 2;
        const color = isLeft ? '111, 41, 255' : '40, 255, 133';
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${this.alpha})`;
        ctx.shadowBlur = 30;
        ctx.shadowColor = `rgba(${color}, ${this.alpha})`;
        ctx.fill();
      }
    }

    const particleCount = window.innerWidth < 768 ? 60 : 120;
    const particles = Array.from({ length: particleCount }, () => new Particle());

    let frameCount = 0;
    const animate = () => {
      frameCount++;
      if (frameCount % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
          p.update();
          p.draw();
        });
        
        ctx.shadowBlur = 0;
        particles.forEach((p1, i) => {
          if (i % 2 === 0) {
            particles.slice(i + 1).forEach((p2, j) => {
              if (j % 2 === 0) {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 130) {
                  const avgX = (p1.x + p2.x) / 2;
                  const isLeft = avgX < canvas.width / 2;
                  const color = isLeft ? '111, 41, 255' : '40, 255, 133';
                  
                  ctx.beginPath();
                  ctx.strokeStyle = `rgba(${color}, ${0.45 * (1 - dist / 130)})`;
                  ctx.lineWidth = 2;
                  ctx.moveTo(p1.x, p1.y);
                  ctx.lineTo(p2.x, p2.y);
                  ctx.stroke();
                }
              }
            });
          }
        });
      }
      
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const links = [
    {
      title: 'Portfolio',
      subtitle: 'Digital Universe',
      url: 'https://nikanvision.dev',
      icon: Globe,
      tag: 'WEB'
    },
    {
      title: 'GitHub',
      subtitle: 'Open Source',
      url: 'https://github.com/nikaneidi',
      icon: Github,
      tag: 'CODE'
    },
    {
      title: 'LinkedIn',
      subtitle: 'Professional',
      url: 'https://linkedin.com/in/nikan-eidi-03476232b',
      icon: Linkedin,
      tag: 'NET'
    }
  ];

  const cursorColor = mousePosition.x < window.innerWidth / 2 ? '#6F29FF' : '#28FF85';
  const cursorColorRgb = mousePosition.x < window.innerWidth / 2 ? '111, 41, 255' : '40, 255, 133';

  return (
    <div className="min-h-screen overflow-hidden relative flex items-center justify-center p-2 sm:p-4" style={{
      background: 'black',
      position: 'relative',
      perspective: '1500px'
    }}>
      <div style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '50vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #6F29FF 0%, #5a1fd9 100%)',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        left: '50vw',
        top: 0,
        width: '50vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #28FF85 0%, #1fd96b 100%)',
        zIndex: 0
      }} />
      
      <canvas ref={matrixCanvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, opacity: 0.95 }} />
      <canvas ref={particleCanvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, opacity: 0.8 }} />
      {isDesktop && <canvas ref={cursorCanvasRef} className="absolute inset-0 pointer-events-none" style={{zIndex: 9999}} />}
      
      <div className="absolute inset-0 pointer-events-none" style={{ 
        zIndex: 3,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4) 100%)',
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.15) 3px)',
      }}></div>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700;800;900&family=Share+Tech+Mono&family=Rajdhani:wght@500;600;700&display=swap');
        
        ${isDesktop ? '* { cursor: none; }' : ''}
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        
        @keyframes glitch-skew {
          0% { transform: translate(0) skewX(0deg); }
          20% { transform: translate(-4px, 4px) skewX(2deg); }
          40% { transform: translate(-4px, -4px) skewX(-2deg); }
          60% { transform: translate(4px, 4px) skewX(2deg); }
          80% { transform: translate(4px, -4px) skewX(-2deg); }
          100% { transform: translate(0) skewX(0deg); }
        }
        
        @keyframes intense-glitch {
          0% { transform: translate(0) skew(0deg); filter: hue-rotate(0deg) brightness(1); }
          10% { transform: translate(-8px, 8px) skew(5deg); filter: hue-rotate(90deg) brightness(1.4); }
          20% { transform: translate(-8px, -8px) skew(-5deg); filter: hue-rotate(180deg) brightness(0.7); }
          30% { transform: translate(8px, 8px) skew(5deg); filter: hue-rotate(270deg) brightness(1.4); }
          40% { transform: translate(8px, -8px) skew(-5deg); filter: hue-rotate(360deg) brightness(0.7); }
          50% { transform: translate(-8px, 8px) skew(5deg); filter: hue-rotate(90deg) brightness(1.4); }
          60% { transform: translate(-8px, -8px) skew(-5deg); filter: hue-rotate(180deg) brightness(0.7); }
          70% { transform: translate(8px, 8px) skew(5deg); filter: hue-rotate(270deg) brightness(1.4); }
          80% { transform: translate(8px, -8px) skew(-5deg); filter: hue-rotate(360deg) brightness(0.7); }
          90% { transform: translate(-4px, 4px) skew(2deg); filter: hue-rotate(0deg) brightness(1); }
          100% { transform: translate(0) skew(0deg); filter: hue-rotate(0deg) brightness(1); }
        }
        
        @keyframes emerge-3d {
          0% {
            opacity: 0;
            transform: perspective(1200px) translateY(90px) translateZ(-100px) rotateX(35deg) scale(0.7);
            filter: blur(30px);
          }
          100% {
            opacity: 1;
            transform: perspective(1200px) translateY(0) translateZ(0) rotateX(0deg) scale(1);
            filter: blur(0);
          }
        }
        
        @keyframes dissolve {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-70px) scale(0.75);
            filter: blur(35px);
          }
        }
        
        @keyframes float-3d {
          0%, 100% { 
            transform: perspective(1200px) translateY(0px) translateZ(0px) rotateX(0deg);
          }
          50% { 
            transform: perspective(1200px) translateY(-24px) translateZ(14px) rotateX(1.5deg);
          }
        }
        
        @keyframes icon-rotate-3d {
          0% { transform: perspective(800px) rotateY(0deg) rotateX(0deg) scale(1); }
          50% { transform: perspective(800px) rotateY(180deg) rotateX(14deg) scale(1.25); }
          100% { transform: perspective(800px) rotateY(360deg) rotateX(0deg) scale(1); }
        }
        
        @keyframes icon-pulse {
          0%, 100% { 
            transform: scale(1);
            filter: drop-shadow(0 0 12px currentColor);
          }
          50% { 
            transform: scale(1.25);
            filter: drop-shadow(0 0 28px currentColor);
          }
        }
        
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 1; }
        }
        
        @keyframes typing-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes terminal-pulse-3d {
          0%, 100% { 
            box-shadow: -14px 0 40px rgba(40, 255, 133, 0.75), 14px 0 40px rgba(111, 41, 255, 0.75), 
                        inset -7px 0 20px rgba(40, 255, 133, 0.45), inset 7px 0 20px rgba(111, 41, 255, 0.45),
                        0 14px 50px rgba(0,0,0,0.65);
            transform: translateZ(0px) scale(1);
          }
          50% { 
            box-shadow: -20px 0 55px rgba(40, 255, 133, 1), 20px 0 55px rgba(111, 41, 255, 1), 
                        inset -12px 0 28px rgba(40, 255, 133, 0.7), inset 12px 0 28px rgba(111, 41, 255, 0.7),
                        0 22px 70px rgba(0,0,0,0.85);
            transform: translateZ(10px) scale(1.03);
          }
        }
        
        @keyframes corner-flicker {
          0%, 100% { opacity: 0.75; box-shadow: 0 0 8px currentColor; }
          50% { opacity: 1; box-shadow: 0 0 16px currentColor; }
        }
        
        @keyframes data-stream {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        
        @keyframes border-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(111, 41, 255, 0.6), 0 0 20px rgba(40, 255, 133, 0.6);
          }
          50% { 
            box-shadow: 0 0 35px rgba(111, 41, 255, 1), 0 0 35px rgba(40, 255, 133, 1);
          }
        }
        
        @keyframes rgb-split {
          0%, 100% { text-shadow: 0 0 0; }
          25% { text-shadow: -2px 0 0 #6F29FF, 2px 0 0 #28FF85; }
          50% { text-shadow: -4px 0 0 #6F29FF, 4px 0 0 #28FF85; }
          75% { text-shadow: -2px 0 0 #6F29FF, 2px 0 0 #28FF85; }
        }
        
        .matrix-font {
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.15em;
        }
        
        .cyber-font {
          font-family: 'Orbitron', sans-serif;
          letter-spacing: 0.0rem;
        }
        
        .hack-font {
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 0.12em;
        }
        
        .card-3d-container {
          perspective: 1200px;
          transform-style: preserve-3d;
        }
        
        .hack-card {
          animation: emerge-3d 1.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          backdrop-filter: blur(35px) saturate(240%);
          -webkit-backdrop-filter: blur(35px) saturate(240%);
          transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
          position: relative;
          overflow: visible;
          transform-style: preserve-3d;
          will-change: transform;
        }
        
        .hack-card.dissolving {
          animation: dissolve 0.65s cubic-bezier(0.4, 0, 1, 1) forwards;
        }
        
        .hack-card::after {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: data-stream 3s linear infinite;
          pointer-events: none;
        }
        
        .hack-icon {
          transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
          transform-style: preserve-3d;
        }
        
        .hack-card:hover .hack-icon {
          animation: icon-rotate-3d 1.3s ease-in-out;
        }
        
        .icon-glow {
          animation: icon-pulse 2.2s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float-3d 8.5s ease-in-out infinite;
        }
        
        .glitch-text:hover {
          animation: glitch-skew 0.65s ease-in-out infinite;
        }
        
        .glitch-active {
          animation: intense-glitch 0.75s ease-in-out infinite;
        }
        
        .glitch-effect-active {
          animation: rgb-split 0.3s ease-in-out;
        }
        
        .glow-effect {
          animation: glow-pulse 3.2s ease-in-out infinite;
        }
        
        .typing-cursor {
          animation: typing-cursor 1s infinite;
        }
        
        .terminal-frame {
          animation: terminal-pulse-3d 3.8s ease-in-out infinite, border-pulse 3.8s ease-in-out infinite;
          transform-style: preserve-3d;
          position: relative;
        }
        
        .terminal-frame::before,
        .terminal-frame::after {
          position: absolute;
          width: 10px;
          height: 10px;
          border: 3px solid;
          animation: corner-flicker 2.2s ease-in-out infinite;
          z-index: 10;
        }
        
        .terminal-frame::before {
          top: -3px;
          left: -3px;
          border-right: none;
          border-bottom: none;
          border-color: #6F29FF;
        }
        
        .terminal-frame::after {
          bottom: -3px;
          right: -3px;
          border-left: none;
          border-top: none;
          border-color: #28FF85;
        }
        
        @media (max-width: 768px) {
          .cyber-font {
            letter-spacing: 0.02em;
          }
          .hack-font {
            letter-spacing: 0.05em;
          }
        }
        
        @media (max-width: 640px) {
          .cyber-font {
            letter-spacing: 0;
          }
        }
      `}</style>

      {isDesktop && (
        <div 
          style={{
            position: 'fixed',
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: `3px solid ${cursorColor}`,
            background: `radial-gradient(circle, rgba(${cursorColorRgb}, 0.35), transparent)`,
            pointerEvents: 'none',
            zIndex: 10001,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 30px ${cursorColor}, inset 0 0 15px ${cursorColor}`,
            transition: 'width 0.15s, height 0.15s',
            mixBlendMode: 'screen'
          }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: cursorColor,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 18px ${cursorColor}, 0 0 8px #fff`
          }}></div>
          
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            right: '0',
            height: '1px',
            background: cursorColor,
            opacity: 0.6
          }}></div>
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '0',
            bottom: '0',
            width: '1px',
            background: cursorColor,
            opacity: 0.6
          }}></div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-xs sm:max-w-md mx-auto px-2" style={{ transformStyle: 'preserve-3d' }}>
        <header className={`text-center mb-6 sm:mb-8 md:mb-12 animate-float ${isGlitching ? 'glitch-active' : ''} ${glitchEffect ? 'glitch-effect-active' : ''}`}>
          <div className="relative mb-4 sm:mb-6 md:mb-8 inline-block">
            <div 
              className="absolute -inset-4 sm:-inset-6 md:-inset-8 blur-3xl glow-effect"
              style={{
                background: `radial-gradient(circle, rgba(111, 41, 255, 0.65), rgba(40, 255, 133, 0.65))`
              }}
            ></div>
            <div 
              className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-5 shadow-2xl overflow-hidden group"
              style={{
                background: 'linear-gradient(90deg, #6F29FF 0%, #6F29FF 50%, #28FF85 50%, #28FF85 100%)',
                border: '3px solid rgba(255, 255, 255, 0.25)',
                boxShadow: `-12px 0 35px rgba(40, 255, 133, 0.95), 12px 0 35px rgba(111, 41, 255, 0.95)`,
                transformStyle: 'preserve-3d'
              }}
            >
              <div 
                className="absolute left-1/2 top-0 bottom-0 w-0.5 sm:w-1"
                style={{
                  background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.8), transparent)',
                  transform: 'translateX(-50%)',
                  boxShadow: '0 0 18px rgba(255, 255, 255, 0.8)'
                }}
              ></div>
              <Cpu 
                className="w-full h-full relative z-20 icon-glow" 
                style={{
                  color: 'rgba(255, 255, 255, 1)',
                  filter: 'drop-shadow(0 0 24px rgba(255, 255, 255, 1))',
                  strokeWidth: 2.5
                }}
              />
            </div>
          </div>
          
          <div className="mb-2 sm:mb-3 md:mb-4 px-2">
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl cyber-font font-black" style={{color: '#6F29FF', textShadow: '0 0 24px rgba(111, 41, 255, 1)'}}>{'< '}</span>
            <h1 className="cyber-font text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black inline-block glitch-text">
              <span 
                style={{
                  background: 'linear-gradient(90deg, #6F29FF 0%, #6FD9AF 50%, #28FF85 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 35px rgba(127, 177, 127, 1))',
                  fontWeight: 900
                }}
              >
                {typedText}
                {isTyping && <span className="typing-cursor">|</span>}
              </span>
            </h1>
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl cyber-font font-black" style={{color: '#28FF85', textShadow: '0 0 24px rgba(40, 255, 133, 1)'}}>{' />'}</span>
          </div>
          
          <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
            <div 
              className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-full relative"
              style={{
                background: 'linear-gradient(90deg, #6F29FF 0%, #6F29FF 50%, #28FF85 50%, #28FF85 100%)',
                border: '2px solid rgba(255, 255, 255, 0.35)',
                boxShadow: '-10px 0 24px rgba(40, 255, 133, 0.75), 10px 0 24px rgba(111, 41, 255, 0.75)',
                transformStyle: 'preserve-3d'
              }}
            >
              <div 
                className="absolute left-1/2 top-0 bottom-0 w-0.5"
                style={{
                  background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.7), transparent)',
                  transform: 'translateX(-50%)',
                  boxShadow: '0 0 12px rgba(255, 255, 255, 0.7)'
                }}
              ></div>
              <Terminal 
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 relative z-10 icon-glow" 
                style={{
                  color: '#28FF85',
                  filter: 'drop-shadow(0 0 12px rgba(111, 41, 255, 1))',
                  strokeWidth: 3
                }} 
              />
              <span 
                className="hack-font text-xs sm:text-sm md:text-base font-bold tracking-wider sm:tracking-widest relative z-10"
                style={{
                  color: 'rgba(255, 255, 255, 1)',
                  textShadow: '0 0 18px rgba(255, 255, 255, 0.95)',
                  fontWeight: 700
                }}
              >
                DEVELOPER
              </span>
              <Terminal 
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 relative z-10 icon-glow" 
                style={{
                  color: '#6F29FF',
                  filter: 'drop-shadow(0 0 12px rgba(40, 255, 133, 1))',
                  strokeWidth: 3
                }} 
              />
            </div>
            
            <div className="relative inline-block" style={{ perspective: '800px', transformStyle: 'preserve-3d' }}>
              <div 
                className="relative terminal-frame"
                style={{
                  background: 'linear-gradient(90deg, rgba(40, 255, 133, 0.4) 0%, rgba(40, 255, 133, 0.4) 50%, rgba(111, 41, 255, 0.4) 50%, rgba(111, 41, 255, 0.4) 100%)',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  overflow: 'visible',
                  transformStyle: 'preserve-3d',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '10px',
                  padding: '3px',
                  background: 'linear-gradient(90deg, #28FF85 0%, #28FF85 50%, #6F29FF 50%, #6F29FF 100%)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  pointerEvents: 'none'
                }}></div>
                
                <div 
                  className="absolute left-1/2 top-0 bottom-0 w-0.5"
                  style={{
                    background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.7), transparent)',
                    transform: 'translateX(-50%) translateZ(10px)',
                    boxShadow: '-3px 0 12px rgba(40, 255, 133, 0.9), 3px 0 12px rgba(111, 41, 255, 0.9)'
                  }}
                ></div>
                
                <p 
                  className="hack-font text-xs sm:text-sm font-bold tracking-wider sm:tracking-widest relative z-10"
                  style={{
                    color: 'rgba(255, 255, 255, 1)',
                    textShadow: `-3px 0 14px rgba(40, 255, 133, 1), 3px 0 14px rgba(111, 41, 255, 1)`,
                    fontWeight: 700,
                    margin: 0,
                    transform: 'translateZ(20px)'
                  }}
                >
                  {'> '}ACCESSVISION.EXE
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="w-full space-y-2.5 sm:space-y-3 md:space-y-4">
          {links.map((link, index) => {
            const Icon = link.icon;
            if (!cardsVisible[index]) return null;
            
            return (
              <div
                key={index}
                className={`card-3d-container ${isGlitching ? 'dissolving' : ''}`}
                onMouseMove={(e) => handleCardMouseMove(e, index)}
                onMouseLeave={() => handleCardMouseLeave(index)}
              >
                <div
                  className="hack-card rounded-lg sm:rounded-xl md:rounded-2xl"
                  style={{ 
                    animationDelay: `${index * 0.2}s`,
                    background: 'linear-gradient(90deg, rgba(40, 255, 133, 0.28) 0%, rgba(40, 255, 133, 0.28) 50%, rgba(111, 41, 255, 0.28) 50%, rgba(111, 41, 255, 0.28) 100%)',
                    position: 'relative',
                    boxShadow: hoveredCard === index 
                      ? `-24px 0 60px rgba(40, 255, 133, 0.95), 24px 0 60px rgba(111, 41, 255, 0.95), 0 24px 70px rgba(0, 0, 0, 0.95)`
                      : `-18px 0 42px rgba(40, 255, 133, 0.75), 18px 0 42px rgba(111, 41, 255, 0.75), 0 12px 48px rgba(0, 0, 0, 0.75)`,
                    borderRadius: window.innerWidth < 640 ? '12px' : window.innerWidth < 768 ? '14px' : '16px',
                    overflow: 'visible',
                    transform: hoveredCard === index && isDesktop
                      ? `perspective(1200px) translateY(-28px) translateZ(35px) rotateX(${card3DRotation[index].x}deg) rotateY(${card3DRotation[index].y}deg) scale(1.1)`
                      : `perspective(1200px) translateY(0) translateZ(0) rotateX(0deg) rotateY(0deg) scale(1)`,
                    transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)'
                  }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: window.innerWidth < 640 ? '12px' : window.innerWidth < 768 ? '14px' : '16px',
                    padding: '4px',
                    background: 'linear-gradient(90deg, #28FF85 0%, #28FF85 50%, #6F29FF 50%, #6F29FF 100%)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    pointerEvents: 'none',
                    zIndex: 1,
                    transform: 'translateZ(2px)'
                  }}></div>
                  
                  <div 
                    className="absolute left-1/2 top-0 bottom-0 w-0.5 sm:w-1"
                    style={{
                      background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.6), transparent)',
                      transform: 'translateX(-50%) translateZ(10px)',
                      boxShadow: '-4px 0 14px rgba(40, 255, 133, 0.85), 4px 0 14px rgba(111, 41, 255, 0.85)',
                      zIndex: 100
                    }}
                  ></div>
                  
                  <a
                    href={link.url}
                    onClick={(e) => handleLinkClick(e, link.url)}
                    className="block group relative"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="relative p-3 sm:p-4 md:p-5 z-10" style={{ transform: 'translateZ(15px)' }}>
                      <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4">
                        <div className="relative flex-shrink-0">
                          <div 
                            className="absolute -inset-1.5 sm:-inset-2 blur-xl transition-all duration-500"
                            style={{
                              background: `linear-gradient(90deg, rgba(40, 255, 133, ${hoveredCard === index ? 0.85 : 0.55}) 0%, rgba(40, 255, 133, ${hoveredCard === index ? 0.85 : 0.55}) 50%, rgba(111, 41, 255, ${hoveredCard === index ? 0.85 : 0.55}) 50%, rgba(111, 41, 255, ${hoveredCard === index ? 0.85 : 0.55}) 100%)`,
                              opacity: hoveredCard === index ? 1 : 0.9
                            }}
                          ></div>
                          <div 
                            className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-md sm:rounded-lg md:rounded-xl transition-all duration-600 flex items-center justify-center"
                            style={{
                              background: `linear-gradient(90deg, #28FF85 0%, #28FF85 50%, #6F29FF 50%, #6F29FF 100%)`,
                              boxShadow: `-12px 0 35px rgba(40, 255, 133, ${hoveredCard === index ? 1 : 0.85}), 12px 0 35px rgba(111, 41, 255, ${hoveredCard === index ? 1 : 0.85}), inset 0 0 24px rgba(255, 255, 255, 0.3)`,
                              transform: hoveredCard === index && isDesktop ? 'scale(1.3) rotate(15deg) translateZ(25px)' : 'scale(1) rotate(0deg) translateZ(0)',
                              overflow: 'visible',
                              position: 'relative',
                              transformStyle: 'preserve-3d'
                            }}
                          >
                            <div style={{
                              position: 'absolute',
                              inset: 0,
                              borderRadius: window.innerWidth < 640 ? '6px' : window.innerWidth < 768 ? '8px' : '12px',
                              padding: '3px',
                              background: 'linear-gradient(90deg, #28FF85 0%, #28FF85 50%, #6F29FF 50%, #6F29FF 100%)',
                              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                              WebkitMaskComposite: 'xor',
                              maskComposite: 'exclude',
                              pointerEvents: 'none'
                            }}></div>
                            
                            <div 
                              className="absolute left-1/2 top-0 bottom-0 w-0.5"
                              style={{
                                background: 'rgba(255, 255, 255, 0.6)',
                                transform: 'translateX(-50%)',
                                zIndex: 50
                              }}
                            ></div>
                            <Icon 
                              className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 hack-icon relative z-10" 
                              strokeWidth={3}
                              style={{
                                color: 'rgba(255, 255, 255, 0.98)',
                                filter: `drop-shadow(-6px 0 12px rgba(40, 255, 133, 1)) drop-shadow(6px 0 12px rgba(111, 41, 255, 1))`
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                            <span 
                              className="hack-font text-xs font-bold px-1 sm:px-1.5 py-0.5 rounded relative"
                              style={{
                                background: `linear-gradient(90deg, rgba(40, 255, 133, 0.55) 0%, rgba(40, 255, 133, 0.55) 50%, rgba(111, 41, 255, 0.55) 50%, rgba(111, 41, 255, 0.55) 100%)`,
                                overflow: 'visible'
                              }}
                            >
                              <div style={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '4px',
                                padding: '2px',
                                background: 'linear-gradient(90deg, #28FF85 0%, #28FF85 50%, #6F29FF 50%, #6F29FF 100%)',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude',
                                pointerEvents: 'none'
                              }}></div>
                              <span className="relative z-10" style={{
                                color: 'white',
                                textShadow: `-2px 0 10px rgba(40, 255, 133, 1), 2px 0 10px rgba(111, 41, 255, 1)`
                              }}>{link.tag}</span>
                            </span>
                            <h3 
                              className="cyber-font text-base sm:text-lg md:text-xl lg:text-2xl font-black transition-all duration-500 tracking-tight glitch-text"
                              style={{
                                color: 'white',
                                textShadow: `-4px 0 18px rgba(40, 255, 133, ${hoveredCard === index ? 1 : 0.85}), 4px 0 18px rgba(111, 41, 255, ${hoveredCard === index ? 1 : 0.85})`,
                                transform: hoveredCard === index ? 'translateX(8px)' : 'translateX(0)',
                                fontWeight: 900
                              }}
                            >
                              {link.title}
                            </h3>
                          </div>
                          <p 
                            className="hack-font text-xs sm:text-sm font-semibold transition-all duration-500 tracking-wide"
                            style={{
                              color: 'rgba(255, 255, 255, 0.95)',
                              opacity: hoveredCard === index ? 1 : 0.9,
                              textShadow: `-2px 0 12px rgba(40, 255, 133, ${hoveredCard === index ? 0.95 : 0.65}), 2px 0 12px rgba(111, 41, 255, ${hoveredCard === index ? 0.95 : 0.65})`,
                              fontWeight: 700
                            }}
                          >
                            {'>> '}{link.subtitle}
                          </p>
                          <div 
                            className="rounded-full mt-1.5 sm:mt-2 transition-all duration-700 relative overflow-hidden"
                            style={{
                              height: '3px',
                              width: hoveredCard === index ? '100%' : '0%',
                              background: 'linear-gradient(90deg, #28FF85 0%, #28FF85 50%, #6F29FF 50%, #6F29FF 100%)',
                              boxShadow: `-6px 0 18px rgba(40, 255, 133, 1), 6px 0 18px rgba(111, 41, 255, 1)`
                            }}
                          ></div>
                        </div>
                        
                        <div 
                          className="transition-all duration-600 flex-shrink-0"
                          style={{
                            opacity: hoveredCard === index ? 1 : 0.7,
                            transform: hoveredCard === index && isDesktop ? 'translateX(8px) scale(1.5) translateZ(12px)' : 'translateX(0) scale(1) translateZ(0)'
                          }}
                        >
                          <ArrowRight 
                            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" 
                            strokeWidth={3}
                            style={{
                              color: 'white',
                              filter: `-6px 0 14px rgba(40, 255, 133, ${hoveredCard === index ? 1 : 0.85}), 6px 0 14px rgba(111, 41, 255, ${hoveredCard === index ? 1 : 0.85})`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
