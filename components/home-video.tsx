"use client"; // si vous êtes en app router Next.js et que vous gérez du state client

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function HomeVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const [fadeClass, setFadeClass] = useState<"fade-in" | "fade-out">("fade-in");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // S'il reste moins d'une seconde avant la fin, on fade out
      if (video.duration - video.currentTime < 1) {
        setFadeClass("fade-out");
      } else if (fadeClass !== "fade-in") {
        // Sinon, on repasse en fade-in
        setFadeClass("fade-in");
      }
    };

    // Quand la vidéo "loop" et revient au début
    // on remet la classe fade-in (sinon elle reste à 0 d'opacité).
    const handleSeeked = () => {
      setTimeout(() => setFadeClass("fade-in"), 1000);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("seeked", handleSeeked);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, [fadeClass]);

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative h-[90vh] bg-black">
      <video
        ref={videoRef}
        // src="https://cdn.pixabay.com/video/2025/01/19/253436_large.mp4"
        // src="https://cdn.pixabay.com/video/2021/07/18/81945-577442929_large.mp4"
        // src="https://cdn.pixabay.com/video/2024/03/18/204565-924698132_large.mp4"
        src="https://cdn.pixabay.com/video/2023/02/08/149817-798983831_large.mp4"
        autoPlay
        loop
        muted
        playsInline
        className={`h-full w-full object-cover transition-opacity duration-700 ${fadeClass}`}
      />
      <div className="absolute bottom-0 left-0 w-full">
        <div className="mx-auto flex max-w-[1000px] items-center justify-between pb-4">
          <Badge variant="default">🇻🇳 Vietnam</Badge>

          <div className="flex items-center gap-3">
            <Separator className="bg-gray-900 opacity-50" />
            <Button
              onClick={handleTogglePlay}
              className="opacity-50 transition-all ease-out hover:opacity-100"
            >
              {isPlaying ? <Play /> : <Pause />}
            </Button>
            <Separator className="bg-gray-900 opacity-50" />
          </div>
          <div className="w-52" />
        </div>
      </div>
    </div>
  );
}
