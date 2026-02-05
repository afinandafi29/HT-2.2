import axios from 'axios';

// API Configuration - Dynamic resolution from Admin Panel
const getApiKey = (key, defaultVal) => {
    try {
        const saved = localStorage.getItem('adminApiKeys');
        if (saved) {
            const keys = JSON.parse(saved);
            return keys[key] || defaultVal;
        }
    } catch (e) { }
    return defaultVal;
};

const NEWSAPI_ORG_KEY = getApiKey('news', '0fc88aab4cf5487dab215fb4563ab635');
const GNEWS_API_KEY = getApiKey('news', '5779a8a7bdfa8a6883078287b0363dc3');
const THENEWSAPI_TOKEN = 'LSpJOY6suv2RKeu88kXjAYZsusgpIUley64x5gYy';
const WORLD_NEWS_API_KEY = getApiKey('news', '8a87d666d7524c48adc78d449877d80c');
const NEWSDATA_API_KEY = getApiKey('newsData', 'pub_58c787ed963a4067bf62c425d6692cd6');
const MEDIASTACK_API_KEY = '1147dc6bf54ab90cb455783281aebc77';

// Helper for robust base64 encoding
const safeBtoa = (str) => {
    try {
        if (!str) return Math.random().toString(36).substring(7);
        return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
        return Math.random().toString(36).substring(7);
    }
};

// Normalizers
const normalizeGNews = (article) => ({
    uuid: article.url ? safeBtoa(article.url) : `gnews-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    title: article.title,
    description: article.description,
    snippet: article.content,
    url: article.url,
    image_url: article.image || 'https://via.placeholder.com/800x400?text=News+Image',
    published_at: article.publishedAt,
    source: article.source?.name || 'GNews',
    categories: [],
    provider: 'gnews'
});

const normalizeTheNewsAPI = (article) => ({
    uuid: article.uuid,
    title: article.title,
    description: article.description,
    snippet: article.snippet || article.description,
    url: article.url,
    image_url: article.image_url || 'https://via.placeholder.com/800x400?text=News+Image',
    published_at: article.published_at,
    source: article.source,
    categories: article.categories || [],
    provider: 'thenewsapi'
});

const normalizeNewsAPIOrg = (article) => ({
    uuid: article.url ? safeBtoa(article.url) : `newsapi-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    title: article.title,
    description: article.description,
    snippet: article.content || article.description,
    url: article.url,
    image_url: article.urlToImage || 'https://via.placeholder.com/800x400?text=News+Image',
    published_at: article.publishedAt,
    source: article.source?.name || 'NewsAPI',
    categories: [],
    provider: 'newsapi'
});

const normalizeWorldNews = (article) => ({
    uuid: article.id ? `world-${article.id}` : safeBtoa(article.url),
    title: article.title,
    description: article.text,
    snippet: article.text?.substring(0, 200),
    url: article.url,
    image_url: article.image || 'https://via.placeholder.com/800x400?text=News+Image',
    published_at: article.publish_date,
    source: article.author || 'World News',
    categories: [],
    provider: 'worldnews'
});

const normalizeNewsData = (article) => ({
    uuid: article.article_id || safeBtoa(article.link),
    title: article.title,
    description: article.description,
    snippet: article.content || article.description,
    url: article.link,
    image_url: article.image_url || 'https://via.placeholder.com/800x400?text=News+Image',
    published_at: article.pubDate,
    source: article.source_id,
    categories: article.category || [],
    provider: 'newsdata'
});

const normalizeMediastack = (article) => ({
    uuid: article.url ? safeBtoa(article.url) : `media-${Date.now()}`,
    title: article.title,
    description: article.description,
    snippet: article.description,
    url: article.url,
    image_url: article.image || 'https://via.placeholder.com/800x400?text=News+Image',
    published_at: article.published_at,
    source: article.source,
    categories: [article.category],
    provider: 'mediastack'
});

// Fetchers
const fetchNewsAPIOrg = async (endpoint, params = {}) => {
    try {
        const url = `https://newsapi.org/v2${endpoint}`;
        const queryParams = {
            apiKey: NEWSAPI_ORG_KEY,
            language: 'en',
            pageSize: params.limit || 10,
            page: params.page || 1,
            ...params
        };
        const urlWithParams = `${url}?${new URLSearchParams(queryParams).toString()}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(urlWithParams)}`;
        const { data } = await axios.get(proxyUrl);
        const parsedData = data;

        if (parsedData.status === 'ok') {
            return {
                articles: parsedData.articles.map(normalizeNewsAPIOrg),
                totalResults: parsedData.totalResults || 0
            };
        }
        return { articles: [], totalResults: 0 };
    } catch (error) {
        console.error('NewsAPI.org fetch error:', error);
        return { articles: [], totalResults: 0 };
    }
};

const fetchGNews = async (endpoint, params = {}) => {
    try {
        const url = `https://gnews.io/api/v4${endpoint}`;
        const queryParams = {
            token: GNEWS_API_KEY,
            lang: 'en',
            max: params.limit || 10,
            page: params.page || 1,
            ...params
        };
        const urlWithParams = `${url}?${new URLSearchParams(queryParams).toString()}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(urlWithParams)}`;
        const { data } = await axios.get(proxyUrl);
        return {
            articles: (data.articles || []).map(normalizeGNews),
            totalResults: data.totalArticles || 0
        };
    } catch (error) {
        return { articles: [], totalResults: 0 };
    }
};

const fetchWorldNews = async (params = {}) => {
    try {
        const url = `https://api.worldnewsapi.com/search-news`;
        const queryParams = {
            'api-key': WORLD_NEWS_API_KEY,
            'text': params.q || 'latest',
            'number': params.limit || 10,
            'offset': (params.page - 1) * (params.limit || 10),
            'language': 'en'
        };
        const urlWithParams = `${url}?${new URLSearchParams(queryParams).toString()}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(urlWithParams)}`;
        const { data } = await axios.get(proxyUrl);
        return {
            articles: (data.news || []).map(normalizeWorldNews),
            totalResults: data.available || 0
        };
    } catch (error) {
        return { articles: [], totalResults: 0 };
    }
};

const fetchNewsData = async (params = {}) => {
    try {
        const url = `https://newsdata.io/api/1/latest`;
        const queryParams = {
            apikey: NEWSDATA_API_KEY,
            q: params.q || 'news',
            language: 'en'
        };
        const urlWithParams = `${url}?${new URLSearchParams(queryParams).toString()}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(urlWithParams)}`;
        const { data } = await axios.get(proxyUrl);
        return {
            articles: (data.results || []).map(normalizeNewsData),
            totalResults: data.totalResults || 0
        };
    } catch (error) {
        console.error('NewsData Fetch Error:', error);
        return { articles: [], totalResults: 0 };
    }
};

const fetchMediastack = async (params = {}) => {
    try {
        const url = `http://api.mediastack.com/v1/news`;
        const queryParams = {
            access_key: MEDIASTACK_API_KEY,
            keywords: params.q || 'latest',
            languages: 'en',
            limit: params.limit || 10,
            offset: (params.page - 1) * (params.limit || 10)
        };
        const urlWithParams = `${url}?${new URLSearchParams(queryParams).toString()}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(urlWithParams)}`;
        const { data } = await axios.get(proxyUrl);
        return {
            articles: (data.data || []).map(normalizeMediastack),
            totalResults: data.pagination?.total || 0
        };
    } catch (error) {
        return { articles: [], totalResults: 0 };
    }
};

const fetchTheNewsAPI = async (endpoint, params = {}) => {
    try {
        const url = `https://api.thenewsapi.com/v1/news${endpoint}`;
        const queryParams = {
            api_token: THENEWSAPI_TOKEN,
            language: 'en',
            limit: params.limit || 3,
            page: params.page || 1,
            ...params
        };
        const urlWithParams = `${url}?${new URLSearchParams(queryParams).toString()}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(urlWithParams)}`;
        const { data } = await axios.get(proxyUrl);
        return {
            articles: data.data.map(normalizeTheNewsAPI),
            totalResults: data.meta?.found || 0
        };
    } catch (error) {
        return { articles: [], totalResults: 0 };
    }
};

// Fallback: Google News RSS
const fetchRSS = async (topic = '') => {
    try {
        const query = topic ? `search?q=${topic}&` : '';
        const url = `https://news.google.com/rss/${query}hl=en-US&gl=US&ceid=US:en`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        const response = await axios.get(proxyUrl);
        const xmlText = response.data;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const items = Array.from(xmlDoc.querySelectorAll("item")).slice(0, 10);
        return {
            articles: items.map(item => {
                const title = item.querySelector("title")?.textContent || '';
                const link = item.querySelector("link")?.textContent || '';
                const pubDate = item.querySelector("pubDate")?.textContent || '';
                const source = item.querySelector("source")?.textContent || 'Google News';
                return {
                    uuid: safeBtoa(link),
                    title: title.split(' - ')[0],
                    description: `Latest coverage from ${source}.`,
                    snippet: `Global news update regarding "${title}".`,
                    url: link,
                    image_url: `https://images.unsplash.com/photo-1504711434969?auto=format&fit=crop&q=80&w=800`,
                    published_at: new Date(pubDate).toISOString(),
                    source: source,
                    categories: topic ? [topic] : ['General'],
                    provider: 'rss'
                };
            }),
            totalResults: 100
        };
    } catch (error) {
        return { articles: [], totalResults: 0 };
    }
};



// Mock Data removed as per user request
const generateMockNews = (count = 10, category = 'General') => {
    return []; // No more mock stories
};

// Aggregator
const getAggregatedNews = async (fetchers, params = {}) => {
    const results = await Promise.allSettled(fetchers);
    let allArticles = [];
    let maxFound = 0;

    results.forEach(res => {
        if (res.status === 'fulfilled' && res.value.articles && res.value.articles.length > 0) {
            allArticles = [...allArticles, ...res.value.articles];
            if (res.value.totalResults > maxFound) maxFound = res.value.totalResults;
        }
    });

    if (allArticles.length === 0) {
        const topic = params.categories || params.q || '';
        const rssResult = await fetchRSS(topic);
        if (rssResult.articles && rssResult.articles.length > 0) {
            allArticles = rssResult.articles;
            maxFound = rssResult.totalResults;
        }
    }

    if (allArticles.length === 0) {
        const category = params.categories || params.q || 'Latest';
        allArticles = generateMockNews(8, category);
        maxFound = 100;
    }

    allArticles.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    const seen = new Set();
    const uniqueArticles = allArticles.filter(article => {
        if (!article.title) return false;
        const duplicate = seen.has(article.title);
        seen.add(article.title);
        return !duplicate;
    });

    return { articles: uniqueArticles, totalResults: maxFound };
};

// Exports
export const getHeadlines = async (params = {}) => {
    const q = params.categories || params.search || 'latest';
    const page = params.page || 1;

    const result = await getAggregatedNews([
        fetchNewsAPIOrg('/top-headlines', { category: params.categories, page }),
        fetchNewsData({ q: params.categories, page }),
        fetchGNews('/top-headlines', { topic: params.categories, page }),
        fetchTheNewsAPI('/top', { categories: params.categories, page }),
        fetchWorldNews({ q: params.categories, page }),
        fetchMediastack({ q: params.categories, page }),
    ], params);

    return { data: result.articles, meta: { found: result.totalResults } };
};

export const getTopStories = async (params = {}) => getHeadlines(params);

export const getAllNews = async (params = {}) => {
    const q = params.search || params.categories || 'latest';
    const page = params.page || 1;

    const result = await getAggregatedNews([
        fetchNewsAPIOrg('/everything', { q, page }),
        fetchGNews('/search', { q, page }),
        fetchTheNewsAPI('/all', { search: q, page }),
        fetchWorldNews({ q, page }),
        fetchNewsData({ q, page }),
        fetchMediastack({ q, page })
    ], params);

    return { data: result.articles, meta: { found: result.totalResults } };
};

export const getArticle = async (uuid) => ({ data: null });
export const getSimilarNews = async () => getHeadlines({ limit: 3 });
export const getSources = async () => ({ data: [] });

export const newsApi = {
    getHeadlines,
    getTopStories,
    getAllNews,
    getArticle,
    getSimilarNews,
    getSources,
};

