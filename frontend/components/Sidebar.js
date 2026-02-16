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
            <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 flex-col bg-clay-bg z-40 p-6">
                <div className="clay-card flex items-center gap-3 mb-8 p-4 py-5 !rounded-3xl">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-clay-accent to-clay-secondary text-white flex items-center justify-center text-xl shadow-lg shadow-indigo-200">
                        🎓
                    </div>
                    <div>
                        <div className="font-bold text-lg font-display text-clay-text">NeuroGrowth</div>
                        <div className="text-xs text-clay-subtext font-medium">{isAdmin ? 'Admin Panel' : 'Student Portal'}</div>
                    </div>
                </div>

                <nav className="flex-1 space-y-3">
                    {tabs.map(t => (
                        <button key={t.id}
                            onClick={() => onTabChange(t.id)}
                            className={`sidebar-link w-full group ${activeTab === t.id ? 'active' : ''}`}>
                            <span className={`text-xl transition-transform group-hover:scale-110 ${activeTab === t.id ? 'scale-110' : ''}`}>{t.icon}</span>
                            <span className="font-medium">{t.label.replace(/^[^\s]+\s/, '')}</span>
                            {activeTab === t.id && <div className="ml-auto w-2 h-2 rounded-full bg-clay-accent" />}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6">
                    <div className="clay-card !p-4 !rounded-3xl flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-clay-bg shadow-inner flex items-center justify-center text-sm font-bold text-clay-accent border border-white">
                            {user?.name?.[0] || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-clay-text truncate">{user?.name}</div>
                            <div className="text-xs text-clay-subtext truncate">{user?.email}</div>
                        </div>
                    </div>
                    <button onClick={onLogout}
                        className="w-full clay-button text-red-500 hover:text-red-600 hover:bg-red-50">
                        <span>🚪</span>
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
