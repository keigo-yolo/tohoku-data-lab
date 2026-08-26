(() => {
  const header = document.querySelector(".header");
  const menu = document.querySelector(".menu");
  const nav = document.querySelector(".nav");

  const updateHeader = () => header.classList.toggle("scrolled", scrollY > 15);
  updateHeader();
  addEventListener("scroll", updateHeader, {passive:true});

  menu?.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("open", !open);
  });
  document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    menu?.setAttribute("aria-expanded","false");
  }));

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add("visible"); io.unobserve(e.target); }
    });
  }, {threshold:.1, rootMargin:"0px 0px -25px"});
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  document.getElementById("year").textContent = new Date().getFullYear();

  // Background particle network
  const canvas = document.getElementById("network");
  const ctx = canvas.getContext("2d");
  let pts = [], raf = 0;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function resize(){
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth*dpr; canvas.height = innerHeight*dpr;
    canvas.style.width = innerWidth+"px"; canvas.style.height = innerHeight+"px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const n = Math.max(16, Math.min(42, Math.floor(innerWidth/36)));
    pts = Array.from({length:n},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.13,vy:(Math.random()-.5)*.13,r:Math.random()+.35}));
  }
  function draw(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    pts.forEach((a,i)=>{
      if(!reduced){a.x+=a.vx;a.y+=a.vy;if(a.x<-20)a.x=innerWidth+20;if(a.x>innerWidth+20)a.x=-20;if(a.y<-20)a.y=innerHeight+20;if(a.y>innerHeight+20)a.y=-20}
      ctx.beginPath();ctx.fillStyle="rgba(103,224,255,.42)";ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fill();
      for(let j=i+1;j<pts.length;j++){
        const b=pts[j], d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<145){ctx.beginPath();ctx.strokeStyle=`rgba(76,165,255,${.08*(1-d/145)})`;ctx.lineWidth=.7;ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
      }
    });
    if(!reduced) raf=requestAnimationFrame(draw);
  }
  resize(); draw();
  addEventListener("resize",()=>{cancelAnimationFrame(raf);resize();draw()});

  // DATA TOHOKU dashboard
  const data = window.TOHOKU_DATA;
  if(!data) return;

  let selectedPref = "miyagi";
  let selectedMetric = "population";

  const prefButtons = [...document.querySelectorAll(".pref-buttons button")];
  const mapPaths = [...document.querySelectorAll(".click-map [data-pref]")];
  const metricButtons = [...document.querySelectorAll(".metric-tabs button")];
  const prefTitle = document.getElementById("pref-title");
  const metricLabel = document.getElementById("metric-label");
  const metricValue = document.getElementById("metric-value");
  const metricDesc = document.getElementById("metric-desc");
  const compareTitle = document.getElementById("compare-title");
  const compareNote = document.getElementById("compare-note");
  const compareBars = document.getElementById("compare-bars");
  const sourceName = document.getElementById("source-name");
  const sourceLink = document.getElementById("source-link");

  const fmt = (value, metric, withUnit=true) => {
    const m = data.meta[metric], d = m.decimals ?? 0;
    const num = Number(value).toLocaleString("ja-JP",{minimumFractionDigits:d,maximumFractionDigits:d});
    return withUnit ? `${num} ${m.unit}` : num;
  };

  const widthFor = (value, metric, values) => {
    if(metric === "populationChange"){
      const min=Math.min(...values), max=Math.max(...values), span=Math.max(max-min,.0001);
      return 18 + ((value-min)/span)*82;
    }
    const max=Math.max(...values);
    return max ? Math.max(3,(value/max)*100) : 0;
  };

  function render(){
    const p = data.prefectures.find(x=>x.id===selectedPref);
    const m = data.meta[selectedMetric];
    const values = data.prefectures.map(x=>Number(x[selectedMetric]));
    const value = Number(p[selectedMetric]);

    prefTitle.textContent = `${p.name} / ${p.en}`;
    metricLabel.textContent = `${m.shortLabel} / ${m.period}`;
    metricValue.innerHTML = `${fmt(value,selectedMetric,false)} <em>${m.unit}</em>`;
    metricDesc.textContent = m.description;
    compareTitle.textContent = `${m.label} / ${m.period}`;
    compareNote.textContent = m.note;
    sourceName.textContent = m.source;
    sourceLink.href = m.url;

    compareBars.innerHTML = data.prefectures.map(x=>{
      const v = Number(x[selectedMetric]);
      const w = widthFor(v,selectedMetric,values);
      return `<div class="compare-row${x.id===selectedPref?" selected":""}">
        <span class="label">${x.name.replace("県","")}</span>
        <div class="track"><div class="fill" style="--w:${w.toFixed(2)}%"></div></div>
        <span class="value">${fmt(v,selectedMetric)}</span>
      </div>`;
    }).join("");

    prefButtons.forEach(b=>b.classList.toggle("active",b.dataset.pref===selectedPref));
    mapPaths.forEach(p=>p.classList.toggle("active",p.dataset.pref===selectedPref));
    metricButtons.forEach(b=>{
      const active=b.dataset.metric===selectedMetric;
      b.classList.toggle("active",active);
      b.setAttribute("aria-selected",String(active));
    });
  }

  const choosePref = id => {
    if(data.prefectures.some(x=>x.id===id)){ selectedPref=id; render(); }
  };

  prefButtons.forEach(b=>b.addEventListener("click",()=>choosePref(b.dataset.pref)));
  mapPaths.forEach(p=>{
    p.setAttribute("tabindex","0");p.setAttribute("role","button");
    p.addEventListener("click",()=>choosePref(p.dataset.pref));
    p.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();choosePref(p.dataset.pref)}});
  });
  metricButtons.forEach(b=>b.addEventListener("click",()=>{selectedMetric=b.dataset.metric;render()}));

  render();
})();

// =========================================================
// MVV display guard / runtime styling
// Ensures Mission, Vision and Values are visible even when
// the dedicated CSS has not yet been picked up by the page.
// =========================================================
(() => {
  const styleId = "tohoku-mvv-runtime-styles";

  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .philosophy-section{
        position:relative;
        padding:125px 0;
        background:
          radial-gradient(circle at 82% 20%,rgba(76,72,255,.10),transparent 27rem),
          radial-gradient(circle at 8% 75%,rgba(70,230,255,.07),transparent 26rem);
      }
      .philosophy-section .philosophy-intro{
        padding:38px 0 68px;
        border-bottom:1px solid var(--line);
      }
      .philosophy-section .philosophy-code{
        margin:0 0 22px;
        color:#5cecff;
        font:700 8px monospace;
        letter-spacing:.16em;
      }
      .philosophy-section .philosophy-intro h2{
        max-width:1050px;
        margin:0;
        font-size:clamp(40px,5vw,68px);
        line-height:1.12;
        letter-spacing:-.045em;
        font-weight:600;
      }
      .philosophy-section .philosophy-intro h2 span,
      .philosophy-section .mv-content h3 span,
      .philosophy-section .values-header h3 span,
      .philosophy-section .belief-content h3 span{
        color:transparent;
        background:linear-gradient(100deg,#effcff 0%,#64efff 40%,#388fff 76%,#8067ff 100%);
        background-clip:text;
        -webkit-background-clip:text;
      }
      .philosophy-section .story-grid{
        max-width:1050px;
        margin-top:38px;
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:55px;
      }
      .philosophy-section .story-grid p{
        margin:0;
        color:#8ca4b7;
        font-size:12px;
        line-height:2;
      }
      .philosophy-section .mv-grid{
        display:grid;
        grid-template-columns:1fr 1fr;
        margin-top:68px;
        border-left:1px solid var(--line);
      }
      .philosophy-section .mv-card{
        position:relative;
        min-height:520px;
        padding:44px;
        border-top:1px solid var(--line);
        border-right:1px solid var(--line);
        border-bottom:1px solid var(--line);
        background:linear-gradient(145deg,rgba(13,35,59,.68),rgba(5,15,27,.40));
        overflow:hidden;
      }
      .philosophy-section .vision-card{
        background:
          radial-gradient(circle at 85% 12%,rgba(93,76,255,.15),transparent 18rem),
          linear-gradient(145deg,rgba(12,39,64,.73),rgba(5,15,27,.44));
      }
      .philosophy-section .mv-number{
        position:absolute;
        top:24px;
        right:32px;
        color:transparent;
        -webkit-text-stroke:1px rgba(96,239,255,.27);
        font:600 76px/1 monospace;
      }
      .philosophy-section .mv-content{
        position:relative;
        z-index:2;
      }
      .philosophy-section .mv-content>small{
        color:#5ce8fa;
        font:700 8px monospace;
        letter-spacing:.16em;
      }
      .philosophy-section .mv-content h3{
        margin:68px 0 26px;
        font-size:clamp(28px,3vw,39px);
        line-height:1.45;
        letter-spacing:-.025em;
      }
      .philosophy-section .mv-content p{
        max-width:530px;
        margin:13px 0 0;
        color:#8ba3b7;
        font-size:12px;
        line-height:1.95;
      }
      .philosophy-section .vision-statement{
        display:block;
        max-width:510px;
        margin:0 0 25px;
        padding:16px 18px;
        border-left:2px solid var(--cyan);
        background:rgba(19,61,94,.34);
        color:#d9f9ff;
        font-size:14px;
        line-height:1.8;
      }
      .philosophy-section .values-header{
        display:grid;
        grid-template-columns:1fr .72fr;
        gap:60px;
        align-items:end;
        margin:110px 0 40px;
      }
      .philosophy-section .values-header .eyebrow{margin-bottom:17px}
      .philosophy-section .values-header h3{
        margin:0;
        font-size:clamp(34px,4.2vw,56px);
        line-height:1.15;
        letter-spacing:-.04em;
      }
      .philosophy-section .values-header>p{
        margin:0 0 6px;
        color:#849caf;
        font-size:12px;
      }
      .philosophy-section .values-grid{
        display:grid;
        grid-template-columns:repeat(5,1fr);
        border-left:1px solid var(--line);
        border-top:1px solid var(--line);
      }
      .philosophy-section .value-card{
        position:relative;
        min-height:390px;
        padding:27px 24px;
        border-right:1px solid var(--line);
        border-bottom:1px solid var(--line);
        background:rgba(7,20,35,.42);
        transition:.3s ease;
      }
      .philosophy-section .value-card:hover{
        transform:translateY(-4px);
        background:rgba(11,35,57,.65);
      }
      .philosophy-section .value-no{
        color:transparent;
        -webkit-text-stroke:1px rgba(96,239,255,.35);
        font:600 34px/1 monospace;
      }
      .philosophy-section .value-card>small{
        display:block;
        margin-top:48px;
        color:#62e7f8;
        font:700 8px monospace;
        letter-spacing:.14em;
      }
      .philosophy-section .value-card h4{
        margin:10px 0 16px;
        font-size:18px;
        line-height:1.55;
      }
      .philosophy-section .value-card p{
        margin:0;
        color:#829aaf;
        font-size:11px;
      }
      .philosophy-section .value-keyword{
        position:absolute;
        left:24px;
        right:24px;
        bottom:25px;
        padding-top:13px;
        border-top:1px solid var(--line);
        color:#55738a;
        font:700 7px monospace;
        letter-spacing:.12em;
      }
      .philosophy-section .belief-panel{
        position:relative;
        margin-top:80px;
        padding:50px;
        display:grid;
        grid-template-columns:.48fr 1.15fr .57fr;
        gap:50px;
        border:1px solid rgba(95,231,255,.24);
        background:
          radial-gradient(circle at 90% 10%,rgba(82,72,255,.15),transparent 23rem),
          linear-gradient(125deg,rgba(15,56,88,.52),rgba(5,16,29,.76));
      }
      .philosophy-section .belief-label{
        display:flex;
        flex-direction:column;
        justify-content:space-between;
      }
      .philosophy-section .belief-label small{
        color:#62ebfb;
        font:700 8px monospace;
        letter-spacing:.18em;
      }
      .philosophy-section .belief-label span{
        color:#536d82;
        font:700 7px monospace;
        letter-spacing:.12em;
        writing-mode:vertical-rl;
      }
      .philosophy-section .belief-content h3{
        margin:0 0 25px;
        font-size:clamp(34px,4vw,52px);
        line-height:1.18;
        letter-spacing:-.04em;
      }
      .philosophy-section .belief-content p{
        color:#8fa6b9;
        font-size:12px;
      }
      .philosophy-section .belief-outcomes{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        margin:23px 0;
      }
      .philosophy-section .belief-outcomes span{
        padding:8px 11px;
        border:1px solid rgba(96,239,255,.18);
        background:rgba(12,40,63,.48);
        color:#b8d4df;
        font-size:9px;
      }
      .philosophy-section .belief-message{
        display:flex;
        flex-direction:column;
        justify-content:flex-end;
        border-left:1px solid var(--line);
        padding-left:28px;
      }
      .philosophy-section .belief-message small{
        margin-bottom:11px;
        color:#5ce5f6;
        font:700 7px monospace;
        letter-spacing:.15em;
      }
      .philosophy-section .belief-message strong{
        font-size:20px;
        line-height:1.65;
      }
      @media(max-width:1050px){
        .philosophy-section .values-grid{grid-template-columns:repeat(2,1fr)}
        .philosophy-section .value-card{min-height:340px}
        .philosophy-section .belief-panel{grid-template-columns:1fr 2fr}
        .philosophy-section .belief-message{
          grid-column:1/-1;
          border-left:0;
          border-top:1px solid var(--line);
          padding:24px 0 0;
        }
      }
      @media(max-width:820px){
        .philosophy-section .story-grid{grid-template-columns:1fr;gap:18px}
        .philosophy-section .mv-grid{grid-template-columns:1fr}
        .philosophy-section .mv-card{min-height:auto;padding:38px 28px 46px}
        .philosophy-section .values-header{grid-template-columns:1fr;gap:18px}
        .philosophy-section .belief-panel{grid-template-columns:1fr;padding:36px 26px;gap:28px}
        .philosophy-section .belief-label span{display:none}
        .philosophy-section .belief-message{grid-column:auto}
      }
      @media(max-width:560px){
        .philosophy-section{padding:90px 0}
        .philosophy-section .philosophy-intro{padding:30px 0 48px}
        .philosophy-section .mv-card{padding:30px 22px 40px}
        .philosophy-section .mv-number{font-size:58px}
        .philosophy-section .mv-content h3{margin-top:62px;font-size:26px}
        .philosophy-section .values-header{margin-top:82px}
        .philosophy-section .values-grid{grid-template-columns:1fr}
        .philosophy-section .value-card{min-height:305px}
        .philosophy-section .belief-panel{margin-top:60px;padding:30px 20px}
        .philosophy-section .belief-outcomes{display:grid;grid-template-columns:1fr 1fr}
      }
    `;
    document.head.appendChild(style);
  }

  let section = document.getElementById("philosophy");

  // Fallback for a stale/cached HTML copy that does not yet contain the MVV section.
  if (!section) {
    section = document.createElement("section");
    section.className = "section philosophy-section";
    section.id = "philosophy";
    section.innerHTML = `
      <div class="wrap">
        <div class="section-kicker reveal visible">
          <p class="eyebrow">04 / PHILOSOPHY</p>
          <p>私たちが、何のために存在し、どこを目指し、どのように行動するのか。</p>
        </div>

        <div class="philosophy-intro reveal visible">
          <p class="philosophy-code">OUR STORY / TOHOKU DATA LAB</p>
          <h2>地域にいることが、<br><span>可能性の制約にならない未来へ。</span></h2>
          <div class="story-grid">
            <p>データやAI、デジタル技術を、一部の専門家だけが使うものではなく、地域の企業や自治体が日常的に使えるものへ変えていきます。</p>
            <p>場所や企業規模に左右されず、誰もがデータとテクノロジーを活用し、自ら未来を選択できる地域を目指します。</p>
          </div>
        </div>

        <div class="mv-grid">
          <article class="mv-card mission-card reveal visible">
            <div class="mv-number">M</div>
            <div class="mv-content">
              <small>MISSION / 私たちの使命</small>
              <h3>データとテクノロジーで、<br><span>地域の可能性をひらく。</span></h3>
              <p>地域の企業や自治体が、自らのデータを活用し、課題を発見し、より良い意思決定ができる環境をつくります。</p>
              <p>テクノロジーを目的にするのではなく、地域が持つ可能性を引き出すための手段として活用します。</p>
            </div>
          </article>

          <article class="mv-card vision-card reveal visible">
            <div class="mv-number">V</div>
            <div class="mv-content">
              <small>VISION / 私たちが目指す未来</small>
              <h3>東北を、<br><span>データ活用の先進地域へ。</span></h3>
              <strong class="vision-statement">地域にいることが、ハンデにならない社会をつくる。</strong>
              <p>企業規模や所在地によって、データ・AI・専門知識へのアクセスに大きな差が生まれない社会を目指します。</p>
            </div>
          </article>
        </div>

        <div class="values-header reveal visible">
          <div>
            <p class="eyebrow">VALUES / HOW WE WORK</p>
            <h3>私たちが大切にする、<br><span>5つの行動原則。</span></h3>
          </div>
          <p>顧客と向き合い、事実から考え、複雑な技術を分かりやすく届けます。</p>
        </div>

        <div class="values-grid">
          <article class="value-card reveal visible"><span class="value-no">01</span><small>CUSTOMER FIRST</small><h4>顧客の課題から始める。</h4><p>技術ありきではなく、まず顧客が抱える課題を理解することから始めます。</p><div class="value-keyword">PROBLEM → SOLUTION</div></article>
          <article class="value-card reveal visible"><span class="value-no">02</span><small>FACT DRIVEN</small><h4>事実とデータで判断する。</h4><p>感覚だけに頼らず、データという根拠を加え、意思決定につなげます。</p><div class="value-keyword">DATA → DECISION</div></article>
          <article class="value-card reveal visible"><span class="value-no">03</span><small>SIMPLE</small><h4>複雑な技術をシンプルにする。</h4><p>専門性を、誰にでも理解でき、使える形へ変換します。</p><div class="value-keyword">COMPLEX → SIMPLE</div></article>
          <article class="value-card reveal visible"><span class="value-no">04</span><small>CHALLENGE</small><h4>小さく試し、学び続ける。</h4><p>まず小さく試し、結果を見て改善するサイクルを繰り返します。</p><div class="value-keyword">TRY → LEARN → IMPROVE</div></article>
          <article class="value-card reveal visible"><span class="value-no">05</span><small>LOCAL COMMITMENT</small><h4>東北に根ざし、地域とともに成長する。</h4><p>短期的な成果だけでなく、データ活用が地域に根づくところまで伴走します。</p><div class="value-keyword">TOHOKU → TOGETHER</div></article>
        </div>
      </div>
    `;

    const dataSection = document.getElementById("data-tohoku");
    if (dataSection?.parentNode) {
      dataSection.parentNode.insertBefore(section, dataSection);
    } else {
      document.querySelector("main")?.appendChild(section);
    }
  }

  // Ensure the navigation entry exists even if an older cached HTML is being used.
  if (!document.querySelector('.nav a[href="#philosophy"]')) {
    const nav = document.querySelector(".nav");
    const dataLink = document.querySelector('.nav a[href="#data-tohoku"]');
    const link = document.createElement("a");
    link.href = "#philosophy";
    link.textContent = "PHILOSOPHY";
    if (nav) {
      if (dataLink) nav.insertBefore(link, dataLink);
      else nav.appendChild(link);
    }
  }

  // The section must never remain hidden because of reveal animation state.
  section.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
})();