import React, { useState } from 'react';
import { InstitutionStockItem, ScreenId } from '../types';
import { calculateDaysLeft, formatReadableDate } from '../data/demoData';

interface InstitutionDashboardScreenProps {
  stockItems: InstitutionStockItem[];
  blockedAttemptsCount: number;
  itemsCheckedCount: number;
  onMarkServed: (id: string) => { blocked: boolean; message: string };
  onDiscardItem: (id: string) => void;
  onDiscardAllExpired: () => void;
  onNavigate: (screen: ScreenId) => void;
}

const STATION_WALKIN_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDaq_oXEbe45mYkF3qnuEhD_bRopOcwgl1Vj8R2fH4WrwpnaddWDLWWDr0FRGafdPoQjQUM0qFjIRXZAHlRwTXIMYSZjdDT_vkWWR56dsLUZgRz1qOPF2eSxw_oxzuVmbefn8-vbVFx-UzBBwQSCcI49jFDJx6FBA-RirSIYx5n4TVZdbU4buKbocYZIiVzMaZXFKYooGIKcc1t4YkfkpUaDOd8_0CxWM3hie_aqvL3cgRNnsmRQYyt';

const STATION_LINE2_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAZFZ_KVsF9zo564f5VuPcBlrAYNha3Q0Gm-Tkig4GeT-7czoEKVR8TtFL4Sz2uwWBxu1Eb0ArO_weim2Dn_pzY5E8iz6i9j2S_uPfAqmeYucEgm_PqjdnYj6_ePaq_hY6BgfHI5ZjQ0CoxtqeU7CMf5T9spmcow6Q_QXzJ8_j9mWJmUwk_axDHCshjJPhcweilbJoOOCsErz-W7TZh86-sNji8HznfNBjlxUhuTBSx0wQeEWWLgzor';

export const InstitutionDashboardScreen: React.FC<InstitutionDashboardScreenProps> = ({
  stockItems,
  blockedAttemptsCount,
  itemsCheckedCount,
  onMarkServed,
  onDiscardItem,
  onDiscardAllExpired,
  onNavigate,
}) => {
  const [blockedErrorItemId, setBlockedErrorItemId] = useState<string | null>(null);
  const [blockedErrorMessage, setBlockedErrorMessage] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const itemsWithDays = stockItems.map((item) => ({
    ...item,
    daysLeft: calculateDaysLeft(item.expiryDate),
  }));

  const expiredActiveItems = itemsWithDays.filter(
    (i) => i.daysLeft < 0 && i.status !== 'Discarded'
  );

  const totalEvaluated = Math.max(1, itemsCheckedCount);
  const activeExpiredPenalty = expiredActiveItems.length * 4;
  const blockedPenalty = blockedAttemptsCount * 2;
  const complianceScore = Math.max(
    60,
    Math.min(100, Math.round(100 - activeExpiredPenalty - blockedPenalty))
  );

  const activeBatchesCount = itemsWithDays.filter((i) => i.status !== 'Discarded').length;

  const handleMarkServedClick = (item: InstitutionStockItem & { daysLeft: number }) => {
    const result = onMarkServed(item.id);
    if (result.blocked) {
      setBlockedErrorItemId(item.id);
      setBlockedErrorMessage('This item is expired and cannot be served.');
    } else {
      setBlockedErrorItemId(null);
      setBlockedErrorMessage(null);
      setToastMsg(`"${item.name}" marked as Served for dining shift.`);
      setTimeout(() => setToastMsg(null), 2800);
    }
  };

  const handleDiscardClick = (item: InstitutionStockItem) => {
    onDiscardItem(item.id);
    if (blockedErrorItemId === item.id) {
      setBlockedErrorItemId(null);
      setBlockedErrorMessage(null);
    }
    setToastMsg(`"${item.name}" discarded and logged in HACCP waste record.`);
    setTimeout(() => setToastMsg(null), 2800);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto py-space-sm gap-space-md">
      {/* Top Location & Action Header */}
      <section className="flex flex-col gap-space-xs mt-1">
        <div className="flex items-start justify-between gap-space-sm">
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
              Campus Dining &amp; Kitchen
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight truncate">
              Central Dining Hall
            </h2>
            <div className="flex items-center gap-1 text-on-surface-variant mt-0.5">
              <span className="material-symbols-outlined text-sm text-secondary">storefront</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                West Wing Kitchen • Walk-in A &amp; Dry Storage
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('add-stock')}
            className="shrink-0 flex items-center gap-1.5 bg-primary text-on-primary px-space-md py-2.5 rounded-full shadow-[0_4px_12px_rgba(0,69,13,0.25)] hover:bg-primary-container active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span className="font-label-md text-label-md">Add Stock</span>
          </button>
        </div>
      </section>

      {/* Immediate Action Warning Card */}
      {expiredActiveItems.length > 0 && (
        <section className="bg-error-container text-on-error-container rounded-2xl p-space-md shadow-sm transition-all duration-300">
          <div className="flex items-start gap-space-sm">
            <div className="w-8 h-8 rounded-full bg-error text-on-error flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-lg">warning</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-error uppercase font-extrabold tracking-wider">
                  Immediate Action Required
                </span>
                <span className="font-label-sm text-label-sm bg-error/15 text-error px-2 py-0.5 rounded-full">
                  Critical
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface font-semibold mt-1 leading-snug">
                {expiredActiveItems.length} Expired{' '}
                {expiredActiveItems.length === 1 ? 'batch' : 'batches'} flagged in Walk-in Cooler A
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                {expiredActiveItems.map((i) => i.name).join(' & ')} past HACCP serving threshold.
              </p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    onDiscardAllExpired();
                    setBlockedErrorItemId(null);
                    setBlockedErrorMessage(null);
                    setToastMsg('Expired batches discarded and logged in HACCP report.');
                    setTimeout(() => setToastMsg(null), 2800);
                  }}
                  className="bg-error text-on-error px-3.5 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">delete_forever</span>
                  Discard {expiredActiveItems.length > 1 ? 'Both' : 'Batch'} Now
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('compliance-report')}
                  className="bg-surface-container-lowest text-on-surface px-3 py-1.5 rounded-full font-label-md text-label-md hover:bg-surface-container active:scale-95 transition-all"
                >
                  Review HACCP Log
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blocked Serving Attempt Red Error Alert */}
      {blockedErrorMessage && (
        <div
          role="alert"
          className="bg-error text-on-error rounded-2xl p-4 shadow-lg flex items-center justify-between gap-3 animate-pulse"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-2xl shrink-0">block</span>
            <div>
              <p className="font-label-lg text-label-lg font-extrabold">{blockedErrorMessage}</p>
              <p className="font-body-sm text-body-sm text-on-error/90 mt-0.5">
                HACCP Safety Lock active • Blocked attempts logged: {blockedAttemptsCount}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setBlockedErrorMessage(null);
              setBlockedErrorItemId(null);
            }}
            className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-on-error shrink-0"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}

      {/* Quick Kitchen Pulse Metrics */}
      <section className="grid grid-cols-2 gap-space-sm">
        <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-[0_4px_16px_-2px_rgba(27,94,32,0.06),0_2px_6px_-1px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Active Portions
            </span>
            <span className="material-symbols-outlined text-secondary text-lg">inventory_2</span>
          </div>
          <div className="mt-2">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
              1,480
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">
              Ready for dinner shift
            </span>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-[0_4px_16px_-2px_rgba(27,94,32,0.06),0_2px_6px_-1px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Discards Prevented
            </span>
            <span className="material-symbols-outlined text-primary text-lg">eco</span>
          </div>
          <div className="mt-2">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-secondary font-bold">
              86.4%
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">
              380 Lbs rescued this wk
            </span>
          </div>
        </div>
      </section>

      {/* Stock Inventory Table Section */}
      <section className="bg-surface-container-lowest rounded-2xl p-space-md shadow-[0_4px_16px_-2px_rgba(27,94,32,0.06),0_2px_6px_-1px_rgba(0,0,0,0.04)] flex flex-col gap-space-sm">
        {/* Header & Filter */}
        <div className="flex items-center justify-between pb-1">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Kitchen Inventory
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Real-time status of commercial kitchen batches
            </p>
          </div>
          <span className="font-label-sm text-label-sm bg-secondary-container/40 text-on-secondary-container px-2.5 py-1 rounded-full font-semibold">
            {activeBatchesCount} Active Batches
          </span>
        </div>

        {/* Table Column Headers */}
        <div className="grid grid-cols-12 gap-2 px-3 py-1.5 bg-surface-container-low rounded-xl text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
          <div className="col-span-4 truncate">Item</div>
          <div className="col-span-2 truncate">Qty</div>
          <div className="col-span-3 truncate">Expiry Date</div>
          <div className="col-span-3 text-right truncate">Status</div>
        </div>

        {/* Row-based Inventory List */}
        <div className="flex flex-col gap-2.5">
          {itemsWithDays.map((item) => {
            const isExpired = item.daysLeft < 0;
            const isServed = item.status === 'Served';
            const isDiscarded = item.status === 'Discarded';
            const isThisBlocked = blockedErrorItemId === item.id;

            return (
              <div
                key={item.id}
                className={`group rounded-2xl p-3 flex flex-col gap-2 transition-all ${
                  isThisBlocked
                    ? 'bg-error-container/70 ring-2 ring-error'
                    : isDiscarded
                    ? 'bg-surface-container-low/40 opacity-65'
                    : 'bg-surface-container-low/60 hover:bg-surface-container-low'
                }`}
              >
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4 min-w-0">
                    <span
                      className={`font-label-md text-label-md text-on-surface block truncate ${
                        isDiscarded ? 'line-through' : ''
                      }`}
                    >
                      {item.name}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant truncate block">
                      {item.storageLocation} • {item.lotNumber}
                    </span>
                    <span className="font-label-sm text-[10px] text-on-surface-variant/80 truncate block">
                      By: {item.addedBy.split('—')[0].trim()}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span className="font-label-md text-label-md text-on-surface block">
                      {item.quantity} {item.unit}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {item.category}
                    </span>
                  </div>

                  <div className="col-span-3">
                    <span
                      className={`font-label-sm text-label-sm block ${
                        isExpired ? 'text-error font-bold' : 'text-on-surface'
                      }`}
                    >
                      {formatReadableDate(item.expiryDate)}
                    </span>
                    <span
                      className={`font-body-sm text-body-sm ${
                        isExpired
                          ? 'text-error/80 font-semibold'
                          : item.daysLeft <= 3
                          ? 'text-tertiary font-semibold'
                          : 'text-secondary'
                      }`}
                    >
                      {isExpired
                        ? 'Expired'
                        : item.daysLeft === 0
                        ? 'Expires today'
                        : `${item.daysLeft} days left`}
                    </span>
                  </div>

                  <div className="col-span-3 flex justify-end">
                    {isDiscarded ? (
                      <span className="inline-flex items-center gap-1 bg-error-container text-error px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                        Discarded
                      </span>
                    ) : isServed ? (
                      <span className="inline-flex items-center gap-1 bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                        Served
                      </span>
                    ) : isExpired ? (
                      <span className="inline-flex items-center gap-1 bg-error-container text-error px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                        Expired
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-secondary-container/40 text-secondary px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                        In Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Inline Red Error if user tried to Mark Served on this expired item */}
                {isThisBlocked && (
                  <div className="px-3 py-2 rounded-xl bg-error text-on-error font-label-sm text-label-sm font-bold flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">error</span>
                      <span>This item is expired and cannot be served.</span>
                    </div>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full shrink-0">
                      Blocked #{blockedAttemptsCount}
                    </span>
                  </div>
                )}

                {/* Actions Row */}
                <div className="flex items-center justify-between pt-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant italic">
                    Rec: {formatReadableDate(item.dateReceived)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isDiscarded}
                      onClick={() => handleMarkServedClick(item)}
                      className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm flex items-center gap-1 active:scale-95 transition-all disabled:opacity-40 ${
                        isServed
                          ? 'bg-primary text-on-primary font-bold'
                          : isExpired
                          ? 'bg-surface-container-highest text-on-surface-variant hover:bg-error-container hover:text-error'
                          : 'bg-secondary-container/50 text-on-secondary-container hover:bg-secondary hover:text-on-secondary font-bold'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isServed ? 'done_all' : 'restaurant'}
                      </span>
                      {isServed ? 'Served' : 'Mark Served'}
                    </button>

                    <button
                      type="button"
                      disabled={isDiscarded}
                      onClick={() => handleDiscardClick(item)}
                      className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm flex items-center gap-1 active:scale-95 transition-all disabled:opacity-40 ${
                        isExpired && !isDiscarded
                          ? 'bg-error text-on-error shadow-xs font-bold'
                          : 'bg-error/10 text-error hover:bg-error hover:text-on-error'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      {isDiscarded ? 'Discarded' : 'Discard'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Commercial Kitchen Operations Gallery Carousel */}
      <section className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-headline-sm text-on-surface">
            Kitchen Stations
          </span>
          <span className="font-label-sm text-label-sm text-secondary font-semibold">
            Active Stations (3)
          </span>
        </div>
        <div className="grid grid-cols-2 gap-space-sm">
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="h-28 w-full bg-surface-container-high relative overflow-hidden">
              <img
                alt="Cold Storage & Dairy Station"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                src={STATION_WALKIN_IMG}
              />
              <span className="absolute bottom-2 left-2 bg-inverse-surface/80 text-inverse-on-surface px-2 py-0.5 rounded-full font-label-sm text-label-sm backdrop-blur-sm">
                Walk-in A
              </span>
            </div>
            <div className="p-2.5">
              <span className="font-label-md text-label-md text-on-surface block">
                Cold Storage &amp; Dairy
              </span>
              <span className="font-body-sm text-body-sm text-secondary">3.4°C • Nominal</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="h-28 w-full bg-surface-container-high relative overflow-hidden">
              <img
                alt="Main Steam Service Line"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                src={STATION_LINE2_IMG}
              />
              <span className="absolute bottom-2 left-2 bg-inverse-surface/80 text-inverse-on-surface px-2 py-0.5 rounded-full font-label-sm text-label-sm backdrop-blur-sm">
                Line #2
              </span>
            </div>
            <div className="p-2.5">
              <span className="font-label-md text-label-md text-on-surface block">
                Main Steam Service
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Dinner service setup
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Food Safety & Compliance Report Card */}
      <section
        onClick={() => onNavigate('compliance-report')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onNavigate('compliance-report');
        }}
        className="bg-surface-container-lowest rounded-2xl p-space-md shadow-[0_4px_16px_-2px_rgba(27,94,32,0.06),0_2px_6px_-1px_rgba(0,0,0,0.04)] flex flex-col gap-3.5 cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all"
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Compliance Report
              </h3>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Tap to view full audit metrics &amp; weekly chart
            </p>
          </div>
          <span className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full font-label-sm text-label-sm font-extrabold">
            <span className="material-symbols-outlined text-sm">check</span>
            Audit Passing
          </span>
        </div>

        {/* Progress Bar & Score */}
        <div className="flex flex-col gap-1.5 bg-surface-container-low p-3.5 rounded-xl">
          <div className="flex items-baseline justify-between">
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              Overall Compliance
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-extrabold">
                {complianceScore}%
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">/ 100%</span>
            </div>
          </div>
          <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-700"
              style={{ width: `${complianceScore}%` }}
            ></div>
          </div>
          <span className="font-body-sm text-body-sm text-secondary font-medium mt-0.5">
            {totalEvaluated} items checked • {blockedAttemptsCount} blocked from serving
          </span>
        </div>

        {/* Metric Breakdown Pills */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-surface-container-low/70 rounded-xl p-2.5 text-center flex flex-col items-center">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Items Checked
            </span>
            <span className="font-headline-sm text-headline-sm text-primary font-bold mt-1">
              {totalEvaluated}
            </span>
            <span className="font-label-sm text-label-sm text-secondary mt-0.5">Logged</span>
          </div>
          <div className="bg-surface-container-low/70 rounded-xl p-2.5 text-center flex flex-col items-center">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Expired Found
            </span>
            <span className="font-headline-sm text-headline-sm text-error font-bold mt-1">
              {itemsWithDays.filter((i) => i.daysLeft < 0).length}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
              Flagged
            </span>
          </div>
          <div className="bg-surface-container-low/70 rounded-xl p-2.5 text-center flex flex-col items-center">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Blocked Serve
            </span>
            <span className="font-headline-sm text-headline-sm text-error font-bold mt-1">
              {blockedAttemptsCount}
            </span>
            <span className="font-label-sm text-label-sm text-secondary mt-0.5">Prevented</span>
          </div>
        </div>

        {/* Open Compliance Report Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('compliance-report');
          }}
          className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-full font-label-md text-label-md active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-lg">analytics</span>
          <span>Open Full Compliance Report &amp; Weekly Chart</span>
        </button>
      </section>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-20 left-4 right-4 max-w-sm mx-auto bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-2xl shadow-xl z-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-container text-xl">
              check_circle
            </span>
            <span className="font-body-md text-body-md">{toastMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="text-inverse-on-surface/60 hover:text-inverse-on-surface"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      )}
    </div>
  );
};
