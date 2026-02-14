import React, { useState, useEffect, useCallback } from 'react';
import { useSoundEffects } from '../hooks/useSoundEffects';

const BootSequence = ({ onComplete }) => {
    const [lines, setLines] = useState([]);
    const [progress, setProgress] = useState(0);
    const [canSkip, setCanSkip] = useState(false);
    const [skipHover, setSkipHover] = useState(false);
    const { playTypingSound, playSuccessSound } = useSoundEffects();

    // Load returning user stats
    const level = parseInt(localStorage.getItem('cyber_level') || '1');
    const streak = parseInt(localStorage.getItem('cyber_streak') || '0');
    const totalXP = parseInt(localStorage.getItem('cyber_total_xp') || '0');
    const isReturning = totalXP > 0;

    const RANKS = [
        { minLevel: 1, title: 'SCRIPT KIDDIE', icon: '🔰' },
        { minLevel: 3, title: 'HACKER', icon: '💻' },
        { minLevel: 5, title: 'ELITE OPERATOR', icon: '⚡' },
        { minLevel: 8, title: 'GHOST', icon: '👻' },
        { minLevel: 12, title: 'PHANTOM', icon: '🕶️' },
        { minLevel: 15, title: 'SHADOW LORD', icon: '👑' },
        { minLevel: 20, title: 'DIGITAL GOD', icon: '🌟' },
    ];

    const getRank = (lvl) => {
        let rank = RANKS[0];
        for (const r of RANKS) {
            if (lvl >= r.minLevel) rank = r;
        }
        return rank;
    };
    const rank = getRank(level);

    // Allow skip after 2 seconds
    useEffect(() => {
        const t = setTimeout(() => setCanSkip(true), 2000);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const bootText = [
            "BIOS DATE 01/15/2077 14:22:56 VER 1.0.2",
            "CPU: QUANTUM CORE i9-9900K @ 8.2 GHz",
            "Memory Test: 65536K .......... OK",
            "Detecting Primary Master ... CYBER_DRIVE_V1",
            "Detecting Primary Slave ... NONE",
            "Booting from Hard Disk...",
            "Loading Kernel v4.19-PHANTOM...",
            "Loading CYBER_OS v2.1 [QUANTUM BUILD]...",
            "Initializing Graphics Engine... OK",
            "Initializing Audio Subsystem... OK",
            "Initializing Network... CONNECTED to DR_NET",
            "Establishing encrypted tunnel... OK",
            "Mounting File System... OK",
            "Loading Achievement Engine... OK",
            "Loading Loot System... OK",
            "Loading Daily Operations... OK",
            "Initializing Threat Detection... ARMED",
            "Starting Desktop Environment...",
            ...(isReturning ? [
                "",
                `╔═══════════════════════════════════════╗`,
                `║  WELCOME BACK, ${rank.icon} ${rank.title.padEnd(18)}  ║`,
                `║  Level: ${String(level).padEnd(3)} | XP: ${String(totalXP).padEnd(6)}           ║`,
                ...(streak > 1 ? [`║  🔥 Login Streak: ${streak} days${' '.repeat(Math.max(0, 14 - String(streak).length))}  ║`] : []),
                `║  ⚠ THREAT LEVEL: ELEVATED             ║`,
                `╚═══════════════════════════════════════╝`,
            ] : [
                "",
                "╔═══════════════════════════════════════╗",
                "║  WELCOME, NEW OPERATOR                 ║",
                "║  Type 'help' in terminal to begin.     ║",
                "║  Explore. Hack. Collect. Level Up.      ║",
                "╚═══════════════════════════════════════╝",
            ]),
        ];

        let delay = 0;
        bootText.forEach((line, index) => {
            delay += Math.random() * 150 + 40;
            setTimeout(() => {
                setLines(prev => [...prev, line]);
                setProgress(Math.floor(((index + 1) / bootText.length) * 100));

                // Play typing sounds for non-empty lines
                if (line.trim()) {
                    try { playTypingSound(); } catch (e) { /* ignore */ }
                }

                if (index === bootText.length - 1) {
                    try { playSuccessSound(); } catch (e) { /* ignore */ }
                    setTimeout(onComplete, 800);
                }
            }, delay);
        });
    }, [onComplete]);

    return (
        <div className="w-screen h-screen bg-black text-cyber-green font-mono p-8 text-sm md:text-base overflow-hidden cursor-none select-none flex flex-col">
            <div className="flex-1 overflow-hidden">
                {lines.map((line, i) => (
                    <div key={i} className={`fade-in ${line.startsWith('╔') || line.startsWith('╚') || line.startsWith('║')
                        ? 'text-amber-400 font-bold'
                        : line.startsWith('  WELCOME') || line.startsWith('  Level')
                            ? 'text-amber-400 font-bold'
                            : line.includes('THREAT LEVEL')
                                ? 'text-red-500 font-bold animate-pulse'
                                : ''}`}>
                        {line}
                    </div>
                ))}
                <div className="animate-pulse text-xl mt-2">▋</div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
                <div className="flex justify-between text-xs text-cyber-green/50 mb-1">
                    <span>LOADING SYSTEM</span>
                    <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-900 border border-cyber-green/20">
                    <div
                        className="h-full boot-progress-bar transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Skip button */}
            {canSkip && (
                <button
                    onClick={onComplete}
                    onMouseEnter={() => setSkipHover(true)}
                    onMouseLeave={() => setSkipHover(false)}
                    className={`absolute top-4 right-4 text-xs font-mono border px-3 py-1.5 transition-all cursor-pointer ${skipHover
                        ? 'text-white border-white bg-white/10'
                        : 'text-cyber-green/30 border-cyber-green/20 hover:border-cyber-green/40'
                        }`}
                >
                    SKIP [ESC] ▸
                </button>
            )}
        </div>
    );
};

export default BootSequence;
