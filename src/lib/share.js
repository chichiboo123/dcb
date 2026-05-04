// URL-safe base64 (no padding) encode/decode helpers for sharing box JSON.

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

export function encodeShareData(data) {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  return toBase64Url(bytes);
}

export function decodeShareData(token) {
  try {
    const bytes = fromBase64Url(token);
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json);
    if (parsed && Array.isArray(parsed.exchanges)) return parsed;
  } catch {
    // ignore — return null on any failure
  }
  return null;
}

export function buildShareUrl(data) {
  const token = encodeShareData(data);
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  url.pathname = '/';
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
