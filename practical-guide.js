(() => {
  'use strict';
  const event = (name, params) => {
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  };
  const announceCopy = async (button, text, resource) => {
    const previous = button.textContent;
    button.disabled = true;
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = 'コピーしました';
      event('guide_copy', {resource_id: resource});
    } catch {
      button.textContent = '本文を選択してコピーしてください';
    }
    window.setTimeout(() => { button.disabled = false; button.textContent = previous; }, 2500);
  };
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', () => {
      const content = document.getElementById(button.dataset.copy);
      if (content) announceCopy(button, content.textContent, button.dataset.copy);
    });
  });
  document.querySelectorAll('[data-resource]').forEach(link => {
    link.addEventListener('click', () => event('guide_download', {resource_id: link.dataset.resource}));
  });
  document.querySelectorAll('[data-share]').forEach(button => {
    button.addEventListener('click', () => announceCopy(button, 'https://sono-shigoto-ai.com/ai-time-savings.html', 'calculator_url'));
  });
  const form = document.getElementById('savings-form');
  const result = document.getElementById('savings-result');
  if (!form || !result) return;
  const fmt = (value, digits = 1) => new Intl.NumberFormat('ja-JP', {maximumFractionDigits:digits}).format(value);
  function calculate(track = false) {
    if (!form.checkValidity()) { result.textContent = '各項目に範囲内の0以上の数値を入力してください。'; result.classList.remove('is-negative'); return; }
    const values = Object.fromEntries(new FormData(form));
    const {before,after,review,count,setup,hourly,monthly} = Object.fromEntries(Object.entries(values).map(([key,value]) => [key,Number(value)]));
    if (![before,after,review,count,setup,hourly,monthly].every(Number.isFinite)) return;
    const minutes = before - after - review;
    const recurring = minutes * count / 60;
    const firstMonth = recurring - setup;
    const cost = recurring * hourly - monthly;
    const firstCost = firstMonth * hourly - monthly;
    const warning = recurring < 0 ? '確認・修正を含めると、従来より時間が増えます。対象業務や指示文を見直しましょう。' : firstMonth < 0 ? '初月は準備時間が短縮分を上回ります。翌月以降の時間と品質も合わせて判断してください。' : count === 0 ? '月の件数が0なので、継続的な時短は発生しません。' : '品質を保てるかを実際の仕事で確認してください。時間の短縮と現金の増加は別です。';
    result.classList.toggle('is-negative', recurring < 0 || firstMonth < 0);
    // All interpolation comes from validated numbers or fixed strings.
    result.innerHTML = `<dl><div><dt>1件の短縮時間</dt><dd>${fmt(minutes)}分</dd></div><div><dt>翌月以降の短縮時間／月</dt><dd>${fmt(recurring)}時間</dd></div><div><dt>初月の短縮時間</dt><dd>${fmt(firstMonth)}時間</dd></div><div><dt>翌月以降の費用差の目安／月</dt><dd>${fmt(cost,0)}円</dd></div><div><dt>初月の費用差の目安</dt><dd>${fmt(firstCost,0)}円</dd></div></dl><p>${warning}</p><p>マイナスの時間は作業増、マイナスの費用差は評価額より費用が多いことを示します。試算であり、削減や収益を保証しません。</p>`;
    if (track) event('savings_calculate', {tool_id:'ai_time_savings'});
  }
  form.addEventListener('submit', e => { e.preventDefault(); calculate(true); });
  form.addEventListener('reset', () => window.setTimeout(() => calculate(), 0));
  form.addEventListener('input', () => calculate());
  calculate();
})();
