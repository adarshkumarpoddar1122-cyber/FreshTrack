import React, { useState } from 'react';
import { AuthUser, ScreenId } from '../types';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  onNavigate: (screen: ScreenId) => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  isLoginScreen?: boolean;
}

export const EMBLEM_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuACvelgPY6HYCq4NMgwDDdn5rM2xLbx0ANOvM3KfWQDspx7uO-rD5Hon5SjiNswcmce6pYuCQCxlJEGZ5PC_OKDbMVCwn4ngd_CqWm8ZHBjAGpdN6hB07fFKInY9QsfBdvTIuTJ0eah7oPNTayiMfAqARUJeUHnRVaSOWvpccgOn_q8MHYNAZm6O0p9z5OSvET_wlGSL8EpPtMjA-dLje97RqOsqCd0P7eAAeSp4__3xSNWPDU-A-U1j62z2jyS1Y4qxg';

export const PROFILE_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida/AEtjO1Xpx6yuHU0kuf0YPjJTx3NHY731DChLZhhHhlBFJ7S4KC0cGW4EvqK-ltnqc8inZBUr8O5Au8VfqNAcu_tF0B8Eht02nwskeaeKFwtPQx6oeHKaFuzW7ZYWr12Ed0FxQ_FlsfhN0czTpeNXeISC7NMbgNKbh6zsAIYqXD6s5HnpY-jKY02tDM32BqGQWcc1vyUnq4S71g1ld3l4bEDHkFQbJO157pmBLQW_ZdxbyolAt3I9mkR_DsuVHQZ8J8OuWc4RUsG0ewCE2Q';

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack,
  onBack,
  onNavigate,
  currentUser,
  onLogout,
  isLoginScreen,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 px-margin max-w-lg mx-auto flex items-center justify-between relative">
        <div className="flex items-center gap-space-sm min-w-0">
          {showBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-10 h-10 -ml-1 flex items-center justify-center rounded-full hover:bg-surface-container active:scale-95 text-on-surface transition-transform shrink-0"
              aria-label="Go back"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate(isLoginScreen ? 'login' : 'home')}
            className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-primary shrink-0 active:scale-95 transition-transform"
            aria-label="FreshTrack Home"
          >
            <span className="material-symbols-outlined text-2xl">eco</span>
          </button>
          <div className="flex flex-col min-w-0 text-left">
            <div className="flex items-center gap-space-xs min-w-0">
              <span className="font-headline-sm text-headline-sm text-primary leading-tight tracking-tight shrink-0">
                FreshTrack
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-normal opacity-40 shrink-0">
                /
              </span>
              <h1 className="font-headline-sm text-headline-sm text-on-surface leading-tight truncate">
                {title}
              </h1>
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant truncate">
              Track today, save tomorrow.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-space-xs shrink-0 relative">
          {isLoginScreen ? (
            <div className="w-9 h-9 rounded-full bg-secondary-container/40 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-xl">lock</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors relative"
              title="Account Menu"
            >
              <img
                alt="Profile"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover bg-secondary-container/40 border border-primary/20"
                src={currentUser?.avatarUrl || PROFILE_AVATAR_URL}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = EMBLEM_URL;
                }}
              />
              <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-secondary border border-surface"></span>
            </button>
          )}

          {/* Profile Dropdown Menu */}
          {showProfileMenu && !isLoginScreen && (
            <div
              className="absolute right-0 top-14 w-64 bg-surface-container-lowest rounded-2xl p-3 shadow-xl border border-surface-container-high/80 z-50 flex flex-col gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2.5 p-1 pb-2 border-b border-surface-container-high">
                <img
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover bg-secondary-container/40"
                  src={currentUser?.avatarUrl || PROFILE_AVATAR_URL}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = EMBLEM_URL;
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-label-md text-label-md text-on-surface font-bold truncate">
                    {currentUser?.name || 'FreshTrack User'}
                  </p>
                  <p className="font-body-sm text-[11px] text-on-surface-variant truncate">
                    {currentUser?.email || 'sarah@freshtrack.app'}
                  </p>
                  <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full bg-secondary-container/50 text-primary font-label-sm text-[10px] font-bold">
                    {currentUser?.role === 'institution' ? 'Institution Lead' : 'Household Kitchen'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  onNavigate(currentUser?.role === 'institution' ? 'household-dashboard' : 'institution-dashboard');
                }}
                className="w-full py-2 px-3 text-left font-label-md text-label-md text-on-surface hover:bg-surface-container rounded-xl flex items-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-lg text-primary">swap_horiz</span>
                <span>
                  Switch to {currentUser?.role === 'institution' ? 'Household' : 'Institution'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  onNavigate('compliance-report');
                }}
                className="w-full py-2 px-3 text-left font-label-md text-label-md text-on-surface hover:bg-surface-container rounded-xl flex items-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-lg text-primary">verified_user</span>
                <span>Compliance &amp; Safety</span>
              </button>

              <div className="pt-1 border-t border-surface-container-high">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onLogout) onLogout();
                    else onNavigate('login');
                  }}
                  className="w-full py-2 px-3 text-left font-label-md text-label-md text-error hover:bg-error-container/40 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
