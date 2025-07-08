"use client";

// @ts-expect-error: howler types may be missing, suppress for now
import { Howl } from "howler";
import { Pause, Play, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
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
	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const howlRef = useRef<Howl | null>(null);
	const progressInterval = useRef<NodeJS.Timeout | null>(null);
	const waveformRef = useRef<HTMLDivElement | null>(null);
	const wavesurferRef = useRef<WaveSurfer | null>(null);

	// Initialize and sync wavesurfer
	useEffect(() => {
		if (!track || !waveformRef.current) return;
		if (wavesurferRef.current) {
			wavesurferRef.current.destroy();
		}
		wavesurferRef.current = WaveSurfer.create({
			container: waveformRef.current,
			waveColor: "#888",
			progressColor: "#FF9900", // brand color
			barWidth: 2,
			barRadius: 2,
			height: 48,
			url: track.audioUrl,
			interact: true,
		});
		wavesurferRef.current.on("ready", () => {
			setDuration(wavesurferRef.current?.getDuration() || 0);
		});
		wavesurferRef.current.on("interaction", (time: number) => {
			if (howlRef.current) {
				howlRef.current.seek(time);
				setCurrentTime(time);
				setProgress((time / (wavesurferRef.current?.getDuration() || 1)) * 100);
			}
		});
		return () => {
			wavesurferRef.current?.destroy();
		};
	}, [track]);

	// Play/Pause logic
	useEffect(() => {
		if (!track) return;
		if (howlRef.current) {
			howlRef.current.unload();
		}
		howlRef.current = new Howl({
			src: [track.audioUrl],
			html5: true,
			onload: () => {
				setDuration(howlRef.current?.duration() || 0);
			},
			onend: () => {
				setIsPlaying(false);
				setCurrentTime(0);
				setProgress(0);
				wavesurferRef.current?.stop();
			},
		});
		setIsPlaying(false);
		setCurrentTime(0);
		setProgress(0);
		return () => {
			howlRef.current?.unload();
			if (progressInterval.current) clearInterval(progressInterval.current);
		};
	}, [track]);

	// Progress bar update
	useEffect(() => {
		if (isPlaying && howlRef.current) {
			progressInterval.current = setInterval(() => {
				const seek = howlRef.current?.seek() as number;
				setCurrentTime(seek);
				setProgress(duration ? (seek / duration) * 100 : 0);
				wavesurferRef.current?.setTime(seek);
			}, 500);
		} else {
			if (progressInterval.current) clearInterval(progressInterval.current);
		}
		return () => {
			if (progressInterval.current) clearInterval(progressInterval.current);
		};
	}, [isPlaying, duration]);

	const handlePlayPause = () => {
		if (!howlRef.current) return;
		if (isPlaying) {
			howlRef.current.pause();
			wavesurferRef.current?.pause();
			setIsPlaying(false);
		} else {
			howlRef.current.play();
			wavesurferRef.current?.play();
			setIsPlaying(true);
		}
	};

	const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!howlRef.current) return;
		const seekTo = (Number(e.target.value) / 100) * duration;
		howlRef.current.seek(seekTo);
		wavesurferRef.current?.setTime(seekTo);
		setCurrentTime(seekTo);
		setProgress(Number(e.target.value));
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

	return (
		<div
			className={cn(
				"fixed bottom-0 left-0 w-full z-50 flex flex-col items-center justify-between gap-2",
				"rounded-t-2xl bg-background/95 shadow-2xl px-4 py-3 md:px-8 md:py-4",
			)}
		>
			{/* Waveform Visualization */}
			<div ref={waveformRef} className="w-full h-12 mb-2 select-none" />

			{/* Player Controls */}
			<div className="flex items-center justify-between w-full gap-4">
				{/* Track Info */}
				<div className="flex items-center gap-4 min-w-0">
					{track.coverUrl && (
						<Image
							src={track.coverUrl}
							alt={track.title}
							width={48}
							height={48}
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
							<Play className="size-6 text-black" />
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
		</div>
	);
}

// Custom styles for range input fallback
if (typeof window !== "undefined") {
	const styleId = "music-player-range-style";
	if (!document.getElementById(styleId)) {
		const style = document.createElement("style");
		style.id = styleId;
		style.innerHTML = `
		input.music-player-range::-webkit-slider-thumb {
			background: #FF9900;
		}
		input.music-player-range::-webkit-slider-runnable-track {
			background: linear-gradient(to right, #FF9900 var(--progress, 0%), #e5e7eb var(--progress, 0%));
		}
		input.music-player-range::-moz-range-thumb {
			background: #FF9900;
		}
		input.music-player-range::-ms-fill-lower {
			background: #FF9900;
		}
		`;
		document.head.appendChild(style);
	}
}
