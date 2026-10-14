import React, { useState, useEffect } from 'react';
import {
  AuthUser,
  BlockedAttemptLog,
  HouseholdItem,
  InstitutionStockItem,
  ScreenId,
} from './types';
import {
  calculateDaysLeft,
  getOffsetDateString,
  INITIAL_HOUSEHOLD_ITEMS,
  INITIAL_INSTITUTION_ITEMS,
} from './data/demoData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { HouseholdDashboardScreen } from './screens/HouseholdDashboardScreen';
import { AddFoodScreen } from './screens/AddFoodScreen';
import { UseSoonScreen } from './screens/UseSoonScreen';
import { InstitutionDashboardScreen } from './screens/InstitutionDashboardScreen';
import { AddStockScreen } from './screens/AddStockScreen';
import { ComplianceReportScreen } from './screens/ComplianceReportScreen';

const STORAGE_KEYS = {
  AUTH_USER: 'freshtrack_auth_user_v1',
  HOUSEHOLD_ITEMS: 'freshtrack_household_items_v1',
  INSTITUTION_ITEMS: 'freshtrack_institution_items_v1',
  MEALS_SAVED: 'freshtrack_meals_saved_v1',
  ITEMS_CHECKED: 'freshtrack_items_checked_v1',
  BLOCKED_COUNT: 'freshtrack_blocked_count_v1',
  BLOCKED_LOGS: 'freshtrack_blocked_logs_v1',
};

export function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  // Start at 'login' if user is not authenticated yet
  const [activeScreen, setActiveScreen] = useState<ScreenId>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (savedUser) return 'home';
    } catch {
      // ignore
    }
    return 'login';
  });

  const [householdItems, setHouseholdItems] = useState<HouseholdItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HOUSEHOLD_ITEMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_HOUSEHOLD_ITEMS;
  });

  const [institutionItems, setInstitutionItems] = useState<InstitutionStockItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INSTITUTION_ITEMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_INSTITUTION_ITEMS;
  });

  const [mealsSaved, setMealsSaved] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEALS_SAVED);
      return saved ? parseInt(saved, 10) : 4;
    } catch {
      return 4;
    }
  });

  const [itemsCheckedCount, setItemsCheckedCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ITEMS_CHECKED);
      return saved ? parseInt(saved, 10) : 18;
    } catch {
      return 18;
    }
  });

  const [blockedAttemptsCount, setBlockedAttemptsCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOCKED_COUNT);
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [blockedLogs, setBlockedLogs] = useState<BlockedAttemptLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOCKED_LOGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'block-init-1',
        itemId: 'inst-1',
        itemName: 'Whole Milk (Grade A)',
        timestamp: 'Today, 7:15 AM',
        storageLocation: 'Walk-in Cooler',
      },
    ];
  });

  // Save auth user state
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  // Save all app state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HOUSEHOLD_ITEMS, JSON.stringify(householdItems));
    } catch {
      // ignore
    }
  }, [householdItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INSTITUTION_ITEMS, JSON.stringify(institutionItems));
    } catch {
      // ignore
    }
  }, [institutionItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEALS_SAVED, String(mealsSaved));
    } catch {
      // ignore
    }
  }, [mealsSaved]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS_CHECKED, String(itemsCheckedCount));
    } catch {
      // ignore
    }
  }, [itemsCheckedCount]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOCKED_COUNT, String(blockedAttemptsCount));
    } catch {
      // ignore
    }
  }, [blockedAttemptsCount]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOCKED_LOGS, JSON.stringify(blockedLogs));
    } catch {
      // ignore
    }
  }, [blockedLogs]);

  const handleNavigate = (screen: ScreenId) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (user: AuthUser, redirectScreen: ScreenId = 'home') => {
    setCurrentUser(user);
    handleNavigate(redirectScreen);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    handleNavigate('login');
  };

  // Household Handlers
  const handleAddHouseholdFood = (newItem: Omit<HouseholdItem, 'id' | 'addedAt'>) => {
    const created: HouseholdItem = {
      ...newItem,
      id: `hh-${Date.now()}`,
      addedAt: getOffsetDateString(0),
    };
    setHouseholdItems((prev) => [created, ...prev]);
  };

  const handleDeleteHouseholdItem = (id: string) => {
    setHouseholdItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUseHouseholdItem = (id: string) => {
    setHouseholdItems((prev) => prev.filter((item) => item.id !== id));
    setMealsSaved((m) => m + 1);
  };

  // Institution Handlers
  const handleAddInstitutionStock = (
    newStock: Omit<InstitutionStockItem, 'id' | 'status' | 'blockedCount'>
  ) => {
    const created: InstitutionStockItem = {
      ...newStock,
      id: `inst-${Date.now()}`,
      status: 'In Stock',
      blockedCount: 0,
    };
    setInstitutionItems((prev) => [created, ...prev]);
    setItemsCheckedCount((c) => c + 1);
  };

  const handleMarkInstitutionServed = (id: string): { blocked: boolean; message: string } => {
    const target = institutionItems.find((i) => i.id === id);
    if (!target) {
      return { blocked: false, message: '' };
    }

    const daysLeft = calculateDaysLeft(target.expiryDate);
    if (daysLeft < 0) {
      // Expired! Block serving and count the attempt
      setBlockedAttemptsCount((c) => c + 1);
      setItemsCheckedCount((c) => c + 1);
      setInstitutionItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, blockedCount: (item.blockedCount || 0) + 1 } : item
        )
      );
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setBlockedLogs((prev) => [
        {
          id: `block-${Date.now()}`,
          itemId: target.id,
          itemName: target.name,
          timestamp: `Today, ${timeStr}`,
          storageLocation: target.storageLocation,
        },
        ...prev,
      ]);
      return {
        blocked: true,
        message: 'This item is expired and cannot be served.',
      };
    }

    setInstitutionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Served' } : item))
    );
    setItemsCheckedCount((c) => c + 1);
    return {
      blocked: false,
      message: 'Marked as Served',
    };
  };

  const handleDiscardInstitutionItem = (id: string) => {
    setInstitutionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Discarded' } : item))
    );
    setItemsCheckedCount((c) => c + 1);
  };

  const handleDiscardAllExpiredInstitution = () => {
    setInstitutionItems((prev) =>
      prev.map((item) => {
        const d = calculateDaysLeft(item.expiryDate);
        if (d < 0) {
          return { ...item, status: 'Discarded' };
        }
        return item;
      })
    );
    setItemsCheckedCount((c) => c + 2);
  };

  const useSoonCount = householdItems.filter((i) => {
    const d = calculateDaysLeft(i.expiryDate);
    return d >= 0 && d <= 3;
  }).length;

  const getScreenHeaderConfig = (): {
    title: string;
    showBack?: boolean;
    onBack?: () => void;
  } => {
    switch (activeScreen) {
      case 'login':
        return { title: 'Sign In' };
      case 'home':
        return { title: 'Home' };
      case 'household-dashboard':
        return { title: 'Household Dashboard' };
      case 'add-food':
        return {
          title: 'Add Food',
          showBack: true,
          onBack: () => handleNavigate('household-dashboard'),
        };
      case 'use-soon':
        return { title: 'Use Soon' };
      case 'institution-dashboard':
        return { title: 'Institution Dashboard' };
      case 'add-stock':
        return {
          title: 'Add Stock',
          showBack: true,
          onBack: () => handleNavigate('institution-dashboard'),
        };
      case 'compliance-report':
        return {
          title: 'Compliance Report',
          showBack: true,
          onBack: () => handleNavigate('institution-dashboard'),
        };
    }
  };

  const headerConfig = getScreenHeaderConfig();

  return (
    <div className="bg-surface font-body-md text-on-surface flex flex-col min-h-screen">
      <Header
        title={headerConfig.title}
        showBack={headerConfig.showBack}
        onBack={headerConfig.onBack}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
        isLoginScreen={activeScreen === 'login'}
      />

      <main className="flex-1 flex flex-col relative w-full px-margin-mobile pt-16 pb-24 bg-surface">
        {activeScreen === 'login' && (
          <LoginScreen onLogin={handleLogin} />
        )}

        {activeScreen === 'home' && (
          <HomeScreen
            onNavigate={handleNavigate}
            householdCount={householdItems.length}
            useSoonCount={useSoonCount}
            mealsSaved={mealsSaved}
          />
        )}

        {activeScreen === 'household-dashboard' && (
          <HouseholdDashboardScreen
            items={householdItems}
            mealsSaved={mealsSaved}
            onDeleteItem={handleDeleteHouseholdItem}
            onUseItem={handleUseHouseholdItem}
            onNavigate={handleNavigate}
          />
        )}

        {activeScreen === 'add-food' && (
          <AddFoodScreen onAddFood={handleAddHouseholdFood} onNavigate={handleNavigate} />
        )}

        {activeScreen === 'use-soon' && (
          <UseSoonScreen
            items={householdItems}
            mealsSaved={mealsSaved}
            onUseItem={handleUseHouseholdItem}
            onNavigate={handleNavigate}
          />
        )}

        {activeScreen === 'institution-dashboard' && (
          <InstitutionDashboardScreen
            stockItems={institutionItems}
            blockedAttemptsCount={blockedAttemptsCount}
            itemsCheckedCount={itemsCheckedCount}
            onMarkServed={handleMarkInstitutionServed}
            onDiscardItem={handleDiscardInstitutionItem}
            onDiscardAllExpired={handleDiscardAllExpiredInstitution}
            onNavigate={handleNavigate}
          />
        )}

        {activeScreen === 'add-stock' && (
          <AddStockScreen onAddStock={handleAddInstitutionStock} onNavigate={handleNavigate} />
        )}

        {activeScreen === 'compliance-report' && (
          <ComplianceReportScreen
            stockItems={institutionItems}
            itemsCheckedCount={itemsCheckedCount}
            blockedAttemptsCount={blockedAttemptsCount}
            blockedLogs={blockedLogs}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Hide bottom navigation while on the login page */}
      {activeScreen !== 'login' && (
        <BottomNav
          activeScreen={activeScreen}
          onNavigate={handleNavigate}
          useSoonCount={useSoonCount}
        />
      )}
    </div>
  );
}

export default App;
