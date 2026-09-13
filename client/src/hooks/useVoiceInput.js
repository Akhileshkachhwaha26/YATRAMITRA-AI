import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Wraps the browser-native Web Speech API (SpeechRecognition) — no
 * external API key or backend involved. Works in Chrome/Edge; on
 * unsupported browsers (Firefox, Safari on some versions) `supported`
 * is false and the caller should hide the mic button.
 *
 * @param {string} lang - BCP-47 language tag, e.g. 'en-IN', 'hi-IN'
 * @param {(text: string) => void} onResult - called with the final transcript
 */
export default function useVoiceInput(lang = 'en-IN', onResult) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    setSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.lang = lang;

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) onResult(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = useCallback(() => {
    if (!recognitionRef.current || listening) return;
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      // Some browsers throw if start() is called while already starting —
      // safe to ignore, onend/onerror will reset `listening`.
    }
  }, [listening]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return { listening, supported, start, stop };
}
