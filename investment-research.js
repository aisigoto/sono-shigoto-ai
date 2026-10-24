(()=>{
 'use strict';
 const data=JSON.parse(document.getElementById('research-chart-data').textContent);
 const ns='http://www.w3.org/2000/svg';
 const fmt=n=>n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
 function node(tag,attrs,text){const e=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);if(text!==undefined)e.textContent=text;return e;}
 for(const figure of document.querySelectorAll('.research-chart')){
  const p=data[figure.dataset.stock];
  for(const button of figure.querySelectorAll('[data-months]'))button.addEventListener('click',()=>{
   const months=Number(button.dataset.months), points=[...p.points.slice(-months),{label:p.quoteAt.slice(0,10),value:p.quote}];
   const values=points.map(v=>v.value),min=Math.min(...values)*.96,max=Math.max(...values)*1.04;
   const x=i=>64+i*610/(points.length-1), y=v=>172-(v-min)/(max-min||1)*148;
   const svg=node('svg',{viewBox:'0 0 720 208',role:'img','aria-label':`${months}か月の月次終値と取得時点価格。通貨${p.unit}`});
   svg.append(node('title',{},'月次終値と取得時点価格。月中の高値・安値は含みません'));
   for(const v of [min,(min+max)/2,max])svg.append(node('line',{x1:60,x2:680,y1:y(v),y2:y(v),stroke:'#e3e9f0'}),node('text',{x:4,y:y(v)+4,'font-size':11,fill:'#64717d'},fmt(v)));
   svg.append(node('polyline',{points:points.map((p,i)=>`${x(i)},${y(p.value)}`).join(' '),fill:'none',stroke:'#1468e8','stroke-width':3}));
   points.forEach((v,i)=>{const c=node('circle',{cx:x(i),cy:y(v.value),r:3,fill:'#1468e8'});c.append(node('title',{},`${v.label||v.month}: ${fmt(v.value)} ${p.unit}`));svg.append(c);});
   for(const i of [0,Math.floor((points.length-1)/2),points.length-1])svg.append(node('text',{x:x(i),y:200,'text-anchor':'middle','font-size':12,fill:'#64717d'},points[i].label||points[i].month));
   figure.querySelector('[data-plot]').replaceChildren(svg);
   figure.querySelectorAll('[data-months]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   const change=(p.quote/points[0].value-1)*100;
   figure.querySelector('[data-chart-reading]').textContent=`${months}か月表示／月次終値＋取得時点価格。最初の表示点から${change>=0?'+':''}${change.toFixed(1)}%。現地通貨建て・配当等を含まない価格変化。`;
   const rows=points.map(v=>{const row=document.createElement('tr');for(const text of [v.label||v.month,fmt(v.value)]){const cell=document.createElement('td');cell.textContent=text;row.append(cell);}return row;});
   figure.querySelector('[data-chart-rows]').replaceChildren(...rows);
  });
 }
 const eps=document.getElementById('scenario-eps'),pe=document.getElementById('scenario-pe'),price=document.getElementById('scenario-price'),diff=document.getElementById('scenario-diff');
 function update(){const e=Number(eps.value),m=Number(pe.value);if(!eps.value||!pe.value||!eps.validity.valid||!pe.validity.valid||!Number.isFinite(e*m)){price.textContent='有効な正の数を入力';diff.textContent='';return;}const v=e*m,q=data.peng.quote,delta=(v/q-1)*100;price.textContent=fmt(v)+' USD';diff.textContent=`取得価格${fmt(q)} USDに対して ${delta>=0?'+':''}${delta.toFixed(1)}%（入力値からの計算）`;}
 eps.addEventListener('input',update);pe.addEventListener('input',update);update();
})();

(()=>{const budget=document.getElementById('purchase-budget'),fx=document.getElementById('purchase-fx'),reserve=document.getElementById('purchase-reserve'),status=document.getElementById('purchase-feedback');if(!budget)return;function recalc(){const b=Number(budget.value),f=Number(fx.value),r=Number(reserve.value),valid=fx.value!==''&&reserve.value!==''&&fx.validity.valid&&reserve.validity.valid&&Number.isFinite(b+f+r);for(const row of document.querySelectorAll('[data-access-stock]')){if(row.dataset.eligible!=='true')continue;const gross=Number(row.dataset.quote)*Number(row.dataset.unit)*(row.dataset.currency==='USD'?f:1),total=Math.ceil(gross+r);row.querySelector('[data-access-cost]').textContent=valid?Math.ceil(gross).toLocaleString('ja-JP')+'円':'—';row.querySelector('[data-access-total]').textContent=valid?total.toLocaleString('ja-JP')+'円':'—';row.querySelector('[data-access-fit]').textContent=!valid?'入力を確認':total<=b?'予算内（買い判定ではない）':'予算超過';}status.textContent=valid?'入力した仮定で比較中。予算内でも業績・株価評価の条件は別に確認します。':'為替・予備額を有効な範囲で入力してください。';}for(const el of [budget,fx,reserve])el.addEventListener('input',recalc);recalc();})();

// 比較表から、閉じた比較銘柄のチャートにも直接移動できるようにする。
for(const a of document.querySelectorAll('a[href^="#"]'))a.addEventListener('click',()=>{const id=a.getAttribute('href').slice(1),target=document.getElementById(id);if(target){const box=target.closest('details');if(box)box.open=true;}});
