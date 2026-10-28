import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";

const styles: Record<Variant, string> = {
  primary:
    "bg-ink text-black hover:bg-cyan hover:shadow-[0_0_40px_-4px_var(--color-cyan)]",
  outline:
    "border border-white/20 text-ink hover:border-magenta hover:text-magenta hover:shadow-[0_0_32px_-8px_var(--color-magenta)]",
  ghost: "text-ink hover:text-cyan",
};

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-mono text-xs font-medium uppercase tracking-[0.2em] transition-[color,background-color,border-color,box-shadow] duration-300 disabled:pointer-events-none disabled:opacity-40";

type CommonProps = { variant?: Variant; pulse?: boolean; className?: string; children: React.ReactNode };

/** Adds a beat-synced ring behind the button (145 BPM). */
function PulseRing({ show }: { show?: boolean }) {
  if (!show) return null;
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full">
      <span className="absolute inset-0 animate-pulse-ring rounded-full border border-cyan" />
      <span className="absolute inset-0 animate-pulse-ring rounded-full border border-magenta [animation-delay:0.41s]" />
    </span>
  );
}

export function Button({
  variant = "primary",
  pulse,
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, styles[variant], className)} {...rest}>
      <PulseRing show={pulse} />
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  pulse,
  className,
  children,
  href,
  external,
}: CommonProps & { href: string; external?: boolean }) {
  const cls = cn(base, styles[variant], className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        <PulseRing show={pulse} />
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      <PulseRing show={pulse} />
      {children}
    </Link>
  );
}
