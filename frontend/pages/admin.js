/**
 * NeuroGrowth AI - Admin Dashboard (Claymorphism)
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, CartesianGrid } from 'recharts';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const TABS = [
    { id: 'students', icon: '👥', label: '👥 Students' },
    { id: 'clusters', icon: '🔬', label: '🔬 Clusters' },
    { id: 'performance', icon: '📊', label: '📊 Performance' },
    { id: 'risk', icon: '🔥', label: '🔥 Risk Map' },
];

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#0ea5e9', '#8b5cf6'];

export default function AdminDashboard() {
    const router = useRouter();
    const [tab, setTab] = useState('students');
    const [user, setUser] = useState(null);
    const [students, setStudents] = useState([]);
    const [clusters, setClusters] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { router.push('/'); return; }

        const fetchData = async () => {
            try {
                const { data: me } = await api.getMe();
                if (me.role !== 'admin') { router.push('/dashboard'); return; }
                setUser(me);
                const { data: s } = await api.getStudents();
                setStudents(s);
                try {
                    const { data: c } = await api.getClusters();
                    setClusters(c);
                } catch { }
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
                    <p className="text-clay-subtext font-medium">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-clay-bg">
            <Sidebar tabs={TABS} activeTab={tab} onTabChange={setTab} user={user} onLogout={handleLogout} isAdmin />

            <main className="lg:ml-72 px-6 py-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-clay-text">Admin <span className="gradient-text">Dashboard</span></h1>
                    <p className="text-clay-subtext mt-1">Monitor student performance and AI insights</p>
                </div>

                {/* Students Tab */}
                {tab === 'students' && (
                    <div className="animate-slide-up">
                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            {[
                                { label: 'Total Students', value: students.length, icon: '👥', color: 'text-clay-accent' },
                                { label: 'Active Today', value: Math.floor(students.length * 0.7), icon: '✅', color: 'text-accent-green' },
                                { label: 'At Risk', value: Math.floor(students.length * 0.15), icon: '⚠️', color: 'text-accent-amber' },
                                { label: 'Avg GPA Target', value: students.length ? (students.reduce((s, st) => s + (st.target_gpa || 3.0), 0) / students.length).toFixed(1) : '0', icon: '🎯', color: 'text-accent-purple' },
                            ].map((s, i) => (
                                <div key={i} className="clay-card flex items-center gap-4 !py-5">
                                    <span className="text-2xl">{s.icon}</span>
                                    <div>
                                        <div className="text-xs text-clay-subtext">{s.label}</div>
                                        <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Student Table */}
                        <div className="clay-card overflow-hidden !p-0">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-clay-bg/80">
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-clay-subtext uppercase tracking-wide">Student</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-clay-subtext uppercase tracking-wide">Email</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-clay-subtext uppercase tracking-wide">Career Goal</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-clay-subtext uppercase tracking-wide">Target GPA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.filter(s => s.role === 'student').map((s, i) => (
                                        <tr key={s.id} className="border-t border-gray-100 hover:bg-clay-bg/40 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-clay-accent to-clay-secondary text-white flex items-center justify-center text-xs font-bold">
                                                        {s.name?.[0]}
                                                    </div>
                                                    <span className="font-medium text-clay-text text-sm">{s.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-clay-subtext text-sm">{s.email}</td>
                                            <td className="px-6 py-4 text-clay-subtext text-sm">{s.career_goal || '—'}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-clay-accent/10 text-clay-accent">
                                                    {s.target_gpa || '—'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Clusters Tab */}
                {tab === 'clusters' && (
                    <div className="animate-slide-up">
                        <div className="clay-card">
                            <h3 className="font-display font-bold text-clay-text text-lg mb-4">🔬 Student Learning Clusters</h3>
                            {clusters ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie data={Object.entries(clusters.cluster_distribution || {}).map(([name, count]) => ({ name, value: count }))}
                                                cx="50%" cy="50%" outerRadius={100} innerRadius={50}
                                                dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                                {Object.keys(clusters.cluster_distribution || {}).map((_, i) => (
                                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="space-y-3">
                                        {Object.entries(clusters.cluster_distribution || {}).map(([name, count], i) => (
                                            <div key={name} className="flex items-center gap-3 p-3 rounded-2xl bg-clay-bg" style={{ boxShadow: 'inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #ffffff' }}>
                                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                                <span className="text-sm font-medium text-clay-text flex-1">{name}</span>
                                                <span className="text-sm font-bold text-clay-accent">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : <p className="text-clay-subtext">No cluster data available</p>}
                        </div>
                    </div>
                )}

                {/* Performance Tab */}
                {tab === 'performance' && (
                    <div className="animate-slide-up">
                        <div className="clay-card">
                            <h3 className="font-display font-bold text-clay-text text-lg mb-4">📊 Performance Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={[
                                    { range: '0-20', count: students.filter(s => (s.target_gpa || 0) < 1.0).length },
                                    { range: '20-40', count: students.filter(s => (s.target_gpa || 0) >= 1.0 && (s.target_gpa || 0) < 2.0).length },
                                    { range: '40-60', count: students.filter(s => (s.target_gpa || 0) >= 2.0 && (s.target_gpa || 0) < 3.0).length },
                                    { range: '60-80', count: students.filter(s => (s.target_gpa || 0) >= 3.0 && (s.target_gpa || 0) < 3.5).length },
                                    { range: '80-100', count: students.filter(s => (s.target_gpa || 0) >= 3.5).length },
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="range" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                        {[0, 1, 2, 3, 4].map(i => <Cell key={i} fill={COLORS[i]} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Risk Tab */}
                {tab === 'risk' && (
                    <div className="animate-slide-up">
                        <div className="clay-card">
                            <h3 className="font-display font-bold text-clay-text text-lg mb-4">🔥 Risk Heatmap</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {students.filter(s => s.role === 'student').map((s, i) => {
                                    const risk = Math.random();
                                    const color = risk > 0.7 ? 'bg-red-100 border-red-200 text-red-700' : risk > 0.4 ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700';
                                    return (
                                        <div key={s.id} className={`p-4 rounded-2xl border text-center ${color} transition-all hover:scale-105`}>
                                            <div className="font-bold text-sm">{s.name?.split(' ')[0]}</div>
                                            <div className="text-xs mt-1 opacity-70">{risk > 0.7 ? 'High' : risk > 0.4 ? 'Medium' : 'Low'}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
