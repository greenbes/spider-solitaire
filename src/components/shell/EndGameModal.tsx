import { useModalA11y } from '../../hooks/useModalA11y'

interface EndGameModalProps {
  isOpen: boolean
  title: string
  titleId: string
  icon: string
  children: React.ReactNode
  onClose?: () => void
  actions: React.ReactNode
  closeOnEscape?: boolean
}

export function EndGameModal({
  isOpen,
  title,
  titleId,
  icon,
  children,
  onClose,
  actions,
  closeOnEscape = true,
}: EndGameModalProps) {
  const containerRef = useModalA11y({ isOpen, onClose, closeOnEscape })
  if (!isOpen) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        ref={containerRef}
        className="bg-stone-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-8 text-center"
      >
        <div className="text-6xl mb-4">{icon}</div>
        <h2 id={titleId} className="text-2xl font-bold text-white mb-2">
          {title}
        </h2>
        <div className="text-stone-300 mb-6">{children}</div>
        <div className="flex gap-3">{actions}</div>
      </div>
    </div>
  )
}
