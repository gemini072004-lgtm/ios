// In-memory deals cache for pre-warming the deals/earn page.
// NOT stored in localStorage — must be cleared explicitly on sign-out.

export let dealsCache = null;
export let dealsCacheTimestamp = null;
export const DEALS_CACHE_TTL = 1000 * 60 * 5; // 5 minutes

/**
 * Store pre-warmed deals data.
 * @param {{ cashbackOffers: any[], shoppingOffers: any[], surveyOffers: any[] }} data
 */
export function setDealsCache(data) {
  dealsCache = { ...data };
  dealsCacheTimestamp = Date.now();
}

/**
 * Read the cached deals data (returns null if not set).
 */
export function getDealsCache() {
  return dealsCache;
}

/**
 * Clear the in-memory deals cache (called on sign-out).
 */
export function clearDealsCache() {
  dealsCache = null;
  dealsCacheTimestamp = null;
}
