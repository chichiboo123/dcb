// Singleton promise — the <script> tag is injected at most once per page load.
let loadPromise = null;
const SCRIPT_ID = 'google-maps-js';
const GOOGLE_MAPS_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  || import.meta.env.VITE_GOOGLE_MAP_API_KEY
  || window.__APP_ENV__?.VITE_GOOGLE_MAPS_API_KEY
  || '';


function resolveMapsLanguage() {
  const saved = (window.localStorage?.getItem('i18nextLng') || '').toLowerCase();
  if (saved) return saved.split('-')[0];
  const htmlLang = (document.documentElement.lang || '').toLowerCase();
  if (htmlLang) return htmlLang.split('-')[0];
  const nav = (navigator.language || 'ko').toLowerCase();
  return nav.split('-')[0];
}

export function loadGoogleMapsAPI() {
  if (loadPromise) return loadPromise;
  if (window.google?.maps?.places) {
    loadPromise = Promise.resolve();
    return loadPromise;
  }
  loadPromise = new Promise((resolve, reject) => {
    const key = GOOGLE_MAPS_KEY?.trim();
    if (!key) {
      loadPromise = null;
      reject(new Error('Google Maps API key is missing. Set VITE_GOOGLE_MAPS_API_KEY (or VITE_GOOGLE_MAP_API_KEY).'));
      return;
    }
    const waitForMapsReady = (resolveReady, rejectReady) => {
      const startedAt = Date.now();
      const tick = () => {
        if (window.google?.maps?.places) {
          resolveReady();
          return;
        }
        if (Date.now() - startedAt > 7000) {
          rejectReady(new Error('Google Maps loaded timeout: places library not ready'));
          return;
        }
        setTimeout(tick, 40);
      };
      tick();
    };

    const previousAuthFailure = window.gm_authFailure;
    window.gm_authFailure = () => {
      loadPromise = null;
      reject(new Error('Google Maps authentication failed (API key/referrer/billing).'));
      if (typeof previousAuthFailure === 'function') previousAuthFailure();
    };

    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      waitForMapsReady(resolve, reject);
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    const language = encodeURIComponent(resolveMapsLanguage());
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&v=weekly&loading=async&language=${language}`;
    script.async = true;
    script.defer = true;
    script.onload = () => waitForMapsReady(resolve, reject);
    script.onerror = () => {
      loadPromise = null;
      reject(new Error('Google Maps script failed to load'));
    };
    document.head.appendChild(script);
  });
  return loadPromise;
}

export const HAS_MAPS_KEY = Boolean(GOOGLE_MAPS_KEY?.trim());

export function getGoogleMapsKeyDebugInfo() {
  return {
    hasViteGoogleMaps: Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY),
    hasViteGoogleMap: Boolean(import.meta.env.VITE_GOOGLE_MAP_API_KEY),
    hasRuntimeAppEnv: Boolean(window.__APP_ENV__?.VITE_GOOGLE_MAPS_API_KEY),
    hasKey: HAS_MAPS_KEY,
  };
}

export const SCHOOL_TYPES = ['school', 'university', 'primary_school', 'secondary_school'];

// Cache for localized place details: "placeId::lang" → { name, address }
const _placeCache = new Map();
const _placePending = new Map();

export async function fetchPlaceLocalized(placeId, lang) {
  if (!placeId || !HAS_MAPS_KEY || !lang) return null;
  const cacheKey = `${placeId}::${lang}`;
  if (_placeCache.has(cacheKey)) return _placeCache.get(cacheKey);
  if (_placePending.has(cacheKey)) return _placePending.get(cacheKey);

  const pending = (async () => {
    try {
      await loadGoogleMapsAPI();
      const PlacesService = window.google?.maps?.places?.PlacesService;
      if (!PlacesService) return null;
      const div = document.createElement('div');
      const service = new PlacesService(div);
      return await new Promise((resolve) => {
        service.getDetails(
          { placeId, language: lang, fields: ['name', 'formatted_address'] },
          (result, status) => {
            const OK = window.google?.maps?.places?.PlacesServiceStatus?.OK;
            if (status === OK && result) {
              resolve({ name: result.name || '', address: result.formatted_address || '' });
            } else {
              resolve(null);
            }
          }
        );
      });
    } catch {
      return null;
    } finally {
      _placePending.delete(cacheKey);
    }
  })();

  _placePending.set(cacheKey, pending);
  const result = await pending;
  if (result) _placeCache.set(cacheKey, result);
  return result;
}

export const PASTEL_MAP_STYLES = [
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#BFDBFE' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#93C5FD' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#F1F5F9' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#E2EFF8' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#CBD5E1' }, { weight: 0.7 }] },
  { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#94A3B8' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#64748B' }] },
  { featureType: 'road', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
];
