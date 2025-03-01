"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    setMounted(true);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300",
        isOnline ? "h-0 opacity-0" : "h-8 opacity-100",
      )}
    >
      {!isOnline && (
        <div className="fixed top-0 z-50 w-full bg-red-500 p-1.5 text-center text-sm text-white">
          Vous êtes hors ligne. L&apos;application continue de fonctionner mais
          certaines fonctionnalités peuvent être limitées.
        </div>
      )}
    </div>
  );
}
