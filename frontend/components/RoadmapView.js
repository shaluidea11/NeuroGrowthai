/**
 * Roadmap View Component (Claymorphism)
 */

import { useState, useEffect } from 'react';
import api from '../services/api';

export default function RoadmapView({ studentId }) {
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedWeek, setSelectedWeek] = useState(0);

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const { data } = await api.getRoadmap(studentId);
                setRoadmap(data.roadmap || data);
            } catch {
                try {
                    const { data } = await api.generateRoadmap({ student_id: studentId });
                    setRoadmap(data.roadmap || data);
                } catch { }
            } finally {
                setLoading(false);
            }
        };
        if (studentId) fetchRoadmap();
    }, [studentId]);

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="w-10 h-10 border-3 border-clay-bg border-t-clay-accent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-clay-subtext text-sm">Loading your roadmap...</p>
            </div>
        );
    }

    if (!roadmap) {
        return (
            <div className="text-center py-12">
                <div className="text-4xl mb-3">🗺️</div>
                <p className="text-clay-subtext">No roadmap generated yet.</p>
            </div>
        );
    }

    const weeks = [];
    const daily = roadmap.daily_tasks || [];
    for (let i = 0; i < daily.length; i += 7) {
        weeks.push(daily.slice(i, i + 7));
    }

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <h3 className="font-display font-bold text-clay-text text-xl">🗺️ Your 30-Day Roadmap</h3>
                {roadmap.learning_style && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-clay-accent/10 text-clay-accent">
                        {roadmap.learning_style}
                    </span>
                )}
            </div>

            {/* Week Selector */}
            <div className="flex gap-2 mb-6">
                {weeks.map((_, i) => (
                    <button key={i}
                        onClick={() => setSelectedWeek(i)}
                        className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all ${selectedWeek === i
                            ? 'bg-clay-accent text-white shadow-lg shadow-indigo-200'
                            : 'bg-clay-bg text-clay-subtext'
                            }`}
                        style={selectedWeek !== i ? { boxShadow: '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff' } : {}}>
                        Week {i + 1}
                    </button>
                ))}
            </div>

            {/* Daily Tasks */}
            <div className="space-y-3">
                {(weeks[selectedWeek] || []).map((day, i) => (
                    <div key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-clay-bg/60 transition-all hover:bg-clay-bg"
                        style={{ boxShadow: 'inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #ffffff' }}>
                        <div className="w-10 h-10 rounded-xl bg-clay-accent/10 text-clay-accent flex items-center justify-center font-bold text-sm shrink-0">
                            D{selectedWeek * 7 + i + 1}
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold text-clay-text text-sm">{day.focus || 'Study Session'}</div>
                            {day.tasks && (
                                <ul className="mt-2 space-y-1">
                                    {day.tasks.map((t, j) => (
                                        <li key={j} className="text-xs text-clay-subtext flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-clay-accent/40" />
                                            {t}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <span className="text-xs text-clay-subtext bg-white px-2 py-1 rounded-lg">{day.hours || 4}h</span>
                    </div>
                ))}
            </div>

            {/* Mock Tests */}
            {roadmap.mock_tests?.length > 0 && (
                <div className="mt-8">
                    <h4 className="font-display font-bold text-clay-text mb-3">📝 Scheduled Mock Tests</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {roadmap.mock_tests.map((m, i) => (
                            <div key={i} className="text-center p-4 rounded-2xl bg-gradient-to-br from-clay-accent/5 to-clay-secondary/5 border border-clay-accent/10">
                                <div className="text-sm font-bold text-clay-accent">Day {m.day || (i + 1) * 7}</div>
                                <div className="text-xs text-clay-subtext mt-1">{m.topic || 'Full Mock'}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
