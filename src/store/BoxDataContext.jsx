import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { decodeShareData, readShareTokenFromUrl } from '../lib/share.js';
import { getMode, makeEmptyExchange } from '../lib/mode.js';

const HOST_STORAGE_KEY = 'dcb.boxData.v2';

/**
 * Host mode default data — admin-curated boxes shown via /host.
 * Admin edits in admin mode are persisted to localStorage on top of this.
 */
const hostDefaultData = {
  exchanges: [
    {
      id: 'kr-id',
      theme: 'blue',
      trackingNo: 'DCB-2026-0001-KR-ID',
      date: '2026-05-04',
      weight: '2.4 kg',
      contents: '전통 과자, 손편지, 학교 깃발, 사진 앨범',
      message:
        '안녕! 우리는 한국에서 따뜻한 마음을 보내. 우리 문화를 즐겨주길 바라!\nHalo teman! Kami mengirim kehangatan dari Korea.',
      embedUrl: 'https://padlet.com/embed/your-padlet-id-1',
      from: {
        school: '꿈꾸는 초등학교',
        country: 'Republic of Korea',
        countryCode: 'KR',
        flag: '🇰🇷',
        address: '서울특별시 종로구 세종대로 1길',
        lat: 37.5665,
        lng: 126.9780,
        placeId: '',
      },
      to: {
        school: 'SD Harapan Bangsa',
        country: 'Indonesia',
        countryCode: 'ID',
        flag: '🇮🇩',
        address: 'Jl. Merdeka No. 17, Jakarta Pusat',
        lat: -6.2088,
        lng: 106.8456,
        placeId: '',
      },
    },
    {
      id: 'id-kr',
      theme: 'pink',
      trackingNo: 'DCB-2026-0002-ID-KR',
      date: '2026-05-18',
      weight: '2.1 kg',
      contents: 'Batik, surat, foto sekolah, makanan tradisional',
      message:
        'Halo! Kami mengirim cinta dari Indonesia. Selamat menikmati budaya kami!\n안녕! 우리는 인도네시아에서 사랑을 보내.',
      embedUrl: 'https://padlet.com/embed/your-padlet-id-2',
      from: {
        school: 'SD Harapan Bangsa',
        country: 'Indonesia',
        countryCode: 'ID',
        flag: '🇮🇩',
        address: 'Jl. Merdeka No. 17, Jakarta Pusat',
        lat: -6.2088,
        lng: 106.8456,
        placeId: '',
      },
      to: {
        school: '꿈꾸는 초등학교',
        country: 'Republic of Korea',
        countryCode: 'KR',
        flag: '🇰🇷',
        address: '서울특별시 종로구 세종대로 1길',
        lat: 37.5665,
        lng: 126.9780,
        placeId: '',
      },
    },
  ],
};

const BoxDataContext = createContext(null);

function loadHostData() {
  try {
    const raw = localStorage.getItem(HOST_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.exchanges?.length) return parsed;
    }
  } catch {
    /* empty */
  }
  return hostDefaultData;
}

function loadGuestInitialData() {
  const token = readShareTokenFromUrl();
  if (token) {
    const decoded = decodeShareData(token);
    if (decoded?.exchanges?.length) return decoded;
  }
  return { exchanges: [] };
}

export function BoxDataProvider({ children }) {
  const mode = useMemo(() => getMode(), []);
  const sharedFromUrl = useMemo(
    () => (mode === 'guest' ? readShareTokenFromUrl() != null : false),
    [mode]
  );

  const [data, setData] = useState(() =>
    mode === 'host' ? loadHostData() : loadGuestInitialData()
  );

  // Only persist host data to localStorage. Guest data is volatile (URL-shared).
  useEffect(() => {
    if (mode !== 'host') return;
    try {
      localStorage.setItem(HOST_STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* empty */
    }
  }, [data, mode]);

  const updateExchange = useCallback((id, patch) => {
    setData((prev) => ({
      ...prev,
      exchanges: prev.exchanges.map((ex) =>
        ex.id === id
          ? {
              ...ex,
              ...patch,
              from: { ...ex.from, ...(patch.from || {}) },
              to: { ...ex.to, ...(patch.to || {}) },
            }
          : ex
      ),
    }));
  }, []);

  const addExchange = useCallback((seed) => {
    const isPlainObject =
      seed && typeof seed === 'object' && !seed.nativeEvent && !seed.target;
    setData((prev) => {
      const theme = ['blue', 'pink', 'green', 'yellow', 'purple', 'orange'][prev.exchanges.length % 6];
      const next = isPlainObject
        ? { ...makeEmptyExchange(theme), ...seed }
        : makeEmptyExchange(theme);
      return { ...prev, exchanges: [...prev.exchanges, next] };
    });
  }, []);

  const removeExchange = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      exchanges: prev.exchanges.filter((ex) => ex.id !== id),
    }));
  }, []);

  const replaceAll = useCallback((nextData) => {
    if (nextData?.exchanges) setData({ exchanges: nextData.exchanges });
  }, []);

  const reset = useCallback(() => {
    setData(mode === 'host' ? hostDefaultData : { exchanges: [] });
  }, [mode]);

  return (
    <BoxDataContext.Provider
      value={{
        mode,
        sharedFromUrl,
        data,
        updateExchange,
        addExchange,
        removeExchange,
        replaceAll,
        reset,
      }}
    >
      {children}
    </BoxDataContext.Provider>
  );
}

export function useBoxData() {
  const ctx = useContext(BoxDataContext);
  if (!ctx) throw new Error('useBoxData must be inside BoxDataProvider');
  return ctx;
}
