export const DEFAULT_TEXT_MODEL = 'anthropic/claude-3.5-haiku';
export const DEFAULT_IMAGE_MODEL = 'black-forest-labs/flux.2-klein-4b';

const STORAGE_KEY = 'origin-story-ai-settings-v1';
const LEGACY_DEFAULT_IMAGE_MODELS = new Set(['openai/gpt-5.4-image-2']);

export type AiCredentialSource = 'browser' | 'environment' | 'none';

export interface AiSettings {
  openRouterApiKey: string;
  textModel: string;
  imageModel: string;
}

export interface ResolvedAiSettings extends AiSettings {
  source: AiCredentialSource;
  hasApiKey: boolean;
}

const emptySettings: AiSettings = {
  openRouterApiKey: '',
  textModel: DEFAULT_TEXT_MODEL,
  imageModel: DEFAULT_IMAGE_MODEL,
};

const canUseLocalStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const normalizeTextModel = (value?: string): string => value?.trim() || DEFAULT_TEXT_MODEL;

const normalizeImageModel = (value?: string): string => {
  const trimmed = value?.trim();
  if (!trimmed || LEGACY_DEFAULT_IMAGE_MODELS.has(trimmed)) return DEFAULT_IMAGE_MODEL;
  return trimmed;
};

const normalizeSettings = (settings: Partial<AiSettings> = {}): AiSettings => ({
  openRouterApiKey: settings.openRouterApiKey?.trim() || '',
  textModel: normalizeTextModel(settings.textModel),
  imageModel: normalizeImageModel(settings.imageModel),
});

const getEnvSettings = (): AiSettings => normalizeSettings({
  openRouterApiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
  textModel: import.meta.env.VITE_OPENROUTER_TEXT_MODEL || DEFAULT_TEXT_MODEL,
  imageModel: import.meta.env.VITE_OPENROUTER_IMAGE_MODEL || DEFAULT_IMAGE_MODEL,
});

const readStoredSettings = (): Partial<AiSettings> | null => {
  if (!canUseLocalStorage()) return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Unable to load AI settings.', error);
    return null;
  }
};

export const getSavedAiSettings = (): AiSettings => normalizeSettings(readStoredSettings() || emptySettings);

export const getResolvedAiSettings = (): ResolvedAiSettings => {
  const storedSettings = readStoredSettings();
  const saved = normalizeSettings(storedSettings || emptySettings);
  const env = getEnvSettings();
  const openRouterApiKey = saved.openRouterApiKey || env.openRouterApiKey;
  const source: AiCredentialSource = saved.openRouterApiKey
    ? 'browser'
    : env.openRouterApiKey
      ? 'environment'
      : 'none';

  return {
    openRouterApiKey,
    textModel: storedSettings ? saved.textModel : env.textModel,
    imageModel: storedSettings ? saved.imageModel : env.imageModel,
    source,
    hasApiKey: Boolean(openRouterApiKey),
  };
};

export const saveAiSettings = (settings: Partial<AiSettings>): ResolvedAiSettings => {
  const normalized = normalizeSettings(settings);
  if (canUseLocalStorage()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch (error) {
      console.warn('Unable to save AI settings.', error);
    }
  }
  return getResolvedAiSettings();
};

export const clearAiSettings = (): ResolvedAiSettings => {
  if (canUseLocalStorage()) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Unable to clear AI settings.', error);
    }
  }
  return getResolvedAiSettings();
};

export const hasOpenRouterKey = () => getResolvedAiSettings().hasApiKey;

export const maskApiKey = (value: string) => {
  if (!value) return '';
  if (value.length <= 10) return 'saved key';
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};
