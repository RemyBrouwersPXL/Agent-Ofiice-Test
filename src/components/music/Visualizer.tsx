"use client";

import { useEffect, useRef } from "react";

/**
 * Beat-synced spectrum visualizer drawn on canvas. Streaming embeds are
 * cross-origin iframes, so their audio can't be analysed; instead the bars are
 * driven by the release's BPM with a kick envelope + per-band noise, which
 * reads as "audio-reactive" and costs ~0.2ms/frame. The rAF loop only runs
 * while `active`, so idle cards cost nothing.
 *
 * To use real analysis later (e.g. self-hosted previews), feed an
 * AnalyserNode's getByteFrequencyData() into `levels` instead of `synth()`.
 */
export function Visualizer({ active, bpm, color, bars = 40 }: { active: boolean; bpm: number; color: string; bars?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const levels = useRef<Float32Array>(new Float32Array(bars));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    const start = performance.now();
    const lv = levels.current;

    const synth = (t: number, i: number) => {
      const beat = (t * bpm) / 60;
      const kick = Math.pow(1 - (beat % 1), 4);
      const hat = Math.pow(1 - ((beat * 2 + 0.5) % 1), 8);
      const band = i / bars;
      const low = kick * Math.max(0, 1 - band * 2.2);
      const high = hat * Math.max(0, band - 0.45) * 1.6;
      const mid = 0.35 + 0.25 * Math.sin(t * 3.1 + i * 0.7) * Math.sin(t * 1.7 + i * 0.31);
      return Math.min(1, low + high + mid * (0.6 + kick * 0.4));
    };

    const draw = () => {
      const t = (performance.now() - start) / 1000;
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      const gap = w / bars;
      const bw = gap * 0.55;
      const grad = ctx.createLinearGradient(0, h, 0, 0);
      grad.addColorStop(0, color);
      grad.addColorStop(1, "rgba(255,255,255,0.9)");
      ctx.fillStyle = grad;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;

      let settled = true;
      for (let i = 0; i < bars; i++) {
        const target = active ? synth(t, i) : 0;
        // Fast attack, slow release — like a real meter.
        lv[i] += (target - lv[i]) * (target > lv[i] ? 0.5 : 0.12);
        if (lv[i] > 0.002) settled = false;
        const bh = lv[i] * h * 0.9;
        ctx.fillRect(i * gap + (gap - bw) / 2, h - bh, bw, bh);
      }
      // Keep animating while active, or until the bars have fallen back to zero.
      if (active || !settled) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [active, bpm, color, bars]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
