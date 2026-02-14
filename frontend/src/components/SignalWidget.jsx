import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SignalWidget = ({ onDecrypt, onNotification }) => {
    const [signalActive, setSignalActive] = useState(false);
    const [signalType, setSignalType] = useState(null); // 'standard', 'encrypted', 'omega'

    useEffect(() => {
        // Random signal detection logic (simulating intercepted transmissions)
        const loop = () => {
            const delay = Math.random() * 120000 + 60000; // 1-3 minutes
            setTimeout(() => {
                const roll = Math.random();
                let type = 'standard';
                if (roll > 0.95) type = 'omega';
                else if (roll > 0.8) type = 'encrypted';

                setSignalType(type);
                setSignalActive(true);

                // Auto-expire signal if not intercepted
                setTimeout(() => {
                    setSignalActive(false);
                }, 45000);

                loop();
            }, delay);
        };

        const timer = setTimeout(loop, 5000); // Start loop
        return () => clearTimeout(timer);
    }, []);

    const handleIntercept = () => {
        if (!signalActive) return;

        // Decrypt/Claim logic
        const rewards = {
            standard: { xp: 30, text: "DATA PACKET DECODED" },
            encrypted: { xp: 75, text: "ENCRYPTED SIGNAL CRACKED" },
            omega: { xp: 200, text: "OMEGA PROTOCOL INTERCEPTED" }
        };

        const reward = rewards[signalType] || rewards.standard;
        setSignalActive(false);
        onDecrypt?.(reward.xp, reward.text);
        onNotification?.(reward.text, signalType === 'omega' ? 'legendary' : 'success');
    };

    return (
        <div className="flex items-center mx-2 h-full">
            <AnimatePresence>
                {signalActive ? (
                    <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleIntercept}
                        className={`flex items-center gap-2 px-2 py-0.5 rounded cursor-pointer border ${signalType === 'omega' ? 'bg-amber-500/20 border-amber-500 text-amber-500 animate-pulse' :
                                signalType === 'encrypted' ? 'bg-purple-500/20 border-purple-500 text-purple-400' :
                                    'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                            }`}
                        title="Incoming Signal Detected - Click to Intercept"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${signalType === 'omega' ? 'bg-amber-400' : signalType === 'encrypted' ? 'bg-purple-400' : 'bg-cyan-400'
                                }`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${signalType === 'omega' ? 'bg-amber-500' : signalType === 'encrypted' ? 'bg-purple-500' : 'bg-cyan-500'
                                }`}></span>
                        </span>
                        <span className="text-[10px] font-bold tracking-wider">
                            {signalType === 'omega' ? 'OMEGA_SIG' : signalType === 'encrypted' ? 'ENCRYPTED' : 'SIGNAL'}
                        </span>
                    </motion.button>
                ) : (
                    <div className="flex items-center gap-1.5 opacity-30 px-2" title="Scanning for signals...">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyber-green/50 animate-pulse"></div>
                        <span className="text-[9px] font-mono text-cyber-green/50">SCANNING...</span>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SignalWidget;
