# 🐧 ByteBuddy (DevPet)

> 내 CS 지식 repo를 읽고,
> 귀여운 펭귄이 대신 설명해주는 데스크탑 학습 앱

---

## 💡 Introduction

ByteBuddy는 개발자를 위한 **데스크탑 펫 기반 CS 학습 도구**입니다.

이 앱은 **사용자가 직접 정리한 Git/Markdown 기반 지식 repo를 읽어**
펭귄 캐릭터가 핵심 개념과 질문을 대신 전달합니다.

즉,

> “내가 정리한 지식을, 내가 더 자주 보게 만드는 도구”

입니다.

---

## 🎯 Key Features

- 로컬 knowledge repo 연결
- Markdown 기반 CS 노트 로드
- 펭귄 캐릭터 말풍선 출력
- 질문/요약 자동 표시
- 클릭 시 상세 Markdown 보기

---

## MVP Status

- 샘플 knowledge repo 로드
- 로컬 repo 선택
- Markdown 파싱
- 펭귄 말풍선에 질문 또는 요약 표시
- 상세 내용 패널 표시

### Current Flow

1. 앱 실행
2. knowledge repo 로드
3. 펭귄이 주기적으로 질문/개념 표시
4. 클릭 시 상세 설명 열림

---

## 🚀 Vision

단순한 노트 앱이 아니라,

👉 **“내가 만든 지식이 나를 계속 가르치는 구조”**

를 만드는 것이 목표입니다.

앱을 열지 않아도,
펭귄이 계속 말을 걸며 학습을 유도합니다.

---

## ✨ Future Ideas

* 🧠 AI 기반 요약 및 쉬운 설명
* 🎯 퀴즈 모드 (면접 대비)
* 📊 학습 기록 및 반복 시스템
* 🔗 Obsidian / Notion 연동
* 🎨 캐릭터 애니메이션 및 반응

---

## 📌 Goal

> “공부를 하려고 앱을 여는 게 아니라
> 그냥 켜놓으면 계속 배우게 되는 환경”

---

## 🧱 Tech Stack

- Electron
- React
- JavaScript
- react-markdown
- Node.js fs / path

---

## Project Structure

```bash
bytebuddy-mvp/
├─ electron/
│  ├─ main.js
│  └─ preload.js
├─ src/
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ styles.css
├─ knowledge-sample/
└─ package.json
```

---

## Getting Started


```bash
npm install
npm run dev
```

---

## Knowledge Repo Format example

```Markdown
# Redis

## 한 줄 요약
메모리 기반 key-value 저장소

## 핵심 개념
- 싱글 스레드
- 이벤트 루프

## 면접 질문
Q. Redis는 왜 빠른가?

## 답변
메모리 기반으로 동작하고, context switching 비용을 줄인 구조를 사용한다.
```

ByteBuddy는 repo에서 질문, 요약, 본문을 추출해 말풍선과 상세 패널에 표시합니다.

---
