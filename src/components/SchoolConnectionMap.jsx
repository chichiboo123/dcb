import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Search, X, MapPin } from 'lucide-react';

const SCHOOL_TYPES = ['school', 'university', 'primary_school', 'secondary_school'];

// Singleton promise so the script is injected only once
let mapsLoadPromise = null;

function loadGoogleMapsAPI() {
  if (mapsLoadPromise) return mapsLoadPromise;
  if (window.google?.maps?.places) {
    mapsLoadPromise = Promise.resolve();
    return mapsLoadPromise;
  }
  mapsLoadPromise = new Promise((resolve, reject) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => {
      mapsLoadPromise = null;
      reject(new Error('Google Maps script failed to load'));
    };
    document.head.appendChild(script);
  });
  return mapsLoadPromise;
}

const PASTEL_MAP_STYLES = [
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#BFDBFE' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#7FB3E8' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#F1F5F9' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#E2EFF5' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#CBD5E1' }, { weight: 0.8 }] },
  { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#94A3B8' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#64748B' }] },
  { featureType: 'road', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
];

const SCHOOL_COLORS = ['#38bdf8', '#f472b6'];
const SCHOOL_LABELS = ['A', 'B'];

export default function SchoolConnectionMap() {
  const { t } = useTranslation();
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const polylineRef = useRef(null);
  const animRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowsRef = useRef([]);
  const inputRefs = useRef([null, null]);
  const acRefs = useRef([null, null]);

  const [schools, setSchools] = useState([null, null]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  // Load Google Maps API once
  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) {
      setError('VITE_GOOGLE_MAPS_API_KEY is not configured in .env');
      return;
    }
    loadGoogleMapsAPI()
      .then(() => setReady(true))
      .catch(() => setError('Google Maps API failed to load. Check your API key.'));
  }, []);

  // Initialize map once API is ready
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

  // Set up Autocomplete widgets after map is initialized
  useEffect(() => {
    if (!ready) return;

    [0, 1].forEach((idx) => {
      if (!inputRefs.current[idx] || acRefs.current[idx]) return;

      const ac = new window.google.maps.places.Autocomplete(inputRefs.current[idx], {
        fields: ['name', 'formatted_address', 'geometry', 'place_id'],
        // Classic Places API: broad 'establishment' + school filter via includedPrimaryTypes (New API)
        types: ['school'],
        // New Places API: precise school type filtering
        includedPrimaryTypes: SCHOOL_TYPES,
      });

      ac.addListener('place_changed', () => {
        const place = ac.getPlace();
        if (!place?.geometry?.location) return;
        setSchools((prev) => {
          const next = [...prev];
          next[idx] = {
            name: place.name || '',
            address: place.formatted_address || '',
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            placeId: place.place_id || '',
          };
          return next;
        });
      });

      acRefs.current[idx] = ac;
    });
  }, [ready]);

  // Draw / clear polyline and markers when both schools change
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;

    // Clear previous animation
    if (animRef.current) {
      clearInterval(animRef.current);
      animRef.current = null;
    }
    // Clear previous polyline
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    // Clear previous markers + info windows
    markersRef.current.forEach((m) => m.setMap(null));
    infoWindowsRef.current.forEach((iw) => iw.close());
    markersRef.current = [];
    infoWindowsRef.current = [];

    if (!schools[0] || !schools[1]) return;

    const positions = schools.map((s) => ({ lat: s.lat, lng: s.lng }));

    // Place markers
    positions.forEach((pos, i) => {
      const marker = new window.google.maps.Marker({
        position: pos,
        map,
        title: schools[i].name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 11,
          fillColor: SCHOOL_COLORS[i],
          fillOpacity: 0.95,
          strokeColor: '#ffffff',
          strokeWeight: 2.5,
        },
        zIndex: 10,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="font-family:system-ui,sans-serif;padding:6px 8px;max-width:220px;">
          <div style="font-weight:700;font-size:13px;color:#0F172A;margin-bottom:2px;">${schools[i].name}</div>
          <div style="font-size:11px;color:#64748B;line-height:1.4;">${schools[i].address}</div>
        </div>`,
        disableAutoPan: false,
      });

      marker.addListener('click', () => {
        infoWindowsRef.current.forEach((iw) => iw.close());
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
      infoWindowsRef.current.push(infoWindow);
    });

    // Animated dashed geodesic polyline
    const dashSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      strokeColor: '#4A90E2',
      scale: 4,
    };

    polylineRef.current = new window.google.maps.Polyline({
      path: positions,
      geodesic: true,
      strokeColor: '#4A90E2',
      strokeOpacity: 0,       // hide the solid base; dashes drawn via icons
      strokeWeight: 3,
      icons: [{ icon: dashSymbol, offset: '0%', repeat: '22px' }],
    });
    polylineRef.current.setMap(map);

    // Animate the dash offset
    let tick = 0;
    animRef.current = setInterval(() => {
      tick = (tick + 1) % 200;
      if (polylineRef.current) {
        polylineRef.current.set('icons', [{
          icon: dashSymbol,
          offset: `${(tick / 200) * 100}%`,
          repeat: '22px',
        }]);
      }
    }, 40);

    // Fit both markers into view
    const bounds = new window.google.maps.LatLngBounds();
    positions.forEach((pos) => bounds.extend(pos));
    map.fitBounds(bounds, { top: 80, right: 80, bottom: 80, left: 80 });
  }, [schools, ready]);

  // Clear animation on unmount
  useEffect(() => () => {
    if (animRef.current) clearInterval(animRef.current);
  }, []);

  const clearSchool = (idx) => {
    setSchools((prev) => {
      const next = [...prev];
      next[idx] = null;
      return next;
    });
    if (inputRefs.current[idx]) inputRefs.current[idx].value = '';
  };

  return (
    <section className="mx-auto max-w-6xl px-4 pb-24">
      {/* Section header */}
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

      {/* Search inputs */}
      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        {[0, 1].map((idx) => (
          <div key={idx}>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-1.5">
              <span
                className="w-5 h-5 rounded-full inline-flex items-center justify-center text-white text-[10px] font-black shrink-0"
                style={{ background: SCHOOL_COLORS[idx] }}
                aria-hidden="true"
              >
                {SCHOOL_LABELS[idx]}
              </span>
              {t(`map.school${SCHOOL_LABELS[idx]}`)}
            </label>

            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                placeholder={t('map.searchPlaceholder')}
                disabled={!ready && !error}
                className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-slate-200 outline-none
                  focus:border-sky-400 focus:ring-2 focus:ring-sky-100
                  disabled:bg-slate-50 disabled:text-slate-400
                  transition-all"
                style={{
                  borderRadius: '12px',
                  boxShadow: '0 2px 12px rgba(74, 144, 226, 0.07)',
                }}
              />
              {schools[idx] && (
                <button
                  type="button"
                  onClick={() => clearSchool(idx)}
                  aria-label={t('viewer.close')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full
                    text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {schools[idx] && (
              <div
                className="mt-1.5 px-3 py-2 text-xs text-slate-700"
                style={{
                  borderRadius: '10px',
                  background: 'rgba(240, 249, 255, 0.9)',
                  border: '1px solid #BAE6FD',
                  boxShadow: '0 1px 6px rgba(74, 144, 226, 0.09)',
                }}
              >
                <div className="font-bold truncate">{schools[idx].name}</div>
                <div className="text-slate-500 truncate mt-0.5">{schools[idx].address}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Map container */}
      <div
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          height: '480px',
          border: '1px solid rgba(148, 163, 184, 0.25)',
          boxShadow: '0 4px 28px rgba(74, 144, 226, 0.11), 0 2px 8px rgba(0, 0, 0, 0.06)',
        }}
      >
        {error ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 gap-2 text-center px-6">
            <Globe size={32} className="text-slate-300" />
            <p className="text-sm font-semibold text-slate-500">{error}</p>
          </div>
        ) : !ready ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-50">
            <div className="flex items-center gap-2.5 text-slate-500 text-sm">
              <div className="w-4 h-4 border-2 border-sky-300 border-t-sky-600 rounded-full animate-spin" />
              {t('app.loading')}
            </div>
          </div>
        ) : (
          <div ref={mapDivRef} className="w-full h-full" />
        )}
      </div>

      {/* Connection label */}
      {schools[0] && schools[1] && (
        <div className="mt-3.5 flex items-center justify-center gap-2 text-xs text-slate-500 flex-wrap">
          <MapPin size={12} className="text-sky-400 shrink-0" aria-hidden="true" />
          <span
            className="font-semibold text-slate-700 max-w-[200px] truncate"
            title={schools[0].name}
          >
            {schools[0].name}
          </span>
          <span
            className="w-8 h-px shrink-0"
            style={{ background: 'linear-gradient(90deg, #38bdf8, #4A90E2, #f472b6)' }}
            aria-hidden="true"
          />
          <span
            className="font-semibold text-slate-700 max-w-[200px] truncate"
            title={schools[1].name}
          >
            {schools[1].name}
          </span>
        </div>
      )}
    </section>
  );
}
