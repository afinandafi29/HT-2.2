/**
 * Shared AI API: OpenAI (ChatGPT) first, then GitHub AI fallback.
 * Set VITE_OPENAI_API_KEY for ChatGPT, or VITE_GITHUB_AI_TOKEN for GitHub.
 */

const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const GITHUB_AI_TOKEN = import.meta.env.VITE_GITHUB_AI_TOKEN || '';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const GITHUB_AI_URL = 'https://models.github.ai/inference/chat/completions';

/**
 * @param {Array<{role: string, content: string}>} messages - conversation (system + user + assistant)
 * @returns {Promise<string>} - assistant reply text
 */
export async function fetchAIReply(messages) {
  if (OPENAI_KEY) {
    try {
      const res = await fetch(OPENAI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || res.statusText);
      }
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content?.trim();
      if (text) return text;
    } catch (e) {
      console.warn('OpenAI API error:', e);
      if (GITHUB_AI_TOKEN) {
        // fallback to GitHub
      } else throw e;
    }
  }

  if (GITHUB_AI_TOKEN) {
    const res = await fetch(GITHUB_AI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_AI_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || res.statusText);
    }
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    if (text) return text;
    throw new Error('Empty GitHub AI response');
  }

  throw new Error('NO_AI_KEY');
}

export function hasAIKey() {
  return !!(OPENAI_KEY || GITHUB_AI_TOKEN);
}
