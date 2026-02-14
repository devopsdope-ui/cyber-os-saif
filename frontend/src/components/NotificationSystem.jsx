import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NOTIFICATION_STYLES = {
    success: { border: 'border-green-400', text: 'text-green-400', icon: '✅', glow: 'shadow-[0_0_15px_rgba(74,222,128,0.3)]' },
    warning: { border: 'border-amber-400', text: 'text-amber-400', icon: '⚠️', glow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]' },
    error: { border: 'border-red-400', text: 'text-red-400', icon: '❌', glow: 'shadow-[0_0_15px_rgba(248,113,113,0.3)]' },
    info: { border: 'border-cyan-400', text: 'text-cyan-400', icon: 'ℹ️', glow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]' },
    legendary: { border: 'border-amber-400', text: 'text-amber-400', icon: '👑', glow: 'shadow-[0_0_25px_rgba(251,191,36,0.5)]' },
    alert: { border: 'border-red-500', text: 'text-red-500', icon: '🚨', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]' },
};

const NotificationSystem = React.forwardRef((props, ref) => {
    const [notifications, setNotifications] = useState([]);
    const idCounter = useRef(0);

    const addNotification = useCallback((message, type = 'info', duration = 4000) => {
        const id = ++idCounter.current;
        setNotifications(prev => [...prev.slice(-4), { id, message, type, timestamp: Date.now() }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, duration);
    }, []);

    // Expose addNotification to parent via ref
    React.useImperativeHandle(ref, () => ({
        notify: addNotification,
    }), [addNotification]);

    // Random system notifications
    useEffect(() => {
        const messages = [
            ['🛡️ Firewall integrity: 99.7%', 'info'],
            ['📡 Satellite uplink refreshed', 'info'],
            ['🔒 Encryption rotation complete', 'success'],
            ['⚡ Power grid stable', 'info'],
            ['🌐 VPN tunnel renegotiated', 'info'],
        ];
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                const [msg, type] = messages[Math.floor(Math.random() * messages.length)];
                addNotification(msg, type, 3000);
            }
        }, 45000);
        return () => clearInterval(interval);
    }, [addNotification]);

    return (
        <div className="fixed top-4 right-4 z-[180] flex flex-col gap-2 pointer-events-none max-w-xs">
            <AnimatePresence>
                {notifications.map(notif => {
                    const style = NOTIFICATION_STYLES[notif.type] || NOTIFICATION_STYLES.info;
                    return (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: 300, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 300, scale: 0.8 }}
                            transition={{ type: 'spring', damping: 20 }}
                            className={`bg-black/95 border ${style.border} ${style.glow} px-4 py-2.5 font-mono pointer-events-auto backdrop-blur-sm`}
                        >
                            <div className="flex items-start gap-2">
                                <span className="text-sm shrink-0">{style.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className={`text-xs ${style.text} leading-tight`}>{notif.message}</div>
                                    <div className="text-[8px] text-gray-600 mt-0.5">
                                        {new Date(notif.timestamp).toLocaleTimeString([], { hour12: false })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
});

NotificationSystem.displayName = 'NotificationSystem';

export default NotificationSystem;
