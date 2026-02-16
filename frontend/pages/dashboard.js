/**
 * NeuroGrowth AI - Student Dashboard (Claymorphism)
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import GrowthChart from '../components/GrowthChart';
import ScoreGauge from '../components/ScoreGauge';
import BurnoutIndicator from '../components/BurnoutIndicator';
import DailyLogForm from '../components/DailyLogForm';
import ChatAssistant from '../components/ChatAssistant';
import RoadmapView from '../components/RoadmapView';
import Simulator from '../components/Simulator';
import FeatureImportance from '../components/FeatureImportance';

const TABS = [
    { id: 'overview', icon: '🏠', label: '🏠 Overview' },
    { id: 'log', icon: '📝', label: '📝 Daily Log' },
    { id: 'roadmap', icon: '🗺️', label: '🗺️ Roadmap' },
    { id: 'chat', icon: '💬', label: '💬 Assistant' },
    { id: 'simulator', icon: '🧪', label: '🧪 Simulator' },
];

export default function Dashboard() {
    const router = useRouter();
    const [tab, setTab] = useState('overview');
    const [user, setUser] = useState(null);
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { router.push('/'); return; }

        const fetchData = async () => {
            try {
                const { data: me } = await api.getMe();
                setUser(me);
                if (me.role === 'admin') { router.push('/admin'); return; }
                const { data: dash } = await api.getDashboard(me.id);
                setDashboard(dash);
            } catch {
                localStorage.removeItem('token');
                router.push('/');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-clay-bg flex items-center justify-center">
                <div className="clay-card !p-10 text-center animate-pop">
                    <div className="w-16 h-16 border-4 border-clay-bg border-t-clay-accent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-clay-subtext font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const prediction = dashboard?.prediction;
    const logs = dashboard?.logs || [];

    return (
        <div className="min-h-screen bg-clay-bg">
            <Sidebar tabs={TABS} activeTab={tab} onTabChange={setTab} user={user} onLogout={handleLogout} />

            <main className="lg:ml-72 px-6 py-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-clay-text">
                        Hello, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
                    </h1>
                    <p className="text-clay-subtext mt-1">Here's your learning progress today</p>
                </div>

                {/* Overview Tab */}
                {tab === 'overview' && (
                    <div className="space-y-6 animate-slide-up">
                        {/* Top Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="clay-card flex flex-col items-center py-8">
                                <ScoreGauge score={prediction?.predicted_score || 0} />
                                <div className="mt-4 text-sm font-semibold text-clay-subtext">Predicted Score</div>
                            </div>

                            <div className="clay-card flex flex-col items-center py-8">
                                <BurnoutIndicator level={prediction?.burnout_risk || 'low'} />
                            </div>

                            <div className="clay-card py-8 px-6">
                                <h3 className="font-display font-bold text-clay-text mb-4 text-center">Quick Stats</h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Total Logs', value: logs.length, icon: '📝', color: 'text-clay-accent' },
                                        { label: 'Avg Study Hrs', value: logs.length ? (logs.reduce((s, l) => s + l.study_hours, 0) / logs.length).toFixed(1) : '0', icon: '⏱️', color: 'text-accent-amber' },
                                        { label: 'Career Goal', value: user?.career_goal || 'Not set', icon: '🎯', color: 'text-accent-green' },
                                    ].map((s, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-clay-bg" style={{ boxShadow: 'inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #ffffff' }}>
                                            <span className="text-xl">{s.icon}</span>
                                            <div className="flex-1">
                                                <div className="text-xs text-clay-subtext">{s.label}</div>
                                                <div className={`font-bold text-sm ${s.color}`}>{s.value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Growth Chart */}
                        <div className="clay-card">
                            <h3 className="font-display font-bold text-clay-text mb-4 text-lg">📈 Growth Trajectory</h3>
                            <GrowthChart logs={logs} />
                        </div>

                        {/* Feature Importance */}
                        {prediction?.feature_importance && (
                            <div className="clay-card">
                                <h3 className="font-display font-bold text-clay-text mb-4 text-lg">🧠 What Matters Most</h3>
                                <FeatureImportance data={prediction.feature_importance} />
                            </div>
                        )}
                    </div>
                )}

                {/* Daily Log Tab */}
                {tab === 'log' && (
                    <div className="max-w-2xl mx-auto animate-slide-up">
                        <div className="clay-card !p-8">
                            <h3 className="font-display font-bold text-clay-text text-xl mb-6">📝 Log Today's Progress</h3>
                            <DailyLogForm studentId={user?.id} onSuccess={() => window.location.reload()} />
                        </div>
                    </div>
                )}

                {/* Roadmap Tab */}
                {tab === 'roadmap' && (
                    <div className="animate-slide-up">
                        <div className="clay-card !p-8">
                            <RoadmapView studentId={user?.id} />
                        </div>
                    </div>
                )}

                {/* Chat Tab */}
                {tab === 'chat' && (
                    <div className="max-w-3xl mx-auto animate-slide-up">
                        <div className="clay-card !p-0 overflow-hidden" style={{ height: '70vh' }}>
                            <ChatAssistant studentId={user?.id} />
                        </div>
                    </div>
                )}

                {/* Simulator Tab */}
                {tab === 'simulator' && (
                    <div className="max-w-3xl mx-auto animate-slide-up">
                        <div className="clay-card !p-8">
                            <Simulator studentId={user?.id} prediction={prediction} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
