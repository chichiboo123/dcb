const COUNTRY_CODES = [
  'AF','AL','DZ','AD','AO','AR','AM','AU','AT','AZ','BH','BD','BY','BE','BZ','BJ','BO','BA','BW','BR','BN','BG','KH','CM','CA','CL','CN','CO','CR','HR','CU','CY','CZ','DK','DO','EC','EG','SV','EE','ET','FI','FR','GE','DE','GH','GR','GT','HN','HK','HU','IS','IN','ID','IR','IQ','IE','IL','IT','JM','JP','JO','KZ','KE','KW','KG','LA','LV','LB','LY','LT','LU','MO','MK','MG','MY','MV','MT','MX','MD','MN','ME','MA','MM','NP','NL','NZ','NI','NG','NO','OM','PK','PA','PY','PE','PH','PL','PT','QA','RO','RU','SA','RS','SG','SK','SI','ZA','KR','ES','LK','SE','CH','TW','TJ','TZ','TH','TN','TR','UG','UA','AE','GB','US','UY','UZ','VE','VN','YE','ZM','ZW',
];

export const COUNTRIES = [...new Set(COUNTRY_CODES)];

const COUNTRY_NAME_OVERRIDES = {
  en: {
    KR: 'Republic of Korea',
    KP: "Democratic People's Republic of Korea",
    US: 'United States of America',
    GB: 'United Kingdom of Great Britain and Northern Ireland',
    PS: 'Palestine',
    AX: 'Aland Islands',
    SJ: 'Svalbard',
    CX: 'Christmas Islands',
    CC: 'Cocos (Keeling) Islands',
    NF: 'Norfolk Island',
    GF: 'French Guiana',
  },
};

export function codeToFlag(code=''){const cc=code.trim().toUpperCase();if(!/^[A-Z]{2}$/.test(cc)) return '🏳️';return String.fromCodePoint(...cc.split('').map(c=>127397+c.charCodeAt(0)));}
export function getFlagImageUrl(code=''){const cc=code.trim().toLowerCase();if(!/^[a-z]{2}$/.test(cc)) return '';return `https://flagcdn.com/w40/${cc}.png`;}

export function getLocalizedCountryName(code, language='en') {
  const normalizedCode = code.toUpperCase();
  const locale = language?.split('-')[0] || 'en';
  const override = COUNTRY_NAME_OVERRIDES[locale]?.[normalizedCode];
  if (override) return override;

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
