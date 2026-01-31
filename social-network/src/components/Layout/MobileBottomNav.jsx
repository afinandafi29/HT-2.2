import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Rss, User, Search, PlusSquare, LogIn } from 'lucide-react';
import InstallApp from '../InstallApp';
import { useAuth } from '../../contexts/AuthContext';

const MobileBottomNav = ({ onCreateRoom }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();

    // Navigation items rearranged: Home, Feed, Create, Search, Profile/SignIn
    const navItems = [
        { id: 'home', icon: Home, label: 'Home', path: '/' },
        { id: 'feed', icon: Rss, label: 'Feed', path: '/feed' },
        { id: 'create', icon: PlusSquare, label: 'Create', action: onCreateRoom },
        { id: 'search', icon: Search, label: 'Search', path: '/news/search' },
        {
            id: 'profile',
            icon: currentUser ? User : LogIn,
            label: currentUser ? 'Profile' : 'Sign In',
            path: currentUser ? '/profile' : '/in'
        },
    ];

    const isActive = (path) => {
        if (!path) return false;
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <div className="fixed bottom-0 left-0 w-full z-50 md:hidden">
            <div className="bg-gradient-to-r from-blue-900 to-blue-600 flex justify-around items-center pb-safe pt-3 pb-3 shadow-lg border-t border-blue-500/30">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = item.path ? isActive(item.path) : false;

                    const ButtonContent = (
                        <button
                            onClick={() => item.action ? item.action() : navigate(item.path)}
                            className={`flex flex-col items-center justify-center w-full space-y-1 ${active ? 'text-white' : 'text-blue-100/70 hover:text-white'} transition-colors duration-200`}
                        >
                            <div className={`p-1 rounded-lg ${active ? 'bg-white/10' : ''}`}>
                                <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                            </div>
                            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                            {active && (
                                <div className="h-1 w-1 rounded-full bg-white mt-0.5" />
                            )}
                        </button>
                    );

                    if (item.id === 'create') {
                        return (
                            <div key={item.id} className="relative w-full flex justify-center">
                                <InstallApp className="absolute bottom-[110%] left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-black/20 z-50 whitespace-nowrap animate-bounce flex items-center gap-1 border border-white/20" />
                                {ButtonContent}
                            </div>
                        );
                    }

                    return <div key={item.id} className="w-full">{ButtonContent}</div>;
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;
