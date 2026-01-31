import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeScreen = () => {
    const { theme, changeTheme, customColor, changeCustomColor } = useTheme();

    return (
        <div className="w-full h-full bg-black text-white p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Appearance</h2>

            <div className="space-y-4">
                <button
                    className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${theme === 'space' && !customColor ? 'bg-blue-600' : 'bg-gray-800'}`}
                    onClick={() => changeTheme('space')}
                >
                    <div className="flex items-center gap-3">
                        <i className="fas fa-rocket text-xl"></i>
                        <span className="text-lg font-medium">Space Theme</span>
                    </div>
                    {theme === 'space' && !customColor && <i className="fas fa-check"></i>}
                </button>

                <button
                    className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${theme === 'dark' && !customColor ? 'bg-blue-600' : 'bg-gray-800'}`}
                    onClick={() => changeTheme('dark')}
                >
                    <div className="flex items-center gap-3">
                        <i className="fas fa-moon text-xl"></i>
                        <span className="text-lg font-medium">Dark Theme</span>
                    </div>
                    {theme === 'dark' && !customColor && <i className="fas fa-check"></i>}
                </button>

                <button
                    className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${theme === 'light' && !customColor ? 'bg-blue-600' : 'bg-gray-800'}`}
                    onClick={() => changeTheme('light')}
                >
                    <div className="flex items-center gap-3">
                        <i className="fas fa-sun text-xl"></i>
                        <span className="text-lg font-medium">Light Theme</span>
                    </div>
                    {theme === 'light' && !customColor && <i className="fas fa-check"></i>}
                </button>

                <div className={`relative w-full p-4 rounded-xl flex items-center justify-between transition-all ${customColor ? 'bg-blue-600' : 'bg-gray-800'}`} style={{ overflow: 'hidden' }}>
                    <input
                        type="color"
                        id="custom-color-input-phone"
                        className="absolute opacity-0 w-full h-full cursor-pointer left-0 top-0 z-10"
                        onChange={(e) => changeCustomColor(e.target.value)}
                        value={customColor || '#000000'}
                    />
                    <div className="flex items-center gap-3 pointer-events-none">
                        <i className="fas fa-palette text-xl"></i>
                        <span className="text-lg font-medium">Custom Color</span>
                    </div>
                    {customColor && (
                        <div
                            className="w-6 h-6 rounded-full border border-white/20"
                            style={{ background: customColor }}
                        ></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ThemeScreen;
