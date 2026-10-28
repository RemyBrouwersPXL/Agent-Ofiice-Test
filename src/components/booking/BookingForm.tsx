"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { artist } from "@/data/artist";
import {
  BUDGETS,
  CROWD_SIZES,
  EVENT_TYPES,
  SET_LENGTHS,
  STEP_FIELDS,
  emptyBooking,
  extraFieldLabel,
  validateBooking,
  type BookingErrors,
  type BookingRequest,
} from "@/lib/booking";
import type { BookingPrefill } from "@/store/ui";
import { cn } from "@/lib/utils";

const STEPS = ["Event", "Sound", "Contact"] as const;

const inputCls =
  "w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-ink placeholder:text-muted/60 outline-none transition-[border-color,box-shadow] focus:border-cyan focus:shadow-[0_0_0_3px_rgb(0_240_255/0.15)] aria-[invalid=true]:border-magenta";

function Field({ label, error, optional, children }: { label: string; error?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        {label}
        {optional && <span className="normal-case tracking-normal text-muted/60">optional</span>}
      </span>
      {children}
      {/* Reserved line height so errors don't push the layout around */}
      <span role="alert" className="block min-h-5 pt-1 text-xs text-magenta">
        {error}
      </span>
    </label>
  );
}

function Chips<T extends string>({
  options,
  value,
  onToggle,
  multi,
  label,
  error,
}: {
  options: readonly T[];
  value: T | T[];
  onToggle: (v: T) => void;
  multi?: boolean;
  label: string;
  error?: string;
}) {
  const selected = (o: T) => (Array.isArray(value) ? value.includes(o) : value === o);
  return (
    <fieldset>
      <legend className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{label}</legend>
      <div className="flex flex-wrap gap-2" role={multi ? "group" : "radiogroup"}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            role={multi ? "checkbox" : "radio"}
            aria-checked={selected(o)}
            onClick={() => onToggle(o)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              selected(o) ? "border-cyan bg-cyan/10 text-cyan" : "border-line text-muted hover:border-white/30 hover:text-ink",
            )}
          >
            {o}
          </button>
        ))}
      </div>
      <span role="alert" className="block min-h-5 pt-1 text-xs text-magenta">
        {error}
      </span>
    </fieldset>
  );
}

function fromPrefill(p: BookingPrefill): BookingRequest {
  const eventType = EVENT_TYPES.find((t) => t === p.eventType) ?? "";
  return { ...emptyBooking, eventType, date: p.date ?? "", city: p.city ?? "", venue: p.venue ?? "" };
}

export function BookingForm({ prefill, onDone }: { prefill: BookingPrefill; onDone: () => void }) {
  const [data, setData] = useState<BookingRequest>(() => fromPrefill(prefill));
  const [errors, setErrors] = useState<BookingErrors>({});
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");

  const set = <K extends keyof BookingRequest>(k: K, v: BookingRequest[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const next = () => {
    const errs = validateBooking(data, STEP_FIELDS[step]);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setDir(1);
    setStep((s) => s + 1);
  };
  const back = () => {
    setDir(-1);
    setStep((s) => s - 1);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) return next();
    const errs = validateBooking(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const firstBad = STEP_FIELDS.findIndex((fields) => fields.some((f) => errs[f]));
      if (firstBad >= 0 && firstBad !== step) setStep(firstBad);
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/booking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        if (json.errors) setErrors(json.errors);
        throw new Error(json.error ?? "Something went wrong");
      }
      setStatus("sent");
    } catch (err) {
      setServerMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <motion.div className="flex h-full flex-col items-center justify-center text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <span className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-lime text-black shadow-[0_0_40px_var(--color-lime)]">
          <Check className="h-8 w-8" />
        </span>
        <h3 className="font-display text-3xl font-black uppercase">Request received</h3>
        <p className="mt-3 max-w-sm text-muted">
          Thanks {data.name.split(" ")[0]}. {artist.name}&apos;s team will get back to you at {data.email} within 48 hours.
        </p>
        <Button className="mt-8" variant="outline" onClick={onDone}>
          Close
        </Button>
      </motion.div>
    );
  }

  const extraLabel = extraFieldLabel(data.eventType);
  const minDate = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={submit} noValidate className="flex h-full flex-col">
      {/* Progress */}
      <ol className="mb-8 grid grid-cols-3 gap-2">
        {STEPS.map((s, i) => (
          <li key={s}>
            <div className="h-0.5 overflow-hidden rounded bg-line">
              <motion.div
                className="h-full origin-left bg-cyan"
                initial={false}
                animate={{ scaleX: i <= step ? 1 : 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <p className={cn("mt-2 font-mono text-[10px] uppercase tracking-[0.25em]", i <= step ? "text-ink" : "text-muted")}>
              0{i + 1} {s}
            </p>
          </li>
        ))}
      </ol>

      {/* Honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={data.website} onChange={(e) => set("website", e.target.value)} />

      <div className="relative flex-1 overflow-x-hidden overflow-y-auto pr-1">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2"
          >
            {step === 0 && (
              <>
                <Chips label="Event type" options={EVENT_TYPES} value={data.eventType} onToggle={(v) => set("eventType", v)} error={errors.eventType} />
                <div className="grid gap-x-4 sm:grid-cols-2">
                  <Field label="Date" error={errors.date}>
                    <input type="date" min={minDate} className={inputCls} value={data.date} onChange={(e) => set("date", e.target.value)} aria-invalid={!!errors.date} />
                  </Field>
                  <Field label="Start time" optional>
                    <input type="time" className={inputCls} value={data.startTime} onChange={(e) => set("startTime", e.target.value)} />
                  </Field>
                  <Field label="Venue" optional>
                    <input className={inputCls} placeholder="Club / location name" value={data.venue} onChange={(e) => set("venue", e.target.value)} />
                  </Field>
                  <Field label="City" error={errors.city}>
                    <input className={inputCls} placeholder="Leuven" value={data.city} onChange={(e) => set("city", e.target.value)} aria-invalid={!!errors.city} autoComplete="address-level2" />
                  </Field>
                </div>
                <AnimatePresence initial={false}>
                  {extraLabel && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <Field label={extraLabel} error={errors.extra}>
                        <input className={inputCls} value={data.extra} onChange={(e) => set("extra", e.target.value)} aria-invalid={!!errors.extra} />
                      </Field>
                    </motion.div>
                  )}
                </AnimatePresence>
                <Chips label="Set length" options={SET_LENGTHS} value={data.setLength} onToggle={(v) => set("setLength", v)} error={errors.setLength} />
                <Chips label="Expected crowd" options={CROWD_SIZES} value={data.crowd} onToggle={(v) => set("crowd", data.crowd === v ? "" : v)} />
              </>
            )}

            {step === 1 && (
              <>
                <Chips
                  label="What should the night sound like? (pick any)"
                  options={artist.genres}
                  value={data.genres as (typeof artist.genres)[number][]}
                  multi
                  onToggle={(g) => set("genres", data.genres.includes(g) ? data.genres.filter((x) => x !== g) : [...data.genres, g])}
                />
                <Chips label="Budget (optional)" options={BUDGETS} value={data.budget} onToggle={(v) => set("budget", data.budget === v ? "" : v)} />
                <p className="text-sm text-muted">
                  Not sure? Leave it open — {artist.name} reads the room and builds the set around your crowd.
                </p>
              </>
            )}

            {step === 2 && (
              <div className="grid gap-x-4 sm:grid-cols-2">
                <Field label="Name" error={errors.name}>
                  <input className={inputCls} value={data.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} autoComplete="name" />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input type="email" className={inputCls} value={data.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} autoComplete="email" />
                </Field>
                <Field label="Phone" optional error={errors.phone}>
                  <input type="tel" className={inputCls} value={data.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!errors.phone} autoComplete="tel" />
                </Field>
                <Field label="Organisation" optional>
                  <input className={inputCls} value={data.organisation} onChange={(e) => set("organisation", e.target.value)} autoComplete="organization" />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Anything else?" optional error={errors.message}>
                    <textarea rows={4} className={cn(inputCls, "resize-none")} value={data.message} onChange={(e) => set("message", e.target.value)} placeholder="Line-up, vibe, tech rider questions…" />
                  </Field>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-4 rounded-lg border border-magenta/40 bg-magenta/10 px-4 py-3 text-sm text-magenta">
          {serverMsg} — or email <a className="underline" href={`mailto:${artist.bookingEmail}`}>{artist.bookingEmail}</a>.
        </p>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-line pt-6">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={back} className="px-0">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={status === "sending"}>
          {step < STEPS.length - 1 ? (
            <>
              Next <ArrowRight className="h-4 w-4" />
            </>
          ) : status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending
            </>
          ) : (
            <>
              Send request <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
