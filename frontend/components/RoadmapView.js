/**
 * Roadmap View Component — 3D Visual Roadmap
 */

import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeDCard from './ThreeDCard';
import FloatingShape from './FloatingShape';

const TASK_ICONS = {
    study: '📖',
    practice: '💻',
    revision: '🔄',
    skill: '⚡',
    test_prep: '📝',
    planning: '📋',
    reflection: '🧘',
};

const TASK_COLORS = {
    study: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
    practice: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    revision: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    skill: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    test_prep: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
    planning: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200' },
    reflection: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
};

export default function RoadmapView({ studentId }) {
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [expandedDay, setExpandedDay] = useState(null);
    const [activeView, setActiveView] = useState('timeline'); // timeline | milestones | skills

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const { data } = await api.getRoadmap(studentId);
                setRoadmap(data.roadmap || data);
            } catch {
                // No roadmap exists yet — auto-generate one
                try {
                    setGenerating(true);
                    const { data } = await api.generateRoadmap({ student_id: studentId });
                    setRoadmap(data.roadmap || data);
                } catch (e) {
                    console.error('Failed to generate roadmap:', e);
                }
            } finally {
                setLoading(false);
                setGenerating(false);
            }
        };
        if (studentId) fetchRoadmap();
    }, [studentId]);

    const handleRegenerate = async () => {
        setGenerating(true);
        try {
            const { data } = await api.generateRoadmap({ student_id: studentId });
            setRoadmap(data.roadmap || data);
        } catch (e) {
            console.error('Failed to regenerate:', e);
        } finally {
            setGenerating(false);
        }
    };

    if (loading || generating) {
        return (
            <div className="text-center py-20">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"
                />
                <p className="text-gray-500 font-medium">
                    {generating ? '🧠 AI is generating your personalized roadmap...' : 'Loading your roadmap...'}
                </p>
            </div>
        );
    }

    if (!roadmap) {
        return (
            <div className="text-center py-20 space-y-4">
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-xl font-bold text-gray-900">No Roadmap Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">Generate a personalized 30-day study roadmap powered by AI</p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRegenerate}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200"
                >
                    🚀 Generate Roadmap
                </motion.button>
            </div>
        );
    }

    // Map backend fields
    const dailyPlan = roadmap.daily_plan || roadmap.daily_tasks || [];
    const milestones = roadmap.weekly_milestones || roadmap.milestones || [];
    const mockTests = roadmap.mock_test_schedule || roadmap.mock_tests || [];
    const skillPlan = roadmap.skill_growth_plan || [];
    const revisionCycles = roadmap.revision_cycles || [];

    // Group daily plan by week
    const weekDays = dailyPlan.filter(d => d.week === selectedWeek);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h3 className="font-display font-bold text-gray-900 text-2xl">🗺️ Your 30-Day Roadmap</h3>
                    {roadmap.learning_style && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                            {roadmap.learning_style}
                        </span>
                    )}
                    {roadmap.intensity_level && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${roadmap.intensity_level === 'high' ? 'bg-red-50 text-red-600 border-red-200' :
                            roadmap.intensity_level === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                'bg-green-50 text-green-600 border-green-200'
                            }`}>
                            {roadmap.intensity_level.charAt(0).toUpperCase() + roadmap.intensity_level.slice(1)} Intensity
                        </span>
                    )}
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRegenerate}
                    disabled={generating}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm"
                >
                    🔄 Regenerate
                </motion.button>
            </div>

            {/* 3D Header Scene */}
            <ThreeDCard options={{ max: 5, scale: 1 }}>
                <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 rounded-[2rem] text-white shadow-2xl overflow-hidden min-h-[200px] flex items-center">
                    {/* Abstract 3D Shapes Composition */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <FloatingShape color="#818cf8" size={120} top="10%" left="5%" delay={0} />
                        <FloatingShape color="#c084fc" size={200} top="-40%" right="-10%" delay={1.5} type="square" />
                        <FloatingShape color="#f472b6" size={80} bottom="10%" right="20%" delay={2.5} />
                        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/10 blur-[80px] rounded-full mix-blend-overlay" />
                    </div>

                    <div className="relative z-10 w-full">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="max-w-xl">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10 uppercase tracking-wider">
                                        {roadmap.learning_style || 'Personalized'} Journey
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight mb-2">
                                    Your Path to Mastery
                                </h2>
                                <p className="text-indigo-100 text-lg opacity-90">
                                    {roadmap.summary || 'Follow this AI-generated roadmap to achieve your career goals.'}
                                </p>
                            </div>

                            {/* Stats Badge */}
                            <div className="flex gap-4">
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[100px]">
                                    <div className="text-sm text-indigo-200 uppercase font-bold tracking-wider mb-1">Duration</div>
                                    <div className="text-2xl font-bold">{roadmap.duration_days || 30} Days</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[100px]">
                                    <div className="text-sm text-indigo-200 uppercase font-bold tracking-wider mb-1">Milestones</div>
                                    <div className="text-2xl font-bold">{milestones.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ThreeDCard>

            {/* View Tabs */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
                {[
                    { id: 'timeline', label: '📅 Timeline' },
                    { id: 'milestones', label: '🏆 Milestones' },
                    { id: 'skills', label: '⚡ Skills' },
                ].map(v => (
                    <button key={v.id} onClick={() => setActiveView(v.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeView === v.id
                            ? 'bg-white text-gray-900 shadow-md'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}>
                        {v.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* ═══════════ TIMELINE VIEW ═══════════ */}
                {activeView === 'timeline' && (
                    <motion.div key="timeline" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        {/* Week Selector */}
                        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                            {[1, 2, 3, 4].map(w => (
                                <ThreeDCard key={w} options={{ max: 15, scale: 1.05 }}>
                                    <button onClick={() => setSelectedWeek(w)}
                                        className={`px-6 py-4 rounded-2xl font-medium transition-all whitespace-nowrap ${selectedWeek === w
                                            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-200'
                                            : 'bg-white text-gray-600 shadow-lg border border-gray-100 hover:shadow-xl'
                                            }`}>
                                        <div className="text-xs opacity-70 mb-1">Week</div>
                                        <div className="text-2xl font-display font-bold">{w}</div>
                                        <div className="text-xs opacity-70 mt-1">Day {(w - 1) * 7 + 1}-{Math.min(w * 7, 30)}</div>
                                    </button>
                                </ThreeDCard>
                            ))}
                        </div>

                        {/* Timeline Visual */}
                        <div className="relative">
                            {/* Vertical line connector */}
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-300 via-purple-300 to-pink-300 rounded-full" />

                            <div className="space-y-4">
                                {weekDays.map((day, i) => {
                                    const isExpanded = expandedDay === day.day;
                                    const isWeekend = (day.day - 1) % 7 >= 5;

                                    return (
                                        <motion.div
                                            key={day.day}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="relative pl-16"
                                        >
                                            {/* Day Node on Timeline */}
                                            <div className="absolute left-0 top-4 w-16 flex items-center justify-center">
                                                <motion.div
                                                    whileHover={{ scale: 1.2 }}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 shadow-lg cursor-pointer ${isWeekend
                                                        ? 'bg-gradient-to-br from-amber-400 to-orange-400 text-white'
                                                        : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                                                        }`}
                                                    onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                                                >
                                                    {day.day}
                                                </motion.div>
                                            </div>

                                            {/* Day Card */}
                                            <ThreeDCard options={{ max: 8, scale: 1.01 }}>
                                                <div
                                                    className={`bg-white p-5 rounded-2xl shadow-lg border cursor-pointer transition-all hover:shadow-xl ${isExpanded ? 'border-indigo-200 ring-2 ring-indigo-100' : 'border-gray-100'
                                                        }`}
                                                    onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                                                >
                                                    {/* Day Header */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div>
                                                                <div className="font-bold text-gray-900">
                                                                    Day {day.day} {isWeekend ? (day.day % 7 === 6 ? '(Saturday)' : '(Sunday)') : ''}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    Focus: <span className="font-medium text-indigo-600">{day.focus_area}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold">
                                                                ⏱️ {day.study_hours}h
                                                            </span>
                                                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-xs font-bold">
                                                                🎯 {day.problems_target} problems
                                                            </span>
                                                            <motion.span
                                                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                                                className="text-gray-400"
                                                            >
                                                                ▼
                                                            </motion.span>
                                                        </div>
                                                    </div>

                                                    {/* Task Preview (always visible) */}
                                                    {!isExpanded && day.tasks && (
                                                        <div className="flex gap-2 mt-3 flex-wrap">
                                                            {day.tasks.map((t, j) => {
                                                                const c = TASK_COLORS[t.type] || TASK_COLORS.study;
                                                                return (
                                                                    <span key={j} className={`${c.bg} ${c.text} px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1`}>
                                                                        {TASK_ICONS[t.type] || '📚'} {t.type}
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {/* Expanded Task Details */}
                                                    <AnimatePresence>
                                                        {isExpanded && day.tasks && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                className="mt-4 space-y-2 overflow-hidden"
                                                            >
                                                                {day.tasks.map((t, j) => {
                                                                    const c = TASK_COLORS[t.type] || TASK_COLORS.study;
                                                                    return (
                                                                        <motion.div
                                                                            key={j}
                                                                            initial={{ opacity: 0, x: -10 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            transition={{ delay: j * 0.05 }}
                                                                            className={`flex items-center gap-3 p-3 rounded-xl ${c.bg} border ${c.border}`}
                                                                        >
                                                                            <span className="text-xl">{TASK_ICONS[t.type] || '📚'}</span>
                                                                            <div className="flex-1">
                                                                                <div className={`font-medium text-sm ${c.text}`}>{t.task}</div>
                                                                            </div>
                                                                            <span className="text-xs text-gray-400 font-mono bg-white px-2 py-1 rounded-md">
                                                                                {t.time}
                                                                            </span>
                                                                        </motion.div>
                                                                    );
                                                                })}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </ThreeDCard>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Mock Test Schedule */}
                        {mockTests.length > 0 && (
                            <div className="mt-8">
                                <h4 className="font-display font-bold text-gray-900 text-lg mb-4">📝 Mock Test Schedule</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {mockTests.map((m, i) => (
                                        <ThreeDCard key={i} options={{ max: 15, scale: 1.03 }}>
                                            <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 text-center relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="relative z-10">
                                                    <div className="text-3xl mb-2">{m.type === 'Full Mock' ? '📄' : '📋'}</div>
                                                    <div className="font-bold text-gray-900">Week {m.week}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{m.type}</div>
                                                    <div className="text-xs text-indigo-600 font-medium mt-2">{m.duration_minutes} min</div>
                                                    <div className="text-xs text-gray-400 mt-1">{m.date}</div>
                                                </div>
                                            </div>
                                        </ThreeDCard>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ═══════════ MILESTONES VIEW ═══════════ */}
                {activeView === 'milestones' && (
                    <motion.div key="milestones" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {milestones.map((m, i) => (
                                <ThreeDCard key={i} options={{ max: 12, scale: 1.02 }}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 h-full relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-500" />

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center font-bold shadow-lg">
                                                    W{m.week}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">Week {m.week} Milestone</div>
                                                    <div className="text-xs text-gray-500">{m.focus}</div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">🎯</span>
                                                    <span className="text-sm text-gray-600">{m.target}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">📦</span>
                                                    <span className="text-sm text-gray-600">{m.deliverable}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress bar placeholder */}
                                        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(25 * i + 25, 100)}%` }}
                                                transition={{ duration: 1, delay: i * 0.2 }}
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                            />
                                        </div>
                                    </motion.div>
                                </ThreeDCard>
                            ))}
                        </div>

                        {/* Revision Cycles */}
                        {revisionCycles.length > 0 && (
                            <div className="mt-8">
                                <h4 className="font-display font-bold text-gray-900 text-lg mb-4">🔄 Spaced Repetition Cycles</h4>
                                <div className="space-y-4">
                                    {revisionCycles.map((rc, i) => (
                                        <ThreeDCard key={i} options={{ max: 5, scale: 1 }}>
                                            <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="text-2xl">📚</span>
                                                    <div className="font-bold text-gray-900">{rc.subject}</div>
                                                    <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-lg font-medium">{rc.method}</span>
                                                </div>
                                                <div className="grid grid-cols-4 gap-3">
                                                    {['cycle_1', 'cycle_2', 'cycle_3', 'cycle_4'].map((c, j) => (
                                                        <div key={j} className="text-center bg-gray-50 p-3 rounded-xl">
                                                            <div className="text-xs font-bold text-gray-400">Cycle {j + 1}</div>
                                                            <div className="text-sm font-medium text-indigo-600 mt-1">{rc[c]}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </ThreeDCard>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ═══════════ SKILLS VIEW ═══════════ */}
                {activeView === 'skills' && (
                    <motion.div key="skills" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {skillPlan.map((s, i) => (
                                <ThreeDCard key={i} options={{ max: 12, scale: 1.02 }}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 h-full group hover:border-indigo-200 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${s.priority === 'High' ? 'bg-red-50' : 'bg-blue-50'
                                                    }`}>
                                                    ⚡
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{s.skill}</div>
                                                    <div className="text-xs text-gray-500">Starts Week {s.start_week}</div>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.priority === 'High'
                                                ? 'bg-red-50 text-red-600 border border-red-200'
                                                : 'bg-blue-50 text-blue-600 border border-blue-200'
                                                }`}>
                                                {s.priority}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 mb-4">🎯 {s.target}</div>
                                        <div className="space-y-2">
                                            {s.resources?.map((r, j) => (
                                                <div key={j} className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
                                                    <span className="text-indigo-400">▸</span> {r}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </ThreeDCard>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
