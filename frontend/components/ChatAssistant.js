/**
 * Chat Assistant Component
 */

import { useState, useRef, useEffect } from 'react';
import { assistantAPI } from '../services/api';

export default function ChatAssistant({ studentId }) {
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Hi! 👋 I'm your AI learning assistant. Ask me about study strategies, your performance, career guidance, or anything academic!" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEnd = useRef(null);

    useEffect(() => {
        messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const QUICK_ACTIONS = [
        '📚 Study tips',
        '📊 My performance',
        '😌 Burnout advice',
        '📅 Study schedule',
        '🚀 Career guidance',
        '💡 Improve weak areas',
    ];

    const sendMessage = async (text) => {
        const msg = text || input.trim();
        if (!msg) return;

        setMessages(prev => [...prev, { role: 'user', text: msg }]);
        setInput('');
        setLoading(true);

        try {
            const res = await assistantAPI.chat({ student_id: studentId, message: msg });
            setMessages(prev => [...prev, { role: 'bot', text: res.data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'bot', text: '❌ Sorry, I had trouble processing that. Please try again.' }]);
        }
        setLoading(false);
    };

    return (
        <div className="card flex flex-col" style={{ height: '70vh' }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-neuro-500 to-purple-600 flex items-center justify-center text-sm">🤖</span>
                AI Learning Assistant
            </h3>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`chat-bubble ${msg.role === 'user' ? 'chat-user' : 'chat-bot'}`}>
                            <div className="whitespace-pre-wrap">{msg.text}</div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="chat-bubble chat-bot">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEnd} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {QUICK_ACTIONS.map((action, i) => (
                        <button key={i} onClick={() => sendMessage(action)}
                            className="bg-white/5 text-gray-300 px-3 py-1.5 rounded-lg text-xs hover:bg-white/10 transition">
                            {action}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
                <input type="text" value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask me anything about your studies..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-neuro-500 transition"
                    disabled={loading} />
                <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
                    className="bg-neuro-600 text-white px-5 py-3 rounded-xl hover:bg-neuro-500 transition disabled:opacity-30">
                    ➤
                </button>
            </div>
        </div>
    );
}
