/**
 * Feature Importance (SHAP) Visualization Component
 */

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#5c7cfa', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#06B6D4'];

const LABELS = {
    study_hours: '📚 Study Hours',
    topics_completed: '📖 Topics Done',
    problems_solved: '🧩 Problems Solved',
    mock_score: '📝 Mock Score',
    confidence: '💪 Confidence',
    mood: '😊 Mood',
    revision_done: '🔄 Revision',
    skill_practiced: '🎯 Skill',
};

export default function FeatureImportance({ data }) {
    if (!data) return null;

    const chartData = Object.entries(data)
        .map(([key, value]) => ({
            feature: LABELS[key] || key,
            importance: parseFloat((value * 100).toFixed(1)),
        }))
        .sort((a, b) => b.importance - a.importance);

    return (
        <div>
            <p className="text-xs text-gray-400 mb-4">
                Shows which features had the most impact on your score prediction
            </p>
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="feature" type="category" stroke="#6b7280" tick={{ fontSize: 11 }} width={130} />
                    <Tooltip
                        contentStyle={{ background: '#1a2035', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        formatter={(v) => [`${v}%`, 'Impact']}
                    />
                    <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                        {chartData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
