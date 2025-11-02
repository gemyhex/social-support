import axios, { AxiosInstance } from 'axios';

export class OpenAIService {
  private readonly apiBase?: string;
  private readonly apiKey?: string;
  private readonly client: AxiosInstance;

  constructor(options?: { apiBase?: string; apiKey?: string; timeout?: number }) {
    this.apiBase = options?.apiBase;
    this.apiKey = options?.apiKey;
    this.client = axios.create({ timeout: options?.timeout ?? 15000 });
  }

  /**
   * generate a suggestion
   * - if apiBase is set, expect a server proxy at `${apiBase}/openai` that accepts { prompt } and returns { text }
   * - otherwise call OpenAI directly (dev only).
   */
  async generate(prompt: string, timeoutMs = 12000): Promise<string> {
    if (!prompt) return '';

    // proxy path
    if (this.apiBase) {
      const url = `${this.apiBase.replace(/\/$/, '')}/openai`;
      const res = await this.client.post(url, { prompt, timeout: timeoutMs });
      return res.data?.text ?? '';
    }

    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured. Use a proxy in production or set VITE_OPENAI_KEY for dev.');
    }

    // direct call to OpenAI (dev-only)
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const payload = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 300
      };

      const res = await this.client.post('https://api.openai.com/v1/chat/completions', payload, {
        headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
        signal: controller.signal as any
      });

      return res.data?.choices?.[0]?.message?.content ?? '';
    } catch (err: any) {
      if (err?.code === 'ERR_CANCELED') throw new Error('Request timed out');
      // try to give helpful message
      const msg = err?.response?.data?.error?.message || err?.message || 'OpenAI request failed';
      throw new Error(msg);
    } finally {
      clearTimeout(id);
    }
  }
}

/**
 * Create single shared instance.
 * The constructor reads env variables in the plugin below, but we export a factory function here as well.
 */
let _shared: OpenAIService | null = null;

export function createOpenAIService(options?: { apiBase?: string; apiKey?: string; timeout?: number }) {
  _shared = new OpenAIService(options);
  return _shared;
}

export function getOpenAIService() {
  if (!_shared) {
    // lazy-create using environment variables (fallback)
    const API_BASE = (import.meta.env.VITE_API_BASE as string) || (import.meta.env.VITE_OPENAI_PROXY as string) || '';
    const API_KEY = (import.meta.env.VITE_OPENAI_KEY as string) || (import.meta.env.VITE_OPENAI_API_KEY as string) || '';
    _shared = new OpenAIService({
      apiBase: API_BASE || undefined,
      apiKey: API_KEY || undefined
    });
  }
  return _shared;
}
