import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearAiSettings,
  DEFAULT_IMAGE_MODEL,
  DEFAULT_TEXT_MODEL,
  getResolvedAiSettings,
  hasOpenRouterKey,
  saveAiSettings,
} from '../services/aiSettings';

describe('aiSettings', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.unstubAllEnvs();
    vi.stubEnv('VITE_OPENROUTER_API_KEY', '');
    vi.stubEnv('VITE_OPENROUTER_TEXT_MODEL', '');
    vi.stubEnv('VITE_OPENROUTER_IMAGE_MODEL', '');
  });

  it('defaults to offline mode without a saved or environment key', () => {
    const settings = getResolvedAiSettings();

    expect(settings.hasApiKey).toBe(false);
    expect(settings.source).toBe('none');
    expect(settings.textModel).toBe(DEFAULT_TEXT_MODEL);
    expect(settings.imageModel).toBe(DEFAULT_IMAGE_MODEL);
    expect(hasOpenRouterKey()).toBe(false);
  });

  it('uses browser-saved BYOK settings before environment settings', () => {
    vi.stubEnv('VITE_OPENROUTER_API_KEY', 'env-key');

    const settings = saveAiSettings({
      openRouterApiKey: 'sk-or-v1-browser-key',
      textModel: 'custom/text',
      imageModel: 'custom/image',
    });

    expect(settings.hasApiKey).toBe(true);
    expect(settings.source).toBe('browser');
    expect(settings.openRouterApiKey).toBe('sk-or-v1-browser-key');
    expect(settings.textModel).toBe('custom/text');
    expect(settings.imageModel).toBe('custom/image');
  });

  it('migrates the old slow image default to the current fast default', () => {
    const settings = saveAiSettings({
      openRouterApiKey: 'sk-or-v1-browser-key',
      imageModel: 'openai/gpt-5.4-image-2',
    });

    expect(settings.imageModel).toBe(DEFAULT_IMAGE_MODEL);
  });

  it('falls back to environment settings when browser settings are cleared', () => {
    vi.stubEnv('VITE_OPENROUTER_API_KEY', 'env-key');
    vi.stubEnv('VITE_OPENROUTER_TEXT_MODEL', 'env/text');
    vi.stubEnv('VITE_OPENROUTER_IMAGE_MODEL', 'env/image');
    saveAiSettings({ openRouterApiKey: 'browser-key' });

    const settings = clearAiSettings();

    expect(settings.hasApiKey).toBe(true);
    expect(settings.source).toBe('environment');
    expect(settings.openRouterApiKey).toBe('env-key');
    expect(settings.textModel).toBe('env/text');
    expect(settings.imageModel).toBe('env/image');
  });
});
