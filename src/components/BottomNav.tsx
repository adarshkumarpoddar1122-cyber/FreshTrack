import React from 'react';
import { ScreenId } from '../types';

interface BottomNavProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  useSoonCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeScreen,
  onNavigate,
  useSoonCount = 0,
}) => {
  const isHome = activeScreen === 'home';
  const isUseSoon = activeScreen === 'use-soon';
  const isHousehold = activeScreen === 'household-dashboard' || activeScreen === 'add-food';
  const isInstitution =
    activeScreen === 'institution-dashboard' ||
    activeScreen === 'add-stock' ||
    activeScreen === 'compliance-report';

  const activeClass =
    'flex flex-col items-center justify-center min-w-[60px] h-12 px-2.5 transition-all text-primary font-label-md bg-secondary-container/40 rounded-full relative';
  const inactiveClass =
    'flex flex-col items-center justify-center min-w-[60px] h-12 px-2.5 text-on-surface-variant transition-all hover:text-primary relative';

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50 pb-safe bg-surface/95 backdrop-blur-xl shadow-[0_-4px_20px_rgba(27,94,32,0.06)]">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-space-xs">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className={isHome ? activeClass : inactiveClass}
        >
          <span className="material-symbols-outlined text-xl">kitchen</span>
          <span className="font-label-sm text-label-sm mt-0.5">Home</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('use-soon')}
          className={isUseSoon ? activeClass : inactiveClass}
        >
          <span className="material-symbols-outlined text-xl">alarm</span>
          <span className="font-label-sm text-label-sm mt-0.5">Use Soon</span>
          {useSoonCount > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-tertiary-fixed-dim text-on-tertiary-fixed font-label-sm text-[10px] font-bold flex items-center justify-center">
              {useSoonCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() =>
            onNavigate(
              activeScreen === 'institution-dashboard' || activeScreen === 'add-stock'
                ? 'add-stock'
                : 'add-food'
            )
          }
          className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-primary text-on-primary shadow-[0_4px_12px_rgba(0,69,13,0.3)] transition-transform active:scale-95 hover:bg-primary-container"
          aria-label="Add Food or Stock"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('household-dashboard')}
          className={isHousehold ? activeClass : inactiveClass}
        >
          <span className="material-symbols-outlined text-xl">home_app_logo</span>
          <span className="font-label-sm text-label-sm mt-0.5">Household</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('institution-dashboard')}
          className={isInstitution ? activeClass : inactiveClass}
        >
          <span className="material-symbols-outlined text-xl">domain</span>
          <span className="font-label-sm text-label-sm mt-0.5">Institution</span>
        </button>
      </div>
    </nav>
  );
};
