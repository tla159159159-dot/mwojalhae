// index.html 안의 검사·가이드·FAQ 데이터를 꺼내 _build/data.json 으로 저장
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
(async()=>{
  let html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const hook=`window.__D={QUIZ:QUIZ.map(q=>({id:q.id,cat:q.cat,t:q.t,s:q.s,who:q.who,min:q.min,n:q.q.length,ref:q.ref,base:BASE[q.id]||"",note:q.note||"",young:!!q.young,kid:!!q.kid,
    sample:q.q.filter((x,i)=>!x[2]).slice(0,40).filter((x,i)=>i%7===0).slice(0,4).map(x=>x[0]),
    dims:Object.entries(q.dims).map(([k,d])=>({n:d.n,hi:d.hi,tip:d.tip,neg:!!d.neg})),
    types:Object.values(q.types).map(t=>({n:t.n,sum:t.sum||""})),svg:mascot(col(q.c),q.acc,96),tint:tint(q.c)})),
   TALENT:{...TALENT,svg:mascot(col(TALENT.c),TALENT.acc,96),tint:tint(TALENT.c)},
   AREAS:KEYS.map(k=>({k,n:T[k].n,d:T[k].d,plays:T[k].plays,svg:mascot(col(k),T[k].acc,96),tint:tint(k)})),
   GUIDES:GUIDES.map(g=>({t:g.t,s:g.s,k:g.k,b:g.b.map(([h,p])=>[h,p||null]),list:g.list?T[g.list].plays:null,svg:mascot(col(g.k),T[g.k].acc,96),tint:tint(g.k)})),
   FAQ, CSS:[...document.querySelectorAll('style')].map(s=>s.textContent).join('\\n')};`;
  html=html.replace(/\n\}\)\(\);\n<\/script>/,`\n${hook}\n})();\n</script>`);
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());
  const p=await b.newPage();await p.setContent(html,{waitUntil:'domcontentloaded'});
  const D=await p.evaluate(()=>window.__D);
  fs.writeFileSync(path.join(__dirname,'data.json'),JSON.stringify(D));
  console.log(D.QUIZ.map(q=>q.id+':'+q.t).join('\n'),'\nguides',D.GUIDES.length,'faq',D.FAQ.length,'css',D.CSS.length);
  await b.close();})();
