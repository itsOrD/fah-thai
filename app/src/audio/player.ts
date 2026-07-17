/**
 * Minimal audio playback for pre-baked clips. Hash refs resolve to
 * audio/<hash>.mp3. Degrades gracefully while the TTS pilot is pending —
 * a missing file resolves false and the UI says so instead of erroring.
 *
 * (The full AudioContext manager — unlock/resume/route rebuild — arrives
 * with Tone Studio, which actually needs a graph; <audio> elements are
 * enough for clip playback and dodge the gesture-unlock ceremony.)
 */

let current: HTMLAudioElement | null = null;

export async function playClip(hash: string): Promise<boolean> {
  current?.pause();
  const el = new Audio(`audio/${hash}.mp3`);
  current = el;
  try {
    await el.play();
    return true;
  } catch {
    return false;
  }
}
