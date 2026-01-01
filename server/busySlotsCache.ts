/**
 * In-memory cache for busy slots from CalDAV calendar.
 * Reduces latency by caching calendar queries for 5 minutes.
 */

interface BusySlot {
  start: number; // Unix timestamp in milliseconds
  end: number; // Unix timestamp in milliseconds
  summary?: string;
}

interface CacheEntry {
  busySlots: BusySlot[];
  expiresAt: number; // Unix timestamp when this cache entry expires
}

// Cache storage: key is "startDate-endDate" in milliseconds
const cache = new Map<string, CacheEntry>();

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Generate cache key from date range
 */
function getCacheKey(startDate: number, endDate: number): string {
  return `${startDate}-${endDate}`;
}

/**
 * Get busy slots from cache if available and not expired
 */
export function getCachedBusySlots(
  startDate: number,
  endDate: number
): BusySlot[] | null {
  const key = getCacheKey(startDate, endDate);
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  const now = Date.now();
  if (now > entry.expiresAt) {
    // Cache expired, remove it
    cache.delete(key);
    return null;
  }

  console.log(`[Cache] HIT for range ${new Date(startDate).toISOString()} - ${new Date(endDate).toISOString()}`);
  return entry.busySlots;
}

/**
 * Store busy slots in cache with TTL
 */
export function setCachedBusySlots(
  startDate: number,
  endDate: number,
  busySlots: BusySlot[]
): void {
  const key = getCacheKey(startDate, endDate);
  const expiresAt = Date.now() + CACHE_TTL_MS;

  cache.set(key, {
    busySlots,
    expiresAt,
  });

  console.log(`[Cache] SET for range ${new Date(startDate).toISOString()} - ${new Date(endDate).toISOString()} (expires in 5 min)`);
}

/**
 * Check if a specific date range is covered by cached data
 * Returns cached busy slots that overlap with the requested range
 */
export function getCachedBusySlotsForRange(
  startDate: number,
  endDate: number
): BusySlot[] | null {
  // First try exact match
  const exactMatch = getCachedBusySlots(startDate, endDate);
  if (exactMatch) {
    return exactMatch;
  }

  // Try to find a cached entry that covers this range
  const now = Date.now();
  
  for (const [key, entry] of Array.from(cache.entries())) {
    if (now > entry.expiresAt) {
      // Skip expired entries
      cache.delete(key);
      continue;
    }

    const [cachedStart, cachedEnd] = key.split('-').map(Number);
    
    // Check if cached range fully covers requested range
    if (cachedStart <= startDate && cachedEnd >= endDate) {
      console.log(`[Cache] PARTIAL HIT - using cached range ${new Date(cachedStart).toISOString()} - ${new Date(cachedEnd).toISOString()}`);
      
      // Filter busy slots to return those that overlap with requested range
      // An event overlaps if: event.start < range.end AND event.end > range.start
      const filteredSlots = entry.busySlots.filter(
        (slot: BusySlot) => slot.start < endDate && slot.end > startDate
      );
      
      return filteredSlots;
    }
  }

  return null;
}

/**
 * Clear all expired cache entries (cleanup)
 */
export function cleanupExpiredCache(): void {
  const now = Date.now();
  let removedCount = 0;

  for (const [key, entry] of Array.from(cache.entries())) {
    if (now > entry.expiresAt) {
      cache.delete(key);
      removedCount++;
    }
  }

  if (removedCount > 0) {
    console.log(`[Cache] Cleaned up ${removedCount} expired entries`);
  }
}

/**
 * Clear all cache (for testing or manual refresh)
 */
export function clearAllCache(): void {
  const size = cache.size;
  cache.clear();
  console.log(`[Cache] Cleared all ${size} entries`);
}

// Periodic cleanup every 10 minutes
setInterval(cleanupExpiredCache, 10 * 60 * 1000);
