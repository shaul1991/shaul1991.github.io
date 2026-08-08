---
title: 'sdd-5docs 1: 다섯 문서로 AI 작업의 기준을 유지한다'
description: 목표, 요구, 접근, 실행, 완료 증거를 분리해 긴 AI 작업의 해석 차이를 줄인다.
publishedAt: 2026-08-08
tags: [작업 흐름, SDD, AI 위임]
featured: true
series: sdd-5docs
seriesOrder: 1
editor: 한결
editorReview: 2026-08-08-series-consolidation
---

나는 실제로 영향 범위가 큰 AI 작업에만 `sdd-5docs`를 사용한다.

## 핵심

<figure class="process-flow process-flow--5" aria-label="goal에서 review까지 이어지는 다섯 문서 흐름">
<ol class="process-flow">
<li><span aria-hidden="true">🎯</span><strong>goal</strong><small>목표·성공</small></li>
<li><span aria-hidden="true">📋</span><strong>spec</strong><small>요구·수락 조건</small></li>
<li><span aria-hidden="true">🧭</span><strong>plan</strong><small>접근·검증</small></li>
<li><span aria-hidden="true">⚙️</span><strong>tasks</strong><small>실행 계약</small></li>
<li><span aria-hidden="true">✅</span><strong>review</strong><small>결과·증거</small></li>
</ol>
</figure>

문서를 나누면 목표 변경과 구현 변경을 구분할 수 있다. 각 단계의 문서는 다음 단계가 다시 참조할 판단 기준을 제공한다.

## 적용 기준

| 사용한다 | 사용하지 않는다 |
| --- | --- |
| 새 개념이나 넓은 영향 범위 | 오타나 국소 스타일 수정 |
| 되돌리기 어려운 선택 | 기존 규칙에 따라 처리할 수 있는 작은 수정 |

버그는 재현과 실패 테스트부터 시작하고, 그 뒤에도 목표·요구·접근을 분리해야 할 때 이 체계를 사용한다.

문서의 크기는 작업 크기에 비례한다. 다섯 파일을 채우는 것이 목적이 아니라, 작업을 바꿀 결정과 검증 기준을 잃지 않는 것이 목적이다.

## 정본

- **저장소 문서:** 현재 작업에서 합의한 목표와 실행 기준.
- **LocalMind:** 과거 결정, 전제, 기각한 대안을 찾는 기억.

현재 작업의 내용이 달라지면 저장소 문서를 먼저 갱신한다. LocalMind는 그 변경의 배경을 찾을 때 사용한다.
