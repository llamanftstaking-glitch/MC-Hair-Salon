"use client";
import { useState, useEffect } from "react";
import { Music, PlayCircle, Save, Loader, Tv } from "lucide-react";

type Platform = "youtube" | "spotify";

interface VibeSettings {
  youtubeUrl: string;
  spotifyUrl:  string;
  activePlatform: Platform;
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let videoId = u.searchParams.get("v");
    if (!videoId && u.hostname === "youtu.be") videoId = u.pathname.slice(1);
    const listId = u.searchParams.get("list");
    if (listId) return `https://www.youtube.com/embed?listType=playlist&list=${listId}&autoplay=0`;
    if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=0`;
    return null;
  } catch {
    return null;
  }
}

function getSpotifyEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("spotify.com")) return null;
    const path = u.pathname; // e.g. /playlist/xyz or /album/xyz
    return `https://open.spotify.com/embed${path}?utm_source=generator`;
  } catch {
    return null;
  }
}

const inputCls = "w-full bg-[var(--mc-surface-dark)] border border-[var(--mc-border)] text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444]";
const labelCls = "block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-2";

export default function VibeTab() {
  const [settings, setSettings] = useState<VibeSettings>({
    youtubeUrl: "",
    spotifyUrl:  "",
    activePlatform: "spotify",
  });
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.vibe) setSettings(data.vibe as VibeSettings);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ key: "vibe", value: settings }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  const ytEmbed  = getYouTubeEmbedUrl(settings.youtubeUrl);
  const spEmbed  = getSpotifyEmbedUrl(settings.spotifyUrl);
  const activeEmbed = settings.activePlatform === "youtube" ? ytEmbed : spEmbed;

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-[#222] border-t-[var(--mc-accent)] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full gold-gradient-bg flex items-center justify-center">
          <Music size={18} className="text-black" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-white">Salon Vibe</h2>
          <p className="text-[#555] text-xs">Control the background music for your salon atmosphere</p>
        </div>
      </div>

      {/* Platform toggle */}
      <div className="flex gap-2">
        {(["spotify", "youtube"] as Platform[]).map(p => (
          <button key={p} onClick={() => setSettings(s => ({ ...s, activePlatform: p }))}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer ${
              settings.activePlatform === p
                ? "gold-gradient-bg text-black"
                : "border border-[var(--mc-border)] text-[#555] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)]"
            }`}>
            {p === "spotify" ? <Music size={13} /> : <PlayCircle size={13} />}
            {p === "spotify" ? "Spotify" : "YouTube"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Config panel */}
        <div className="space-y-5">
          {/* YouTube */}
          <div className="luxury-card p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <PlayCircle size={15} className="text-red-400" />
              <h3 className="text-white font-semibold text-sm">YouTube</h3>
            </div>
            <div>
              <label className={labelCls}>Video or Playlist URL</label>
              <input
                type="url"
                value={settings.youtubeUrl}
                onChange={e => setSettings(s => ({ ...s, youtubeUrl: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=... or playlist"
                className={inputCls}
              />
            </div>
            {settings.youtubeUrl && !ytEmbed && (
              <p className="text-red-400 text-xs">Invalid YouTube URL — paste a video or playlist link</p>
            )}
            {ytEmbed && (
              <button onClick={() => setSettings(s => ({ ...s, activePlatform: "youtube" }))}
                className="text-xs text-[var(--mc-accent)] hover:underline cursor-pointer">
                Set as active platform →
              </button>
            )}
          </div>

          {/* Spotify */}
          <div className="luxury-card p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Music size={15} className="text-green-400" />
              <h3 className="text-white font-semibold text-sm">Spotify</h3>
            </div>
            <div>
              <label className={labelCls}>Playlist or Album URL</label>
              <input
                type="url"
                value={settings.spotifyUrl}
                onChange={e => setSettings(s => ({ ...s, spotifyUrl: e.target.value }))}
                placeholder="https://open.spotify.com/playlist/..."
                className={inputCls}
              />
            </div>
            {settings.spotifyUrl && !spEmbed && (
              <p className="text-red-400 text-xs">Invalid Spotify URL — paste a playlist or album link</p>
            )}
            {spEmbed && (
              <button onClick={() => setSettings(s => ({ ...s, activePlatform: "spotify" }))}
                className="text-xs text-[var(--mc-accent)] hover:underline cursor-pointer">
                Set as active platform →
              </button>
            )}
          </div>

          {/* Save */}
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-6 py-3 gold-gradient-bg text-black font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer">
            {saving
              ? <><Loader size={13} className="animate-spin" /> Saving…</>
              : saved
              ? <><Save size={13} /> Saved!</>
              : <><Save size={13} /> Save Settings</>}
          </button>
        </div>

        {/* Live preview */}
        <div>
          <p className={`${labelCls} mb-3`}>Live Preview — {settings.activePlatform === "youtube" ? "YouTube" : "Spotify"}</p>
          {activeEmbed ? (
            <div className="border border-[var(--mc-border)] overflow-hidden">
              <iframe
                src={activeEmbed}
                width="100%"
                height={settings.activePlatform === "spotify" ? 380 : 315}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                loading="lazy"
                title="Salon music player"
              />
            </div>
          ) : (
            <div className="border border-[var(--mc-border)] bg-[var(--mc-surface-dark)] flex flex-col items-center justify-center h-56 gap-3">
              <Tv size={28} className="text-[#333]" />
              <p className="text-[#444] text-sm text-center">
                {settings.activePlatform === "youtube"
                  ? "Enter a YouTube URL to preview"
                  : "Enter a Spotify URL to preview"}
              </p>
            </div>
          )}

          <div className="mt-4 border border-[#1a1a1a] bg-[#0a0800] px-4 py-3">
            <p className="text-[var(--mc-accent)] text-xs font-semibold uppercase tracking-widest mb-1">How to use</p>
            <p className="text-[#555] text-xs leading-relaxed">
              Paste a YouTube video/playlist URL or a Spotify playlist/album URL above.
              The active player will be displayed here. Note: Spotify requires a browser that supports cross-origin embeds. For in-salon use, open this admin panel on your front-desk device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
