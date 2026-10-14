import React from 'react';
import { ScreenId } from '../types';
import { EMBLEM_URL } from '../components/Header';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  householdCount: number;
  useSoonCount: number;
  mealsSaved: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  useSoonCount,
  mealsSaved,
}) => {
  return (
    <div className="flex flex-col w-full max-w-md mx-auto py-space-sm">
      {/* Top Organic Welcome Vignette */}
      <div className="flex flex-col items-center text-center px-space-xs">
        {/* Hero Illustration Frame inspired by FreshTrack badge */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto mb-space-md flex items-center justify-center">
          {/* Ambient Glow Behind Badge */}
          <div className="absolute inset-2 rounded-full bg-secondary-container/40 blur-xl"></div>
          {/* Logo Container with Soft Surface Drop Shadow */}
          <div className="relative w-full h-full rounded-3xl p-space-xs bg-surface-container-lowest shadow-[0_12px_32px_-6px_rgba(27,94,32,0.12),0_4px_12px_rgba(0,0,0,0.03)] flex items-center justify-center overflow-hidden">
            <img
              alt="FreshTrack emblem featuring a leaf timer and farm fresh vegetables"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-2xl transition-transform duration-500 hover:scale-105"
              src={EMBLEM_URL}
            />
          </div>
          {/* Organic Micro Accent Badges */}
          <button
            type="button"
            onClick={() => onNavigate('household-dashboard')}
            className="absolute -bottom-2 -left-2 bg-surface-container-lowest text-primary rounded-full px-space-sm py-1 shadow-md flex items-center gap-1.5 animate-bounce"
            style={{ animationDuration: '3s' }}
          >
            <span
              className="material-symbols-outlined text-base text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              eco
            </span>
            <span className="font-label-sm text-label-sm font-bold text-primary">Zero Waste</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('use-soon')}
            className="absolute -top-1 -right-2 bg-secondary-container text-on-secondary-fixed rounded-full px-space-sm py-1 shadow-sm flex items-center gap-1 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span className="font-label-sm text-label-sm font-semibold">
              Fresh Alerts {useSoonCount > 0 ? `(${useSoonCount})` : ''}
            </span>
          </button>
        </div>

        {/* Core Tagline & Mission */}
        <div className="space-y-space-xs max-w-xs sm:max-w-sm mb-space-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/30 text-secondary mb-1">
            <span className="material-symbols-outlined text-sm">nest_eco_leaf</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">
              Mindful Kitchens
            </span>
          </div>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight font-extrabold leading-tight">
            Track today,
            <br />
            save tomorrow.
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed pt-1">
            Smart, effortless tracking to keep your pantry fresh, reduce kitchen waste, and save
            money every single day.
          </p>
        </div>

        {/* Selection Pathway Cards (Two Prominent Portals) */}
        <div className="w-full space-y-space-sm mb-space-lg text-left">
          {/* Primary Pathway: Household Food Tracker */}
          <button
            type="button"
            onClick={() => onNavigate('household-dashboard')}
            className="group relative flex items-center justify-between w-full p-4 rounded-2xl bg-primary text-on-primary shadow-[0_8px_24px_-4px_rgba(0,69,13,0.28)] transition-all duration-200 active:scale-[0.98] overflow-hidden text-left"
          >
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-white/5 pointer-events-none select-none">
              cottage
            </span>
            <div className="flex items-center gap-space-md relative z-10">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-fixed flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform shrink-0">
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  kitchen
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-primary">
                    Household
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container/40 text-on-primary font-label-sm text-label-sm font-semibold">
                    Personal
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-primary/80 mt-0.5">
                  Fridge, pantry shelves &amp; daily reminders
                </p>
              </div>
            </div>
            <div className="relative z-10 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-on-primary transition-transform group-hover:translate-x-1 shrink-0">
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </div>
          </button>

          {/* Secondary Pathway: School / College & Institution Tracking */}
          <button
            type="button"
            onClick={() => onNavigate('institution-dashboard')}
            className="group relative flex items-center justify-between w-full p-4 rounded-2xl bg-surface-container-lowest text-on-surface shadow-[0_4px_18px_-2px_rgba(27,94,32,0.06),0_2px_6px_-1px_rgba(0,0,0,0.03)] transition-all duration-200 active:scale-[0.98] hover:bg-surface-container-low text-left"
          >
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-full bg-surface-container-high text-primary flex items-center justify-center group-hover:bg-secondary-container/50 group-hover:text-primary transition-colors shrink-0">
                <span className="material-symbols-outlined text-2xl">school</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface">
                    School / College
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                    Bulk
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Dining halls, dorm pantries &amp; compliance
                </p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0">
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </div>
          </button>
        </div>

        {/* Impact Insight Card / Tip Pill */}
        <div className="w-full rounded-2xl p-space-md bg-secondary-container/20 text-on-surface flex items-start gap-space-sm text-left shadow-sm">
          <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-fixed flex-shrink-0 flex items-center justify-center mt-0.5">
            <span className="material-symbols-outlined text-lg font-bold">trending_up</span>
          </div>
          <div className="flex-1">
            <p className="font-label-lg text-label-lg text-primary font-bold leading-tight">
              Over 30% saved early
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-snug">
              Households using smart expiration alerts rescue up to a third of groceries before
              spoilage.
            </p>
          </div>
        </div>

        {/* Quick Micro Stats Grid (Delight & Credibility) */}
        <div className="grid grid-cols-3 gap-2 w-full mt-space-md pt-space-xs">
          <button
            type="button"
            onClick={() => onNavigate('use-soon')}
            className="p-3 rounded-2xl bg-surface-container-lowest text-center shadow-[0_2px_10px_rgba(27,94,32,0.04)] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-secondary text-xl mb-1">
              notifications_active
            </span>
            <div className="font-headline-sm text-headline-sm font-bold text-primary leading-none">
              3 Days
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant mt-1">
              Smart Alert
            </div>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('household-dashboard')}
            className="p-3 rounded-2xl bg-surface-container-lowest text-center shadow-[0_2px_10px_rgba(27,94,32,0.04)] active:scale-95 transition-transform"
          >
            <span
              className="material-symbols-outlined text-secondary text-xl mb-1"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              savings
            </span>
            <div className="font-headline-sm text-headline-sm font-bold text-primary leading-none">
              ${Math.max(42, mealsSaved * 6)}/mo
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant mt-1">
              Avg. Saved
            </div>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('compliance-report')}
            className="p-3 rounded-2xl bg-surface-container-lowest text-center shadow-[0_2px_10px_rgba(27,94,32,0.04)] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-secondary text-xl mb-1">compost</span>
            <div className="font-headline-sm text-headline-sm font-bold text-primary leading-none">
              -18kg
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant mt-1">
              CO₂ Prevented
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
