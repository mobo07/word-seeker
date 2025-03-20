"use client";

import { Mic } from "lucide-react";

export default function SpeechToTextBtn() {
  return (
    <div className="absolute right-3 bottom-3 flex items-center justify-center w-9 h-9 rounded-full bg-[#f4f4f5] cursor-pointer">
      <Mic size={20} />
    </div>
  );
}
