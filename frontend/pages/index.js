/**
 * NeuroGrowth AI - Landing / Auth Page (Claymorphism + 3D)
 */

import { useState } from 'react';
import { useRouter } from 'next/router';
import { authAPI as api } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeDCard from '../components/ThreeDCard';
import FloatingShape from '../components/FloatingShape';
import Head from 'next/head';

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
        <div className="min-h-screen bg-neuro-50 flex items-center justify-center p-4 relative overflow-hidden">
            <Head>
                <title>NeuroGrowth AI - Smart Learning</title>
            </Head>

            {/* 3D Floating Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <FloatingShape color="#6366f1" size={300} top="-10%" left="-5%" delay={0} />
                <FloatingShape color="#ec4899" size={200} top="40%" left="80%" delay={2} />
                <FloatingShape color="#10b981" size={150} top="70%" left="10%" delay={4} type="square" />
            </div>

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 z-10 items-center">
                {/* Left Side: 3D Hero */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                >
                    <div className="relative">
                        <h1 className="text-6xl font-display font-bold text-clay-text leading-tight">
                            Master Your <br />
                            <span className="gradient-text">Learning Curve</span>
                        </h1>
                        <motion.div
                            className="absolute -top-10 -left-10 text-8xl opacity-10 rotate-12"
                            animate={{ rotate: [12, -12, 12] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        >
                            🧠
                        </motion.div>
                    </div>

                    <p className="text-xl text-clay-subtext max-w-lg">
                        AI-powered performance prediction and personalized roadmaps for students who want to excel.
                    </p>

                    <div className="grid gap-6">
                        {features.map((f, i) => (
                            <ThreeDCard key={i} className="cursor-default">
                                <div className="flex items-center gap-4 bg-white/50 p-4 rounded-xl">
                                    <span className="text-3xl">{f.icon}</span>
                                    <div>
                                        <h3 className="font-bold text-clay-text">{f.title}</h3>
                                        <p className="text-sm text-clay-subtext">{f.desc}</p>
                                    </div>
                                </div>
                            </ThreeDCard>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side: 3D Auth Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <ThreeDCard options={{ max: 10, scale: 1.01 }}>
                        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50 relative overflow-hidden">
                            {/* Decorative glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-clay-accent/20 to-clay-secondary/20 blur-2xl rounded-full -mr-10 -mt-10" />

                            <div className="text-center mb-8 relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-clay-accent to-clay-secondary text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg mx-auto mb-4 animate-bounce-slow">
                                    🎓
                                </div>
                                <h2 className="text-2xl font-display font-bold text-clay-text">
                                    {isLogin ? 'Welcome Back!' : 'Start Your Journey'}
                                </h2>
                                <p className="text-clay-subtext">
                                    {isLogin ? 'Continue your growth path' : 'Join thousands of ambitious students'}
                                </p>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-6 flex items-center gap-2 border border-red-100"
                                >
                                    ⚠️ {error}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                <AnimatePresence mode='wait'>
                                    {!isLogin && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-4 overflow-hidden"
                                        >
                                            <input type="text" placeholder="Full Name" className="clay-input" required
                                                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

                                            <div className="grid grid-cols-2 gap-4">
                                                <select className="clay-input" value={form.career_goal} onChange={e => setForm({ ...form, career_goal: e.target.value })}>
                                                    <option>Software Engineer</option>
                                                    <option>Data Scientist</option>
                                                    <option>Product Manager</option>
                                                    <option>Researcher</option>
                                                </select>
                                                <input type="number" step="0.1" placeholder="Target GPA" className="clay-input"
                                                    value={form.target_gpa} onChange={e => setForm({ ...form, target_gpa: parseFloat(e.target.value) })} />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.div layout>
                                    <input type="email" placeholder="Email Address" className="clay-input w-full" required
                                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                </motion.div>

                                <motion.div layout>
                                    <input type="password" placeholder="Password" className="clay-input w-full" required
                                        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                                </motion.div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit" disabled={loading}
                                    className="w-full clay-button-primary !py-4 !text-lg !rounded-2xl shadow-xl shadow-indigo-200"
                                >
                                    {loading ? (
                                        <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (isLogin ? 'Sign In' : 'Create Account')}
                                </motion.button>
                            </form>

                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => { setIsLogin(!isLogin); setError(''); }}
                                    className="text-sm font-medium text-clay-subtext hover:text-clay-accent transition-colors underline decoration-dotted"
                                >
                                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                                </button>
                            </div>
                        </div>
                    </ThreeDCard>
                </motion.div>
            </div>
        </div>
    );
}
