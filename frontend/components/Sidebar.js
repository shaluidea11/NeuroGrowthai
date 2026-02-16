/**
 * Sidebar Navigation Component
 */

export default function Sidebar({ user, activeTab, tabs, onTabChange, onLogout, isAdmin }) {
    return (
        <>
            {/* Mobile top bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🎓</span>
                    <span className="font-bold gradient-text text-sm">NeuroGrowth</span>
                </div>
                <div className="flex gap-1">
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => onTabChange(t.id)}
                            className={`p-2 rounded-lg text-sm ${activeTab === t.id ? 'bg-neuro-600/20 text-neuro-400' : 'text-gray-400'}`}>
                            {t.icon}
                        </button>
                    ))}
                </div>
            </div>

            {/* Desktop sidebar */}
            <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col glass border-r border-white/5 z-40">
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neuro-500 to-purple-600 flex items-center justify-center text-lg">
                            🎓
                        </div>
                        <div>
                            <div className="font-bold gradient-text">NeuroGrowth AI</div>
                            <div className="text-xs text-gray-500">{isAdmin ? 'Admin Panel' : 'Student Portal'}</div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {tabs.map(t => (
                        <button key={t.id}
                            onClick={() => onTabChange(t.id)}
                            className={`sidebar-link w-full ${activeTab === t.id ? 'active' : ''}`}>
                            <span className="text-lg">{t.icon}</span>
                            <span className="text-sm">{t.label.replace(/^[^\s]+\s/, '')}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-neuro-600/30 flex items-center justify-center text-sm">
                            {user?.name?.[0] || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{user?.name}</div>
                            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                        </div>
                    </div>
                    <button onClick={onLogout}
                        className="w-full mt-2 sidebar-link text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <span>🚪</span>
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
