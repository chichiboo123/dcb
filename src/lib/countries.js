import countryTsvRaw from '../data/countries.tsv?raw';

const COUNTRY_CODES = [
  'KR','KP','AF','BD','BT','MM','BN','TW','CN','GU','HK','IN','ID','IO','JP','LA','MO','MY','MV','MP','MN','NP','PK','PH','SG','LK','VN','TH','KH',
  'BH','CY','IR','IQ','IL','JO','KW','LB','OM','PS','QA','SA','SY','TR','AE','YE',
  'AL','AM','AZ','AD','AT','HR','BA','BG','BE','BY','DK','CZ','SK','FI','FR','EE','GE','DE','GI','GR','HU','GL','IS','IE','IT','KZ','KG','IM','LI','LV','LU','LT','MK','MT','MD','MC','NL','NO','PL','PT','RO','SM','ES','YU','SE','CH','GB','RU','VA','JE','TJ','TM','UA','UZ','SI','AX','SJ',
  'CA','US','PM','AI','AN','AR','AG','AW','VG','BS','BB','BM','BO','BR','BZ','KY','CL','CO','CR','CU','DO','DM','EC','SV','FK','GF','GT','GD','GP','GY','HT','HN','JM','MQ','MS','MX','NI','PA','PY','PE','PR','KN','LC','SR','VC','TT','TC','UY','VE','VI',
  'DZ','AO','BJ','BW','BI','KM','SS','CM','CV','CF','TD','CG','CI','DJ','EG','GQ','ET','ER','BF','GA','GM','GH','GN','GW','KE','LS','LR','LY','MG','MW','ML','MR','MU','MA','MZ','YT','NE','NG','NA','RE','ZA','RW','EH','ST','SN','SC','SL','SO','SD','SZ','SH','TG','TN','UG','TZ','CD','ZM','ZW',
  'AU','FJ','NZ','NC','TF','PF','HM','FM','NR','PW','PG','SB','GS','CX','CC','NF','TO','WS','AS','TV','CK','KI','MH','NU','PN','TK','VU','WF','FO',
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
