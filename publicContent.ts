// Static, bilingual information for the public part of the app (no sign-in needed).
// Source: the CWASA Citizen Information site inside the APK, the Customer centric
// digital platform prototype folder, and the supplied screenshots.
// Every entry is { en, bn }. Screens only call pick(entry, language).
import type { Language } from './translation';

export type Bi = { en: string; bn: string };
export const pick = (entry: Bi, language: Language): string => (language === 'bn' ? entry.bn : entry.en);

const bnDigits = '০১২৩৪৫৬৭৮৯';
export const localDigits = (value: string, language: Language): string =>
  language === 'bn' ? value.replace(/[0-9]/g, (d) => bnDigits[Number(d)]) : value;

export const PDF_BASE = 'https://green-spoonbill-644345.hostingersite.com/pdfs/';
export const HELPLINE = '16118';
export const HELPLINE_ALT = '09612500800';

export const ui = {
  appName: { en: 'CWASA Citizen Info', bn: 'চট্টগ্রাম ওয়াসা নাগরিক তথ্য' },
  orgFull: { en: 'Chattogram Water Supply and Sewerage Authority', bn: 'চট্টগ্রাম পানি সরবরাহ ও পয়ঃনিষ্কাশন কর্তৃপক্ষ' },
  welcomeTo: { en: 'Welcome to', bn: 'স্বাগতম' },
  cwasa: { en: 'Chattogram WASA', bn: 'চট্টগ্রাম ওয়াসা' },
  platform: { en: 'Customer Service Platform', bn: 'গ্রাহক সেবা প্ল্যাটফর্ম' },
  login: { en: 'Login', bn: 'লগইন' },
  register: { en: 'Register', bn: 'রেজিস্টার' },
  logIn: { en: 'Log In', bn: 'লগ ইন' },
  home: { en: 'Home', bn: 'হোম' },
  services: { en: 'Services', bn: 'সেবা' },
  waterBill: { en: 'Water Bill', bn: 'পানির বিল' },
  tariff: { en: 'Tariff & Charges', bn: 'ট্যারিফ ও ফি' },
  reportComplaint: { en: 'Report Complaint', bn: 'অভিযোগ জানান' },
  newConnection: { en: 'New Water Connection', bn: 'নতুন পানির সংযোগ' },
  emergency: { en: 'Emergency', bn: 'জরুরি' },
  offices: { en: 'Offices', bn: 'অফিস' },
  about: { en: 'About', bn: 'সম্পর্কে' },
  forms: { en: 'Forms & Documents', bn: 'ফরম ও ডকুমেন্ট' },
  faq: { en: 'FAQ', bn: 'জিজ্ঞাসা' },
  faqFull: { en: 'Frequently Asked Questions', bn: 'সচরাচর জিজ্ঞাসা' },
  call: { en: 'Call', bn: 'কল করুন' },
  email: { en: 'Email', bn: 'ইমেইল' },
  viewOnMap: { en: 'View on Map', bn: 'ম্যাপে দেখুন' },
  download: { en: 'Download', bn: 'ডাউনলোড' },
  seeAll: { en: 'See all', bn: 'সব দেখুন' },
  back: { en: 'Back', bn: 'ফিরে যান' },
  learnMore: { en: 'Learn more', bn: 'বিস্তারিত' },
  favourites: { en: 'Favourites', bn: 'প্রিয় তালিকা' },
  addFav: { en: 'Add to favourites', bn: 'প্রিয় তালিকায় যোগ করুন' },
  removeFav: { en: 'Remove from favourites', bn: 'প্রিয় তালিকা থেকে সরান' },
  quickActions: { en: 'Quick Actions', bn: 'দ্রুত সেবা' },
  allServices: { en: 'All Services', bn: 'সকল সেবা' },
  helpline: { en: 'Helpline', bn: 'হেল্পলাইন' },
  helplineLine: { en: 'CWASA Helpline — call 16118', bn: 'ওয়াসা হেল্পলাইন — ১৬১১৮ নম্বরে কল করুন' },
  partnership: { en: 'In partnership with WaterAid Bangladesh', bn: 'ওয়াটারএইড বাংলাদেশের সহযোগিতায়' },
  sourceNote: { en: 'Content sourced from the official CWASA website', bn: 'তথ্যসূত্র: চট্টগ্রাম ওয়াসার অফিসিয়াল ওয়েবসাইট' },
  language: { en: 'Language', bn: 'ভাষা' },
  menu: { en: 'Menu', bn: 'মেনু' },
  heroTitle: { en: 'Water services information for the citizens of Chattogram', bn: 'চট্টগ্রামের নাগরিকদের জন্য পানি সেবার তথ্য' },
  tagline: { en: 'Citizen Information Service', bn: 'নাগরিক তথ্য সেবা' },
  reportTitle: { en: 'Report a Complaint', bn: 'অভিযোগ জানান' },
  reportBody: {
    en: 'No water, leakage, meter or billing issue — tell CWASA directly.',
    bn: 'পানি নেই, লিকেজ, মিটার বা বিলের সমস্যা হলে সরাসরি ওয়াসাকে জানান।',
  },
  complaintGate: {
    en: 'Log in or register to file a complaint, so CWASA can link it to your account and follow up.',
    bn: 'অভিযোগ করতে লগ ইন বা রেজিস্টার করুন, যাতে ওয়াসা আপনার অ্যাকাউন্টের সাথে যুক্ত করে ফলো-আপ করতে পারে।',
  },
  complaintWays: {
    en: 'You can also report by calling the helpline or visiting your zone office.',
    bn: 'হেল্পলাইনে কল করে বা আপনার জোন অফিসে গিয়েও জানাতে পারেন।',
  },
  oneTap: { en: 'One-tap call for emergency assistance', bn: 'জরুরি সহায়তার জন্য এক-ট্যাপে কল করুন' },
  emergencyTitle: { en: 'Emergency Contacts', bn: 'জরুরি যোগাযোগ' },
  zoneOffices: { en: 'Zone Offices (business hours)', bn: 'জোন অফিস (অফিস চলাকালীন)' },
  nationalHotlines: { en: 'National Hotlines', bn: 'জাতীয় হটলাইন' },
  officeDirectory: { en: 'Office Directory', bn: 'অফিস ডিরেক্টরি' },
  officeHours: {
    en: 'Sunday–Thursday, 9:00 AM – 5:00 PM (government schedule; closed on public holidays)',
    bn: 'অফিস সময়: রবিবার–বৃহস্পতিবার, সকাল ৯টা – বিকাল ৫টা (সরকারি সময়সূচি; সরকারি ছুটির দিনে বন্ধ)',
  },
  keyOfficials: { en: 'Key Officials (Head Office)', bn: 'প্রধান কার্যালয়ের গুরুত্বপূর্ণ কর্মকর্তা' },
  headOffice: { en: 'Head Office', bn: 'প্রধান কার্যালয়' },
  applicationForms: { en: 'Application Forms', bn: 'আবেদন ফরম' },
  documents: { en: 'Documents', bn: 'ডকুমেন্ট' },
  appInfo: { en: 'App Information', bn: 'অ্যাপ তথ্য' },
  version: { en: 'Version', bn: 'সংস্করণ' },
  contactDeveloper: { en: 'Contact Developer', bn: 'ডেভেলপারের সাথে যোগাযোগ' },
  organogram: { en: 'Organogram', bn: 'অর্গানোগ্রাম' },
  downloadOrganogram: { en: 'Download the official organizational chart (PDF).', bn: 'অফিসিয়াল সাংগঠনিক কাঠামো ডাউনলোড করুন (PDF)।' },
  openBillPortal: { en: 'Open Online Bill Portal', bn: 'অনলাইন বিল পোর্টাল খুলুন' },
  seeFullTariff: { en: 'See full Tariff & Charges', bn: 'সম্পূর্ণ ট্যারিফ ও ফি দেখুন' },
  tapToExpand: { en: 'Tap a question to read the answer', bn: 'উত্তর পড়তে প্রশ্নে ট্যাপ করুন' },
  disclaimer: {
    en: 'All information is sourced from the official CWASA website (ctg-wasa.org.bd). Fees and rates may change; please verify with CWASA for the latest information.',
    bn: 'সকল তথ্য চট্টগ্রাম ওয়াসার অফিসিয়াল ওয়েবসাইট (ctg-wasa.org.bd) থেকে নেওয়া। ফি ও হার পরিবর্তন হতে পারে; সর্বশেষ তথ্যের জন্য ওয়াসার সাথে যাচাই করুন।',
  },
  effective: { en: 'Effective 1 September 2022', bn: 'কার্যকর: ১ সেপ্টেম্বর ২০২২' },
  per1000: { en: 'Per 1,000 gallons', bn: 'প্রতি ১,০০০ গ্যালন' },
  perM3: { en: 'Per cubic metre', bn: 'প্রতি কিউবিক মিটার' },
} satisfies Record<string, Bi>;

// ---------------------------------------------------------------- Emergency
export type Contact = { name: Bi; detail: Bi; number: string; dark?: boolean };
export const emergencyContacts: Contact[] = [
  { name: { en: 'CWASA Helpline', bn: 'ওয়াসা হেল্পলাইন' }, detail: { en: 'Customer care and general assistance', bn: 'গ্রাহক সেবা ও সাধারণ সহায়তা' }, number: '16118' },
  { name: { en: 'CWASA Helpline (Alternative)', bn: 'ওয়াসা হেল্পলাইন (বিকল্প)' }, detail: { en: 'If 16118 is unavailable', bn: '১৬১১৮ না পেলে' }, number: '09612500800' },
  { name: { en: 'Emergency Water Supply', bn: 'জরুরি পানি সরবরাহ' }, detail: { en: 'Request bowser/tanker water', bn: 'বাউজার/ট্যাংকারে পানির জন্য অনুরোধ' }, number: '16118' },
  { name: { en: 'Pipe Burst', bn: 'পাইপ ফেটে যাওয়া' }, detail: { en: 'Report burst pipelines immediately', bn: 'পাইপ ফেটে গেলে দ্রুত জানান' }, number: '16118' },
  { name: { en: 'Water Leakage', bn: 'পানি লিকেজ' }, detail: { en: 'Report leaking pipes or meters', bn: 'পাইপ বা মিটারে লিকেজ জানান' }, number: '16118' },
  { name: { en: 'Head Office', bn: 'প্রধান কার্যালয়' }, detail: { en: 'WASA Bhaban, Dampara, Chattogram', bn: 'ওয়াসা ভবন, দামপাড়া, চট্টগ্রাম' }, number: '02333354269', dark: true },
];

export const zoneContacts: { name: Bi; number: string }[] = [
  { name: { en: 'MOD-1 Agrabad', bn: 'মড-১ আগ্রাবাদ' }, number: '01324712418' },
  { name: { en: 'MOD-2 Dampara', bn: 'মড-২ দামপাড়া' }, number: '01324712412' },
  { name: { en: 'MOD-3 Kalurghat', bn: 'মড-৩ কালুরঘাট' }, number: '01324712411' },
  { name: { en: 'MOD-4 Jubilee Road', bn: 'মড-৪ জুবিলী রোড' }, number: '01324712410' },
];

export const nationalHotlines: { name: Bi; number: string }[] = [
  { name: { en: 'National Emergency Service', bn: 'জাতীয় জরুরি সেবা' }, number: '999' },
  { name: { en: 'Government Information and Services', bn: 'সরকারি তথ্য ও সেবা' }, number: '333' },
  { name: { en: 'Fire Service Hotline', bn: 'ফায়ার সার্ভিস হটলাইন' }, number: '102' },
  { name: { en: 'Electricity Service Hotline', bn: 'বিদ্যুৎ সেবা হটলাইন' }, number: '16999' },
];

// ------------------------------------------------------------------ Offices
export type Office = {
  name: Bi;
  head?: Bi;
  address: Bi;
  phones: string[];
  email?: string;
  mapQuery: string;
};
export const headOffice: Office = {
  name: { en: 'Head Office', bn: 'প্রধান কার্যালয়' },
  address: { en: 'WASA Bhaban, M.M. Ali Road, Dampara, Chattogram', bn: 'ওয়াসা ভবন, এম.এম আলী রোড, দামপাড়া, চট্টগ্রাম' },
  phones: ['02333354269', '16118', '09612500800'],
  email: 'info@ctg-wasa.org.bd',
  mapQuery: 'Chattogram WASA Bhaban, Dampara, Chattogram',
};
export const zoneOffices: Office[] = [
  {
    name: { en: 'MOD-1 (Agrabad Zone)', bn: 'মড-১ (আগ্রাবাদ জোন)' },
    head: { en: 'Iftekhar Ullah Mamun, Executive Engineer (Current Charge)', bn: 'জনাব ইফতেখার উল্লাহ মামুন, নির্বাহী প্রকৌশলী (চঃ দাঃ)' },
    address: { en: 'Office of the Executive Engineer, Sheikh Mujib Road, Agrabad, Chattogram', bn: 'নির্বাহী প্রকৌশলীর কার্যালয়, শেখ মুজিব রোড, আগ্রাবাদ, চট্টগ্রাম' },
    phones: ['02333325252', '01324712418'],
    mapQuery: 'Sheikh Mujib Road, Agrabad, Chattogram',
  },
  {
    name: { en: 'MOD-2 (Dampara Zone)', bn: 'মড-২ (দামপাড়া জোন)' },
    head: { en: 'Abdullah Mohammad Saker, Executive Engineer (Current Charge)', bn: 'জনাব আবদুল্লাহ মোহাম্মদ সাকের, নির্বাহী প্রকৌশলী (চঃ দাঃ)' },
    address: { en: 'Mehedibag, Chattogram', bn: 'মেহেদীবাগ, চট্টগ্রাম' },
    phones: ['02333367973', '01324712412'],
    mapQuery: 'Mehedibag, Chattogram',
  },
  {
    name: { en: 'MOD-3 (Kalurghat Zone)', bn: 'মড-৩ (কালুরঘাট জোন)' },
    head: { en: 'Mohammad Yousuf, Executive Engineer (Current Charge)', bn: 'জনাব মোহাম্মদ ইউসুফ, নির্বাহী প্রকৌশলী (চঃ দাঃ)' },
    address: { en: 'Bahaddarhat, Chattogram', bn: 'বহদ্দারহাট, চট্টগ্রাম' },
    phones: ['0241388006', '01324712411'],
    mapQuery: 'Bahaddarhat, Chattogram',
  },
  {
    name: { en: 'MOD-4 (Jubilee Road Zone)', bn: 'মড-৪ (জুবিলী রোড জোন)' },
    head: { en: 'Soumit Pal, Executive Engineer', bn: 'জনাব সৌমিত পাল, নির্বাহী প্রকৌশলী' },
    address: { en: 'Jubilee Road, Chattogram', bn: 'জুবিলী রোড, চট্টগ্রাম' },
    phones: ['02333356768', '01324712410'],
    mapQuery: 'Jubilee Road, Chattogram',
  },
];
export const officials: { role: Bi; number: string }[] = [
  { role: { en: 'Managing Director', bn: 'ব্যবস্থাপনা পরিচালক' }, number: '02333351806' },
  { role: { en: 'Deputy MD (Admin)', bn: 'উপ-ব্যবস্থাপনা পরিচালক (প্রশাসন)' }, number: '02333351768' },
  { role: { en: 'Deputy MD (Finance)', bn: 'উপ-ব্যবস্থাপনা পরিচালক (অর্থ)' }, number: '02333351794' },
  { role: { en: 'Chief Engineer', bn: 'প্রধান প্রকৌশলী' }, number: '02333351698' },
  { role: { en: 'Commercial Manager', bn: 'বাণিজ্যিক ব্যবস্থাপক' }, number: '02333365829' },
  { role: { en: 'Secretary', bn: 'সচিব' }, number: '02333354269' },
  { role: { en: 'Chief Revenue Officer', bn: 'প্রধান রাজস্ব কর্মকর্তা' }, number: '02333358347' },
  { role: { en: 'System Analyst', bn: 'সিস্টেম এনালিস্ট' }, number: '02333357177' },
  { role: { en: 'Executive Engineer (Sales)', bn: 'নির্বাহী প্রকৌশলী (বিক্রয় বিভাগ)' }, number: '031617807' },
  { role: { en: 'Communication Officer', bn: 'যোগাযোগ কর্মকর্তা' }, number: '02333368242' },
];

// --------------------------------------------------------------- Water bill
export const billIntro: Bi = {
  en: 'This app does not show your bill amount. Learn how bills work and pay through official channels below.',
  bn: 'এই অ্যাপে আপনার বিলের পরিমাণ দেখা যায় না। বিল কীভাবে হিসাব হয় জানুন এবং নিচের অফিসিয়াল মাধ্যমে পরিশোধ করুন।',
};
export const billSections: { title: Bi; items: Bi[] }[] = [
  {
    title: { en: 'How Water Bills Are Calculated', bn: 'পানির বিল যেভাবে হিসাব করা হয়' },
    items: [
      { en: 'Connections are metered. Your bill is based on the water used in the month.', bn: 'সংযোগগুলো মিটারযুক্ত। মাসে যত পানি ব্যবহার হয়, বিল তার ভিত্তিতে হয়।' },
      { en: 'Residential ৳18 per m³ and non-residential ৳37 per m³ (from 1 September 2022).', bn: 'আবাসিক প্রতি ঘনমিটার ১৮ টাকা এবং অনাবাসিক ৩৭ টাকা (১ সেপ্টেম্বর ২০২২ থেকে)।' },
      { en: 'Meter readers record the reading each month. Late payment adds a surcharge.', bn: 'মিটার রিডার প্রতি মাসে রিডিং নেন। দেরিতে পরিশোধ করলে সারচার্জ যোগ হয়।' },
    ],
  },
  {
    title: { en: 'Billing Cycle', bn: 'বিলিং চক্র' },
    items: [
      { en: 'Bills are issued every month based on the meter reading.', bn: 'মিটার রিডিং অনুযায়ী প্রতি মাসে বিল দেওয়া হয়।' },
      { en: 'Pay before the due date to avoid a surcharge.', bn: 'সারচার্জ এড়াতে নির্ধারিত তারিখের আগে পরিশোধ করুন।' },
    ],
  },
];
export type PayWay = { title: Bi; body: Bi; label: Bi; url: string };
export const payWays: PayWay[] = [
  {
    title: { en: 'Approved Banks', bn: 'অনুমোদিত ব্যাংক' },
    body: { en: 'Pay at any CWASA-approved bank branch. See the list of approved banks and branches.', bn: 'ওয়াসার অনুমোদিত যেকোনো ব্যাংক শাখায় পরিশোধ করুন। অনুমোদিত ব্যাংক ও শাখার তালিকা দেখুন।' },
    label: { en: 'Approved Banks List (PDF)', bn: 'অনুমোদিত ব্যাংকের তালিকা (PDF)' },
    url: PDF_BASE + 'approved-banks-list.pdf',
  },
  {
    title: { en: 'Online Card Payment (Visa / Mastercard)', bn: 'অনলাইন কার্ড পেমেন্ট (ভিসা / মাস্টারকার্ড)' },
    body: { en: 'Pay by Visa or Mastercard through Mutual Trust Bank.', bn: 'মিউচুয়াল ট্রাস্ট ব্যাংকের মাধ্যমে ভিসা বা মাস্টারকার্ডে পরিশোধ করুন।' },
    label: { en: 'Pay by Card', bn: 'কার্ডে পরিশোধ করুন' },
    url: 'https://services.mutualtrustbank.com/cwasabillpayment',
  },
  {
    title: { en: 'Online e-Bill Portal', bn: 'অনলাইন ই-বিল পোর্টাল' },
    body: { en: 'View and pay your bill on the official CWASA e-bill portal.', bn: 'ওয়াসার অফিসিয়াল ই-বিল পোর্টালে বিল দেখুন ও পরিশোধ করুন।' },
    label: { en: 'Open Online Bill Portal', bn: 'অনলাইন বিল পোর্টাল খুলুন' },
    url: 'http://ebill.cwasabd.org/ebill/',
  },
];

// ------------------------------------------------------------------- Tariff
export type TariffTable = {
  id: string;
  title: Bi;
  note?: Bi;
  corner: Bi;
  cols: Bi[];
  rows: { label: Bi; cells: string[] }[];
};
const sizes: Bi[] = ['3/4"', '1"', '2"', '4"', '6"'].map((s) => ({ en: s, bn: s }));
const res: Bi = { en: 'Residential', bn: 'আবাসিক' };
const nonRes: Bi = { en: 'Non-residential', bn: 'অনাবাসিক' };
const item: Bi = { en: 'Item', bn: 'বিবরণ' };
const size: Bi = { en: 'Size', bn: 'সাইজ' };

export const tariffTables: TariffTable[] = [
  {
    id: 'water',
    title: { en: 'Water Tariff', bn: 'পানি অভিকর হার' },
    note: ui.effective,
    corner: { en: 'Category', bn: 'ধরন' },
    cols: [ui.per1000, ui.perM3],
    rows: [
      { label: res, cells: ['৳81.82', '৳18.00'] },
      { label: nonRes, cells: ['৳168.20', '৳37.00'] },
    ],
  },
  {
    id: 'newConnection',
    title: { en: 'New Connection Fees (৳)', bn: 'নতুন সংযোগের ফি (৳)' },
    corner: item,
    cols: sizes,
    rows: [
      { label: { en: 'Connection fee', bn: 'সংযোগ ফি' }, cells: ['1,500', '4,000', '40,000', '60,000', '1,00,000'] },
      { label: { en: 'Meter price', bn: 'মিটারের মূল্য' }, cells: ['3,500', '6,000', '20,000', '30,000', '60,000'] },
      { label: { en: 'Meter fitting charge', bn: 'মিটারের ফিটিং চার্জ' }, cells: ['300', '500', '3,000', '6,000', '10,000'] },
      { label: { en: 'Security deposit (refundable)', bn: 'নিরাপত্তা জামানত (ফেরতযোগ্য)' }, cells: ['5,000', '10,000', '20,000', '30,000', '50,000'] },
      { label: { en: 'Security deposit (non-residential)', bn: 'নিরাপত্তা জামানত (অনাবাসিক)' }, cells: ['40,000', '80,000', '2,00,000', '8,00,000', '10,00,000'] },
      { label: { en: 'Development charge', bn: 'উন্নয়ন চার্জ' }, cells: ['3,000', '5,000', '20,000', '50,000', '—'] },
      { label: { en: 'Connection transfer fee', bn: 'সংযোগ হস্তান্তর ফি' }, cells: ['6,000', '12,000', '15,000', '20,000', '25,000'] },
    ],
  },
  {
    id: 'upsizing',
    title: { en: 'Connection Upsizing (৳)', bn: 'সংযোগের আকার বাড়ানো (৳)' },
    corner: { en: 'Change', bn: 'পরিবর্তন' },
    cols: [{ en: 'Fee', bn: 'ফি' }],
    rows: [
      { label: { en: '3/4" to 1"', bn: '৩/৪" থেকে ১"' }, cells: ['25,000'] },
      { label: { en: '3/4" to 2"', bn: '৩/৪" থেকে ২"' }, cells: ['30,000'] },
      { label: { en: '1" to 2"', bn: '১" থেকে ২"' }, cells: ['30,000'] },
    ],
  },
  {
    id: 'industrial',
    title: { en: 'Industrial Security Deposit (৳)', bn: 'শিল্প সংযোগের নিরাপত্তা জামানত (৳)' },
    corner: size,
    cols: [{ en: 'Deposit', bn: 'জামানত' }],
    rows: [
      { label: { en: '3/4"', bn: '৩/৪"' }, cells: ['2,00,000'] },
      { label: { en: '1"', bn: '১"' }, cells: ['2,50,000'] },
      { label: { en: '2"', bn: '২"' }, cells: ['4,00,000'] },
    ],
  },
  {
    id: 'meterReplace',
    title: { en: 'Meter Replacement Fee (৳)', bn: 'মিটার প্রতিস্থাপন ফি (৳)' },
    corner: size,
    cols: [{ en: 'Defective meter', bn: 'নষ্ট মিটার' }, { en: 'Stolen meter', bn: 'চুরি যাওয়া মিটার' }],
    rows: [
      { label: { en: '3/4"', bn: '৩/৪"' }, cells: ['4,000', '6,000'] },
      { label: { en: '1"', bn: '১"' }, cells: ['5,500', '7,500'] },
      { label: { en: '2"', bn: '২"' }, cells: ['18,000', '25,000'] },
      { label: { en: '4"', bn: '৪"' }, cells: ['25,000', '35,000'] },
      { label: { en: '6"', bn: '৬"' }, cells: ['35,000', '45,000'] },
      { label: { en: '8"', bn: '৮"' }, cells: ['45,000', '55,000'] },
    ],
  },
  {
    id: 'reconnect',
    title: { en: 'Meter Reconnection Fee (৳)', bn: 'মিটার পুনঃসংযোগ ফি (৳)' },
    note: { en: 'By how long the connection was disconnected', bn: 'সংযোগ কতদিন বিচ্ছিন্ন ছিল তার ভিত্তিতে' },
    corner: { en: 'Disconnected for', bn: 'বিচ্ছিন্ন ছিল' },
    cols: [res, nonRes],
    rows: [
      { label: { en: 'Within 1 month', bn: '১ মাসের মধ্যে' }, cells: ['200', '400'] },
      { label: { en: 'Within 6 months', bn: '৬ মাসের মধ্যে' }, cells: ['400', '800'] },
      { label: { en: 'Within 1 year', bn: '১ বছরের মধ্যে' }, cells: ['700', '1,500'] },
      { label: { en: 'Within 2 years', bn: '২ বছরের মধ্যে' }, cells: ['2,100', '4,500'] },
      { label: { en: 'Over 2 years', bn: '২ বছরের বেশি' }, cells: ['4,200', '9,000'] },
    ],
  },
  {
    id: 'dtw',
    title: { en: 'Deep Tube Well Licence (৳)', bn: 'গভীর নলকূপ লাইসেন্স (৳)' },
    corner: { en: 'Pipe size', bn: 'পাইপের সাইজ' },
    cols: [
      { en: 'Licence (Res.)', bn: 'লাইসেন্স (আবাসিক)' },
      { en: 'Licence (Non-res.)', bn: 'লাইসেন্স (অনাবাসিক)' },
      { en: 'Renewal (Res.)', bn: 'নবায়ন (আবাসিক)' },
      { en: 'Renewal (Non-res.)', bn: 'নবায়ন (অনাবাসিক)' },
    ],
    rows: [
      { label: { en: '2" and 3"', bn: '২" ও ৩"' }, cells: ['30,000', '55,000', '15,000', '33,750'] },
      { label: { en: '4"', bn: '৪"' }, cells: ['50,200', '1,40,200', '25,000', '87,500'] },
      { label: { en: '6"', bn: '৬"' }, cells: ['80,200', '2,25,200', '75,000', '1,37,500'] },
      { label: { en: '8"', bn: '৮"' }, cells: ['80,200', '2,25,200', '75,000', '2,18,750'] },
    ],
  },
  {
    id: 'bowser',
    title: { en: 'Bowser (Tanker) Water', bn: 'বাউজার (ট্যাংকার) পানি' },
    corner: { en: 'Vehicle', bn: 'যানবাহন' },
    cols: [{ en: 'Normal (৳)', bn: 'সাধারণ (৳)' }, { en: 'Emergency (৳)', bn: 'জরুরি (৳)' }],
    rows: [
      { label: { en: 'Large lorry (10 m³)', bn: 'বড় লরি (১০ ঘনমিটার)' }, cells: ['1,400', '2,500'] },
      { label: { en: 'Private vehicle (per 1,000 L)', bn: 'ব্যক্তিগত গাড়ি (প্রতি ১,০০০ লিটার)' }, cells: ['100', '100'] },
    ],
  },
];

// --------------------------------------------------------------------- Forms
export type DocItem = { name: Bi; file: string };
export const formGroups: { title: Bi; items: DocItem[] }[] = [
  {
    title: ui.applicationForms,
    items: [
      { name: { en: 'New Connection Application Form', bn: 'নতুন সংযোগের আবেদন ফরম' }, file: 'form-new-connection.pdf' },
      { name: { en: 'Connection Transfer Application Form', bn: 'সংযোগ হস্তান্তরের আবেদন ফরম' }, file: 'form-connection-transfer.pdf' },
      { name: { en: 'Connection Extension Application Form', bn: 'সংযোগ সম্প্রসারণের আবেদন ফরম' }, file: 'form-connection-extension.pdf' },
      { name: { en: 'Defective Meter Replacement Form', bn: 'নষ্ট মিটার বদলের ফরম' }, file: 'form-meter-replacement.pdf' },
      { name: { en: 'Stolen Meter Replacement Form', bn: 'চুরি যাওয়া মিটার বদলের ফরম' }, file: 'form-stolen-meter-replacement.pdf' },
      { name: { en: 'Ownership / Name Change Form', bn: 'মালিকানা / নাম পরিবর্তনের ফরম' }, file: 'form-ownership-name-change.pdf' },
      { name: { en: 'Bowser Water Purchase Form', bn: 'বাউজারে পানি কেনার ফরম' }, file: 'form-bowser-water-purchase.pdf' },
      { name: { en: 'Deep Tube Well Licence Application Form', bn: 'গভীর নলকূপ লাইসেন্সের আবেদন ফরম' }, file: 'form-deep-tubewell-licence.pdf' },
    ],
  },
  {
    title: ui.documents,
    items: [
      { name: { en: "Citizen's Charter", bn: 'সিটিজেন চার্টার' }, file: 'citizen-charter.pdf' },
      { name: { en: 'Approved Banks List', bn: 'অনুমোদিত ব্যাংকের তালিকা' }, file: 'approved-banks-list.pdf' },
      { name: { en: 'Organogram', bn: 'অর্গানোগ্রাম' }, file: 'organogram.pdf' },
      { name: { en: 'CWASA Current Capacity', bn: 'ওয়াসার বর্তমান সক্ষমতা' }, file: 'current-capacity.pdf' },
      { name: { en: 'Telephone Chart', bn: 'টেলিফোন তালিকা' }, file: 'telephone-chart.pdf' },
      { name: { en: 'CWASA Achievements', bn: 'ওয়াসার অর্জন' }, file: 'cwasa-achievements.pdf' },
    ],
  },
];
const form = (file: string): DocItem => {
  for (const g of formGroups) for (const f of g.items) if (f.file === file) return f;
  throw new Error(file);
};

// ------------------------------------------------------------- Service pages
export type ServiceId = 'new-connection' | 'ownership-transfer' | 'meter-services' | 'temporary-connection' | 'disconnection-reconnection' | 'emergency-water-supply';
export type ServiceSection = { title: Bi; items?: Bi[]; steps?: Bi[]; text?: Bi };
export type Service = { id: ServiceId; icon: string; title: Bi; subtitle: Bi; sections: ServiceSection[]; forms: DocItem[]; showTariff: boolean };

export const services: Service[] = [
  {
    id: 'new-connection',
    icon: '🚰',
    title: ui.newConnection,
    subtitle: { en: 'How to apply for a new water connection for your home or business', bn: 'বাসা বা ব্যবসার জন্য নতুন পানির সংযোগের আবেদন করবেন যেভাবে' },
    sections: [
      {
        title: { en: 'Eligibility', bn: 'যোগ্যতা' },
        items: [
          { en: 'Property owner (or authorized representative) within the CWASA service area of Chattogram city', bn: 'চট্টগ্রাম শহরে ওয়াসার সেবা এলাকার মধ্যে সম্পত্তির মালিক (বা অনুমোদিত প্রতিনিধি)' },
          { en: 'Premises must be reachable from an existing CWASA distribution line', bn: 'ওয়াসার বিদ্যমান বিতরণ লাইন থেকে প্রাঙ্গণে সংযোগ দেওয়া সম্ভব হতে হবে' },
        ],
      },
      {
        title: { en: 'Required Documents', bn: 'প্রয়োজনীয় কাগজপত্র' },
        items: [
          { en: 'Completed application form (available at Forms & Documents)', bn: 'পূরণ করা আবেদন ফরম (ফরম ও ডকুমেন্ট অংশে পাবেন)' },
          { en: 'Copy of National ID card', bn: 'জাতীয় পরিচয়পত্রের কপি' },
          { en: 'Proof of property ownership (deed / holding tax receipt)', bn: 'সম্পত্তির মালিকানার প্রমাণ (দলিল / হোল্ডিং ট্যাক্স রসিদ)' },
          { en: 'Passport-size photograph', bn: 'পাসপোর্ট সাইজের ছবি' },
          { en: 'Site/location plan of the premises', bn: 'প্রাঙ্গণের সাইট/অবস্থান নকশা' },
        ],
      },
      {
        title: { en: 'Application Process', bn: 'আবেদনের ধাপ' },
        steps: [
          { en: 'Download and fill in the New Connection Application Form', bn: 'নতুন সংযোগের আবেদন ফরম ডাউনলোড করে পূরণ করুন' },
          { en: 'Attach the required documents', bn: 'প্রয়োজনীয় কাগজপত্র সংযুক্ত করুন' },
          { en: 'Submit the application to your MOD zone office', bn: 'আপনার মড জোন অফিসে আবেদন জমা দিন' },
          { en: 'CWASA conducts a site inspection and prepares a demand note', bn: 'ওয়াসা সাইট পরিদর্শন করে ডিমান্ড নোট তৈরি করে' },
          { en: 'Pay the fees stated in the demand note at an approved bank', bn: 'ডিমান্ড নোটে উল্লিখিত ফি অনুমোদিত ব্যাংকে পরিশোধ করুন' },
          { en: 'Connection is installed with a meter after payment verification', bn: 'পেমেন্ট যাচাইয়ের পর মিটারসহ সংযোগ বসানো হয়' },
        ],
      },
      {
        title: { en: 'Fees', bn: 'ফি' },
        text: { en: 'Fees depend on the connection size (3/4" to 6"). See the full table in Tariff & Charges.', bn: 'ফি সংযোগের সাইজের (৩/৪" থেকে ৬") উপর নির্ভর করে। সম্পূর্ণ তালিকা ট্যারিফ ও ফি অংশে দেখুন।' },
      },
    ],
    forms: [form('form-new-connection.pdf')],
    showTariff: true,
  },
  {
    id: 'ownership-transfer',
    icon: '🔁',
    title: { en: 'Ownership Transfer', bn: 'মালিকানা হস্তান্তর' },
    subtitle: { en: "Transfer a water connection to a new owner's name", bn: 'পানির সংযোগ নতুন মালিকের নামে হস্তান্তর করুন' },
    sections: [
      {
        title: { en: 'Required Documents', bn: 'প্রয়োজনীয় কাগজপত্র' },
        items: [
          { en: 'Name change / ownership transfer application form', bn: 'নাম পরিবর্তন / মালিকানা হস্তান্তরের আবেদন ফরম' },
          { en: 'Copy of ownership transfer deed or succession certificate', bn: 'মালিকানা হস্তান্তর দলিল বা উত্তরাধিকার সনদের কপি' },
          { en: 'National ID of the new owner', bn: 'নতুন মালিকের জাতীয় পরিচয়পত্র' },
          { en: 'Copy of the latest paid water bill', bn: 'সর্বশেষ পরিশোধিত পানির বিলের কপি' },
        ],
      },
      {
        title: { en: 'Procedure', bn: 'পদ্ধতি' },
        steps: [
          { en: 'Clear any outstanding water bills on the connection', bn: 'সংযোগের সব বকেয়া বিল পরিশোধ করুন' },
          { en: 'Submit the form with documents to your MOD zone office', bn: 'কাগজপত্রসহ ফরম আপনার মড জোন অফিসে জমা দিন' },
          { en: 'Pay the prescribed fee after verification', bn: 'যাচাইয়ের পর নির্ধারিত ফি পরিশোধ করুন' },
          { en: "The connection is registered in the new owner's name", bn: 'সংযোগ নতুন মালিকের নামে নিবন্ধিত হয়' },
        ],
      },
      {
        title: { en: 'Fees', bn: 'ফি' },
        text: { en: 'Connection transfer fee: ৳6,000 (3/4") up to ৳25,000 (6") depending on size. See Tariff & Charges.', bn: 'সংযোগ হস্তান্তর ফি: সাইজ অনুযায়ী ৬,০০০ টাকা (৩/৪") থেকে ২৫,০০০ টাকা (৬") পর্যন্ত। ট্যারিফ ও ফি অংশ দেখুন।' },
      },
    ],
    forms: [form('form-ownership-name-change.pdf')],
    showTariff: true,
  },
  {
    id: 'meter-services',
    icon: '⏱',
    title: { en: 'Meter Services', bn: 'মিটার সেবা' },
    subtitle: { en: 'Meter replacement, testing, and reporting damaged or faulty meters', bn: 'মিটার প্রতিস্থাপন, পরীক্ষা এবং নষ্ট বা ত্রুটিপূর্ণ মিটারের অভিযোগ' },
    sections: [
      {
        title: { en: 'Meter Replacement', bn: 'মিটার প্রতিস্থাপন' },
        items: [
          { en: 'Apply with the Defective Meter Replacement Form at your zone office', bn: 'আপনার জোন অফিসে নষ্ট মিটার বদলের ফরম দিয়ে আবেদন করুন' },
          { en: 'For stolen meters, use the Stolen Meter Replacement Form with a police GD copy', bn: 'চুরি যাওয়া মিটারের ক্ষেত্রে থানার জিডির কপিসহ চুরি যাওয়া মিটার বদলের ফরম ব্যবহার করুন' },
          { en: 'Replacement fee: ৳4,000–45,000 by size; stolen meter: ৳6,000–55,000', bn: 'প্রতিস্থাপন ফি: সাইজ অনুযায়ী ৪,০০০–৪৫,০০০ টাকা; চুরি যাওয়া মিটার: ৬,০০০–৫৫,০০০ টাকা' },
        ],
      },
      {
        title: { en: 'Faulty / Damaged Meter Reporting', bn: 'ত্রুটিপূর্ণ / নষ্ট মিটারের অভিযোগ' },
        items: [
          { en: 'Report to your MOD zone office or call the 16118 helpline', bn: 'আপনার মড জোন অফিসে জানান অথবা ১৬১১৮ হেল্পলাইনে কল করুন' },
          { en: 'CWASA inspects and tests the meter; a replacement is prescribed if defective', bn: 'ওয়াসা মিটার পরিদর্শন ও পরীক্ষা করে; নষ্ট হলে প্রতিস্থাপনের নির্দেশ দেওয়া হয়' },
        ],
      },
      {
        title: { en: 'Fees', bn: 'ফি' },
        text: { en: 'Full meter replacement and reconnection fee tables are in Tariff & Charges.', bn: 'মিটার প্রতিস্থাপন ও পুনঃসংযোগ ফির পূর্ণ তালিকা ট্যারিফ ও ফি অংশে আছে।' },
      },
    ],
    forms: [form('form-meter-replacement.pdf'), form('form-stolen-meter-replacement.pdf')],
    showTariff: true,
  },
  {
    id: 'temporary-connection',
    icon: '🏗',
    title: { en: 'Temporary Water Connection', bn: 'অস্থায়ী পানির সংযোগ' },
    subtitle: { en: 'Short-term water connections for construction sites and events', bn: 'নির্মাণ কাজ ও অনুষ্ঠানের জন্য স্বল্পমেয়াদি পানির সংযোগ' },
    sections: [
      {
        title: { en: 'Eligibility', bn: 'যোগ্যতা' },
        items: [{ en: 'Construction projects, temporary structures, or events within the service area', bn: 'সেবা এলাকার মধ্যে নির্মাণ প্রকল্প, অস্থায়ী কাঠামো বা অনুষ্ঠান' }],
      },
      {
        title: { en: 'Required Documents', bn: 'প্রয়োজনীয় কাগজপত্র' },
        items: [
          { en: 'Application addressed to the zone Executive Engineer', bn: 'জোনের নির্বাহী প্রকৌশলীর নামে আবেদন' },
          { en: 'National ID and proof of site ownership / permission', bn: 'জাতীয় পরিচয়পত্র এবং সাইটের মালিকানা / অনুমতির প্রমাণ' },
        ],
      },
      {
        title: { en: 'Procedure & Fees', bn: 'পদ্ধতি ও ফি' },
        items: [
          { en: 'CWASA determines the connection terms, duration, and applicable fees after inspection', bn: 'পরিদর্শনের পর ওয়াসা সংযোগের শর্ত, মেয়াদ ও প্রযোজ্য ফি নির্ধারণ করে' },
          { en: 'Non-residential tariff (৳37/m³) generally applies', bn: 'সাধারণত অনাবাসিক হার (৩৭ টাকা/ঘনমিটার) প্রযোজ্য' },
          { en: 'Contact your MOD zone office for details', bn: 'বিস্তারিত জানতে আপনার মড জোন অফিসে যোগাযোগ করুন' },
        ],
      },
    ],
    forms: [],
    showTariff: false,
  },
  {
    id: 'disconnection-reconnection',
    icon: '🔌',
    title: { en: 'Disconnection & Reconnection', bn: 'সংযোগ বিচ্ছিন্ন ও পুনঃসংযোগ' },
    subtitle: { en: 'Why connections are disconnected and how to restore them', bn: 'কেন সংযোগ বিচ্ছিন্ন হয় এবং কীভাবে ফিরিয়ে আনবেন' },
    sections: [
      {
        title: { en: 'Reasons for Disconnection', bn: 'সংযোগ বিচ্ছিন্নের কারণ' },
        items: [
          { en: 'Non-payment of water bills', bn: 'পানির বিল পরিশোধ না করা' },
          { en: 'Illegal or unauthorized connection', bn: 'অবৈধ বা অনুমোদনহীন সংযোগ' },
          { en: 'Meter tampering', bn: 'মিটারে কারসাজি' },
          { en: 'Voluntary disconnection on customer request', bn: 'গ্রাহকের অনুরোধে স্বেচ্ছায় বিচ্ছিন্ন করা' },
        ],
      },
      {
        title: { en: 'Reconnection Procedure', bn: 'পুনঃসংযোগের পদ্ধতি' },
        steps: [
          { en: 'Clear all outstanding bills and surcharges', bn: 'সব বকেয়া বিল ও সারচার্জ পরিশোধ করুন' },
          { en: 'Apply for reconnection at your MOD zone office', bn: 'আপনার মড জোন অফিসে পুনঃসংযোগের আবেদন করুন' },
          { en: 'Pay the reconnection fee (depends on how long disconnected)', bn: 'পুনঃসংযোগ ফি পরিশোধ করুন (কতদিন বিচ্ছিন্ন ছিল তার উপর নির্ভর করে)' },
          { en: 'Connection is restored after verification', bn: 'যাচাইয়ের পর সংযোগ ফিরিয়ে দেওয়া হয়' },
        ],
      },
      {
        title: { en: 'Charges', bn: 'চার্জ' },
        text: { en: 'Reconnection fee: ৳200 (within 1 month, residential) up to ৳9,000 (over 2 years, non-residential). Full table in Tariff & Charges.', bn: 'পুনঃসংযোগ ফি: ২০০ টাকা (১ মাসের মধ্যে, আবাসিক) থেকে ৯,০০০ টাকা (২ বছরের বেশি, অনাবাসিক) পর্যন্ত। পূর্ণ তালিকা ট্যারিফ ও ফি অংশে।' },
      },
    ],
    forms: [],
    showTariff: true,
  },
  {
    id: 'emergency-water-supply',
    icon: '🚚',
    title: { en: 'Emergency Water Supply', bn: 'জরুরি পানি সরবরাহ' },
    subtitle: { en: 'Bowser (tanker) water delivery during supply disruptions', bn: 'সরবরাহ বন্ধ থাকলে বাউজার (ট্যাংকার) দিয়ে পানি সরবরাহ' },
    sections: [
      {
        title: { en: 'Service Description', bn: 'সেবার বিবরণ' },
        items: [
          { en: 'CWASA supplies water by bowser (tanker lorry) during pipeline repairs, shortages, or emergencies', bn: 'পাইপলাইন মেরামত, সংকট বা জরুরি অবস্থায় ওয়াসা বাউজার (ট্যাংকার লরি) দিয়ে পানি সরবরাহ করে' },
          { en: 'Coverage: CWASA service area of Chattogram city', bn: 'এলাকা: চট্টগ্রাম শহরে ওয়াসার সেবা এলাকা' },
        ],
      },
      {
        title: { en: 'How to Request', bn: 'যেভাবে অনুরোধ করবেন' },
        steps: [
          { en: 'Call the CWASA helpline 16118 (or 09612500800)', bn: 'ওয়াসা হেল্পলাইন ১৬১১৮ (বা ০৯৬১২৫০০৮০০) নম্বরে কল করুন' },
          { en: 'Or apply with the Bowser Water Purchase Form at your zone office', bn: 'অথবা জোন অফিসে বাউজারে পানি কেনার ফরম দিয়ে আবেদন করুন' },
          { en: 'Pay the applicable rate; delivery is scheduled by the zone office', bn: 'প্রযোজ্য হার পরিশোধ করুন; জোন অফিস সরবরাহের সময় ঠিক করে' },
        ],
      },
      {
        title: { en: 'Rates', bn: 'হার' },
        text: { en: 'Large lorry 10,000 L: ৳1,400 (normal) / ৳2,500 (emergency). Private vehicle: ৳100 per 1,000 L.', bn: 'বড় লরি ১০,০০০ লিটার: ১,৪০০ টাকা (সাধারণ) / ২,৫০০ টাকা (জরুরি)। ব্যক্তিগত গাড়ি: প্রতি ১,০০০ লিটারে ১০০ টাকা।' },
      },
    ],
    forms: [form('form-bowser-water-purchase.pdf')],
    showTariff: true,
  },
];

// ----------------------------------------------------------------------- FAQ
export const faqItems: { q: Bi; a: Bi }[] = [
  {
    q: { en: 'How can I obtain a new water connection?', bn: 'নতুন পানির সংযোগ কীভাবে পাব?' },
    a: {
      en: 'Download the New Connection Application Form, fill it in, attach your NID, ownership documents and photo, and submit it to your MOD zone office. After site inspection, pay the demand note fees at an approved bank and the connection is installed. See Customer Services → New Water Connection for details.',
      bn: 'নতুন সংযোগের আবেদন ফরম ডাউনলোড করে পূরণ করুন, এনআইডি, মালিকানার কাগজ ও ছবি সংযুক্ত করে আপনার মড জোন অফিসে জমা দিন। সাইট পরিদর্শনের পর অনুমোদিত ব্যাংকে ডিমান্ড নোটের ফি পরিশোধ করলে সংযোগ বসানো হয়। বিস্তারিত দেখুন: সেবা → নতুন পানির সংযোগ।',
    },
  },
  {
    q: { en: 'How do I pay my water bill?', bn: 'আমি কীভাবে পানির বিল পরিশোধ করব?' },
    a: {
      en: 'Pay at any CWASA-approved bank branch, or online by Visa/Mastercard through the Mutual Trust Bank portal. You can also view your bill on the official e-bill portal. See the Water Bill section for links.',
      bn: 'ওয়াসার অনুমোদিত যেকোনো ব্যাংক শাখায়, অথবা মিউচুয়াল ট্রাস্ট ব্যাংকের পোর্টালে ভিসা/মাস্টারকার্ডে অনলাইনে পরিশোধ করুন। অফিসিয়াল ই-বিল পোর্টালেও বিল দেখতে পারেন। লিংকের জন্য পানির বিল অংশ দেখুন।',
    },
  },
  {
    q: { en: 'How is my water bill calculated?', bn: 'আমার পানির বিল কীভাবে হিসাব হয়?' },
    a: {
      en: 'Your monthly metered consumption is multiplied by the tariff: ৳18 per cubic meter for residential and ৳37 for non-residential connections (effective 1 September 2022). Late payment adds a surcharge.',
      bn: 'মাসে মিটারে মাপা ব্যবহারকে ট্যারিফ দিয়ে গুণ করা হয়: আবাসিক সংযোগে প্রতি ঘনমিটার ১৮ টাকা এবং অনাবাসিকে ৩৭ টাকা (১ সেপ্টেম্বর ২০২২ থেকে কার্যকর)। দেরিতে পরিশোধ করলে সারচার্জ যোগ হয়।',
    },
  },
  {
    q: { en: 'How do I replace a damaged meter?', bn: 'নষ্ট মিটার কীভাবে বদলাব?' },
    a: {
      en: 'Submit the Defective Meter Replacement Form to your zone office and pay the size-based fee (৳4,000 for 3/4" up to ৳45,000 for 8"). For a stolen meter, file a police GD first and use the Stolen Meter Replacement Form.',
      bn: 'নষ্ট মিটার বদলের ফরম আপনার জোন অফিসে জমা দিন এবং সাইজ অনুযায়ী ফি দিন (৩/৪" এর জন্য ৪,০০০ টাকা থেকে ৮" এর জন্য ৪৫,০০০ টাকা)। মিটার চুরি হলে আগে থানায় জিডি করুন এবং চুরি যাওয়া মিটার বদলের ফরম ব্যবহার করুন।',
    },
  },
  {
    q: { en: 'How do I report water leakage?', bn: 'পানি লিকেজ কীভাবে জানাব?' },
    a: {
      en: 'Call the CWASA helpline 16118 (24/7) or inform your MOD zone office with the exact location of the leak. For pipe bursts, call 16118 immediately.',
      bn: 'ওয়াসা হেল্পলাইন ১৬১১৮ (২৪/৭) নম্বরে কল করুন অথবা লিকেজের সঠিক অবস্থানসহ আপনার মড জোন অফিসে জানান। পাইপ ফেটে গেলে সাথে সাথে ১৬১১৮ নম্বরে কল করুন।',
    },
  },
  {
    q: { en: 'How do I change the ownership of a connection?', bn: 'সংযোগের মালিকানা কীভাবে বদলাব?' },
    a: {
      en: "Clear outstanding bills, then submit the Name Change Form with the transfer deed, new owner's NID and latest paid bill to your zone office, and pay the transfer fee (৳6,000–25,000 by size).",
      bn: 'বকেয়া বিল পরিশোধ করুন, তারপর হস্তান্তর দলিল, নতুন মালিকের এনআইডি ও সর্বশেষ পরিশোধিত বিলসহ নাম পরিবর্তনের ফরম জোন অফিসে জমা দিন এবং হস্তান্তর ফি দিন (সাইজ অনুযায়ী ৬,০০০–২৫,০০০ টাকা)।',
    },
  },
  {
    q: { en: 'What should I do if there is no water supply?', bn: 'পানি সরবরাহ না থাকলে কী করব?' },
    a: {
      en: 'First check for scheduled interruption notices. If unannounced, report to your zone office or call 16118 with your account number and address. For urgent needs, you can request emergency bowser water supply.',
      bn: 'আগে নির্ধারিত সরবরাহ বন্ধের নোটিশ দেখুন। নোটিশ না থাকলে আপনার অ্যাকাউন্ট নম্বর ও ঠিকানাসহ জোন অফিসে জানান বা ১৬১১৮ নম্বরে কল করুন। জরুরি প্রয়োজনে বাউজারে পানির অনুরোধ করতে পারেন।',
    },
  },
  {
    q: { en: 'Which banks accept CWASA bill payments?', bn: 'কোন কোন ব্যাংকে ওয়াসার বিল নেওয়া হয়?' },
    a: {
      en: 'CWASA maintains an approved bank/branch list — download it from the Forms & Documents section (approved-banks-list.pdf). Online card payment is available via Mutual Trust Bank.',
      bn: 'ওয়াসার অনুমোদিত ব্যাংক/শাখার তালিকা আছে। ফরম ও ডকুমেন্ট অংশ থেকে ডাউনলোড করুন (approved-banks-list.pdf)। মিউচুয়াল ট্রাস্ট ব্যাংকের মাধ্যমে অনলাইন কার্ড পেমেন্টও করা যায়।',
    },
  },
];

// ------------------------------------------------------------------- About
export const aboutSections: { title: Bi; body?: Bi; items?: Bi[] }[] = [
  {
    title: { en: 'Introduction', bn: 'পরিচিতি' },
    body: {
      en: "Chattogram Water Supply and Sewerage Authority (CWASA) is the government authority responsible for water supply and sewerage services in the Chattogram metropolitan area. It was established in 1963 under East Pakistan Ordinance No. XIX to build, operate, and maintain the water and sanitation infrastructure of Bangladesh's port city.",
      bn: 'চট্টগ্রাম পানি সরবরাহ ও পয়ঃনিষ্কাশন কর্তৃপক্ষ (চট্টগ্রাম ওয়াসা) চট্টগ্রাম মহানগর এলাকার পানি সরবরাহ ও পয়ঃনিষ্কাশন সেবার দায়িত্বপ্রাপ্ত সরকারি সংস্থা। বাংলাদেশের বন্দরনগরীর পানি ও স্যানিটেশন অবকাঠামো নির্মাণ, পরিচালনা ও রক্ষণাবেক্ষণের জন্য ১৯৬৩ সালে পূর্ব পাকিস্তান অধ্যাদেশ নং ১৯ এর অধীনে এটি প্রতিষ্ঠিত হয়।',
    },
  },
  {
    title: { en: 'History', bn: 'ইতিহাস' },
    body: {
      en: "Founded in 1963, CWASA has grown from a small municipal water operation into the authority serving the entire Chattogram metropolitan area. Landmark milestones include the Karnaphuli Water Supply Project (Phases 1 & 2), the Madunaghat (Sheikh Russel) Water Treatment Plant, and the Sheikh Hasina Water Treatment Plant, which together transformed the city's supply capacity. The authority is now implementing the city's first large-scale sewerage system.",
      bn: 'কর্ণফুলী পানি সরবরাহ প্রকল্প (প্রথম ও দ্বিতীয় পর্যায়), মাদুনাঘাট (শেখ রাসেল) পানি শোধনাগার এবং শেখ হাসিনা পানি শোধনাগারসহ বিভিন্ন মাইলফলক শহরের পানি সরবরাহ সক্ষমতা বদলে দিয়েছে। ১৯৬৩ সালে প্রতিষ্ঠিত ওয়াসা একটি ছোট পৌর পানি ব্যবস্থা থেকে পুরো চট্টগ্রাম মহানগরকে সেবা দেওয়া কর্তৃপক্ষে পরিণত হয়েছে। বর্তমানে শহরের প্রথম বড় আকারের পয়ঃনিষ্কাশন ব্যবস্থা বাস্তবায়ন করছে।',
    },
  },
  {
    title: { en: 'Vision', bn: 'রূপকল্প' },
    body: {
      en: "To develop safe and effective water management and sewerage systems affordable to the city's residents.",
      bn: 'নগরবাসীর সাধ্যের মধ্যে নিরাপদ ও কার্যকর পানি ব্যবস্থাপনা এবং পয়ঃনিষ্কাশন ব্যবস্থা গড়ে তোলা।',
    },
  },
  {
    title: { en: 'Mission', bn: 'অভিলক্ষ্য' },
    body: {
      en: 'To reliably provide quality water supply and sewerage services using environment-friendly, appropriate technology and skilled manpower.',
      bn: 'পরিবেশবান্ধব ও উপযুক্ত প্রযুক্তি এবং দক্ষ জনবল ব্যবহার করে নির্ভরযোগ্যভাবে মানসম্মত পানি সরবরাহ ও পয়ঃনিষ্কাশন সেবা দেওয়া।',
    },
  },
  {
    title: { en: 'Objectives', bn: 'উদ্দেশ্যসমূহ' },
    items: [
      { en: 'Construct, improve, expand, operate and maintain water supply infrastructure for domestic, industrial and commercial use in the Chattogram metropolitan area', bn: 'চট্টগ্রাম মহানগর এলাকায় গৃহস্থালি, শিল্প ও বাণিজ্যিক ব্যবহারের জন্য পানি সরবরাহ অবকাঠামো নির্মাণ, উন্নয়ন, সম্প্রসারণ, পরিচালনা ও রক্ষণাবেক্ষণ' },
      { en: 'Construct, operate and maintain the sewerage system of the metropolitan area', bn: 'মহানগর এলাকার পয়ঃনিষ্কাশন ব্যবস্থা নির্মাণ, পরিচালনা ও রক্ষণাবেক্ষণ' },
      { en: 'Construct, operate and maintain rain, flood and surface water drainage systems', bn: 'বৃষ্টি, বন্যা ও ভূ-পৃষ্ঠের পানি নিষ্কাশন ব্যবস্থা নির্মাণ, পরিচালনা ও রক্ষণাবেক্ষণ' },
      { en: 'Solid waste management', bn: 'কঠিন বর্জ্য ব্যবস্থাপনা' },
    ],
  },
  {
    title: { en: 'Service Area', bn: 'সেবা এলাকা' },
    body: {
      en: 'The Chattogram metropolitan area, served through four MOD zones: MOD-1 (Agrabad), MOD-2 (Dampara), MOD-3 (Kalurghat), and MOD-4 (Jubilee Road).',
      bn: 'চট্টগ্রাম মহানগর এলাকা, চারটি মড জোনের মাধ্যমে সেবা দেওয়া হয়: মড-১ (আগ্রাবাদ), মড-২ (দামপাড়া), মড-৩ (কালুরঘাট) এবং মড-৪ (জুবিলী রোড)।',
    },
  },
];
export const aboutApp: { title: Bi; body: Bi }[] = [
  {
    title: { en: 'About the Application', bn: 'অ্যাপ সম্পর্কে' },
    body: {
      en: "The CWASA Citizen Information app puts Chattogram WASA's services, fees, offices, and emergency contacts in your pocket. This is an information service; it does not process bills or complaints directly.",
      bn: 'চট্টগ্রাম ওয়াসা নাগরিক তথ্য অ্যাপে ওয়াসার সেবা, ফি, অফিস ও জরুরি যোগাযোগ আপনার পকেটে। এটি একটি তথ্য সেবা; এখানে সরাসরি বিল বা অভিযোগ প্রক্রিয়া করা হয় না।',
    },
  },
  {
    title: { en: 'Privacy Policy', bn: 'গোপনীয়তা নীতি' },
    body: {
      en: 'The public pages collect no personal data. Language and favourite preferences are saved on your device only. External links (bill portal, complaint portal, maps) open official third-party services governed by their own policies.',
      bn: 'পাবলিক পেজগুলো কোনো ব্যক্তিগত তথ্য সংগ্রহ করে না। ভাষা ও প্রিয় তালিকার পছন্দ শুধু আপনার ডিভাইসে সংরক্ষিত থাকে। বাইরের লিংক (বিল পোর্টাল, অভিযোগ পোর্টাল, ম্যাপ) অফিসিয়াল তৃতীয় পক্ষের সেবা খোলে, যেগুলোর নিজস্ব নীতি আছে।',
    },
  },
  {
    title: { en: 'Terms of Use', bn: 'ব্যবহারের শর্তাবলি' },
    body: {
      en: "Information is provided for public convenience and is sourced from the official CWASA website. Fees, rates, and contacts may change; CWASA's official publications prevail in case of any discrepancy.",
      bn: 'তথ্য জনসাধারণের সুবিধার জন্য দেওয়া এবং ওয়াসার অফিসিয়াল ওয়েবসাইট থেকে নেওয়া। ফি, হার ও যোগাযোগ বদলাতে পারে; কোনো অমিল থাকলে ওয়াসার অফিসিয়াল প্রকাশনা প্রাধান্য পাবে।',
    },
  },
  {
    title: { en: 'Partnership', bn: 'অংশীদারিত্ব' },
    body: {
      en: 'This platform was developed by Chattogram WASA in partnership with WaterAid Bangladesh.',
      bn: 'এই প্ল্যাটফর্মটি ওয়াটারএইড বাংলাদেশের সহযোগিতায় চট্টগ্রাম ওয়াসা তৈরি করেছে।',
    },
  },
];

// Home screen tiles (id is a route)
export type HomeTile = { id: string; icon: string; title: Bi; hint: Bi };
export const homeTiles: HomeTile[] = [
  { id: 'service:new-connection', icon: '🚰', title: ui.newConnection, hint: { en: 'Apply and fees', bn: 'আবেদন ও ফি' } },
  { id: 'waterBill', icon: '🧾', title: ui.waterBill, hint: { en: 'How to pay', bn: 'পরিশোধের মাধ্যম' } },
  { id: 'tariff', icon: '৳', title: ui.tariff, hint: { en: 'Rates and fees', bn: 'হার ও ফি' } },
  { id: 'offices', icon: '🏢', title: ui.offices, hint: { en: 'Zone offices', bn: 'জোন অফিস' } },
  { id: 'forms', icon: '📄', title: ui.forms, hint: { en: 'PDF downloads', bn: 'পিডিএফ ডাউনলোড' } },
  { id: 'faq', icon: '❓', title: ui.faq, hint: { en: 'Common questions', bn: 'সচরাচর প্রশ্ন' } },
];
