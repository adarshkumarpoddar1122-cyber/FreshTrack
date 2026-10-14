import React, { useState } from 'react';
import { HouseholdItem, ScreenId } from '../types';
import { calculateDaysLeft, getOffsetDateString } from '../data/demoData';

interface AddFoodScreenProps {
  onAddFood: (item: Omit<HouseholdItem, 'id' | 'addedAt'>) => void;
  onNavigate: (screen: ScreenId) => void;
}

const STORAGE_BASKET_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA49kyvMC9e9lfWNqVxzDAkPLTt1WBravc_h5p9Qy2hvZREdAynMfdyfL0pNDOxFJdOuzTFNa_GUyL7q3c7vXi58YW0nf29xxpt-QsZk6lQef_tLFSOQj9zeHf4p6MwBRcs7WUREZ7_MGujdku3vP6VcUOtUvRXtC_ByZmyySsI_UzQqjlw5V0aONdaepiQ-oBSu386GvQvr0koT5ClmquhCGVGHHOwgrpEdQmqC2Hq86S1G6Xz7_3q';

export const AddFoodScreen: React.FC<AddFoodScreenProps> = ({ onAddFood, onNavigate }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState<'Fridge' | 'Pantry' | 'Freezer'>('Fridge');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>('pack(s)');
  const [expiryDate, setExpiryDate] = useState<string>(getOffsetDateString(5));
  const [reminder, setReminder] = useState<boolean>(true);
  const [icon, setIcon] = useState<string>('🥗');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const daysLeft = calculateDaysLeft(expiryDate);

  const handleShortcutDays = (days: number) => {
    setExpiryDate(getOffsetDateString(days));
  };

  const handleQuickPick = (
    pickName: string,
    loc: 'Fridge' | 'Pantry' | 'Freezer',
    days: number,
    emoji: string
  ) => {
    setName(pickName);
    setLocation(loc);
    setExpiryDate(getOffsetDateString(days));
    setIcon(emoji);
  };

  const handleScanReceipt = () => {
    const samples = [
      { name: 'Organic Ripe Bananas', loc: 'Pantry' as const, days: 2, unit: 'bunch(es)', emoji: '🍌' },
      { name: 'Fresh Blueberries', loc: 'Fridge' as const, days: 3, unit: 'pack(s)', emoji: '🫐' },
      { name: 'Free-Range Eggs', loc: 'Fridge' as const, days: 10, unit: 'pack(s)', emoji: '🥚' },
      { name: 'Cherry Tomatoes', loc: 'Fridge' as const, days: 3, unit: 'pack(s)', emoji: '🍅' },
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    setName(picked.name);
    setLocation(picked.loc);
    setExpiryDate(getOffsetDateString(picked.days));
    setUnit(picked.unit);
    setIcon(picked.emoji);
    setToastMsg(`Scanned "${picked.name}" — shelf life estimated!`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    onAddFood({
      name: trimmed,
      quantity: Math.max(1, quantity),
      unit,
      expiryDate,
      location:
        location === 'Fridge'
          ? 'Fridge Shelf'
          : location === 'Pantry'
          ? 'Pantry Shelf'
          : 'Freezer Drawer',
      icon,
    });

    setToastMsg(`${trimmed} added to FreshTrack!`);
    setTimeout(() => {
      onNavigate('household-dashboard');
    }, 650);
  };

  const renderDaysBadge = () => {
    if (daysLeft === 0) {
      return (
        <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold">
          Expires Today
        </span>
      );
    }
    if (daysLeft < 0) {
      return (
        <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-bold">
          {Math.abs(daysLeft)}d Overdue
        </span>
      );
    }
    if (daysLeft <= 3) {
      return (
        <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold">
          In {daysLeft} {daysLeft === 1 ? 'Day' : 'Days'} (Use Soon)
        </span>
      );
    }
    return (
      <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold">
        In {daysLeft} Days
      </span>
    );
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pb-safe">
      <div className="flex flex-col gap-space-sm pt-space-xs pb-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container">
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                eco
              </span>
            </span>
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-bold">
              FreshTrack Quick Log
            </span>
          </div>
          <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-xs text-primary">verified</span> Smart
            Auto-Track
          </span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Log your grocery items to track freshness automatically and reduce waste.
        </p>
      </div>

      {/* Scan Receipt or Barcode Button */}
      <div className="mb-space-md">
        <button
          type="button"
          onClick={handleScanReceipt}
          className="w-full flex items-center justify-between p-space-md bg-secondary-container/30 hover:bg-secondary-container/45 active:scale-[0.99] transition-all rounded-3xl shadow-sm text-left group"
        >
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <span className="material-symbols-outlined text-2xl">document_scanner</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-1.5">
                Scan Receipt or Barcode
                <span className="material-symbols-outlined text-base text-secondary">bolt</span>
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Auto-fill name, store date &amp; estimate shelf life
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-2xl group-hover:translate-x-0.5 transition-transform shrink-0">
            arrow_forward
          </span>
        </button>
      </div>

      <div className="flex items-center gap-space-sm my-space-xs mb-space-md">
        <div className="h-0.5 flex-1 bg-surface-container-highest rounded-full"></div>
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest px-1">
          or manual entry
        </span>
        <div className="h-0.5 flex-1 bg-surface-container-highest rounded-full"></div>
      </div>

      <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
        <div className="p-space-md rounded-3xl bg-surface-container-lowest shadow-[0_4px_20px_-2px_rgba(27,94,32,0.06),0_2px_8px_-1px_rgba(0,0,0,0.04)] flex flex-col gap-space-md">
          {/* Food Name */}
          <div className="flex flex-col gap-space-xs">
            <label
              className="font-label-lg text-label-lg text-on-surface flex items-center justify-between"
              htmlFor="food-name"
            >
              <span>
                Food Name <span className="text-error">*</span>
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">
                e.g. Organic, brand name
              </span>
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-space-md text-on-surface-variant text-xl">
                shopping_cart
              </span>
              <input
                id="food-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Fresh Strawberries, Whole Milk"
                className="w-full pl-11 pr-space-md py-3 bg-surface-container-low rounded-2xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            {/* Quick Picks */}
            <div className="flex flex-wrap gap-1.5 pt-space-xs items-center">
              <span className="font-label-sm text-label-sm text-on-surface-variant mr-1">
                Quick Picks:
              </span>
              <button
                type="button"
                onClick={() => handleQuickPick('Organic Baby Spinach', 'Fridge', 2, '🥬')}
                className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-secondary-container active:scale-95 transition-all"
              >
                🥬 Greens
              </button>
              <button
                type="button"
                onClick={() => handleQuickPick('Whole Milk', 'Fridge', 7, '🥛')}
                className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-secondary-container active:scale-95 transition-all"
              >
                🥛 Dairy
              </button>
              <button
                type="button"
                onClick={() => handleQuickPick('Sourdough Bread', 'Pantry', 3, '🍞')}
                className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-secondary-container active:scale-95 transition-all"
              >
                🍞 Bread
              </button>
              <button
                type="button"
                onClick={() => handleQuickPick('Sweet Strawberries', 'Fridge', 2, '🍓')}
                className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-secondary-container active:scale-95 transition-all"
              >
                🍓 Berries
              </button>
              <button
                type="button"
                onClick={() => handleQuickPick('Ripe Avocados', 'Pantry', 1, '🥑')}
                className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-secondary-container active:scale-95 transition-all"
              >
                🥑 Avocados
              </button>
            </div>
          </div>

          {/* Storage Location */}
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-lg text-label-lg text-on-surface">Storage Location</span>
            <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-1.5 rounded-2xl">
              {(['Fridge', 'Pantry', 'Freezer'] as const).map((loc) => {
                const isActive = location === loc;
                const locIcon =
                  loc === 'Fridge' ? 'kitchen' : loc === 'Pantry' ? 'shelves' : 'ac_unit';
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(loc)}
                    className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl transition-all ${
                      isActive
                        ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-2xl"
                      style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      {locIcon}
                    </span>
                    <span className="font-label-sm text-label-sm mt-1">{loc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Amount + Estimated Expiry */}
          <div className="grid grid-cols-1 gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-lg text-label-lg text-on-surface">
                Quantity &amp; Amount
              </label>
              <div className="flex items-center bg-surface-container-low rounded-2xl p-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-lowest text-on-surface active:scale-90 transition-transform shadow-xs"
                >
                  <span className="material-symbols-outlined text-lg">remove</span>
                </button>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value || '1', 10)))}
                  className="w-14 text-center bg-transparent font-headline-sm text-headline-sm text-on-surface focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-lowest text-on-surface active:scale-90 transition-transform shadow-xs"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="flex-1 ml-2 bg-transparent py-2 px-2 font-label-md text-label-md text-on-surface focus:outline-none cursor-pointer text-right"
                >
                  <option value="pack(s)">pack(s)</option>
                  <option value="item(s)">item(s)</option>
                  <option value="jug / bottle">jug / bottle</option>
                  <option value="lbs">lbs</option>
                  <option value="kg">kg</option>
                  <option value="bunch(es)">bunch(es)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-space-xs">
              <label className="font-label-lg text-label-lg text-on-surface flex items-center justify-between">
                <span>Estimated Expiry</span>
                {renderDaysBadge()}
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-md text-on-surface-variant text-xl">
                  event
                </span>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full pl-11 pr-space-md py-3 bg-surface-container-low rounded-2xl font-body-md text-body-md text-on-surface focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>
          </div>

          {/* Expiration Shortcuts */}
          <div className="flex flex-col gap-space-xs pt-space-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Expiration Shortcuts
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '+2 Days', days: 2 },
                { label: '+4 Days', days: 4 },
                { label: '+1 Week', days: 7 },
                { label: '+2 Weeks', days: 14 },
              ].map((sc) => {
                const isSelected = daysLeft === sc.days;
                return (
                  <button
                    key={sc.label}
                    type="button"
                    onClick={() => handleShortcutDays(sc.days)}
                    className={`py-2 px-1 text-center rounded-xl font-label-md text-label-md active:scale-95 transition-all ${
                      isSelected
                        ? 'bg-secondary-container text-on-secondary-container font-bold'
                        : 'bg-surface-container text-on-surface hover:bg-secondary-container/50'
                    }`}
                  >
                    {sc.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Gentle Freshness Reminder */}
        <div className="p-space-md rounded-2xl bg-surface-container-low/70 flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm min-w-0">
            <span className="material-symbols-outlined text-secondary text-2xl flex-shrink-0">
              notifications_active
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-on-surface truncate">
                Gentle Freshness Reminder
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                Notify 24 hours before prime expiration
              </span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              checked={reminder}
              onChange={(e) => setReminder(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-primary after:border-surface-variant after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Smart Storage Tip Card */}
        <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex items-center gap-space-md">
          <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-container">
            <img
              alt="Fresh vegetables in market basket"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              src={STORAGE_BASKET_IMG}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-md text-label-md text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">tips_and_updates</span> Smart
              Storage Tip
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">
              Store greens with a clean dry cloth or paper towel to gently wick away moisture and
              double freshness.
            </p>
          </div>
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="flex flex-col gap-space-sm pt-space-xs pb-space-lg">
          <button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg rounded-full flex items-center justify-center gap-space-xs shadow-[0_8px_20px_-4px_rgba(27,94,32,0.35)] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-xl">check_circle</span>
            <span>Save Item to FreshTrack</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('household-dashboard')}
            className="w-full py-2.5 text-on-surface-variant hover:text-on-surface font-label-md text-label-md text-center transition-colors"
          >
            Cancel &amp; Return
          </button>
        </div>
      </form>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-20 left-4 right-4 max-w-sm mx-auto p-4 bg-primary text-on-primary rounded-2xl shadow-xl flex items-center justify-between z-50">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary-fixed text-2xl">
              check_circle
            </span>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-primary">FreshTrack</span>
              <span className="font-body-sm text-body-sm text-inverse-primary">{toastMsg}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
