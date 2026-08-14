---
title: '기억이 이어지는 개인 AI 3: Hermes는 언제 LocalMind를 찾고 기록하나'
description: 요청을 받은 뒤 과거 결정을 검색하고 현재 상태를 검증해 실행한 다음, 새 결정만 다시 남기는 흐름.
publishedAt: 2026-08-14
updatedAt: 2026-08-14
tags: [Hermes, LocalMind, MCP]
featured: true
series: 기억이 이어지는 개인 AI
seriesOrder: 3
editor: 한결
editorReview: 2026-08-14-localmind-hermes-series
---

Hermes는 모델과 도구를 연결해 작업을 수행하고, LocalMind는 사람이 소유한 기록에서 관련 결정을 찾는다. 둘을 연결했다고 해서 모든 노트를 매 요청의 프롬프트에 넣지는 않는다. 필요한 시점에 검색하고 현재 상태로 검증한다.

## 핵심

<figure class="process-flow process-flow--5" aria-label="과거 결정을 소환하고 현재 상태를 검증한 뒤 작업과 기록으로 이어지는 흐름">
<ol class="process-flow">
<li><span aria-hidden="true">🧭</span><strong>확인</strong><small>연결된 지식 정본</small></li>
<li><span aria-hidden="true">🔎</span><strong>검색</strong><small>관련 결정과 전제</small></li>
<li><span aria-hidden="true">⚖️</span><strong>검증</strong><small>저장소·실행 환경</small></li>
<li><span aria-hidden="true">⚙️</span><strong>수행</strong><small>작업과 결과 확인</small></li>
<li><span aria-hidden="true">📝</span><strong>기록</strong><small>새로운 트레이드오프</small></li>
</ol>
</figure>

LocalMind 기록은 정답이 아니라 출발점이다. 오래될 수 있는 전제가 보이면 Hermes는 버전, 설정, 파일, 실행 결과를 다시 확인한다. 기록과 현실이 다르면 현재 상태를 따르고 차이를 새 판단에 반영한다.

## 네 도구의 역할

| 도구 | 사용하는 때 |
| --- | --- |
| `whoami` | 어느 지식 정본에 연결됐는지 확인할 때 |
| `brief` | 작업을 시작하며 관련 결정과 전제를 받을 때 |
| `search_notes` | 특정 근거나 이전 대안을 더 찾을 때 |
| `capture_note` | 선택지가 있던 새 결정을 남길 때 |

`capture_note`는 작업 완료 로그가 아니다. 기존 명세를 그대로 실행했거나 사소한 수정을 했다면 기록하지 않는다. 선택지가 있었고 다음 작업에서 이유를 다시 알아야 할 때만 선택, 이유, 전제를 남긴다.

## 연결이 만드는 차이

새 세션도 과거 결정을 가지고 시작할 수 있지만, 과거에 갇히지는 않는다. 기억은 모델 밖의 사람이 읽는 기록에 남고, 실행은 언제나 현재 저장소와 검증 결과를 기준으로 한다.
