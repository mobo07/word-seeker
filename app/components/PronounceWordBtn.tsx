"use client";

import { Volume2 } from "lucide-react";
import { useEffect, useRef } from "react";

export default function PronounceWordBtn({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.controls = false;
    }
  }, []);

  const playAudio = () => {
    if (audioRef.current) audioRef.current?.play();
  };

  return (
    <div>
      <Volume2 onClick={playAudio} />
      <audio ref={audioRef} src={src} controls></audio>
    </div>
  );
}
