import React, { useEffect, useMemo, useState } from "react";

const DEFAULT_TIPS = [
  "Press [F1] to open the player menu, you can select emotes, skills and more.",
  "Use [B] to point at something or someone.",
  "Hold [Left-Alt] to toggle third-eye interaction (if enabled).",
  "You can use /me and /do for immersive roleplay.",
  "Use the map to find garages, stores, and other important locations.",
  "Stay in character at all times, use /OOC only when needed.",
  "Remember to use `pnpm i` and `pnpm build` when editing UI",
];

export default function DailyTip({
  tips = DEFAULT_TIPS,
  label = "DAILY TIP",
  typingSpeed = 45,
  deletingSpeed = 20,
  holdDelay = 5000,
}) {
  const safeTips = useMemo(
    () => (Array.isArray(tips) && tips.length ? tips : DEFAULT_TIPS),
    [tips]
  );

  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * safeTips.length)
  );
  const [displayed, setDisplayed] = useState("");
  const [mode, setMode] = useState("typing");

  useEffect(() => {
    setIndex((i) => (safeTips.length ? i % safeTips.length : 0));
  }, [safeTips.length]);

  useEffect(() => {
    let timeout;

    const current = safeTips[index] ?? "";
    if (!current) return;

    if (mode === "typing") {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => setMode("deleting"), holdDelay);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, deletingSpeed);
      } else {
        setIndex((prev) => (prev + 1) % safeTips.length);
        setMode("typing");
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, index, mode, safeTips, typingSpeed, deletingSpeed, holdDelay]);

  return (
    <div className="absolute bottom-[72px] left-6 w-full select-none leading-[1.5] font-sans text-[1vw] text-white/90 drop-shadow-[0_0_2px_rgba(0,0,0,0.6)]">
      <div className="mb-[2px] text-xs font-bold uppercase tracking-[0.5px] text-brand-main">
        {label}
      </div>

      <div className="flex items-center overflow-hidden whitespace-nowrap text-ellipsis">
        <span className="text-xs font-normal leading-[1.4]">{displayed}</span>
        <span className="ml-[2px] inline-block w-[1ch] animate-blink text-brand-main">
          |
        </span>
      </div>
    </div>
  );
}
