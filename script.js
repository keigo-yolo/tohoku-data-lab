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
  const mapPaths = [...document.querySelectorAll(".click-map path")];
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