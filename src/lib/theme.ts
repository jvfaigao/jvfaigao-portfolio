export type Theme = 'dark' | 'light';

type ThemeStorage = Pick<Storage, 'getItem' | 'setItem'>;

const KEY = 'theme';

// Storage access itself can throw (privacy mode, blocked cookies), so it stays inside the try.
export function getStoredTheme(storage?: ThemeStorage): Theme | null {
  try {
    const value = (storage ?? localStorage).getItem(KEY);
    return value === 'dark' || value === 'light' ? value : null;
  } catch {
    return null;
  }
}

export function storeTheme(theme: Theme, storage?: ThemeStorage): void {
  try {
    (storage ?? localStorage).setItem(KEY, theme);
  } catch {
    // Not saved; the toggle still works for this page view.
  }
}
