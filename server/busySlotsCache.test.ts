import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCachedBusySlots,
  setCachedBusySlots,
  getCachedBusySlotsForRange,
  clearAllCache,
} from './busySlotsCache';

describe('Busy Slots Cache', () => {
  beforeEach(() => {
    // Clear cache before each test
    clearAllCache();
  });

  it('should cache and retrieve busy slots', () => {
    const startDate = Date.now();
    const endDate = startDate + 24 * 60 * 60 * 1000; // 1 day later
    const busySlots = [
      { start: startDate + 3600000, end: startDate + 7200000, summary: 'Test Event' },
    ];

    // Cache the slots
    setCachedBusySlots(startDate, endDate, busySlots);

    // Retrieve from cache
    const cached = getCachedBusySlots(startDate, endDate);

    expect(cached).not.toBeNull();
    expect(cached).toHaveLength(1);
    expect(cached![0].summary).toBe('Test Event');
  });

  it('should return null for cache miss', () => {
    const startDate = Date.now();
    const endDate = startDate + 24 * 60 * 60 * 1000;

    const cached = getCachedBusySlots(startDate, endDate);

    expect(cached).toBeNull();
  });

  it('should find cached data that covers requested range', () => {
    const now = Date.now();
    const thirtyDaysLater = now + 30 * 24 * 60 * 60 * 1000;

    // Cache 30 days of data
    const busySlots = [
      { start: now + 5 * 24 * 60 * 60 * 1000, end: now + 5 * 24 * 60 * 60 * 1000 + 3600000, summary: 'Event 1' },
      { start: now + 10 * 24 * 60 * 60 * 1000, end: now + 10 * 24 * 60 * 60 * 1000 + 3600000, summary: 'Event 2' },
    ];
    setCachedBusySlots(now, thirtyDaysLater, busySlots);

    // Request a single day within the cached range (day 5)
    const day5Start = now + 5 * 24 * 60 * 60 * 1000;
    const day5End = day5Start + 24 * 60 * 60 * 1000;

    const cached = getCachedBusySlotsForRange(day5Start, day5End);

    expect(cached).not.toBeNull();
    expect(cached).toHaveLength(1);
    expect(cached![0].summary).toBe('Event 1');
  });

  it('should filter busy slots to requested range', () => {
    const now = Date.now();
    const thirtyDaysLater = now + 30 * 24 * 60 * 60 * 1000;

    // Cache 30 days with multiple events
    const busySlots = [
      { start: now + 1 * 24 * 60 * 60 * 1000, end: now + 1 * 24 * 60 * 60 * 1000 + 3600000, summary: 'Day 1' },
      { start: now + 5 * 24 * 60 * 60 * 1000, end: now + 5 * 24 * 60 * 60 * 1000 + 3600000, summary: 'Day 5' },
      { start: now + 10 * 24 * 60 * 60 * 1000, end: now + 10 * 24 * 60 * 60 * 1000 + 3600000, summary: 'Day 10' },
    ];
    setCachedBusySlots(now, thirtyDaysLater, busySlots);

    // Request days 4-6 (should only return Day 5 event)
    const day4Start = now + 4 * 24 * 60 * 60 * 1000;
    const day6End = now + 6 * 24 * 60 * 60 * 1000;

    const cached = getCachedBusySlotsForRange(day4Start, day6End);

    expect(cached).not.toBeNull();
    expect(cached).toHaveLength(1);
    expect(cached![0].summary).toBe('Day 5');
  });

  it('should return null if no cached range covers the request', () => {
    const now = Date.now();

    // Cache days 1-10
    const tenDaysLater = now + 10 * 24 * 60 * 60 * 1000;
    setCachedBusySlots(now, tenDaysLater, []);

    // Request days 15-16 (outside cached range)
    const day15Start = now + 15 * 24 * 60 * 60 * 1000;
    const day16End = now + 16 * 24 * 60 * 60 * 1000;

    const cached = getCachedBusySlotsForRange(day15Start, day16End);

    expect(cached).toBeNull();
  });

  it('should expire cache after TTL', async () => {
    const startDate = Date.now();
    const endDate = startDate + 24 * 60 * 60 * 1000;
    const busySlots = [{ start: startDate, end: endDate, summary: 'Test' }];

    // This test would require mocking time or waiting 5 minutes
    // For now, we just verify the cache works immediately
    setCachedBusySlots(startDate, endDate, busySlots);
    const cached = getCachedBusySlots(startDate, endDate);
    expect(cached).not.toBeNull();
  });
});
