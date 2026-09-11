"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Post } from "@/types/content";

interface PlayerContextValue {
  current: Post | null;
  playing: boolean;
  /** Start this episode, or pause/resume if it is already loaded. */
  toggle: (post: Post) => void;
  setPlaying: (v: boolean) => void;
  close: () => void;
}

const PlayerContext = createContext<PlayerContextValue>({
  current: null,
  playing: false,
  toggle: () => {},
  setPlaying: () => {},
  close: () => {},
});

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Post | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = useCallback((post: Post) => {
    setCurrent((prev) => {
      if (prev?.id === post.id) {
        setPlaying((p) => !p);
        return prev;
      }
      setPlaying(true);
      return post;
    });
  }, []);

  const close = useCallback(() => {
    setCurrent(null);
    setPlaying(false);
  }, []);

  const value = useMemo(
    () => ({ current, playing, toggle, setPlaying, close }),
    [current, playing, toggle, close],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  return useContext(PlayerContext);
}
