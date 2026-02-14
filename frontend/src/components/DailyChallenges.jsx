import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CHALLENGE_POOL = [
    { id: 'cmd5', title: 'COMMAND BURST', desc: 'Execute 5 commands', stat: 'commandCount', target: 5, xp: 100, icon: '⌨️' },
    { id: 'cmd15', title: 'OPERATOR', desc: 'Execute 15 commands', stat: 'commandCount', target: 15, xp: 200, icon: '💻' },
    { id: 'dir3', title: 'PATH FINDER', desc: 'Browse 3 directories', stat: 'dirsVisited', target: 3, xp: 100, icon: '📁' },
    { id: 'file2', title: 'CREATOR', desc: 'Create 2 files', stat: 'filesCreated', target: 2, xp: 150, icon: '📝' },
    { id: 'read3', title: 'DATA HARVEST', desc: 'Read 3 files with cat', stat: 'filesRead', target: 3, xp: 120, icon: '📖' },
    { id: 'scan2', title: 'RECON MISSION', desc: 'Run 2 scan commands', stat: 'scansRun', target: 2, xp: 130, icon: '📡' },
    { id: 'hack1', title: 'ROOT ACCESS', desc: 'Win the hacking minigame', stat: 'hackWins', target: 1, xp: 250, icon: '🏴' },
    { id: 'time5', title: 'PERSISTENCE', desc: 'Stay online for 5 min', stat: 'sessionSeconds', target: 300, xp: 100, icon: '⏱️' },
    { id: 'time10', title: 'DEEP STATE', desc: 'Stay online for 10 min', stat: 'sessionSeconds', target: 600, xp: 200, icon: '🌊' },
    { id: 'decrypt1', title: 'CIPHER BREAK', desc: 'Run decrypt command', stat: 'decryptsRun', target: 1, xp: 175, icon: '🔑' },
];

const getDailySeed = () => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const seededRandom = (seed) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
};

const getDailyChallenges = () => {
    const seed = getDailySeed();
    const hash = seededRandom(seed);
    const indices = [];
    let h = hash;
    while (indices.length < 3) {
        const idx = h % CHALLENGE_POOL.length;
        if (!indices.includes(idx)) indices.push(idx);
        h = seededRandom(seed + indices.length + h);
    }
    return indices.map(i => CHALLENGE_POOL[i]);
};

const DailyChallenges = ({ stats, onXPGain, onNotification }) => {
    const [showPanel, setShowPanel] = useState(false);
    const [challenges] = useState(getDailyChallenges);
    const [completedToday, setCompletedToday] = useState(() => {
        const saved = localStorage.getItem('cyber_daily_completed');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.date === getDailySeed()) return parsed.ids;
        }
        return [];
    });
    const [dailyStreak, setDailyStreak] = useState(() =>
        parseInt(localStorage.getItem('cyber_daily_streak') || '0')
    );
    const [bonusClaimed, setBonusClaimed] = useState(() => {
        const saved = localStorage.getItem('cyber_daily_bonus');
        return saved === getDailySeed();
    });

    // Get time until reset
    const [timeLeft, setTimeLeft] = useState('');
    useEffect(() => {
        const update = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            const diff = tomorrow - now;
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            setTimeLeft(`${h}h ${m}m`);
        };
        update();
        const t = setInterval(update, 60000);
        return () => clearInterval(t);
    }, []);

    // Check challenge completion based on session stats
    useEffect(() => {
        if (!stats) return;
        challenges.forEach(ch => {
            if (completedToday.includes(ch.id)) return;
            const current = stats[ch.stat] || 0;
            if (current >= ch.target) {
                const newCompleted = [...completedToday, ch.id];
                setCompletedToday(newCompleted);
                localStorage.setItem('cyber_daily_completed', JSON.stringify({ date: getDailySeed(), ids: newCompleted }));
                onXPGain?.(ch.xp, `DAILY: ${ch.title}`);
                onNotification?.(`✅ Daily Challenge Complete: ${ch.title}!`, 'success');
            }
        });
    }, [stats]);

    // Check all-complete bonus
    useEffect(() => {
        if (bonusClaimed) return;
        if (completedToday.length === 3) {
            const streakMultiplier = Math.min(3, 1 + dailyStreak * 0.5);
            const bonusXP = Math.floor(300 * streakMultiplier);
            onXPGain?.(bonusXP, `ALL DAILIES! ${streakMultiplier}x STREAK`);
            onNotification?.(`🎉 ALL DAILIES COMPLETE! +${bonusXP} BONUS XP (${streakMultiplier}x streak)`, 'legendary');

            const newStreak = dailyStreak + 1;
            setDailyStreak(newStreak);
            localStorage.setItem('cyber_daily_streak', String(newStreak));
            setBonusClaimed(true);
            localStorage.setItem('cyber_daily_bonus', getDailySeed());
        }
    }, [completedToday]);

    const allComplete = completedToday.length >= 3;

    return (
        <>
            {/* Taskbar button */}
            <button
                onClick={() => setShowPanel(!showPanel)}
                className={`text-xs px-2 py-1 border transition-all ${allComplete
                    ? 'text-green-400 border-green-400/50 hover:border-green-400'
                    : 'text-cyan-400 border-cyan-400/30 hover:border-cyan-400'
                    }`}
                title="Daily Challenges"
            >
                📋 {completedToday.length}/3
            </button>

            {/* Panel */}
            <AnimatePresence>
                {showPanel && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-14 right-4 w-80 bg-black/98 border border-cyan-400/50 z-[150] font-mono shadow-[0_0_30px_rgba(34,211,238,0.15)] backdrop-blur-md"
                    >
                        <div className="p-3 border-b border-cyan-400/30 bg-cyan-400/5 flex justify-between items-center">
                            <div>
                                <span className="text-cyan-400 font-bold text-sm">DAILY OPS</span>
                                <span className="text-cyan-400/40 text-[10px] ml-2">Resets in {timeLeft}</span>
                            </div>
                            <button onClick={() => setShowPanel(false)} className="text-cyan-400 hover:text-white text-xs">[X]</button>
                        </div>

                        {/* Streak info */}
                        {dailyStreak > 0 && (
                            <div className="px-3 py-1.5 bg-amber-900/20 border-b border-amber-400/20 text-xs">
                                <span className="text-amber-400">🔥 {dailyStreak}-day streak</span>
                                <span className="text-amber-400/50 ml-2">({Math.min(3, 1 + dailyStreak * 0.5)}x multiplier)</span>
                            </div>
                        )}

                        <div className="p-3 space-y-2">
                            {challenges.map(ch => {
                                const done = completedToday.includes(ch.id);
                                const current = Math.min(stats?.[ch.stat] || 0, ch.target);
                                const progress = (current / ch.target) * 100;
                                return (
                                    <div key={ch.id} className={`p-2 border rounded-sm transition-all ${done
                                        ? 'border-green-500/40 bg-green-900/10'
                                        : 'border-cyan-400/20 hover:border-cyan-400/40'
                                        }`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg">{ch.icon}</span>
                                            <div className="flex-1">
                                                <div className={`text-xs font-bold ${done ? 'text-green-400 line-through' : 'text-cyan-400'}`}>
                                                    {ch.title}
                                                </div>
                                                <div className="text-[10px] text-gray-500">{ch.desc}</div>
                                            </div>
                                            <span className={`text-[10px] font-bold ${done ? 'text-green-400' : 'text-cyan-400/60'}`}>
                                                +{ch.xp} XP
                                            </span>
                                        </div>
                                        {!done && (
                                            <div className="w-full h-1 bg-gray-800 rounded overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300"
                                                    style={{ width: `${progress}%` }} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bonus */}
                        <div className={`p-2 mx-3 mb-3 border text-center text-xs ${allComplete
                            ? 'border-amber-400/50 bg-amber-900/20 text-amber-400'
                            : 'border-gray-800 text-gray-600'
                            }`}>
                            {allComplete ? '🎉 ALL COMPLETE! BONUS CLAIMED!' : '🎁 Complete all 3 for BONUS REWARD'}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default DailyChallenges;
