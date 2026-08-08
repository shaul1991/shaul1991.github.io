---
title: 'sdd-5docs 1: AI 위임을 다섯 문서로 나누는 이유'
description: 목표, 요구, 접근, 실행, 완료 증거를 분리해 긴 AI 작업의 기준을 유지한다.
publishedAt: 2026-08-08
tags: [작업 흐름, SDD, AI 위임]
featured: true
series: sdd-5docs
seriesOrder: 1
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

## 적용 기준

- 문서의 크기는 작업 크기에 비례한다.
- 오타·국소 스타일 수정에는 쓰지 않는다.
- 새 개념, 넓은 영향, 되돌리기 어려운 선택에 사용한다.
- 버그는 재현과 실패 테스트부터 시작하고 필요할 때 이 체계로 올린다.

## 정본

- 저장소 문서: 현재 작업의 기준.
- LocalMind: 과거 결정과 전제를 찾는 기억.
