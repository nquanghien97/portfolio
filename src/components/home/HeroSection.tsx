'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useEffect, useRef, useState, useMemo } from 'react';
import { ArrowRight, ChevronDown, Cpu, Zap } from 'lucide-react';

export function HeroSection() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const isVi = locale === 'vi';
  const sectionRef = useRef<HTMLElement>(null);

  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  // Typewriter words
  const words = useMemo(() => isVi
    ? ['Hiệu năng cao', 'Tích hợp AI', 'Giao diện Đẹp']
    : ['High Performance', 'AI Integration', 'Premium Design'], [isVi]);

  // Adjust state during render to prevent index/length mismatch when locale changes
  const [prevLocale, setPrevLocale] = useState(locale);
  if (locale !== prevLocale) {
    setPrevLocale(locale);
    setIndex(0);
    setSubIndex(0);
    setReverse(false);
  }

  const currentWord = words[index] || '';
  if (subIndex > currentWord.length + 1) {
    setSubIndex(currentWord.length + 1);
  }

  useEffect(() => {
    const word = words[index] || '';
    const isAtEnd = subIndex === word.length + 1 && !reverse;
    const isAtStart = subIndex === 0 && reverse;
    const delay = isAtEnd ? 1500 : (reverse ? 75 : 150);

    const timeout = setTimeout(() => {
      if (isAtEnd) {
        setReverse(true);
      } else if (isAtStart) {
        setReverse(false);
        setIndex((prev) => (prev + 1) % words.length);
      } else {
        setSubIndex((prev) => prev + (reverse ? -1 : 1));
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [subIndex, reverse, index, words]);

  const currentText = currentWord.substring(0, subIndex);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const elements = section.querySelectorAll('.hero-animate');
    elements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('animate-fade-in-up');
        (el as HTMLElement).style.opacity = '1';
      }, 200 + i * 150);
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 lg:py-0"
    >
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(125,211,252,0.12),transparent_70%)]" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Main Grid Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Column: Copywriting & Stats */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Availability Badge */}
          <div className="hero-animate opacity-0 inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-white text-[10px] font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>{isVi ? 'Đang nhận dự án mới' : 'Available for freelance & full-time'}</span>
          </div>

          {/* Typewriter Title */}
          <h1 className="hero-animate opacity-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase leading-[1.1] tracking-tight drop-shadow-lg mb-6">
            {isVi ? 'Kiến tạo website' : 'Crafting custom'}{' '}
            <span className="bg-linear-to-r from-sky-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent block min-h-10 sm:min-h-12.5 md:min-h-15 lg:min-h-17.5">
              {currentText}
            </span>
          </h1>

          {/* Subtitle Description */}
          <p className="hero-animate opacity-0 text-sm sm:text-base font-medium text-white/80 leading-relaxed max-w-xl mb-8">
            {t('description')}
          </p>

          {/* Call to Actions */}
          <div className="hero-animate opacity-0 flex flex-wrap gap-4 mb-12">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:shadow-glow hover:scale-105 transition-all duration-300"
            >
              {t('cta_contact')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300"
            >
              {t('cta_explore')}
            </Link>
          </div>

          {/* Quick Metrics Statistics */}
          <div className="hero-animate opacity-0 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/10 pt-8 w-full">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">3+</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 leading-snug">
                {isVi ? 'Năm kinh nghiệm' : 'Years Experience'}
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">20+</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 leading-snug">
                {isVi ? 'Dự án thành công' : 'Completed Projects'}
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">99%</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 leading-snug">
                {isVi ? 'Hài lòng' : 'Client Satisfaction'}
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">15+</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 leading-snug">
                {isVi ? 'Công nghệ' : 'Tech Stacks'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code IDE Terminal & Floating Badges */}
        <div className="lg:col-span-5 relative w-full flex items-center justify-center hero-animate opacity-0 px-4 sm:px-6 lg:px-0">
          {/* Mock Code Console */}
          <div className="w-full bg-primary-dark/90 border border-primary-light rounded-2xl shadow-2xl overflow-hidden font-mono text-[10px] sm:text-xs leading-relaxed text-slate-300 relative select-none">
            {/* Tab Bar */}
            <div className="bg-primary px-4 py-3 flex items-center justify-between border-b border-primary-light">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 block" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 block" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 block" />
              </div>
              <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">nevin.config.ts</span>
              <div className="w-10" />
            </div>

            {/* Editor Area */}
            <div className="p-4 sm:p-5 flex gap-4">
              {/* Line Numbers */}
              <div className="text-slate-500 text-right select-none w-5 flex flex-col gap-0.5">
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
                <div>5</div>
                <div>6</div>
                <div>7</div>
                <div>8</div>
                <div>9</div>
                <div>10</div>
              </div>
              {/* Code Snippet */}
              <div className="flex-1 flex flex-col gap-0.5">
                <div><span className="text-[#E879F9]">const</span> <span className="text-[#38BDF8]">developer</span> = &#123;</div>
                <div>&nbsp;&nbsp;<span className="text-[#818CF8]">name</span>: <span className="text-[#34D399]">&apos;Nevin&apos;</span>,</div>
                <div>&nbsp;&nbsp;<span className="text-[#818CF8]">role</span>: <span className="text-[#34D399]">&apos;Full-Stack Developer&apos;</span>,</div>
                <div>&nbsp;&nbsp;<span className="text-[#818CF8]">focus</span>: [<span className="text-[#34D399]">&apos;AI Integration&apos;</span>, <span className="text-[#34D399]">&apos;Web Apps&apos;</span>],</div>
                <div>&nbsp;&nbsp;<span className="text-[#818CF8]">techStack</span>: &#123;</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#818CF8]">frontend</span>: [<span className="text-[#34D399]">&apos;Next.js&apos;</span>, <span className="text-[#34D399]">&apos;TypeScript&apos;</span>],</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#818CF8]">backend</span>: [<span className="text-[#34D399]">&apos;Node.js&apos;</span>, <span className="text-[#34D399]">&apos;PostgreSQL&apos;</span>]</div>
                <div>&nbsp;&nbsp;&#125;,</div>
                <div>&nbsp;&nbsp;<span className="text-[#818CF8]">passion</span>: <span className="text-[#34D399]">&apos;Crafting premium &amp; fast web apps&apos;</span></div>
                <div>&#125;;</div>
              </div>
            </div>
          </div>

          {/* Floating Glassmorphism Badge 1: AI */}
          <div className="absolute -top-6 -right-2 sm:-right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 shadow-xl flex items-center gap-3 animate-float select-none" style={{ animationDelay: '1s' }}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">AI Integration</div>
              <div className="text-[10px] sm:text-xs font-bold text-white mt-1">Gemini &amp; Ollama</div>
            </div>
          </div>

          {/* Floating Glassmorphism Badge 2: Performance */}
          <div className="absolute -bottom-6 -left-2 sm:-left-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 shadow-xl flex items-center gap-3 animate-float select-none" style={{ animationDelay: '2.5s' }}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-300">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Performance</div>
              <div className="text-[10px] sm:text-xs font-bold text-white mt-1">Next.js &amp; Tailwind</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-gentle">
        <ChevronDown className="w-5 h-5 text-white/40" />
      </div>
    </section>
  );
}
