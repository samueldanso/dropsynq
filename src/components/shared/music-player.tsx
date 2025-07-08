"use client";

import { Pause, Play, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface MusicPlayerTrack {
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl?: string;
}

interface MusicPlayerProps {
  track: MusicPlayerTrack | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MusicPlayer({
  track,
  isOpen,
  onClose,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!track) return;
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [track]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    setProgress(duration ? (audioRef.current.currentTime / duration) * 100 : 0);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const seekTo = (Number(e.target.value) / 100) * duration;
    audioRef.current.currentTime = seekTo;
    setCurrentTime(seekTo);
    setProgress(Number(e.target.value));
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setProgress(0);
  };

  if (!isOpen || !track) return null;

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(1, "0");
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  }

  function ipfsToHttp(url: string) {
    if (!url) return url;
    if (url.startsWith("ipfs://")) {
      return url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    return url;
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 w-full z-50 flex flex-col items-center justify-between gap-2",
        "rounded-t-2xl bg-background/95 shadow-2xl px-4 py-1 md:px-8 md:py-2"
      )}
    >
      <div className="flex items-center justify-between w-full gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-4 min-w-0">
          {track.coverUrl && (
            <Image
              src={ipfsToHttp(track.coverUrl)}
              alt={track.title}
              width={36}
              height={36}
              className="rounded-lg object-cover"
            />
          )}
          <div className="min-w-0">
            <div className="font-semibold truncate text-base md:text-lg">
              {track.title}
            </div>
            <div className="text-muted-foreground text-xs md:text-sm truncate">
              {track.artist}
            </div>
          </div>
        </div>
        {/* Controls */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button
            onClick={handlePlayPause}
            type="button"
            className="rounded-full p-2 bg-[#FF9900] hover:bg-[#e88a00] transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="size-6 text-black" />
            ) : (
              <Play
                className="size-6 text-black fill-current"
                fill="currentColor"
              />
            )}
          </button>
          {/* Progress Bar */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xs tabular-nums w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 accent-[#FF9900] music-player-range"
            />
            <span className="text-xs tabular-nums w-10 text-left">
              {formatTime(duration)}
            </span>
          </div>
        </div>
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="rounded-full p-2 hover:bg-muted transition-colors"
          aria-label="Close player"
        >
          <X className="size-5" />
        </button>
      </div>
      {/* Native Audio Element (hidden) */}
      <audio
        ref={audioRef}
        src={ipfsToHttp(track.audioUrl)}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        style={{ display: "none" }}
      >
        <track kind="captions" />
      </audio>
    </div>
  );
}
