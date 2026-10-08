// 패밀리 사이트 광고형 CTA — index.html 과 정적 페이지가 같이 쓴다 (gen.js 가 index.html 에 주입)
const PROMO={
 bamtol:{n:"밤톨",u:"https://bamtol.co.kr",e:"🌙",c:"#E9E4FF",l:"잠들기 전, 우리 아이 이름이 나오는 동화와 자장가",g:"오늘 밤 들려주기"},
 dojang:{n:"도장쾅",u:"https://www.dojangkwang.co.kr",e:"✏️",c:"#FFF1C9",l:"집에서 바로 뽑아 쓰는 홈스쿨 프린트 학습지",g:"학습지 보러 가기"},
 kokcolor:{n:"콕콕",u:"https://kokcolor.kr",e:"🖍️",c:"#FFE1EA",l:"아이가 좋아하는 색칠공부 도안, 화면에서 무료로",g:"색칠하러 가기"},
 mom:{n:"맘먼트",u:"https://mommoment.kr",e:"💬",c:"#DDF2EA",l:"비슷한 고민을 하는 엄마들과 육아 이야기 나누기",g:"이야기 나누러 가기"},
 malang:{n:"말랑영어",u:"https://malangenglish.co.kr",e:"🔤",c:"#DCEBFF",l:"엄마표 영어, 학습지부터 소리까지 한 곳에서",g:"말랑영어 보기"}
};
const PROMO_FOR={talent:["kokcolor","dojang"],temper:["bamtol","mom"],learn:["dojang","malang"],career:["malang","dojang"],social:["mom","bamtol"],attention:["dojang","kokcolor"],eq:["bamtol","kokcolor"],esteem:["bamtol","dojang"],mindset:["dojang","malang"],style:["mom","bamtol"],emotion:["bamtol","mom"],stress:["mom","bamtol"],media:["kokcolor","bamtol"],efficacy:["mom","malang"],relation:["bamtol","mom"],coparent:["mom","bamtol"],discipline:["mom","bamtol"],
 "talent-find":["kokcolor","dojang"],"creativity-play":["kokcolor","bamtol"],"spatial-ability":["kokcolor","dojang"],"math-talent":["dojang","malang"],observation:["kokcolor","dojang"],"focus-play":["dojang","kokcolor"],"age5-development":["bamtol","kokcolor"],"age6-development":["kokcolor","dojang"],"age7-development":["dojang","malang"],"elementary-talent":["dojang","malang"]};
const promoUrl=(k,src)=>PROMO[k].u+"/?utm_source=mwojalhae&utm_medium=referral&utm_campaign=family&utm_content="+src;
function promoHtml(src){const ks=PROMO_FOR[src]||["bamtol","dojang"];return `<aside class="promo" aria-label="함께 쓰면 좋은 서비스"><p class="pl">함께 쓰면 좋아요 <span>AD</span></p><div class="pcs">${ks.map(k=>{const p=PROMO[k];return `<a class="pc" href="${promoUrl(k,src)}" target="_blank" rel="noopener" style="--pc:${p.c}"><span class="pe" aria-hidden="true">${p.e}</span><span class="pt"><b>${p.n}</b>${p.l}</span><span class="pg">${p.g} →</span></a>`}).join("")}</div></aside>`}
function familyHtml(){return `<nav class="family" aria-label="패밀리 사이트"><b>패밀리 사이트</b>${Object.keys(PROMO).map(k=>`<a href="${promoUrl(k,"footer")}" target="_blank" rel="noopener">${PROMO[k].e} ${PROMO[k].n}</a>`).join("")}</nav>`}
