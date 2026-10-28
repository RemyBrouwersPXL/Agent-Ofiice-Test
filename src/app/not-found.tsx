import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[80svh] flex-col items-center justify-center text-center">
      <p className="eyebrow mb-4">Error 404</p>
      <h1 className="font-display text-7xl font-black uppercase md:text-9xl">
        <span className="text-magenta neon-text">Dead</span> air.
      </h1>
      <p className="mt-6 text-muted">This track doesn&apos;t exist. Back to the floor.</p>
      <ButtonLink href="/" className="mt-10">
        Home
      </ButtonLink>
    </div>
  );
}
