import React, { useState } from 'react';
import { HouseholdItem, ScreenId } from '../types';
import { calculateDaysLeft } from '../data/demoData';

interface HouseholdDashboardScreenProps {
  items: HouseholdItem[];
  mealsSaved: number;
  onDeleteItem: (id: string) => void;
  onUseItem: (id: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

type FilterMode = 'all' | 'use-soon' | 'expired';

export const HouseholdDashboardScreen: React.FC<HouseholdDashboardScreenProps> = ({
  items,
  mealsSaved,
  onDeleteItem,
  onUseItem,
  onNavigate,
}) => {
  const [filter, setFilter] = useState<FilterMode>('all');

  const itemsWithDays = items.map((item) => ({
    ...item,
    daysLeft: calculateDaysLeft(item.expiryDate),
  }));

  const freshCount = itemsWithDays.filter((i) => i.daysLeft > 3).length;
  const useSoonCount = itemsWithDays.filter((i) => i.daysLeft >= 0 && i.daysLeft <= 3).length;
  const expiredCount = itemsWithDays.filter((i) => i.daysLeft < 0).length;

  const totalCount = itemsWithDays.length;
  const freshPercent =
    totalCount > 0 ? Math.round(((freshCount + useSoonCount) / totalCount) * 100) : 100;

  const filteredItems = itemsWithDays
    .filter((item) => {
      if (filter === 'use-soon') return item.daysLeft >= 0 && item.daysLeft <= 3;
      if (filter === 'expired') return item.daysLeft < 0;
      return true;
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const getDaysLabel = (days: number) => {
    if (days < 0) {
      const abs = Math.abs(days);
      return abs === 1 ? 'Expired yesterday' : `Expired ${abs} days ago`;
    }
    if (days === 0) return 'Expires today';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto py-space-sm gap-space-md">
      {/* Top Household Summary Card */}
      <section className="bg-surface-container-lowest rounded-3xl p-space-md shadow-[0_4px_20px_-2px_rgba(27,94,32,0.06),0_2px_6px_-1px_rgba(0,0,0,0.04)] flex flex-col gap-space-md">
        <div className="flex items-start justify-between gap-space-sm">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                Household Kitchen
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Updated just now
              </span>
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-extrabold mt-2">
              {totalCount} {totalCount === 1 ? 'item' : 'items'} tracked
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              You saved {mealsSaved} meals from waste this week.
            </p>
          </div>

          {/* Circular Freshness Gauge */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke="#e5e3d6"
                strokeWidth="6"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke="#1b5e20"
                strokeWidth="6"
                strokeDasharray={`${(freshPercent / 100) * 163.36} 163.36`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-primary">
              <span className="material-symbols-outlined text-base leading-none">eco</span>
              <span className="font-label-sm text-label-sm font-extrabold leading-tight">
                {freshPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* 3 Filter Capsules */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 ${
              filter === 'all'
                ? 'bg-surface-container-high ring-2 ring-primary/30'
                : 'bg-surface-container hover:bg-surface-container-high'
            }`}
          >
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="font-headline-sm text-headline-sm text-primary font-extrabold">
                {totalCount}
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
              All Items
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('use-soon')}
            className={`py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 ${
              filter === 'use-soon'
                ? 'bg-tertiary-fixed ring-2 ring-tertiary'
                : 'bg-tertiary-fixed/80 hover:bg-tertiary-fixed'
            }`}
          >
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              <span className="font-headline-sm text-headline-sm text-on-tertiary-fixed font-extrabold">
                {useSoonCount}
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-on-tertiary-fixed-variant mt-0.5">
              Use Soon
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('expired')}
            className={`py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 ${
              filter === 'expired'
                ? 'bg-error-container ring-2 ring-error'
                : 'bg-error-container/60 hover:bg-error-container'
            }`}
          >
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-error"></span>
              <span className="font-headline-sm text-headline-sm text-error font-extrabold">
                {expiredCount}
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-error mt-0.5">Expired</span>
          </button>
        </div>
      </section>

      {/* Add Food Item Banner Button */}
      <button
        type="button"
        onClick={() => onNavigate('add-food')}
        className="group w-full p-4 rounded-2xl bg-primary hover:bg-primary-container text-on-primary shadow-[0_6px_20px_-4px_rgba(0,69,13,0.3)] flex items-center justify-between transition-all active:scale-[0.98] text-left"
      >
        <div className="flex items-center gap-space-md">
          <div className="w-11 h-11 rounded-full bg-secondary-container text-on-secondary-fixed flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl font-bold">add</span>
          </div>
          <div>
            <span className="font-headline-sm text-headline-sm font-bold text-on-primary block">
              Add Food Item
            </span>
            <span className="font-body-sm text-body-sm text-on-primary/80 block mt-0.5">
              Snap receipt, scan barcode, or quick-type
            </span>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-on-primary group-hover:translate-x-0.5 transition-transform shrink-0">
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </div>
      </button>

      {/* Pantry & Fridge List Header */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-xl">kitchen</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Pantry &amp; Fridge
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
          Showing:{' '}
          {filter === 'all' ? 'All Items' : filter === 'use-soon' ? 'Use Soon' : 'Expired'} (
          {filteredItems.length})
        </span>
      </div>

      {/* Items List */}
      <div className="flex flex-col gap-2.5">
        {filteredItems.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl p-6 text-center shadow-sm">
            <span className="material-symbols-outlined text-3xl text-secondary mb-1">
              inventory_2
            </span>
            <p className="font-headline-sm text-headline-sm text-on-surface">
              No items in this view
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Tap &ldquo;Add Food Item&rdquo; above to log groceries into FreshTrack.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isExpired = item.daysLeft < 0;
            const isUseSoon = item.daysLeft >= 0 && item.daysLeft <= 3;

            // Color coding requirement:
            // green (more than 3 days), yellow (1 to 3 days / today), red (expired)
            const daysTextColor = isExpired
              ? 'text-error font-bold'
              : isUseSoon
              ? 'text-tertiary font-bold'
              : 'text-secondary font-bold';

            const iconBgClass = isExpired
              ? 'bg-error-container/60 text-error'
              : isUseSoon
              ? 'bg-tertiary-fixed/70 text-tertiary'
              : 'bg-secondary-container/40 text-primary';

            return (
              <div
                key={item.id}
                className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-[0_4px_16px_-2px_rgba(27,94,32,0.06),0_2px_6px_-1px_rgba(0,0,0,0.03)] flex items-center justify-between gap-2.5 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-xl ${iconBgClass}`}
                  >
                    {isExpired ? (
                      <span className="material-symbols-outlined text-2xl text-error">warning</span>
                    ) : (
                      <span>{item.icon || '🥗'}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                        {item.name}
                      </h4>
                      <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">
                        ({item.quantity} {item.unit})
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 flex items-center gap-1 flex-wrap">
                      <span>{item.location}</span>
                      <span>•</span>
                      <span className={daysTextColor}>{getDaysLabel(item.daysLeft)}</span>
                    </p>
                  </div>
                </div>

                {/* Status Pill + Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {isExpired ? (
                    <span className="px-2.5 py-1 rounded-full bg-error-container text-error font-label-sm text-label-sm font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">error</span>
                      Expired
                    </span>
                  ) : isUseSoon ? (
                    <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">timelapse</span>
                      Use Soon
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">check_circle</span>
                      Fresh
                    </span>
                  )}

                  {!isExpired && (
                    <button
                      type="button"
                      onClick={() => onUseItem(item.id)}
                      title="Mark Consumed / Used"
                      className="w-9 h-9 rounded-full bg-surface-container hover:bg-secondary-container text-primary flex items-center justify-center active:scale-90 transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">check</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onDeleteItem(item.id)}
                    title="Delete Item"
                    className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all ${
                      isExpired
                        ? 'bg-error-container/50 hover:bg-error text-error hover:text-on-error'
                        : 'bg-surface-container hover:bg-error-container text-on-surface-variant hover:text-error'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Meal Rescue Idea Card */}
      <div className="mt-1 p-3.5 rounded-2xl bg-secondary-container/45 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">soup_kitchen</span>
          </div>
          <div className="min-w-0">
            <span className="font-label-lg text-label-lg text-primary font-bold block">
              Meal Rescue Idea
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
              {useSoonCount > 0
                ? `Rescue ${useSoonCount} item(s) expiring within 3 days with AI recipes`
                : 'Get smart zero-waste recipes & storage tips'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('use-soon')}
          className="px-3.5 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center gap-1 shrink-0 active:scale-95 transition-transform"
        >
          <span>View</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
