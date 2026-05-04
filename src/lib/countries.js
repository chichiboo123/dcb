import countryTsvRaw from '../data/countries.tsv?raw';

const COUNTRY_CODES = [
  'AF','AL','DZ','AD','AO','AR','AM','AU','AT','AZ','BH','BD','BY','BE','BZ','BJ','BO','BA','BW','BR','BN','BG','KH','CM','CA','CL','CN','CO','CR','HR','CU','CY','CZ','DK','DO','EC','EG','SV','EE','ET','FI','FR','GE','DE','GH','GR','GT','HN','HK','HU','IS','IN','ID','IR','IQ','IE','IL','IT','JM','JP','JO','KZ','KE','KW','KG','LA','LV','LB','LY','LT','LU','MO','MK','MG','MY','MV','MT','MX','MD','MN','ME','MA','MM','NP','NL','NZ','NI','NG','NO','OM','PK','PA','PY','PE','PH','PL','PT','QA','RO','RU','SA','RS','SG','SK','SI','ZA','KR','ES','LK','SE','CH','TW','TJ','TZ','TH','TN','TR','UG','UA','AE','GB','US','UY','UZ','VE','VN','YE','ZM','ZW',
];

export const COUNTRIES = [...new Set(COUNTRY_CODES)];

function toTitleCaseIfAllCaps(value = '') {
  if (!value) return value;
  if (/[a-z]/.test(value)) return value;
  return value
    .toLowerCase()
    .replace(/\b[a-z]/g, (ch) => ch.toUpperCase());
}

function parseCountryTsv(raw = '') {
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return { ko: {}, en: {} };
  const start = lines[0].toLowerCase().startsWith('code\t') ? 1 : 0;
  const ko = {};
  const en = {};
  for (const line of lines.slice(start)) {
    const [codeRaw, koName = '', enName = ''] = line.split('\t');
    const code = (codeRaw || '').trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(code) || ko[code]) continue;
    ko[code] = koName.trim() || code;
    en[code] = toTitleCaseIfAllCaps(enName.trim()) || code;
  }
  return { ko, en };
}

const TSV_NAMES = parseCountryTsv(countryTsvRaw);

export function codeToFlag(code=''){const cc=code.trim().toUpperCase();if(!/^[A-Z]{2}$/.test(cc)) return '🏳️';return String.fromCodePoint(...cc.split('').map(c=>127397+c.charCodeAt(0)));}
export function getFlagImageUrl(code=''){const cc=code.trim().toLowerCase();if(!/^[a-z]{2}$/.test(cc)) return '';return `https://flagcdn.com/w40/${cc}.png`;}

export function getLocalizedCountryName(code, language='en') {
  const normalizedCode = code.toUpperCase();
  const locale = language?.split('-')[0] || 'en';
  if (locale === 'ko' && TSV_NAMES.ko[normalizedCode]) return TSV_NAMES.ko[normalizedCode];
  if (locale === 'en' && TSV_NAMES.en[normalizedCode]) return TSV_NAMES.en[normalizedCode];

  try {
    const dn = new Intl.DisplayNames([locale], { type: 'region' });
    return dn.of(normalizedCode) || normalizedCode;
  } catch {
    return normalizedCode;
  }
}

export function findCountry(query='', language='en'){
  const q=query.trim().toLowerCase();
  if(!q) return null;
  return COUNTRIES.map((code)=>({code,name:getLocalizedCountryName(code, language)})).find(c=>
    c.code.toLowerCase()===q ||
    c.name.toLowerCase()===q ||
    `${c.code} - ${c.name}`.toLowerCase()===q ||
    c.name.toLowerCase().includes(q)
  ) || null;
}
