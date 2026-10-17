import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateDurationMinutes } from './timeCalculator.ts';

test('calculates standard time ranges', () => {
  assert.equal(calculateDurationMinutes('10:00', '14:00'), 240);
  assert.equal(calculateDurationMinutes('10:30', '14:45'), 255);
});

test('counts an overnight range as the next day', () => {
  assert.equal(calculateDurationMinutes('23:00', '01:00'), 120);
});

test('uses the supplied dates for multi-day ranges', () => {
  assert.equal(calculateDurationMinutes('23:00', '01:00', '2026-10-17', '2026-10-18'), 120);
  assert.equal(calculateDurationMinutes('10:00', '14:00', '2026-10-17', '2026-10-19'), 3120);
});

test('rejects invalid dates, times, and incomplete date pairs', () => {
  assert.throws(() => calculateDurationMinutes('24:00', '01:00'), /valid start and end time/i);
  assert.throws(() => calculateDurationMinutes('10:00', '11:00', '2026-02-31', '2026-03-01'), /valid start and end dates/i);
  assert.throws(() => calculateDurationMinutes('10:00', '11:00', '2026-10-17'), /both dates/i);
  assert.throws(() => calculateDurationMinutes('14:00', '10:00', '2026-10-18', '2026-10-17'), /after the start/i);
});
