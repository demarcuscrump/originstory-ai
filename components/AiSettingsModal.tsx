import React, { useMemo, useState } from 'react';
import {
  clearAiSettings,
  DEFAULT_IMAGE_MODEL,
  DEFAULT_TEXT_MODEL,
  getResolvedAiSettings,
  maskApiKey,
  saveAiSettings,
} from '../services/aiSettings';
import { Button } from './Button';

interface AiSettingsModalProps {
  onClose: () => void;
}

export const AiSettingsModal: React.FC<AiSettingsModalProps> = ({ onClose }) => {
  const initialSettings = useMemo(() => getResolvedAiSettings(), []);
  const [apiKey, setApiKey] = useState(initialSettings.source === 'browser' ? initialSettings.openRouterApiKey : '');
  const [textModel, setTextModel] = useState(initialSettings.textModel);
  const [imageModel, setImageModel] = useState(initialSettings.imageModel);
  const [status, setStatus] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const next = saveAiSettings({
      openRouterApiKey: apiKey,
      textModel,
      imageModel,
    });
    setStatus(next);
    setSaved(true);
  };

  const handleClear = () => {
    const next = clearAiSettings();
    setApiKey('');
    setTextModel(DEFAULT_TEXT_MODEL);
    setImageModel(DEFAULT_IMAGE_MODEL);
    setStatus(next);
    setSaved(false);
  };

  const statusCopy = status.hasApiKey
    ? `AI enabled from ${status.source === 'browser' ? 'this browser' : 'developer environment'}`
    : 'Offline mode active';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <form
        onSubmit={handleSave}
        className="w-full max-w-lg bg-[#343434] border-2 border-[#0E0E0E] rounded-[32px] shadow-comic-lg p-5 text-[#F4F4F0]"
      >
        <div className="flex items-start justify-between gap-4 border-b-2 border-[#515151] pb-3 mb-4">
          <div>
            <h2 className="font-display text-4xl italic tracking-wide text-[#FFD21F]">AI SETTINGS</h2>
            <p className="text-sm font-bold text-[#B8B8B0]">{statusCopy}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#D85A4F] text-white border-2 border-[#0E0E0E] rounded-full px-3 py-1 font-black shadow-comic active:translate-x-1 active:translate-y-1 active:shadow-none"
            aria-label="Close AI settings"
          >
            X
          </button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="block text-xs font-black uppercase tracking-wide mb-1">OpenRouter API Key</span>
            <input
              type="password"
              value={apiKey}
              onChange={(event) => {
                setApiKey(event.target.value);
                setSaved(false);
              }}
              placeholder={status.source === 'browser' ? maskApiKey(status.openRouterApiKey) : 'sk-or-v1-...'}
              className="w-full rounded-2xl border-2 border-[#0E0E0E] p-3 font-mono text-sm focus:bg-[#3E3E3E]"
              autoComplete="off"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-black uppercase tracking-wide mb-1">Text Model</span>
              <input
                type="text"
                value={textModel}
                onChange={(event) => {
                  setTextModel(event.target.value);
                  setSaved(false);
                }}
                className="w-full rounded-2xl border-2 border-[#0E0E0E] p-3 font-mono text-xs focus:bg-[#3E3E3E]"
              />
            </label>

            <label className="block">
              <span className="block text-xs font-black uppercase tracking-wide mb-1">Image Model</span>
              <input
                type="text"
                aria-label="Image Model"
                value={imageModel}
                onChange={(event) => {
                  setImageModel(event.target.value);
                  setSaved(false);
                }}
                className="w-full rounded-2xl border-2 border-[#0E0E0E] p-3 font-mono text-xs focus:bg-[#3E3E3E]"
              />
              <span className="mt-1 block text-[11px] font-bold text-[#B8B8B0]">
                Fast default: {DEFAULT_IMAGE_MODEL}
              </span>
            </label>
          </div>

          <div className="bg-[#2B2B2B] border-2 border-[#0E0E0E] rounded-2xl p-3 text-xs leading-relaxed text-[#D8D8D2]">
            The key is saved only in this browser and sent only with OpenRouter requests.
            Use a restricted key for public devices or shared browsers.
          </div>

          {saved && (
            <div className="bg-[#25382E] border-2 border-[#2DD38F] rounded-2xl p-2 text-center text-sm font-black text-[#CFFFF0]">
              Settings saved. Future story panels will use this key.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
          <Button type="submit" variant="primary" className="text-sm md:col-span-2">
            SAVE AI SETTINGS
          </Button>
          <Button type="button" variant="secondary" onClick={handleClear} className="text-sm">
            CLEAR
          </Button>
        </div>
      </form>
    </div>
  );
};
