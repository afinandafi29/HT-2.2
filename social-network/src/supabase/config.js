import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

const isPlaceholder = supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder');

if (isPlaceholder) {
  console.warn('Using placeholder Supabase credentials.');
}

// Safe storage adapter to handle Brave/Incognito/Blocked LocalStorage
const safeStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      console.warn('LocalStorage access denied (getItem), using memory fallback');
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      console.warn('LocalStorage access denied (setItem)');
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      console.warn('LocalStorage access denied (removeItem)');
    }
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: safeStorage // Use our safe wrapper
  }
});