# DRM2 Implementation Plan

> **DRM2 — 고등학생의 학교 일상 경험 조사** 구현 계획서

---

## 1. 프로젝트 개요

### 1.1 연구 목적
일상재구성법(Daily Reconstruction Method, DRM)을 활용하여 고등학생의 학교 일과 중 경험한 **활동**과 그에 따른 **정서(감정)**를 체계적으로 수집하는 웹 기반 설문 도구 개발.

### 1.2 주요 목표
- 고등학생의 학교 일과 중 **긍정적·부정적 활동** 파악
- 각 활동에서 느끼는 **8가지 정서** 측정 (7점 리커트 척도)
- 활동별 **맥락 정보** (시간대, 함께한 사람, 장소, 이유) 수집
- **배경 변인** (성별, 학교 소재지, 학교 유형, 진로 결정 여부) 조사

---

## 2. 시스템 아키텍처

```
┌────────────────────────┐
│   GitHub Pages         │
│   (Frontend Hosting)   │
├────────────────────────┤
│  index.html            │
│  css/style.css         │
│  js/config.js          │
│  js/app.js             │
└──────────┬─────────────┘
           │ HTTP POST (JSON)
           ▼
┌────────────────────────┐
│  Google Apps Script     │
│  (Backend: Code.gs)    │
├────────────────────────┤
│  doPost(e)             │
│  doGet(e)              │
│  getOrCreateSheet()    │
└──────────┬─────────────┘
           │
           ▼
┌────────────────────────┐
│  Google Sheets         │
│  (Data Storage)        │
├────────────────────────┤
│  Responses             │
│  PositiveActivities    │
│  NegativeActivities    │
└────────────────────────┘
```

---

## 3. 설문 흐름 (Survey Flow)

```
안내문 (Intro)
  ├── 연구 설명 & 동의
  ├── 핸드폰 번호 입력 (사례비용)
  └── [설문 시작하기] 버튼
         │
         ▼
긍정 활동 기록 (Positive Activities)
  ├── 최소 1개, 최대 10개
  ├── 각 활동: 시간대, 활동내용, 함께한 사람, 장소
  ├── 정서 평가: 8개 항목 × 7점 리커트
  ├── 이유 (텍스트)
  └── [다음: 부정 활동] 버튼
         │
         ▼
부정 활동 기록 (Negative Activities)
  ├── 최소 1개, 최대 10개
  ├── 동일 구조
  ├── [설문 제출] 버튼 (배경조사 이미 응답 시)
  └── [다음: 배경조사] 버튼
         │
         ▼
배경조사 (Demographics)
  ├── 성별 (남/여)
  ├── 학교 소재지 (17개 시·도)
  ├── 학교 유형 (일반고/특성화고(농고,공고,과학기술고,종고)/종합고/특목고/자율고/기타)
  ├── 진로 결정 여부 (결정함/고민 중/결정하지 않음)
  └── [설문 완료] 버튼
         │
         ▼
완료 화면 (Completion)
  ├── Google Sheets로 데이터 전송
  └── 성공/실패 메시지 표시
```

---

## 4. 데이터 구조

### 4.1 `Responses` 시트

| 컬럼 | 타입 | 설명 |
|------|------|------|
| Timestamp | ISO 8601 | 제출 시간 |
| RespondentID | UUID | 응답자 고유 ID |
| PhoneNumber | String | 핸드폰 번호 |
| PositiveCount | Number | 긍정 활동 수 |
| NegativeCount | Number | 부정 활동 수 |
| Gender | String | 성별 |
| SchoolLocation | String | 학교 소재지 |
| SchoolType | String | 학교 유형 |
| CareerDecision | String | 진로 결정 여부 |

### 4.2 `PositiveActivities` / `NegativeActivities` 시트

| 컬럼 | 타입 | 설명 |
|------|------|------|
| RespondentID | UUID | 응답자 ID (FK) |
| ActivityNum | Number | 활동 번호 (1~10) |
| Time | String | 시간대 |
| Activity | String | 활동 내용 |
| Companion | String | 함께한 사람 |
| Location | String | 장소 |
| EmoJoyful | 1~7 | 즐거운 |
| EmoHappy | 1~7 | 행복한 |
| EmoComfortable | 1~7 | 편안한 |
| EmoAnnoyed | 1~7 | 짜증나는 |
| EmoNegative | 1~7 | 부정적인 |
| EmoLethargic | 1~7 | 무기력한 |
| EmoMeaning | 1~7 | 의미 |
| EmoRewarding | 1~7 | 보람 |
| Reason | String | 이유 |

---

## 5. 정서 측정 척도

### 5.1 긍정 정서 (3항목)
| 항목 | 설명 |
|------|------|
| 즐거운 (EmoJoyful) | 기쁘고 즐거운 감정 |
| 행복한 (EmoHappy) | 행복하고 충만한 감정 |
| 편안한 (EmoComfortable) | 안정적이고 편안한 감정 |

### 5.2 부정 정서 (3항목)
| 항목 | 설명 |
|------|------|
| 짜증나는 (EmoAnnoyed) | 화가 나고 짜증나는 감정 |
| 부정적인 (EmoNegative) | 전반적인 부정적 감정 |
| 무기력한 (EmoLethargic) | 의욕이 없고 지친 감정 |

### 5.3 의미·보람 (2항목)
| 항목 | 설명 |
|------|------|
| 의미 (EmoMeaning) | 활동이 의미있다고 느끼는 정도 |
| 보람 (EmoRewarding) | 활동에서 보람을 느끼는 정도 |

> 모든 정서 항목은 **7점 리커트 척도** (1=전혀 아니다 ~ 7=매우 그렇다)로 측정

---

## 6. 기술 스택

| 영역 | 기술 | 비고 |
|------|------|------|
| Frontend | HTML5, CSS3, Vanilla JS | SPA 방식 (페이지 내 섹션 전환) |
| 디자인 | Glassmorphism, CSS Variables | 다크 테마, 반응형 |
| Backend | Google Apps Script | doPost / doGet |
| Storage | Google Sheets | 3개 시트 (Responses, Positive, Negative) |
| Hosting | GitHub Pages | edu-data.github.io/DRM2 |
| CI/CD | Git + GitHub | 수동 배포 (main branch) |

---

## 7. 프론트엔드 구현 상세

### 7.1 파일 구조
```
DRM2/
├── index.html          # 메인 SPA (5 섹션)
├── css/
│   └── style.css       # 글래스모피즘 기반 스타일
├── js/
│   ├── config.js       # GAS Web App URL
│   └── app.js          # 전체 설문 로직
├── gas/
│   └── Code.gs         # GAS 백엔드 코드
└── docs/
    ├── implementation_plan.md
    └── test_results.md
```

### 7.2 주요 기능
- **동적 활동 카드 생성/삭제** — 최소 1개 ~ 최대 10개
- **예시 데이터 프리필** — 첫 번째 활동에 예시 데이터 자동 입력
- **유효성 검증** — 시간대, 활동내용, 정서 최소 1개 필수
- **"기타" 텍스트 입력** — 시간대/함께한 사람/장소에서 "기타" 선택 시 직접 입력 필드 표시
- **배경조사 건너뛰기** — 이미 배경조사 응답 시 부정 활동에서 바로 제출 가능
- **Toast 알림** — 유효성 검증 실패 시 하단 토스트 메시지

### 7.3 선택지 목록

#### 시간대
교과시간(국어), 교과시간(수학), 교과시간(영어), 교과시간(사회/역사), 교과시간(과학), 교과시간(기타과목), 점심시간, 학교방과후시간, 동아리시간, 상담시간, 학원시간, 귀가후시간, 기타

#### 함께한 사람
혼자서, 교사와 함께, 친구와 함께, 가족과 함께, 교사이외의 성인(학원강사포함), AI, 기타

#### 장소
교실, 도서실, 학원, 집, 스마트기기(컴퓨터포함), 기타

---

## 8. 배포 계획

### 8.1 GitHub Pages
1. `main` 브랜치에 코드 push
2. Settings → Pages → Source: `main` / `/ (root)` 선택
3. URL: `https://edu-data.github.io/DRM2/`

### 8.2 Google Apps Script
1. Google Apps Script 에디터에서 `Code.gs` 배포
2. 웹 앱 URL을 `js/config.js`에 설정
3. Google Sheets 자동 생성 (첫 요청 시)
