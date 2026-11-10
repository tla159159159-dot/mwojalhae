// 자동 생성: index.html의 IQ-CORE 블록 (node _build/gen.js)
/*IQ-CORE*/
/* ===== 사고력(IQ) 테스트 코어: 문항 생성기 + 점수 추정 (DOM 없음) ===== */
const IQK=["mat","lng","num","spa","mem"],IQB=a=>a<=7?"a":a<=10?"b":"c",IQBN={a:"만 5~7세용",b:"만 8~10세용",c:"만 11~12세용"};
const IQLV=[-1.7,-1.05,-.45,.15,.8,1.5]; /* 6단계 설계 난이도(같은 나이 또래 기준 z점수) */
const iqR=s=>()=>{s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const iqPick=(R,a)=>a[Math.floor(R()*a.length)],iqShuf=(R,a)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
/* 정답 1개 + 오답 3개를 섞고 정답 위치를 돌려줌 */
const iqMix=(R,right,wrong)=>{const o=iqShuf(R,[right,...wrong.slice(0,3)]);return{opts:o,a:o.indexOf(right)}};

/* ---- 1) 도형 추리: 3×3 행렬, 속성(모양·색·크기·개수) 규칙 1~4개 ---- */
const IQFILL=["#fff","#c9d3e6","#3b4a6b"];
const iqGlyph=(sh,f,x,y,r)=>{const a=`fill="${IQFILL[f]}" stroke="#3b4a6b" stroke-width="2.4" stroke-linejoin="round"`;return sh===0?`<circle cx="${x}" cy="${y}" r="${r}" ${a}/>`:sh===1?`<rect x="${x-r}" y="${y-r}" width="${2*r}" height="${2*r}" ${a}/>`:`<polygon points="${x},${y-r*1.1} ${x+r*1.15},${y+r*.85} ${x-r*1.15},${y+r*.85}" ${a}/>`};
const iqInner=v=>{const [sh,f,sz,ci]=v,ct=ci+1,r=[10,14,19][sz]*(ct>1?.58:1),P=ct===1?[[28,28]]:ct===2?[[16,28],[40,28]]:[[28,15],[15,41],[41,41]];return P.map(p=>iqGlyph(sh,f,p[0],p[1],r)).join("")};
const iqSvg=(v,w)=>`<svg viewBox="0 0 56 56" width="${w}" height="${w}" role="img" aria-hidden="true">${iqInner(v)}</svg>`;
function iqMat(band,lv,R){
  const k=({a:[1,1,1,2,2,2],b:[1,1,2,2,3,3],c:[1,2,2,3,3,4]})[band][lv-1],attrs=iqShuf(R,[0,1,2,3]).slice(0,k);
  let pt=iqShuf(R,[[0,1],[1,0],[1,1],[1,2]]);if(k===1&&lv===1)pt=[iqPick(R,[[0,1],[1,0]])];
  const base=[0,1,2,3].map(()=>Math.floor(R()*3)),off=[0,1,2,3].map(()=>Math.floor(R()*3));
  const cellAt=(r,c)=>[0,1,2,3].map(a=>{const i=attrs.indexOf(a);return i<0?base[a]:(((off[a]+r*pt[i][0]+c*pt[i][1])%3)+3)%3});
  const ans=cellAt(2,2),key=v=>v.join(""),seen=new Set([key(ans)]),wrong=[];
  const ch=[];for(let a=0;a<4;a++)for(let x=0;x<3;x++)if(x!==ans[a]){const v=ans.slice();v[a]=x;ch.push(v)}
  iqShuf(R,ch).forEach(v=>{if(wrong.length<3&&!seen.has(key(v))){seen.add(key(v));wrong.push(v)}});
  const m=iqMix(R,ans,wrong);
  let g="";for(let r=0;r<3;r++)for(let c=0;c<3;c++){const x=c*56,y=r*56;g+=`<rect x="${x}" y="${y}" width="56" height="56" fill="none" stroke="#c8cfdd" stroke-width="1.5"/>`+((r===2&&c===2)?`<rect x="${x+2}" y="${y+2}" width="52" height="52" fill="#eef1f8"/><text x="${x+28}" y="${y+38}" text-anchor="middle" font-size="30" font-weight="800" fill="#6a7491">?</text>`:`<g transform="translate(${x},${y})">${iqInner(cellAt(r,c))}</g>`)}
  return{q:"빈칸(?)에 들어갈 그림은?",stim:`<svg viewBox="0 0 168 168" width="${band==="a"?170:180}" height="${band==="a"?170:180}" role="img" aria-label="3×3 그림 규칙표">${g}</svg>`,opts:m.opts.map(v=>iqSvg(v,60)),a:m.a,t:`도형 행렬 3×3 · 규칙 ${k}개`};
}

/* ---- 2) 언어 추리: 낱말 관계·분류·논리 (구간별 6문항, 정답 위치는 매번 섞음) ---- */
const IQV={
 a:[{q:"나머지와 다른 하나는?",o:["사과","바나나","포도","자동차"],a:3,t:"분류"},
    {q:"새는 하늘, 물고기는 어디일까요?",o:["물속","땅","나무","구름"],a:0,t:"관계 유추"},
    {q:"‘뜨겁다’의 반대말은?",o:["차갑다","크다","빠르다","높다"],a:0,t:"반대말"},
    {q:"신발은 발에 신어요. 모자는 어디에 쓸까요?",o:["머리","손","눈","코"],a:0,t:"관계 유추"},
    {q:"민수는 지수보다 키가 커요. 지수는 하나보다 키가 커요. 키가 가장 작은 사람은?",o:["민수","지수","하나","모두 같아요"],a:2,t:"순서 추론"},
    {q:"모든 새는 날개가 있어요. 참새는 새예요. 그러면 참새는?",o:["날개가 있어요","물고기예요","날개가 없어요","알 수 없어요"],a:0,t:"삼단 논법"}],
 b:[{q:"‘넓다’의 반대말은?",o:["좁다","깊다","높다","두껍다"],a:0,t:"반대말"},
    {q:"나머지와 성격이 다른 하나는?",o:["서울","부산","대구","한강"],a:3,t:"분류"},
    {q:"의사는 병원에서 일해요. 선생님은 어디에서 일할까요?",o:["학교","시장","극장","주유소"],a:0,t:"관계 유추"},
    {q:"온도계로 온도를 재요. 자로는 무엇을 잴까요?",o:["길이","무게","시간","색깔"],a:0,t:"관계 유추"},
    {q:"모든 포유류는 새끼를 낳아요. 고래와 박쥐는 포유류예요. 반드시 맞는 말은?",o:["고래와 박쥐는 새끼를 낳아요","박쥐는 알을 낳아요","고래는 알을 낳아요","새끼를 낳는 동물은 모두 포유류예요"],a:0,t:"삼단 논법"},
    {q:"‘신중하다’와 뜻이 가장 비슷한 말은?",o:["조심스럽다","서두르다","게으르다","용감하다"],a:0,t:"어휘"}],
 c:[{q:"‘확대’의 반대가 ‘축소’인 것처럼, ‘증가’의 반대는?",o:["감소","상승","성장","팽창"],a:0,t:"관계 유추"},
    {q:"씨앗이 자라서 열매가 되듯, 올챙이가 자라면?",o:["개구리","물고기","거북이","잠자리"],a:0,t:"관계 유추"},
    {q:"도서관에는 책이 있어요. 미술관에는 무엇이 있을까요?",o:["그림","물감","붓","도화지"],a:0,t:"관계 유추"},
    {q:"A는 B보다 크고, C는 B보다 작아요. A와 C 중 더 큰 것은?",o:["A","C","같아요","알 수 없어요"],a:0,t:"순서 추론"},
    {q:"‘비가 오면 소풍을 가지 않는다’는 말이 맞아요. 소풍을 갔다면 반드시 맞는 말은?",o:["비가 오지 않았다","비가 왔다","날씨가 아주 맑았다","알 수 없다"],a:0,t:"조건 추론"},
    {q:"갑, 을, 병 중 한 명만 진실을 말해요. 갑: ‘을은 거짓말을 해.’ 을: ‘병은 거짓말을 해.’ 병: ‘갑과 을 둘 다 거짓말을 해.’ 진실을 말하는 사람은?",o:["갑","을","병","알 수 없다"],a:1,t:"진위 추론"}]};
function iqVer(band,lv,R){const x=IQV[band][lv-1],o=iqShuf(R,x.o.map((s,i)=>[s,i===x.a])),a=o.findIndex(z=>z[1]);return{q:x.q,stim:"",opts:o.map(z=>z[0]),a,t:`언어 · ${x.t}`,one:x.o.some(s=>s.length>9)}}

/* ---- 3) 수·규칙 추리: 규칙 종류가 단계마다 바뀜 ---- */
function iqNum(band,lv,R){
  const ri=(a,b)=>a+Math.floor(R()*(b-a+1)),L=n=>Array.from({length:n});
  const grow=(a,d0,e,n)=>{const s=[a];for(let i=1;i<n;i++)s.push(s[i-1]+d0+e*(i-1));return s};
  const alt=(a,d1,d2,n)=>{const s=[a];for(let i=1;i<n;i++)s.push(s[i-1]+(i%2?d1:d2));return s};
  const inter=(a,d1,b,d2,n)=>L(n).map((_,i)=>i%2?b+d2*((i-1)/2):a+d1*(i/2));
  const F={a:[()=>{const d=ri(1,2),a=ri(1,6);return L(6).map((_,i)=>a+d*i)},
              ()=>{const d=ri(3,5),a=ri(1,5);return L(6).map((_,i)=>a+d*i)},
              ()=>{const d=ri(1,3),a=ri(18,22);return L(6).map((_,i)=>a-d*i)},
              ()=>alt(ri(1,3),1,2,7),
              ()=>{const a=ri(1,2);return L(6).map((_,i)=>a*2**i)},
              ()=>grow(ri(1,2),1,1,6)],
           b:[()=>{const d=ri(6,9),a=ri(3,20);return L(6).map((_,i)=>a+d*i)},
              ()=>{const d=ri(4,8),a=ri(60,80);return L(6).map((_,i)=>a-d*i)},
              ()=>alt(ri(2,9),ri(2,4),ri(5,8),7),
              ()=>R()<.5?L(6).map((_,i)=>3*2**i):L(6).map((_,i)=>3**i),
              ()=>grow(ri(1,4),ri(2,3),2,6),
              ()=>inter(ri(2,6),ri(2,4),ri(10,20),ri(3,6),8)],
           c:[()=>alt(ri(2,9),ri(2,5),ri(6,9),7),
              ()=>{const c=iqPick(R,[1,-1,2]),s=[ri(2,4)];for(let i=1;i<6;i++)s.push(s[i-1]*2+c);return s},
              ()=>grow(ri(1,5),ri(1,3),ri(2,3),7),
              ()=>inter(ri(1,5),ri(2,4),ri(40,50),-ri(2,5),8),
              ()=>{const s=[ri(1,3),ri(2,5)];for(let i=2;i<7;i++)s.push(s[i-1]+s[i-2]);return s},
              ()=>L(6).map((_,i)=>(i+1)**3)]};
  const s=F[band][lv-1](),a=s[s.length-1],shown=s.slice(0,-1),d=Math.abs(a-s[s.length-2]);
  const pool=[...new Set([a+1,a-1,a+2,a-2,a+d,a-d,a+d+1,a-d-1,a*2,Math.round(a/2),a+3,a-3,a+10])].filter(x=>x>0&&x!==a),m=iqMix(R,a,iqShuf(R,pool));
  return{q:"빈칸(?)에 들어갈 숫자는?",stim:`<div class="nseq">${shown.map(x=>`<b>${x}</b>`).join("")}<b class="qm">?</b></div>`,opts:m.opts.map(String),a:m.a,t:`수열 · ${shown.length}항`};
}

/* ---- 4) 공간 시각화: 돌리면 같은 모양(뒤집힌 모양·변형은 오답) ---- */
const iqNorm=c=>{const r0=Math.min(...c.map(x=>x[0])),c0=Math.min(...c.map(x=>x[1]));return c.map(x=>[x[0]-r0,x[1]-c0]).sort((p,q)=>p[0]-q[0]||p[1]-q[1])};
const iqKey=c=>iqNorm(c).join(";"),iqRot=c=>iqNorm(c.map(([r,k])=>[k,-r])),iqMir=c=>iqNorm(c.map(([r,k])=>[r,-k]));
const iqRotN=(c,n)=>{for(let i=0;i<n;i++)c=iqRot(c);return c};
const iqCanon=c=>{let m=iqNorm(c),b=iqKey(m);for(let i=0;i<3;i++){m=iqRot(m);const k=iqKey(m);if(k<b)b=k}return b};
const iqNB=(c,g)=>{const o=[];c.forEach(([r,k])=>[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const x=r+a,y=k+b;if(x>=0&&y>=0&&x<g&&y<g&&!c.some(z=>z[0]===x&&z[1]===y))o.push([x,y])}));return o};
const iqConn=c=>{const seen=[c[0]],q=[c[0]];while(q.length){const [r,k]=q.pop();c.forEach(z=>{if(!seen.includes(z)&&Math.abs(z[0]-r)+Math.abs(z[1]-k)===1){seen.push(z);q.push(z)}})}return seen.length===c.length};
const iqPoly=(R,n,g)=>{const c=[[Math.floor(R()*g),Math.floor(R()*g)]];while(c.length<n)c.push(iqPick(R,iqNB(c,g)));return iqNorm(c)};
const iqMod=(R,c,g)=>{for(const m of iqShuf(R,c)){const rest=c.filter(z=>z!==m);for(const p of iqShuf(R,iqNB(rest,g))){const nc=rest.concat([p]);if(iqConn(nc)&&iqCanon(nc)!==iqCanon(c))return iqNorm(nc)}}return null};
const iqShape=c=>{const W=Math.max(...c.map(x=>x[1]))+1,H=Math.max(...c.map(x=>x[0]))+1,s=13,ox=(60-s*W)/2,oy=(60-s*H)/2;return `<svg viewBox="0 0 60 60" width="64" height="64" role="img" aria-hidden="true">${c.map(([r,k])=>`<rect x="${ox+k*s}" y="${oy+r*s}" width="${s}" height="${s}" rx="2" fill="#6c8ae4" stroke="#fff" stroke-width="1.4"/>`).join("")}</svg>`};
function iqSpa(band,lv,R){
  const n=({a:[4,4,4,5,5,5],b:[4,4,5,5,5,6],c:[4,5,5,6,6,6]})[band][lv-1],g=4;
  for(let tr=0;tr<200;tr++){
    const B=iqPoly(R,n,g),k=iqPick(R,[1,2,3]),right=iqRotN(B,k);
    if(iqCanon(iqMir(B))===iqCanon(B)||iqKey(right)===iqKey(B))continue;
    const seen=new Set([iqCanon(B)]),wrong=[],add=c=>{if(c&&wrong.length<3&&!seen.has(iqCanon(c))){seen.add(iqCanon(c));wrong.push(iqRotN(c,Math.floor(R()*4)))}};
    add(iqMir(B));const M=iqMod(R,B,g);add(M);if(M)add(iqMir(M));add(iqMod(R,B,g));
    if(wrong.length<3)continue;
    const m=iqMix(R,right,wrong);
    return{q:"왼쪽 모양을 돌리기만 하면 똑같아지는 것은?",sub:"뒤집으면 안 돼요",stim:iqShape(B).replace('width="64" height="64"','width="96" height="96"'),opts:m.opts.map(iqShape),a:m.a,t:`모양 돌리기 · ${n}칸`};
  }
  throw new Error("iqSpa 생성 실패");
}

/* ---- 5) 작업기억: 그림 순서를 잠깐 보여 준 뒤 숨김 (구간별 3~7개, 높은 단계는 거꾸로) ---- */
const IQE=["🍎","🚗","🌟","🐶","🎈","🔔","🍌","🐟","🚀","🎵","🌷","⚽"];
function iqMem(band,lv,R){
  const K=({a:[3,3,4,4,5,5],b:[4,4,5,5,6,6],c:[4,5,5,6,6,7]})[band][lv-1],rev=(band==="b"&&lv>=5)||(band==="c"&&lv>=3);
  const seq=iqShuf(R,IQE).slice(0,K),tgt=rev?seq.slice().reverse():seq.slice(),seen=new Set([tgt.join("")]),wrong=[];
  for(let tr=0;tr<80&&wrong.length<3;tr++){
    const w=tgt.slice(),t=Math.floor(R()*4);
    if(t===0){const i=Math.floor(R()*(K-1));[w[i],w[i+1]]=[w[i+1],w[i]]}
    else if(t===1){w[Math.floor(R()*K)]=iqPick(R,IQE.filter(e=>!seq.includes(e)))}
    else if(t===2){[w[0],w[K-1]]=[w[K-1],w[0]]}
    else if(rev){if(!seen.has(seq.join(""))){seen.add(seq.join(""));wrong.push(seq.slice())}continue}
    else w.push(w.shift());
    if(!seen.has(w.join(""))){seen.add(w.join(""));wrong.push(w)}
  }
  const m=iqMix(R,tgt,wrong.slice(0,3));
  return{q:rev?"방금 본 그림을 거꾸로 말하면? (마지막 그림부터)":"방금 본 그림과 순서가 똑같은 것은?",mem:{html:`<div class="memseq">${seq.map(e=>`<span>${e}</span>`).join("")}</div><p class="iqhint">👀 잘 보고 순서를 기억하세요!</p>`,ms:K*850+700},opts:m.opts.map(o=>`<span class="eseq">${o.join("")}</span>`),a:m.a,one:true,t:`그림 순서 기억 · ${K}개${rev?" · 거꾸로":""}`};
}

/* ---- 문항 세트(구간·회차 seed로 항상 같은 문항을 다시 만들 수 있음) ---- */
function iqItems(band,seed){const bi={a:1,b:2,c:3}[band],out=[];
  for(let lv=1;lv<=6;lv++)IQK.forEach((d,di)=>{const R=iqR(seed*7919+bi*1009+di*101+lv*13+1),it=({mat:iqMat,lng:iqVer,num:iqNum,spa:iqSpa,mem:iqMem})[d](band,lv,R);it.d=d;it.lv=lv;it.b=IQLV[lv-1];out.push(it)});
  return out}

/* ---- 점수 추정: 문항반응이론(3모수 로지스틱, 추측도 .25) + 사전분포 N(0,1) 베이즈 추정(EAP) ---- */
const iqPhi=z=>{const t=1/(1+.2316419*Math.abs(z)),p=.3989423*Math.exp(-z*z/2)*t*(.3193815+t*(-.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return z>0?1-p:p};
function iqEAP(its,ok){const G=[],W=[];let S=0;
  for(let th=-3.5;th<=3.5001;th+=.05){let lp=-th*th/2;its.forEach((it,i)=>{const p=.25+.75/(1+Math.exp(-1.4*(th-it.b)));lp+=Math.log(ok[i]?p:1-p)});G.push(th);const w=Math.exp(lp);W.push(w);S+=w}
  let m=0,v=0,c=0,lo=null,hi=null;G.forEach((th,i)=>{const w=W[i]/S;m+=th*w});G.forEach((th,i)=>{const w=W[i]/S;v+=(th-m)**2*w;c+=w;if(lo===null&&c>=.1)lo=th;if(hi===null&&c>=.9)hi=th});
  return{th:m,sd:Math.sqrt(v),lo,hi}}
const iqCl=x=>Math.max(55,Math.min(145,Math.round(x)));
function iqScore(items,ok,rt){const e=iqEAP(items,ok),sc={},dom={};
  IQK.forEach(d=>{const ix=items.map((it,i)=>i).filter(i=>items[i].d===d),r=iqEAP(ix.map(i=>items[i]),ix.map(i=>ok[i]));dom[d]={th:+r.th.toFixed(2),n:ix.filter(i=>ok[i]).length};sc[d]=Math.max(1,Math.min(99,Math.round(iqPhi(r.th)*100)))});
  const fast=items.filter((it,i)=>!ok[i]&&rt[i]!=null&&rt[i]<2.5&&it.d!=="mem").length,easyMiss=items.filter((it,i)=>it.lv<=2&&!ok[i]).length;
  const rel=fast>=6?"lo":(fast>=3||easyMiss>=3||e.sd>.6)?"mid":"hi";
  return{sc,sum:{v:iqCl(100+15*e.th),lo:iqCl(100+15*e.lo),hi:iqCl(100+15*e.hi),top:Math.max(1,Math.round((1-iqPhi(e.th))*100)),th:+e.th.toFixed(2),sd:+e.sd.toFixed(2),n:ok.filter(Boolean).length,rel,fast,easyMiss,dom}}}

module.exports={iqItems,iqScore};
