import type { App } from 'vue';
import { createOpenAIService, getOpenAIService } from '@/services/openai.service';

export function installOpenAI(app: App, opts?: { apiBase?: string; apiKey?: string }) {
  // If opts provided, create a configured instance
  if (opts?.apiBase || opts?.apiKey) {
    createOpenAIService({
      apiBase: opts.apiBase,
      apiKey: opts.apiKey
    });
  } else {
    // lazy create from env inside service getOpenAIService
    getOpenAIService();
  }

  // attach to globalProperties for convenient access inside components: this.$openAI
  const instance = getOpenAIService();
  app.config.globalProperties.$openAI = instance;

  return instance;
}

// also export helper for direct import usage
export { getOpenAIService as openAI };
