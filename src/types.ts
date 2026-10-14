export type ScreenId =
  | 'login'
  | 'home'
  | 'household-dashboard'
  | 'add-food'
  | 'use-soon'
  | 'institution-dashboard'
  | 'add-stock'
  | 'compliance-report';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'household' | 'institution';
  title?: string;
  avatarUrl?: string;
}

export interface HouseholdItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate: string; // YYYY-MM-DD
  location: string;
  image?: string;
  icon?: string;
  addedAt: string;
}

export type StockStatus = 'In Stock' | 'Served' | 'Discarded';

export interface InstitutionStockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  dateReceived: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  storageLocation: string;
  lotNumber: string;
  addedBy: string;
  status: StockStatus;
  blockedCount?: number;
}

export interface BlockedAttemptLog {
  id: string;
  itemId: string;
  itemName: string;
  timestamp: string;
  storageLocation: string;
}

export interface RecipeSuggestion {
  title: string;
  description: string;
  prepTime: string;
  savesLabel: string;
  ingredientsUsed: string[];
  steps: string[];
  image?: string;
}

export interface StorageTip {
  emoji: string;
  title: string;
  description: string;
  benefit: string;
}
