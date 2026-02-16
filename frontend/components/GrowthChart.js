/**
 * Growth Trajectory Chart Component (Claymorphism)
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function GrowthChart({ logs }) {
    const chartData = [...(logs || [])].reverse().map((log, i) => ({
        day: log.date || `Day ${i + 1}`,
        score: log.mock_score || 0,
        hours: log.study_hours || 0,
        problems: log.problems_solved || 0,
        confidence: (log.confidence || 3) * 20,
        mood: (log.mood || 3) * 20,
    }));

    if (chartData.length === 0) {
        return (
            <div className="text-center py-12 text-clay-subtext">
                <div className="text-3xl mb-2">📈</div>
                No data yet. Start logging to see your growth!
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="bg-white rounded-2xl p-3 text-xs border border-gray-100 shadow-lg">
                <div className="font-semibold mb-1 text-clay-text">{label}</div>
                {payload.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                        <span className="text-clay-subtext">{p.name}:</span>
                        <span className="font-medium text-clay-text">{p.value}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
                <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" name="Score" stroke="#6366f1" fill="url(#scoreGrad)" strokeWidth={2.5} dot={false} />
                <Area type="monotone" dataKey="hours" name="Hours" stroke="#10B981" fill="url(#hoursGrad)" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="confidence" name="Confidence" stroke="#8B5CF6" strokeWidth={1} dot={false} strokeDasharray="4 4" />
            </AreaChart>
        </ResponsiveContainer>
    );
}
