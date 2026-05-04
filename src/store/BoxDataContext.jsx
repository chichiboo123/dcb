import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'dcb.boxData.v1';

const defaultData = {
  trackingNo: 'DCB-2026-0001-KR-ID',
  date: '2026-05-04',
  weight: '2.4 kg',
  contents: 'Traditional snacks, hand-written letters, school flag, photo album',
  message:
    '안녕! 우리는 한국에서 너희에게 따뜻한 마음을 보내. 우리 문화를 즐겨주길 바라!\nHello friends! We send you a warm heart from Korea. Enjoy our culture!',
  // Padlet/Canva embed URL — 관리자에서 변경 가능
  embedUrl: 'https://padlet.com/embed/your-padlet-id',
  // 발송인 / 수취인 (현재는 2개국이지만 배열로 확장 가능)
  countries: [
    {
      id: 'kr',
      role: 'from',
      school: '꿈꾸는 초등학교',
      country: 'Republic of Korea',
      flag: '🇰🇷',
      address: '서울특별시 종로구 세종대로 1길',
    },
    {
      id: 'id',
      role: 'to',
      school: 'SD Harapan Bangsa',
      country: 'Indonesia',
      flag: '🇮🇩',
      address: 'Jl. Merdeka No. 17, Jakarta Pusat',
    },
  ],
};

const BoxDataContext = createContext(null);

export function BoxDataProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...defaultData, ...JSON.parse(raw) };
    } catch {}
    return defaultData;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  const update = useCallback((patch) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateCountry = useCallback((id, patch) => {
    setData((prev) => ({
      ...prev,
      countries: prev.countries.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }, []);

  const addCountry = useCallback(() => {
    setData((prev) => ({
      ...prev,
      countries: [
        ...prev.countries,
        {
          id: `c-${Date.now()}`,
          role: 'to',
          school: 'New School',
          country: 'New Country',
          flag: '🏳️',
          address: '',
        },
      ],
    }));
  }, []);

  const removeCountry = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      countries: prev.countries.filter((c) => c.id !== id),
    }));
  }, []);

  const reset = useCallback(() => setData(defaultData), []);

  return (
    <BoxDataContext.Provider
      value={{ data, update, updateCountry, addCountry, removeCountry, reset }}
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
