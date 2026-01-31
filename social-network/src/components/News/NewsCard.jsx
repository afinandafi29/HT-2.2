import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ExternalLink, ImageOff, Share2 } from 'lucide-react';

const NewsCard = ({ article }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    const cleanContent = (text) => {
        if (!text) return '';
        return text.replace(/\[\+\d+ chars\]/g, '').replace(/\.\.\.$/, '').trim();
    };

    return (
        <div className="group bg-[#12141c]/90 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full">
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden bg-[#1a1d23]">
                {article.image_url ? (
                    <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.parentNode.innerHTML = '<div class="flex items-center justify-center w-full h-full text-zinc-400"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M21 21l-3.24-3.24"></path><path d="M1 9v11a2 2 0 0 0 2 2h18"></path><path d="M13 13h4c.5 0 .96.1 1.37.28"></path><path d="M9 1a2 2 0 0 1 2 2v2"></path><path d="M17 3v2"></path><path d="M15.5 13a4.5 4.5 0 0 0-3.5 1"></path><path d="M4 11h4a2 2 0 0 1 2 2v6"></path></svg></div>';
                        }}
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-white/30">
                        <ImageOff size={48} />
                    </div>
                )}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {article.categories?.slice(0, 2).map((cat) => (
                        <span key={cat} className="px-3 py-1 text-xs font-bold tracking-wider text-white uppercase bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-lg">
                            {cat}
                        </span>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow p-6 md:p-8">
                <div className="flex items-center justify-between mb-4 text-xs font-medium tracking-wide text-white/50">
                    <span className="text-blue-400 flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">
                        {article.source}
                    </span>
                    <span className="flex items-center gap-1.5 opacity-70">
                        <Clock size={14} />
                        {formatDate(article.published_at)}
                    </span>
                </div>

                <Link
                    to={`/news/article/${article.uuid}`}
                    state={{ article }}
                    className="block group-hover:text-blue-500 transition-colors"
                >
                    <h3 className="mb-4 text-xl md:text-2xl font-bold leading-tight text-white line-clamp-3 group-hover:underline decoration-2 underline-offset-4 decoration-blue-500/50">
                        {article.title}
                    </h3>
                </Link>

                <p className="mb-6 text-base text-white line-clamp-2 leading-relaxed font-light">
                    {cleanContent(article.snippet || article.description)}
                </p>

                <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                    <Link
                        to={`/news/article/${article.uuid}`}
                        state={{ article }}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full transition-all flex items-center gap-2 uppercase tracking-wide group/link shadow-lg shadow-blue-600/20"
                    >
                        Read story
                        <svg className="w-3 h-3 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const shareUrl = `${window.location.origin}/news/article/${article.uuid}`;
                                navigator.clipboard.writeText(shareUrl);
                                alert('Copied');
                            }}
                            className="p-2 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-full transition-all border border-blue-500/20"
                            title="Copy link to post"
                        >
                            <Share2 size={18} />
                        </button>
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all"
                            title="Open original source"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsCard;
