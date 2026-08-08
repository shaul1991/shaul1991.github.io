---
title: localmind-addons
summary: LocalMind의 기억을 실제 AI 작업 방식에 연결해, 결정과 검증 맥락이 세션·모델·시간을 넘어 이어지게 하는 선택 설치형 애드온 모음.
year: '2026'
stack: [Markdown, MCP, AI Skills]
featured: true
facts: [직접 사용하며 개선 중, 애드온별 선택 설치, 4개 active 애드온]
initials: LA
---

<section id="problem" class="story-section">
  <p class="section-label">01 · 시작한 이유</p>
  <h2>AI가 기억을 찾아도, 일하는 방법까지 이어받지 못하면 다시 헤맵니다.</h2>
  <p class="section-intro">LocalMind는 과거 결정과 노트를 다시 찾게 해 줍니다. 하지만 언제 기억을 불러오고, 어떤 판단을 문서로 남기며, 무엇으로 완료를 증명할지는 별도의 작업 규약이 필요했습니다. 이 규약이 한 저장소에 모두 섞이면 필요한 부분만 골라 쓰기도 어렵습니다.</p>
  <div class="plain-language">
    <strong>쉽게 말하면</strong>
    <p>LocalMind가 기억을 보관하는 서재라면, localmind-addons는 AI가 그 서재를 언제 열고 무엇을 기록할지 알려 주는 작업 안내서 모음입니다.</p>
  </div>
</section>

<section id="change" class="story-section">
  <p class="section-label">02 · 무엇이 달라지나</p>
  <h2>하나의 거대한 방법론 대신, 지금 필요한 작업 방식만 선택합니다.</h2>
  <p class="section-intro">프로젝트마다 필요한 규율은 다릅니다. 과거 맥락만 이어받을 수도 있고, 구현 전 미결정을 좁히거나, 다섯 문서로 큰 작업을 구조화하거나, 확정된 문서에서 바로 구현을 재개할 수도 있습니다.</p>
  <div class="before-after" aria-label="통합된 작업 규약과 선택 설치형 애드온 비교">
    <article class="comparison-card before">
      <span>BEFORE · 한곳에 섞인 규약</span>
      <h3>필요하지 않은 절차도 함께 따라옵니다</h3>
      <ul>
        <li>기억 계층과 작업 방법론의 경계가 흐림</li>
        <li>작은 작업에도 큰 절차가 끼어들기 쉬움</li>
        <li>규칙이 늘수록 AI의 판단 범위가 좁아짐</li>
      </ul>
    </article>
    <div class="comparison-arrow" aria-hidden="true">→</div>
    <article class="comparison-card after">
      <span>AFTER · localmind-addons</span>
      <h3>필요한 능력만 골라 연결합니다</h3>
      <ul>
        <li>LocalMind 코어와 방법론을 분리</li>
        <li>애드온별로 선택 설치하고 제거</li>
        <li>작업 크기와 성격에 맞춰 조합</li>
      </ul>
    </article>
  </div>
</section>

<section id="how-it-works" class="story-section">
  <p class="section-label">03 · 사용 흐름</p>
  <h2>AI는 작업 성격에 맞는 애드온을 읽고, LocalMind의 기록과 저장소 문서를 함께 사용합니다.</h2>
  <p class="section-intro">각 애드온은 AI 런타임이 읽는 스킬 형태로 배포됩니다. 절차를 프로그램으로 강제하기보다, 어떤 판단과 기록이 남아야 하는지 알려 줍니다.</p>
  <div class="project-flow" aria-label="localmind-addons의 네 단계 사용 흐름">
    <article class="flow-step"><h3>필요한 애드온 선택</h3><p>현재 작업에 필요한 기억, 조사, 문서화, 구현 흐름을 고릅니다.</p></article>
    <article class="flow-step"><h3>과거 맥락 소환</h3><p>AI가 LocalMind에서 관련 결정과 낡을 수 있는 전제를 확인합니다.</p></article>
    <article class="flow-step"><h3>자율적으로 수행</h3><p>정해진 형식보다 목표와 하한을 기준으로 조사·문서·구현을 이어 갑니다.</p></article>
    <article class="flow-step"><h3>다음 작업에 남김</h3><p>결정과 검증 결과를 저장소와 LocalMind에 남겨 새 세션이 이어받습니다.</p></article>
  </div>
</section>

<section id="architecture" class="story-section">
  <p class="section-label">04 · 구성</p>
  <h2>네 개의 active 애드온이 기억, 결정, 문서, 구현을 나눠 맡습니다.</h2>
  <p class="section-intro">각 애드온의 경계가 분명하면 한 기능을 여러 곳에서 다시 구현하지 않아도 됩니다. 공통 기억 연동은 localmind-core를 통하고, 나머지는 작업 단계별 책임에 집중합니다.</p>
  <div class="tool-grid" aria-label="localmind-addons의 active 애드온">
    <article class="tool-card"><code>localmind-core</code><h3>기억 연동의 공통 바닥</h3><p>세션 시작 브리핑, 과거 기록 검색, 결정의 선택·이유·전제를 남기는 방식을 공유합니다.</p></article>
    <article class="tool-card"><code>shape</code><h3>확정 전 미결정 좁히기</h3><p>구현 전에 필요한 근거를 조사하고 결과를 바꾸는 실제 결정만 사람에게 올립니다.</p></article>
    <article class="tool-card"><code>sdd-5docs</code><h3>다섯 문서 위임 프로토콜</h3><p>goal, spec, plan, tasks, review로 큰 작업의 방향과 완료 증거를 저장소에 남깁니다.</p></article>
    <article class="tool-card"><code>goal-impl</code><h3>문서에서 구현으로</h3><p>확정된 spec 폴더를 찾아 구현을 착수·재개하고 review 게이트까지 완주합니다.</p></article>
  </div>
</section>

<section id="value" class="story-section">
  <p class="section-label">05 · 설계 원칙</p>
  <h2>AI를 더 세게 통제하는 대신, 더 오래 자율적으로 일할 수 있는 하한을 남깁니다.</h2>
  <div class="value-grid">
    <article class="value-card"><h3>형식을 고정하지 않습니다</h3><p>산출물의 목차와 분량을 고정하지 않습니다. 무엇이 기록으로 남아야 하는지만 정해 모델이 좋아질수록 결과도 깊어질 수 있게 합니다.</p></article>
    <article class="value-card"><h3>LocalMind를 우회하지 않습니다</h3><p>각 애드온이 검색과 기록 기능을 따로 만들지 않고 공통 연동 계층을 사용합니다.</p></article>
    <article class="value-card"><h3>선택 설치를 기본으로 둡니다</h3><p>전체 묶음을 강제로 설치하지 않습니다. 작업 방식과 프로젝트에 필요한 애드온만 연결합니다.</p></article>
    <article class="value-card"><h3>런타임보다 기록을 오래 남깁니다</h3><p>특정 대화나 모델의 기억에 의존하지 않고 다음 AI가 읽을 문서와 결정 기록을 정본으로 둡니다.</p></article>
  </div>
</section>

<section id="status" class="story-section">
  <p class="section-label">06 · 현재 상태</p>
  <h2>직접 설치해 실제 작업에 사용하며, 공개 전에 경계와 설치 경험을 다듬고 있습니다.</h2>
  <p class="section-intro">현재 네 애드온은 active 상태이며 sdd-5docs 시리즈를 포함한 실제 작업 흐름에 사용하고 있습니다. 설치와 제거의 안전 조건도 스모크 테스트로 확인합니다.</p>
  <ol class="timeline">
    <li><strong>2026.07</strong><span>LocalMind에서 작업 방법론을 분리하고 선택 설치형 애드온 구조를 만들었습니다.</span></li>
    <li><strong>현재</strong><span>localmind-core, shape, sdd-5docs, goal-impl을 직접 사용하며 경계를 조정하고 있습니다.</span></li>
    <li><strong>공개 전</strong><span>비개발자도 애드온의 차이와 설치 결과를 이해할 수 있도록 안내와 검증 흐름을 보강합니다.</span></li>
  </ol>
  <p class="status-note"><strong>현재 저장소는 비공개입니다.</strong> 이 페이지에서는 실제로 확인한 구조와 사용 원칙만 설명하며, 접근할 수 없는 소스 링크를 공개 저장소처럼 제공하지 않습니다.</p>
</section>
