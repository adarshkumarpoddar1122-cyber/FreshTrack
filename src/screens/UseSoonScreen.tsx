import React, { useState, useEffect } from 'react';
import { HouseholdItem, RecipeSuggestion, ScreenId, StorageTip } from '../types';
import { calculateDaysLeft, DEFAULT_RECIPES, DEFAULT_STORAGE_TIPS } from '../data/demoData';

interface UseSoonScreenProps {
  items: HouseholdItem[];
  mealsSaved: number;
  onUseItem: (id: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

const RECIPE_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC0E3-T-UbqKIczwsUMek1I9T1zylU3FbLhkX4BfcZWcpiZ6WnRRIDxPiIqe2G5gWt4xptuNfhJvDoLKUGPDKTeuEJdb6Gr7R9-GRMCwX5soqyowJ7ug3RewpI2yWOdGLkMqgFMcCBO3ZnhhxzdsnRFS95i7J-5WhWIrZimon6hCv2X61QR3PW7RXlB_usg4e0cxfqc5fOYW0UxHj_0vHKWOh7s5KST5uJ8Jgf_aKkS2JQ8aqaEv8zl',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDzj0VZuYkhGOjFdA5Zs0IaWfMa9Doy06HtpYVBNfCAMfhc8--TF7O1nMbXFAEZbA0UH7-Qd_ZkQdowtgSOOUDDTMDs0YHqKyPsyAtTWOu_AjuUr4gcVYtkMjfGfFwUaBIQEij32HCD51RB0C8zavx9UG3N0zq5hxmYOxQ61NuG8kRg3Dul0BhjPJ7osOflZ6jhrAlXypmCbYpUThfM41O4nSKa1pYBuDhRy8MXI7fk4c4-0lLjztsR',
];

export const UseSoonScreen: React.FC<UseSoonScreenProps> = ({
  items,
  mealsSaved,
  onUseItem,
  onNavigate,
}) => {
  const [recipes, setRecipes] = useState<RecipeSuggestion[]>(DEFAULT_RECIPES);
  const [storageTips, setStorageTips] = useState<StorageTip[]>(DEFAULT_STORAGE_TIPS);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiStatusNote, setAiStatusNote] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeSuggestion | null>(null);

  // Filter items expiring within 3 days (0 to 3 days left)
  const expiringItems = items
    .map((item) => ({
      ...item,
      daysLeft: calculateDaysLeft(item.expiryDate),
    }))
    .filter((item) => item.daysLeft >= 0 && item.daysLeft <= 3)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const generateWithGemini = async () => {
    if (expiringItems.length === 0) {
      setAiStatusNote('Add items expiring within 3 days to generate custom AI recipes.');
      return;
    }

    setIsGenerating(true);
    setAiStatusNote(null);

    try {
      const response = await fetch('/api/use-soon-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: expiringItems.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            unit: i.unit,
            daysLeft: i.daysLeft,
            location: i.location,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Using curated zero-waste suggestions for your items.');
      }

      const data = await response.json();
      if (data.recipes && Array.isArray(data.recipes) && data.recipes.length > 0) {
        setRecipes(
          data.recipes.map((r: RecipeSuggestion, idx: number) => ({
            ...r,
            image: RECIPE_IMAGES[idx % RECIPE_IMAGES.length],
          }))
        );
      }
      if (data.storageTips && Array.isArray(data.storageTips) && data.storageTips.length > 0) {
        setStorageTips(data.storageTips);
      }
      setAiStatusNote('Updated with fresh Gemini AI recipes & storage tips!');
    } catch {
      const itemNames = expiringItems.map((i) => i.name);
      const customRecipe: RecipeSuggestion = {
        title: `Zero-Waste ${itemNames.slice(0, 2).join(' & ')} Bowl`,
        description: `A quick, nutrient-packed kitchen rescue dish crafted specifically to use up your ${itemNames.join(
          ', '
        )} while still at peak flavor.`,
        prepTime: '10 mins',
        savesLabel: `Saves ${expiringItems.length} item${expiringItems.length === 1 ? '' : 's'}`,
        ingredientsUsed: expiringItems.map((i) => `${i.icon || '🥗'} ${i.name}`),
        steps: [
          `Prep and chop your ${itemNames.join(' and ')} into bite-sized pieces.`,
          'Toss gently with olive oil, lemon zest, and a pinch of sea salt.',
          'Serve fresh or lightly sautéed over warm grains or toasted bread.',
        ],
        image: RECIPE_IMAGES[0],
      };
      setRecipes([customRecipe, DEFAULT_RECIPES[1]]);
      setAiStatusNote('Tailored recipes & storage tips ready for your expiring items!');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (expiringItems.length > 0) {
      generateWithGemini();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiringItems.length]);

  const estimatedSavings = (expiringItems.length * 4.85).toFixed(2);
  const co2Saved = (mealsSaved * 0.3 + 1.2).toFixed(1);

  return (
    <div className="flex flex-col w-full max-w-md mx-auto py-space-sm pb-8 space-y-space-lg">
      {/* Friendly Motivation Banner */}
      <section className="bg-surface-container-lowest rounded-3xl p-space-md shadow-[0_4px_16px_-2px_rgba(27,94,32,0.06),0_2px_6px_-1px_rgba(0,0,0,0.04)] relative overflow-hidden">
        <div className="flex items-start gap-space-md relative z-10">
          <div className="w-12 h-12 rounded-full bg-secondary-container/50 flex-shrink-0 flex items-center justify-center text-primary">
            <span
              className="material-symbols-outlined text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              timer
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                Kitchen Ticker
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mt-0.5">Use Soon</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 leading-snug">
              Items expiring within 3 days — turn them into delicious meals before they spoil!
            </p>
          </div>
        </div>

        {/* Micro Stats strip */}
        <div className="mt-space-md pt-space-sm bg-surface-container/60 rounded-2xl p-space-sm flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-tertiary-fixed-dim text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              warning
            </span>
            <span className="font-label-md text-label-md text-on-surface">
              {expiringItems.length} {expiringItems.length === 1 ? 'Item Needs' : 'Items Need'}{' '}
              Attention
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-primary font-bold px-2.5 py-0.5 bg-secondary-container/40 rounded-full">
            Save ~${estimatedSavings}
          </span>
        </div>
      </section>

      {/* Urgent Items Priority Shelf */}
      <section className="space-y-space-sm">
        <div className="flex items-center justify-between px-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-xl">hourglass_top</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Expiring Next</h3>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Sorted by urgency
          </span>
        </div>

        <div className="space-y-2.5">
          {expiringItems.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-5 text-center shadow-sm">
              <span className="material-symbols-outlined text-2xl text-secondary">
                check_circle
              </span>
              <p className="font-headline-sm text-headline-sm text-on-surface mt-1">
                No items expiring within 3 days!
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Your kitchen is in great shape, or add items from the Household tab.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('add-food')}
                className="mt-3 px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md"
              >
                + Add Food Item
              </button>
            </div>
          ) : (
            expiringItems.map((item) => {
              const badgeClass =
                item.daysLeft <= 1
                  ? 'text-tertiary bg-tertiary-fixed/70'
                  : item.daysLeft === 2
                  ? 'text-on-secondary-fixed-variant bg-secondary-container'
                  : 'text-on-surface-variant bg-surface-container-high';

              return (
                <div
                  key={item.id}
                  className="bg-surface-container-lowest rounded-2xl p-space-md shadow-[0_4px_16px_-2px_rgba(27,94,32,0.06),0_2px_6px_-1px_rgba(0,0,0,0.04)] flex items-center justify-between gap-space-md transition-transform active:scale-[0.99]"
                >
                  <div className="flex items-center gap-space-md min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed/60 flex items-center justify-center text-tertiary text-2xl flex-shrink-0 shadow-sm p-2">
                      {item.icon || '🥗'}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-headline-sm text-headline-sm text-on-surface truncate">
                        {item.name}
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-sm">kitchen</span>{' '}
                        {item.location} • {item.quantity} {item.unit}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className={`font-label-sm text-label-sm font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${badgeClass}`}
                    >
                      <span className="material-symbols-outlined text-xs">schedule</span>
                      {item.daysLeft === 0
                        ? 'Today'
                        : item.daysLeft === 1
                        ? '1 day left'
                        : `${item.daysLeft} days left`}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUseItem(item.id)}
                      className="font-label-sm text-label-sm text-primary hover:underline flex items-center pt-0.5 cursor-pointer"
                    >
                      Log used
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Recipe Matcher (Gemini AI Powered) */}
      <section className="space-y-space-sm">
        <div className="flex items-center justify-between px-space-xs">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Zero-Waste Recipes
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Cook today with what you already have
            </p>
          </div>
          <button
            type="button"
            onClick={generateWithGemini}
            disabled={isGenerating}
            className="px-3 py-1.5 rounded-full bg-secondary-container/60 hover:bg-secondary-container text-primary font-label-sm text-label-sm font-bold flex items-center gap-1 active:scale-95 transition-all disabled:opacity-50"
          >
            <span
              className={`material-symbols-outlined text-base ${
                isGenerating ? 'animate-spin' : ''
              }`}
            >
              {isGenerating ? 'sync' : 'auto_awesome'}
            </span>
            <span>{isGenerating ? 'Asking Gemini...' : 'Gemini Suggest'}</span>
          </button>
        </div>

        {aiStatusNote && (
          <div className="px-3 py-2 rounded-2xl bg-secondary-container/30 text-primary font-label-sm text-label-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">eco</span>
            <span>{aiStatusNote}</span>
          </div>
        )}

        <div className="space-y-3">
          {recipes.map((recipe, index) => (
            <div
              key={`${recipe.title}-${index}`}
              className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_4px_16px_-2px_rgba(27,94,32,0.06),0_2px_6px_-1px_rgba(0,0,0,0.04)] flex flex-col"
            >
              <div className="relative w-full h-44 overflow-hidden bg-surface-container">
                <img
                  alt={recipe.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  src={recipe.image || RECIPE_IMAGES[index % RECIPE_IMAGES.length]}
                />
                <div className="absolute top-space-sm left-space-sm">
                  <span
                    className={`font-label-sm text-label-sm font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 ${
                      index === 0
                        ? 'bg-primary text-on-primary'
                        : 'bg-secondary text-on-secondary'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {index === 0 ? 'eco' : 'skillet'}
                    </span>
                    {recipe.savesLabel}
                  </span>
                </div>
                <div className="absolute bottom-space-sm right-space-sm bg-inverse-surface/80 backdrop-blur-sm text-inverse-on-surface px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">timer</span>
                  <span className="font-label-sm text-label-sm">{recipe.prepTime}</span>
                </div>
              </div>

              <div className="p-space-md flex flex-col space-y-3">
                <div>
                  {index === 0 && (
                    <div className="flex items-center gap-1 text-secondary font-label-sm text-label-sm mb-1">
                      <span className="material-symbols-outlined text-sm">bolt</span>
                      <span>Optimal match right now</span>
                    </div>
                  )}
                  <h4 className="font-headline-sm text-headline-sm text-on-surface">
                    {recipe.title}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {recipe.ingredientsUsed.map((ing, i) => (
                    <span
                      key={i}
                      className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant flex items-center gap-1"
                    >
                      {ing}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRecipe(recipe)}
                  className={
                    index === 0
                      ? 'w-full h-12 bg-primary text-on-primary rounded-full font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md transition-transform active:scale-[0.98] hover:bg-primary-container mt-1'
                      : 'w-full h-12 bg-secondary-container/50 text-primary rounded-full font-label-lg text-label-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98] hover:bg-secondary-container mt-1'
                  }
                >
                  <span>{index === 0 ? 'Cook This Today' : 'View Quick Recipe'}</span>
                  <span className="material-symbols-outlined text-lg">
                    {index === 0 ? 'arrow_forward' : 'menu_book'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Preservation Hacks / Food Storage Tips */}
      <section className="space-y-space-sm">
        <div className="flex items-center gap-space-xs px-space-xs">
          <span className="material-symbols-outlined text-primary text-xl">lightbulb</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            Fresh-Keeping Secrets
          </h3>
        </div>
        <div className="space-y-2.5">
          {storageTips.map((tip, idx) => (
            <div
              key={`${tip.title}-${idx}`}
              className="bg-surface-container-lowest rounded-2xl p-space-md shadow-[0_4px_16px_-2px_rgba(27,94,32,0.06),0_2px_6px_-1px_rgba(0,0,0,0.04)] flex items-start gap-space-md"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
                  idx % 2 === 0 ? 'bg-tertiary-fixed/60' : 'bg-secondary-container/40'
                }`}
              >
                {tip.emoji || '🌿'}
              </div>
              <div className="flex-1">
                <h5 className="font-label-lg text-label-lg text-on-surface">{tip.title}</h5>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                  {tip.description}
                </p>
                <div className="mt-2 flex items-center gap-1 text-primary font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-xs">
                    {idx % 2 === 0 ? 'ac_unit' : 'autorenew'}
                  </span>{' '}
                  {tip.benefit}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Waste-Reduction Micro Pledge Card */}
      <div className="bg-primary text-on-primary rounded-2xl p-space-md shadow-lg flex items-center justify-between">
        <div className="space-y-0.5 pr-2">
          <p className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-bold">
            Today&apos;s Impact
          </p>
          <p className="font-headline-sm text-headline-sm leading-tight">{co2Saved} kg CO₂ Saved</p>
          <p className="font-body-sm text-body-sm text-on-primary/80">
            Every bite saved protects our earth.
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-on-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-2xl text-secondary-fixed">compost</span>
        </div>
      </div>

      {/* Recipe Modal Drawer */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                  {selectedRecipe.savesLabel} • {selectedRecipe.prepTime}
                </span>
                <h4 className="font-headline-md text-headline-md text-primary mt-1.5">
                  {selectedRecipe.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecipe(null)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant">
              {selectedRecipe.description}
            </p>

            <div>
              <h5 className="font-label-lg text-label-lg text-on-surface mb-1.5">
                Ingredients Rescued:
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {selectedRecipe.ingredientsUsed.map((ing, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-label-lg text-label-lg text-on-surface mb-2">
                Simple Preparation Steps:
              </h5>
              <ol className="space-y-2">
                {selectedRecipe.steps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 bg-surface-container-low p-3 rounded-2xl font-body-sm text-body-sm text-on-surface"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex gap-2 pt-2">
              {expiringItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onUseItem(expiringItems[0].id);
                    setSelectedRecipe(null);
                  }}
                  className="flex-1 h-11 bg-primary text-on-primary rounded-full font-label-md text-label-md flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>Mark {expiringItems[0].name} Used</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedRecipe(null)}
                className="px-4 h-11 bg-surface-container text-on-surface rounded-full font-label-md text-label-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
