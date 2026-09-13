import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ym_notifications_enabled';

/**
 * Wraps the browser-native Notification API. This gives REAL local
 * notifications (e.g. "trip saved!") while the app is open in a tab —
 * it does NOT deliver push notifications while the browser/app is
 * closed, which would require a server-side push service (Firebase
 * Cloud Messaging or similar) with its own project credentials. That's
 * intentionally not faked here; see README "Future scope" for what
 * wiring up real push would involve.
 */
export default function useNotifications() {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );
  const [enabled, setEnabled] = useState(localStorage.getItem(STORAGE_KEY) === 'true');

  const supported = typeof window !== 'undefined' && 'Notification' in window;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  }, [enabled]);

  const requestPermission = useCallback(async () => {
    if (!supported) return false;
    const result = await Notification.requestPermission();
    setPermission(result);
    const granted = result === 'granted';
    setEnabled(granted);
    return granted;
  }, [supported]);

  const notify = useCallback(
    (title, options) => {
      if (!supported || permission !== 'granted' || !enabled) return;
      try {
        new Notification(title, { icon: '/pwa-192x192.png', ...options });
      } catch {
        // Some browsers (notably iOS Safari, or when the tab is
        // backgrounded on certain OSes) can throw here — a missed
        // notification is not worth crashing over.
      }
    },
    [supported, permission, enabled]
  );

  return { supported, permission, enabled, requestPermission, notify };
}
