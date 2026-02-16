/**
 * Score Gauge Component - Radial gauge for predicted score
 */

export default function ScoreGauge({ score }) {
    const normalizedScore = Math.max(0, Math.min(100, score || 0));
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (normalizedScore / 100) * circumference;

    const getColor = (s) => {
        if (s >= 80) return '#10B981';
        if (s >= 60) return '#5c7cfa';
        if (s >= 40) return '#F59E0B';
        return '#EF4444';
    };

    const color = getColor(normalizedScore);

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    {/* Background ring */}
                    <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    {/* Score ring */}
                    <circle cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="8"
                        strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                        className="gauge-ring" style={{ filter: `drop-shadow(0 0 6px ${color}60)` }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold" style={{ color }}>{normalizedScore.toFixed(0)}</span>
                    <span className="text-xs text-gray-500">/100</span>
                </div>
            </div>
            <div className="mt-2 text-xs text-gray-400">
                {normalizedScore >= 80 ? '🌟 Excellent' : normalizedScore >= 60 ? '👍 Good' : normalizedScore >= 40 ? '⚠️ Needs Work' : '🔴 At Risk'}
            </div>
        </div>
    );
}
