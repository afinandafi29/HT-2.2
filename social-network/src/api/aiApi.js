/**
 * Shared AI API: OpenAI (ChatGPT) first, then GitHub AI fallback.
 * Set VITE_OPENAI_API_KEY for ChatGPT, or VITE_GITHUB_AI_TOKEN for GitHub.
 */

const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const GITHUB_AI_TOKEN = import.meta.env.VITE_GITHUB_AI_TOKEN || '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';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const GITHUB_AI_URL = 'https://models.inference.ai.azure.com/chat/completions';

/**
 * @param {Array<{role: string, content: string}>} messages - conversation (system + user + assistant)
 * @returns {Promise<string>} - assistant reply text
 */
export async function fetchAIReply(messages) {
  // 1. Try OpenAI if key is present
  if (OPENAI_KEY && OPENAI_KEY.startsWith('sk-')) {
    try {
      const res = await fetch(OPENAI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY.trim()}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Using mini as it's more widely available and faster
          messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return data.choices?.[0]?.message?.content?.trim() || '';
      }

      const errText = await res.text();
      console.warn('OpenAI API error:', errText);
      // Fall through to GitHub
    } catch (e) {
      console.warn('OpenAI fetch failed (likely CORS or network):', e);
      // Fall through to GitHub
    }
  }

  // 2. Try GitHub / Azure Inference as fallback (Better CORS support for browser)
  if (GITHUB_AI_TOKEN) {
    try {
      const res = await fetch(GITHUB_AI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GITHUB_AI_TOKEN.trim()}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return data.choices?.[0]?.message?.content?.trim() || '';
      }

      const errText = await res.text();
      console.error('GitHub AI API error:', errText);
    } catch (e) {
      console.error('GitHub AI fetch failed:', e);
    }
  }

  throw new Error('NO_AI_KEY_OR_FAILED');
}

export function hasAIKey() {
  return !!(OPENAI_KEY || GITHUB_AI_TOKEN);
}
