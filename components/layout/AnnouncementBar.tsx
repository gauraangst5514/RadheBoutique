"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function AnnouncementBar() {
  const [data, setData] = useState<{ text: string; link?: string; enabled: boolean } | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data?.announcementEnabled) {
          setData({
            text: d.data.announcementText,
            link: d.data.announcementLink,
            enabled: true,
          });
          if (!sessionStorage.getItem("announcement_dismissed")) {
            setDismissed(false);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("announcement_dismissed", "true");
  };

  if (!data || dismissed) return null;

  return (
    <div className="bg-gold text-white text-center text-sm py-2.5 px-10 relative overflow-hidden">
      <div className="container mx-auto">
        {data.link ? (
          <Link href={data.link} className="hover:underline underline-offset-2 font-medium inline-block animate-[slide-down_0.4s_ease-out]">
            {data.text}
          </Link>
        ) : (
          <span className="inline-block animate-[slide-down_0.4s_ease-out]">{data.text}</span>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}
