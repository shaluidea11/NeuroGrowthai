/**
 * Simulator Component (Claymorphism)
 */

import { useState } from 'react';
import api from '../services/api';

export default function Simulator({ studentId, prediction }) {
    const [params, setParams] = useState({
        study_hours_change: 0,
        problems_change: 0,
        confidence_change: 0,
        mock_score_change: 0,
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSimulate = async () => {
        setLoading(true);
        try {
            const { data } = await api.simulate({ student_id: studentId, ...params });
            setResult(data);
        } catch {
            alert('Simulation failed');
        } finally {
            setLoading(false);
        }
    };

    const sliders = [
        { key: 'study_hours_change', label: 'Study Hours', icon: '⏱️', min: -4, max: 4, unit: 'hrs' },
        { key: 'problems_change', label: 'Problems Solved', icon: '🧩', min: -10, max: 10, unit: '' },
        { key: 'confidence_change', label: 'Confidence', icon: '💪', min: -2, max: 2, unit: '' },
        { key: 'mock_score_change', label: 'Mock Score', icon: '📊', min: -20, max: 20, unit: 'pts' },
    ];

    return (
        <div>
            <h3 className="font-display font-bold text-clay-text text-xl mb-2">🧪 What-If Simulator</h3>
            <p className="text-clay-subtext text-sm mb-6">Adjust parameters to see how changes affect your predicted score</p>

            <div className="space-y-5 mb-8">
                {sliders.map(s => (
                    <div key={s.key} className="p-4 rounded-2xl bg-clay-bg" style={{ boxShadow: 'inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #ffffff' }}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-clay-text">{s.icon} {s.label}</span>
                            <span className={`text-sm font-bold ${params[s.key] > 0 ? 'text-accent-green' : params[s.key] < 0 ? 'text-accent-red' : 'text-clay-subtext'}`}>
                                {params[s.key] > 0 ? '+' : ''}{params[s.key]}{s.unit}
                            </span>
                        </div>
                        <input type="range" min={s.min} max={s.max} step={1}
                            value={params[s.key]}
                            onChange={e => setParams({ ...params, [s.key]: parseInt(e.target.value) })}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-clay-accent"
                            style={{ background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${((params[s.key] - s.min) / (s.max - s.min)) * 100}%, #e2e8f0 ${((params[s.key] - s.min) / (s.max - s.min)) * 100}%, #e2e8f0 100%)` }} />
                    </div>
                ))}
            </div>

            <button onClick={handleSimulate} disabled={loading}
                className="w-full clay-button-primary !py-4 !text-base mb-6">
                {loading ? (
                    <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : '🔮 Run Simulation'}
            </button>

            {result && (
                <div className="clay-card animate-pop !bg-gradient-to-br !from-clay-accent/5 !to-clay-secondary/5">
                    <h4 className="font-display font-bold text-clay-text mb-4">Simulation Results</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 rounded-2xl bg-white">
                            <div className="text-xs text-clay-subtext mb-1">Current</div>
                            <div className="text-2xl font-bold text-clay-text">{Math.round(prediction?.predicted_score || 0)}</div>
                        </div>
                        <div className="text-center p-4 rounded-2xl bg-white">
                            <div className="text-xs text-clay-subtext mb-1">Simulated</div>
                            <div className="text-2xl font-bold text-clay-accent">{Math.round(result.simulated_score || 0)}</div>
                        </div>
                    </div>
                    <div className="text-center mt-4">
                        <span className={`text-lg font-bold ${(result.simulated_score - (prediction?.predicted_score || 0)) >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                            {(result.simulated_score - (prediction?.predicted_score || 0)) >= 0 ? '📈 +' : '📉 '}
                            {(result.simulated_score - (prediction?.predicted_score || 0)).toFixed(1)} points
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
