import React, { useState, useEffect, useRef } from 'react';

const NetworkFeed = ({ onInteractiveEvent }) => {
    const [feed, setFeed] = useState([]);
    const bottomRef = useRef(null);
    const [highlight, setHighlight] = useState(false);
    const [interactiveEvent, setInteractiveEvent] = useState(null);

    const baseMessages = [
        "Scanning port 443... [OPEN]",
        "Intercepting packet 0x4F...",
        "Decryption key fragment found.",
        "System: USER_01 connected.",
        "Warning: Intrusion detected in Sector 7.",
        "Download complete: stealth_kit.v2",
        "Uploading data to secure server...",
        "Proxy chain established: NY → TK → LDN",
        "Firewall breach attempt blocked.",
        "Signal strength: 98%",
        "Mining crypto-shard... Success.",
        "Establishing handshake with ghost protocol.",
        "Error: corrupted memory block ignored.",
        "Accessing dark node...",
        "Trace complete. IP hidden.",
        "Brute-force attempt on PORT 22 detected.",
        "Quantum encryption handshake complete.",
        "Data exfiltration: 2.4TB transferred.",
        "Anonymous relay established via TOR.",
        "Firmware update available: v3.7.1-PHANTOM",
        "ICE barrier detected. Recalibrating...",
        "Node 7G responding to heartbeat.",
        "Memory defrag: recovered 512MB.",
        "Packet loss: 0.02% - ACCEPTABLE",
        "Security audit: PASSED",
        "Rogue process PID:666 terminated.",
        "Satellite uplink: ACTIVE",
        "DNS poisoning attempt neutralized.",
        "Steganographic payload extracted.",
        "Zero-day vulnerability patched.",
        "Darknet marketplace update received.",
        "Shell spawned on remote target.",
        "Certificate pinning: ENFORCED",
        "Botnet C2 traffic rerouted.",
        "Keylogger signature matched. Quarantined.",
        "VPN tunnel MTU optimized: 1420",
        "Honeypot triggered at 10.0.3.77",
        "Blockchain transaction verified.",
        "Kernel panic averted at 0xDEADBEEF",
        "Covert channel established via ICMP",
    ];

    const urgentMessages = [
        "⚠ ALERT: Unknown entity probing firewall!",
        "⚠ CRITICAL: Root access attempt detected!",
        "🔑 RARE KEY FRAGMENT: Available for 30s only!",
        "⚡ BONUS: Double XP active for next command!",
        "🎯 MISSION UPDATE: New objective available.",
        "🔥 THREAT LEVEL: ELEVATED",
    ];

    const socialMessages = [
        "👤 USER_42 just reached Level 15!",
        "👤 PHANTOM_X completed all daily challenges!",
        "👤 GHOST_7 found a LEGENDARY loot crate!",
        "👤 N3TW0RK unlocked 'SHADOW WALKER' badge!",
        "👤 CYB3R_01 is on a 12-day streak! 🔥",
        "👤 D4RK_M4TT3R decoded the secret manifest!",
        "📊 23 users online in the network",
        "📊 47 commands executed in the last hour",
        "📊 Network activity spike detected",
    ];

    const interactiveMessages = [
        { text: "🎯 INTERCEPT: Click to capture data packet! [+75 XP]", xp: 75 },
        { text: "🔑 DECRYPT: Click to crack encryption key! [+100 XP]", xp: 100 },
        { text: "📡 SIGNAL: Click to trace rogue signal! [+50 XP]", xp: 50 },
        { text: "💎 RARE DATA: Click to extract payload! [+125 XP]", xp: 125 },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            const roll = Math.random();
            let msg, isUrgent = false, isSocial = false;

            if (roll > 0.95 && !interactiveEvent) {
                // Interactive event
                const evt = interactiveMessages[Math.floor(Math.random() * interactiveMessages.length)];
                setInteractiveEvent(evt);
                msg = evt.text;
                isUrgent = true;
                // Auto-expire interactive event
                setTimeout(() => setInteractiveEvent(null), 10000);
            } else if (roll > 0.88) {
                isUrgent = true;
                msg = urgentMessages[Math.floor(Math.random() * urgentMessages.length)];
            } else if (roll > 0.78) {
                isSocial = true;
                msg = socialMessages[Math.floor(Math.random() * socialMessages.length)];
            } else {
                msg = baseMessages[Math.floor(Math.random() * baseMessages.length)];
            }

            const timestamp = new Date().toLocaleTimeString([], { hour12: false });

            if (isUrgent) {
                setHighlight(true);
                setTimeout(() => setHighlight(false), 2000);
            }

            setFeed(prev => {
                const newFeed = [...prev, { text: `[${timestamp}] ${msg}`, urgent: isUrgent, social: isSocial }];
                if (newFeed.length > 30) newFeed.shift();
                return newFeed;
            });
        }, 1800 + Math.random() * 1200);

        return () => clearInterval(interval);
    }, [interactiveEvent]);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [feed]);

    const handleInteractiveClick = () => {
        if (interactiveEvent) {
            onInteractiveEvent?.(interactiveEvent.xp);
            setInteractiveEvent(null);
        }
    };

    return (
        <div
            className={`w-64 h-48 bg-black/90 border p-2 font-mono text-xs overflow-hidden flex flex-col select-none relative transition-all duration-500 ${interactiveEvent ? 'border-cyan-400/80 shadow-[0_0_25px_rgba(34,211,238,0.4)] pointer-events-auto cursor-pointer' :
                highlight ? 'border-red-500/80 shadow-[0_0_20px_rgba(255,0,0,0.3)] pointer-events-none' : 'border-cyber-green/20 pointer-events-none'
                }`}
            onClick={interactiveEvent ? handleInteractiveClick : undefined}
        >
            <div className="absolute top-0 right-0 text-[10px] text-cyber-green/40 p-1 flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${interactiveEvent ? 'bg-cyan-400' : 'bg-green-500'}`}></span>
                {interactiveEvent ? 'CLICK ME!' : 'NET_FEED'}
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-0.5 mt-3">
                {feed.map((line, i) => (
                    <div key={i} className={`truncate leading-tight ${line.urgent
                        ? 'text-red-400 font-bold'
                        : line.social
                            ? 'text-cyan-400/70'
                            : i === feed.length - 1
                                ? 'text-cyber-green/90'
                                : 'text-cyber-green/40'
                        }`}>
                        {line.text}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
            <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-black to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>

            {/* Interactive event callout */}
            {interactiveEvent && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-cyan-400 font-bold animate-pulse whitespace-nowrap">
                    ▲ CLICK TO INTERCEPT ▲
                </div>
            )}
        </div>
    );
};

export default NetworkFeed;
