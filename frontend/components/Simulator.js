/**
 * Performance Simulator Component
 * "What if" scenario analysis
 */

import { useState } from 'react';
import { predictionAPI } from '../services/api';
import ScoreGauge from './ScoreGauge';

export default function Simulator({ studentId, currentPrediction }) {
    const [adjustments, setAdjustments] = useState({
        study_hours: 0,
        problems_solved: 0,
        mock_score: 0,
        confidence: 0,
        mood: 0,
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSimulate = async () => {
        setLoading(true);
        try {
            const res = await predictionAPI.simulate({ student_id: studentId, adjustments });
            setResult(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const sliders = [
        { key: 'study_hours', label: 'Study Hours', min: -4, max: 4, step: 0.5, unit: 'hrs/day', icon: '📚' },
        { key: 'problems_solved', label: 'Problems Solved', min: -10, max: 20, step: 1, unit: '/day', icon: '🧩' },
        { key: 'mock_score', label: 'Mock Score Base', min: -20, max: 20, step: 5, unit: 'pts', icon: '📝' },
        { key: 'confidence', label: 'Confidence', min: -2, max: 2, step: 1, unit: 'level', icon: '💪' },
        { key: 'mood', label: 'Mood', min: -2, max: 2, step: 1, unit: 'level', icon: '😊' },
    ];

    const currentScore = currentPrediction?.predicted_score || 50;
    const simScore = result?.predicted_score || currentScore;
    const delta = simScore - currentScore;

    return (
        <div className="space-y-6">
            <div className="card">
                <h3 className="text-lg font-semibold mb-2">⚡ Performance Simulator</h3>
                <p className="text-sm text-gray-400 mb-6">
                    Adjust the sliders to see how changes in your daily routine would affect your predicted score.
                </p>

                <div className="space-y-5">
                    {sliders.map(s => (
                        <div key={s.key}>
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-gray-300">{s.icon} {s.label}</span>
                                <span className={`font-mono font-semibold ${adjustments[s.key] > 0 ? 'text-accent-green' : adjustments[s.key] < 0 ? 'text-accent-red' : 'text-gray-500'}`}>
                                    {adjustments[s.key] > 0 ? '+' : ''}{adjustments[s.key]} {s.unit}
                                </span>
                            </div>
                            <input type="range" min={s.min} max={s.max} step={s.step} value={adjustments[s.key]}
                                onChange={e => setAdjustments({ ...adjustments, [s.key]: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                           [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-neuro-500 
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                           [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-neuro-500/30" />
                        </div>
                    ))}
                </div>

                <button onClick={handleSimulate} disabled={loading}
                    className="w-full mt-6 bg-gradient-to-r from-neuro-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                    {loading ? 'Simulating...' : '⚡ Run Simulation'}
                </button>
            </div>

            {/* Results */}
            {result && (
                <div className="card animate-slide-up">
                    <h4 className="font-semibold mb-4">📊 Simulation Results</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-sm text-gray-400 mb-2">New Predicted Score</div>
                            <ScoreGauge score={simScore} />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-gray-400">Score Change</div>
                                <div className={`text-2xl font-bold ${delta > 0 ? 'text-accent-green' : delta < 0 ? 'text-accent-red' : 'text-gray-400'}`}>
                                    {delta > 0 ? '+' : ''}{delta.toFixed(1)} pts
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-400">Burnout Risk</div>
                                <div className={`text-lg font-semibold ${result.burnout_risk > 0.6 ? 'text-accent-red' : 'text-accent-green'}`}>
                                    {(result.burnout_risk * 100).toFixed(0)}%
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-gray-400">Confidence Interval</div>
                                <div className="text-sm font-medium">
                                    {result.confidence_lower?.toFixed(1)} – {result.confidence_upper?.toFixed(1)}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-400">Velocity</div>
                                <div className="text-lg font-semibold text-neuro-400">
                                    {result.improvement_velocity > 0 ? '+' : ''}{result.improvement_velocity?.toFixed(1)}/day
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
