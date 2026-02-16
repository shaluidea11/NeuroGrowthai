import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../services/api';

export default function Home() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ name: '', email: '', password: '', target_gpa: 3.5, career_goal: 'Software Engineer' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            router.push(user.role === 'admin' ? '/admin' : '/dashboard');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const params = new URLSearchParams();
                params.append('username', form.email);
                params.append('password', form.password);
                const res = await authAPI.login(params);
                localStorage.setItem('token', res.data.access_token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                router.push(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
            } else {
                await authAPI.register(form);
                setIsLogin(true);
                setError('');
                alert('Registration successful! Please login.');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Something went wrong');
        }
        setLoading(false);
    };

    return (
        <>
            <Head>
                <title>NeuroGrowth AI — Student Growth Prediction</title>
                <meta name="description" content="Deep Learning-based student growth prediction and AI roadmap assistant" />
            </Head>

            <div className="min-h-screen flex">
                {/* Left — Hero */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1040 50%, #0a0e1a 100%)' }}>
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-20 left-20 w-72 h-72 bg-neuro-600/20 rounded-full blur-[100px] animate-pulse-slow" />
                        <div className="absolute bottom-32 right-20 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
                        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] animate-float" />
                    </div>

                    <div className="relative z-10 text-center px-12">
                        <div className="text-7xl mb-6 animate-float">🎓</div>
                        <h1 className="text-5xl font-extrabold mb-4 gradient-text">NeuroGrowth AI</h1>
                        <p className="text-xl text-gray-400 max-w-md mx-auto leading-relaxed">
                            Deep Learning–powered student growth prediction & personalized AI roadmap assistant
                        </p>
                        <div className="mt-10 flex gap-6 justify-center">
                            {[
                                { icon: '📊', label: 'Performance Prediction' },
                                { icon: '🤖', label: 'AI Roadmap' },
                                { icon: '📈', label: 'Growth Tracking' },
                            ].map((f, i) => (
                                <div key={i} className="glass-light rounded-xl px-4 py-3 text-center animate-slide-up" style={{ animationDelay: `${i * 0.15}s` }}>
                                    <div className="text-2xl mb-1">{f.icon}</div>
                                    <div className="text-xs text-gray-400">{f.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right — Form */}
                <div className="flex-1 flex items-center justify-center p-8" style={{ background: '#0d1117' }}>
                    <div className="w-full max-w-md">
                        <div className="lg:hidden text-center mb-8">
                            <div className="text-5xl mb-3">🎓</div>
                            <h1 className="text-3xl font-bold gradient-text">NeuroGrowth AI</h1>
                        </div>

                        <div className="card">
                            <h2 className="text-2xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                            <p className="text-gray-400 text-sm mb-6">
                                {isLogin ? 'Sign in to your dashboard' : 'Join NeuroGrowth AI today'}
                            </p>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm mb-4">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {!isLogin && (
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                                        <input type="text" required value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neuro-500 transition"
                                            placeholder="Your name" />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                                    <input type="email" required value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neuro-500 transition"
                                        placeholder="you@example.com" />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Password</label>
                                    <input type="password" required value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neuro-500 transition"
                                        placeholder="••••••••" />
                                </div>

                                {!isLogin && (
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1">Target GPA</label>
                                                <input type="number" step="0.1" min="0" max="4" value={form.target_gpa}
                                                    onChange={e => setForm({ ...form, target_gpa: parseFloat(e.target.value) })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neuro-500 transition" />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1">Career Goal</label>
                                                <select value={form.career_goal}
                                                    onChange={e => setForm({ ...form, career_goal: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neuro-500 transition">
                                                    {['Software Engineer', 'Data Scientist', 'ML Engineer', 'Web Developer', 'DevOps Engineer', 'Product Manager'].map(g => (
                                                        <option key={g} value={g} className="bg-dark-800">{g}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <button type="submit" disabled={loading}
                                    className="w-full bg-gradient-to-r from-neuro-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                                    {loading ? '...' : isLogin ? 'Sign In' : 'Create Account'}
                                </button>
                            </form>

                            <p className="text-center text-gray-500 text-sm mt-6">
                                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                                <button onClick={() => { setIsLogin(!isLogin); setError(''); }}
                                    className="text-neuro-400 hover:text-neuro-300 font-medium">
                                    {isLogin ? 'Register' : 'Sign In'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
