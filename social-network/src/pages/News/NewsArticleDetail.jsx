import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { newsApi } from '../../api/newsApi';
import NewsCard from '../../components/News/NewsCard';
import NewsSkeleton from '../../components/News/NewsSkeleton';
import { Clock, ExternalLink, ArrowLeft, Share2, Bookmark } from 'lucide-react';

const NewsArticleDetail = () => {
    const { uuid } = useParams();
    const location = useLocation();
    const [article, setArticle] = useState(location.state?.article || null);
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [liked, setLiked] = useState(false);

    const safeAtob = (str) => {
        try {
            return decodeURIComponent(escape(atob(str)));
        } catch (e) {
            return null;
        }
    };

    // Helper to clean content from NewsAPI truncation markers
    const cleanContent = (text) => {
        if (!text) return '';
        // Remove [+1234 chars] and similar patterns
        return text.replace(/\[\+\d+ chars\]/g, '').replace(/\.\.\.$/, '').trim();
    };

    useEffect(() => {
        const fetchData = async () => {
            // Check if we already have the right article in state
            if (article && article.uuid === uuid) {
                setLoading(false);
            } else {
                setLoading(true);
                setArticle(null);
                setSimilar([]);
                setError(null);

                try {
                    // Try to decode UUID as a URL
                    const decodedUrl = safeAtob(uuid);
                    if (decodedUrl && decodedUrl.startsWith('http')) {
                        setArticle({
                            uuid,
                            url: decodedUrl,
                            title: 'Loading Full Article...',
                            source: new URL(decodedUrl).hostname.replace('www.', ''),
                            published_at: new Date().toISOString(),
                            categories: ['News']
                        });
                    } else {
                        // Fallback to API if it supports it
                        const articleData = await newsApi.getArticle(uuid);
                        if (articleData.data) {
                            setArticle(articleData.data);
                        } else {
                            setError('Unable to fetch article details. Please try again.');
                        }
                    }
                } catch (err) {
                    console.error(err);
                    setError('Failed to load article');
                }
            }

            try {
                // Fetch Similar
                const similarData = await newsApi.getSimilarNews(uuid, { limit: 5 });
                setSimilar(similarData.data || []);
            } catch (err) {
                console.warn("Failed to load similar news", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Scroll to top
        window.scrollTo(0, 0);

    }, [uuid, article]);

    const handleShare = (platform) => {
        const shareUrl = encodeURIComponent(`${window.location.origin}/news/article/${uuid}`);
        const title = encodeURIComponent(article.title);
        let url = '';

        switch (platform) {
            case 'twitter': url = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${title}`; break;
            case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`; break;
            case 'whatsapp': url = `https://api.whatsapp.com/send?text=${title}%20${shareUrl}`; break;
            default:
                navigator.clipboard.writeText(decodeURIComponent(shareUrl));
                alert('Copied');
                return;
        }
        window.open(url, '_blank', 'width=600,height=400');
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="h-8 w-32 bg-white/5 rounded-full animate-pulse" />
                    <div className="h-20 w-3/4 bg-white/5 rounded-2xl animate-pulse" />
                    <div className="h-[500px] w-full bg-white/5 rounded-[2.5rem] animate-pulse" />
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <div className="bg-red-500/10 p-10 rounded-[3rem] border border-red-500/20 max-w-lg">
                    <h2 className="text-4xl font-black mb-4 text-white uppercase tracking-tighter">Article not found</h2>
                    <p className="text-gray-400 mb-8">The story you are looking for might have moved or been removed.</p>
                    <Link to="/news" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all">Return to News Feed</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-4 md:px-8 py-12 pb-24 md:pb-12 max-w-[1600px] mx-auto animate-fadeIn">
            <Link to="/news" className="inline-flex items-center text-gray-200 hover:text-blue-500 mb-10 transition-all group bg-[#0f1115] hover:bg-zinc-800 px-6 py-2.5 rounded-full border border-white/10 font-black uppercase text-[10px] tracking-widest shadow-lg">
                <ArrowLeft size={16} className="mr-2 transform group-hover:-translate-x-1 transition-transform" /> Back to News Feed
            </Link>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                {/* Main Article Content */}
                <article className="xl:col-span-9">
                    <header className="mb-12">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="px-5 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                                Featured Story
                            </span>
                            {article.categories?.map(cat => (
                                <span key={cat} className="px-5 py-2 bg-white/5 border border-white/10 text-white/70 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                    {cat}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-4xl md:text-6xl xl:text-7xl font-black mb-10 text-white leading-[1.1] tracking-tighter drop-shadow-2xl">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-x-10 gap-y-6 text-gray-400 text-sm border-y border-white/10 py-8 mb-12">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-lg">
                                    {article.source.substring(0, 1).toUpperCase()}
                                </div>
                                <div>
                                    <div className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Source</div>
                                    <div className="text-white font-bold text-lg">{article.source}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 border-l border-white/10 pl-10">
                                <div className="p-3 bg-white/5 rounded-2xl text-blue-400">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <div className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Published On</div>
                                    <div className="text-white font-bold text-lg">
                                        {new Date(article.published_at).toLocaleDateString(undefined, {
                                            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Interaction Row on Top (Responsive) */}
                            <div className="ml-auto flex items-center gap-4">
                                <button
                                    onClick={() => setLiked(!liked)}
                                    className={`flex items-center gap-3 px-8 py-3.5 rounded-full border transition-all font-black uppercase text-[10px] tracking-widest ${liked ? 'bg-red-500 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-[#0f1115] border-white/10 text-white hover:bg-zinc-800 hover:border-white/20'}`}
                                >
                                    <svg className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                    {liked ? 'Liked' : 'Like'}
                                </button>
                                <button className="flex items-center gap-3 px-8 py-3.5 rounded-full border border-white/10 bg-[#0f1115] text-white font-black uppercase text-[10px] tracking-widest hover:bg-zinc-800 hover:border-white/20 transition-all shadow-xl">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                    Comment
                                </button>
                            </div>
                        </div>
                    </header>

                    {article.image_url && (
                        <figure className="mb-16 rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-white/10 group">
                            <img
                                src={article.image_url}
                                alt={article.title}
                                className="w-full h-auto object-cover max-h-[700px] transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                            {article.source && (
                                <figcaption className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md text-white/80 text-xs px-4 py-2 rounded-full font-bold border border-white/10">
                                    Source: {article.source}
                                </figcaption>
                            )}
                        </figure>
                    )}

                    <div className="max-w-4xl mb-20">
                        <div className="prose prose-invert prose-2xl max-w-none">
                            <p className="text-2xl md:text-3xl font-light text-white/90 leading-relaxed mb-10 border-l-4 border-blue-500 pl-10 py-2">
                                {cleanContent(article.description || article.snippet)}
                            </p>

                            {article.content && (
                                <div className="text-xl text-white/60 leading-relaxed mb-12 space-y-6">
                                    {article.content.split('\n').map((para, i) => (
                                        <p key={i}>{para}</p>
                                    ))}
                                </div>
                            )}

                            {!article.content && (
                                <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 mb-12">
                                    <h4 className="text-white font-black uppercase tracking-widest text-xs mb-4">Coverage Note</h4>
                                    <p className="text-white/60 text-lg leading-relaxed">
                                        We are currently retrieving the full text for this story. In the meantime, you can explore the immersive interactive version below or visit the original source.
                                    </p>
                                    <button
                                        onClick={() => document.getElementById('full-reader').scrollIntoView({ behavior: 'smooth' })}
                                        className="mt-6 text-blue-500 font-black uppercase text-xs tracking-widest hover:text-white transition-colors flex items-center gap-2 group"
                                    >
                                        Scroll to Immersive Reader
                                        <ArrowLeft size={14} className="rotate-[270deg] transform group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-12 mb-24">
                        <div className="flex flex-wrap items-center gap-4 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-xl">
                            <div className="mr-6">
                                <h4 className="text-white font-black uppercase tracking-widest text-sm mb-1">Story Actions</h4>
                                <p className="text-white/40 text-xs">Drive traffic and support original sources</p>
                            </div>

                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all transform hover:-translate-y-1 inline-flex items-center gap-3 shadow-xl shadow-blue-600/30"
                            >
                                Visit Source Website <ExternalLink size={18} />
                            </a>

                            <div className="h-10 w-px bg-white/10 mx-4 hidden md:block"></div>

                            <button
                                onClick={() => handleShare('copy')}
                                className="bg-[#0f1115] hover:bg-zinc-800 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all transform hover:-translate-y-1 inline-flex items-center gap-3 border border-white/10 shadow-xl"
                            >
                                <Share2 size={18} /> Share
                            </button>

                            <div className="flex items-center gap-3 ml-auto">
                                <button onClick={() => handleShare('whatsapp')} className="p-4 bg-[#25D366]/20 text-[#25D366] rounded-2xl hover:bg-[#25D366] hover:text-white transition-all border border-[#25D366]/20" title="Share to WhatsApp">
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                </button>
                                <button onClick={() => handleShare('twitter')} className="p-4 bg-[#1DA1F2]/20 text-[#1DA1F2] rounded-2xl hover:bg-[#1DA1F2] hover:text-white transition-all border border-[#1DA1F2]/20" title="Share to Twitter">
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                                </button>
                                <button onClick={() => handleShare('facebook')} className="p-4 bg-[#1877F2]/20 text-[#1877F2] rounded-2xl hover:bg-[#1877F2] hover:text-white transition-all border border-[#1877F2]/20" title="Share to Facebook">
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Full Article Reader Section */}
                        <div className="w-full mt-20" id="full-reader">
                            <div className="flex items-center justify-between mb-8 border-l-4 border-blue-600 pl-8">
                                <div>
                                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter">
                                        FULL ARTICLE <span className="text-blue-500">READER</span>
                                    </h3>
                                    <p className="text-white/40 font-bold uppercase text-[10px] tracking-widest mt-1">Immersive in-app browsing experience</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white/40 italic text-xs">
                                    Source: {article.source}
                                </div>
                            </div>

                            <div className="relative w-full aspect-video md:aspect-[16/10] bg-[#090909] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/20 group">
                                <div className="absolute inset-0 bg-blue-500/5 pointer-events-none group-hover:bg-transparent transition-colors z-10"></div>
                                <iframe
                                    src={article.url}
                                    className="w-full h-full border-none relative z-0"
                                    title="Article Reader"
                                    loading="lazy"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-white/40 text-sm font-medium">Link blocked? <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 font-bold underline">Click here</a> to open in a new tab.</p>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Sidebar */}
                <aside className="xl:col-span-3 space-y-10">
                    <div className="bg-[#121417] p-8 rounded-[2.5rem] border border-white/10 sticky top-24 shadow-2xl ring-1 ring-white/5">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                            <div className="p-2 bg-blue-600/20 rounded-lg">
                                <Bookmark size={18} className="text-blue-500" />
                            </div>
                            <h3 className="font-black text-xl text-white uppercase tracking-tighter">Next Up</h3>
                        </div>

                        <div className="space-y-8">
                            {similar.length > 0 ? (
                                similar.map(item => (
                                    <div key={item.uuid} className="group cursor-pointer">
                                        <Link to={`/news/article/${item.uuid}`} className="flex flex-col gap-4">
                                            {item.image_url && (
                                                <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-blue-500/50 transition-all">
                                                    <img src={item.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">{item.source}</div>
                                                <h4 className="font-bold text-base line-clamp-2 text-white group-hover:text-blue-400 transition-colors leading-snug">
                                                    {item.title}
                                                </h4>
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Scanning for stories...</p>
                                </div>
                            )}
                        </div>

                        <Link to="/news" className="w-full mt-10 flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 font-bold transition-all group">
                            Explore More News
                            <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default NewsArticleDetail;
