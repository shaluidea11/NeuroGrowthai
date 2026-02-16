/**
 * Chat Assistant Component (Claymorphism)
 */

import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { ChatBotIllustration } from './Illustrations';

export default function ChatAssistant({ studentId }) {
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Hi! I'm your AI study assistant 🎓 Ask me anything about your learning journey!" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatRef = useRef(null);

    useEffect(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (text) => {
        if (!text.trim()) return;
        const userMsg = { role: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await api.chatAssistant({ student_id: studentId, message: text });
            setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
        } catch {
            setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I couldn't process that. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        { label: '📊 My Progress', msg: 'How am I doing overall?' },
        { label: '💡 Study Tips', msg: 'Give me study tips' },
        { label: '😰 Burnout Help', msg: 'How to handle burnout?' },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-white/80 flex items-center gap-3">
                <ChatBotIllustration size={50} />
                <div>
                    <h3 className="font-display font-bold text-clay-text text-lg">💬 AI Study Assistant</h3>
                    <p className="text-xs text-clay-subtext">Powered by NeuroGrowth AI</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-3 flex gap-2 overflow-x-auto border-b border-gray-50">
                {quickActions.map((a, i) => (
                    <button key={i} onClick={() => sendMessage(a.msg)}
                        className="shrink-0 px-4 py-2 rounded-2xl text-xs font-medium text-clay-subtext hover:text-clay-accent bg-clay-bg transition-all"
                        style={{ boxShadow: '3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff' }}>
                        {a.label}
                    </button>
                ))}
            </div>

            {/* Messages */}
            <div ref={chatRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-clay-bg/50">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                        <div className={`chat-bubble ${m.role === 'user' ? 'chat-user' : 'chat-bot'}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="chat-bubble chat-bot flex gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="px-6 py-4 bg-white border-t border-gray-100">
                <div className="flex gap-3">
                    <input type="text" className="clay-input !py-3"
                        value={input} onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                        placeholder="Ask me anything..." />
                    <button onClick={() => sendMessage(input)}
                        disabled={!input.trim() || loading}
                        className="clay-button-primary !px-6 !py-3 !rounded-2xl shrink-0 disabled:opacity-50">
                        ➤
                    </button>
                </div>
            </div>
        </div>
    );
}
