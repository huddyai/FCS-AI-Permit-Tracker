import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  UploadCloud, 
  BarChart3, 
  Settings, 
  User, 
  Bot,
  Menu,
  X,
  Search
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, onClose, user }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'permits', label: 'Permits', icon: FileText },
    { id: 'conditions', label: 'Conditions', icon: CheckSquare },
    { id: 'evidence', label: 'Evidence', icon: UploadCloud },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-xl text-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 shadow-2xl border-r border-slate-800`}>
      <div className="flex items-center justify-between h-16 px-6 bg-slate-950/50 backdrop-blur-md relative z-10">
        <div className="flex items-center space-x-2">
            {/* FCS Logo Concept - Simple Circles */}
            <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-fcs-teal shadow-[0_0_8px_rgba(45,212,191,0.6)]"></div>
                <div className="w-2 h-2 rounded-full bg-fcs-teal shadow-[0_0_8px_rgba(45,212,191,0.6)]"></div>
                <div className="w-2 h-2 rounded-full bg-fcs-teal shadow-[0_0_8px_rgba(45,212,191,0.6)]"></div>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
            <span className="text-fcs-teal">FCS</span> Compliance
            </span>
        </div>
        <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <nav className="px-4 py-6 space-y-2 relative z-10">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onNavigate(item.id);
              onClose(); // Close mobile menu on select
            }}
            className={`relative group flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden ${
              currentPage === item.id
                ? 'text-white bg-gradient-to-r from-fcs-teal to-teal-600 shadow-[0_4px_20px_-5px_rgba(13,148,136,0.5)] border border-teal-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {/* Hover 3D Backsplash Effect (Only for inactive items) */}
            {currentPage !== item.id && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    {/* Glowing left accent bar */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-fcs-teal rounded-r-full shadow-[0_0_15px_#2dd4bf] blur-[1px]"></div>
                    {/* Subtle gradient background slide */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-800/50 to-transparent translate-x-[-10px] group-hover:translate-x-0 transition-transform duration-300"></div>
                </div>
            )}
            
            <div className="relative z-10 flex items-center transform group-hover:translate-x-2 transition-transform duration-300 ease-out">
              <item.icon size={18} className={`mr-3 transition-colors duration-300 ${
                  currentPage === item.id ? 'text-white' : 'text-slate-500 group-hover:text-fcs-accent'
              }`} />
              {item.label}
            </div>
          </button>
        ))}
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 bg-slate-950/30 backdrop-blur-sm border-t border-slate-800 z-10">
        <div className="flex items-center space-x-3">
           <img src={user.avatarUrl} alt="User" className="w-8 h-8 rounded-full border border-slate-600 bg-slate-800 object-cover ring-2 ring-slate-800" />
           <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.role}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Interactive Background Component ---
const InteractiveBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Small optimization: only update every frame if needed, but react state is fast enough for this simple effect
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-slate-50">
      {/* Technical Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0f172a 1px, transparent 1px),
            linear-gradient(to bottom, #0f172a 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Radial Gradient overlay for vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(248,250,252,0.8)_100%)]" />

      {/* Floating Orbs - Interactive */}
      <div 
        className="absolute w-[600px] h-[600px] bg-fcs-teal/10 rounded-full blur-[100px] transition-transform duration-[2000ms] ease-out will-change-transform mix-blend-multiply"
        style={{
          top: '-10%',
          left: '-10%',
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }}
      />
      
      <div 
        className="absolute w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[80px] transition-transform duration-[2500ms] ease-out will-change-transform mix-blend-multiply"
        style={{
          top: '20%',
          right: '-5%',
          transform: `translate(${-mousePosition.x * 0.02}px, ${mousePosition.y * 0.03}px)`
        }}
      />

      <div 
        className="absolute w-[400px] h-[400px] bg-emerald-300/10 rounded-full blur-[90px] transition-transform duration-[3000ms] ease-out will-change-transform mix-blend-multiply"
        style={{
          bottom: '-10%',
          left: '20%',
          transform: `translate(${mousePosition.x * 0.01}px, ${-mousePosition.y * 0.02}px)`
        }}
      />
    </div>
  );
};

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  toggleAI: () => void;
  isAIArgs: boolean;
  user: UserProfile;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, toggleAI, isAIArgs, user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden relative font-sans text-slate-800">
      <InteractiveBackground />
      
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={onNavigate} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        user={user}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Top Header - Glassmorphism */}
        <header className="h-16 bg-white/70 backdrop-blur-md border-b border-white/20 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
            <div className="flex items-center">
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 mr-2 hover:bg-slate-100 rounded-lg">
                    <Menu size={20} />
                </button>
                <h1 className="text-xl font-semibold text-slate-800 capitalize hidden sm:block tracking-tight">
                    {currentPage === 'dashboard' ? 'Overview' : currentPage}
                </h1>
            </div>

            <div className="flex items-center space-x-4">
                <div className="hidden md:flex relative group">
                    <input 
                        type="text" 
                        placeholder="Search permits, conditions..." 
                        className="w-64 pl-10 pr-4 py-1.5 rounded-full border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-fcs-teal/50 focus:border-fcs-teal focus:bg-white transition-all shadow-sm"
                    />
                    <Search className="absolute left-3 top-2 text-slate-400 group-focus-within:text-fcs-teal transition-colors" size={16} />
                </div>
                
                <button 
                    onClick={toggleAI}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                        isAIArgs 
                        ? 'bg-fcs-teal text-white border-fcs-teal shadow-[0_0_15px_rgba(13,148,136,0.3)]' 
                        : 'bg-white/50 text-slate-600 border-slate-200 hover:bg-white hover:shadow-md backdrop-blur-sm'
                    }`}
                >
                    <Bot size={18} className={isAIArgs ? 'animate-pulse' : ''} />
                    <span className="text-sm font-medium">AI Assistant</span>
                </button>
            </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
            {children}
        </main>
      </div>
    </div>
  );
};