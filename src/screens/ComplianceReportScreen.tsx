import React, { useState } from 'react';
import { BlockedAttemptLog, InstitutionStockItem, ScreenId } from '../types';
import { calculateDaysLeft, formatReadableDate } from '../data/demoData';

interface ComplianceReportScreenProps {
  stockItems: InstitutionStockItem[];
  itemsCheckedCount: number;
  blockedAttemptsCount: number;
  blockedLogs: BlockedAttemptLog[];
  onNavigate: (screen: ScreenId) => void;
}

export const ComplianceReportScreen: React.FC<ComplianceReportScreenProps> = ({
  stockItems,
  itemsCheckedCount,
  blockedAttemptsCount,
  blockedLogs,
  onNavigate,
}) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(6);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const itemsWithDays = stockItems.map((item) => ({
    ...item,
    daysLeft: calculateDaysLeft(item.expiryDate),
  }));

  const expiredItemsFound = itemsWithDays.filter((i) => i.daysLeft < 0).length;
  const expiredUndiscarded = itemsWithDays.filter(
    (i) => i.daysLeft < 0 && i.status !== 'Discarded'
  ).length;
  const servedCount = itemsWithDays.filter((i) => i.status === 'Served').length;
  const discardedCount = itemsWithDays.filter((i) => i.status === 'Discarded').length;

  const totalChecked = Math.max(stockItems.length, itemsCheckedCount);

  // Calculate compliance score from real data
  const activeExpiredPenalty = expiredUndiscarded * 4;
  const blockedPenalty = blockedAttemptsCount * 2;
  const complianceScore = Math.max(
    60,
    Math.min(100, Math.round(100 - activeExpiredPenalty - blockedPenalty))
  );

  // Build weekly chart data dynamically anchored to real data on Today (Day 7)
  const weeklyData = [
    { day: 'Mon', score: 96, checked: Math.max(3, totalChecked - 3), expired: 0, blocked: 0 },
    { day: 'Tue', score: 94, checked: Math.max(4, totalChecked - 2), expired: 1, blocked: 0 },
    { day: 'Wed', score: 98, checked: Math.max(4, totalChecked - 1), expired: 0, blocked: 0 },
    { day: 'Thu', score: 91, checked: totalChecked, expired: 1, blocked: 1 },
    { day: 'Fri', score: 95, checked: totalChecked + 1, expired: 1, blocked: 0 },
    { day: 'Sat', score: 97, checked: totalChecked, expired: 0, blocked: 0 },
    {
      day: 'Today',
      score: complianceScore,
      checked: totalChecked,
      expired: expiredItemsFound,
      blocked: blockedAttemptsCount,
    },
  ];

  const selectedDay = weeklyData[selectedDayIdx] || weeklyData[6];

  const handleExportReport = () => {
    const lines = [
      'FRESHTRACK — INSTITUTIONAL FOOD SAFETY & COMPLIANCE REPORT',
      `Generated: ${new Date().toLocaleString()}`,
      '==========================================================',
      `Overall Compliance Score: ${complianceScore}%`,
      `Total Items Checked: ${totalChecked}`,
      `Expired Items Found: ${expiredItemsFound}`,
      `Items Blocked from Serving: ${blockedAttemptsCount}`,
      `Batches Served Safely: ${servedCount}`,
      `Batches Discarded Properly: ${discardedCount}`,
      '',
      'KITCHEN INVENTORY AUDIT:',
      ...itemsWithDays.map(
        (item) =>
          `- ${item.name} (${item.quantity} ${item.unit}) | Loc: ${item.storageLocation} | Exp: ${item.expiryDate} | Status: ${item.status} | Added By: ${item.addedBy}`
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FreshTrack-Compliance-Audit-Report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setToastMsg('Official HACCP Compliance Audit Report downloaded!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto py-space-sm pb-8 gap-space-md">
      {/* Top Status Banner */}
      <section className="bg-surface-container-lowest rounded-3xl p-space-md shadow-[0_4px_16px_-2px_rgba(27,94,32,0.06),0_2px_6px_-1px_rgba(0,0,0,0.04)] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/40 text-primary font-label-sm text-label-sm font-bold">
            <span className="material-symbols-outlined text-sm">school</span>
            HIGHER ED DINING AUDIT
          </span>
          <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm text-secondary font-bold">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            Inspection Ready
          </span>
        </div>

        <div>
          <h2 className="font-headline-md text-headline-md text-primary font-extrabold">
            Campus Dining Compliance Report
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-sm text-secondary">location_on</span>
            Central Dining Hall • West Wing Kitchen
          </p>
        </div>

        {/* Overall Compliance Score Box */}
        <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="font-label-lg text-label-lg text-on-surface">
              Food Safety &amp; Waste Adherence
            </span>
            <span className="font-headline-xl-mobile text-headline-xl-mobile text-primary font-extrabold">
              {complianceScore}%
            </span>
          </div>
          <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-500"
              style={{ width: `${complianceScore}%` }}
            ></div>
          </div>
          <p className="font-label-sm text-label-sm text-secondary">
            {complianceScore}% Compliant this week (calculated live from kitchen inventory)
          </p>
        </div>
      </section>

      {/* 4 Core Real-Data Compliance Metrics Grid */}
      <section className="grid grid-cols-2 gap-2.5">
        {/* 1. Score */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              Compliance Score
            </span>
            <span className="material-symbols-outlined text-primary text-lg">verified_user</span>
          </div>
          <div className="mt-2">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-extrabold">
              {complianceScore}%
            </span>
            <span className="font-body-sm text-body-sm text-secondary block mt-0.5">
              {complianceScore >= 90 ? 'Audit Passing' : 'Needs Review'}
            </span>
          </div>
        </div>

        {/* 2. Items Checked */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              Items Checked
            </span>
            <span className="material-symbols-outlined text-secondary text-lg">fact_check</span>
          </div>
          <div className="mt-2">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-extrabold">
              {totalChecked}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">
              {servedCount} served • {discardedCount} discarded
            </span>
          </div>
        </div>

        {/* 3. Expired Items Found */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              Expired Found
            </span>
            <span className="material-symbols-outlined text-error text-lg">warning</span>
          </div>
          <div className="mt-2">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-error font-extrabold">
              {expiredItemsFound}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">
              {expiredUndiscarded} awaiting discard
            </span>
          </div>
        </div>

        {/* 4. Items Blocked from Serving */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              Blocked Serving
            </span>
            <span className="material-symbols-outlined text-error text-lg">block</span>
          </div>
          <div className="mt-2">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-error font-extrabold">
              {blockedAttemptsCount}
            </span>
            <span className="font-body-sm text-body-sm text-secondary block mt-0.5">
              HACCP safety lock
            </span>
          </div>
        </div>
      </section>

      {/* Weekly Compliance Chart Section */}
      <section className="bg-surface-container-lowest rounded-3xl p-space-md shadow-[0_4px_16px_-2px_rgba(27,94,32,0.06),0_2px_6px_-1px_rgba(0,0,0,0.04)] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Weekly Compliance Chart
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              7-day safety score &amp; batch inspection trend
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-secondary-container/40 text-primary font-label-sm text-label-sm font-bold">
            Live Sync
          </span>
        </div>

        {/* Selected Day Summary Strip */}
        <div className="bg-surface-container-low rounded-2xl p-3 flex items-center justify-between text-left">
          <div>
            <span className="font-label-sm text-label-sm text-secondary uppercase font-bold">
              {selectedDay.day} Snapshot
            </span>
            <p className="font-label-lg text-label-lg text-on-surface font-bold mt-0.5">
              {selectedDay.score}% Score • {selectedDay.checked} Checked
            </p>
          </div>
          <div className="text-right">
            <span className="font-label-sm text-label-sm text-error block">
              {selectedDay.expired} Expired Found
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant block">
              {selectedDay.blocked} Blocked Attempts
            </span>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="grid grid-cols-7 gap-2 items-end h-44 pt-4 px-1">
          {weeklyData.map((d, idx) => {
            const isSelected = idx === selectedDayIdx;
            const barHeightPercent = Math.max(25, d.score);
            return (
              <button
                key={d.day}
                type="button"
                onClick={() => setSelectedDayIdx(idx)}
                className="flex flex-col items-center justify-end h-full group focus:outline-none"
              >
                <span
                  className={`font-label-sm text-[10px] mb-1 transition-colors ${
                    isSelected
                      ? 'text-primary font-extrabold'
                      : 'text-on-surface-variant group-hover:text-on-surface'
                  }`}
                >
                  {d.score}%
                </span>
                <div className="w-full h-28 bg-surface-container-low rounded-xl flex items-end p-1 overflow-hidden">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      isSelected
                        ? 'bg-primary'
                        : d.blocked > 0
                        ? 'bg-tertiary-fixed-dim'
                        : 'bg-secondary-container group-hover:bg-secondary'
                    }`}
                    style={{ height: `${barHeightPercent}%` }}
                  ></div>
                </div>
                <span
                  className={`font-label-sm text-[11px] mt-1.5 ${
                    isSelected ? 'text-primary font-extrabold' : 'text-on-surface-variant'
                  }`}
                >
                  {d.day}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Blocked Attempts & Batch Audit Log */}
      <section className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-xl">history</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Batch &amp; Safety Block Log
            </h3>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {blockedLogs.length} Blocked Event(s)
          </span>
        </div>

        {blockedLogs.length > 0 && (
          <div className="space-y-2">
            {blockedLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-error-container/50 text-on-error-container flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="material-symbols-outlined text-error text-lg shrink-0">
                    gpp_bad
                  </span>
                  <div className="min-w-0">
                    <span className="font-label-md text-label-md text-error font-bold block truncate">
                      Blocked Serving: {log.itemName}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant block">
                      {log.storageLocation} • Expired item blocked from service
                    </span>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm text-error shrink-0">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2 pt-1">
          {itemsWithDays.map((item) => {
            const isExpired = item.daysLeft < 0;
            return (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-surface-container-low flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <span className="font-label-md text-label-md text-on-surface font-bold block truncate">
                    {item.name} ({item.quantity} {item.unit})
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant block">
                    {item.storageLocation} • Exp: {formatReadableDate(item.expiryDate)}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold shrink-0 ${
                    item.status === 'Discarded'
                      ? 'bg-error-container text-error'
                      : item.status === 'Served'
                      ? 'bg-secondary-container text-on-secondary-fixed'
                      : isExpired
                      ? 'bg-error text-on-error'
                      : 'bg-surface-container-high text-primary'
                  }`}
                >
                  {isExpired && item.status === 'In Stock' ? 'Expired' : item.status}
                </span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleExportReport}
          className="mt-2 w-full h-12 bg-primary hover:bg-primary-container text-on-primary rounded-full font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
          <span>Download Weekly Audit Report</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('institution-dashboard')}
          className="w-full py-2 text-on-surface-variant hover:text-primary font-label-md text-label-md text-center"
        >
          Back to Institution Dashboard
        </button>
      </section>

      {toastMsg && (
        <div className="fixed bottom-20 left-4 right-4 max-w-sm mx-auto bg-primary text-on-primary px-4 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary-fixed text-xl">
            check_circle
          </span>
          <span className="font-body-sm text-body-sm">{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
