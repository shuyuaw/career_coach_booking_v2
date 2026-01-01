import { describe, it } from 'vitest';
import { getBusySlots } from './caldav';

describe('Diagnose Jan 2 Busy Slot Issue', () => {
  it('should show all busy slots on Jan 2, 2026', async () => {
    // Jan 2, 2026 00:00 to Jan 3, 2026 00:00 (China time UTC+8)
    const jan2Start = new Date('2026-01-02T00:00:00+08:00').getTime();
    const jan3Start = new Date('2026-01-03T00:00:00+08:00').getTime();

    console.log('\n[Diagnose] Fetching busy slots for Jan 2, 2026...');
    console.log(`[Diagnose] Start: ${new Date(jan2Start).toISOString()} (${new Date(jan2Start).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })})`);
    console.log(`[Diagnose] End: ${new Date(jan3Start).toISOString()} (${new Date(jan3Start).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })})`);

    const busySlots = await getBusySlots(jan2Start, jan3Start);

    console.log(`\n[Diagnose] Found ${busySlots.length} busy slot(s) on Jan 2:`);
    
    if (busySlots.length === 0) {
      console.log('[Diagnose] ❌ NO BUSY SLOTS FOUND - This is the problem!');
    } else {
      busySlots.forEach((slot, idx) => {
        const startLocal = new Date(slot.start).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
        const endLocal = new Date(slot.end).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
        const startUTC = new Date(slot.start).toISOString();
        const endUTC = new Date(slot.end).toISOString();
        
        console.log(`\n[Diagnose] Slot ${idx + 1}:`);
        console.log(`  Summary: ${slot.summary || 'No summary'}`);
        console.log(`  China Time: ${startLocal} - ${endLocal}`);
        console.log(`  UTC Time: ${startUTC} - ${endUTC}`);
        console.log(`  Timestamps: ${slot.start} - ${slot.end}`);
      });
    }

    // Also check a wider range
    console.log('\n[Diagnose] Checking wider range (Jan 1-3)...');
    const jan1Start = new Date('2026-01-01T00:00:00+08:00').getTime();
    const jan4Start = new Date('2026-01-04T00:00:00+08:00').getTime();
    
    const widerBusySlots = await getBusySlots(jan1Start, jan4Start);
    console.log(`[Diagnose] Found ${widerBusySlots.length} busy slot(s) in Jan 1-3 range`);
    
    widerBusySlots.forEach((slot, idx) => {
      const startLocal = new Date(slot.start).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
      console.log(`  ${idx + 1}. ${startLocal} - ${slot.summary || 'No summary'}`);
    });
  }, 30000);
});
