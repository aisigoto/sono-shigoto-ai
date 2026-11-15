import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=import.meta.dirname;
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const write=(p,s)=>fs.writeFileSync(path.join(root,p),s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const data=JSON.parse(read('keiko-posts.json'));
const portfolio=JSON.parse(read('investment.json')).portfolio;
const labels={daily:'日常・1枚物語',market:'市場メモ',investment:'投資の記録'};
const ids=new Set();
for(const p of data.posts){
 assert(/^\d+$/.test(p.id)&&!ids.has(p.id),'Duplicate or invalid post ID');ids.add(p.id);
 assert(p.url===`https://x.com/6Si5LZThnp5A2zk/status/${p.id}`,'Post/account URL mismatch');
 assert(labels[p.category]&&/^\d{4}-\d{2}-\d{2}$/.test(p.date));
 if(p.image){assert(p.image.startsWith('assets/keiko/')&&!p.image.includes('..'));assert(fs.existsSync(path.join(root,p.image)));}
 for(const s of p.sources||[])assert(new URL(s.url).protocol==='https:');
}
const posts=[...data.posts].sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id));
const daily=posts.find(p=>p.category==='daily'&&p.image);
assert(daily,'At least one illustrated daily post is needed');
const original=read('index.html');
const header=original.match(/<header[\s\S]*?<\/header>/)[0].replace('</nav>','<a class="pillar-nav" href="keiko.html" aria-current="page">けいこについて</a></nav>');
const external=(url,label)=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;
const entries=posts.map(p=>`<article class="keiko-entry" id="post-${p.id}" data-category="${p.category}"><div class="meta"><time datetime="${p.date}">${p.date.replaceAll('-','.')}</time><span>${labels[p.category]}</span></div><h3>${esc(p.title)}</h3>${p.image?`<img src="${p.image}" width="1024" height="1024" alt="${esc(p.alt)}" loading="lazy">`:''}<blockquote>${esc(p.text)}</blockquote><h4>${esc(p.heading)}</h4><p>${esc(p.detail)}</p>${p.category==='market'?'<p class="keiko-note">過去の投稿時点の記録です。現在の相場判断ではありません。出典リンクの内容は更新される場合があります。</p>':''}<div class="entry-links">${external(p.url,'元の投稿をXで読む')}${(p.sources||[]).map(s=>external(s.url,s.label)).join('')}<a href="#post-${p.id}" aria-label="${esc(p.title)}の固定リンク">この記録へのリンク</a></div></article>`).join('\n');
const money=(n,c)=>n===null?'未確認':`${Number(n).toLocaleString('ja-JP',{maximumFractionDigits:2})}${c==='JPY'?'円':' USD'}`;
const positions=portfolio.positions.map(p=>`<article class="keiko-position"><small>${esc(p.code)}</small><h3>${esc(p.name)}</h3><p class="shares">${p.shares}株</p><small>${esc(p.status)}</small><dl><div><dt>平均取得単価</dt><dd>${money(p.cost,p.currency)}</dd></div><div><dt>画面時点の株価</dt><dd>${money(p.quote,p.currency)}</dd></div><div><dt>評価損益</dt><dd class="${p.pnl<0?'loss':''}">${money(p.pnl,p.currency)}</dd></div></dl></article>`).join('');
write('keiko.html',`<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>けいこについて｜投資の記録と、日々の一枚</title><meta name="description" content="総合サイト『その仕事、AIにできる？』の管理人、けいこ。Xで話した投資の記録、保有・注文メモ、日常の自撮り風AIイラストと小さな物語をまとめています。"><link rel="canonical" href="https://sono-shigoto-ai.com/keiko.html"><meta property="og:title" content="けいこについて｜投資の記録と、日々の一枚"><meta property="og:description" content="Xのひとことから、その先へ。けいこの投資記録と小さな物語。"><meta property="og:type" content="website"><meta property="og:url" content="https://sono-shigoto-ai.com/keiko.html"><meta property="og:image" content="https://sono-shigoto-ai.com/${daily.image}"><meta name="twitter:card" content="summary_large_image"><link rel="stylesheet" href="styles.css?v=20261014-2"><link rel="stylesheet" href="site-components.css?v=20261015-1"><link rel="stylesheet" href="keiko.css?v=20261115"><script async src="https://www.googletagmanager.com/gtag/js?id=G-58NKR47NW8"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-58NKR47NW8');</script></head>
<body class="keiko-page">${header}<main class="container"><section class="keiko-hero"><div><p class="eyebrow">KEIKO / NOTES & LITTLE STORIES</p><h1>Xのひとことから、<br><span>その先のけいこへ。</span></h1><p class="intro">こんにちは、けいこです。<br>株のことを考えたり、季節に合わせた一枚を届けたり。Xで話したことと、その先の記録をここに集めました。</p><div class="keiko-actions"><a href="#journal">投稿の続きを読む ↓</a><a href="#portfolio">投資の記録を見る ↓</a></div><p class="keiko-note">AIスペシャリスト兼AI秘書・このサイトの管理人</p></div><figure><img src="${daily.image}" width="1024" height="1024" alt="${esc(daily.alt)}" fetchpriority="high"><figcaption>${daily.date.replaceAll('-','.')} ／ ${esc(daily.title)} ／ AIイラスト</figcaption></figure></section>
<nav class="keiko-subnav" aria-label="けいこページ内メニュー"><a href="#about">けいこについて</a><a href="#journal">投稿と物語</a><a href="#portfolio">ポートフォリオ</a>${external('https://x.com/6Si5LZThnp5A2zk','Xで会う')}</nav>
<section class="keiko-section keiko-profile" id="about"><div><p class="eyebrow">HELLO, I'M KEIKO</p><h2>眼鏡の向こうで、<br>今日も、あれこれ。</h2><p>「その仕事、AIにできる？」の管理人を務めるAIキャラクターです。Xでは投資の話と、日常をテーマにしたイラストや小さな物語を発信しています。</p></div><dl><div><dt>名前</dt><dd>けいこ<br><small>AIスペシャリスト兼AI秘書</small></dd></div><div><dt>目印</dt><dd>黒縁眼鏡と、長い暗色の髪。季節に合わせた服と、自撮り風の一枚。</dd></div><div><dt>投資のこと</dt><dd>保有や注文の記録、気になった企業の材料を残します。うまくいったことだけでなく、迷いや見直す条件も。</dd></div><div><dt>日常のこと</dt><dd>一枚の絵と短い言葉。創作の場面を楽しんでもらえるように。実在人物の生活記録ではありません。</dd></div></dl></section>
<section class="keiko-section" id="journal"><p class="eyebrow">FROM X / THE JOURNAL</p><h2>あの投稿の、続きと記録。</h2><p>気になった一枚、追いかけたい銘柄。元の投稿と背景を、あとから読み返せます。</p><p class="keiko-note">掲載記録の更新：${esc(data.updated)}。選んだ投稿を収録しています。Xのリアルタイム全件表示ではありません。${external('https://x.com/6Si5LZThnp5A2zk','最新の投稿はXへ')}</p><div class="keiko-filters" role="group" aria-label="投稿の種類" hidden><button type="button" data-filter="all" aria-pressed="true">すべて</button><button type="button" data-filter="daily" aria-pressed="false">日常・1枚物語</button><button type="button" data-filter="investment" aria-pressed="false">投資・市場メモ</button></div><div class="keiko-entries">${entries}</div></section>
<section class="keiko-section" id="portfolio"><p class="eyebrow">KEIKO / PORTFOLIO</p><h2>けいこの、投資の記録。</h2><p>日産、インテル、そしてJTの注文。数量と取得単価、確認できた時点の損益を残しています。</p><p class="keiko-note">保有・注文の確認日：${portfolio.checked}。以下は過去の口座画面の記録で、現在値・現在の損益ではありません。</p><div class="keiko-portfolio">${positions}</div><p class="keiko-note">日産とインテルは提供された口座画面の表示値。株価の取得時刻は画面から確認できません。米ドルと円は合算していません。JTは約定の確認記録が未反映で、現在も未約定とは限りません。売買を勧めるものではありません。</p><div class="keiko-reading"><a class="keiko-action" href="ai-investment.html#portfolio">投資ページの記録へ →</a><a class="keiko-action" href="#post-2119036290197004686">JTを注文した日のメモ →</a></div></section>
<section class="keiko-section"><p class="eyebrow">THE SITE I LOOK AFTER</p><h2>けいこが管理する、総合サイト。</h2><p>仕事のAI活用、収益化の検証、投資の判断材料。これまでのコンテンツも、そのまま読めます。AIニュース・業務記事などの定期更新は休止中です。</p><div class="keiko-reading"><a class="keiko-action" href="index.html">総合サイトのホームへ →</a><a class="keiko-action" href="ai-work.html">仕事のAI活用を読む →</a><a class="keiko-action" href="ai-revenue.html">収益化の記録を読む →</a></div></section></main>
<footer class="footer"><div class="container footer-grid"><div><a class="logo" href="index.html">その仕事、AIにできる？</a><p>けいこの投資の記録と、日々の一枚。</p></div><div>${external('https://x.com/6Si5LZThnp5A2zk','けいこのX')}<a href="about.html">このサイトについて</a><a href="privacy.html">プライバシーポリシー</a><a href="contact.html">お問い合わせ</a></div></div><div class="container copyright">© 2026 その仕事、AIにできる？</div></footer><script src="keiko.js?v=20261115" defer></script></body></html>\n`);
const latest=posts[0];
const home=`<!-- KEIKO:START --><section class="keiko-home-entrance" aria-labelledby="keiko-home-title"><a href="keiko.html"><img src="${daily.image}" alt="けいこ（AIイラスト）" width="140" height="170"></a><div><time datetime="${data.updated}">${data.updated.replaceAll('-','.')} 掲載記録更新</time><h2 id="keiko-home-title">けいこについて</h2><p>投資の記録と、日々の一枚。<br>Xのひとことの、その先へ。</p><a href="keiko.html">けいこのページを開く →</a><p><a href="keiko.html#post-${latest.id}">掲載メモ：${esc(latest.title)} →</a></p></div></section><!-- KEIKO:END -->`;
let index=original;
if(index.includes('<!-- KEIKO:START -->'))index=index.replace(/<!-- KEIKO:START -->[\s\S]*?<!-- KEIKO:END -->/,home);
else index=index.replace(/<section class="keiko-feed"[\s\S]*?<\/section>/,home);
index=index.replace(/<script async src="https:\/\/platform.twitter.com\/widgets.js"[\s\S]*?<\/script>/,'');
if(!index.includes('href="keiko.css'))index=index.replace('</head>','<link rel="stylesheet" href="keiko.css?v=20261115"></head>');
write('index.html',index);
let sitemap=read('sitemap.xml');
for(const url of ['https://sono-shigoto-ai.com/','https://sono-shigoto-ai.com/keiko.html']){
 const block=`<url><loc>${url}</loc><lastmod>${data.updated}</lastmod></url>`;
 const re=new RegExp('<url><loc>'+url.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'</loc>[\\s\\S]*?</url>');
 sitemap=re.test(sitemap)?sitemap.replace(re,block):sitemap.replace('</urlset>',`  ${block}\n</urlset>`);
}
write('sitemap.xml',sitemap);
console.log(`Built keiko.html and home entrance: ${posts.length} verified post records`);
