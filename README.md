# Digital Culture Box (디지털 컬쳐박스)

국제 교류 학교를 잇는 인터랙티브 문화 박스 웹앱.
KRDS(국가디자인시스템) 가이드라인을 준수하면서, 어린이가 즐거워할 수 있는
이머시브한 UI/UX를 함께 갖췄습니다.

## ✨ Features
- 🎁 **3D 박스 인터랙션** — 클릭 시 뚜껑이 열리며 콘텐츠 등장 (Framer Motion)
- 📦 **택배 송장(Invoice) UI** — 발송인/수취인/운송장 번호/바코드/스탬프
- 🖼 **실시간 임베드** — Padlet · Canva 등 `<iframe>` 임베드
- 🛠 **관리자 모드** — 비밀번호 보호 (기본 `2865`, 환경변수로 분리)
- 🌏 **4개 국어 i18n** — 한국어 · 영어 · 일본어 · 인도네시아어
- 🧒 **어린이 친화 KRDS** — 둥근 모서리 · 파스텔톤 · Pretendard GOV · Material Icons
- ✏️ **확장 가능한 국가 리스트** — 배열 기반, 다국 교류 대응

## 🚀 Quick Start
```bash
cp .env.example .env
npm install
npm run dev
```
Open http://localhost:5173

## 🔐 Admin Password
`.env` 파일의 `VITE_ADMIN_PASSWORD` 값을 사용합니다 (기본 `2865`).
GitHub에 노출되지 않도록 `.gitignore`에 `.env`가 포함되어 있습니다.

## 🗂 Structure
```
src/
├─ App.jsx
├─ main.jsx
├─ i18n/
│  ├─ index.js
│  └─ locales/{ko,en,ja,id}.json
├─ store/
│  └─ BoxDataContext.jsx
├─ components/
│  ├─ CultureBox.jsx       # 3D 박스 + 애니메이션
│  ├─ Invoice.jsx          # 송장 디자인
│  ├─ EmbedViewer.jsx      # iframe 뷰어
│  ├─ AdminModal.jsx       # 관리자 모달
│  ├─ LanguageSelector.jsx
│  └─ Footer.jsx
└─ styles/index.css
```

## 🛠 Stack
React 18 · Vite · Tailwind CSS · Framer Motion · react-i18next

---
Created by. 교육뮤지컬 꿈꾸는 치수쌤
