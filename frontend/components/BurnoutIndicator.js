/**
 * Burnout Indicator Component (Claymorphism)
 */

export default function BurnoutIndicator({ level }) {
    const levels = {
        low: { color: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-600', width: '25%', label: 'Low Risk', emoji: '😊', advice: "You're doing great! Keep up the balanced approach." },
        medium: { color: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-600', width: '55%', label: 'Medium Risk', emoji: '😐', advice: 'Consider taking more breaks between study sessions.' },
        high: { color: '#ef4444', bg: 'bg-red-50', text: 'text-red-600', width: '85%', label: 'High Risk', emoji: '😰', advice: 'Please take a break! Your wellbeing is most important.' },
    };

    const info = levels[level] || levels.low;

    return (
        <div className="flex flex-col items-center w-full px-4">
            <div className="text-4xl mb-3">{info.emoji}</div>
            <div className={`text-lg font-display font-bold ${info.text} mb-1`}>{info.label}</div>
            <div className="text-xs text-clay-subtext mb-4">Burnout Risk</div>

            {/* Progress bar */}
            <div className="w-full h-3 rounded-full bg-clay-bg mb-4" style={{ boxShadow: 'inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #ffffff' }}>
                <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: info.width, backgroundColor: info.color, boxShadow: `0 2px 8px ${info.color}60` }} />
            </div>

            <p className="text-xs text-clay-subtext text-center leading-relaxed">{info.advice}</p>
        </div>
    );
}
