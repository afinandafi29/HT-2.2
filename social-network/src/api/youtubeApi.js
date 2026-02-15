/**
 * Shared YouTube API key for all YouTube features.
 * Uses: 1) Admin keys from localStorage, 2) VITE_YT_API_KEY env, 3) fallback key.
 */
const FALLBACK_YT_KEY = 'AIzaSyAsQ7E02xCW3qAdxwHK2PLj-pppMfm9fBw';

export function getYouTubeApiKey() {
  try {
    const saved = localStorage.getItem('adminApiKeys');
    if (saved) {
      const keys = JSON.parse(saved);
      if (keys?.youtube) return keys.youtube;
    }
  } catch (_) {}
  return import.meta.env.VITE_YT_API_KEY || FALLBACK_YT_KEY;
}
