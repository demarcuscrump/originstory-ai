import React from 'react';
import { Nemesis } from '../types';
import { Button } from './Button';

interface NemesisProps {
  nemesis: Nemesis;
  canConfront: boolean;
  onConfront: () => void;
}

interface NemesisSummaryCardProps extends NemesisProps {
  onOpenDossier: () => void;
}

const getSchemeProgress = (nemesis: Nemesis) => nemesis.schemeProgress || 0;

const previewText = (value: string, maxLength = 130) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
};

const SchemeMeter: React.FC<{ nemesis: Nemesis }> = ({ nemesis }) => {
  const schemeProgress = getSchemeProgress(nemesis);

  return (
    <div className="bg-[#2B2B2B] p-3 rounded-2xl border-2 border-[#0E0E0E]">
      <div className="flex justify-between items-center gap-3 mb-2">
        <h5 className="font-black text-xs uppercase text-[#FFD21F] truncate">
          {nemesis.schemeName || 'Unknown Scheme'}
        </h5>
        <span className="text-xs font-black text-[#FFD21F]">{schemeProgress}%</span>
      </div>
      <div className="w-full h-4 bg-[#1F1F1F] border-2 border-[#0E0E0E] rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-700 ${schemeProgress > 80 ? 'bg-[#D85A4F] animate-pulse' : 'bg-[#FFD21F]'}`}
          style={{ width: `${schemeProgress}%` }}
        />
      </div>
    </div>
  );
};

const NemesisImage: React.FC<{ nemesis: Nemesis; canConfront: boolean; large?: boolean }> = ({ nemesis, canConfront, large = false }) => (
  <div className={`bg-[#46505A] ${large ? 'aspect-[4/3]' : 'h-36'} flex items-center justify-center border-2 border-[#0E0E0E] rounded-[24px] relative overflow-hidden`}>
    {nemesis.imageUrl ? (
      <img src={nemesis.imageUrl} alt={nemesis.name} className="w-full h-full object-contain grayscale contrast-110" />
    ) : nemesis.isGeneratingImage ? (
      <div className="flex flex-col items-center justify-center animate-pulse text-center px-3">
        <div className="w-8 h-8 border-4 border-[#FFD21F] border-t-transparent rounded-full animate-spin mb-2" />
        <span className="text-xs font-bold text-[#D8D8D2] uppercase">Sketching suspect...</span>
      </div>
    ) : (
      <span className="text-5xl text-[#D8D8D2]">?</span>
    )}

    {canConfront && (
      <div className="absolute inset-0 bg-[#D85A4F]/20 flex items-center justify-center">
        <span className="text-[#161616] font-black text-xl border-2 border-[#0E0E0E] px-5 py-2 bg-[#FFD21F] rounded-full shadow-comic">
          FOUND
        </span>
      </div>
    )}
  </div>
);

export const NemesisSummaryCard: React.FC<NemesisSummaryCardProps> = ({ nemesis, canConfront, onConfront, onOpenDossier }) => {
  if (nemesis.defeated) {
    return (
      <section className="bg-[#25382E] border-2 border-[#2DD38F] rounded-[24px] p-3 shadow-comic">
        <h3 className="font-black text-[#CFFFF0] uppercase tracking-wide text-sm">Nemesis Defeated</h3>
        <p className="text-sm mt-1 text-[#F4F4F0]">{nemesis.name} is behind bars.</p>
      </section>
    );
  }

  return (
    <section className="bg-[#343434] border-2 border-[#0E0E0E] rounded-[24px] shadow-comic p-3">
      <div className="bg-[#3B2422] text-white -mx-3 -mt-3 mb-3 p-3 border-b-2 border-[#0E0E0E] rounded-t-[22px]">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#FFD7D2]">Nemesis Watch</p>
        <h3 className="font-display text-3xl leading-none tracking-wide">{nemesis.name}</h3>
      </div>

      <div className="space-y-3">
        <div>
          <p className="italic text-sm text-[#D8D8D2]">"{nemesis.epithet}"</p>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="border-2 border-[#0E0E0E] rounded-2xl bg-[#2B2B2B] p-2">
              <div className="text-[10px] uppercase font-black text-[#B8B8B0]">Threat</div>
              <div className="font-black text-sm leading-tight">{nemesis.archetype}</div>
            </div>
            <div className="border-2 border-[#0E0E0E] rounded-2xl bg-[#2B2B2B] p-2">
              <div className="text-[10px] uppercase font-black text-[#B8B8B0]">Power</div>
              <div className="font-mono font-black text-lg">{nemesis.power}/100</div>
            </div>
          </div>
        </div>

        <SchemeMeter nemesis={nemesis} />

        <div className="border-2 border-[#0E0E0E] rounded-2xl bg-[#2B2B2B] p-3">
          <div className="text-[10px] uppercase font-black text-[#FFD21F]">Known Weakness</div>
          <p className="text-sm leading-snug mt-1 text-[#D8D8D2]">{previewText(nemesis.weakness)}</p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Button type="button" variant="secondary" fullWidth onClick={onOpenDossier} className="text-sm">
            OPEN DOSSIER
          </Button>
          {canConfront ? (
            <Button type="button" variant="danger" fullWidth onClick={onConfront} className="text-sm">
              CONFRONT!
            </Button>
          ) : (
            <div className="bg-[#2B2B2B] text-[#B8B8B0] text-xs font-bold text-center py-3 border-2 border-[#515151] rounded-2xl">
              Gather intel to fight
              <div className="text-[10px] font-normal mt-1 text-[#8EA0AB]">Need 30 Justice / 10 Glory</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export const NemesisDossierModal: React.FC<NemesisProps & { onClose: () => void }> = ({ nemesis, canConfront, onConfront, onClose }) => {
  const handleConfront = () => {
    onClose();
    onConfront();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 md:p-6">
      <div className="bg-[#343434] border-2 border-[#0E0E0E] rounded-[32px] shadow-comic-lg w-full max-w-5xl max-h-[92dvh] flex flex-col overflow-hidden text-[#F4F4F0]">
        <header className="shrink-0 bg-[#3B2422] text-white border-b-2 border-[#0E0E0E] p-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#FFD7D2]">Nemesis Dossier</p>
            <h2 className="font-display text-5xl leading-none tracking-wide">{nemesis.name}</h2>
            <p className="italic text-lg mt-1 text-[#FFD7D2]">"{nemesis.epithet}"</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#FFD21F] text-[#161616] border-2 border-[#0E0E0E] rounded-full px-3 py-1 font-black shadow-comic active:translate-x-1 active:translate-y-1 active:shadow-none"
            aria-label="Close nemesis dossier"
          >
            X
          </button>
        </header>

        <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-5 comic-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-5">
            <aside className="space-y-4">
              <NemesisImage nemesis={nemesis} canConfront={canConfront} large />
              <SchemeMeter nemesis={nemesis} />
              <div className="grid grid-cols-2 gap-3">
                <div className="border-2 border-[#0E0E0E] rounded-2xl bg-[#2B2B2B] p-3">
                  <div className="text-xs uppercase font-black text-[#B8B8B0]">Threat Type</div>
                  <div className="font-black text-lg leading-tight">{nemesis.archetype}</div>
                </div>
                <div className="border-2 border-[#0E0E0E] rounded-2xl bg-[#2B2B2B] p-3">
                  <div className="text-xs uppercase font-black text-[#B8B8B0]">Power</div>
                  <div className="font-mono font-black text-2xl">{nemesis.power}/100</div>
                </div>
              </div>
            </aside>

            <section className="space-y-4 min-w-0">
              <div className="bg-[#2B2B2B] border-2 border-[#0E0E0E] rounded-[24px] p-4 shadow-[3px_3px_0px_#0E0E0E]">
                <h3 className="font-black uppercase text-sm text-[#FFD21F] mb-2">Known Weakness</h3>
                <p className="text-lg leading-relaxed text-[#F4F4F0] whitespace-pre-wrap break-words">
                  {nemesis.weakness}
                </p>
              </div>

              <div className="bg-[#2B2B2B] border-2 border-[#0E0E0E] rounded-[24px] p-4 shadow-[3px_3px_0px_#0E0E0E]">
                <h3 className="font-black uppercase text-sm text-[#FFD21F] mb-2">Active Scheme</h3>
                <p className="font-black text-xl leading-tight">{nemesis.schemeName || 'Unknown Scheme'}</p>
                <p className="text-lg leading-relaxed mt-3 whitespace-pre-wrap break-words text-[#D8D8D2]">
                  {nemesis.schemeDescription || 'No confirmed scheme details yet.'}
                </p>
              </div>

              <div className="bg-[#2B2B2B] border-2 border-[#0E0E0E] rounded-[24px] p-4 shadow-[3px_3px_0px_#0E0E0E]">
                <h3 className="font-black uppercase text-sm text-[#FFD21F] mb-2">Field Notes</h3>
                <p className="text-lg leading-relaxed text-[#D8D8D2]">
                  Contain the scheme before it reaches critical mass. Build enough Justice and Glory to force a direct
                  confrontation on your terms.
                </p>
              </div>
            </section>
          </div>
        </div>

        <footer className="shrink-0 bg-[#2B2B2B] border-t-2 border-[#0E0E0E] p-4 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 items-center">
          <p className="text-xs font-bold text-[#B8B8B0]">
            Keep pressure on the scheme clock before it reaches 100%.
          </p>
          {canConfront ? (
            <Button type="button" variant="danger" onClick={handleConfront} className="text-sm">
              CONFRONT NOW
            </Button>
          ) : (
            <div className="bg-[#343434] text-[#B8B8B0] text-xs font-bold text-center py-3 px-4 border-2 border-[#515151] rounded-full">
              Need 30 Justice / 10 Glory
            </div>
          )}
          <Button type="button" variant="secondary" onClick={onClose} className="text-sm">
            CLOSE
          </Button>
        </footer>
      </div>
    </div>
  );
};
