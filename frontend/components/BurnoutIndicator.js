/**
 * Burnout Risk Indicator Component
 */

export default function BurnoutIndicator({ risk }) {
    const percentage = Math.round((risk || 0) * 100);

    const getLevel = (p) => {
        if (p >= 70) return { label: 'Critical', color: '#EF4444', bg: 'bg-red-500/10', emoji: '🔥' };
        if (p >= 40) return { label: 'Moderate', color: '#F59E0B', bg: 'bg-amber-500/10', emoji: '⚠️' };
        return { label: 'Low', color: '#10B981', bg: 'bg-green-500/10', emoji: '✅' };
    };

    const level = getLevel(percentage);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-lg">{level.emoji} {percentage}%</span>
                <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: level.color + '20', color: level.color }}>
                    {level.label}
                </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%`, background: level.color, boxShadow: `0 0 10px ${level.color}50` }} />
            </div>

            <p className="text-xs text-gray-500">
                {percentage >= 70
                    ? 'Consider taking a break. Your well-being matters!'
                    : percentage >= 40
                        ? 'Monitor your stress levels. Balance is key.'
                        : 'Great balance! Keep up the healthy habits.'}
            </p>
        </div>
    );
}
