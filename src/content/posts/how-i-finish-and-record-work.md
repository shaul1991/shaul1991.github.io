---
title: '나의 작업 흐름 2: 완료를 증명하고 다음 시작점을 남기는 법'
description: 작업을 작게 나누고 실행 증거로 검증한 뒤 필요한 결정만 LocalMind에 남긴다.
publishedAt: 2026-08-08
updatedAt: 2026-08-08
tags: [작업 흐름, 검증, LocalMind]
featured: false
series: 나의 작업 흐름
seriesOrder: 2
---

작업은 구현이 아니라 검증과 기록까지 끝나야 완료다.

## 핵심

<figure class="process-flow process-flow--4" aria-label="구현을 나누고 검증한 뒤 판단을 기록하는 흐름">
<ol class="process-flow">
<li><span aria-hidden="true">🧩</span><strong>나누기</strong><small>검증 가능한 행동 단위</small></li>
<li><span aria-hidden="true">🧪</span><strong>검증</strong><small>테스트·빌드·화면·CI</small></li>
<li><span aria-hidden="true">🔎</span><strong>재검토</strong><small>self-review 후 재검증</small></li>
<li><span aria-hidden="true">🧠</span><strong>기록</strong><small>다음 판단에 필요한 맥락</small></li>
</ol>
</figure>

## 완료 증거

- 코드: 테스트, 타입 검사, 빌드, diff, PR, CI.
- 화면: 모바일·데스크톱 렌더링, 잘림, 겹침, 오버플로, 접근성.
- 반영: 위험과 제품 방향을 검토한 뒤 사람이 최종 결정.

## 기록 기준

LocalMind에는 다음만 기록한다.

- 되돌리기 어려운 선택과 트레이드오프.
- 선택한 이유, 전제, 기각한 대안.
- 실패한 경로와 우회 방법.
- 남은 위험과 다음 시작점.

사소한 수정과 기존 명세의 복사본은 남기지 않는다.
