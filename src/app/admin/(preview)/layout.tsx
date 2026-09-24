import { PlayerProvider } from "@/components/audio/PlayerProvider";
import { MiniPlayer } from "@/components/audio/MiniPlayer";

/**
 * Preview pages render the public article layout (which needs the audio
 * player context) without the dashboard shell or the public navigation.
 */
export default function PreviewLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <PlayerProvider>
      <main id="main" className="flex-1">
        {children}
      </main>
      <MiniPlayer />
    </PlayerProvider>
  );
}
