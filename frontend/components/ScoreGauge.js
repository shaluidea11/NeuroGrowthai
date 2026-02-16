/**
 * Score Gauge Component (Claymorphism)
 */

export default function ScoreGauge({ score }) {
    const radius = 60;
    const stroke = 12;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;
    const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

    return (
        <div className="relative flex items-center justify-center">
            <svg width="160" height="160" className="drop-shadow-lg">
                {/* Background circle */}
                <circle cx="80" cy="80" r={radius} fill="none"
                    stroke="#e2e8f0" strokeWidth={stroke} />
                {/* Progress circle */}
                <circle cx="80" cy="80" r={radius} fill="none"
                    stroke={color} strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                    transform="rotate(-90 80 80)"
                    className="transition-all duration-1000 ease-out"
                    style={{ filter: `drop-shadow(0 0 6px ${color}40)` }} />
            </svg>
            <div className="absolute text-center">
                <div className="text-3xl font-display font-bold text-clay-text">{Math.round(score)}</div>
                <div className="text-xs text-clay-subtext font-medium">/ 100</div>
            </div>
        </div>
    );
}
