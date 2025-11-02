import type { App } from 'vue';
import { createOpenAIService, getOpenAIService } from '@/services/OpenAIService';

export function installOpenAI(app: App, opts?: { apiBase?: string; apiKey?: string }) {
  if (opts?.apiBase || opts?.apiKey) {
    createOpenAIService({
      apiBase: opts.apiBase,
      apiKey: opts.apiKey
    });
  } else {
    getOpenAIService();
  }

  // attach to globalProperties for convenient access inside components: this.$openAI
  const instance = getOpenAIService();
  app.config.globalProperties.$openAI = instance;

  return instance;
}

export { getOpenAIService as openAI };
