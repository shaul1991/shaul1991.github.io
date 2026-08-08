---
title: '나의 작업 흐름 2: 완료를 증명하고 다음 시작점을 남기는 법'
description: 실행 결과를 증거로 검증하고, 다음 판단에 필요한 결정만 LocalMind에 남긴다.
publishedAt: 2026-08-08
updatedAt: 2026-08-08
tags: [작업 흐름, 검증, LocalMind]
featured: false
series: 나의 작업 흐름
seriesOrder: 2
editor: 한결
editorReview: 2026-08-08-series-consolidation
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

검증이 없으면 “코드를 작성했다”와 “문제가 해결됐다”를 구분할 수 없다. 각 작업에 관찰 가능한 완료 조건을 붙이고, 실패한 검증은 수정 후 처음부터 다시 확인한다.

## 완료 증거

| 영역 | 확인할 증거 | 이유 |
| --- | --- | --- |
| 코드 | 테스트, 타입 검사, 빌드, diff | 의도하지 않은 변경을 찾는다 |
| 화면 | 모바일·데스크톱 렌더링 | 잘림, 겹침, 오버플로를 확인한다 |
| 반영 | PR, CI, 사람의 승인 | 위험과 제품 방향을 최종 판단한다 |

도구가 성공을 출력했다는 사실만으로는 부족하다. 실제 산출물과 사용자가 보게 될 화면까지 확인해야 완료 증거가 된다.

## 기록 기준

LocalMind에는 다시 판단할 때 필요한 내용만 남긴다.

- 되돌리기 어려운 선택과 트레이드오프.
- 선택한 이유, 전제, 기각한 대안.
- 실패한 경로와 우회 방법.
- 남은 위험과 다음 시작점.

사소한 수정과 기존 명세의 복사본은 기록하지 않는다. 기록량보다 다음 작업자가 같은 실수를 반복하지 않게 만드는지가 중요하다.
