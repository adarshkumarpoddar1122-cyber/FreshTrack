import { HouseholdItem, InstitutionStockItem, RecipeSuggestion, StorageTip } from '../types';

export function getOffsetDateString(daysOffset: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateDaysLeft(expiryDateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const parts = expiryDateStr.split('-');
  if (parts.length !== 3) return 0;
  const exp = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  exp.setHours(0, 0, 0, 0);
  return Math.round((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatReadableDate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

export const INITIAL_HOUSEHOLD_ITEMS: HouseholdItem[] = [
  {
    id: 'hh-1',
    name: 'Strawberries',
    quantity: 1,
    unit: 'pack(s)',
    expiryDate: getOffsetDateString(1),
    location: 'Fridge Top Shelf',
    icon: '🍓',
    addedAt: getOffsetDateString(-2),
  },
  {
    id: 'hh-2',
    name: 'Ripe Avocados',
    quantity: 3,
    unit: 'item(s)',
    expiryDate: getOffsetDateString(2),
    location: 'Counter Basket',
    icon: '🥑',
    addedAt: getOffsetDateString(-2),
  },
  {
    id: 'hh-3',
    name: 'Artisan Sourdough',
    quantity: 1,
    unit: 'pack(s)',
    expiryDate: getOffsetDateString(2),
    location: 'Bread Box',
    icon: '🥐',
    addedAt: getOffsetDateString(-1),
  },
  {
    id: 'hh-4',
    name: 'Baby Spinach',
    quantity: 1,
    unit: 'pack(s)',
    expiryDate: getOffsetDateString(5),
    location: 'Crisper Drawer',
    icon: '🥬',
    addedAt: getOffsetDateString(-1),
  },
  {
    id: 'hh-5',
    name: 'Whole Milk',
    quantity: 1,
    unit: 'jug / bottle',
    expiryDate: getOffsetDateString(6),
    location: 'Fridge Door',
    icon: '🥛',
    addedAt: getOffsetDateString(-1),
  },
  {
    id: 'hh-6',
    name: 'Greek Yogurt',
    quantity: 2,
    unit: 'pack(s)',
    expiryDate: getOffsetDateString(8),
    location: 'Dairy Shelf',
    icon: '🥣',
    addedAt: getOffsetDateString(0),
  },
  {
    id: 'hh-7',
    name: 'Heavy Cream',
    quantity: 1,
    unit: 'jug / bottle',
    expiryDate: getOffsetDateString(-1),
    location: 'Fridge Door',
    icon: '⚠️',
    addedAt: getOffsetDateString(-7),
  },
];

export const INITIAL_INSTITUTION_ITEMS: InstitutionStockItem[] = [
  {
    id: 'inst-1',
    name: 'Whole Milk (Grade A)',
    category: 'Dairy',
    quantity: 12,
    unit: 'Gal',
    dateReceived: getOffsetDateString(-5),
    expiryDate: getOffsetDateString(-1),
    storageLocation: 'Walk-in Cooler',
    lotNumber: 'Lot #882',
    addedBy: 'Marcus R. — Shift Lead',
    status: 'In Stock',
    blockedCount: 1,
  },
  {
    id: 'inst-2',
    name: 'Fresh Romaine Hearts',
    category: 'Produce',
    quantity: 8,
    unit: 'Crates',
    dateReceived: getOffsetDateString(-1),
    expiryDate: getOffsetDateString(3),
    storageLocation: 'Prep Station',
    lotNumber: 'Lot #904',
    addedBy: 'Marcus R. — Shift Lead',
    status: 'In Stock',
    blockedCount: 0,
  },
  {
    id: 'inst-3',
    name: 'Cooked Brown Rice',
    category: 'Grains',
    quantity: 25,
    unit: 'Lbs',
    dateReceived: getOffsetDateString(0),
    expiryDate: getOffsetDateString(5),
    storageLocation: 'Prep Station',
    lotNumber: 'Batch 44A',
    addedBy: 'Elena V. — Sous Chef',
    status: 'Served',
    blockedCount: 0,
  },
  {
    id: 'inst-4',
    name: 'Greek Yogurt (Plain)',
    category: 'Dairy',
    quantity: 15,
    unit: 'Tubs',
    dateReceived: getOffsetDateString(0),
    expiryDate: getOffsetDateString(9),
    storageLocation: 'Walk-in Cooler',
    lotNumber: 'Tub C',
    addedBy: 'Marcus R. — Shift Lead',
    status: 'In Stock',
    blockedCount: 0,
  },
  {
    id: 'inst-5',
    name: 'Ground Turkey 93/7',
    category: 'Protein',
    quantity: 30,
    unit: 'Lbs',
    dateReceived: getOffsetDateString(-6),
    expiryDate: getOffsetDateString(-2),
    storageLocation: 'Walk-in Cooler',
    lotNumber: 'Shelf 4',
    addedBy: 'David K. — Receiving',
    status: 'In Stock',
    blockedCount: 0,
  },
];

export const DEFAULT_RECIPES: RecipeSuggestion[] = [
  {
    title: 'Quick Green Berry & Avocado Smoothie',
    description:
      'A silky, energizing blend that perfectly uses up ripe strawberries, creamy avocado, and fresh greens before they go bad.',
    prepTime: '5 mins',
    savesLabel: 'Saves 3 items',
    ingredientsUsed: ['🍓 Strawberries', '🥑 Avocados', '🥛 Whole Milk'],
    steps: [
      'Wash and hull the expiring strawberries and scoop out the ripe avocado flesh.',
      'Add strawberries, avocado, and 1 cup of milk or yogurt into a blender.',
      'Blend on high for 45 seconds until smooth and creamy. Serve chilled immediately!',
    ],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC0E3-T-UbqKIczwsUMek1I9T1zylU3FbLhkX4BfcZWcpiZ6WnRRIDxPiIqe2G5gWt4xptuNfhJvDoLKUGPDKTeuEJdb6Gr7R9-GRMCwX5soqyowJ7ug3RewpI2yWOdGLkMqgFMcCBO3ZnhhxzdsnRFS95i7J-5WhWIrZimon6hCv2X61QR3PW7RXlB_usg4e0cxfqc5fOYW0UxHj_0vHKWOh7s5KST5uJ8Jgf_aKkS2JQ8aqaEv8zl',
  },
  {
    title: 'Crispy Sourdough Avocado Tartine & Frittata',
    description:
      'Golden toasted artisan sourdough topped with smashed ripe avocado and a quick skillet herb egg frittata.',
    prepTime: '15 mins',
    savesLabel: 'Saves Sourdough & Avocado',
    ingredientsUsed: ['🥐 Sourdough', '🥑 Avocados', '🥬 Baby Spinach'],
    steps: [
      'Slice the artisan sourdough and toast in a skillet with olive oil until golden crisp.',
      'Mash the ripe avocados with a pinch of sea salt, lemon juice, and cracked pepper.',
      'Whisk eggs with baby spinach in a warm cast-iron pan for 8 minutes and serve over the toast.',
    ],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDzj0VZuYkhGOjFdA5Zs0IaWfMa9Doy06HtpYVBNfCAMfhc8--TF7O1nMbXFAEZbA0UH7-Qd_ZkQdowtgSOOUDDTMDs0YHqKyPsyAtTWOu_AjuUr4gcVYtkMjfGfFwUaBIQEij32HCD51RB0C8zavx9UG3N0zq5hxmYOxQ61NuG8kRg3Dul0BhjPJ7osOflZ6jhrAlXypmCbYpUThfM41O4nSKa1pYBuDhRy8MXI7fk4c4-0lLjztsR',
  },
];

export const DEFAULT_STORAGE_TIPS: StorageTip[] = [
  {
    emoji: '🍓',
    title: 'Keep Berries Dry & Lined',
    description:
      'Store strawberries unwashed in a paper-towel-lined container in the fridge; moisture accelerates mold growth.',
    benefit: 'Extends shelf life by 4–5 days',
  },
  {
    emoji: '🥑',
    title: 'Slow Down Ripe Avocados',
    description:
      'Once avocados yield to gentle pressure on the counter, move them into the refrigerator crisper drawer immediately.',
    benefit: 'Adds 3–4 fresh days',
  },
  {
    emoji: '🥐',
    title: 'Freeze Sliced Sourdough',
    description:
      'Slice artisan bread before it stales and freeze flat in an airtight bag to toast single slices directly from frozen.',
    benefit: 'Extends shelf life by 2 months',
  },
];
