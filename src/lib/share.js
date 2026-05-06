// URL-safe base64 (no padding) encode/decode helpers for sharing box JSON.
// The payload is packed with short keys and empty fields dropped to keep
// share URLs as compact as possible.

function toBase64Url(bytes) {
  let str = '';
  for (let i = 0; i < bytes.length; i += 1) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s) {
  const pad = s.length % 4 === 0 ? 0 : 4 - (s.length % 4);
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// Short-key dictionaries shrink the encoded JSON without changing app shape.
const EX_KEYS = {
  id: 'i', theme: 't', trackingNo: 'n', date: 'd', weight: 'w',
  contents: 'c', message: 'm', embedUrl: 'u', from: 'f', to: 'o',
};
const LOC_KEYS = {
  school: 's', country: 'k', countryCode: 'z', flag: 'g',
  address: 'a', lat: 'x', lng: 'y', placeId: 'p',
};
const EX_KEYS_REV = Object.fromEntries(Object.entries(EX_KEYS).map(([k, v]) => [v, k]));
const LOC_KEYS_REV = Object.fromEntries(Object.entries(LOC_KEYS).map(([k, v]) => [v, k]));

const DEFAULT_FLAG = '🏳️';
const isEmpty = (v) => v === '' || v == null || v === DEFAULT_FLAG;

function packLocation(loc) {
  if (!loc) return undefined;
  const out = {};
  for (const [k, v] of Object.entries(loc)) {
    if (isEmpty(v)) continue;
    const sk = LOC_KEYS[k];
    if (sk) out[sk] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

function unpackLocation(packed) {
  const base = {
    school: '', country: '', countryCode: '', flag: DEFAULT_FLAG,
    address: '', lat: null, lng: null, placeId: '',
  };
  if (!packed) return base;
  for (const [sk, v] of Object.entries(packed)) {
    const lk = LOC_KEYS_REV[sk];
    if (lk) base[lk] = v;
  }
  return base;
}

function packExchange(ex) {
  const out = {};
  for (const [k, v] of Object.entries(ex)) {
    const sk = EX_KEYS[k];
    if (!sk) continue;
    if (k === 'from' || k === 'to') {
      const packed = packLocation(v);
      if (packed) out[sk] = packed;
    } else if (!isEmpty(v)) {
      out[sk] = v;
    }
  }
  return out;
}

function unpackExchange(packed) {
  const out = {
    id: '', theme: 'blue', trackingNo: '', date: '', weight: '',
    contents: '', message: '', embedUrl: '',
    from: unpackLocation(null),
    to: unpackLocation(null),
  };
  for (const [sk, v] of Object.entries(packed || {})) {
    const k = EX_KEYS_REV[sk];
    if (!k) continue;
    if (k === 'from' || k === 'to') out[k] = unpackLocation(v);
    else out[k] = v;
  }
  return out;
}

export function encodeShareData(data) {
  const compact = { e: (data?.exchanges || []).map(packExchange) };
  const json = JSON.stringify(compact);
  return toBase64Url(new TextEncoder().encode(json));
}

export function decodeShareData(token) {
  try {
    const json = new TextDecoder().decode(fromBase64Url(token));
    const parsed = JSON.parse(json);
    if (parsed && Array.isArray(parsed.e)) {
      return { exchanges: parsed.e.map(unpackExchange) };
    }
    // Backward compat: accept the older verbose format.
    if (parsed && Array.isArray(parsed.exchanges)) return parsed;
  } catch {
    // ignore — return null on any failure
  }
  return null;
}

// mode='host' keeps the /host path so the recipient also opens in host view.
export function buildShareUrl(data, mode = 'guest') {
  const token = encodeShareData(data);
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  url.pathname = mode === 'host' ? '/host' : '/';
  url.searchParams.set('d', token);
  return url.toString();
}

export function readShareTokenFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('d');
  } catch {
    return null;
  }
}
