---
title: LocalMind
summary: AI가 매번 나를 처음 만나는 것처럼 시작하지 않도록, 흩어진 기록에서 지금 필요한 맥락을 찾아 이어 주는 개인 지식 시스템.
year: '2026'
stack: [Python, MCP, Semantic Search]
featured: true
---

<section id="problem" class="story-section">
  <p class="section-label">01 · 시작한 이유</p>
  <h2>AI에게 일을 맡길 때마다, 왜 처음부터 다시 설명해야 할까?</h2>
  <p class="section-intro">새 대화를 열면 AI는 지난주에 무엇을 결정했는지, 어떤 방법을 이미 검토했다가 버렸는지, 지금 무엇을 중요하게 생각하는지 알지 못합니다. 기록은 노트와 프로젝트 폴더에 남아 있어도 필요한 순간에 연결되지 않으면 사실상 없는 기억과 같습니다.</p>
  <div class="plain-language">
    <strong>쉽게 말하면</strong>
    <p>LocalMind는 <em>나를 위한 사서</em>에 가깝습니다. 모든 책을 통째로 AI에게 건네는 대신, 지금 받은 질문과 관련된 몇 페이지만 찾아서 보여 줍니다. 덕분에 AI는 매번 처음 만난 사람처럼 묻지 않고, 이전 결정의 이유를 이어서 일할 수 있습니다.</p>
  </div>
</section>

<section id="change" class="story-section">
  <p class="section-label">02 · 무엇이 달라지나</p>
  <h2>흩어진 기록이, 다음 작업의 출발점이 됩니다.</h2>
  <p class="section-intro">LocalMind가 없을 때는 사람이 기억을 찾아 AI에게 다시 설명합니다. LocalMind가 있으면 AI가 필요한 맥락을 먼저 검색하고, 중요한 새 결정은 다음 작업을 위해 다시 남깁니다.</p>
  <div class="before-after" aria-label="LocalMind 사용 전과 사용 후 비교">
    <article class="comparison-card before">
      <span>BEFORE · 사용 전</span>
      <h3>사람이 기억을 운반합니다</h3>
      <ul>
        <li>채팅 기록은 대화마다 흩어짐</li>
        <li>노트는 있지만 어디 있는지 기억해야 함</li>
        <li>지난 결정의 이유를 반복해서 설명</li>
      </ul>
    </article>
    <div class="comparison-arrow" aria-hidden="true">→</div>
    <article class="comparison-card after">
      <span>AFTER · LocalMind 사용</span>
      <h3>기록이 맥락으로 돌아옵니다</h3>
      <ul>
        <li>질문과 관련된 기록을 먼저 검색</li>
        <li>결론뿐 아니라 선택한 이유도 전달</li>
        <li>새 결정은 다음 대화를 위해 저장</li>
      </ul>
    </article>
  </div>
</section>

<section id="how-it-works" class="story-section">
  <p class="section-label">03 · 사용 흐름</p>
  <h2>사용자는 평소처럼 질문하고, LocalMind가 뒤에서 기억을 연결합니다.</h2>
  <p class="section-intro">별도의 복잡한 검색 화면을 먼저 배울 필요가 없습니다. AI 도구가 LocalMind의 네 가지 기능을 사용해 필요한 정보를 찾고, 작업이 끝난 뒤 오래 남길 결정을 기록합니다.</p>
  <div class="project-flow" aria-label="LocalMind의 네 단계 사용 흐름">
    <article class="flow-step"><h3>질문합니다</h3><p>사용자가 AI에게 프로젝트 작업이나 조사를 맡깁니다.</p></article>
    <article class="flow-step"><h3>관련 기억을 찾습니다</h3><p>LocalMind가 현재 주제와 가까운 결정과 노트를 골라냅니다.</p></article>
    <article class="flow-step"><h3>맥락을 이어 작업합니다</h3><p>AI는 과거 선택과 전제를 참고해 같은 논의를 반복하지 않습니다.</p></article>
    <article class="flow-step"><h3>새 결정을 남깁니다</h3><p>나중에도 필요한 선택과 이유를 간결한 기록으로 저장합니다.</p></article>
  </div>

  <div class="tool-grid" aria-label="LocalMind의 핵심 기능">
    <article class="tool-card"><code>brief</code><h3>시작 전에 맥락 받기</h3><p>프로젝트 이름이나 주제를 바탕으로 관련 결정, 이유, 아직 유효한 전제를 한 번에 요약합니다.</p></article>
    <article class="tool-card"><code>search_notes</code><h3>필요한 기억 찾기</h3><p>정확한 파일명을 몰라도 자연어 질문과 의미가 가까운 기록을 찾아 줍니다.</p></article>
    <article class="tool-card"><code>capture_note</code><h3>중요한 결정 남기기</h3><p>무엇을 선택했는지뿐 아니라 왜 선택했는지와 어떤 전제에 기대고 있는지도 저장합니다.</p></article>
    <article class="tool-card"><code>whoami</code><h3>연결된 두뇌 확인하기</h3><p>현재 어떤 지식 저장소와 연결되어 있는지 확인해 잘못된 장소에 기록하는 일을 줄입니다.</p></article>
  </div>
</section>

<section id="architecture" class="story-section">
  <p class="section-label">04 · 구조</p>
  <h2>여러 기기에서 하나의 개인 두뇌를 사용합니다.</h2>
  <p class="section-intro">노트와 검색 기능의 기준점은 집에 있는 서버 한 곳입니다. 노트북과 AI 도구는 사설 네트워크를 통해 이 서버에 연결하므로, 기기마다 서로 다른 기억이 쌓이는 문제를 줄입니다.</p>

  <figure class="architecture-map">
    <svg viewBox="0 0 960 470" role="img" aria-labelledby="localmind-architecture-title localmind-architecture-desc" xmlns="http://www.w3.org/2000/svg">
      <title id="localmind-architecture-title">LocalMind 데이터 흐름</title>
      <desc id="localmind-architecture-desc">사용자의 여러 기기와 AI 도구가 사설 네트워크를 거쳐 홈서버의 LocalMind에 연결되고, LocalMind가 개인 노트에서 관련 내용을 찾아 다시 전달하는 구조입니다.</desc>
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#1d2a3d" stroke-width="1"/></pattern>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#67e8f9"/></marker>
      </defs>
      <rect width="960" height="470" fill="#08111f"/>
      <rect width="960" height="470" fill="url(#grid)"/>
      <path d="M250 220H350" stroke="#67e8f9" stroke-width="3" marker-end="url(#arrow)"/>
      <path d="M560 220H650" stroke="#67e8f9" stroke-width="3" marker-end="url(#arrow)"/>
      <path d="M780 305V355" stroke="#a78bfa" stroke-width="3" marker-end="url(#arrow)"/>
      <path d="M650 255H560" stroke="#34d399" stroke-width="2" stroke-dasharray="8 7" marker-end="url(#arrow)"/>
      <path d="M350 255H250" stroke="#34d399" stroke-width="2" stroke-dasharray="8 7" marker-end="url(#arrow)"/>
      <g>
        <rect x="40" y="130" width="210" height="170" rx="18" fill="#0d1e2c" stroke="#22d3ee" stroke-width="2"/>
        <text x="70" y="172" fill="#67e8f9" font-size="15" font-weight="700">나의 기기와 AI 도구</text>
        <text x="70" y="210" fill="#d8e2ef" font-size="14">MacBook · 홈 컴퓨터</text>
        <text x="70" y="238" fill="#d8e2ef" font-size="14">Hermes · Claude · Codex</text>
        <text x="70" y="274" fill="#91a2b8" font-size="12">질문하고, 맥락을 받습니다</text>
      </g>
      <g>
        <rect x="350" y="160" width="210" height="120" rx="18" fill="#231b0d" stroke="#fbbf24" stroke-width="2" stroke-dasharray="8 6"/>
        <text x="382" y="202" fill="#fcd34d" font-size="15" font-weight="700">사설 연결 통로</text>
        <text x="382" y="231" fill="#d8e2ef" font-size="14">Tailscale + HTTP MCP</text>
        <text x="382" y="257" fill="#91a2b8" font-size="12">허가된 연결만 통과</text>
      </g>
      <g>
        <rect x="650" y="80" width="270" height="225" rx="18" fill="#0b281f" stroke="#34d399" stroke-width="2"/>
        <text x="682" y="124" fill="#6ee7b7" font-size="15" font-weight="700">홈서버 · LocalMind</text>
        <text x="682" y="158" fill="#d8e2ef" font-size="14">brief · search_notes</text>
        <text x="682" y="184" fill="#d8e2ef" font-size="14">capture_note · whoami</text>
        <rect x="682" y="215" width="206" height="58" rx="10" fill="#081a15" stroke="#236c55"/>
        <text x="704" y="240" fill="#a7f3d0" font-size="12">질문과 가까운 기록을 찾고</text>
        <text x="704" y="260" fill="#a7f3d0" font-size="12">필요한 만큼만 돌려줍니다</text>
      </g>
      <g>
        <rect x="650" y="355" width="270" height="82" rx="18" fill="#21163d" stroke="#a78bfa" stroke-width="2"/>
        <text x="682" y="389" fill="#c4b5fd" font-size="15" font-weight="700">개인 노트 · 결정 기록</text>
        <text x="682" y="415" fill="#b7c1d1" font-size="12">하나의 기준점에서 보관하고 검색</text>
      </g>
      <text x="270" y="204" fill="#67e8f9" font-size="11">요청</text>
      <text x="577" y="204" fill="#67e8f9" font-size="11">검색</text>
      <text x="574" y="278" fill="#6ee7b7" font-size="11">맥락</text>
      <text x="270" y="278" fill="#6ee7b7" font-size="11">답변</text>
    </svg>
    <figcaption class="architecture-caption">기록은 홈서버를 하나의 기준점으로 삼고, 여러 기기는 같은 기억에 연결됩니다. 기술적인 연결 방식은 사용자가 일상적으로 의식하지 않아도 됩니다.</figcaption>
  </figure>
</section>

<section id="value" class="story-section">
  <p class="section-label">05 · 가치</p>
  <h2>더 많은 정보를 모으는 것보다, 필요한 순간에 다시 쓰는 것이 중요합니다.</h2>
  <div class="value-grid">
    <article class="value-card"><h3>반복 설명을 줄입니다</h3><p>프로젝트 배경과 이전 결정을 매 대화마다 복사해 붙이지 않아도 됩니다.</p></article>
    <article class="value-card"><h3>결정의 이유를 보존합니다</h3><p>최종 선택만 남기는 대신, 당시의 이유와 전제를 함께 기록해 미래의 판단을 돕습니다.</p></article>
    <article class="value-card"><h3>도구가 바뀌어도 기억은 남습니다</h3><p>특정 AI 대화창에 기억을 가두지 않고, MCP를 지원하는 여러 도구가 같은 개인 지식에 접근하도록 설계합니다.</p></article>
    <article class="value-card"><h3>개인의 통제권을 우선합니다</h3><p>하나의 홈서버를 정본으로 사용하고 사설 연결을 유지해, 어디에 무엇이 저장되는지 알 수 있게 합니다.</p></article>
  </div>
</section>

<section id="status" class="story-section">
  <p class="section-label">06 · 현재 상태</p>
  <h2>완성품이라고 포장하기보다, 직접 사용하며 검증하고 있습니다.</h2>
  <p class="section-intro">LocalMind는 실제 AI 작업에 연결해 사용하는 도구입니다. 기능을 무작정 늘리기보다 핵심 기능을 작게 유지하고, 검색 품질과 첫 유용한 결과가 나오는 시간을 측정하는 방향으로 개선하고 있습니다.</p>
  <ol class="timeline">
    <li><strong>2026.06</strong><span>일상적인 AI 작업에 직접 연결해 사용하는 도그푸딩을 시작했습니다.</span></li>
    <li><strong>2026.07</strong><span>복잡했던 구성을 걷어 내고 capture_note, search_notes, whoami, brief 네 가지 핵심 기능에 집중했습니다.</span></li>
    <li><strong>현재</strong><span>홈서버를 하나의 기준점으로 두고, 여러 기기가 원격 HTTP MCP로 같은 개인 지식에 연결되는 구조를 사용합니다.</span></li>
    <li><strong>다음</strong><span>공개·합성 자료를 이용한 검색 회귀 테스트와 첫 유용 결과 시간 기준선을 검증할 예정입니다.</span></li>
  </ol>
  <p class="status-note"><strong>현재 공개 범위에 대한 안내:</strong> 이 페이지는 LocalMind가 해결하려는 문제와 검증된 현재 구조를 설명합니다. 검색 품질 평가의 수치 결과는 아직 기준선 검증 전이므로 성과처럼 제시하지 않습니다.</p>
</section>
