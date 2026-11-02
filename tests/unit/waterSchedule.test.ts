import { describe, expect, it } from 'vitest';
import { formatScheduleDate, normaliseWaterSchedule, scheduleLines } from '../../waterSchedule';

// Shape of GET /api/v1/water-schedule/active.
const response = {
  id: 'cmvxk711w0006gsuuydnracxy',
  activatedFrom: '2026-10-31T18:00:00.000Z',
  banglaText: 'জোন ১: সকাল ৮টা থেকে ১০টা\nজোন ২: সকাল ১০টা থেকে দুপুর ১২টা',
  englishText: 'Zone 1: 8 AM to 10 AM\r\nZone 2: 10 AM to 12 PM',
  isActive: true,
  issuedAt: '2026-11-01T08:19:25.596Z',
  issuedByName: 'John Doe',
};

describe('normaliseWaterSchedule', () => {
  it('reads the active schedule', () => {
    const schedule = normaliseWaterSchedule(response);
    expect(schedule?.id).toBe('cmvxk711w0006gsuuydnracxy');
    expect(schedule?.englishText).toBe('Zone 1: 8 AM to 10 AM\nZone 2: 10 AM to 12 PM');
    expect(schedule?.banglaText).toContain('জোন ২');
    expect(schedule?.issuedByName).toBe('John Doe');
  });

  it('also accepts the schedule inside a data wrapper', () => {
    expect(normaliseWaterSchedule({ data: response })?.englishText).toContain('Zone 1');
  });

  it('returns null when there is nothing to show', () => {
    expect(normaliseWaterSchedule(null)).toBeNull();
    expect(normaliseWaterSchedule('')).toBeNull();
    expect(normaliseWaterSchedule({})).toBeNull();
    expect(normaliseWaterSchedule({ banglaText: '  ', englishText: '' })).toBeNull();
  });

  it('ignores a date it cannot read', () => {
    expect(normaliseWaterSchedule({ ...response, activatedFrom: 'soon' })?.activatedFrom).toBeNull();
  });
});

describe('scheduleLines', () => {
  const schedule = normaliseWaterSchedule(response)!;

  it('gives one line per row in each language', () => {
    expect(scheduleLines(schedule, 'en')).toEqual({ language: 'en', lines: ['Zone 1: 8 AM to 10 AM', 'Zone 2: 10 AM to 12 PM'] });
    const bn = scheduleLines(schedule, 'bn');
    expect(bn.language).toBe('bn');
    expect(bn.lines).toHaveLength(2);
    expect(bn.lines[0]).toBe('জোন ১: সকাল ৮টা থেকে ১০টা');
  });

  it('falls back to the other language when one is empty', () => {
    const onlyEnglish = normaliseWaterSchedule({ ...response, banglaText: '' })!;
    expect(scheduleLines(onlyEnglish, 'bn').language).toBe('en');
    const onlyBangla = normaliseWaterSchedule({ ...response, englishText: '' })!;
    expect(scheduleLines(onlyBangla, 'en').language).toBe('bn');
  });
});

describe('formatScheduleDate', () => {
  it('uses Bangladesh time, so 18:00 UTC is already the next day', () => {
    expect(formatScheduleDate('2026-10-31T18:00:00.000Z', 'en')).toBe('1 November 2026');
    expect(formatScheduleDate('2026-10-31T17:59:00.000Z', 'en')).toBe('31 October 2026');
  });

  it('writes the date in Bangla digits and months', () => {
    expect(formatScheduleDate('2026-10-31T18:00:00.000Z', 'bn')).toBe('১ নভেম্বর ২০২৬');
  });

  it('returns an empty text for a missing or bad date', () => {
    expect(formatScheduleDate(null, 'en')).toBe('');
    expect(formatScheduleDate('x', 'bn')).toBe('');
  });
});
