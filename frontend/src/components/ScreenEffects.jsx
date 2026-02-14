import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScreenEffects = React.forwardRef(({ onNotification }, ref) => {
    const [glitchActive, setGlitchActive] = useState(false);
    const [shakeActive, setShakeActive] = useState(false);
    const [particles, setParticles] = useState([]);
    const [intruderAlert, setIntruderAlert] = useState(false);
    const [crtFlicker, setCrtFlicker] = useState(false);
    const particleId = useRef(0);

    // Expose effects to parent
    const triggerShake = useCallback(() => {
        setShakeActive(true);
        setTimeout(() => setShakeActive(false), 500);
    }, []);

    const triggerGlitch = useCallback(() => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 300);
    }, []);

    const spawnParticles = useCallback((count = 12) => {
        const newParticles = Array.from({ length: count }, () => ({
            id: ++particleId.current,
            x: 45 + Math.random() * 10,
            y: 45 + Math.random() * 10,
            dx: (Math.random() - 0.5) * 200,
            dy: (Math.random() - 0.5) * 200 - 100,
            size: 3 + Math.random() * 6,
            color: ['#00ff41', '#f59e0b', '#22d3ee', '#a855f7', '#ff0041'][Math.floor(Math.random() * 5)],
        }));
        setParticles(prev => [...prev, ...newParticles]);
        setTimeout(() => {
            setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
        }, 1500);
    }, []);

    const triggerIntruder = useCallback(() => {
        setIntruderAlert(true);
        onNotification?.('🚨 INTRUDER DETECTED! System breach attempt!', 'alert');
        setTimeout(() => setIntruderAlert(false), 3000);
    }, [onNotification]);

    React.useImperativeHandle(ref, () => ({
        shake: triggerShake,
        glitch: triggerGlitch,
        particles: spawnParticles,
        intruder: triggerIntruder,
    }), [triggerShake, triggerGlitch, spawnParticles, triggerIntruder]);

    // Random ambient glitches
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.85) {
                triggerGlitch();
            }
        }, 30000 + Math.random() * 60000);
        return () => clearInterval(interval);
    }, [triggerGlitch]);

    // Random CRT flicker
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.8) {
                setCrtFlicker(true);
                setTimeout(() => setCrtFlicker(false), 150);
            }
        }, 15000 + Math.random() * 20000);
        return () => clearInterval(interval);
    }, []);

    // Rare intruder events
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.92) {
                triggerIntruder();
            }
        }, 120000 + Math.random() * 180000);
        return () => clearInterval(interval);
    }, [triggerIntruder]);

    return (
        <>
            {/* Screen shake wrapper class injection */}
            {shakeActive && (
                <style>{`
                    .App { animation: screen-shake 0.5s ease-out; }
                    @keyframes screen-shake {
                        0%, 100% { transform: translate(0,0); }
                        10% { transform: translate(-3px, 2px); }
                        20% { transform: translate(3px, -2px); }
                        30% { transform: translate(-2px, 3px); }
                        40% { transform: translate(2px, -1px); }
                        50% { transform: translate(-1px, 2px); }
                    }
                `}</style>
            )}

            {/* RGB Glitch overlay */}
            <AnimatePresence>
                {glitchActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9998] pointer-events-none"
                        style={{
                            background: 'repeating-linear-gradient(0deg, rgba(255,0,0,0.06) 0px, transparent 2px, transparent 4px)',
                            mixBlendMode: 'screen',
                        }}
                    >
                        <div className="absolute inset-0" style={{
                            background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.15) 50%)',
                            backgroundSize: '100% 4px',
                        }} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CRT Flicker */}
            {crtFlicker && (
                <div className="fixed inset-0 z-[9997] pointer-events-none bg-white/5" />
            )}

            {/* Particles */}
            <AnimatePresence>
                {particles.map(p => (
                    <motion.div
                        key={p.id}
                        initial={{ left: `${p.x}%`, top: `${p.y}%`, scale: 1, opacity: 1 }}
                        animate={{
                            left: `${p.x + p.dx / 5}%`,
                            top: `${p.y + p.dy / 5}%`,
                            scale: 0,
                            opacity: 0,
                        }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="fixed z-[9996] pointer-events-none rounded-full"
                        style={{
                            width: p.size,
                            height: p.size,
                            backgroundColor: p.color,
                            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* Intruder Alert */}
            <AnimatePresence>
                {intruderAlert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.3, 0, 0.2, 0, 0.15] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3, times: [0, 0.1, 0.2, 0.4, 0.6, 1] }}
                        className="fixed inset-0 z-[9995] pointer-events-none bg-red-900/30 border-4 border-red-500/50"
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 font-bold text-2xl animate-pulse font-mono">
                            ⚠ INTRUSION DETECTED ⚠
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
});

ScreenEffects.displayName = 'ScreenEffects';

export default ScreenEffects;
