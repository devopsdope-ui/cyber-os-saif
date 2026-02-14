import React, { useState } from 'react';
import { ACHIEVEMENTS, xpForLevel } from '../AchievementSystem';

const RANKS = [
    { minLevel: 1, title: 'SCRIPT KIDDIE', icon: '🔰', color: 'text-gray-400' },
    { minLevel: 3, title: 'HACKER', icon: '💻', color: 'text-green-400' },
    { minLevel: 5, title: 'ELITE OPERATOR', icon: '⚡', color: 'text-blue-400' },
    { minLevel: 8, title: 'GHOST', icon: '👻', color: 'text-purple-400' },
    { minLevel: 12, title: 'PHANTOM', icon: '🕶️', color: 'text-cyan-400' },
    { minLevel: 15, title: 'SHADOW LORD', icon: '👑', color: 'text-amber-400' },
    { minLevel: 20, title: 'DIGITAL GOD', icon: '🌟', color: 'text-amber-300' },
];

const getRank = (level) => {
    let rank = RANKS[0];
    for (const r of RANKS) {
        if (level >= r.minLevel) rank = r;
    }
    return rank;
};

const ProfileDashboard = ({ onClose, isFocused, stats, totalXP, level, streak }) => {
    const [activeTab, setActiveTab] = useState('stats');
    const rank = getRank(level);

    const unlockedAch = (() => {
        const saved = localStorage.getItem('cyber_achievements');
        return saved ? JSON.parse(saved) : [];
    })();

    const unlockedThemes = (() => {
        const saved = localStorage.getItem('cyber_unlocked_themes');
        return saved ? JSON.parse(saved) : ['green', 'blue', 'red', 'amber'];
    })();

    const lootHistory = (() => {
        const saved = localStorage.getItem('cyber_loot_collected');
        return saved ? JSON.parse(saved) : [];
    })();

    const currentLevelXP = xpForLevel(level);
    const xpInLevel = totalXP - (level > 1 ? Array.from({ length: level - 1 }, (_, i) => xpForLevel(i + 1)).reduce((a, b) => a + b, 0) : 0);
    const progress = Math.min(100, Math.max(0, (xpInLevel / currentLevelXP) * 100));

    // Calculate exploration percentage
    const totalFeatures = 15;
    let explored = 0;
    if (stats?.commandCount > 0) explored++;
    if (stats?.dirsVisited > 0) explored++;
    if (stats?.filesCreated > 0) explored++;
    if (stats?.filesRead > 0) explored++;
    if (stats?.scansRun > 0) explored++;
    if (stats?.decryptsRun > 0) explored++;
    if (stats?.hackWins > 0) explored++;
    if (unlockedThemes.length > 4) explored++;
    if (lootHistory.length > 0) explored++;
    if (streak > 0) explored++;
    if (stats?.sessionSeconds > 300) explored++;
    if (unlockedAch.length > 5) explored++;
    if (stats?.commandCount > 50) explored++;
    if (level >= 5) explored++;
    if (stats?.shadowFound > 0) explored++;
    const explorationPct = Math.round((explored / totalFeatures) * 100);

    const tabs = [
        { id: 'stats', label: 'STATS', icon: '📊' },
        { id: 'achievements', label: 'BADGES', icon: '🏆' },
        { id: 'collection', label: 'LOOT', icon: '🎁' },
    ];

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    return (
        <div className={`w-full h-full bg-black flex flex-col font-mono select-none border-2 ${isFocused ? 'border-cyan-400' : 'border-cyan-900/50'}`}>
            {/* Header */}
            <div className={`flex justify-between items-center p-2 px-3 border-b ${isFocused ? 'bg-cyan-400 text-black' : 'bg-gray-900 text-cyan-400/50 border-cyan-900/50'}`}>
                <span className="font-bold text-sm">USER_PROFILE.EXE</span>
                <button onClick={onClose} className="hover:bg-black/20 px-1 text-xs">[X]</button>
            </div>

            {/* Profile header */}
            <div className="p-4 border-b border-cyan-400/20 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
                <div className="flex items-center gap-4">
                    {/* Avatar circle */}
                    <div className="w-16 h-16 border-2 border-cyan-400 rounded-full flex items-center justify-center text-3xl bg-black/50 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                        {rank.icon}
                    </div>
                    <div className="flex-1">
                        <div className="text-lg font-bold text-white">USER_01</div>
                        <div className={`text-sm font-bold ${rank.color}`}>{rank.title}</div>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-amber-400 text-xs font-bold">LV.{level}</span>
                            <span className="text-cyan-400/50 text-xs">{totalXP} XP</span>
                            {streak > 0 && <span className="text-orange-400 text-xs">🔥 {streak}d</span>}
                        </div>
                    </div>
                </div>
                {/* XP Bar */}
                <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-cyan-400/50 mb-0.5">
                        <span>LV.{level}</span>
                        <span>{Math.floor(xpInLevel)}/{currentLevelXP} XP</span>
                        <span>LV.{level + 1}</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-900 border border-cyan-400/20 rounded overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 transition-all duration-500 xp-bar-glow"
                            style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-cyan-400/20">
                {tabs.map(tab => (
                    <button key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-2 text-xs font-bold transition-all ${activeTab === tab.id
                            ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5'
                            : 'text-gray-600 hover:text-cyan-400/50'}`}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-3">
                {activeTab === 'stats' && (
                    <div className="space-y-3">
                        {/* Exploration */}
                        <div className="border border-cyan-400/20 p-3">
                            <div className="text-xs text-cyan-400 font-bold mb-2">SYSTEM EXPLORATION</div>
                            <div className="flex items-center gap-3">
                                <div className="w-full h-3 bg-gray-900 rounded overflow-hidden flex-1">
                                    <div className="h-full bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-500"
                                        style={{ width: `${explorationPct}%` }} />
                                </div>
                                <span className="text-cyan-400 text-sm font-bold">{explorationPct}%</span>
                            </div>
                        </div>

                        {/* Stat grid */}
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { label: 'Commands', value: stats?.commandCount || 0, icon: '⌨️' },
                                { label: 'Dirs Visited', value: stats?.dirsVisited || 0, icon: '📁' },
                                { label: 'Files Created', value: stats?.filesCreated || 0, icon: '📝' },
                                { label: 'Files Read', value: stats?.filesRead || 0, icon: '📖' },
                                { label: 'Scans Run', value: stats?.scansRun || 0, icon: '📡' },
                                { label: 'Decrypts', value: stats?.decryptsRun || 0, icon: '🔑' },
                                { label: 'Hack Wins', value: stats?.hackWins || 0, icon: '🏴' },
                                { label: 'Session Time', value: formatTime(stats?.sessionSeconds || 0), icon: '⏱️' },
                            ].map(s => (
                                <div key={s.label} className="border border-cyan-400/10 p-2 bg-cyan-900/5">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm">{s.icon}</span>
                                        <span className="text-cyan-400/50 text-[10px]">{s.label}</span>
                                    </div>
                                    <div className="text-white font-bold text-lg mt-0.5">{s.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Next rank */}
                        <div className="border border-purple-400/20 p-3 bg-purple-900/10">
                            <div className="text-xs text-purple-400 font-bold mb-1">NEXT RANK</div>
                            {RANKS.find(r => r.minLevel > level) ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{RANKS.find(r => r.minLevel > level).icon}</span>
                                    <div>
                                        <div className={`text-sm font-bold ${RANKS.find(r => r.minLevel > level).color}`}>
                                            {RANKS.find(r => r.minLevel > level).title}
                                        </div>
                                        <div className="text-[10px] text-gray-500">
                                            Reach Level {RANKS.find(r => r.minLevel > level).minLevel}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-amber-400 text-sm font-bold">MAX RANK ACHIEVED 👑</div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'achievements' && (
                    <div className="space-y-1.5">
                        {ACHIEVEMENTS.map(ach => {
                            const unlocked = unlockedAch.includes(ach.id);
                            return (
                                <div key={ach.id} className={`flex items-center gap-3 p-2 border transition-all ${unlocked
                                    ? 'border-amber-400/30 bg-amber-900/10'
                                    : 'border-gray-800/50 opacity-40'}`}>
                                    <div className={`text-xl ${unlocked ? '' : 'grayscale'}`}>{ach.icon}</div>
                                    <div className="flex-1">
                                        <div className={`text-xs font-bold ${unlocked ? 'text-amber-400' : 'text-gray-600'}`}>
                                            {unlocked ? ach.title : '???'}
                                        </div>
                                        <div className="text-[10px] text-gray-500">{ach.desc}</div>
                                    </div>
                                    {unlocked && <div className="text-[10px] text-amber-400/60">+{ach.xp}</div>}
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'collection' && (
                    <div className="space-y-3">
                        {/* Themes */}
                        <div>
                            <div className="text-xs text-cyan-400 font-bold mb-2">🎨 THEMES ({unlockedThemes.length})</div>
                            <div className="grid grid-cols-3 gap-1.5">
                                {['green', 'blue', 'red', 'amber', 'neon-pink', 'ice-blue', 'vaporwave', 'gold', 'stealth'].map(t => {
                                    const owned = unlockedThemes.includes(t);
                                    return (
                                        <div key={t} className={`p-2 text-center border text-[10px] ${owned
                                            ? 'border-cyan-400/30 text-cyan-400'
                                            : 'border-gray-800 text-gray-700'}`}>
                                            {owned ? '✓ ' : '🔒 '}{t.toUpperCase()}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {/* Loot History */}
                        <div>
                            <div className="text-xs text-cyan-400 font-bold mb-2">📦 LOOT HISTORY ({lootHistory.length})</div>
                            {lootHistory.length === 0 ? (
                                <div className="text-gray-700 text-xs text-center py-4">No loot collected yet. Watch for crates!</div>
                            ) : (
                                <div className="space-y-1">
                                    {lootHistory.slice(-10).reverse().map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 p-1.5 border border-gray-800/50 text-xs">
                                            <span>{item.icon}</span>
                                            <span className="text-gray-400 flex-1 truncate">{item.name}</span>
                                            <span className="text-gray-600 text-[10px]">
                                                {new Date(item.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-cyan-400/20 text-[10px] text-cyan-400/30 flex justify-between">
                <span>{rank.icon} {rank.title}</span>
                <span>CYBER_OS v2.1</span>
            </div>
        </div>
    );
};

export default ProfileDashboard;
