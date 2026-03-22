/**
 * Weighted random selection from an array of items.
 * Each item must have a `probability` property (weight).
 * Returns a randomly selected item based on weights.
 *
 * @param {Array} items - Array of objects with `probability` field
 * @returns {Object} The selected item
 */
function weightedRandom(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.probability, 0);
  let random = Math.random() * totalWeight;

  for (const item of items) {
    random -= item.probability;
    if (random <= 0) return item;
  }

  // Fallback to last item (handles floating point edge cases)
  return items[items.length - 1];
}

module.exports = weightedRandom;
