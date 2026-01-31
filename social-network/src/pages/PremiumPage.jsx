import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Moon } from 'lucide-react';

const PremiumPage = () => {
    const navigate = useNavigate();
    const [period, setPeriod] = useState('1mo');
    const [isDarkMode, setIsDarkMode] = useState(true);

    const prices = {
        'Starter': { '1mo': '$5', '3mo': '$12', '6mo': '$20', '1yr': '$40' },
        'Plus': { '1mo': '$15', '3mo': '$40', '6mo': '$70', '1yr': '$120' },
        'Pro': { '1mo': '$25', '3mo': '$65', '6mo': '$110', '1yr': '$180' },
        'Ultimate': { '1mo': '$100', '3mo': '$250', '6mo': '$400', '1yr': '$600' }
    };

    const metas = {
        'Starter': { '1mo': 'Base access', '3mo': 'Save 20%', '6mo': 'Save 33%', '1yr': 'Save 33%' },
        'Plus': { '1mo': 'Core premium', '3mo': 'Save 11%', '6mo': 'Save 22%', '1yr': 'Save 33%' },
        'Pro': { '1mo': 'Best value', '3mo': 'Save 13%', '6mo': 'Save 27%', '1yr': 'Save 40%' },
        'Ultimate': { '1mo': 'Full access', '3mo': 'Save 17%', '6mo': 'Save 33%', '1yr': 'Save 50%' }
    };

    const cycleText = {
        '1mo': '/ 1 month',
        '3mo': '/ 3 months',
        '6mo': '/ 6 months',
        '1yr': '/ 1 year'
    };

    // Load Buy Me A Coffee Widget ONLY for this page
    useEffect(() => {
        const script = document.createElement('script');
        script.setAttribute('data-name', 'BMC-Widget');
        script.setAttribute('data-cfasync', 'false');
        script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';
        script.setAttribute('data-id', 'socialnetworking');
        script.setAttribute('data-description', 'Support me on Buy me a coffee!');
        script.setAttribute('data-message', '');
        script.setAttribute('data-color', '#5F7FFF');
        script.setAttribute('data-position', 'Right');
        script.setAttribute('data-x_margin', '18');
        script.setAttribute('data-y_margin', '18');
        script.async = true;

        document.head.appendChild(script);

        return () => {
            // Cleanup: remove the script and the injected widget button/iframe
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }

            // BMC widget usually creates an element with id 'bmc-wbtn' and possibly others
            const widgetBtn = document.getElementById('bmc-wbtn');
            if (widgetBtn) widgetBtn.remove();

            const widgetContainer = document.querySelectorAll('iframe[id^="bmc"], div[id^="bmc"]');
            widgetContainer.forEach(el => el.remove());
        };
    }, []);

    // Toggle dark mode class on body for global consistency if needed, 
    // but the styles below are fairly self-contained for the dark look the user provided.
    // We will support a light mode toggle that flips the CSS mainly.

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#020617] text-[#e5e7eb]' : 'bg-[#f8fafc] text-slate-900'}`} style={{
            backgroundImage: isDarkMode ? 'radial-gradient(circle at top,#0f172a 0,#020617 50%,#000 100%)' : 'none'
        }}>

            {/* Navbar removed as we use global layout header now */}


            {/* Main Content from User's HTML */}
            <div className="w-full px-8 pb-8">
                <header className="text-center mb-16">
                    <h1 className="text-[48px] md:text-[64px] font-black tracking-tight mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
                        Unlock HAPPYY TALK Premium
                    </h1>
                </header>

                <div className="flex flex-col items-center gap-4 mb-10">
                    <div className={`inline-flex p-1.5 rounded-full border gap-1 ${isDarkMode ? 'bg-[#0f172a] border-[#94a3b8]/40' : 'bg-slate-100 border-slate-200'}`}>
                        {['1mo', '3mo', '6mo', '1yr'].map((p) => (
                            <div
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 py-2 rounded-full cursor-pointer text-[13px] font-medium transition-all ${period === p
                                    ? 'bg-[#38bdf8]/20 text-[#e5e7eb] font-semibold'
                                    : (isDarkMode ? 'text-[#9ca3af] hover:text-[#e5e7eb]' : 'text-slate-500 hover:text-slate-900')
                                    } ${period === p && !isDarkMode ? '!bg-white !text-blue-600 shadow-sm' : ''}`}
                            >
                                {p === '1mo' ? '1 Month' : p === '3mo' ? '3 Months' : p === '6mo' ? '6 Months' : '1 Year'}
                            </div>
                        ))}
                    </div>
                    <div className="text-[12px] text-[#bbf7d0] bg-green-900/20 px-3 py-1.5 rounded-full border border-green-600/50">
                        Save up to 40% on longer plans
                    </div>
                </div>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {/* Starter */}
                    <PlanCard
                        title="Starter"
                        tag="Starter"
                        desc="Perfect for casual language explorers"
                        price={prices['Starter'][period]}
                        cycle={cycleText[period]}
                        meta={metas['Starter'][period]}
                        isPopular={false}
                        isDarkMode={isDarkMode}
                        features={[
                            { text: 'Limited text translations (daily cap)', type: 'warn' },
                            { text: 'Basic chat (text + voice messages)', type: 'check' },
                            { text: 'Join public chat rooms', type: 'check' },
                            { text: '1 language only', type: 'neutral' },
                            { text: 'Ads included', type: 'cross' }
                        ]}
                    />

                    {/* Plus */}
                    <PlanCard
                        title="Plus"
                        tag="Plus"
                        desc="Better tools for regular practice"
                        price={prices['Plus'][period]}
                        cycle={cycleText[period]}
                        meta={metas['Plus'][period]}
                        isPopular={false}
                        isDarkMode={isDarkMode}
                        features={[
                            { text: 'Unlimited text translations', type: 'check' },
                            { text: 'Voice-to-text (limited)', type: 'warn' },
                            { text: 'No ads', type: 'check' },
                            { text: 'Basic advanced search', type: 'warn' },
                            { text: 'Learn up to 2 languages', type: 'neutral' },
                            { text: 'More daily contacts', type: 'neutral' }
                        ]}
                    />

                    {/* Pro */}
                    <PlanCard
                        title="Pro"
                        tag="Pro ⭐ Most Popular"
                        desc="Full language practice toolkit"
                        price={prices['Pro'][period]}
                        cycle={cycleText[period]}
                        meta={metas['Pro'][period]}
                        isPopular={true}
                        isDarkMode={isDarkMode}
                        features={[
                            { text: 'Unlimited translations + voice-to-text', type: 'check' },
                            { text: 'Full advanced search filters', type: 'check' },
                            { text: 'Nearby user discovery', type: 'check' },
                            { text: 'Learn up to 3 languages', type: 'check' },
                            { text: 'View profile visitors', type: 'check' },
                            { text: 'Pin Moments/posts', type: 'check' },
                            { text: 'Higher profile visibility', type: 'check' }
                        ]}
                    />

                    {/* Ultimate */}
                    <PlanCard
                        title="Ultimate"
                        tag="Ultimate"
                        desc="Everything + creator tools"
                        price={prices['Ultimate'][period]}
                        cycle={cycleText[period]}
                        meta={metas['Ultimate'][period]}
                        isPopular={false}
                        isDarkMode={isDarkMode}
                        features={[
                            { text: 'All Pro features', type: 'check' },
                            { text: 'Maximum profile boost (9× visibility)', type: 'check' },
                            { text: 'Unlimited daily contacts', type: 'check' },
                            { text: 'Priority customer support', type: 'check' },
                            { text: 'Early access to new features', type: 'check' },
                            { text: 'Exclusive stickers & badges', type: 'check' },
                            { text: 'Live rooms + host tools', type: 'check' }
                        ]}
                    />
                </section>

                <div className={`mt-8 text-[12px] text-center p-5 rounded-xl border ${isDarkMode ? 'text-[#9ca3af] bg-[#0f172a]/60 border-[#1f2937]/80' : 'text-slate-500 bg-slate-100 border-slate-200'}`}>
                    <strong>Features by tier:</strong> Starter gets basics, Plus adds core tools, Pro unlocks full language practice (most popular), Ultimate includes everything + creator perks. Prices increase with duration as requested.
                </div>

                {/* Buy Me A Coffee Section */}
                <div className={`mt-16 text-center flex flex-col items-center gap-6 p-8 rounded-3xl border-2 border-dashed ${isDarkMode ? 'border-[#38bdf8]/30 bg-[#0f172a]/40' : 'border-blue-200 bg-blue-50/50'}`}>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Support Our Development</h2>
                    <p className={`max-w-xl text-[14px] ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                        If you love using HAPPYY TALK and want to support our mission to connect the world, consider buying us a coffee! Your support helps keep the servers running.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 items-center">
                        <a href="https://www.buymeacoffee.com/socialnetworking" target="_blank" rel="noreferrer">
                            <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style={{ height: '60px', width: '217px' }} className="hover:scale-105 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Component for the Cards to keep code clean
const PlanCard = ({ title, tag, desc, price, cycle, meta, isPopular, features, isDarkMode }) => {
    return (
        <article className={`relative flex flex-col p-6 rounded-[20px] border transition-all duration-300 group ${isDarkMode
            ? 'bg-[radial-gradient(circle_at_top,#020617_0,#020617_60%,#000_100%)] border-[#1f2937]/90 shadow-[0_16px_36px_rgba(15,23,42,0.9)] hover:border-[#38bdf8]/90 hover:shadow-[0_24px_50px_rgba(15,23,42,1)]'
            : 'bg-white border-slate-200 shadow-xl hover:border-blue-400 hover:shadow-2xl'
            } ${isPopular ? 'hover:-translate-y-2 transform' : 'hover:-translate-y-2 transform'}`}>

            {/* Top Border Gradient */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${isPopular ? 'bg-[#facc15] shadow-[0_0_20px_rgba(250,204,21,0.4)]' : 'bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9]'
                }`} />

            <div className={`text-[12px] px-2.5 py-1 rounded-full border mb-1.5 inline-block w-fit ${isPopular
                ? 'border-[#facc15]/85 text-[#fef9c3] bg-[#facc15]/10'
                : (isDarkMode ? 'border-[#94a3b8]/60 text-[#9ca3af]' : 'border-slate-300 text-slate-500 bg-slate-50')
                } ${isPopular && !isDarkMode ? '!text-yellow-700 !bg-yellow-50' : ''}`}>
                {tag}
            </div>

            <div className="text-[18px] font-bold mb-1">{title}</div>
            <div className={`text-[13px] mb-3 ${isDarkMode ? 'text-[#9ca3af]' : 'text-slate-500'}`}>{desc}</div>

            <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-[24px] font-extrabold tracking-tight">{price}</span>
                <span className={`text-[12px] ${isDarkMode ? 'text-[#9ca3af]' : 'text-slate-400'}`}>{cycle}</span>
            </div>
            <div className="text-[12px] text-[#a5b4fc] mt-1 mb-4">{meta}</div>

            <div className={`my-4 border-b border-dashed ${isDarkMode ? 'border-[#374151]/90' : 'border-slate-200'}`} />

            <ul className="list-none p-0 m-0 mb-3 space-y-2 text-[12px] flex-1">
                {features.map((f, i) => (
                    <li key={i} className={`flex items-start gap-2 ${isDarkMode ? 'text-[#9ca3af]' : 'text-slate-600'}`}>
                        <div className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0 mt-px ${f.type === 'check'
                            ? 'border-[#38bdf8]/90 text-[#7dd3fc]' + (isDarkMode ? '' : ' !border-blue-500 !text-blue-500')
                            : f.type === 'warn'
                                ? 'border-[#94a3b8]/80 text-[#94a3b8]/90' // muted
                                : 'border-[#94a3b8]/80 text-[#94a3b8]/90' // neutral/cross
                            }`}>
                            {f.type === 'check' ? '✓' : f.type === 'warn' ? '⚠️' : f.type === 'cross' ? '✖' : '•'}
                        </div>
                        <span>{f.text}</span>
                    </li>
                ))}
            </ul>

            <div className="mt-auto pt-3">
                <button
                    onClick={() => window.open('https://www.buymeacoffee.com/HAPPYY TALK', '_blank')}
                    className={`w-full py-3 rounded-full border-none cursor-pointer text-[13px] font-semibold text-[#f9fafb] flex items-center justify-center gap-2 transition-all shadow-[0_12px_30px_rgba(37,99,235,0.5)] hover:scale-105 hover:shadow-[0_16px_40px_rgba(37,99,235,0.6)] ${isPopular
                        ? 'bg-gradient-to-r from-[#facc15] to-[#eab308]'
                        : 'bg-gradient-to-r from-[#0ea5e9] to-[#6366f1]'
                        }`}>
                    Get {title}
                </button>
            </div>

        </article>
    );
};

export default PremiumPage;
