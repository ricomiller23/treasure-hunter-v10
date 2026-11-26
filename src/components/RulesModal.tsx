import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  const [page, setPage] = useState(0);

  const pages = [
    {
      title: '1. EXPEDITION OBJECTIVE & CARDS',
      badge: 'SURVIVE & EXCAVATE',
      content: (
        <div className="space-y-3 text-xs text-amber-100/90 leading-relaxed">
          <p>
            You are a solitary explorer penetrating an unexplored jungle temple. Your goal is to
            excavate the <strong>4 Sacred Idols</strong> while discarding hazardous terrain along the
            way.
          </p>
          <div className="p-2.5 rounded-lg bg-black/40 border border-amber-900/40 space-y-1.5">
            <h4 className="font-bold text-amber-300 uppercase text-[11px]">The Adventure Deck (40 Cards):</h4>
            <ul className="list-disc list-inside space-y-1 text-amber-200/80">
              <li>
                <strong>4 Suits:</strong> Skull (Grey), Gem (Red), Dagger (Blue), Coin (Gold), values 1 to 10.
              </li>
              <li>
                <strong>The 4 Idols (Value 10):</strong> The highest card in each suit. They are worth <strong>+2 points</strong> if left exposed at the end, and can never be discarded by standard rules.
              </li>
              <li>
                <strong>Skull Cave Cards (Values 1, 3, 5, 7, 9):</strong> Ominous red-rimmed caverns. Each Skull Cave left exposed at the end costs <strong>-1 penalty</strong>!
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: '2. DEAL & DISCARD RULES',
      badge: 'REMOVAL MECHANICS',
      content: (
        <div className="space-y-3 text-xs text-amber-100/90 leading-relaxed">
          <p>
            A round consists of a <strong>Deal</strong> followed by <strong>Play</strong>:
          </p>
          <div className="space-y-2">
            <div className="p-2 rounded bg-stone-900/80 border border-stone-700">
              <strong className="text-amber-300">The Deal:</strong>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                4 cards are dealt face up from the Adventure deck, one onto each of the 4 stacks (left to right), fanned downward so cards underneath remain readable. There are never more than 4 stacks.
              </p>
            </div>
            <div className="p-2 rounded bg-stone-900/80 border border-stone-700">
              <strong className="text-amber-300">Discarding Lower Cards:</strong>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                Using <strong>only the exposed (top) card of each stack</strong>: if two or more exposed cards share a suit, you may <strong>discard any of them except the highest</strong> of that suit!
              </p>
            </div>
            <div className="p-2 rounded bg-amber-950/40 border border-amber-800/40">
              <strong className="text-amber-300">Empty Stack Movement:</strong>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                If a stack becomes entirely empty, you may move the <strong>top card of any other stack</strong> into that empty space (optional move), uncovering the card underneath!
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '3. BOON REWARDS & PERIL!',
      badge: 'ANCIENT BLESSINGS',
      content: (
        <div className="space-y-3 text-xs text-amber-100/90 leading-relaxed">
          <div className="p-2.5 rounded-lg bg-amber-950/60 border border-amber-500/60">
            <h4 className="font-bold text-amber-300 uppercase text-[11px] mb-1">
              ✨ 4-Discard Boon Reward:
            </h4>
            <p className="text-[11px] text-amber-100">
              If you discard <strong>4 or more Adventure cards in a single round</strong>, you immediately draw 1 Boon card from the Boon deck to keep face up and use whenever you choose!
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-red-950/70 border border-red-600/70">
            <h4 className="font-bold text-red-300 uppercase text-[11px] mb-1">
              🚨 PERIL! (Four Skull Caves):
            </h4>
            <p className="text-[11px] text-red-100">
              If a single Deal contains <strong>4 Skull Cave cards</strong>, all Boon cards currently in play are instantly destroyed and discarded — <em>except</em> a Base Camp that is currently holding a card!
            </p>
          </div>
        </div>
      ),
    },
    {
      title: '4. THE 5 BOON CARDS',
      badge: 'EXPEDITION EQUIPMENT',
      content: (
        <div className="space-y-2 text-xs text-amber-100/90 leading-relaxed max-h-[220px] overflow-y-auto pr-1">
          <div className="p-1.5 rounded bg-black/40 border border-amber-900/40">
            <strong className="text-amber-300">Base Camp:</strong>
            <p className="text-[10px] text-amber-200/80">
              Stash any one exposed card here safely. It is immune to Peril and not scored. You can take it back out into an empty stack later.
            </p>
          </div>
          <div className="p-1.5 rounded bg-black/40 border border-amber-900/40">
            <strong className="text-amber-300">Machete:</strong>
            <p className="text-[10px] text-amber-200/80">
              Discard any one exposed non-Idol card immediately, regardless of what suits are showing.
            </p>
          </div>
          <div className="p-1.5 rounded bg-black/40 border border-amber-900/40">
            <strong className="text-amber-300">Rope Bridge:</strong>
            <p className="text-[10px] text-amber-200/80">
              Move any exposed card onto any other stack (even non-empty stacks).
            </p>
          </div>
          <div className="p-1.5 rounded bg-black/40 border border-amber-900/40">
            <strong className="text-amber-300">Map:</strong>
            <p className="text-[10px] text-amber-200/80">
              Look ahead at the next 4 Adventure cards in the deck before they are dealt.
            </p>
          </div>
          <div className="p-1.5 rounded bg-black/40 border border-amber-900/40">
            <strong className="text-amber-300">Lantern:</strong>
            <p className="text-[10px] text-amber-200/80">
              Swap the entire positions of any two whole stacks.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: '5. RULEBOOK EXAMPLE PLAY',
      badge: 'MASTER TACTICS',
      content: (
        <div className="space-y-2 text-xs text-amber-100/90 leading-relaxed">
          <p>
            Study this classic move sequence directly from the rules:
          </p>
          <div className="p-2.5 rounded bg-black/50 border border-amber-800/40 font-mono text-[10px] space-y-1.5 text-amber-200/90">
            <div>1. Exposed cards: 3 Coins, 4 Coins, 9 Gems, 8 Daggers (with 8 of Coins beneath the 3 Coins).</div>
            <div className="text-emerald-400">➔ Remove 3 of Coins (since 4 Coins is higher). Uncovers 8 of Coins!</div>
            <div className="text-emerald-400">➔ Remove 4 of Coins (since 8 Coins is higher). Empties Stack 2!</div>
            <div className="text-amber-300">➔ Move 8 of Coins into the empty Stack 2! Uncovers 10 of Gems!</div>
            <div className="text-emerald-400">➔ Remove 9 of Gems (since 10 Gems is higher). Uncovers 10 of Daggers!</div>
            <div className="text-emerald-400">➔ Remove 8 of Daggers (since 10 Daggers is higher).</div>
            <div className="text-amber-400 font-bold">✨ Result: 4 discards achieved — 1 Boon card awarded!</div>
          </div>
        </div>
      ),
    },
    {
      title: '6. SCORING & DIFFICULTIES',
      badge: 'HALL OF FAME',
      content: (
        <div className="space-y-3 text-xs text-amber-100/90 leading-relaxed">
          <div className="p-2 rounded bg-black/40 border border-amber-900/40 space-y-1">
            <h4 className="font-bold text-amber-300 text-[11px]">Final Scoring:</h4>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <div>+1 per Discarded Card</div>
              <div>+2 per Exposed Idol (10)</div>
              <div>-1 per Exposed Skull Cave</div>
              <div>Max Possible Score: <strong>44</strong></div>
            </div>
          </div>

          <div className="space-y-1 text-[11px]">
            <p><strong>Explorer (Default):</strong> Legal hints, unlimited undo, tutorial assist.</p>
            <p><strong>Adventurer:</strong> No hints, 3 Undos per game.</p>
            <p><strong>Legend:</strong> Max 1 Boon/round, -1 per unused Boon at end, no Boon reshuffling.</p>
            <p><strong>Cursed Idol:</strong> No Boons at all! Extreme challenge.</p>
          </div>
        </div>
      ),
    },
  ];

  const current = pages[page];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg bg-[#142318] border-2 border-amber-600/70 rounded-2xl p-5 shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-900/50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono">
              {current.badge}
            </span>
            <h2
              className="text-xl sm:text-2xl font-black text-amber-300 uppercase tracking-wider font-display"
            >
              {current.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-amber-200/60 hover:text-amber-200 text-xl font-bold px-2 py-1 rounded bg-black/40 hover:bg-black/60 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 px-1">{current.content}</div>

        {/* Stepper Dots & Navigation */}
        <div className="flex items-center justify-between pt-3 border-t border-amber-900/50">
          <div className="flex items-center gap-1.5">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  page === i ? 'bg-amber-400 w-6' : 'bg-stone-700 hover:bg-stone-500'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {page > 0 && (
              <button
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-stone-200 text-xs font-bold border border-slate-600 cursor-pointer"
              >
                Prev
              </button>
            )}

            {page < pages.length - 1 ? (
              <button
                onClick={() => setPage(page + 1)}
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider border border-amber-300 cursor-pointer font-display"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider border border-emerald-400 cursor-pointer font-display"
              >
                Begin Journey
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
