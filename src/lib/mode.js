// Mode detection: '/host' (and '/host/...') => host, otherwise => guest.

export function getMode() {
  if (typeof window === 'undefined') return 'guest';
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path === '/host' || path.startsWith('/host/')) return 'host';
  return 'guest';
}

export function makeEmptyExchange(theme = 'blue') {
  return {
    id: `ex-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    theme,
    trackingNo: `DCB-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().slice(0, 10),
    weight: '2.0 kg',
    contents: '',
    message: '',
    embedUrl: '',
    from: { school: '', country: '', countryCode: '', flag: '🏳️', address: '' },
    to: { school: '', country: '', countryCode: '', flag: '🏳️', address: '' },
  };
}
