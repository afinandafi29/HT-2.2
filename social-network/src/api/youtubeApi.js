/**
 * Shared YouTube API key for all YouTube features.
 * Uses: 1) Admin keys from localStorage, 2) VITE_YT_API_KEY env.
 */
export function getYouTubeApiKey() {
  try {
    const saved = localStorage.getItem('adminApiKeys');
    if (saved) {
      const keys = JSON.parse(saved);
      if (keys?.youtube) return keys.youtube;
    }
  } catch (_) { /* ignore */ }
  return import.meta.env.VITE_YT_API_KEY || '';
}
