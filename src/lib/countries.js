export const COUNTRIES = [
  { code: 'KR', name: 'Republic of Korea' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'JP', name: 'Japan' },
  { code: 'US', name: 'United States' },
  { code: 'CN', name: 'China' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'SG', name: 'Singapore' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'PH', name: 'Philippines' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' }
];

export function codeToFlag(code = '') {
  const cc = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) return '🏳️';
  return String.fromCodePoint(...cc.split('').map((c) => 127397 + c.charCodeAt(0)));
}

export function findCountry(query = '') {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  return (
    COUNTRIES.find((c) => c.code.toLowerCase() === q) ||
    COUNTRIES.find((c) => c.name.toLowerCase() === q) ||
    COUNTRIES.find((c) => `${c.code} - ${c.name}`.toLowerCase() === q)
  );
}
