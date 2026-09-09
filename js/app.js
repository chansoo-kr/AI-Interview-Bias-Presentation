/* =========================================================
   기계는 무엇을 보았는가 — 전시 운영 스크립트
   ========================================================= */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------
     1. 입구 — 관람 시작
     --------------------------------------------------------- */
  var entrance = $('#entrance');
  var rail = $('#rail');

  function openExhibition() {
    entrance.classList.add('gone');
    document.body.classList.remove('is-locked');
    rail.classList.add('on');
    setTimeout(function () { entrance.style.display = 'none'; }, 950);
  }
  $('#enterBtn').addEventListener('click', openExhibition);
  document.addEventListener('keydown', function (e) {
    if (!entrance.classList.contains('gone') && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault(); openExhibition();
    }
  });

  /* ---------------------------------------------------------
     2. 진행 표시 · 현재 전시실 표시 · 등장 연출
     --------------------------------------------------------- */
  var bar = $('#progress');
  var navLinks = $$('#rail nav a');
  var sections = ['hall', 'room1', 'room2', 'room3', 'exit'].map(function (id) { return document.getElementById(id); });

  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';

    var mid = h.scrollTop + window.innerHeight * 0.35, cur = sections[0];
    sections.forEach(function (s) { if (s && s.offsetTop <= mid) cur = s; });
    navLinks.forEach(function (a) { a.classList.toggle('active', a.dataset.nav === cur.id); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------------------------------------------------
     3. 제1전시실 — 기사 전문 아카이브
     --------------------------------------------------------- */
  var ARTICLES = {
    amazon: {
      paper: 'REUTERS', edition: 'TECHNOLOGY NEWS · SAN FRANCISCO', date: '2018년 10월 10일',
      kicker: '단독 보도 · 인공지능 채용',
      title: '아마존, 여성을 걸러내던 AI 채용 도구를 폐기하다',
      dek: '10년치 이력서로 학습한 실험용 채용 엔진이 ‘여성’이라는 단어를 감점 요인으로 삼았다. 기술직 지원자 대부분이 남성이었던 과거의 기록이, 그대로 미래의 채용 기준이 되어 있었다.',
      byline: 'Jeffrey Dastin 기자 · 로이터 통신',
      body: [
        '아마존이 2014년부터 비밀리에 개발해 온 인공지능 이력서 심사 도구를 결국 폐기했다고 사안에 정통한 관계자 5명이 로이터에 밝혔다. 이 도구가 여성 지원자에게 체계적으로 불리한 평가를 내린다는 사실이 확인됐기 때문이다.',
        '스코틀랜드 에든버러에 자리 잡은 개발팀은 지원자를 별 1개에서 5개까지 자동으로 등급 매기는 엔진을 만들었다. 관계자들은 “쇼핑몰에서 상품에 별점을 매기듯, 이력서를 넣으면 상위 다섯 명을 뽑아 주는 도구를 원했다”고 전했다.',
        '문제는 2015년에 드러났다. 소프트웨어 개발직을 비롯한 기술 직군에서 이 엔진이 성별에 중립적인 평가를 내리지 않는다는 점이 발견된 것이다.',
        { pull: '기계는 남성 지원자를 선호하도록 스스로 학습했다. 그렇게 하라고 가르친 사람은 아무도 없었다.' },
        '원인은 학습 데이터에 있었다. 이 모델은 회사에 접수된 <b>지난 10년치 이력서</b>를 관찰하며 채용의 패턴을 익혔다. 그런데 그 10년 동안 기술 업계에 지원한 사람은 압도적으로 남성이었다. 기계는 이 불균형을 ‘업계의 현실’이 아니라 ‘합격의 조건’으로 읽어 냈다.',
        '그 결과 시스템은 <b>‘여성(women’s)’이라는 단어가 들어간 이력서를 감점</b>했다. “여성 체스 동아리 회장”과 같은 표현이 대표적이었다. 여자대학교 두 곳의 졸업생 역시 등급이 하향 조정된 것으로 전해졌다.',
        '아마존은 해당 표현들에 대해 중립적으로 작동하도록 프로그램을 수정했다. 그러나 기계가 다른 방식으로 차별적인 기준을 새로 만들어 내지 않으리라는 보장은 없었다. 회사는 2017년 초 이 팀을 사실상 해체했다.',
        '아마존 측은 이 도구가 “채용 담당자가 지원자를 평가하는 데 실제로 사용된 적은 없다”고 밝혔다. 다만 채용 담당자들이 이 엔진이 내놓는 추천 결과를 열람했는지에 대해서는 언급하지 않았다.',
        '전문가들은 이 사건이 개별 기업의 실패가 아니라고 지적한다. 과거의 인사 기록을 정답지로 삼는 한, 어떤 알고리즘도 과거의 불균형을 물려받을 수밖에 없다는 것이다.'
      ],
      src: [['Jeffrey Dastin, “Amazon scraps secret AI recruiting tool that showed bias against women”, Reuters, 2018.10.10', 'https://www.reuters.com/article/us-amazon-com-jobs-automation-insight-idUSKCN1MK08G']]
    },

    itutor: {
      paper: 'U.S. EEOC', edition: '미국 고용평등위원회 · 공식 보도자료', date: '2023년 8월 9일',
      kicker: '합의 종결 · 연령 차별',
      title: '“55세 이상 여성은 자동 탈락” — 36만 5천 달러 합의',
      dek: '지원서 접수 소프트웨어가 나이만을 근거로 200명이 넘는 지원자를 사람의 검토 없이 걸러냈다. 미국 고용평등위원회가 제기한 채용 알고리즘 차별 소송이 합의로 종결됐다.',
      byline: '미국 고용평등위원회(EEOC) 뉴욕지구 사무소',
      body: [
        '중국 학생들에게 원격 교육을 제공하며 미국 내 강사를 모집해 온 iTutorGroup 계열사 세 곳이, 나이를 이유로 지원자를 자동 탈락시킨 혐의와 관련해 <b>36만 5천 달러</b>를 지급하기로 합의했다.',
        'EEOC의 조사에 따르면 이 회사의 지원서 접수 소프트웨어에는 <b>55세 이상 여성과 60세 이상 남성 지원자를 자동으로 거부</b>하도록 하는 설정이 들어 있었다. 지원자가 입력한 생년월일이 기준을 넘으면, 자격 요건을 충분히 갖췄더라도 화면에는 곧바로 탈락 통보가 떴다.',
        { pull: '한 지원자는 같은 이력서에 생년월일만 더 늦게 적어 다시 지원했고, 그때는 면접 기회를 받았다.' },
        '이 사실은 한 지원자가 동일한 이력서로 두 차례 지원하면서 드러났다. 첫 지원에서는 즉시 거부됐지만, 생년월일만 바꿔 다시 넣자 면접 제안이 돌아왔다. 최소 <b>200명 이상</b>의 지원자가 같은 방식으로 걸러진 것으로 파악됐다.',
        '뉴욕 동부연방지방법원에 제출된 합의안(consent decree)에 따라, 회사는 합의금 지급과 함께 차별금지 정책 수립, 관리자 교육, 그리고 <b>부당하게 탈락한 지원자들에 대한 재검토</b>를 이행하기로 했다.',
        'EEOC는 이 사건이 “인공지능이라 부를 만한 정교한 모델이 아니라, 단순한 자동 규칙만으로도 대규모 차별이 발생할 수 있음을 보여 준다”는 점에서 중요하다고 밝혔다. 위원회는 알고리즘을 이용한 고용 결정 역시 기존 차별금지법의 적용을 그대로 받는다는 입장을 재확인했다.',
        '자동화된 심사에서 문제가 되는 것은 판단의 정교함이 아니라 <b>사람의 검토가 사라진 구조</b>다. 탈락의 이유가 기록되지 않으면, 지원자는 물론 회사조차 무엇이 잘못됐는지 확인할 방법이 없다.'
      ],
      src: [['U.S. EEOC, “iTutorGroup to Pay $365,000 to Settle EEOC Discriminatory Hiring Suit”, 2023.08.09', 'https://www.eeoc.gov/newsroom/itutorgroup-pay-365000-settle-eeoc-discriminatory-hiring-suit'],
            ['EEOC 기술지침, “Assessing Adverse Impact in Software, Algorithms, and AI ... Under Title VII”, 2023.05.18', 'https://www.eeoc.gov/laws/guidance/select-issues-assessing-adverse-impact-software-algorithms-and-artificial']]
    },

    hirevue: {
      paper: 'WIRED', edition: 'BUSINESS · ARTIFICIAL INTELLIGENCE', date: '2021년 1월 12일',
      kicker: '화상 면접 · 감정 인식',
      title: '표정을 채점하던 면접 AI, 얼굴 분석을 중단하다',
      dek: '지원자의 표정과 시선을 점수로 환산하던 기능이 폐기됐다. 회사는 “시각 분석이 예측에 유의미하게 기여하지 않았다”고 밝혔지만, 그전까지 수많은 지원자가 그 점수로 평가받았다.',
      byline: 'Will Knight 기자 · WIRED',
      body: [
        '화상 면접 심사 서비스를 제공하는 HireVue가 지원자의 <b>얼굴 표정 분석 기능을 중단</b>했다고 밝혔다. 이 기능은 지원자가 카메라 앞에서 답변하는 동안 표정 변화와 시선, 미세한 움직임을 분석해 ‘고용 적합도’ 점수에 반영하는 방식이었다.',
        '회사는 외부 알고리즘 감사를 받은 뒤, 시각 정보 분석이 예측 성능에 <b>유의미하게 기여하지 않는다</b>고 판단해 해당 기능을 제거했다고 설명했다.',
        { pull: '문제는 정확도가 아니라 근거였다. 웃는 얼굴이 좋은 직원을 만든다는 증거는 어디에도 없었다.' },
        '2019년 11월, 프라이버시 단체 EPIC은 이 서비스가 “검증되지 않고 설명할 수 없는 기준으로 사람을 평가한다”며 미국 연방거래위원회(FTC)에 진정을 제기했다. 연구자들 또한 표정과 감정, 나아가 업무 능력 사이의 연결이 과학적으로 입증되지 않았다고 지적해 왔다.',
        '표정 기반 평가는 특히 문화적 배경, 장애, 신경다양성에 따라 표현 방식이 다른 지원자에게 불리하게 작용할 수 있다. 얼굴 근육의 움직임이 적은 사람, 시선을 마주치기 어려운 사람은 능력과 무관하게 낮은 점수를 받게 된다.',
        '이 사례가 남긴 질문은 분명하다. <b>직무와의 연관성이 입증되지 않은 신호</b>가 어떻게 채용 점수의 일부가 될 수 있었는가. 그리고 그 점수로 탈락한 사람들에게, 회사는 무엇을 설명할 수 있었는가.'
      ],
      src: [['Will Knight, “Job Screening Service Halts Facial Analysis of Applicants”, WIRED, 2021.01.12', 'https://www.wired.com/story/job-screening-service-halts-facial-analysis-applicants/'],
            ['EPIC, “In re HireVue” — FTC 진정서, 2019.11.06', 'https://epic.org/documents/in-re-hirevue/']]
    },

    uw: {
      paper: 'UW NEWS', edition: '워싱턴대학교 · 연구 보도', date: '2024년 10월 31일',
      kicker: '실험 연구 · 대규모 언어모델',
      title: '같은 이력서, 이름만 바꾸자 순위가 갈렸다',
      dek: '내용이 동일한 이력서에 이름만 달리 붙여 AI 심사 모델에 넣었다. 모델은 백인 남성으로 연상되는 이름을 압도적으로 상위에 올렸고, 흑인 남성 이름은 단 한 번도 우선하지 않았다.',
      byline: 'Stefan Milne · 워싱턴대학교 뉴스 / 연구: Kyra Wilson, Aylin Caliskan',
      body: [
        '워싱턴대학교 정보대학원 연구진이 대규모 언어모델(LLM) 기반 이력서 심사 도구의 편향을 측정한 결과, <b>이력서의 내용이 완전히 같아도 이름에 따라 순위가 달라진다</b>는 사실을 확인했다.',
        '연구진은 554건의 실제 이력서와 571건의 채용 공고를 수집한 뒤, 인종·성별과 강하게 연상되는 <b>120개의 이름</b>을 이력서에 번갈아 붙여 넣었다. 그리고 세 종류의 최신 언어모델에 “이 공고에 맞는 지원자를 순위 매기라”고 요청했다. 삼백만 건이 넘는 비교가 이뤄졌다.',
        { pull: '이력서의 자격, 경력, 성과는 한 글자도 바뀌지 않았다. 바뀐 것은 맨 윗줄의 이름뿐이었다.' },
        '결과는 뚜렷했다. 모델은 <b>백인으로 연상되는 이름을 약 85%의 경우 우선</b>했고, 여성으로 연상되는 이름을 우선한 경우는 <b>11%</b>에 그쳤다. 특히 흑인 남성으로 연상되는 이름은 백인 남성 이름과의 비교에서 <b>단 한 번도 우위를 점하지 못한</b> 조합이 나타났다.',
        '연구진은 이 현상이 모델이 학습한 방대한 웹 텍스트 안에 이미 축적돼 있는 사회적 연상 때문이라고 설명한다. 모델은 차별하라고 배운 적이 없지만, 인터넷에 쌓인 언어의 통계 속에서 이름과 지위, 직업, 능력의 연결을 함께 흡수했다.',
        '이 연구가 던지는 함의는 실무적이다. 이력서에서 <b>이름 한 줄을 제거하는 것만으로도</b> 상당한 편향을 차단할 수 있다는 뜻이기 때문이다. 동시에, 이름을 지우더라도 학교·동아리·주소처럼 같은 정보를 우회적으로 전달하는 항목이 남아 있다면 편향은 되살아난다.',
        '해당 연구는 2024년 AAAI/ACM 인공지능·윤리·사회 학술대회(AIES)에서 발표됐다.'
      ],
      src: [['Stefan Milne, “AI tools show biases in ranking job applicants’ names according to perceived race and gender”, UW News, 2024.10.31', 'https://www.washington.edu/news/2024/10/31/ai-bias-resume-screening-race-gender/'],
            ['Kyra Wilson & Aylin Caliskan, AAAI/ACM Conference on AI, Ethics, and Society (AIES), 2024', 'https://ischool.uw.edu/news/2024/10/ai-tools-show-biases-ranking-job-applicants-names-according-perceived-race-and']]
    },

    workday: {
      paper: 'REUTERS', edition: 'LEGAL · EMPLOYMENT LITIGATION', date: '2024년 7월 — 2025년 5월',
      kicker: '진행 중인 소송',
      title: '지원 100번, 탈락 100번 — 심사 알고리즘이 법정에 서다',
      dek: '채용 심사 소프트웨어를 만든 회사가 지원자에게 직접 소송을 당했다. 도구를 쓴 기업이 아니라 도구를 만든 기업의 책임을 묻는 첫 사건으로, 미국 전역 규모의 집단소송으로 확대됐다.',
      byline: '로이터 법률 · 미국 캘리포니아 북부연방지방법원',
      body: [
        '인사관리 소프트웨어 기업 Workday를 상대로 한 채용 차별 소송이 본안 심리 단계로 넘어갔다. 원고 데릭 모블리(Derek Mobley)는 이 회사의 지원자 심사 도구를 사용하는 기업들에 <b>100곳이 넘게 지원했으나 모두 탈락</b>했으며, 그 과정에서 인종·연령·장애를 이유로 한 차별이 있었다고 주장했다.',
        '이 사건의 핵심 쟁점은 책임의 소재였다. 차별금지법은 통상 <b>고용주</b>를 규율한다. 그렇다면 고용주가 아니라, 고용주에게 심사 도구를 공급한 소프트웨어 회사도 책임을 질 수 있는가.',
        { pull: '심사 도구가 사실상 채용 결정을 대신하고 있다면, 그 도구를 만든 회사도 책임에서 자유로울 수 없다.' },
        '2024년 7월, 법원은 소프트웨어 제공사가 고용주를 대신해 지원자 심사 기능을 수행했다면 <b>고용주의 대리인(agent)</b>으로서 차별금지법의 적용을 받을 수 있다고 판단하고, 사건을 각하해 달라는 회사 측 요청을 상당 부분 받아들이지 않았다.',
        '2025년 5월에는 연령차별금지법(ADEA)에 근거한 <b>전국 단위 집단소송(collective action)</b>의 예비 인증이 이뤄지면서, 유사한 방식으로 탈락한 다수의 지원자가 절차에 합류할 수 있는 길이 열렸다.',
        '회사 측은 자사 도구가 지원자를 자동으로 탈락시키지 않으며 차별 주장에 근거가 없다는 입장이다. 사건은 아직 최종 판단이 내려지지 않은 상태다.',
        '그럼에도 이 소송은 이미 하나의 신호를 남겼다. 자동화된 심사에서 <b>“알고리즘이 그렇게 했다”는 말은 더 이상 면책이 되지 않는다</b>는 것이다.'
      ],
      src: [['“Workday must face novel bias lawsuit over AI screening software”, Reuters, 2024.07', 'https://www.reuters.com/legal/litigation/workday-must-face-novel-bias-lawsuit-over-ai-screening-software-2024-07-15/'],
            ['Mobley v. Workday, Inc., 미국 캘리포니아 북부연방지방법원 — 사건 경과는 진행 중이며 최종 판결이 아님', 'https://www.reuters.com/legal/']]
    }
  };

  var modal = $('#modal'), paperBody = $('#paperBody'), lastFocus = null;

  function renderArticle(key) {
    var a = ARTICLES[key];
    if (!a) return;
    var body = a.body.map(function (p) {
      return typeof p === 'string' ? '<p>' + p + '</p>' : '<div class="pull">' + p.pull + '</div>';
    }).join('');
    var src = a.src.map(function (s) {
      return '<div>· ' + s[0] + '<br><a href="' + s[1] + '" target="_blank" rel="noopener">' + s[1] + '</a></div>';
    }).join('');

    paperBody.innerHTML =
      '<button class="close" id="closeBtn">닫기 ✕</button>' +
      '<div class="flag"><div class="name">' + a.paper + '</div>' +
      '<div class="line"><span>' + a.edition + '</span><span>' + a.date + '</span></div></div>' +
      '<div class="kicker">' + a.kicker + '</div>' +
      '<h3>' + a.title + '</h3>' +
      '<p class="dek">' + a.dek + '</p>' +
      '<div class="byline">' + a.byline + '</div>' +
      '<div class="body">' + body + '</div>' +
      '<div class="source"><b>출처 · SOURCE</b>' + src +
      '<div style="margin-top:10px;color:var(--ink-3)">※ 본 지면은 원 보도의 사실관계를 바탕으로 전시용으로 재구성한 것입니다. 인용 부분은 요약·번역되었으며, 정확한 원문은 위 링크에서 확인할 수 있습니다.</div></div>';

    modal.classList.add('on');
    document.body.classList.add('is-locked');
    $('#closeBtn').addEventListener('click', closeArticle);
    $('#closeBtn').focus();
  }

  function closeArticle() {
    modal.classList.remove('on');
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus();
  }

  $$('.clip').forEach(function (c) {
    function open() { lastFocus = c; renderArticle(c.dataset.article); }
    c.addEventListener('click', open);
    c.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });
  modal.addEventListener('click', function (e) { if (e.target === modal) closeArticle(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('on')) closeArticle(); });

  /* ---------------------------------------------------------
     4. 제2전시실 (1) — 편향 증폭 시뮬레이션
     --------------------------------------------------------- */
  var ratio = $('#ratio');

  function amplify(p) {
    // 다수 패턴을 '정답'으로 굳히는 경향: 다수/소수의 승산비를 1.6제곱으로 키운다.
    if (p <= 0) return 0;
    if (p >= 100) return 100;
    var odds = Math.pow(p / (100 - p), 1.6);
    return 100 * odds / (odds + 1);
  }

  function updateSim() {
    var p = +ratio.value, q = amplify(p);
    var pr = Math.round(p), qr = Math.round(q);

    $('#dataVal').innerHTML = pr + '<small>%</small>';
    $('#inM').textContent = pr + '%';
    $('#inF').textContent = (100 - pr) + '%';
    $('#outM').textContent = qr + '%';
    $('#outF').textContent = (100 - qr) + '%';
    $('#barInM').style.width = pr + '%';
    $('#barInF').style.width = (100 - pr) + '%';
    $('#barOutM').style.width = qr + '%';
    $('#barOutF').style.width = (100 - qr) + '%';

    var inMin = 100 - pr, outMin = 100 - qr;
    var factor = inMin > 0 ? (outMin / inMin) : 0;
    $('#ampTag').textContent = '소수 집단 통과율 × ' + factor.toFixed(2);

    var t;
    if (pr <= 15) {
      t = '기록이 한쪽으로 극단적으로 치우쳐 있습니다. 기계는 소수 집단의 패턴을 <b>배울 기회 자체가 부족해져</b> 그들을 제대로 평가하기 어렵습니다.';
    } else if (pr <= 30) {
      t = '소수 집단의 기록이 너무 적으면 기계는 그들의 특징보다 다수 집단의 패턴을 더 많이 학습합니다. 결과적으로 <b>데이터의 불균형이 편향으로 이어질 수 있습니다.</b>';
    } else if (pr <= 45) {
      t = '아직 한쪽으로 기울어져 있습니다. 기계는 더 많은 쪽의 패턴을 상대적으로 자주 접하기 때문에 <b>작은 차이도 판단에 영향을 줄 수 있습니다.</b>';
    } else if (pr <= 55) {
      t = '과거 기록이 균형에 가까우면 기계도 균형에 가까운 결과를 냅니다. <b>문제는 기계가 아니라 기계에게 준 과거입니다.</b>';
    } else if (pr <= 70) {
      t = '작은 기울기도 그대로 남지 않습니다. 기계는 다수 쪽 패턴을 ‘정답의 특징’으로 굳히면서 <b>기울기를 더 키워</b> 돌려줍니다.';
    } else if (pr <= 85) {
      t = '이 지점이 아마존 사례의 조건입니다. 소수 집단의 이력서에 자주 등장하는 표현이 <b>‘드물다’는 이유만으로 감점 신호</b>가 됩니다.';
    } else {
      t = '기록이 한쪽으로 완전히 쏠리면, 기계는 소수 집단을 <b>사실상 존재하지 않는 유형</b>으로 취급합니다. 실력을 볼 기회조차 사라집니다.';
    }
    $('#verdictTxt').innerHTML = t;
  }
  ratio.addEventListener('input', updateSim);
  updateSim();

  /* ---------------------------------------------------------
     5. 제2전시실 (2) — 인과 / 상관 도식
     --------------------------------------------------------- */
  var btnReal = $('#btnReal'), btnAI = $('#btnAI');
  var gReal = $('#gReal'), gAI = $('#gAI'), readout = $('#readout');

  var MODES = {
    real: {
      rk: '해설 · 실제 세계',
      h: '합격 기록은 순수한 실력의 기록이 아니다',
      p: '과거의 합격 여부는 <b>실력</b>과 <b>당시 인사담당자의 편견</b>이 뒤섞여 만들어진 결과입니다. 이름·거주지·학교는 업무 성과를 만들어 내지 않지만, 사람의 판단을 거치면서 합격 기록에 흔적을 남깁니다. 이 기록이 바로 AI가 배우는 <b>정답지</b>입니다.',
      stats: [['실력이 합격에 미친 실제 영향', '있음', 0], ['편견이 합격에 미친 실제 영향', '있음', 1], ['정답지의 오염', '진행됨', 1]]
    },
    ai: {
      rk: '해설 · AI가 학습한 세계',
      h: '기계는 원인을 찾지 않는다. 잘 맞는 신호를 찾는다',
      p: '기계는 “무엇이 성과를 <b>만드는가</b>”를 묻지 않고, “무엇이 합격과 <b>같이 나타나는가</b>”만 셉니다. 정답지가 오염돼 있으면, 오염의 원인이었던 이름·거주지·학교가 오히려 <b>가장 예측력 높은 변수</b>가 됩니다. 진짜 원인인 직무 역량은 상대적으로 뒤로 밀립니다.',
      stats: [['출신 학교의 예측 기여도', '.63', 1], ['직무 역량의 예측 기여도', '.31', 0], ['식별정보의 실제 인과효과', '0', 1]]
    }
  };

  function setMode(m) {
    var on = m === 'real';
    gReal.classList.toggle('on', on);
    gAI.classList.toggle('on', !on);
    btnReal.classList.toggle('on', on);
    btnAI.classList.toggle('on', !on);
    $$('.node.sel').forEach(function (n) { n.classList.remove('sel'); });
    var d = MODES[on ? 'real' : 'ai'];
    readout.innerHTML = '<div class="rk">' + d.rk + '</div><h4>' + d.h + '</h4><p>' + d.p + '</p>' +
      '<div class="stats">' + d.stats.map(function (s) {
        return '<div class="' + (s[2] ? 'hi' : '') + '"><b>' + s[1] + '</b><span>' + s[0] + '</span></div>';
      }).join('') + '</div>';
  }
  btnReal.addEventListener('click', function () { setMode('real'); });
  btnAI.addEventListener('click', function () { setMode('ai'); });

  var NODES = {
    name: {
      h: '이름 · 성별 — 상관은 있고, 인과는 없다',
      p: '이름은 업무 성과를 단 1%도 만들어 내지 못합니다. 그러나 과거 합격자의 성비가 기울어 있으면, 이름과 성별은 합격 여부를 <b>잘 맞히는 변수</b>가 됩니다. 기계에게 “잘 맞히는 변수”와 “원인”은 구분되지 않습니다.',
      s: [['합격과의 상관', '.58', 1], ['성과에 대한 인과효과', '0', 0], ['법적 지위', '차별금지 대상', 1]]
    },
    addr: {
      h: '거주지 — 다른 것을 대신 말해 주는 변수',
      p: '거주지 자체는 능력과 무관하지만, 주거비·교육 기회·인맥의 <b>대리 신호(proxy)</b>로 작동합니다. 성별이나 인종을 직접 지워도 거주지가 남아 있으면, 기계는 그것으로 지워진 정보를 상당 부분 <b>복원</b>해 냅니다.',
      s: [['합격과의 상관', '.51', 1], ['성과에 대한 인과효과', '0', 0], ['대리 신호 위험', '높음', 1]]
    },
    school: {
      h: '출신 학교 — 결과를 원인으로 착각하기',
      p: '학교는 부분적으로 역량을 반영하지만, 동시에 <b>가정 환경과 교육 기회의 결과</b>이기도 합니다. 과거 합격자에 특정 학교가 몰려 있으면 상관은 가장 높게 나타납니다. 기계는 이 상관을 근거로 “이 학교 출신이 일을 잘한다”는 결론을 스스로 만들어 냅니다.',
      s: [['합격과의 상관', '.63', 1], ['성과에 대한 인과효과', '낮음', 0], ['출신 학교로 설명되는 성과 차이', '미미', 0]]
    },
    skill: {
      h: '직무 역량 — 진짜 원인이 밀려나는 이유',
      p: '역량은 성과를 실제로 만들어 내는 <b>유일한 인과 변수</b>입니다. 그런데 정답지(과거 합격 기록)가 편향으로 오염돼 있으면, 역량과 합격 사이의 상관은 오히려 <b>희석</b>됩니다. 그 결과 기계는 진짜 원인을 후순위로 밀고, 편향된 대리 신호를 앞세웁니다. 이것이 AI 채용 편향의 핵심 구조입니다.',
      s: [['합격과의 상관', '.31', 0], ['성과에 대한 인과효과', '높음', 1], ['모델 내 중요도 순위', '4위', 0]]
    }
  };

  $$('.node.clickable').forEach(function (n) {
    n.addEventListener('click', function () {
      $$('.node.sel').forEach(function (x) { x.classList.remove('sel'); });
      n.classList.add('sel');
      var d = NODES[n.dataset.node];
      readout.innerHTML = '<div class="rk">변수 열람</div><h4>' + d.h + '</h4><p>' + d.p + '</p>' +
        '<div class="stats">' + d.s.map(function (s) {
          return '<div class="' + (s[2] ? 'hi' : '') + '"><b>' + s[1] + '</b><span>' + s[0] + '</span></div>';
        }).join('') + '</div>';
    });
  });

  /* ---------------------------------------------------------
     6. 제3전시실 (1) — 마스킹 실험대
     --------------------------------------------------------- */
  var RISK = { name: 12, gender: 22, age: 18, photo: 14, addr: 12, school: 12 }; // 합계 90
  var JOBW = 84; // 경력·프로젝트·기술·자격 가중치 합
  var masked = {};

  function updateMask() {
    var open = 0;
    Object.keys(RISK).forEach(function (k) { if (!masked[k]) open += RISK[k]; });

    var risk = Math.round(open / 90 * 100);
    var rel = Math.round(JOBW / (JOBW + open) * 100);

    $('#riskV').textContent = risk;
    $('#relV').textContent = rel + '%';
    $('#riskBar').style.width = risk + '%';
    $('#relBar').style.width = rel + '%';
    $('#riskBar').style.background = risk > 60 ? '#a63a24' : risk > 25 ? '#b08d4f' : '#2f7a6b';

    var note;
    if (risk === 0) {
      note = '<b>기계가 보는 것은 이제 일뿐입니다.</b> 판단의 근거가 전부 직무 정보로 채워졌습니다. 다만 여기서 끝이 아닙니다 — 자기소개서 속 <b>동아리명·군복무·경력 공백</b>이 가려진 정보를 다시 알려줄 수 있으므로, 대리 신호 점검이 함께 필요합니다.';
    } else if (risk <= 30) {
      note = '<b>위험이 크게 줄었습니다.</b> 남은 항목도 결국 사람을 식별하게 만듭니다. 특히 <b>출신 학교</b>는 지역·소득·인맥의 대리 신호로 작동하므로 마지막까지 가리는 것이 안전합니다.';
    } else if (risk <= 65) {
      note = '<b>절반의 블라인드입니다.</b> 성별이나 나이 중 하나만 남아 있어도 모델은 그 축을 따라 지원자를 나눕니다. 부분 마스킹은 편향을 줄이지 못하고 <b>숨길</b> 뿐입니다.';
    } else {
      note = '<b>아직 기계는 사람을 보고 있습니다.</b> 성별·나이·사진처럼 직무 수행과 무관한 정보가 그대로 모델에 들어가면, 그 정보는 반드시 점수에 반영됩니다.';
    }
    $('#maskNote').innerHTML = note;
  }

  $$('.tg').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.dataset.t;
      masked[k] = !masked[k];
      b.classList.toggle('on', !!masked[k]);
      b.setAttribute('aria-pressed', masked[k] ? 'true' : 'false');
      $('.fld[data-f="' + k + '"]').classList.toggle('masked', !!masked[k]);
      updateMask();
    });
  });

  $('#maskAll').addEventListener('click', function () {
    var allOn = Object.keys(RISK).every(function (k) { return masked[k]; });
    Object.keys(RISK).forEach(function (k) {
      masked[k] = !allOn;
      $('.tg[data-t="' + k + '"]').classList.toggle('on', !allOn);
      $('.fld[data-f="' + k + '"]').classList.toggle('masked', !allOn);
    });
    this.textContent = allOn ? '전부 가리기' : '가림막 걷기';
    updateMask();
  });
  updateMask();

  /* ---------------------------------------------------------
     7. 제3전시실 (2) — 판단 근거 열람
     --------------------------------------------------------- */
  var rBtn = $('#reasonBtn'), rList = $('#reasonList'), rHidden = $('#reasonHidden');
  rBtn.addEventListener('click', function () {
    var shown = !rList.hidden;
    rList.hidden = shown;
    rHidden.hidden = !shown;
    rBtn.textContent = shown ? '판정 근거 열람하기' : '근거 접기';
  });

})();

/* =========================================================
   8. 제3전시실 (3) — 일괄 비교 심사
   ========================================================= */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };

  var CANDS = [
    { id: 'A', tag: '여성 · 32세 · 수고권 상위권 대학', job: 88, solo: 61, cue: '경력 공백 1년(육아)이 감점으로 잡힘' },
    { id: 'B', tag: '남성 · 29세 · 수도권 상위권 대학', job: 74, solo: 82, cue: '학교·이력서 문체가 과거 합격자와 유사' },
    { id: 'C', tag: '남성 · 47세 · 동종업계 15년', job: 81, solo: 66, cue: '졸업연도에서 추정된 나이가 감점으로 작용' },
    { id: 'D', tag: '여성 · 26세 · 신입 2년차', job: 69, solo: 71, cue: '특이 신호 없음' }
  ];

  var PROMPTS = {
    solo: '요청 ①  <b>지원자 A의 지원서</b>를 평가하고 100점 만점 점수를 매기시오.\n요청 ②  <b>지원자 B의 지원서</b>를 평가하고 100점 만점 점수를 매기시오.\n요청 ③  <b>지원자 C의 지원서</b>를 …\n요청 ④  <b>지원자 D의 지원서</b>를 …\n\n<i>→ 요청이 서로 분리되어 있어, 매 요청마다 “몇 점이 보통인지”를 모델이 새로 정한다.\n   그 빈 기준을 이름·나이·학교 같은 익숙한 신호가 대신 채운다.</i>',
    batch: '요청 ①  아래 <b>지원서 4건을 모두</b> 읽고, <b>동일한 채용 요건 5개 항목</b>에 따라\n        서로 <b>비교</b>하여 순위를 매기고, 각 순위의 근거를 요건별로 제시하시오.\n        (지원서 A, B, C, D — 인적사항 마스킹 적용, 순서 무작위)\n\n<i>→ 네 명이 같은 화면 위에 놓이므로 잣대가 하나로 고정된다.\n   “이 사람은 몇 점인가” 대신 “요건 2항을 누가 더 충족하는가”를 묻게 된다.</i>'
  };

  var listEl = $('#candList'), pv = $('#promptView');
  if (!listEl) return;

  function render(mode) {
    var batch = mode === 'batch';
    pv.innerHTML = batch ? PROMPTS.batch : PROMPTS.solo;

    var rows = CANDS.slice().sort(function (a, b) {
      return batch ? b.job - a.job : b.solo - a.solo;
    });

    listEl.innerHTML = rows.map(function (c, i) {
      var score = batch ? c.job : c.solo;
      var sub = batch
        ? '요건 충족도 기준 · 동일 잣대 적용'
        : (c.cue === '특이 신호 없음' ? '개별 채점 · ' + c.cue : '개별 채점 · <s>' + c.cue + '</s>');
      return '<li class="cand' + (i === 0 ? ' top' : '') + '">' +
        '<div class="rk">' + (i + 1) + '</div>' +
        '<div class="who">지원자 ' + c.id + ' <em>' + c.tag + '<br>' + sub + '</em></div>' +
        '<div class="sc"><b>' + score + '</b><span>' + (batch ? '비교 순위 점수' : '절대 점수') + '</span></div>' +
        '</li>';
    }).join('');

    $('#driftV').textContent = batch ? '±0점' : '±14점';
    $('#driftBar').style.width = batch ? '4%' : '78%';
    $('#driftBar').style.background = batch ? '#2f7a6b' : '#a63a24';
    $('#matchV').textContent = batch ? '100%' : '35%';
    $('#matchBar').style.width = batch ? '100%' : '35%';
    $('#matchBar').style.background = batch ? '#2f7a6b' : '#b08d4f';

    $('#batchNote').innerHTML = batch
      ? '<b>순위가 뒤집혔습니다.</b> 지원자 A와 C가 위로 올라온 것은 점수가 후해져서가 아니라, 네 사람이 <b>같은 요건표</b> 위에서 비교됐기 때문입니다. 기준선이 사라지지 않으니 나이·학교가 끼어들 자리도 사라집니다.'
      : '<b>기준이 매번 새로 만들어집니다.</b> 한 명씩 따로 채점하면 “보통이 몇 점인지”가 요청마다 달라지고, 그 흔들림을 이름·나이·학교 같은 익숙한 신호가 메웁니다. 그 결과 직무 근거가 가장 강한 A가 맨 아래로 내려갑니다.';
  }

  $('#btnOne').addEventListener('click', function () {
    this.classList.add('on'); $('#btnBatch').classList.remove('on'); render('solo');
  });
  $('#btnBatch').addEventListener('click', function () {
    this.classList.add('on'); $('#btnOne').classList.remove('on'); render('batch');
  });
  render('solo');
})();
