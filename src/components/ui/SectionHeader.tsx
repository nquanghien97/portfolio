import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
  descriptionClassName?: string;
}

export function SectionHeader({
  label,
  title,
  description,
  align = 'left',
  dark = false,
  className,
  descriptionClassName,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        className || 'mb-6 sm:mb-8 lg:mb-16',
        align === 'center' && 'text-center flex flex-col items-center'
      )}
    >
      {label && (
        <div className="inline-flex items-center gap-1.5 mb-3 sm:mb-4 border border-accent/30 px-4 py-2 rounded-full bg-accent/5">
          <span className="text-white text-xl tracking-wide">{`///`}</span>
          <span className="font-semibold text-[11px] tracking-widest text-white uppercase">
            {label}
          </span>
        </div>
      )}
      <h2
        className={cn(
          'text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-tight',
          dark ? 'text-white' : 'text-primary'
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed max-w-2xl',
            dark ? 'text-white/70' : 'text-text-secondary',
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
