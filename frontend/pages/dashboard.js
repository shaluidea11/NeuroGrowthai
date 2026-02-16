import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../services/api';
import DailyLogForm from '../components/DailyLogForm';
import GrowthChart from '../components/GrowthChart';
import RoadmapView from '../components/RoadmapView';
import ChatAssistant from '../components/ChatAssistant';
import Simulator from '../components/Simulator';
import ThreeDCard from '../components/ThreeDCard';
import FloatingShape from '../components/FloatingShape';
import AnimatedLayout from '../components/AnimatedLayout';
import { RocketIllustration } from '../components/Illustrations';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
    { id: 'overview', icon: '🏠', label: 'Overview' },
    { id: 'log', icon: '📝', label: 'Daily Log' },
    { id: 'history', icon: '📋', label: 'Log History' },
    { id: 'roadmap', icon: '🗺️', label: 'Roadmap' },
    { id: 'chat', icon: '💬', label: 'Assistant' },
    { id: 'simulator', icon: '🧪', label: 'Simulator' },
];

export default function Dashboard() {
    const router = useRouter();
    const [me, setMe] = useState(null);
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('overview');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        const fetchData = async () => {
            try {
                const { data: user } = await api.getMe();
                setMe(user);
                const { data: dash } = await api.getDashboard(user.id);
                // Also fetch real-time ML prediction
                try {
                    const { data: pred } = await api.predict(user.id);
                    dash.prediction = pred;
                } catch (e) {
                    console.warn('Prediction not available:', e.message);
                }
                setDashboard(dash);
            } catch (err) {
                console.error("Dashboard Load Error:", err);
                localStorage.removeItem('token');
                router.push('/');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Refresh dashboard data (called after log submission)
    const refreshDashboard = async () => {
        if (!me) return;
        try {
            const { data: dash } = await api.getDashboard(me.id);
            try {
                const { data: pred } = await api.predict(me.id);
                dash.prediction = pred;
            } catch (_) { }
            setDashboard(dash);
        } catch (err) {
            console.error('Refresh error:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    if (loading) return (
        <div className="min-h-screen bg-neuro-50 flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
            />
        </div>
    );

    const prediction = dashboard?.prediction;
    const logs = dashboard?.daily_logs || [];

    return (
        <div className="min-h-screen bg-neuro-50 flex relative overflow-hidden">
            {/* Background Shapes */}
            <div className="absolute inset-0 pointer-events-none">
                <FloatingShape color="#6366f1" size={400} top="-10%" left="-10%" delay={0} />
                <FloatingShape color="#ec4899" size={300} top="60%" left="85%" delay={2} />
            </div>

            {/* Sidebar */}
            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-64 bg-white/80 backdrop-blur-xl border-r border-white/50 p-6 flex flex-col fixed h-full z-20 shadow-2xl"
            >
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-clay-accent to-clay-secondary rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                        NG
                    </div>
                    <span className="font-display font-bold text-xl text-clay-text">NeuroGrowth</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {TABS.map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${tab === t.id
                                ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-inner'
                                : 'text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-md'
                                }`}>
                            <span className="text-xl">{t.icon}</span>
                            {t.label}
                        </button>
                    ))}
                </nav>

                <div className="pt-6 border-t border-gray-100">
                    <div className="px-4 py-3 bg-gray-50 rounded-xl mb-4 border border-gray-100">
                        <div className="text-sm font-bold text-gray-900">{me?.name}</div>
                        <div className="text-xs text-gray-500 truncate">{me?.email}</div>
                    </div>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium">
                        🚪 Sign Out
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 relative z-10 overflow-y-auto h-screen">
                <AnimatedLayout>
                    {/* 3D Welcome Section */}
                    <div className="mb-8">
                        <ThreeDCard options={{ max: 5, scale: 1.02 }}>
                            <div className="relative bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden min-h-[160px] flex items-center justify-between">
                                {/* Decor shapes */}
                                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                    <FloatingShape color="#e0e7ff" size={300} top="-50%" left="-10%" delay={0} />
                                    <FloatingShape color="#fce7f3" size={200} bottom="-40%" right="10%" delay={2} />
                                </div>

                                <div className="relative z-10">
                                    <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
                                        Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{me?.name.split(' ')[0]}</span> 👋
                                    </h1>
                                    <p className="text-gray-500 text-lg">Every step counts. Keep growing!</p>
                                </div>

                                <div className="relative z-10 hidden md:flex items-center gap-6">
                                    <RocketIllustration size={120} />
                                    <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-indigo-50 flex items-center gap-4 cursor-default transition-transform hover:scale-105">
                                        <div className="bg-orange-100 p-3 rounded-xl">
                                            <span className="text-2xl">🔥</span>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Current Streak</div>
                                            <div className="text-xl font-bold text-gray-900">{dashboard?.streak ?? 0} Days</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ThreeDCard>
                    </div>

                    <AnimatePresence mode='wait'>
                        {tab === 'overview' && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                {/* Stat Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Predicted Score', val: prediction?.predicted_score != null ? Math.round(prediction.predicted_score) : '-', unit: '%', icon: '🎯', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                        { label: 'Burnout Risk', val: prediction?.burnout_risk != null ? (prediction.burnout_risk * 100).toFixed(0) : '-', unit: '%', icon: '😰', color: 'text-pink-600', bg: 'bg-pink-50' },
                                        { label: 'Study Hours', val: dashboard?.stats?.avg_study_hours || 0, unit: 'hrs/day', icon: '⏱️', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                        { label: 'Mock Avg', val: dashboard?.stats?.avg_mock_score || 0, unit: 'pts', icon: '📝', color: 'text-amber-600', bg: 'bg-amber-50' },
                                    ].map((s, i) => (
                                        <ThreeDCard key={i} options={{ max: 15, scale: 1.03 }}>
                                            <div className="bg-white p-6 rounded-[1.5rem] shadow-xl border border-gray-100 h-full relative overflow-hidden group">
                                                <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-500 text-6xl select-none`}>
                                                    {s.icon}
                                                </div>
                                                <div className="relative z-10">
                                                    <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm`}>
                                                        {s.icon}
                                                    </div>
                                                    <div className="text-3xl font-display font-bold text-gray-900 mb-1">
                                                        {s.val}<span className="text-sm font-medium text-gray-400 ml-1">{s.unit}</span>
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-500">{s.label}</div>
                                                </div>
                                            </div>
                                        </ThreeDCard>
                                    ))}
                                </div>

                                {/* Main Chart Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2">
                                        <ThreeDCard options={{ max: 5, scale: 1 }}>
                                            <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 h-full">
                                                <div className="flex items-center justify-between mb-6">
                                                    <h3 className="font-bold text-xl text-gray-900">📈 Growth Trajectory</h3>
                                                    <select className="bg-gray-50 border-none text-sm rounded-lg px-3 py-1 text-gray-500 focus:ring-0 cursor-pointer">
                                                        <option>Last 30 Days</option>
                                                        <option>Last 3 Months</option>
                                                    </select>
                                                </div>
                                                <div className="h-72 w-full">
                                                    <GrowthChart logs={logs} />
                                                </div>
                                            </div>
                                        </ThreeDCard>
                                    </div>

                                    <div className="lg:col-span-1">
                                        <ThreeDCard options={{ max: 5, scale: 1 }}>
                                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-[2rem] shadow-2xl text-white h-full relative overflow-hidden">
                                                <FloatingShape color="#ffffff" size={150} top="-20%" left="-20%" delay={0} />
                                                <div className="relative z-10">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <h3 className="font-bold text-lg opacity-90">🚀 Quick Actions</h3>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <button onClick={() => setTab('log')} className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center gap-3 transition-all group">
                                                            <span className="bg-white/20 p-2 rounded-lg group-hover:scale-110 transition-transform">📝</span>
                                                            <div className="text-left">
                                                                <div className="font-bold text-sm">Log Today's Progress</div>
                                                                <div className="text-xs opacity-70">Keep your streak alive!</div>
                                                            </div>
                                                        </button>
                                                        <button onClick={() => setTab('simulator')} className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center gap-3 transition-all group">
                                                            <span className="bg-white/20 p-2 rounded-lg group-hover:scale-110 transition-transform">🧪</span>
                                                            <div className="text-left">
                                                                <div className="font-bold text-sm">Run Simulation</div>
                                                                <div className="text-xs opacity-70">Test "What-if" scenarios</div>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </ThreeDCard>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {tab === 'log' && (
                            <motion.div
                                key="log"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <DailyLogForm studentId={me.id} onSuccess={async () => { await refreshDashboard(); setTab('overview'); }} />
                            </motion.div>
                        )}

                        {tab === 'history' && (
                            <motion.div
                                key="history"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-display font-bold text-gray-900 text-xl">📋 Past Log Entries</h3>
                                        <span className="text-sm font-medium bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">{logs.length} entries</span>
                                    </div>
                                    {logs.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="text-5xl mb-4">📭</div>
                                            <p className="text-gray-500">No log entries yet. Start by logging your daily progress!</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs">
                                                    <tr>
                                                        <th className="px-4 py-3 rounded-l-xl">Date</th>
                                                        <th className="px-4 py-3">Study Hrs</th>
                                                        <th className="px-4 py-3">Problems</th>
                                                        <th className="px-4 py-3">Mock Score</th>
                                                        <th className="px-4 py-3">Confidence</th>
                                                        <th className="px-4 py-3">Mood</th>
                                                        <th className="px-4 py-3 rounded-r-xl">Skill</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {logs.map((log, i) => (
                                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-4 py-3 font-medium text-gray-900">{new Date(log.date).toLocaleDateString()}</td>
                                                            <td className="px-4 py-3">{log.study_hours}h</td>
                                                            <td className="px-4 py-3">{log.problems_solved}</td>
                                                            <td className="px-4 py-3">
                                                                <span className={`px-2 py-1 rounded-md font-bold text-xs ${log.mock_score >= 70 ? 'bg-green-100 text-green-700' :
                                                                    log.mock_score >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                                    }`}>{log.mock_score ?? '-'}</span>
                                                            </td>
                                                            <td className="px-4 py-3">{log.confidence}/5</td>
                                                            <td className="px-4 py-3 text-lg">
                                                                {['😰', '😟', '😐', '🙂', '😊'][(log.mood || 3) - 1]}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md text-xs font-bold">{log.skill_practiced || 'Other'}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {tab === 'roadmap' && (
                            <motion.div key="roadmap" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <RoadmapView studentId={me.id} />
                            </motion.div>
                        )}

                        {tab === 'chat' && (
                            <motion.div key="chat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-[600px]">
                                <ThreeDCard options={{ max: 5, scale: 1 }}>
                                    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 h-full overflow-hidden">
                                        <ChatAssistant studentId={me.id} />
                                    </div>
                                </ThreeDCard>
                            </motion.div>
                        )}

                        {tab === 'simulator' && (
                            <motion.div key="simulator" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <ThreeDCard options={{ max: 5, scale: 1 }}>
                                    <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100">
                                        <Simulator studentId={me.id} prediction={prediction} />
                                    </div>
                                </ThreeDCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </AnimatedLayout>
            </main>
        </div>
    );
}
