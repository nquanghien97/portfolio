'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactFormData } from '@/lib/validations';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const contactInfo = [
    { icon: Mail, label: t('info.emailLabel'), value: t('info.email') },
    { icon: Phone, label: t('info.phoneLabel'), value: t('info.phone') },
    { icon: MapPin, label: t('info.locationLabel'), value: t('info.location') },
  ];

  return (
    <>
      <section className="relative bg-primary pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(125,211,252,0.12),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          <SectionHeader
            label="Contact"
            title={t('sectionTitle')}
            description={t('sectionDescription')}
            dark
          />
        </div>
      </section>

      <section className="bg-surface py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      {t('form.name')}
                    </label>
                    <input
                      {...register('name')}
                      placeholder={t('form.namePlaceholder')}
                      className="w-full px-4 py-3 rounded-xl border border-divider bg-surface-dim text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      {t('form.email')}
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder={t('form.emailPlaceholder')}
                      className="w-full px-4 py-3 rounded-xl border border-divider bg-surface-dim text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    {t('form.subject')}
                  </label>
                  <input
                    {...register('subject')}
                    placeholder={t('form.subjectPlaceholder')}
                    className="w-full px-4 py-3 rounded-xl border border-divider bg-surface-dim text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                  />
                  {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    {t('form.message')}
                  </label>
                  <textarea
                    {...register('message')}
                    rows={6}
                    placeholder={t('form.messagePlaceholder')}
                    className="w-full px-4 py-3 rounded-xl border border-divider bg-surface-dim text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-sm resize-none"
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:shadow-glow hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('form.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t('form.submit')}
                    </>
                  )}
                </button>

                {status === 'success' && (
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('form.success')}</span>
                  </div>
                )}
                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('form.error')}</span>
                  </div>
                )}
              </form>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              {contactInfo.map((info, i) => {
                const Icon = info.icon;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-6 rounded-2xl bg-surface-dim border border-divider hover:border-accent/30 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-primary uppercase tracking-wide mb-1">
                        {info.label}
                      </h4>
                      <p className="text-text-secondary text-sm">{info.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
