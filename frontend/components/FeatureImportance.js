/**
 * Feature Importance Component (Claymorphism)
 */

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#0ea5e9', '#ef4444'];

export default function FeatureImportance({ data }) {
    const chartData = Object.entries(data || {})
        .map(([name, value]) => ({
            name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            value: Math.abs(value),
            raw: value,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 7);

    if (chartData.length === 0) {
        return <div className="text-center py-8 text-clay-subtext">No feature data available</div>;
    }

    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="bg-white rounded-xl p-3 text-xs shadow-lg border border-gray-100">
                <div className="font-semibold text-clay-text">{payload[0].payload.name}</div>
                <div className="text-clay-subtext">Impact: <span className="font-medium text-clay-accent">{payload[0].payload.raw?.toFixed(3)}</span></div>
            </div>
        );
    };

    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {chartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.85} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
