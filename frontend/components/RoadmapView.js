/**
 * Roadmap Display Component
 */

import { useState } from 'react';

export default function RoadmapView({ roadmap }) {
    const [selectedWeek, setSelectedWeek] = useState(1);

    if (!roadmap) return null;

    const weekDays = (roadmap.daily_plan || []).filter(d => d.week === selectedWeek);

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="card bg-gradient-to-br from-neuro-900/50 to-purple-900/30">
                <h3 className="text-lg font-semibold mb-2">📋 Your 30-Day Roadmap</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{roadmap.summary}</p>
                <div className="flex gap-4 mt-4 text-xs">
                    <span className="px-3 py-1 rounded-full bg-neuro-600/20 text-neuro-400">
                        Intensity: {roadmap.intensity_level}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-purple-600/20 text-purple-400">
                        Style: {roadmap.learning_style}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 text-gray-400">
                        {roadmap.start_date} → {roadmap.end_date}
                    </span>
                </div>
            </div>

            {/* Week Selector */}
            <div className="flex gap-2">
                {[1, 2, 3, 4].map(w => (
                    <button key={w} onClick={() => setSelectedWeek(w)}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium transition ${selectedWeek === w
                                ? 'bg-neuro-600 text-white shadow-lg shadow-neuro-600/30'
                                : 'glass text-gray-400 hover:text-white'
                            }`}>
                        Week {w}
                    </button>
                ))}
            </div>

            {/* Daily Tasks */}
            <div className="space-y-3">
                {weekDays.map(day => (
                    <div key={day.day} className="card">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-neuro-600/20 flex items-center justify-center text-sm font-bold text-neuro-400">
                                    {day.day}
                                </div>
                                <div>
                                    <div className="font-medium text-sm">Day {day.day}</div>
                                    <div className="text-xs text-gray-500">Focus: {day.focus_area}</div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400">
                                {day.study_hours}h | {day.problems_target} problems
                            </div>
                        </div>
                        <div className="space-y-2">
                            {(day.tasks || []).map((task, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    <span className="text-xs text-gray-500 w-20">{task.time}</span>
                                    <span className={`w-2 h-2 rounded-full ${task.type === 'study' ? 'bg-neuro-400' :
                                            task.type === 'practice' ? 'bg-accent-green' :
                                                task.type === 'revision' ? 'bg-accent-amber' :
                                                    task.type === 'skill' ? 'bg-accent-purple' :
                                                        'bg-gray-500'
                                        }`} />
                                    <span className="text-gray-300">{task.task}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Mock Test Schedule */}
            {roadmap.mock_test_schedule && (
                <div className="card">
                    <h4 className="font-semibold mb-3">📝 Mock Test Schedule</h4>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {roadmap.mock_test_schedule.map((test, i) => (
                            <div key={i} className="glass-light rounded-xl p-3 text-center">
                                <div className="text-xs text-gray-400">Week {test.week}</div>
                                <div className="font-medium text-sm mt-1">{test.type}</div>
                                <div className="text-xs text-gray-500 mt-1">{test.duration_minutes} min</div>
                                <div className="text-xs text-neuro-400 mt-1">{test.date}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Milestones */}
            {roadmap.weekly_milestones && (
                <div className="card">
                    <h4 className="font-semibold mb-3">🏆 Weekly Milestones</h4>
                    <div className="space-y-3">
                        {roadmap.weekly_milestones.map((m, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${selectedWeek > m.week ? 'bg-accent-green/20 text-accent-green' :
                                        selectedWeek === m.week ? 'bg-neuro-600/20 text-neuro-400' :
                                            'bg-white/5 text-gray-500'
                                    }`}>
                                    {selectedWeek > m.week ? '✓' : m.week}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium">{m.target}</div>
                                    <div className="text-xs text-gray-400">Focus: {m.focus} | {m.deliverable}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
