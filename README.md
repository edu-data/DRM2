# DRM2 – 고등학생의 학교 일상 경험 조사

> **Daily Reconstruction Method (DRM)** 기반 학교 일과 경험 설문 도구

[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue?logo=github)](https://edu-data.github.io/DRM2/)

---

## 📋 개요

DRM2는 **일상재구성법(DRM)**을 활용하여 고등학생의 학교 일과 중 경험한 **활동**과 그에 따른 **정서(감정)**를 체계적으로 수집하는 웹 기반 설문 도구입니다.

### 연구 목적

- 고등학생의 학교 일과 중 **긍정적·부정적 활동** 파악
- 각 활동에서 느끼는 **정서(즐거운, 행복한, 편안한, 짜증나는, 부정적인, 무기력한, 의미, 보람)** 측정 (7점 리커트 척도)
- 활동별 **시간대, 함께한 사람, 장소, 이유** 등 맥락 정보 수집
- **배경 변인**(성별, 학교 소재지, 진로 결정 여부) 조사

---

## 🎯 설문 구조

| 단계 | 내용 | 비고 |
|------|------|------|
| 1. 안내문 | 연구 설명 및 동의, 핸드폰 번호 입력 | 사례비 지급용 |
| 2. 긍정 활동 | 기분 좋았거나 만족스러웠던 활동 기록 | 최소 3개, 최대 10개 |
| 3. 부정 활동 | 기분 안 좋았거나 불만족스러웠던 활동 기록 | 최소 3개, 최대 10개 |
| 4. 배경조사 | 성별, 학교 소재지, 진로 결정 여부 | 선택적 (이미 응답 시 건너뛰기 가능) |

### 각 활동 기록 항목

- ⏰ **시간대** — 활동이 일어난 시간
- 📝 **활동 내용** — 텍스트 직접 입력
- 👥 **함께한 사람** — 선택형
- 📍 **장소** — 선택형
- 😊 **정서 평가** — 8개 감정 항목, 7점 리커트 척도
- 💬 **이유** — 해당 활동을 선택한 이유 (텍스트)

---

## 🛠️ 기술 스택

| 구성 요소 | 기술 |
|-----------|------|
| **Frontend** | HTML5, CSS3 (Glassmorphism 디자인), Vanilla JavaScript |
| **Backend** | Google Apps Script (GAS) |
| **데이터 저장** | Google Sheets |
| **호스팅** | GitHub Pages |

---

## 📁 프로젝트 구조

```
DRM2/
├── index.html          # 메인 설문 페이지
├── css/
│   └── style.css       # 글래스모피즘 기반 스타일시트
├── js/
│   ├── config.js       # GAS Web App URL 설정
│   └── app.js          # 설문 로직, 유효성 검증, 데이터 전송
├── gas/
│   └── Code.gs         # Google Apps Script 백엔드
├── .gitignore
└── README.md
```

---

## 📊 데이터 구조 (Google Sheets)

### 1. `Responses` 시트

| 컬럼 | 설명 |
|-------|------|
| Timestamp | 제출 시간 (ISO 8601) |
| RespondentID | 응답자 고유 ID (UUID) |
| PhoneNumber | 핸드폰 번호 |
| PositiveCount | 긍정 활동 수 |
| NegativeCount | 부정 활동 수 |
| Gender | 성별 |
| SchoolLocation | 학교 소재지 |
| CareerDecision | 진로 결정 여부 |

### 2. `PositiveActivities` / `NegativeActivities` 시트

| 컬럼 | 설명 |
|-------|------|
| RespondentID | 응답자 ID |
| ActivityNum | 활동 번호 |
| Time | 시간대 |
| Activity | 활동 내용 |
| Companion | 함께한 사람 |
| Location | 장소 |
| EmoJoyful ~ EmoRewarding | 정서 8개 항목 (1~7점) |
| Reason | 이유 |

---

## 🚀 배포 방법

### 1. GitHub Pages

1. 이 저장소를 Fork 또는 Clone
2. GitHub 저장소 → **Settings → Pages**
3. Source: `main` branch, `/ (root)` 선택
4. 저장 후 `https://<org>.github.io/DRM2/` 에서 접근 가능

### 2. Google Apps Script 설정

1. [Google Apps Script](https://script.google.com)에서 새 프로젝트 생성
2. `gas/Code.gs` 내용을 붙여넣기
3. **배포 → 새 배포 → 웹 앱** 으로 배포
4. 배포된 URL을 `js/config.js`의 `GAS_URL`에 설정

---

## 📝 라이선스

이 프로젝트는 학술 연구 목적으로 제작되었습니다.

---

## 👨‍🔬 연구진

**경인교육대학교 연구팀**
