'use client';

export function MarqueeBanner() {
  const text = 'STRATEGY · DESIGN · DEVELOPMENT · DEPLOY · OPTIMIZE · ';

  return (
    <section className="w-full border-y border-accent/10 bg-surface-dim py-5 overflow-hidden">
      <div className="marquee-track">
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="text-primary/80 font-semibold text-lg sm:text-xl tracking-[0.2em] uppercase whitespace-nowrap px-4"
          >
            {text}
          </span>
        ))}
      </div>
    </section>
  );
}
