import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const GUEST_STORAGE_KEY = 'dcb.boxData.guest.v1';
const HOST_STORAGE_KEY = 'dcb.boxData.host.v1';

const defaultData = {
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
      from: { school: '꿈꾸는 초등학교', country: 'Republic of Korea', flag: '🇰🇷', address: '서울특별시 종로구 세종대로 1길' },
      to: { school: 'SD Harapan Bangsa', country: 'Indonesia', flag: '🇮🇩', address: 'Jl. Merdeka No. 17, Jakarta Pusat' },
    },
    {
      id: 'id-kr', theme: 'pink', trackingNo: 'DCB-2026-0002-ID-KR', date: '2026-05-18', weight: '2.1 kg',
      contents: 'Batik, surat, foto sekolah, makanan tradisional',
      message: 'Halo! Kami mengirim cinta dari Indonesia. Selamat menikmati budaya kami!\n안녕! 우리는 인도네시아에서 사랑을 보내.',
      embedUrl: 'https://padlet.com/embed/your-padlet-id-2',
      from: { school: 'SD Harapan Bangsa', country: 'Indonesia', flag: '🇮🇩', address: 'Jl. Merdeka No. 17, Jakarta Pusat' },
      to: { school: '꿈꾸는 초등학교', country: 'Republic of Korea', flag: '🇰🇷', address: '서울특별시 종로구 세종대로 1길' },
    },
  ],
};

const readSharedData = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('box');
    if (!raw) return null;
    const decoded = decodeURIComponent(escape(window.atob(raw)));
    const parsed = JSON.parse(decoded);
    return parsed?.exchanges?.length ? parsed : null;
  } catch {
    return null;
  }
};

const BoxDataContext = createContext(null);

export function BoxDataProvider({ children }) {
  const mode = useMemo(() => (window.location.pathname.startsWith('/host') ? 'host' : 'guest'), []);
  const sharedData = useMemo(() => (mode === 'guest' ? readSharedData() : null), [mode]);

  const [data, setData] = useState(() => {
    if (sharedData) return sharedData;
    const key = mode === 'host' ? HOST_STORAGE_KEY : GUEST_STORAGE_KEY;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.exchanges?.length) return parsed;
      }
    } catch {}
    return mode === 'host' ? defaultData : defaultData;
  });

  useEffect(() => {
    try {
      const key = mode === 'host' ? HOST_STORAGE_KEY : GUEST_STORAGE_KEY;
      localStorage.setItem(key, JSON.stringify(data));
    } catch {}
  }, [data, mode]);

  const updateExchange = useCallback((id, patch) => {
    setData((prev) => ({ ...prev, exchanges: prev.exchanges.map((ex) => ex.id === id ? { ...ex, ...patch, from: { ...ex.from, ...(patch.from || {}) }, to: { ...ex.to, ...(patch.to || {}) } } : ex) }));
  }, []);

  const addExchange = useCallback(() => {
    setData((prev) => ({ ...prev, exchanges: [...prev.exchanges, { id: `ex-${Date.now()}`, theme: ['blue', 'pink', 'green', 'yellow'][prev.exchanges.length % 4], trackingNo: `DCB-NEW-${Date.now().toString().slice(-4)}`, date: new Date().toISOString().slice(0, 10), weight: '2.0 kg', contents: '', message: '', embedUrl: '', from: { school: 'School A', country: 'Country A', flag: '🏳️', address: '' }, to: { school: 'School B', country: 'Country B', flag: '🏳️', address: '' } }] }));
  }, []);

  const removeExchange = useCallback((id) => {
    setData((prev) => ({ ...prev, exchanges: prev.exchanges.filter((ex) => ex.id !== id) }));
  }, []);

  const reset = useCallback(() => setData(defaultData), []);

  const getGuestShareLink = useCallback(() => {
    const json = JSON.stringify(data);
    const encoded = window.btoa(unescape(encodeURIComponent(json)));
    return `${window.location.origin}/?box=${encoded}`;
  }, [data]);

  return <BoxDataContext.Provider value={{ data, mode, updateExchange, addExchange, removeExchange, reset, getGuestShareLink }}>{children}</BoxDataContext.Provider>;
}

export function useBoxData() {
  const ctx = useContext(BoxDataContext);
  if (!ctx) throw new Error('useBoxData must be inside BoxDataProvider');
  return ctx;
}
