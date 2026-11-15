# けいこのXとサイトの連動（2026-11-15）

AIニュース・業務効率化記事・従来の投資週次更新は休止を維持。20時は日常・創作、21時30分は投資・市場メモ。仕事のAI効率化の投稿はしない。

## 更新範囲

公開リポジトリ https://github.com/aisigoto/sono-shigoto-ai.git の最新版を取得した独立チェックアウトを使う。D:/Codex/ai-revenue-engine の未コミット変更をまとめて公開しない。

Xで公開本文・URL・添付画像を確認した後、keiko-posts.json の posts に1件追加する。id はXの投稿ID、date は日本時間の投稿日、category は daily / market / investment。title、text（公開本文）、url、image、alt、heading、detail、sources を既存例にならって記入する。sources は label/url の配列。画像は公開した同じ画像を assets/keiko/ に保存する。新しいX投稿での画像使い回し禁止と、サイトでの同一投稿のアーカイブ掲載は区別する。

detail は投稿の背景、確認済みの事実、過去の判断とのつながりを読者向けに記載。引用の水増し、実在の私生活・取引・最新価格を創作しない。創作はその旨を示す。市場記事の新しい事実は一次資料を確認し、出典と基準日を残す。古い見解を書き換えず、訂正日・理由を追記する。画像・本文・投稿IDの重複を確認。updated はサイトの記録更新日で、株価取得日ではない。

node build-keiko.mjs で keiko.html、ホームのけいこ入口、サイトマップの該当URLの日付を生成。保有スナップショットは investment.json の portfolio から読み、未確認の取得単価や約定状況を更新しない。日常投稿があるとヘッダー画像は最新の日常投稿になる。

node --check build-keiko.mjs と node --check keiko.js、変更差分、画像、固定アンカーと内部リンクを確認。keiko-posts.json、keiko.html、index.html、今回の assets/keiko/ 画像、sitemap.xml の対象ページだけをコミット・pushし、GitHub Pagesの成功と本番反映を確認。デザイン変更があるときだけ関連CSS/JS/生成器も対象。無関係な変更は含めない。

投稿からリンクする場合は公開済みの https://sono-shigoto-ai.com/keiko.html または既存の #post-投稿ID / #portfolio にUTMを付ける。まだ存在しない新規アンカーへの誘導はしない。通常投稿は daily_ai_YYYYMM、市場投稿は market_opinion_YYYYMM、プロフィールは profile_YYYYMM。サイト側の掲載後の更新告知を別投稿として増やさない。

X投稿の記録にサイトコミット、掲載先URL、反映確認日時を追加。サイトだけ失敗した場合はX投稿を繰り返さず、未反映理由を記録し報告する。リアルタイム同期とは呼ばず、確認済み投稿のアーカイブとして扱う。
