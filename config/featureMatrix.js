const FEATURE_KEYS = [
  'qr_code',
  'categories',
  'menu_items',
  'orders',
  'tables',
  'billing',
  'billing_analytics',
  'waiters',
  'chefs',
  'analytics',
  'shop_settings',
  'export',
  'qr_customization',
];

const FEATURE_MATRIX = {
  free: ['qr_code', 'categories', 'menu_items', 'shop_settings', 'qr_customization'],
  basic: [...FEATURE_KEYS],
  premium: [...FEATURE_KEYS],
  enterprise: [...FEATURE_KEYS],
};

/**
 * Returns the array of enabled feature keys for a plan.
 * Returns empty array for unrecognized plans.
 */
function getDefaultFeatures(plan) {
  return FEATURE_MATRIX[plan] || [];
}

/**
 * Merges plan defaults with per-shop overrides.
 * Override true  → feature enabled regardless of plan.
 * Override false → feature disabled regardless of plan.
 * Absent key    → falls back to plan default.
 */
function resolveFeatures(plan, featureOverrides) {
  const defaults = new Set(getDefaultFeatures(plan));
  const overrides = featureOverrides instanceof Map
    ? Object.fromEntries(featureOverrides)
    : featureOverrides || {};

  for (const key of FEATURE_KEYS) {
    if (key in overrides) {
      if (overrides[key] === true) {
        defaults.add(key);
      } else if (overrides[key] === false) {
        defaults.delete(key);
      }
    }
  }

  return [...defaults];
}

function isValidFeatureKey(key) {
  return FEATURE_KEYS.includes(key);
}

function isValidPlan(plan) {
  return plan in FEATURE_MATRIX;
}

module.exports = {
  FEATURE_KEYS,
  FEATURE_MATRIX,
  getDefaultFeatures,
  resolveFeatures,
  isValidFeatureKey,
  isValidPlan,
};
