import { X } from 'lucide-react'

export interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-stone-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 font-['DM_Sans']"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-700">
          <h2 className="text-xl font-semibold text-white">How to Play</h2>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white transition-colors"
            aria-label="Close help"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 overflow-y-auto max-h-[70vh]">
          <section>
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2">
              Objective
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              Complete 8 foundations by building same-suit sequences from King down to Ace.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2">
              The Setup
            </h3>
            <ul className="text-stone-300 text-sm leading-relaxed space-y-1 list-disc list-inside">
              <li>54 cards dealt across 10 columns (first 4 get 6 cards, last 6 get 5)</li>
              <li>Only the top card of each column is face-up</li>
              <li>50 cards remain in the stock pile</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2">
              Moving Cards
            </h3>
            <ul className="text-stone-300 text-sm leading-relaxed space-y-1 list-disc list-inside">
              <li>Move any face-up card onto a card one rank higher</li>
              <li>Move same-suit descending sequences as a group</li>
              <li>Any card or sequence can move to an empty column</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2">
              Dealing from Stock
            </h3>
            <ul className="text-stone-300 text-sm leading-relaxed space-y-1 list-disc list-inside">
              <li>Click the stock pile to deal 10 cards (one per column)</li>
              <li>Cannot deal while any column is empty</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2">
              Completing Suits
            </h3>
            <ul className="text-stone-300 text-sm leading-relaxed space-y-1 list-disc list-inside">
              <li>Build a same-suit sequence from King to Ace</li>
              <li>Completed sequences automatically move to the foundation</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2">
              Difficulty Levels
            </h3>
            <ul className="text-stone-300 text-sm leading-relaxed space-y-1 list-disc list-inside">
              <li><span className="text-white font-medium">1 Suit (Easy):</span> All cards are Spades</li>
              <li><span className="text-white font-medium">2 Suits (Medium):</span> Spades and Hearts</li>
              <li><span className="text-white font-medium">4 Suits (Hard):</span> All four suits</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2">
              Tips
            </h3>
            <ul className="text-stone-300 text-sm leading-relaxed space-y-1 list-disc list-inside">
              <li>Prioritize exposing face-down cards</li>
              <li>Keep columns open strategically</li>
              <li>Build same-suit sequences when possible</li>
              <li>Use the Hint button if stuck</li>
            </ul>
          </section>
        </div>

        <div className="px-6 py-4 border-t border-stone-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
