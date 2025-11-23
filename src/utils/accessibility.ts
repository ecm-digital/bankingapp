/**
 * Accessibility utilities for keyboard navigation and screen readers
 */

// Trap focus within a modal or dialog
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);

  // Focus first element
  firstFocusable?.focus();

  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

// Announce to screen readers
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Check if element is visible
export function isElementVisible(element: HTMLElement): boolean {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
}

// Get next focusable element
export function getNextFocusableElement(
  currentElement: HTMLElement,
  direction: 'next' | 'previous' = 'next'
): HTMLElement | null {
  const focusableElements = Array.from(
    document.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter(isElementVisible);

  const currentIndex = focusableElements.indexOf(currentElement);
  
  if (currentIndex === -1) return null;

  const nextIndex = direction === 'next' 
    ? (currentIndex + 1) % focusableElements.length
    : (currentIndex - 1 + focusableElements.length) % focusableElements.length;

  return focusableElements[nextIndex];
}

// Keyboard event helpers
export const Keys = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End',
} as const;

export function isKeyPressed(event: KeyboardEvent, key: string): boolean {
  return event.key === key;
}

// ARIA helpers
export function generateAriaLabel(text: string, context?: string): string {
  return context ? `${text}, ${context}` : text;
}

export function setAriaExpanded(element: HTMLElement, expanded: boolean) {
  element.setAttribute('aria-expanded', String(expanded));
}

export function setAriaHidden(element: HTMLElement, hidden: boolean) {
  element.setAttribute('aria-hidden', String(hidden));
}

// Skip to content link
export function createSkipLink(targetId: string, text: string = 'Skip to main content') {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = text;
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded';
  
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  return skipLink;
}
