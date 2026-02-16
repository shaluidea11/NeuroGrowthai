/**
 * NeuroGrowth AI - Landing / Auth Page (Claymorphism)
 */

import { useState } from 'react';
import { useRouter } from 'next/router';
import { authAPI as api } from '../services/api';

export default function Home() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ name: '', email: '', password: '', career_goal: 'Software Engineer', target_gpa: 3.5 });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                const { data } = await api.login({ email: form.email, password: form.password });
                localStorage.setItem('token', data.access_token);
            } else {
                await api.register(form);
                const { data } = await api.login({ email: form.email, password: form.password });
                localStorage.setItem('token', data.access_token);
            }
            router.push('/dashboard');
        } catch (err) {
            console.error("Login Fatal Error:", err);
            const detail = err.response?.data?.detail;
            if (Array.isArray(detail)) {
                setError(detail.map(d => d.msg).join(', '));
            } else if (typeof detail === 'string') {
                setError(detail);
            } else {
                setError(err.message || 'Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: '📊', title: 'Performance Prediction', desc: 'LSTM-powered score forecasting' },
        { icon: '🗺️', title: 'AI Roadmap', desc: 'Personalized 30-day study plans' },
        { icon: '📈', title: 'Growth Tracking', desc: 'Visual progress analytics' },
    ];

    return (
        <div className="min-h-screen bg-clay-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative 3D Blobs */}
            <div className="absolute top-[-80px] left-[-80px] w-64 h-64 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 opacity-50 blur-3xl animate-float" />
            <div className="absolute bottom-[-100px] right-[-60px] w-80 h-80 rounded-full bg-gradient-to-br from-pink-200 to-amber-100 opacity-40 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
            <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-sky-200 to-cyan-100 opacity-30 blur-2xl animate-float" style={{ animationDelay: '1.5s' }} />

            {/* Header */}
            <div className="text-center mb-10 animate-slide-up relative z-10">
                <div className="inline-flex items-center gap-3 clay-card !p-4 !px-6 mb-6 cursor-default">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-clay-accent to-clay-secondary text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-200">
                        🎓
                    </div>
                    <span className="text-2xl font-display font-bold gradient-text">NeuroGrowth AI</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-clay-text mb-4 leading-tight">
                    Deep Learning-powered<br />
                    <span className="gradient-text">Student Growth</span> Prediction
                </h1>
                <p className="text-clay-subtext text-lg max-w-lg mx-auto">
                    Personalized AI roadmap assistant for smarter studying
                </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-10 animate-slide-up relative z-10" style={{ animationDelay: '0.2s' }}>
                {features.map((f, i) => (
                    <div key={i} className="clay-card !p-4 !px-6 flex items-center gap-3 cursor-default hover:scale-105 transition-transform">
                        <span className="text-2xl">{f.icon}</span>
                        <div>
                            <div className="font-semibold text-clay-text text-sm">{f.title}</div>
                            <div className="text-xs text-clay-subtext">{f.desc}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Auth Card */}
            <div className="w-full max-w-md relative z-10 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="clay-card !p-8">
                    <h2 className="text-2xl font-display font-bold text-clay-text mb-1">
                        {isLogin ? 'Welcome Back' : 'Get Started'}
                    </h2>
                    <p className="text-clay-subtext text-sm mb-6">
                        {isLogin ? 'Sign in to your dashboard' : 'Create your account'}
                    </p>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-2xl mb-4 border border-red-100 animate-pop">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="text-xs font-semibold text-clay-subtext mb-1.5 block uppercase tracking-wide">Name</label>
                                <input type="text" required className="clay-input"
                                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="Your full name" />
                            </div>
                        )}
                        <div>
                            <label className="text-xs font-semibold text-clay-subtext mb-1.5 block uppercase tracking-wide">Email</label>
                            <input type="email" required className="clay-input"
                                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="your@email.com" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-clay-subtext mb-1.5 block uppercase tracking-wide">Password</label>
                            <input type="password" required className="clay-input"
                                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                                placeholder="••••••••" />
                        </div>

                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-clay-subtext mb-1.5 block uppercase tracking-wide">Career Goal</label>
                                    <select className="clay-input !py-3 text-sm"
                                        value={form.career_goal} onChange={e => setForm({ ...form, career_goal: e.target.value })}>
                                        {['Software Engineer', 'Data Scientist', 'ML Engineer', 'Web Developer', 'DevOps Engineer'].map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-clay-subtext mb-1.5 block uppercase tracking-wide">Target GPA</label>
                                    <input type="number" step="0.1" min="1" max="4" className="clay-input !py-3 text-sm"
                                        value={form.target_gpa} onChange={e => setForm({ ...form, target_gpa: parseFloat(e.target.value) })} />
                                </div>
                            </div>
                        )}

                        <button type="submit" disabled={loading}
                            className="w-full clay-button-primary !py-4 !text-base !rounded-2xl mt-2">
                            {loading ? (
                                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                isLogin ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-clay-subtext">
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}
                        <button onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            className="ml-2 text-clay-accent font-semibold hover:underline">
                            {isLogin ? 'Register' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
