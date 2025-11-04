// import axios, { AxiosInstance } from 'axios';
// import { useToast } from '@/composables/useToast';

// const toast = useToast()

// export class OpenAIService {
//   private readonly apiBase?: string;
//   private readonly apiKey?: string;
//   private readonly api: AxiosInstance;

//   constructor(options?: { apiBase?: string; apiKey?: string; timeout?: number }) {
//     this.apiBase = options?.apiBase;
//     this.apiKey = options?.apiKey;
//     this.api = axios.create({ timeout: options?.timeout ?? 15000 });
//   }

//   /**
//    * generate a suggestion
//    * - if apiBase is set, expect a server proxy at `${apiBase}/openai` that accepts { prompt } and returns { text }
//    * - otherwise call OpenAI directly (dev only).
//    */
//   async generate(prompt: string, timeoutMs = 12000): Promise<string> {
//     if (!prompt) return '';

//     // proxy path
//     if (this.apiBase) {
//       const url = `${this.apiBase.replace(/\/$/, '')}/openai`;
//       const res = await this.api.post(url, { prompt, timeout: timeoutMs });
//       return res.data?.text ?? '';
//     }

//     if (!this.apiKey) {
//       toast.push('OpenAI API key not configured', 'error', 1500);
//     }

//     // direct call to OpenAI (dev-only)
//     const controller = new AbortController();
//     const id = setTimeout(() => controller.abort(), timeoutMs);
//     try {
//       const payload = {
//         model: 'gpt-3.5-turbo',
//         messages: [{ role: 'user', content: prompt }],
//         temperature: 0.7,
//         max_tokens: 300
//       };

//       const res = await this.api.post('https://api.openai.com/v1/chat/completions', payload, {
//         headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
//         signal: controller.signal as any
//       });

//       return res.data?.choices?.[0]?.message?.content ?? '';
//     } catch (err: any) {
//       if (err?.code === 'ERR_CANCELED') toast.push('Request timed out', 'error', 1500);
//       // try to give helpful message
//       const msg = err?.response?.data?.error?.message || err?.message || 'OpenAI request failed';
//       throw toast.push(msg, 'error', 1500);
//     } finally {
//       clearTimeout(id);
//     }
//   }
// }

// /**
//  * Create single shared instance.
//  * The constructor reads env variables in the plugin below, but we export a factory function here as well.
//  */
// let _shared: OpenAIService | null = null;

// export function createOpenAIService(options?: { apiBase?: string; apiKey?: string; timeout?: number }) {
//   _shared = new OpenAIService(options);
//   return _shared;
// }

// export function getOpenAIService() {
//   if (!_shared) {
//     // lazy-create using environment variables (fallback)
//     const API_BASE = (import.meta.env.VITE_API_BASE as string) || (import.meta.env.VITE_OPENAI_PROXY as string) || '';
//     const API_KEY = (import.meta.env.VITE_OPENAI_KEY as string) || (import.meta.env.VITE_OPENAI_API_KEY as string) || '';
//     _shared = new OpenAIService({
//       apiBase: API_BASE || undefined,
//       apiKey: API_KEY || undefined
//     });
//   }
//   return _shared;
// }
import { post } from './api.service';

interface OpenAIServiceOptions {
  timeout?: number;
}

interface ChatMessage {
  role: 'user';
  content: string;
}

interface OpenAICompletionPayload {
  model: string;
  messages: ChatMessage[];
  temperature: number;
  max_tokens: number;
}

const API_KEY = (import.meta.env.VITE_OPENAI_KEY as string) || '';

export class OpenAIService {
  async generate(prompt: string): Promise<string> {
    if (!API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const controller = new AbortController();
    const timerId = setTimeout(() => controller.abort(), 12000);

    try {
      const payload = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 300,
      };

      const url = 'https://api.openai.com/v1/chat/completions';

      const data = await post<any>(url, payload);

      const text = data?.choices?.[0]?.message?.content?.trim();
      return text || '';

    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.message ||
        'OpenAI API request failed.';
      throw new Error(msg);

    } finally {
      clearTimeout(timerId);
    }
  }
}

let _shared: OpenAIService | null = null;

/* Creates and registers a new shared instance of OpenAIService */
export function createOpenAIService(options?: OpenAIServiceOptions): OpenAIService {
  _shared = new OpenAIService();
  return _shared;
}

/* Retrieves the shared instance, lazily initializing it if necessary */
export function getOpenAIService(): OpenAIService {
  if (!_shared) {
    _shared = new OpenAIService();
  }
  return _shared;
}
