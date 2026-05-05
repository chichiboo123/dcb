// Singleton promise — the <script> tag is injected at most once per page load.
let loadPromise = null;
const SCRIPT_ID = 'google-maps-js';
const GOOGLE_MAPS_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  || import.meta.env.VITE_GOOGLE_MAP_API_KEY
  || window.__APP_ENV__?.VITE_GOOGLE_MAPS_API_KEY
  || '';

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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&v=weekly&loading=async`;
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
