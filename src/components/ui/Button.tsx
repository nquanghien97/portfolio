import { cn } from '@/lib/utils';
import NextLink from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: React.ReactNode;
}

const variants = {
  primary: 'bg-accent text-primary font-bold hover:shadow-glow hover:scale-105',
  secondary: 'bg-primary text-white font-bold hover:bg-primary-light',
  outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-primary font-bold',
  ghost: 'text-white/80 hover:bg-white/10 hover:text-white',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-lg uppercase tracking-wider transition-all duration-300 cursor-pointer',
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <NextLink href={href} className={classes}>
        {children}
      </NextLink>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
