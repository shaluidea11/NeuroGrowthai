import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { dashboardAPI, predictionAPI, logsAPI, roadmapAPI, assistantAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import GrowthChart from '../components/GrowthChart';
import ScoreGauge from '../components/ScoreGauge';
import BurnoutIndicator from '../components/BurnoutIndicator';
import DailyLogForm from '../components/DailyLogForm';
import RoadmapView from '../components/RoadmapView';
import ChatAssistant from '../components/ChatAssistant';
import Simulator from '../components/Simulator';
import FeatureImportance from '../components/FeatureImportance';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('user') || 'null');
        if (!u) { router.push('/'); return; }
        setUser(u);
        fetchDashboard(u.id);
    }, []);

    const fetchDashboard = async (id) => {
        try {
            const res = await dashboardAPI.get(id);
            setData(res.data);
        } catch (err) {
            console.error('Dashboard fetch failed:', err);
        }
        setLoading(false);
    };

    const handlePredict = async () => {
        if (!user) return;
        try {
            const res = await predictionAPI.predict(user.id);
            setData(prev => ({ ...prev, prediction: res.data }));
        } catch (err) { console.error(err); }
    };

    const handleGenerateRoadmap = async () => {
        if (!user) return;
        try {
            const res = await roadmapAPI.generate({
                student_id: user.id,
                weak_areas: ['DSA', 'Math', 'ML'],
            });
            setData(prev => ({ ...prev, roadmap: res.data.roadmap }));
        } catch (err) { console.error(err); }
    };

    const handleLogSubmit = async () => {
        await fetchDashboard(user.id);
        setActiveTab('overview');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl mb-4 animate-float">🎓</div>
                    <div className="text-xl gradient-text font-semibold">Loading NeuroGrowth AI...</div>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: '📊 Overview', icon: '📊' },
        { id: 'log', label: '📝 Log Progress', icon: '📝' },
        { id: 'roadmap', label: '🗺️ Roadmap', icon: '🗺️' },
        { id: 'chat', label: '🤖 AI Assistant', icon: '🤖' },
        { id: 'simulator', label: '⚡ Simulator', icon: '⚡' },
    ];

    return (
        <>
            <Head>
                <title>Dashboard — NeuroGrowth AI</title>
            </Head>

            <div className="flex min-h-screen">
                <Sidebar user={user} activeTab={activeTab} tabs={tabs} onTabChange={setActiveTab} onLogout={logout} />

                <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold">
                                {activeTab === 'overview' && '📊 Performance Overview'}
                                {activeTab === 'log' && '📝 Log Daily Progress'}
                                {activeTab === 'roadmap' && '🗺️ Your Roadmap'}
                                {activeTab === 'chat' && '🤖 AI Assistant'}
                                {activeTab === 'simulator' && '⚡ Performance Simulator'}
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">
                                Welcome back, {user?.name}
                                {data?.learning_style?.style && (
                                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs"
                                        style={{ background: data.learning_style.style.color + '20', color: data.learning_style.style.color }}>
                                        {data.learning_style.style.name}
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={handlePredict}
                                className="bg-neuro-600/20 text-neuro-400 px-4 py-2 rounded-xl text-sm hover:bg-neuro-600/30 transition">
                                🔮 Predict
                            </button>
                            <button onClick={handleGenerateRoadmap}
                                className="bg-purple-600/20 text-purple-400 px-4 py-2 rounded-xl text-sm hover:bg-purple-600/30 transition">
                                🗺️ Generate Roadmap
                            </button>
                        </div>
                    </div>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6 animate-slide-up">
                            {/* Top Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="card">
                                    <div className="text-sm text-gray-400 mb-1">Predicted Score</div>
                                    <div className="text-3xl font-bold gradient-text">
                                        {data?.prediction?.predicted_score?.toFixed(1) || '—'}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">out of 100</div>
                                </div>
                                <div className="card">
                                    <div className="text-sm text-gray-400 mb-1">Improvement Velocity</div>
                                    <div className="text-3xl font-bold text-accent-green">
                                        {data?.prediction?.improvement_velocity > 0 ? '+' : ''}{data?.prediction?.improvement_velocity?.toFixed(1) || '0'}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">pts/day trend</div>
                                </div>
                                <div className="card">
                                    <div className="text-sm text-gray-400 mb-1">Avg Study Hours</div>
                                    <div className="text-3xl font-bold text-neuro-400">{data?.stats?.avg_study_hours || 0}</div>
                                    <div className="text-xs text-gray-500 mt-1">hrs/day</div>
                                </div>
                                <div className="card">
                                    <div className="text-sm text-gray-400 mb-1">Total Logs</div>
                                    <div className="text-3xl font-bold text-accent-purple">{data?.stats?.total_logs || 0}</div>
                                    <div className="text-xs text-gray-500 mt-1">days tracked</div>
                                </div>
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 card">
                                    <h3 className="text-lg font-semibold mb-4">📈 Growth Trajectory</h3>
                                    <GrowthChart logs={data?.daily_logs || []} />
                                </div>
                                <div className="space-y-4">
                                    <div className="card">
                                        <h3 className="text-sm font-semibold mb-3">🎯 Score Prediction</h3>
                                        <ScoreGauge score={data?.prediction?.predicted_score || 0} />
                                    </div>
                                    <div className="card">
                                        <h3 className="text-sm font-semibold mb-3">🔥 Burnout Risk</h3>
                                        <BurnoutIndicator risk={data?.prediction?.burnout_risk || 0} />
                                    </div>
                                </div>
                            </div>

                            {/* Feature Importance */}
                            {data?.prediction?.feature_importance && (
                                <div className="card">
                                    <h3 className="text-lg font-semibold mb-4">🧠 Feature Impact (SHAP)</h3>
                                    <FeatureImportance data={data.prediction.feature_importance} />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Log Tab */}
                    {activeTab === 'log' && (
                        <div className="max-w-2xl animate-slide-up">
                            <DailyLogForm studentId={user?.id} onSuccess={handleLogSubmit} />
                        </div>
                    )}

                    {/* Roadmap Tab */}
                    {activeTab === 'roadmap' && (
                        <div className="animate-slide-up">
                            {data?.roadmap ? (
                                <RoadmapView roadmap={data.roadmap} />
                            ) : (
                                <div className="card text-center py-16">
                                    <div className="text-5xl mb-4">🗺️</div>
                                    <p className="text-gray-400 mb-4">No roadmap generated yet</p>
                                    <button onClick={handleGenerateRoadmap}
                                        className="bg-gradient-to-r from-neuro-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
                                        Generate Your Roadmap
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Chat Tab */}
                    {activeTab === 'chat' && (
                        <div className="max-w-3xl animate-slide-up">
                            <ChatAssistant studentId={user?.id} />
                        </div>
                    )}

                    {/* Simulator Tab */}
                    {activeTab === 'simulator' && (
                        <div className="max-w-3xl animate-slide-up">
                            <Simulator studentId={user?.id} currentPrediction={data?.prediction} />
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
