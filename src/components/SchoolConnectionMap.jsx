import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, MapPin } from 'lucide-react';
import { useBoxData } from '../store/BoxDataContext.jsx';
import { loadGoogleMapsAPI, HAS_MAPS_KEY, PASTEL_MAP_STYLES, getGoogleMapsKeyDebugInfo } from '../lib/googleMaps.js';

const DASH_SYMBOL = {
  path: 'M 0,-1 0,1',
  strokeOpacity: 1,
  strokeColor: '#4A90E2',
  scale: 4,
};

function infoWindowContent(school, address, flag) {
  return `
    <div style="font-family:system-ui,sans-serif;padding:6px 8px;max-width:220px;line-height:1.5;">
      <div style="font-weight:800;font-size:13px;color:#0F172A;">
        ${flag ? `<span style="margin-right:4px;">${flag}</span>` : ''}${school}
      </div>
      <div style="font-size:11px;color:#64748B;margin-top:2px;">${address}</div>
    </div>
  `;
}

export default function SchoolConnectionMap() {
  const { t } = useTranslation();
  const { data } = useBoxData();

  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const polylinesRef = useRef([]);
  const markersRef = useRef([]);
  const infoWindowsRef = useRef([]);
  const animRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  // Only exchanges that have real coordinates for both sides
  const validExchanges = useMemo(
    () =>
      data.exchanges.filter(
        (ex) =>
          typeof ex.from?.lat === 'number' &&
          typeof ex.from?.lng === 'number' &&
          typeof ex.to?.lat === 'number' &&
          typeof ex.to?.lng === 'number'
      ),
    [data.exchanges]
  );

  // Load Google Maps once
  useEffect(() => {
    if (!HAS_MAPS_KEY) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn('[GoogleMaps] Missing key debug info:', getGoogleMapsKeyDebugInfo());
      }
      setError(t('map.noApiKey'));
      return;
    }
    loadGoogleMapsAPI()
      .then(() => setReady(true))
      .catch(() => setError(t('map.loadError')));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize map after API is ready
  useEffect(() => {
    if (!ready || !mapDivRef.current || mapRef.current) return;
    mapRef.current = new window.google.maps.Map(mapDivRef.current, {
      center: { lat: 20, lng: 10 },
      zoom: 2,
      minZoom: 1,
      maxZoom: 16,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
      },
      styles: PASTEL_MAP_STYLES,
    });
  }, [ready]);

  // Draw / redraw connections whenever exchange data changes
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;

    // Clear previous animation
    if (animRef.current) { clearInterval(animRef.current); animRef.current = null; }

    // Clear previous map objects
    polylinesRef.current.forEach((pl) => pl.setMap(null));
    markersRef.current.forEach((m) => m.setMap(null));
    infoWindowsRef.current.forEach((iw) => iw.close());
    polylinesRef.current = [];
    markersRef.current = [];
    infoWindowsRef.current = [];

    if (validExchanges.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();

    // De-duplicate markers: key = "lat4,lng4"
    const drawnMarkers = new Map();

    const addMarker = (pos, school, address, flag, fillColor) => {
      const key = `${pos.lat.toFixed(4)},${pos.lng.toFixed(4)}`;
      if (drawnMarkers.has(key)) return;

      const marker = new window.google.maps.Marker({
        position: pos,
        map,
        title: school,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 11,
          fillColor,
          fillOpacity: 0.95,
          strokeColor: '#ffffff',
          strokeWeight: 2.5,
        },
        zIndex: 10,
      });

      const iw = new window.google.maps.InfoWindow({
        content: infoWindowContent(school, address, flag),
        disableAutoPan: false,
      });

      marker.addListener('click', () => {
        infoWindowsRef.current.forEach((w) => w.close());
        iw.open(map, marker);
      });

      markersRef.current.push(marker);
      infoWindowsRef.current.push(iw);
      drawnMarkers.set(key, true);
    };

    validExchanges.forEach((ex) => {
      const posFrom = { lat: ex.from.lat, lng: ex.from.lng };
      const posTo   = { lat: ex.to.lat,   lng: ex.to.lng };

      bounds.extend(posFrom);
      bounds.extend(posTo);

      // Animated dashed geodesic polyline
      const pl = new window.google.maps.Polyline({
        path: [posFrom, posTo],
        geodesic: true,
        strokeColor: '#4A90E2',
        strokeOpacity: 0,          // solid base hidden; dashes drawn via icons
        strokeWeight: 3,
        icons: [{ icon: DASH_SYMBOL, offset: '0%', repeat: '22px' }],
      });
      pl.setMap(map);
      polylinesRef.current.push(pl);

      addMarker(posFrom, ex.from.school, ex.from.address, ex.from.flag, '#38bdf8');
      addMarker(posTo,   ex.to.school,   ex.to.address,   ex.to.flag,   '#f472b6');
    });

    // Fit all markers into view
    if (!bounds.isEmpty()) {
      const padding = validExchanges.length === 1 ? 100 : 70;
      map.fitBounds(bounds, padding);
    }

    // Sync-animate all polylines together
    let tick = 0;
    animRef.current = setInterval(() => {
      tick = (tick + 1) % 200;
      const offset = `${(tick / 200) * 100}%`;
      polylinesRef.current.forEach((pl) => {
        pl.set('icons', [{ icon: DASH_SYMBOL, offset, repeat: '22px' }]);
      });
    }, 40);

    return () => {
      if (animRef.current) { clearInterval(animRef.current); animRef.current = null; }
    };
  }, [validExchanges, ready]);

  // Final cleanup on unmount
  useEffect(
    () => () => { if (animRef.current) clearInterval(animRef.current); },
    []
  );

  const hasAnyExchanges = data.exchanges.length > 0;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-24">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 border border-sky-200 px-4 py-1.5 text-sky-700 text-xs font-bold mb-3">
          <Globe size={13} aria-hidden="true" />
          {t('map.sectionBadge')}
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-800">
          {t('map.title')}
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 max-w-md mx-auto">
          {t('map.subtitle')}
        </p>
      </div>

      {/* Map container — always fixed height */}
      <div
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          height: '460px',
          border: '1px solid rgba(148, 163, 184, 0.25)',
          boxShadow: '0 4px 28px rgba(74, 144, 226, 0.11), 0 2px 8px rgba(0,0,0,0.06)',
          position: 'relative',
        }}
      >
        {/* Error state — no API key */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 gap-3 text-center px-6 z-10">
            <Globe size={36} className="text-slate-300" aria-hidden="true" />
            <p className="text-sm font-semibold text-slate-500 max-w-xs">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {!error && !ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
            <div className="flex items-center gap-2.5 text-slate-500 text-sm">
              <div className="w-4 h-4 border-2 border-sky-300 border-t-sky-600 rounded-full animate-spin" />
              {t('app.loading')}
            </div>
          </div>
        )}

        {/* Empty state overlay — map loaded but no valid coordinates yet */}
        {ready && validExchanges.length === 0 && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10 pointer-events-none"
            style={{ background: 'rgba(248, 250, 252, 0.75)', backdropFilter: 'blur(1px)' }}
          >
            <MapPin size={32} className="text-sky-300" aria-hidden="true" />
            <p className="text-sm font-semibold text-slate-500 text-center px-4 max-w-xs">
              {hasAnyExchanges ? t('map.noCoords') : t('map.noExchanges')}
            </p>
          </div>
        )}

        {/* The actual Google Map — rendered even during loading so the div exists */}
        <div ref={mapDivRef} className="w-full h-full" />
      </div>

      {/* Connection list below map */}
      {validExchanges.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {validExchanges.map((ex) => (
            <div key={ex.id} className="flex items-center gap-2 text-xs text-slate-500">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: '#38bdf8' }}
                aria-hidden="true"
              />
              <span className="font-semibold text-slate-700 max-w-[140px] truncate" title={ex.from.school}>
                {ex.from.school || ex.from.country}
              </span>
              <span className="text-slate-300" aria-hidden="true">──</span>
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: '#f472b6' }}
                aria-hidden="true"
              />
              <span className="font-semibold text-slate-700 max-w-[140px] truncate" title={ex.to.school}>
                {ex.to.school || ex.to.country}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
