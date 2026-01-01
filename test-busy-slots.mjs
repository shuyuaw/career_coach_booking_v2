import { getBusySlots } from './server/caldav.ts';

const startDate = new Date('2026-01-02T00:00:00+08:00');
const endDate = new Date('2026-01-02T23:59:59+08:00');

console.log('Testing getBusySlots for Jan 2, 2026');
console.log(`Start: ${startDate.toISOString()}`);
console.log(`End: ${endDate.toISOString()}`);
console.log();

const slots = await getBusySlots(startDate.getTime(), endDate.getTime());

console.log(`Found ${slots.length} busy slots:`);
slots.forEach((slot, idx) => {
  const start = new Date(slot.start);
  const end = new Date(slot.end);
  console.log(`${idx + 1}. ${start.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })} - ${end.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
});
