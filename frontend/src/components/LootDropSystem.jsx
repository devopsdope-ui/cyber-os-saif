import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RARITY = {
    COMMON: { name: 'COMMON', color: 'text-green-400', border: 'border-green-400', glow: 'shadow-[0_0_20px_rgba(74,222,128,0.5)]', bg: 'bg-green-900/20', chance: 0.50 },
    UNCOMMON: { name: 'UNCOMMON', color: 'text-blue-400', border: 'border-blue-400', glow: 'shadow-[0_0_25px_rgba(96,165,250,0.5)]', bg: 'bg-blue-900/20', chance: 0.30 },
    RARE: { name: 'RARE', color: 'text-purple-400', border: 'border-purple-400', glow: 'shadow-[0_0_30px_rgba(192,132,252,0.5)]', bg: 'bg-purple-900/20', chance: 0.15 },
    LEGENDARY: { name: 'LEGENDARY', color: 'text-amber-400', border: 'border-amber-400', glow: 'shadow-[0_0_40px_rgba(251,191,36,0.6)]', bg: 'bg-amber-900/20', chance: 0.05 },
};

const LOOT_TABLE = [
    { name: '+25 XP Boost', rarity: 'COMMON', type: 'xp', value: 25, icon: '⚡' },
    { name: '+50 XP Surge', rarity: 'COMMON', type: 'xp', value: 50, icon: '⚡' },
    { name: '+75 XP Wave', rarity: 'UNCOMMON', type: 'xp', value: 75, icon: '💎' },
    { name: '+150 XP Storm', rarity: 'RARE', type: 'xp', value: 150, icon: '🌩️' },
    { name: '+500 XP Jackpot!', rarity: 'LEGENDARY', type: 'xp', value: 500, icon: '👑' },
    { name: 'Neon Pink Theme', rarity: 'UNCOMMON', type: 'theme', value: 'neon-pink', icon: '🎨' },
    { name: 'Ice Blue Theme', rarity: 'UNCOMMON', type: 'theme', value: 'ice-blue', icon: '❄️' },
    { name: 'Vaporwave Theme', rarity: 'RARE', type: 'theme', value: 'vaporwave', icon: '🌸' },
    { name: 'Gold Matrix Theme', rarity: 'RARE', type: 'theme', value: 'gold', icon: '✨' },
    { name: 'Stealth Dark Theme', rarity: 'RARE', type: 'theme', value: 'stealth', icon: '🕶️' },
    { name: 'Secret Intel File', rarity: 'UNCOMMON', type: 'secret', value: 'CLASSIFIED DATA:\nProject PHANTOM initiated.\nCoordinates: 41.40338, 2.17403\nAccess Code: DELTA-7-OMEGA', icon: '📄' },
    { name: 'Encrypted Manifest', rarity: 'RARE', type: 'secret', value: 'DECRYPTED MESSAGE:\n> The shadow network knows.\n> Node 7G is compromised.\n> Trust no one. Especially USER_02.', icon: '🔐' },
    { name: 'ASCII Art: Skull', rarity: 'LEGENDARY', type: 'collectible', value: 'skull', icon: '💀' },
    { name: 'ASCII Art: Dragon', rarity: 'LEGENDARY', type: 'collectible', value: 'dragon', icon: '🐉' },
];

const rollLoot = () => {
    const roll = Math.random();
    let rarity;
    if (roll < RARITY.LEGENDARY.chance) rarity = 'LEGENDARY';
    else if (roll < RARITY.LEGENDARY.chance + RARITY.RARE.chance) rarity = 'RARE';
    else if (roll < RARITY.LEGENDARY.chance + RARITY.RARE.chance + RARITY.UNCOMMON.chance) rarity = 'UNCOMMON';
    else rarity = 'COMMON';

    const pool = LOOT_TABLE.filter(l => l.rarity === rarity);
    return pool[Math.floor(Math.random() * pool.length)];
};

const LootDropSystem = ({ onXPGain, onThemeUnlock, onNotification }) => {
    const [activeCrate, setActiveCrate] = useState(null);
    const [openedLoot, setOpenedLoot] = useState(null);
    const [isOpening, setIsOpening] = useState(false);
    const [collected, setCollected] = useState(() => {
        const saved = localStorage.getItem('cyber_loot_collected');
        return saved ? JSON.parse(saved) : [];
    });

    // Spawn crates randomly
    useEffect(() => {
        const spawnCrate = () => {
            if (activeCrate) return;
            setActiveCrate({
                id: Date.now(),
                x: 120 + Math.random() * (window.innerWidth - 280),
                y: 80 + Math.random() * (window.innerHeight - 200),
            });
            // Auto-despawn after 30s
            setTimeout(() => {
                setActiveCrate(prev => {
                    if (prev && !isOpening) {
                        onNotification?.('⏰ Loot crate expired!', 'warning');
                        return null;
                    }
                    return prev;
                });
            }, 30000);
        };

        // First crate after 20-40s, then every 3-8 min
        const firstDelay = 20000 + Math.random() * 20000;
        const firstTimer = setTimeout(() => {
            spawnCrate();
        }, firstDelay);

        const interval = setInterval(() => {
            spawnCrate();
        }, 180000 + Math.random() * 300000);

        return () => { clearTimeout(firstTimer); clearInterval(interval); };
    }, [activeCrate, isOpening]);

    const openCrate = useCallback(() => {
        if (!activeCrate || isOpening) return;
        setIsOpening(true);

        // Dramatic opening delay
        setTimeout(() => {
            const loot = rollLoot();
            setOpenedLoot(loot);
            const rarityInfo = RARITY[loot.rarity];

            // Apply reward
            if (loot.type === 'xp') {
                onXPGain?.(loot.value, `LOOT: ${loot.name}`);
            } else if (loot.type === 'theme') {
                onThemeUnlock?.(loot.value);
                onNotification?.(`🎨 Unlocked: ${loot.name}!`, 'success');
            } else {
                onNotification?.(`${loot.icon} Found: ${loot.name}!`, 'success');
            }

            // Save to collection
            const newCollected = [...collected, { ...loot, timestamp: Date.now() }];
            setCollected(newCollected);
            localStorage.setItem('cyber_loot_collected', JSON.stringify(newCollected));

            // Close after viewing
            setTimeout(() => {
                setOpenedLoot(null);
                setActiveCrate(null);
                setIsOpening(false);
            }, 3500);
        }, 1200);
    }, [activeCrate, isOpening, collected, onXPGain, onThemeUnlock, onNotification]);

    return (
        <>
            {/* Floating Crate */}
            <AnimatePresence>
                {activeCrate && !isOpening && (
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                            y: [0, -8, 0],
                        }}
                        exit={{ scale: 0, rotate: 180, opacity: 0 }}
                        transition={{
                            scale: { repeat: Infinity, duration: 2 },
                            rotate: { repeat: Infinity, duration: 3 },
                            y: { repeat: Infinity, duration: 1.5 },
                        }}
                        onClick={openCrate}
                        className="fixed z-[100] cursor-pointer select-none"
                        style={{ left: activeCrate.x, top: activeCrate.y }}
                    >
                        <div className="relative">
                            <div className="text-5xl filter drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]">
                                📦
                            </div>
                            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-amber-400 font-bold whitespace-nowrap animate-pulse">
                                CLICK TO OPEN
                            </div>
                            {/* Timer ring */}
                            <div className="absolute -top-1 -right-1 w-4 h-4 border-2 border-amber-400 rounded-full animate-ping opacity-60"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Opening Animation */}
            <AnimatePresence>
                {isOpening && !openedLoot && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.5, 1, 2, 0.5],
                                rotate: [0, 90, 180, 270, 360],
                            }}
                            transition={{ duration: 1.2 }}
                            className="text-8xl"
                        >
                            📦
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reveal */}
            <AnimatePresence>
                {openedLoot && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center"
                        onClick={() => { setOpenedLoot(null); setActiveCrate(null); setIsOpening(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0, y: -50 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                            className={`border-2 ${RARITY[openedLoot.rarity].border} ${RARITY[openedLoot.rarity].bg} ${RARITY[openedLoot.rarity].glow} p-8 text-center max-w-sm`}
                        >
                            <div className="text-6xl mb-4">{openedLoot.icon}</div>
                            <div className={`text-xs font-bold tracking-widest mb-2 ${RARITY[openedLoot.rarity].color}`}>
                                {RARITY[openedLoot.rarity].name}
                            </div>
                            <div className="text-white font-bold text-lg mb-2">{openedLoot.name}</div>
                            {openedLoot.type === 'secret' && (
                                <pre className="text-xs text-green-400/70 mt-3 text-left bg-black/50 p-2 whitespace-pre-wrap">{openedLoot.value}</pre>
                            )}
                            <div className="text-gray-500 text-xs mt-4">Click anywhere to close</div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default LootDropSystem;
