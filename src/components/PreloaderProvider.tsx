"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface PreloaderContextValue {
  /** True once the intro overlay has finished (or was skipped). */
  done: boolean;
  markDone: () => void;
}

const PreloaderContext = createContext<PreloaderContextValue>({
  done: false,
  markDone: () => {},
});

export function PreloaderProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(false);
  const markDone = useCallback(() => setDone(true), []);
  const value = useMemo(() => ({ done, markDone }), [done, markDone]);
  return <PreloaderContext.Provider value={value}>{children}</PreloaderContext.Provider>;
}

export function usePreloader() {
  return useContext(PreloaderContext);
}
