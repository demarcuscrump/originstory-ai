import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AiSettingsModal } from '../components/AiSettingsModal';
import { getResolvedAiSettings } from '../services/aiSettings';

describe('AiSettingsModal', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.unstubAllEnvs();
    vi.stubEnv('VITE_OPENROUTER_API_KEY', '');
    vi.stubEnv('VITE_OPENROUTER_TEXT_MODEL', '');
    vi.stubEnv('VITE_OPENROUTER_IMAGE_MODEL', '');
  });

  it('saves browser BYOK settings from the modal', () => {
    render(<AiSettingsModal onClose={() => undefined} />);

    fireEvent.change(screen.getByLabelText('OpenRouter API Key'), {
      target: { value: 'sk-or-v1-test-key' },
    });
    fireEvent.change(screen.getByLabelText('Text Model'), {
      target: { value: 'custom/text' },
    });
    fireEvent.change(screen.getByLabelText('Image Model'), {
      target: { value: 'custom/image' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'SAVE AI SETTINGS' }));

    const settings = getResolvedAiSettings();
    expect(settings.source).toBe('browser');
    expect(settings.openRouterApiKey).toBe('sk-or-v1-test-key');
    expect(settings.textModel).toBe('custom/text');
    expect(settings.imageModel).toBe('custom/image');
    expect(screen.getByText('Settings saved. Future story panels will use this key.')).toBeTruthy();
  });
});
