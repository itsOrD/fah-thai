/**
 * Typed content-pack loading. Paths are relative to the page (base './'),
 * which is what lets one artifact serve any deploy subpath (ADR-002).
 */
import { ContentManifest, ContentPack, type ContentManifestT, type ContentPackT } from './schema';

let manifestCache: ContentManifestT | null = null;
const packCache = new Map<string, ContentPackT>();

export async function loadManifest(): Promise<ContentManifestT> {
  if (manifestCache) return manifestCache;
  const res = await fetch('content/manifest.json');
  if (!res.ok) throw new Error(`manifest fetch failed: ${res.status}`);
  manifestCache = ContentManifest.parse(await res.json());
  return manifestCache;
}

export async function loadPack(id: string): Promise<ContentPackT> {
  const cached = packCache.get(id);
  if (cached) return cached;
  const manifest = await loadManifest();
  const entry = manifest.packs.find((p) => p.id === id);
  if (!entry) throw new Error(`unknown pack: ${id}`);
  const res = await fetch(`content/${entry.path}`);
  if (!res.ok) throw new Error(`pack fetch failed: ${res.status}`);
  const pack = ContentPack.parse(await res.json());
  packCache.set(id, pack);
  return pack;
}
