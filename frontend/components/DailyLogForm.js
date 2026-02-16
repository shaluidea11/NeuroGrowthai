/**
 * Daily Log Form Component (Claymorphism)
 */

import { useState } from 'react';
import api from '../services/api';

export default function DailyLogForm({ studentId, onSuccess }) {
    const [form, setForm] = useState({
        study_hours: 4, topics_completed: 2, problems_solved: 10,
        mock_score: 65, confidence: 3, mood: 3,
        revision_done: false, skill_practiced: 'dsa',
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.createLog({ ...form, student_id: studentId });
            setSuccess(true);
            setTimeout(() => { setSuccess(false); onSuccess?.(); }, 2000);
        } catch (err) {
            alert('Failed to save log');
        } finally {
            setSubmitting(false);
        }
    };

    const skills = [
        { value: 'dsa', label: '🧩 DSA' },
        { value: 'math', label: '📐 Math' },
        { value: 'coding', label: '💻 Coding' },
        { value: 'os', label: '🖥️ OS' },
        { value: 'dbms', label: '🗄️ DBMS' },
        { value: 'networking', label: '🌐 Networks' },
        { value: 'ml', label: '🤖 ML' },
    ];

    const RatingSelector = ({ label, value, onChange, emoji }) => (
        <div>
            <label className="text-xs font-semibold text-clay-subtext block mb-2 uppercase tracking-wide">{label}</label>
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(v => (
                    <button key={v} type="button"
                        onClick={() => onChange(v)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 ${v <= value
                            ? 'bg-clay-accent text-white shadow-lg shadow-indigo-200'
                            : 'bg-clay-bg text-clay-subtext'
                            }`}
                        style={v > value ? { boxShadow: 'inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #ffffff' } : {}}>
                        {v}
                    </button>
                ))}
            </div>
        </div>
    );

    if (success) {
        return (
            <div className="text-center py-12 animate-pop">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-display font-bold text-clay-text mb-2">Logged Successfully!</h3>
                <p className="text-clay-subtext">Great job tracking your progress today</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-xs font-semibold text-clay-subtext block mb-2 uppercase tracking-wide">Study Hours</label>
                    <input type="number" step="0.5" min="0" max="24" className="clay-input"
                        value={form.study_hours} onChange={e => setForm({ ...form, study_hours: parseFloat(e.target.value) })} />
                </div>
                <div>
                    <label className="text-xs font-semibold text-clay-subtext block mb-2 uppercase tracking-wide">Topics Completed</label>
                    <input type="number" min="0" className="clay-input"
                        value={form.topics_completed} onChange={e => setForm({ ...form, topics_completed: parseInt(e.target.value) })} />
                </div>
                <div>
                    <label className="text-xs font-semibold text-clay-subtext block mb-2 uppercase tracking-wide">Problems Solved</label>
                    <input type="number" min="0" className="clay-input"
                        value={form.problems_solved} onChange={e => setForm({ ...form, problems_solved: parseInt(e.target.value) })} />
                </div>
                <div>
                    <label className="text-xs font-semibold text-clay-subtext block mb-2 uppercase tracking-wide">Mock Score</label>
                    <input type="number" min="0" max="100" className="clay-input"
                        value={form.mock_score} onChange={e => setForm({ ...form, mock_score: parseFloat(e.target.value) })} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RatingSelector label="Confidence" value={form.confidence}
                    onChange={v => setForm({ ...form, confidence: v })} />
                <RatingSelector label="Mood" value={form.mood}
                    onChange={v => setForm({ ...form, mood: v })} />
            </div>

            <div>
                <label className="text-xs font-semibold text-clay-subtext block mb-2 uppercase tracking-wide">Skill Practiced</label>
                <div className="flex flex-wrap gap-2">
                    {skills.map(s => (
                        <button key={s.value} type="button"
                            onClick={() => setForm({ ...form, skill_practiced: s.value })}
                            className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${form.skill_practiced === s.value
                                ? 'bg-clay-accent text-white shadow-lg shadow-indigo-200'
                                : 'bg-clay-bg text-clay-subtext hover:text-clay-text'
                                }`}
                            style={form.skill_practiced !== s.value ? { boxShadow: '3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff' } : {}}>
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            <label className="flex items-center gap-3 p-4 rounded-2xl bg-clay-bg cursor-pointer" style={{ boxShadow: 'inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #ffffff' }}>
                <input type="checkbox" className="w-5 h-5 rounded accent-clay-accent"
                    checked={form.revision_done} onChange={e => setForm({ ...form, revision_done: e.target.checked })} />
                <span className="text-sm font-medium text-clay-text">Revision completed today</span>
            </label>

            <button type="submit" disabled={submitting}
                className="w-full clay-button-primary !py-4 !text-base">
                {submitting ? (
                    <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : '📝 Save Today\'s Log'}
            </button>
        </form>
    );
}
