// 검색용 정적 페이지 생성: /<검사이름>/, /테스트모음/, /<가이드제목>/, /부모가이드/, /자주묻는질문/, s.css, sitemap.xml, vercel.json(옛 영문 주소 301)
// 실행: node _build/extract.js && node _build/gen.js  (index.html 데이터가 바뀌면 둘 다 다시)
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..'),D=require('./data.json'),SITE='https://mwojalhae.kr',BRAND='우리애 뭐잘해?';
const P=new Function(fs.readFileSync(path.join(__dirname,'promo.js'),'utf8')+';return {promoHtml,familyHtml}')(),PCSS=fs.readFileSync(path.join(__dirname,'promo.css'),'utf8');
const GA=fs.readFileSync(path.join(__dirname,'ga.html'),'utf8').trim();
const TODAY=new Date(Date.now()+9*3600e3).toISOString().slice(0,10);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const strip=s=>String(s).replace(/<[^>]+>/g,'');
const cut=(s,n)=>{s=strip(s);return s.length<=n?s:s.slice(0,n-1).replace(/[\s,·]+\S*$/,'')+'…'};

// 검사별 검색어·추천 대상 (페이지마다 다른 문장 → 중복 콘텐츠 방지)
const KW={
 talent:['아이 재능검사','블록·그림·숫자 중 뭘 좋아하는지는 알지만 "잘하는 것"이 궁금한 부모님','글을 다 몰라도 게임처럼 터치로 끝까지 할 수 있는 검사를 찾는 분'],
 temper:['아이 기질검사','같은 말을 해도 형제마다 반응이 너무 달라 고민인 부모님','낯가림·떼쓰기가 성격 탓인지 기질 탓인지 알고 싶은 분'],
 learn:['아이 학습유형 검사','같은 내용을 가르쳐도 유독 잘 안 들어가는 방식이 있는 아이','보고·듣고·읽고·움직이는 방식 중 어떤 게 맞는지 궁금한 분'],
 career:['아이 진로적성검사','장래희망이 자주 바뀌어 흥미의 방향이 궁금한 부모님','초등 시기 체험 활동을 어디에 맞출지 정하고 싶은 분'],
 social:['아이 사회성 검사','친구 관계에서 자주 속상해하거나 혼자 노는 시간이 많은 아이','새 학기 적응을 앞두고 아이 관계 성향을 알고 싶은 분'],
 attention:['아이 집중력 검사','숙제 시작이 늦고 끝맺음이 어려워 고민인 부모님','산만함이 걱정되지만 어디서부터 볼지 막막한 분'],
 eq:['아이 정서지능 검사','감정이 올라오면 말보다 울음·짜증이 먼저 나오는 아이','아이가 자기 마음을 말로 표현하도록 돕고 싶은 분'],
 esteem:['아이 자존감 검사','"난 못해"라는 말을 자주 하는 아이가 걱정되는 부모님','칭찬을 많이 하는데도 자신감이 낮아 보이는 아이'],
 mindset:['성장 마인드셋 검사','틀리는 걸 싫어해서 어려운 문제를 피하는 아이','공부 동기가 어디서 오는지 알고 싶은 분'],
 style:['양육태도 검사','내 양육 방식이 아이에게 어떻게 전달되는지 점검하고 싶은 부모님','따뜻함과 규칙 사이 균형이 잘 맞는지 궁금한 분'],
 emotion:['감정코칭 검사','아이가 울거나 화낼 때 어떻게 반응해야 할지 늘 고민인 부모님','감정 대화를 늘리고 싶은데 방법을 모르는 분'],
 stress:['육아 스트레스 검사','요즘 육아가 유난히 버겁게 느껴지는 부모님','내 지친 정도를 숫자로 확인하고 쉬어갈 지점을 찾고 싶은 분'],
 media:['아이 미디어 습관 검사','스마트폰·태블릿 사용 시간을 두고 매일 실랑이하는 가정','우리 집 미디어 규칙이 잘 지켜지는지 점검하고 싶은 분'],
 efficacy:['부모 효능감 검사','"내가 잘하고 있나" 하는 마음이 자주 드는 부모님','첫째 육아나 새로운 발달 시기를 앞두고 자신감이 흔들리는 분'],
 relation:['부모 자녀 관계 검사','아이와 대화가 줄고 부딪히는 일이 늘었다고 느끼는 부모님','관계의 친밀함과 갈등을 함께 점검하고 싶은 분'],
 coparent:['공동양육 검사','배우자와 육아 방식이 달라 자주 부딪히는 부부','함께 키우는 팀워크를 점검하고 대화 거리를 찾고 싶은 분'],
 discipline:['훈육 방식 검사','훈육하고 나서 "이게 맞나" 후회가 드는 부모님','단호함과 따뜻함 사이 내 훈육 스타일을 알고 싶은 분'],
};
const OLDG=['talent-find','creativity-play','spatial-ability','math-talent','observation','focus-play','age5-development','age6-development','age7-development','elementary-talent'];
// 한글 주소: 검색어를 띄어쓰기 없이 그대로 경로로
const GSLUG=['우리아이재능찾는법','아이창의력키우는놀이','공간지각력좋은아이특징','수학잘하는아이특징','관찰력좋은아이특징','집중력키우는놀이','5세아이발달','6세아이발달','7세아이발달','초등학생재능찾기'];
const HUB_T='테스트모음',HUB_G='부모가이드',HUB_F='자주묻는질문';
// 가이드 → 같이 보면 좋은 검사
const GTEST={'talent-find':'talent','creativity-play':'talent','spatial-ability':'talent','math-talent':'talent','observation':'talent','focus-play':'attention','age5-development':'temper','age6-development':'social','age7-development':'learn','elementary-talent':'career'};

const TS=Object.fromEntries(Object.entries(KW).map(([k,v])=>[k,v[0].replace(/\s+/g,'')]));
const ALL=[{...D.TALENT,n:24,dims:D.AREAS.map(a=>({n:a.n,hi:a.d})),types:[],sample:[],ref:'아이의 놀이 행동을 8가지 재능 영역(관찰력·공간지각·수리·언어·기억·집중·창의·문제해결)으로 나눠 미니게임 24개로 살펴봐요.',base:'놀이 기반 강점 탐색'},...D.QUIZ];
const byId=Object.fromEntries(ALL.map(x=>[x.id,x]));
const cta=id=>id==='talent'?'/#intake':`/#q-${id}`;
const timeTxt=x=>x.id==='talent'?'약 10~15분':`약 ${x.min}분`;

const css=D.CSS.replace(/\/\*PROMOCSS\*\/[\s\S]*?\/\*\/PROMOCSS\*\//,'')+PCSS+`
/* ---- 정적 안내 페이지 ---- */
a.btn{text-decoration:none}
.top nav a{background:none;border:0;padding:8px 12px;border-radius:12px;font-weight:600;font-size:15px;color:var(--muted);min-height:44px;display:inline-flex;align-items:center;text-decoration:none}
.top nav a:hover{color:var(--ink)}
.logo{text-decoration:none}
.crumb{font-size:13.5px;color:var(--muted);margin:18px 0 0;display:flex;gap:6px;flex-wrap:wrap}
.crumb a{color:var(--muted)}
.sp{padding-bottom:40px}
.sp-hero{display:grid;grid-template-columns:auto 1fr;gap:22px;align-items:center;margin-top:14px;padding:26px;border:2.5px solid var(--edge);border-radius:28px;box-shadow:var(--pop);background:var(--c,var(--surface))}
.sp-hero .gi svg{width:112px;height:112px}
.sp-hero h1{font-family:var(--f-head);font-weight:400;font-size:clamp(30px,5.4vw,46px);line-height:1.15;margin:4px 0 0;word-break:keep-all}
.sp-hero .sub{font-size:17px;margin-top:8px}
.sp-hero.par .eyebrow{color:var(--p-deep)}.sp-hero.par .chips span{border-color:color-mix(in srgb,var(--p) 35%,#fff)}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.chips span{background:var(--surface);border:1.5px solid var(--line);border-radius:99px;padding:6px 12px;font-size:14px;font-weight:700}
.sp-cta{margin-top:18px;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center}
.sp-cta .note{font-size:13.5px;color:var(--muted)}
.sp h2{font-family:var(--f-kid);font-weight:400;font-size:clamp(23px,3.6vw,29px);margin:44px 0 12px;word-break:keep-all}
.sp p,.sp li{line-height:1.75;word-break:keep-all}
.dimlist{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;padding:0;list-style:none;margin:0}
.dimlist li{background:var(--surface);border:1.5px solid var(--line);border-radius:18px;padding:14px 16px}
.dimlist b{display:block;font-size:17px;margin-bottom:4px}
.dimlist span{font-size:15px;color:var(--muted)}
.rec{padding-left:20px}.rec li{margin:6px 0}
.qs{counter-reset:q;padding:0;list-style:none}
.qs li{counter-increment:q;background:var(--soft);border-radius:14px;padding:12px 16px;margin:8px 0}
.qs li::before{content:"Q" counter(q) "  ";font-weight:800;color:var(--brand)}
.flow{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:0;list-style:none}
.flow li{border:2px dashed var(--line);border-radius:18px;padding:16px;text-align:center}
.flow b{display:block;font-family:var(--f-kid);font-weight:400;font-size:19px;color:var(--brand)}
.rel{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
.rel a{display:flex;gap:10px;align-items:center;padding:12px;border:1.5px solid var(--line);border-radius:16px;background:var(--surface);color:var(--ink);text-decoration:none;font-weight:700;min-height:56px;transition:transform .15s,box-shadow .15s}
.rel a svg{width:40px;height:40px;flex:none}
.rel a small{display:block;font-weight:400;color:var(--muted);font-size:13px}
.sp .faq details{margin:8px 0}
.flinks a{color:var(--muted);text-decoration:none;padding:6px 8px;display:inline-block;min-height:44px;line-height:32px}
.sitemap-links{display:flex;flex-wrap:wrap;gap:0 4px;font-size:13px;margin-top:8px;width:100%}
.sitemap-links a{color:var(--muted);text-decoration:none;padding:6px;min-height:44px;display:inline-flex;align-items:center}
.pcat{margin-top:8px}
@media (hover:hover){.rel a:hover{transform:translateY(-2px);box-shadow:3px 3px 0 var(--edge)}}
@media (max-width:640px){.sp-hero{grid-template-columns:1fr;padding:20px;text-align:left}.sp-hero .gi svg{width:84px;height:84px}.dimlist,.flow{grid-template-columns:1fr}.sp-cta .btn{width:100%}}
body.sp-page .mcta{display:none}
@media (max-width:720px){body.sp-page .mcta{display:block;transform:translateY(110%);transition:transform .3s}body.sp-page.mshow .mcta{transform:none}}
`;
fs.writeFileSync(path.join(ROOT,'s.css'),css);

const footLinks=()=>`<nav class="sitemap-links" aria-label="검사·가이드 전체">${ALL.map(x=>`<a href="/${TS[x.id]}/">${KW[x.id][0]}</a>`).join('')}${D.GUIDES.map((g,i)=>`<a href="/${GSLUG[i]}/">${g.t}</a>`).join('')}<a href="/${HUB_F}/">자주 묻는 질문</a></nav>`;

function page({url,title,desc,body,ld,ctaHref,ctaTxt}){
  const full=SITE+url;
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${full}">
<meta name="theme-color" content="#FFF3F6">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="article"><meta property="og:site_name" content="${BRAND}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${full}"><meta property="og:image" content="${SITE}/og.png">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${SITE}/og.png">
<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':ld})}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Gowun+Dodum&family=Jua&display=swap" media="print" onload="this.media='all'">
<link rel="stylesheet" href="/s.css?v=${TODAY}">
${GA}
</head>
<body class="sp-page">
<header class="top"><div class="wrap">
  <a class="logo" href="/" aria-label="${BRAND} 홈"><span class="brand-name">${BRAND}</span></a>
  <nav><a href="/${HUB_T}/">테스트 모음</a><a href="/${HUB_G}/" class="hide-m">부모 가이드</a><a href="/${HUB_F}/" class="hide-m">자주 묻는 질문</a></nav>
</div></header>
<main class="wrap sp" style="max-width:860px">
${body}
</main>
<div class="mcta"><a class="btn btn-sun btn-block" href="${ctaHref}">${ctaTxt}</a></div>
<footer><div class="wrap">
  <nav class="flinks"><a href="/${HUB_T}/">테스트 모음</a><a href="/${HUB_G}/">부모 가이드</a><a href="/${HUB_F}/">자주 묻는 질문</a><a href="/#dash">우리 아이 기록</a></nav>
  <div><b class="brand-name" style="color:var(--ink)">${BRAND}</b> · 놀이 기반 강점 탐색 서비스<br>이 검사는 아이의 성향과 강점을 살펴보는 놀이형 도구이며, 의학적·심리학적 진단이나 지능 검사가 아니에요.</div>
  ${P.familyHtml()}
  ${footLinks()}
</div></footer>
<script>
(function(){var b=document.body,h=document.querySelector('.sp-cta,.final');if(!('IntersectionObserver' in window)||!h){b.classList.add('mshow');return}
new IntersectionObserver(function(e){b.classList.toggle('mshow',!e[0].isIntersecting&&e[0].boundingClientRect.top<0)}).observe(h);
var t=document.querySelector('.top');addEventListener('scroll',function(){t.classList.toggle('scrolled',scrollY>8)},{passive:true})})();
</script>
</body>
</html>
`;
}
const crumbLd=items=>({'@type':'BreadcrumbList',itemListElement:items.map(([n,u],i)=>({'@type':'ListItem',position:i+1,name:n,item:SITE+u}))});
const crumbHtml=items=>`<nav class="crumb" aria-label="현재 위치">${items.map(([n,u],i)=>i<items.length-1?`<a href="${u}">${n}</a> ›`:`<span>${n}</span>`).join(' ')}</nav>`;
const faqLd=list=>({'@type':'FAQPage',mainEntity:list.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:strip(a)}}))});
const faqHtml=list=>`<div class="faq">${list.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>`;
const out=(rel,html)=>{const f=path.join(ROOT,rel,'index.html');fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,html)};
const urls=['/'];

/* ---- 검사별 페이지 ---- */
ALL.forEach(x=>{
  const [kw,r1,r2]=KW[x.id],kid=x.cat==='kid',url=`/${TS[x.id]}/`,catN=kid?'아이 알아보기':'부모 알아보기';
  const title=`${kw} 무료 | ${x.t.trim()} - ${BRAND}`;
  const desc=cut(`${kw} 무료. ${x.s}. ${x.id==='talent'?'미니게임 24개':x.n+'문항'}·${timeTxt(x)}, 영역별 점수와 실천 플랜까지 바로 확인해요.`,80);
  const faqs=[
    ['정말 무료인가요?','네. 회원가입 없이 바로 검사하고 결과 리포트까지 무료로 볼 수 있어요.'],
    [kid?'몇 살 아이가 할 수 있나요?':'누가 하면 되나요?',kid?`만 5~12세 아이를 기준으로 만들었어요.${x.young||x.id==='talent'?' 만 5~7세는 문장이나 게임 속도가 나이에 맞게 바뀌어요.':''}`:'아이를 키우는 부모님 본인이 답해요. 부모 두 분이 각자 해보고 결과를 비교해 보는 것도 좋아요.'],
    ['결과는 어디에 저장되나요?','검사한 기기의 브라우저에만 저장돼요. 이름 대신 닉네임만 쓰고, 서버로 보내지 않아요.'],
    ['전문 심리검사인가요?',`${x.base} 등 발달·양육 이론을 바탕으로 만든 자가 체크예요. 의학적 진단이 아니며, 정확한 평가가 필요하면 전문가와 상의해 주세요.`],
  ];
  const rel=ALL.filter(y=>y.cat===x.cat&&y.id!==x.id).slice(0,6);
  const body=`${crumbHtml([['홈','/'],['테스트 모음','/'+HUB_T+'/'],[kw,url]])}
<section class="sp-hero${kid?"":" par"}" style="--c:${kid?x.tint:"var(--p-soft)"}">
  <span class="gi">${x.svg}</span>
  <div><p class="eyebrow">${catN} · ${x.who}</p>
  <h1>${kw}<br><small style="font-size:.55em">${esc(x.t.trim())}</small></h1>
  <p class="sub">${x.s}</p>
  <div class="chips"><span>${x.id==='talent'?'미니게임 24개':x.n+'문항'}</span><span>${timeTxt(x)}</span><span>${kid?'만 5~12세':'부모 본인'}</span><span>무료 · 가입 없음</span></div>
  <div class="sp-cta"><a class="btn btn-sun btn-big" href="${cta(x.id)}">무료로 검사 시작하기</a><span class="note">결과는 바로, 이 기기에만 저장돼요</span></div></div>
</section>
<h2>이런 분께 추천해요</h2>
<ul class="rec"><li>${r1}</li><li>${r2}</li></ul>
<h2>이 검사로 알 수 있는 ${x.dims.length}가지</h2>
<ul class="dimlist">${x.dims.map(d=>`<li><b>${d.n}</b><span>${cut(d.hi,70)}</span></li>`).join('')}</ul>
${x.types.length?`<h2>결과는 이런 유형으로 나와요</h2><div class="tags">${x.types.map(t=>`<span class="tag">${t.n}</span>`).join('')}</div>`:''}
${x.sample.length?`<h2>이런 문항으로 물어봐요</h2><ol class="qs">${x.sample.map(q=>`<li>${q}</li>`).join('')}</ol>`:''}
<h2>진행 방법</h2>
<ol class="flow"><li><b>1. ${kid?'아이 고르기':'바로 시작'}</b>${kid?'닉네임과 나이만 적어요':'가입 없이 바로 답해요'}</li><li><b>2. ${x.id==='talent'?'게임하기':'문항 답하기'}</b>${timeTxt(x)}이면 끝나요</li><li><b>3. 리포트 확인</b>영역별 점수·해석·이번 주 실천 플랜</li></ol>
<h2>검사 근거</h2>
<p>${x.ref}</p>${x.note?`<p>${x.note}</p>`:''}
${P.promoHtml(x.id)}
<div class="final" style="margin-block:56px 8px;padding:44px 20px"><h2 style="margin:0">${kid?'우리 아이 결과, 지금 확인해 보세요':'내 결과, 지금 확인해 보세요'}</h2><a class="btn btn-sun btn-big" href="${cta(x.id)}">${kw} 시작하기</a></div>
<h2>자주 묻는 질문</h2>${faqHtml(faqs)}
<h2>${kid?'아이 검사 더 보기':'부모 검사 더 보기'}</h2>
<div class="rel">${rel.map(y=>`<a href="/${TS[y.id]}/">${y.svg}<span>${KW[y.id][0]}<small>${y.t.trim()}</small></span></a>`).join('')}</div>`;
  out(TS[x.id],page({url,title,desc,body,ctaHref:cta(x.id),ctaTxt:'무료로 검사 시작하기',
    ld:[{'@type':'WebPage',name:title,url:SITE+url,description:desc,inLanguage:'ko',isPartOf:{'@type':'WebSite',name:BRAND,url:SITE+'/'}},crumbLd([['홈','/'],['테스트 모음','/'+HUB_T+'/'],[kw,url]]),faqLd(faqs)]}));
  urls.push(url);
});

/* ---- 테스트 모음 ---- */
{const url='/'+HUB_T+'/',title=`아이 적성검사·부모 양육검사 17종 무료 모음 - ${BRAND}`,desc='아이 재능·기질·학습유형·사회성부터 부모 양육태도·육아 스트레스까지 17종 무료 검사 모음.';
 const sec=(cat,h)=>`<h2>${h}</h2><div class="rel">${ALL.filter(x=>x.cat===cat).map(y=>`<a href="/${TS[y.id]}/">${y.svg}<span>${KW[y.id][0]}<small>${y.s}</small></span></a>`).join('')}</div>`;
 const body=`${crumbHtml([['홈','/'],['테스트 모음',url]])}
<section class="sp-hero"><span class="gi">${D.TALENT.svg}</span><div><p class="eyebrow">무료 · 가입 없음</p><h1>아이 적성검사 모음</h1><p class="sub">아이 검사 9종, 부모 검사 8종. 여러 개를 하면 종합 리포트와 부모-아이 궁합 리포트가 열려요.</p>
<div class="sp-cta"><a class="btn btn-sun btn-big" href="/#intake">재능 검사부터 시작하기</a><span class="note">가장 많이 시작하는 검사예요</span></div></div></section>
${sec('kid','아이 알아보기 · 9종')}${sec('parent','부모 알아보기 · 8종')}`;
 out(HUB_T,page({url,title,desc,body,ctaHref:'/#intake',ctaTxt:'무료로 재능 찾기 시작하기',ld:[{'@type':'CollectionPage',name:title,url:SITE+url,description:desc},crumbLd([['홈','/'],['테스트 모음',url]]),
  {'@type':'ItemList',itemListElement:ALL.map((x,i)=>({'@type':'ListItem',position:i+1,url:`${SITE}/${TS[x.id]}/`,name:KW[x.id][0]}))}]}));
 urls.splice(1,0,url);}

/* ---- 부모 가이드 ---- */
D.GUIDES.forEach((g,i)=>{
  const slug=GSLUG[i],url=`/${slug}/`,t=byId[GTEST[OLDG[i]]],title=`${g.t} - ${g.s} | ${BRAND}`;
  const desc=cut(`${g.t}. ${g.b[0][1]||g.s}`,80);
  const body=`${crumbHtml([['홈','/'],['부모 가이드','/'+HUB_G+'/'],[g.t,url]])}
<article class="post">
<p class="eyebrow" style="margin-top:18px">부모 가이드</p><h1 style="margin-top:6px">${g.t}</h1><p class="muted">${g.s}</p>
${g.b.map(([h,p])=>`<h2>${h}</h2>${p?`<p>${p}</p>`:`<ul>${(g.list||[]).map(x=>`<li>${x}</li>`).join('')}</ul>`}`).join('')}
</article>
<div class="post-cta sp-cta" style="margin-top:36px"><div style="width:80px">${g.svg}</div><p style="font-weight:800;font-size:18px;margin:0">글로 읽는 것보다 직접 해보면 더 잘 보여요. ${KW[t.id][0]}로 확인해 보세요.</p><a class="btn btn-main" href="${cta(t.id)}">무료로 ${KW[t.id][0]} 하기</a></div>
${P.promoHtml(OLDG[i])}
<h2>다른 가이드</h2>
<div class="rel">${D.GUIDES.map((o,j)=>j===i?'':`<a href="/${GSLUG[j]}/">${o.svg}<span>${o.t}<small>${o.s}</small></span></a>`).join('')}</div>`;
  out(slug,page({url,title,desc,body,ctaHref:cta(t.id),ctaTxt:`무료로 ${KW[t.id][0]} 하기`,ld:[{'@type':'Article',headline:g.t,description:desc,url:SITE+url,inLanguage:'ko',datePublished:'2026-10-08',dateModified:TODAY,author:{'@type':'Organization',name:BRAND},publisher:{'@type':'Organization',name:BRAND}},crumbLd([['홈','/'],['부모 가이드','/'+HUB_G+'/'],[g.t,url]])]}));
  urls.push(url);
});
{const url='/'+HUB_G+'/',title=`아이 재능·발달 부모 가이드 - ${BRAND}`,desc='아이 재능 찾는 법, 창의력·집중력 놀이, 5·6·7세 발달까지 3분이면 읽는 부모 가이드.';
 const body=`${crumbHtml([['홈','/'],['부모 가이드',url]])}<h1 class="page-h" style="margin-top:14px">부모 가이드</h1><p class="lead2">궁금한 주제를 골라 3분만 읽어보세요.</p>
<div class="rel" style="margin-top:18px">${D.GUIDES.map((g,i)=>`<a href="/${GSLUG[i]}/">${g.svg}<span>${g.t}<small>${g.s}</small></span></a>`).join('')}</div>
<div class="final sp-cta" style="display:block;margin-block:56px 8px;padding:44px 20px"><h2 style="margin:0">읽었다면, 이제 우리 아이 차례예요</h2><a class="btn btn-sun btn-big" href="/#intake">무료로 재능 찾기 시작하기</a></div>`;
 out(HUB_G,page({url,title,desc,body,ctaHref:'/#intake',ctaTxt:'무료로 재능 찾기 시작하기',ld:[{'@type':'CollectionPage',name:title,url:SITE+url,description:desc},crumbLd([['홈','/'],['부모 가이드',url]])]}));
 urls.push(url);}

/* ---- FAQ ---- */
{const url='/'+HUB_F+'/',title=`아이 재능검사 자주 묻는 질문 - ${BRAND}`,desc='검사 나이·소요 시간·결과 활용·기록 저장·비용까지, 아이 재능검사 자주 묻는 질문을 모았어요.';
 const cats=[...new Set(D.FAQ.map(f=>f[0]))];
 const body=`${crumbHtml([['홈','/'],['자주 묻는 질문',url]])}<h1 class="page-h" style="margin-top:14px">자주 묻는 질문</h1>
${cats.map(c=>`<h2>${c}</h2>${faqHtml(D.FAQ.filter(f=>f[0]===c).map(f=>[f[1],f[2]]))}`).join('')}
<div class="post-cta sp-cta" style="margin-top:36px"><p style="font-size:18px;margin:0" class="kid">궁금한 건 직접 해보는 게 제일 빨라요.</p><a class="btn btn-sun" href="/#intake">무료로 재능 찾기 시작하기</a></div>`;
 out(HUB_F,page({url,title,desc,body,ctaHref:'/#intake',ctaTxt:'무료로 재능 찾기 시작하기',ld:[{'@type':'WebPage',name:title,url:SITE+url,description:desc},crumbLd([['홈','/'],['자주 묻는 질문',url]]),faqLd(D.FAQ.map(f=>[f[1],f[2]]))]}));
 urls.push(url);}

/* ---- sitemap / llms ---- */
fs.writeFileSync(path.join(ROOT,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u=>`  <url><loc>${SITE}${encodeURI(u)}</loc><lastmod>${TODAY}</lastmod></url>`).join('\n')}
</urlset>
`);
// index.html 에 광고 코드·CSS·푸터 링크 주입
{const ip=path.join(ROOT,'index.html');let ix=fs.readFileSync(ip,'utf8');const PJS=fs.readFileSync(path.join(__dirname,'promo.js'),'utf8');
 const put=(a,b,v)=>{const re=new RegExp(a.replace(/[*/]/g,'\\$&')+'[\\s\\S]*?'+b.replace(/[*/]/g,'\\$&'));if(!re.test(ix))throw Error('marker '+a);ix=ix.replace(re,()=>a+v+b)};
 put('/*PROMO*/','/*/PROMO*/','\n'+PJS+'\nconst TSLUG='+JSON.stringify(TS)+';\n');put('/*PROMOCSS*/','/*/PROMOCSS*/','\n'+PCSS);put('<!--SITELINKS-->','<!--/SITELINKS-->',P.familyHtml()+footLinks());
 fs.writeFileSync(ip,ix);}
fs.writeFileSync(path.join(ROOT,'vercel.json'),JSON.stringify({redirects:[
  ...[...ALL.map(x=>[`/test/${x.id}`,TS[x.id]]),...OLDG.map((o,i)=>[`/guide/${o}`,GSLUG[i]]),['/test',HUB_T],['/guide',HUB_G],['/faq',HUB_F]]
    .flatMap(([o,n])=>[o,o+'/'].map(src=>({source:src,destination:encodeURI(`/${n}/`),permanent:true})))]},null,1));
console.log(urls.length,'urls');
