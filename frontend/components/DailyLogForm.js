/**
 * Daily Log Form Component
 */

import { useState } from 'react';
import { logsAPI } from '../services/api';

const SKILLS = ['DSA', 'ML', 'DBMS', 'OS', 'CN', 'Web Dev', 'Math', 'Aptitude', 'Soft Skills', 'Other'];

export default function DailyLogForm({ studentId, onSuccess }) {
    const [form, setForm] = useState({
        study_hours: 4,
        topics_completed: 2,
        problems_solved: 10,
        mock_score: 65,
        confidence: 3,
        mood: 3,
        revision_done: false,
        skill_practiced: 'DSA',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await logsAPI.create({ ...form, student_id: studentId });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onSuccess?.();
            }, 1500);
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to save log');
        }
        setLoading(false);
    };

    const RatingSelector = ({ label, value, onChange, max = 5, labels }) => (
        <div>
            <label className="block text-sm text-gray-400 mb-2">{label}</label>
            <div className="flex gap-2">
                {Array.from({ length: max }, (_, i) => i + 1).map(n => (
                    <button key={n} type="button" onClick={() => onChange(n)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${value === n
                                ? 'bg-neuro-600 text-white scale-110 shadow-lg shadow-neuro-600/30'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}>
                        {n}
                    </button>
                ))}
            </div>
            {labels && <div className="flex justify-between text-xs text-gray-600 mt-1 px-1">
                <span>{labels[0]}</span><span>{labels[1]}</span>
            </div>}
        </div>
    );

    if (success) {
        return (
            <div className="card text-center py-16 animate-slide-up">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-accent-green">Progress Logged!</h3>
                <p className="text-gray-400 mt-2">Keep up the great work!</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="card space-y-6">
            <h3 className="text-lg font-semibold">📝 Log Today's Progress</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Study Hours</label>
                    <input type="number" step="0.5" min="0" max="24" value={form.study_hours}
                        onChange={e => setForm({ ...form, study_hours: parseFloat(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neuro-500 transition" />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Topics Completed</label>
                    <input type="number" min="0" value={form.topics_completed}
                        onChange={e => setForm({ ...form, topics_completed: parseInt(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neuro-500 transition" />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Problems Solved</label>
                    <input type="number" min="0" value={form.problems_solved}
                        onChange={e => setForm({ ...form, problems_solved: parseInt(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neuro-500 transition" />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Mock Test Score</label>
                    <input type="number" min="0" max="100" value={form.mock_score}
                        onChange={e => setForm({ ...form, mock_score: parseFloat(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neuro-500 transition" />
                </div>
            </div>

            <RatingSelector label="Confidence Level" value={form.confidence}
                onChange={v => setForm({ ...form, confidence: v })} labels={['Low', 'High']} />

            <RatingSelector label="Mood / Stress Level" value={form.mood}
                onChange={v => setForm({ ...form, mood: v })} labels={['Stressed', 'Great']} />

            <div>
                <label className="block text-sm text-gray-400 mb-2">Skill Practiced</label>
                <div className="flex flex-wrap gap-2">
                    {SKILLS.map(s => (
                        <button key={s} type="button" onClick={() => setForm({ ...form, skill_practiced: s })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${form.skill_practiced === s
                                    ? 'bg-neuro-600 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${form.revision_done ? 'bg-neuro-600' : 'bg-white/10'}`}
                    onClick={() => setForm({ ...form, revision_done: !form.revision_done })}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${form.revision_done ? 'translate-x-6' : ''}`} />
                </div>
                <span className="text-sm">Revision completed today</span>
            </label>

            <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-neuro-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                {loading ? 'Saving...' : '📝 Save Today\'s Log'}
            </button>
        </form>
    );
}
