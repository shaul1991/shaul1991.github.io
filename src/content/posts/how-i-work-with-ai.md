---
title: '나의 작업 흐름 1: AI에게 맡길 일과 내가 결정할 일'
description: 사람은 목표·요구·접근 방향을 정하고, AI는 tasks부터 구현·self-review까지 맡는다.
publishedAt: 2026-08-08
updatedAt: 2026-08-09
tags: [작업 흐름, AI 협업, 의사결정]
featured: true
series: 나의 작업 흐름
seriesOrder: 1
editor: 한결
editorReview: 2026-08-09-localmind-revalidation
---

사람은 `goal.md`, `spec.md`, `plan.md`에서 목표·요구·접근 방향을 정한다. 방향이 정해지면 AI가 `tasks.md` 작성부터 구현과 self-review까지 이어서 맡고, 사람은 결과를 바꾸는 모호한 결정과 최종 반영을 판단한다.

## 핵심

<figure class="process-flow process-flow--4" aria-label="요청을 정의하고 AI가 실행한 뒤 사람이 최종 결정하는 흐름">
<ol class="process-flow">
<li><span aria-hidden="true">🧭</span><strong>정의</strong><small>goal·spec·plan</small></li>
<li><span aria-hidden="true">❓</span><strong>확인</strong><small>결과를 바꿀 모호함</small></li>
<li><span aria-hidden="true">⚙️</span><strong>실행</strong><small>tasks·구현·self-review</small></li>
<li><span aria-hidden="true">✅</span><strong>결정</strong><small>사람이 최종 반영</small></li>
</ol>
</figure>

요청이 모호한 채로 시작하면 AI는 그럴듯한 해석을 선택한다. 그래서 구현 전에 목표와 완료 조건을 사람이 확인하고, 결과를 바꾸는 질문만 먼저 닫는다.

## 판단 기준

| 상황 | 처리 |
| --- | --- |
| 문구·국소 스타일 | 바로 수정하고 화면에서 검증 |
| 데이터 구조·인증·공개 API | 조사와 명세부터 작성 |
| 해석에 따라 결과가 달라짐 | 구현 전에 질문 |
| 사소한 선택 | 기존 규칙에 따라 진행 |

모든 작업에 긴 계획이 필요한 것은 아니다. 작업 크기에 맞게 조사와 검증을 조절한다. 되돌리기 어렵거나 영향 범위가 넓으면 이를 늘리고, 작은 수정은 실행과 확인에 집중한다.

## 역할

- **AI:** 사전 조사와 트레이드오프 비교, `tasks.md` 작성, 반복 구현, 테스트, 독립 self-review.
- **사람:** `goal.md`·`spec.md`·`plan.md`의 방향 입력, 위험 수용, 최종 반영.
- **LocalMind:** 과거 결정과 전제를 다시 찾는 근거.

방향이 정해진 뒤에는 결과를 바꾸는 모호함만 사람에게 올리고, 나머지는 AI가 self-review까지 이어서 수행한다.

완료 조건은 관찰 가능하게 쓴다. 예: `390px 화면에서 겹침과 가로 오버플로가 없다.`
