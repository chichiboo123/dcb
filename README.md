# Digital Culture Box (디지털 컬쳐박스)

국제 교류 수업에서 학교와 학교를 **디지털 문화 박스**로 연결하는 React 기반 웹앱입니다. 학생 또는 교사가 문화 교류 정보를 입력하면 택배 상자처럼 보이는 카드가 생성되고, 카드를 열면 Padlet·Canva 등 외부 콘텐츠 임베드와 송장 형태의 교류 정보가 함께 표시됩니다.

이 프로젝트는 GitHub Pages 같은 정적 호스팅 환경에서도 동작하도록 설계되어 있으며, URL 공유 토큰·로컬 저장소·Google Maps/Places 연동을 조합해 별도 백엔드 없이 운영할 수 있습니다.

## 목차

- [주요 기능](#주요-기능)
- [앱 흐름](#앱-흐름)
- [모드 구조](#모드-구조)
- [데이터 모델](#데이터-모델)
- [기술 스택](#기술-스택)
- [빠른 시작](#빠른-시작)
- [환경 변수](#환경-변수)
- [Google Maps 설정](#google-maps-설정)
- [사용 방법](#사용-방법)
- [프로젝트 구조](#프로젝트-구조)
- [주요 파일 설명](#주요-파일-설명)
- [배포 메모](#배포-메모)
- [운영 및 확장 가이드](#운영-및-확장-가이드)

## 주요 기능

### 문화 박스 생성 및 공유

- 게스트 화면(`/`)에서 사용자가 보내는 학교·받는 학교·내용물·메시지·임베드 URL을 입력해 문화 박스를 만들 수 있습니다.
- 생성한 문화 박스 데이터는 짧은 키로 압축된 JSON을 URL-safe Base64 토큰으로 변환해 `?d=` 쿼리로 공유합니다.
- 링크 길이가 너무 길면 사용자에게 경고를 표시합니다.

### 호스트 모드와 관리자 인증

- `/host` 경로는 호스트 모드로 동작합니다.
- 호스트 모드의 기본 데이터는 코드에 포함되어 있고, 수정된 데이터는 브라우저 `localStorage`에 저장됩니다.
- 화면 오른쪽 아래의 희미한 설정 버튼을 통해 관리자 인증 또는 호스트 모드 진입을 열 수 있습니다.
- 관리자 비밀번호는 `VITE_ADMIN_PASSWORD` 환경 변수로 설정합니다.

### 인터랙티브 박스 UI

- Framer Motion을 사용해 카드와 모달 전환을 부드럽게 구성합니다.
- 문화 박스는 3D 상자 콘셉트의 카드로 표시되며, 클릭하면 큰 모달 안에서 콘텐츠를 확인합니다.
- 상세 모달은 왼쪽에 임베드 뷰어, 오른쪽에 택배 송장 스타일 정보를 배치합니다.

### 외부 콘텐츠 임베드

- `https://` 또는 `http://`로 시작하는 URL을 iframe으로 표시합니다.
- 임베드 영역은 로딩 상태, 전체 화면 전환, 새 창 열기를 지원합니다.
- Padlet, Canva, Google Slides 등 iframe 임베드를 허용하는 서비스와 함께 사용할 수 있습니다.

### 세계 학교 연결 지도

- Google Maps JavaScript API와 Places API 키가 있으면 학교 검색 자동완성과 지도 연결선을 사용할 수 있습니다.
- 좌표가 있는 교류 데이터만 지도에 표시합니다.
- 출발지와 도착지를 마커로 표시하고, 두 학교 사이를 움직이는 점선 형태의 지오데식 라인으로 연결합니다.
- API 키가 없거나 로드에 실패하면 지도 영역에서 안내 메시지를 표시합니다.

### 다국어 지원

- `react-i18next`와 `i18next-browser-languagedetector`를 사용합니다.
- 지원 언어는 한국어, 영어, 일본어, 인도네시아어입니다.
- 언어 선택은 브라우저 로컬 저장소에 캐시됩니다.
- 국가명은 TSV 데이터와 `Intl.DisplayNames`를 조합해 현지화합니다.

### 정적 호스팅 친화 설계

- Vite 기반 SPA입니다.
- `public/404.html`과 `index.html`의 복원 스크립트로 GitHub Pages에서 `/host` 같은 직접 접근 URL을 복구합니다.
- `public/CNAME`이 포함되어 있어 커스텀 도메인 배포를 고려한 구조입니다.

## 앱 흐름

1. 사용자가 `/`에 접속하면 게스트 모드로 시작합니다.
2. 사용자는 **문화 박스 만들기** 버튼으로 교류 정보를 입력합니다.
3. 저장하면 박스 카드가 화면에 표시되고, 공유 버튼으로 현재 데이터를 담은 URL을 복사할 수 있습니다.
4. 수신자는 공유 URL을 열어 같은 박스를 확인합니다.
5. 호스트 운영자는 `/host` 또는 숨겨진 설정 버튼을 통해 관리자 인증 후 호스트용 데이터를 편집합니다.
6. 좌표가 있는 교류 데이터는 하단 지도에서 학교 간 연결선으로 시각화됩니다.

## 모드 구조

| 모드 | 경로 | 목적 | 데이터 저장 방식 |
| --- | --- | --- | --- |
| 게스트 모드 | `/` | 학생·방문자가 직접 박스를 만들고 링크로 공유 | URL 토큰 기반, 페이지 내 상태 중심 |
| 호스트 모드 | `/host` 또는 `/host/...` | 교사·운영자가 기본 전시 데이터를 관리 | `localStorage` + 공유 URL 토큰 |

모드는 현재 브라우저 경로로 판단합니다. `/host` 또는 `/host/` 하위 경로는 호스트 모드이고, 그 외 경로는 게스트 모드입니다.

## 데이터 모델

앱의 핵심 데이터는 `exchanges` 배열입니다. 각 항목은 하나의 문화 교류 박스를 의미합니다.

```js
{
  id: 'kr-id',
  theme: 'blue',
  trackingNo: 'DCB-2026-0001-KR-ID',
  date: '2026-05-04',
  weight: '2.4 kg',
  contents: '전통 과자, 손편지, 학교 깃발, 사진 앨범',
  message: '친구들에게 보내는 인사말',
  embedUrl: 'https://padlet.com/embed/...',
  from: {
    school: '보내는 학교명',
    country: 'Republic of Korea',
    countryCode: 'KR',
    flag: '🇰🇷',
    address: '학교 주소',
    lat: 37.5665,
    lng: 126.978,
    placeId: ''
  },
  to: {
    school: '받는 학교명',
    country: 'Indonesia',
    countryCode: 'ID',
    flag: '🇮🇩',
    address: '학교 주소',
    lat: -6.2088,
    lng: 106.8456,
    placeId: ''
  }
}
```

지도 표시는 `from.lat`, `from.lng`, `to.lat`, `to.lng`가 모두 숫자인 항목만 사용합니다.

## 기술 스택

- **React 18**: UI 컴포넌트 구성
- **Vite 5**: 개발 서버 및 빌드 도구
- **Tailwind CSS 3**: 유틸리티 기반 스타일링
- **Framer Motion**: 박스·모달 애니메이션
- **i18next / react-i18next**: 다국어 처리
- **lucide-react**: 아이콘
- **Google Maps JavaScript API + Places API**: 지도, 학교 검색 자동완성, 좌표 기반 연결선

## 빠른 시작

```bash
npm install
cp .env.example .env
npm run dev
```

개발 서버 기본 주소는 다음과 같습니다.

```text
http://localhost:5173
```

프로덕션 빌드는 다음 명령으로 확인할 수 있습니다.

```bash
npm run build
npm run preview
```

## 환경 변수

`.env.example`을 복사해 `.env` 또는 `.env.local`을 만들고 값을 채웁니다.

```bash
VITE_ADMIN_PASSWORD=your_password_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

| 변수 | 필수 여부 | 설명 |
| --- | --- | --- |
| `VITE_ADMIN_PASSWORD` | 관리자 기능 사용 시 필요 | 관리자 모달 인증에 사용하는 비밀번호입니다. Vite 특성상 클라이언트 번들에 포함되므로 고보안 인증 용도로는 적합하지 않습니다. |
| `VITE_GOOGLE_MAPS_API_KEY` | 지도·학교 검색 사용 시 필요 | Google Maps JavaScript API와 Places API 호출에 사용합니다. |
| `VITE_GOOGLE_MAP_API_KEY` | 선택 | 이전 변수명 호환용으로 코드에서 함께 확인합니다. |

> 참고: `VITE_` 접두사가 붙은 환경 변수는 브라우저 코드에서 접근 가능합니다. 공개되어도 되는 키 또는 도메인 제한이 적용된 키만 사용하세요.

## Google Maps 설정

지도와 학교 검색 자동완성을 사용하려면 Google Cloud Console에서 다음을 준비합니다.

1. Google Maps Platform 프로젝트를 생성합니다.
2. **Maps JavaScript API**를 활성화합니다.
3. **Places API**를 활성화합니다.
4. API 키를 만들고 HTTP referrer 제한을 설정합니다.
5. `.env`에 `VITE_GOOGLE_MAPS_API_KEY` 값을 입력합니다.
6. 이미 `npm run dev`가 실행 중이었다면 개발 서버를 재시작합니다.

API 키가 없으면 앱의 나머지 기능은 계속 사용할 수 있지만, 학교 검색 자동완성과 연결 지도는 안내 메시지 또는 비활성 상태로 표시됩니다.

## 사용 방법

### 게스트가 문화 박스를 만드는 방법

1. 메인 화면에서 **문화 박스 만들기**를 누릅니다.
2. 보내는 학교와 받는 학교 정보를 입력합니다.
3. 국가 검색 입력에서 국가 코드 또는 국가명을 선택합니다.
4. Google Maps 키가 설정되어 있으면 학교 검색 자동완성으로 학교명·주소·좌표를 채울 수 있습니다.
5. 내용물, 메시지, 임베드 URL을 입력합니다.
6. 저장 후 메인 화면에서 박스를 클릭해 내용을 확인합니다.
7. **공유 링크** 버튼으로 현재 박스 데이터를 포함한 URL을 복사합니다.

### 호스트가 전시 데이터를 관리하는 방법

1. `/host`로 접속하거나 오른쪽 아래 설정 버튼을 누릅니다.
2. 설정된 관리자 비밀번호를 입력합니다.
3. 교류 박스를 추가·삭제·수정합니다.
4. 저장하면 호스트 브라우저의 `localStorage`에 반영됩니다.
5. 호스트 모드에서 공유 링크를 복사하면 `/host?d=...` 형태로 생성되어 수신자도 호스트 보기로 열 수 있습니다.

### 임베드 URL 준비 팁

- Padlet은 공유 또는 임베드 메뉴에서 제공하는 embed URL을 사용합니다.
- Canva는 공개 보기 또는 임베드 링크를 사용합니다.
- 일부 서비스는 보안 정책 때문에 iframe 표시를 차단할 수 있습니다. 이 경우 앱의 **새 창 열기** 버튼을 사용하세요.

## 프로젝트 구조

```text
.
├─ index.html                 # SPA 진입점, GitHub Pages 경로 복원 스크립트
├─ package.json               # npm 스크립트 및 의존성
├─ vite.config.js             # Vite 설정
├─ tailwind.config.js         # Tailwind 테마 확장
├─ postcss.config.js          # Tailwind/PostCSS 설정
├─ public/
│  ├─ 404.html                # 정적 호스팅 SPA fallback
│  ├─ CNAME                   # 커스텀 도메인 설정
│  └─ box.svg                 # favicon/assets
└─ src/
   ├─ main.jsx                # React 앱 마운트 및 Provider 연결
   ├─ App.jsx                 # 전체 레이아웃, 모드별 버튼, 모달 orchestration
   ├─ styles/index.css        # 글로벌 스타일, 배경, Google Places 스타일
   ├─ components/
   │  ├─ AdminModal.jsx       # 관리자 인증 및 호스트 데이터 편집
   │  ├─ BoxCard.jsx          # 메인 문화 박스 카드
   │  ├─ BoxModal.jsx         # 박스 상세 모달
   │  ├─ EmbedViewer.jsx      # iframe 뷰어
   │  ├─ GuestCreateModal.jsx # 게스트 문화 박스 생성/편집 모달
   │  ├─ HelpModal.jsx        # 도움말 모달
   │  ├─ HiddenAdminTrigger.jsx
   │  ├─ Invoice.jsx          # 송장 UI
   │  ├─ LanguageSelector.jsx # 언어 선택
   │  └─ SchoolConnectionMap.jsx
   ├─ data/
   │  └─ countries.tsv        # 국가 코드와 국가명 데이터
   ├─ i18n/
   │  ├─ index.js             # i18next 초기화
   │  └─ locales/             # ko/en/ja/id 번역 JSON
   ├─ lib/
   │  ├─ countries.js         # 국가 검색, 국기, 현지화 유틸
   │  ├─ googleMaps.js        # Google Maps 로더 및 Places 유틸
   │  ├─ mode.js              # 게스트/호스트 모드 판별, 빈 교류 생성
   │  └─ share.js             # 공유 URL 인코딩/디코딩
   └─ store/
      └─ BoxDataContext.jsx   # 앱 데이터 상태 및 업데이트 API
```

## 주요 파일 설명

### `src/App.jsx`

- 앱 최상위 화면입니다.
- 헤더, 언어 선택, 도움말, 공유 버튼, 게스트 생성 버튼, 박스 목록, 지도, 푸터를 연결합니다.
- 호스트 모드일 때 주소창을 `/host?d=...` 형태로 동기화해 현재 데이터를 쉽게 복사할 수 있게 합니다.

### `src/store/BoxDataContext.jsx`

- 전체 문화 박스 데이터를 React Context로 제공합니다.
- 호스트 모드는 기본 데이터 또는 `localStorage` 데이터를 로드합니다.
- 게스트 모드는 공유 URL의 `?d=` 토큰이 있으면 해당 데이터를 로드하고, 없으면 빈 목록으로 시작합니다.
- `addExchange`, `updateExchange`, `removeExchange`, `replaceAll`, `reset` API를 제공합니다.

### `src/lib/share.js`

- 공유 URL 생성을 담당합니다.
- 데이터 필드를 짧은 키로 변환해 URL 길이를 줄입니다.
- URL-safe Base64로 인코딩하며, 이전의 verbose `exchanges` 형식도 디코딩할 수 있도록 호환 로직을 포함합니다.

### `src/lib/googleMaps.js`

- Google Maps 스크립트를 한 번만 주입하는 싱글턴 로더입니다.
- 언어 설정은 `localStorage`, HTML `lang`, 브라우저 언어 순서로 결정합니다.
- Places 상세 정보 캐시와 학교 관련 장소 타입 상수를 제공합니다.

### `src/components/GuestCreateModal.jsx` / `src/components/AdminModal.jsx`

- 교류 박스 입력 폼을 담당합니다.
- 학교 검색 자동완성, 국가 검색, 테마 선택, 기본 검증, 저장 처리를 포함합니다.
- 게스트 모달은 `replaceAll`로 현재 게스트 데이터를 교체하고, 관리자 모달은 호스트 데이터를 개별 업데이트합니다.

### `src/components/SchoolConnectionMap.jsx`

- 좌표가 있는 교류 데이터만 필터링합니다.
- 지도 초기화 후 마커·정보창·애니메이션 점선을 그립니다.
- 데이터가 바뀌면 이전 지도 객체를 정리하고 다시 렌더링합니다.

### `src/i18n/index.js`

- 한국어를 fallback 언어로 설정합니다.
- 번역 리소스는 `src/i18n/locales` 아래 JSON 파일로 관리합니다.

## 배포 메모

### GitHub Pages

이 앱은 정적 SPA이므로 GitHub Pages에 배포할 수 있습니다.

- `npm run build`로 `dist/`를 생성합니다.
- Pages에 `dist/` 결과물을 배포합니다.
- `public/404.html`은 직접 접근한 SPA 경로를 `sessionStorage`에 저장한 뒤 `/`로 이동시킵니다.
- `index.html`은 저장된 경로를 읽어 History API로 원래 경로를 복원합니다.

### 커스텀 도메인

`public/CNAME`이 포함되어 있으므로 빌드 결과에도 CNAME 파일이 복사됩니다. 실제 도메인을 변경하려면 `public/CNAME` 값을 수정하세요.

### 보안 주의

현재 앱은 백엔드가 없는 정적 앱입니다. 관리자 비밀번호와 Google Maps 키는 클라이언트 번들 또는 런타임에서 노출될 수 있습니다.

- 관리자 비밀번호는 교실·전시 운영 편의를 위한 간단한 보호 장치로 사용하세요.
- Google Maps API 키는 반드시 HTTP referrer 제한을 설정하세요.
- 민감한 학생 개인정보는 입력하지 않는 운영 정책을 권장합니다.

## 운영 및 확장 가이드

### 새 언어 추가

1. `src/i18n/locales/{code}.json` 파일을 추가합니다.
2. `src/i18n/index.js`의 `SUPPORTED_LANGUAGES`와 `resources`에 언어를 등록합니다.
3. 필요한 경우 국가명 표시가 자연스러운지 확인합니다.

### 기본 호스트 데이터 수정

- `src/store/BoxDataContext.jsx`의 `hostDefaultData`를 수정합니다.
- 운영 중 브라우저에 저장된 `localStorage` 데이터가 있으면 기본 데이터보다 우선합니다.
- 초기 상태를 다시 보려면 관리자 모달의 reset 기능 또는 브라우저 저장소 삭제가 필요합니다.

### 국가 목록 확장

- 국가 코드 목록과 TSV 기반 이름은 `src/lib/countries.js`와 `src/data/countries.tsv`에서 관리합니다.
- `countryCode`가 ISO 3166-1 alpha-2 코드이면 국기 이미지 URL과 이모지 국기 표시가 동작합니다.

### 디자인 커스터마이징

- 글로벌 배경과 Google Places 드롭다운 스타일은 `src/styles/index.css`에서 조정합니다.
- 색상·그림자·애니메이션 토큰은 `tailwind.config.js`의 `theme.extend`에서 관리합니다.
- 박스 카드와 송장 레이아웃은 각각 `BoxCard.jsx`, `Invoice.jsx`에서 조정합니다.

## 라이선스 및 제작

Created by. 교육뮤지컬 꿈꾸는 치수쌤
