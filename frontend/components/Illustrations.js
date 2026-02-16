/**
 * NeuroGrowth AI — Premium SVG Illustrations
 * Hand-crafted 3D-style illustrations for every section
 */

import { motion } from 'framer-motion';

/* ───────────── 1. Brain/AI Hero (Login Page) ───────────── */
export function BrainIllustration({ className = '', size = 280 }) {
    return (
        <motion.svg
            className={className}
            width={size} height={size} viewBox="0 0 400 400" fill="none"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            {/* Glow */}
            <defs>
                <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="brainGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="brainGrad2" x1="1" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <filter id="brainShadow">
                    <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#6366f1" floodOpacity="0.35" />
                </filter>
            </defs>
            <circle cx="200" cy="200" r="180" fill="url(#brainGlow)" />
            {/* Brain base shape */}
            <motion.g filter="url(#brainShadow)"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
                {/* Left hemisphere */}
                <path d="M200 100 C130 100, 80 150, 80 210 C80 280, 140 320, 200 300"
                    stroke="url(#brainGrad)" strokeWidth="4" fill="url(#brainGrad)" fillOpacity="0.15" strokeLinecap="round" />
                {/* Right hemisphere */}
                <path d="M200 100 C270 100, 320 150, 320 210 C320 280, 260 320, 200 300"
                    stroke="url(#brainGrad2)" strokeWidth="4" fill="url(#brainGrad2)" fillOpacity="0.15" strokeLinecap="round" />
                {/* Neural connections */}
                <motion.circle cx="160" cy="170" r="8" fill="#818cf8"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                />
                <motion.circle cx="240" cy="170" r="8" fill="#c084fc"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.circle cx="180" cy="230" r="6" fill="#f472b6"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                <motion.circle cx="220" cy="230" r="6" fill="#818cf8"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                />
                <motion.circle cx="200" cy="200" r="10" fill="#a855f7"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                {/* Connecting lines */}
                <motion.line x1="160" y1="170" x2="200" y2="200" stroke="#818cf8" strokeWidth="1.5" strokeOpacity="0.5"
                    animate={{ strokeOpacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.line x1="240" y1="170" x2="200" y2="200" stroke="#c084fc" strokeWidth="1.5" strokeOpacity="0.5"
                    animate={{ strokeOpacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.line x1="180" y1="230" x2="200" y2="200" stroke="#f472b6" strokeWidth="1.5" strokeOpacity="0.5"
                    animate={{ strokeOpacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                <motion.line x1="220" y1="230" x2="200" y2="200" stroke="#818cf8" strokeWidth="1.5" strokeOpacity="0.5"
                    animate={{ strokeOpacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                />
            </motion.g>
            {/* Orbiting particles */}
            <motion.circle cx="120" cy="140" r="4" fill="#6366f1"
                animate={{ cx: [120, 280, 120], cy: [140, 260, 140] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.circle cx="280" cy="260" r="3" fill="#ec4899"
                animate={{ cx: [280, 120, 280], cy: [260, 140, 260] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Sparkles */}
            {[
                { x: 130, y: 120, d: 0 }, { x: 290, y: 130, d: 1 },
                { x: 100, y: 250, d: 2 }, { x: 310, y: 270, d: 0.5 },
                { x: 200, y: 90, d: 1.5 },
            ].map((s, i) => (
                <motion.g key={i}
                    animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: s.d }}
                >
                    <line x1={s.x - 5} y1={s.y} x2={s.x + 5} y2={s.y} stroke="#fbbf24" strokeWidth="2" />
                    <line x1={s.x} y1={s.y - 5} x2={s.x} y2={s.y + 5} stroke="#fbbf24" strokeWidth="2" />
                </motion.g>
            ))}
        </motion.svg>
    );
}

/* ───────────── 2. Dashboard Welcome (Rocket + Stars) ───────────── */
export function RocketIllustration({ className = '', size = 200 }) {
    return (
        <motion.svg
            className={className}
            width={size} height={size} viewBox="0 0 300 300" fill="none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <defs>
                <linearGradient id="rocketBody" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>
                <linearGradient id="rocketNose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
                <linearGradient id="flame" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
                <filter id="rocketShadow2">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#6366f1" floodOpacity="0.25" />
                </filter>
            </defs>

            {/* Stars background */}
            {[
                { x: 40, y: 60, s: 3 }, { x: 250, y: 40, s: 2.5 }, { x: 80, y: 220, s: 2 },
                { x: 260, y: 200, s: 3.5 }, { x: 50, y: 150, s: 2 }, { x: 230, y: 120, s: 2.5 },
            ].map((star, i) => (
                <motion.circle key={i} cx={star.x} cy={star.y} r={star.s} fill="#c7d2fe"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
            ))}

            {/* Rocket body */}
            <motion.g filter="url(#rocketShadow2)"
                animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '150px 150px' }}
            >
                {/* Main body */}
                <rect x="130" y="90" width="40" height="100" rx="20" fill="url(#rocketBody)" stroke="#cbd5e1" strokeWidth="1.5" />
                {/* Nose cone */}
                <path d="M130 110 L150 60 L170 110" fill="url(#rocketNose)" />
                {/* Window */}
                <circle cx="150" cy="130" r="12" fill="#dbeafe" stroke="#6366f1" strokeWidth="2" />
                <circle cx="150" cy="130" r="6" fill="#6366f1" fillOpacity="0.3" />
                {/* Fins */}
                <path d="M130 170 L110 200 L130 190" fill="#6366f1" fillOpacity="0.8" />
                <path d="M170 170 L190 200 L170 190" fill="#6366f1" fillOpacity="0.8" />
                {/* Flame */}
                <motion.path
                    d="M135 190 L150 250 L165 190"
                    fill="url(#flame)"
                    animate={{ d: ['M135 190 L150 250 L165 190', 'M135 190 L150 240 L165 190', 'M135 190 L150 250 L165 190'] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                />
                <motion.path
                    d="M140 190 L150 230 L160 190"
                    fill="#fbbf24"
                    fillOpacity="0.8"
                    animate={{ d: ['M140 190 L150 230 L160 190', 'M140 190 L150 220 L160 190', 'M140 190 L150 230 L160 190'] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                />
            </motion.g>

            {/* Smoke particles */}
            {[0, 1, 2].map(i => (
                <motion.circle key={i} cx={140 + i * 10} cy="240" r="6" fill="#e2e8f0"
                    animate={{ y: [0, 30, 60], opacity: [0.6, 0.3, 0], scale: [1, 1.5, 2] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                />
            ))}
        </motion.svg>
    );
}

/* ───────────── 3. Roadmap Map (Winding Path + Flags) ───────────── */
export function RoadmapIllustration({ className = '', size = 200 }) {
    return (
        <motion.svg
            className={className}
            width={size} height={size} viewBox="0 0 300 300" fill="none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
        >
            <defs>
                <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <filter id="mapShadow">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#6366f1" floodOpacity="0.2" />
                </filter>
            </defs>

            {/* Winding path */}
            <motion.path
                d="M40 260 C80 260, 80 200, 120 200 C160 200, 160 140, 200 140 C240 140, 240 80, 280 80"
                stroke="url(#pathGrad)" strokeWidth="6" strokeLinecap="round" fill="none"
                strokeDasharray="8 8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
            />

            {/* Milestone nodes */}
            {[
                { x: 40, y: 260, color: '#6366f1', label: '🏁', delay: 0.5 },
                { x: 120, y: 200, color: '#8b5cf6', label: '📖', delay: 1 },
                { x: 200, y: 140, color: '#a855f7', label: '💡', delay: 1.5 },
                { x: 280, y: 80, color: '#ec4899', label: '🏆', delay: 2 },
            ].map((node, i) => (
                <motion.g key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: node.delay }}
                >
                    <circle cx={node.x} cy={node.y} r="22" fill="white" stroke={node.color} strokeWidth="3" filter="url(#mapShadow)" />
                    <text x={node.x} y={node.y + 6} textAnchor="middle" fontSize="18">{node.label}</text>
                    {/* Pulse ring */}
                    <motion.circle cx={node.x} cy={node.y} r="22" stroke={node.color} strokeWidth="2" fill="none"
                        animate={{ r: [22, 32], opacity: [0.6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: node.delay }}
                    />
                </motion.g>
            ))}

            {/* Floating achievement badges */}
            {[
                { x: 80, y: 160, emoji: '⭐', d: 0 },
                { x: 160, y: 100, emoji: '🔥', d: 1 },
                { x: 240, y: 180, emoji: '✨', d: 2 },
            ].map((b, i) => (
                <motion.text key={i} x={b.x} y={b.y} fontSize="20" textAnchor="middle"
                    animate={{ y: [b.y, b.y - 10, b.y], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, delay: b.d }}
                >
                    {b.emoji}
                </motion.text>
            ))}
        </motion.svg>
    );
}

/* ───────────── 4. Chat Bot Character ───────────── */
export function ChatBotIllustration({ className = '', size = 180 }) {
    return (
        <motion.svg
            className={className}
            width={size} height={size} viewBox="0 0 200 200" fill="none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <defs>
                <linearGradient id="botGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <filter id="botShadow">
                    <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#6366f1" floodOpacity="0.3" />
                </filter>
            </defs>

            <motion.g filter="url(#botShadow)"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
                {/* Body */}
                <rect x="55" y="70" width="90" height="80" rx="20" fill="url(#botGrad)" />
                {/* Head */}
                <rect x="60" y="35" width="80" height="50" rx="18" fill="url(#botGrad)" />
                {/* Eyes */}
                <motion.circle cx="82" cy="58" r="8" fill="white"
                    animate={{ scaleY: [1, 0.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                />
                <motion.circle cx="118" cy="58" r="8" fill="white"
                    animate={{ scaleY: [1, 0.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                />
                <circle cx="82" cy="58" r="4" fill="#1e1b4b" />
                <circle cx="118" cy="58" r="4" fill="#1e1b4b" />
                {/* Mouth */}
                <path d="M90 70 Q100 80, 110 70" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                {/* Antenna */}
                <line x1="100" y1="35" x2="100" y2="18" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
                <motion.circle cx="100" cy="14" r="6" fill="#fbbf24"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
                {/* Arms */}
                <motion.path d="M55 95 L30 110 L35 85" fill="#818cf8" stroke="#6366f1" strokeWidth="1.5" strokeLinejoin="round"
                    animate={{ rotate: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ transformOrigin: '55px 95px' }}
                />
                <motion.path d="M145 95 L170 110 L165 85" fill="#818cf8" stroke="#6366f1" strokeWidth="1.5" strokeLinejoin="round"
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ transformOrigin: '145px 95px' }}
                />
                {/* Chest dot */}
                <motion.circle cx="100" cy="110" r="8" fill="#fbbf24" fillOpacity="0.8"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                {/* Legs */}
                <rect x="72" y="148" width="16" height="22" rx="8" fill="#4f46e5" />
                <rect x="112" y="148" width="16" height="22" rx="8" fill="#4f46e5" />
            </motion.g>

            {/* Speech bubbles */}
            <motion.g
                animate={{ opacity: [0, 1, 1, 0], y: [0, -5, -5, -10] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
                <rect x="145" y="30" width="40" height="25" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
                <text x="165" y="47" textAnchor="middle" fontSize="14">💬</text>
            </motion.g>
        </motion.svg>
    );
}

/* ───────────── 5. Study/Growth Chart ───────────── */
export function GrowthIllustration({ className = '', size = 180 }) {
    return (
        <motion.svg
            className={className}
            width={size} height={size} viewBox="0 0 200 200" fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <defs>
                <linearGradient id="chartGrad" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Grid lines */}
            {[60, 100, 140].map(y => (
                <line key={y} x1="30" y1={y} x2="180" y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
            ))}

            {/* Chart area fill */}
            <motion.path
                d="M30 160 L50 140 L80 125 L110 100 L140 80 L170 50 L180 45 L180 160 Z"
                fill="url(#chartFill)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            />

            {/* Chart line */}
            <motion.path
                d="M30 160 L50 140 L80 125 L110 100 L140 80 L170 50 L180 45"
                stroke="url(#chartGrad)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
            />

            {/* Data points */}
            {[
                { x: 50, y: 140 }, { x: 80, y: 125 }, { x: 110, y: 100 },
                { x: 140, y: 80 }, { x: 170, y: 50 },
            ].map((p, i) => (
                <motion.circle key={i} cx={p.x} cy={p.y} r="5" fill="white" stroke="#6366f1" strokeWidth="2.5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.2 }}
                />
            ))}

            {/* Growth arrow */}
            <motion.g
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 2 }}
            >
                <path d="M160 35 L175 30 L170 45" fill="#10b981" />
                <text x="145" y="28" fontSize="11" fill="#10b981" fontWeight="bold">+24%</text>
            </motion.g>
        </motion.svg>
    );
}
