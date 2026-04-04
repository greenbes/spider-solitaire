import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

interface UseModalA11yOptions {
  isOpen: boolean
  onClose?: () => void
  /** When true, pressing Escape triggers onClose. Default: true. */
  closeOnEscape?: boolean
}

/**
 * Accessibility helpers for modal dialogs:
 * - Traps Tab focus within the modal
 * - Auto-focuses the first focusable element on open
 * - Closes on Escape (when closeOnEscape & onClose provided)
 * - Restores focus to the previously-focused element on close
 *
 * Attach the returned ref to the modal's root element.
 */
export function useModalA11y({
  isOpen,
  onClose,
  closeOnEscape = true,
}: UseModalA11yOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null

    // Focus first focusable element inside the modal
    const container = containerRef.current
    if (container) {
      const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (focusable.length > 0) {
        focusable[0].focus()
      } else {
        container.focus()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape && onClose) {
        e.stopPropagation()
        onClose()
        return
      }

      if (e.key !== 'Tab' || !container) return

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => !el.hasAttribute('disabled'))

      if (focusable.length === 0) {
        e.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Restore focus when modal closes
      const previous = previouslyFocusedRef.current
      if (previous && typeof previous.focus === 'function') {
        previous.focus()
      }
    }
  }, [isOpen, onClose, closeOnEscape])

  return containerRef
}
