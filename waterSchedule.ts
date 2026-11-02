// Water supply schedule shown in Services. The server keeps one active schedule, written in Bangla and in English.
// Pure TypeScript with no React Native imports, so it can be tested with Vitest.

import { asRecord } from './billLogic';

export type ScheduleLanguage = 'en' | 'bn';

export type WaterSchedule = {
  id: string;
  banglaText: string;
  englishText: string;
  activatedFrom: string | null;
  issuedAt: string | null;
  issuedByName: string | null;
};

function textOf(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\r\n?/g, '\n').trim() : '';
}

// Reads the response of GET /water-schedule/active. Returns null when there is no schedule to show.
export function normaliseWaterSchedule(raw: unknown): WaterSchedule | null {
  const outer = asRecord(raw);
  const record = asRecord(outer?.waterSchedule) ?? asRecord(outer?.schedule) ?? asRecord(outer?.data) ?? outer;
  if (!record) return null;
  const banglaText = textOf(record.banglaText);
  const englishText = textOf(record.englishText);
  if (!banglaText && !englishText) return null;
  const dateOrNull = (value: unknown) => (typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? value : null);
  return {
    id: typeof record.id === 'string' ? record.id : '',
    banglaText,
    englishText,
    activatedFrom: dateOrNull(record.activatedFrom),
    issuedAt: dateOrNull(record.issuedAt),
    issuedByName: textOf(record.issuedByName) || null,
  };
}

// The text in the chosen language. If that language is empty, the other one is shown so the customer sees something.
export function scheduleLines(schedule: WaterSchedule, language: ScheduleLanguage): { language: ScheduleLanguage; lines: string[] } {
  const preferred = language === 'bn' ? schedule.banglaText : schedule.englishText;
  const other = language === 'bn' ? schedule.englishText : schedule.banglaText;
  const usedLanguage: ScheduleLanguage = preferred ? language : language === 'bn' ? 'en' : 'bn';
  const text = preferred || other;
  return { language: usedLanguage, lines: text.split('\n').map((line) => line.trim()).filter(Boolean) };
}

const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_BN = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
const BANGLA_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

function banglaDigits(value: string): string {
  return value.replace(/\d/g, (digit) => BANGLA_DIGITS[Number(digit)]);
}

// The date as people in Chattogram read it (Bangladesh time, UTC+6), for example "1 November 2026" or "১ নভেম্বর ২০২৬".
export function formatScheduleDate(value: string | null, language: ScheduleLanguage): string {
  if (!value) return '';
  const time = Date.parse(value);
  if (Number.isNaN(time)) return '';
  const dhaka = new Date(time + 6 * 60 * 60 * 1000);
  const day = String(dhaka.getUTCDate());
  const year = String(dhaka.getUTCFullYear());
  const month = dhaka.getUTCMonth();
  return language === 'bn'
    ? `${banglaDigits(day)} ${MONTHS_BN[month]} ${banglaDigits(year)}`
    : `${day} ${MONTHS_EN[month]} ${year}`;
}
