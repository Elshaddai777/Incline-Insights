import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "inkwell.document.v1";
const SAVE_DEBOUNCE_MS = 500;

export interface StoredDocument {
  title: string;
  content: string;
  updatedAt: string;
}

const DEFAULT_DOCUMENT: StoredDocument = {
  title: "Untitled document",
  content: "<p></p>",
  updatedAt: new Date().toISOString(),
};

export function loadDocument(): StoredDocument {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DOCUMENT;
    const parsed = JSON.parse(raw) as Partial<StoredDocument>;
    return {
      title: parsed.title ?? DEFAULT_DOCUMENT.title,
      content: parsed.content ?? DEFAULT_DOCUMENT.content,
      updatedAt: parsed.updatedAt ?? DEFAULT_DOCUMENT.updatedAt,
    };
  } catch {
    return DEFAULT_DOCUMENT;
  }
}

export type SaveStatus = "saved" | "saving" | "unsaved";

export function useAutosaveDocument(title: string, content: string | null) {
  const [status, setStatus] = useState<SaveStatus>("saved");
  const timeoutRef = useRef<number | null>(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (content === null) return;
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    setStatus("unsaved");
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setStatus("saving");
      const doc: StoredDocument = { title, content, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
      setStatus("saved");
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content]);

  return status;
}
