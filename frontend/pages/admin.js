import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { adminAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [students, setStudents] = useState([]);
    const [clustering, setClustering] = useState(null);
    const [distribution, setDistribution] = useState(null);
    const [riskData, setRiskData] = useState([]);
    const [activeTab, setActiveTab] = useState('students');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('user') || 'null');
        if (!u || u.role !== 'admin') { router.push('/'); return; }
        setUser(u);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [studRes, clusterRes, distRes, riskRes] = await Promise.all([
                adminAPI.getStudents(),
                adminAPI.getClustering(),
                adminAPI.getPerformanceDistribution(),
                adminAPI.getRiskHeatmap(),
            ]);
            setStudents(studRes.data);
            setClustering(clusterRes.data);
            setDistribution(distRes.data);
            setRiskData(riskRes.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const handleRetrain = async () => {
        try {
            const res = await adminAPI.retrain();
            alert(res.data.message);
        } catch (err) {
            alert(err.response?.data?.detail || 'Retrain failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    const tabs = [
        { id: 'students', label: '👥 Students', icon: '👥' },
        { id: 'clustering', label: '🎯 Clustering', icon: '🎯' },
        { id: 'distribution', label: '📊 Distribution', icon: '📊' },
        { id: 'risk', label: '🔥 Risk Map', icon: '🔥' },
    ];

    const CLUSTER_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-5xl animate-float">🎓</div>
            </div>
        );
    }

    return (
        <>
            <Head><title>Admin Dashboard — NeuroGrowth AI</title></Head>

            <div className="flex min-h-screen">
                <Sidebar user={user} activeTab={activeTab} tabs={tabs} onTabChange={setActiveTab} onLogout={logout} isAdmin />

                <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold">🛡️ Admin Dashboard</h1>
                            <p className="text-gray-400 text-sm mt-1">{students.length} students tracked</p>
                        </div>
                        <button onClick={handleRetrain}
                            className="bg-accent-green/20 text-accent-green px-4 py-2 rounded-xl text-sm hover:bg-accent-green/30 transition">
                            🔄 Retrain Model
                        </button>
                    </div>

                    {/* Students Table */}
                    {activeTab === 'students' && (
                        <div className="card animate-slide-up overflow-x-auto">
                            <h3 className="text-lg font-semibold mb-4">👥 All Students</h3>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-gray-400 border-b border-white/10">
                                        <th className="text-left pb-3">Name</th>
                                        <th className="text-left pb-3">Email</th>
                                        <th className="text-left pb-3">Target GPA</th>
                                        <th className="text-left pb-3">Career</th>
                                        <th className="text-left pb-3">Logs</th>
                                        <th className="text-left pb-3">Score</th>
                                        <th className="text-left pb-3">Burnout</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.filter(s => s.role === 'student').map(s => (
                                        <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                            <td className="py-3 font-medium">{s.name}</td>
                                            <td className="py-3 text-gray-400">{s.email}</td>
                                            <td className="py-3">{s.target_gpa || '—'}</td>
                                            <td className="py-3 text-xs">{s.career_goal || '—'}</td>
                                            <td className="py-3">{s.log_count}</td>
                                            <td className="py-3">
                                                {s.latest_prediction ? (
                                                    <span className={s.latest_prediction.predicted_score >= 70 ? 'text-accent-green' : s.latest_prediction.predicted_score >= 50 ? 'text-accent-amber' : 'text-accent-red'}>
                                                        {s.latest_prediction.predicted_score.toFixed(1)}
                                                    </span>
                                                ) : '—'}
                                            </td>
                                            <td className="py-3">
                                                {s.latest_prediction ? (
                                                    <span className={`px-2 py-0.5 rounded-full text-xs ${s.latest_prediction.burnout_risk > 0.6 ? 'bg-red-500/20 text-red-400' : s.latest_prediction.burnout_risk > 0.3 ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
                                                        {(s.latest_prediction.burnout_risk * 100).toFixed(0)}%
                                                    </span>
                                                ) : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Clustering */}
                    {activeTab === 'clustering' && clustering && (
                        <div className="space-y-6 animate-slide-up">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {Object.values(clustering.cluster_info || {}).map((c, i) => (
                                    <div key={i} className="card text-center" style={{ borderColor: c.color + '50' }}>
                                        <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ background: c.color }} />
                                        <div className="font-semibold text-sm">{c.name}</div>
                                        <div className="text-xs text-gray-400 mt-1">{c.description}</div>
                                        <div className="text-lg font-bold mt-2" style={{ color: c.color }}>
                                            {clustering.pca_data?.filter(p => p.cluster === i).length || 0}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="card">
                                <h3 className="text-lg font-semibold mb-4">🎯 Student Clustering (PCA)</h3>
                                <ResponsiveContainer width="100%" height={400}>
                                    <ScatterChart>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                                        <XAxis dataKey="x" name="PCA 1" stroke="#6b7280" />
                                        <YAxis dataKey="y" name="PCA 2" stroke="#6b7280" />
                                        <Tooltip content={({ payload }) => {
                                            if (!payload?.length) return null;
                                            const d = payload[0].payload;
                                            return (
                                                <div className="glass rounded-lg p-3 text-xs">
                                                    <div className="font-semibold">{d.name}</div>
                                                    <div className="text-gray-400">{d.style?.name}</div>
                                                </div>
                                            );
                                        }} />
                                        <Scatter data={clustering.pca_data || []}>
                                            {(clustering.pca_data || []).map((entry, i) => (
                                                <Cell key={i} fill={CLUSTER_COLORS[entry.cluster] || '#5c7cfa'} />
                                            ))}
                                        </Scatter>
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Distribution */}
                    {activeTab === 'distribution' && distribution && (
                        <div className="card animate-slide-up">
                            <h3 className="text-lg font-semibold mb-4">📊 Performance Distribution</h3>
                            <div className="text-sm text-gray-400 mb-4">
                                Average Score: <span className="text-white font-semibold">{distribution.avg_score}</span> |
                                Total Students: <span className="text-white font-semibold">{distribution.total_students}</span>
                            </div>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={distribution.distribution}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                                    <XAxis dataKey="range" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip contentStyle={{ background: '#1a2035', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                    <Bar dataKey="count" fill="#5c7cfa" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Risk Heatmap */}
                    {activeTab === 'risk' && (
                        <div className="card animate-slide-up">
                            <h3 className="text-lg font-semibold mb-4">🔥 Burnout Risk Heatmap</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {riskData.map((s) => (
                                    <div key={s.student_id}
                                        className="rounded-xl p-4 text-center transition-transform hover:scale-105"
                                        style={{
                                            background: `rgba(${Math.round(s.burnout_risk * 239)}, ${Math.round((1 - s.burnout_risk) * 185)}, ${Math.round((1 - s.burnout_risk) * 129)}, 0.15)`,
                                            borderLeft: `3px solid rgba(${Math.round(s.burnout_risk * 239)}, ${Math.round((1 - s.burnout_risk) * 185)}, 80, 0.8)`,
                                        }}>
                                        <div className="font-medium text-sm truncate">{s.name}</div>
                                        <div className="text-2xl font-bold mt-1" style={{
                                            color: s.burnout_risk > 0.6 ? '#EF4444' : s.burnout_risk > 0.3 ? '#F59E0B' : '#10B981'
                                        }}>
                                            {(s.burnout_risk * 100).toFixed(0)}%
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">Score: {s.predicted_score.toFixed(0)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
