import React, { useState } from 'react';
import { InstitutionStockItem, ScreenId } from '../types';
import { calculateDaysLeft, getOffsetDateString } from '../data/demoData';

interface AddStockScreenProps {
  onAddStock: (item: Omit<InstitutionStockItem, 'id' | 'status' | 'blockedCount'>) => void;
  onNavigate: (screen: ScreenId) => void;
}

const INTAKE_OFFICERS = [
  { name: 'Marcus R. — Shift Lead', dept: 'Dining Hall Services' },
  { name: 'Elena V. — Sous Chef', dept: 'Hot Line & Prep' },
  { name: 'David K. — Receiving Clerk', dept: 'Inventory & Cold Chain' },
];

const STORAGE_ZONES = [
  { id: 'Walk-in Cooler', temp: '34°F - 38°F', icon: 'ac_unit' },
  { id: 'Dry Pantry', temp: '65°F - 70°F', icon: 'shelves' },
  { id: 'Deep Freezer', temp: '-10°F - 0°F', icon: 'severe_cold' },
  { id: 'Prep Station', temp: 'Ambient', icon: 'countertops' },
];

export const AddStockScreen: React.FC<AddStockScreenProps> = ({ onAddStock, onNavigate }) => {
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState('Produce');
  const [quantity, setQuantity] = useState<number>(20);
  const [unit, setUnit] = useState<string>('Cases');
  const [dateReceived, setDateReceived] = useState<string>(getOffsetDateString(0));
  const [expiryDate, setExpiryDate] = useState<string>(getOffsetDateString(7));
  const [storageLocation, setStorageLocation] = useState<string>('Walk-in Cooler');
  const [officerIdx, setOfficerIdx] = useState<number>(0);
  const [customAddedBy, setCustomAddedBy] = useState<string>(INTAKE_OFFICERS[0].name);
  const [isEditingOfficer, setIsEditingOfficer] = useState<boolean>(false);

  const daysLeft = calculateDaysLeft(expiryDate);

  const handleCategorySelect = (cat: string, sampleName: string, defaultUnit: string, days: number) => {
    setCategory(cat);
    if (!foodName.trim()) {
      setFoodName(sampleName);
    }
    setUnit(defaultUnit);
    setExpiryDate(getOffsetDateString(days));
  };

  const handleSwitchOfficer = () => {
    const nextIdx = (officerIdx + 1) % INTAKE_OFFICERS.length;
    setOfficerIdx(nextIdx);
    setCustomAddedBy(INTAKE_OFFICERS[nextIdx].name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = foodName.trim();
    if (!trimmed) return;

    const randomLot = `Lot #${Math.floor(100 + Math.random() * 900)}`;

    onAddStock({
      name: trimmed,
      category,
      quantity: Math.max(1, quantity),
      unit,
      dateReceived,
      expiryDate,
      storageLocation,
      lotNumber: randomLot,
      addedBy: customAddedBy.trim() || INTAKE_OFFICERS[officerIdx].name,
    });

    onNavigate('institution-dashboard');
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto py-space-sm pb-safe gap-space-md">
      {/* Top Institutional Receiving Pill Bar */}
      <div className="bg-surface-container-low rounded-2xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="material-symbols-outlined text-primary text-xl">domain</span>
          <div className="min-w-0">
            <span className="font-label-sm text-label-sm text-on-surface-variant block">
              Institutional Receiving
            </span>
            <span className="font-label-md text-label-md text-on-surface font-bold truncate block">
              Central Dining Hall • Bulk Intake
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm font-bold flex items-center gap-1 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          Receiving Live
        </span>
      </div>

      {/* Batch Intake Mode Banner */}
      <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm flex items-center gap-3.5 relative overflow-hidden">
        <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-secondary-container/40 flex items-center justify-center">
          <img
            alt="Batch Intake Mode"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaq_oXEbe45mYkF3qnuEhD_bRopOcwgl1Vj8R2fH4WrwpnaddWDLWWDr0FRGafdPoQjQUM0qFjIRXZAHlRwTXIMYSZjdDT_vkWWR56dsLUZgRz1qOPF2eSxw_oxzuVmbefn8-vbVFx-UzBBwQSCcI49jFDJx6FBA-RirSIYx5n4TVZdbU4buKbocYZIiVzMaZXFKYooGIKcc1t4YkfkpUaDOd8_0CxWM3hie_aqvL3cgRNnsmRQYyt"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Batch Intake Mode
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Log incoming supplier delivery to ensure zero food waste
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
        {/* 1. Food Name */}
        <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="stock-food-name"
              className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-primary text-lg">restaurant</span>
              <span>Food Name</span>
            </label>
            <span className="font-label-sm text-label-sm text-error font-bold">Required</span>
          </div>

          <input
            id="stock-food-name"
            type="text"
            required
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder="e.g., Grade A Whole Milk, Russet Potatoes"
            className="w-full px-4 py-3 bg-surface-container-low rounded-2xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />

          <div className="flex flex-wrap gap-1.5">
            {[
              { label: '🥛 Dairy', cat: 'Dairy', sample: 'Grade A Whole Milk', unit: 'Gal', days: 7 },
              { label: '🥬 Produce', cat: 'Produce', sample: 'Fresh Spinach Crates', unit: 'Crates', days: 4 },
              { label: '🌾 Dry Goods', cat: 'Grains', sample: 'Organic Brown Rice', unit: 'Lbs', days: 30 },
              { label: '🍗 Protein', cat: 'Protein', sample: 'Chicken Breast Fillet', unit: 'Lbs', days: 3 },
            ].map((pill) => {
              const active = category === pill.cat;
              return (
                <button
                  key={pill.cat}
                  type="button"
                  onClick={() =>
                    handleCategorySelect(pill.cat, pill.sample, pill.unit, pill.days)
                  }
                  className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm transition-all active:scale-95 ${
                    active
                      ? 'bg-secondary-container text-on-secondary-fixed font-bold'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Quantity & Unit */}
        <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm flex flex-col gap-3">
          <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-lg">scale</span>
            <span>Quantity &amp; Unit</span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex items-center justify-between bg-surface-container-low rounded-2xl p-1.5">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-xs active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-lg">remove</span>
              </button>
              <input
                type="number"
                min={1}
                max={999}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value || '1', 10)))}
                className="w-14 text-center bg-transparent font-headline-sm text-headline-sm text-on-surface focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-xs active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>

            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="bg-surface-container-low rounded-2xl px-4 py-3 font-label-lg text-label-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Cases">Cases</option>
              <option value="Gal">Gal</option>
              <option value="Crates">Crates</option>
              <option value="Lbs">Lbs</option>
              <option value="Tubs">Tubs</option>
              <option value="kg">kg</option>
            </select>
          </div>
        </div>

        {/* 3. Date Received */}
        <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="date-received"
              className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-primary text-lg">event_available</span>
              <span>Date Received</span>
            </label>
            <button
              type="button"
              onClick={() => setDateReceived(getOffsetDateString(0))}
              className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm font-bold"
            >
              Quick: Today
            </button>
          </div>
          <input
            id="date-received"
            type="date"
            value={dateReceived}
            onChange={(e) => setDateReceived(e.target.value)}
            className="w-full px-4 py-3 bg-surface-container-low rounded-2xl font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* 4. Expiry Date */}
        <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="stock-expiry-date"
              className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-primary text-lg">hourglass_top</span>
              <span>Expiry Date</span>
            </label>
            <span
              className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold flex items-center gap-1 ${
                daysLeft < 0
                  ? 'bg-error-container text-error'
                  : daysLeft <= 3
                  ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                  : 'bg-surface-container text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-xs">eco</span>
              {daysLeft < 0 ? 'Expired Batch' : daysLeft <= 3 ? `In ${daysLeft}d` : 'Fresh Stock'}
            </span>
          </div>

          <input
            id="stock-expiry-date"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full px-4 py-3 bg-surface-container-low rounded-2xl font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <div className="flex flex-wrap gap-1.5">
            {[
              { label: '+2 Days (Prep)', days: 2 },
              { label: '+5 Days', days: 5 },
              { label: '+1 Week', days: 7 },
              { label: '+1 Month', days: 30 },
              { label: 'Expired (-1d)', days: -1 },
            ].map((sc) => (
              <button
                key={sc.label}
                type="button"
                onClick={() => setExpiryDate(getOffsetDateString(sc.days))}
                className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm transition-all active:scale-95 ${
                  daysLeft === sc.days
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Storage Location */}
        <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-lg">door_sliding</span>
              <span>Storage Location</span>
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Tap to assign zone
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {STORAGE_ZONES.map((zone) => {
              const isSelected = storageLocation === zone.id;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setStorageLocation(zone.id)}
                  className={`p-3.5 rounded-2xl text-left flex flex-col justify-between h-24 transition-all active:scale-[0.98] ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-md'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="material-symbols-outlined text-xl">{zone.icon}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-label-sm text-[10px] ${
                        isSelected
                          ? 'bg-white/20 text-on-primary'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {zone.temp}
                    </span>
                  </div>
                  <span className="font-label-md text-label-md font-bold">{zone.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Added By (Intake Officer) */}
        <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-full bg-secondary-container/50 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">badge</span>
              </div>
              <div className="min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface-variant block">
                  Added By (Intake Officer)
                </span>
                <span className="font-label-lg text-label-lg text-on-surface font-bold truncate block">
                  {customAddedBy}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant block">
                  {INTAKE_OFFICERS[officerIdx].dept}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleSwitchOfficer}
                className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center gap-1 active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">switch_account</span>
                Switch
              </button>
              <button
                type="button"
                onClick={() => setIsEditingOfficer((v) => !v)}
                className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center"
                title="Edit Officer Name"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            </div>
          </div>

          {isEditingOfficer && (
            <input
              type="text"
              value={customAddedBy}
              onChange={(e) => setCustomAddedBy(e.target.value)}
              placeholder="Enter staff name & role"
              className="w-full px-3.5 py-2 bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          )}
        </div>

        {/* FIFO Compliance Reminder */}
        <div className="bg-secondary-container/35 rounded-3xl p-space-md flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-fixed flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-lg">sync_alt</span>
          </div>
          <div>
            <span className="font-label-md text-label-md text-primary font-bold block">
              FIFO Compliance Reminder
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-snug">
              Affix batch barcode label and rotate stock behind older deliveries. First In, First
              Out ensures highest food freshness across campus kitchens.
            </p>
          </div>
        </div>

        {/* Save & Cancel */}
        <div className="flex flex-col gap-2 pt-1 pb-6">
          <button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary rounded-full font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-xl">check_circle</span>
            <span>Save Stock Entry</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('institution-dashboard')}
            className="w-full py-2.5 text-on-surface-variant hover:text-on-surface font-label-md text-label-md flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-base">close</span>
            <span>Cancel &amp; Discard Entry</span>
          </button>
        </div>
      </form>
    </div>
  );
};
