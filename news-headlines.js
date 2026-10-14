(() => {
  const lists = document.querySelectorAll('[data-news-headlines]');
  if (!lists.length) return;
  fetch('ai-news.json').then(response => {
    if (!response.ok) throw new Error('News unavailable');
    return response.json();
  }).then(data => {
    if (!Array.isArray(data.items) || !data.items.length) return;
    const items = [...data.items].sort((a, b) => b.date.localeCompare(a.date));
    lists.forEach(list => {
      const fragment = document.createDocumentFragment();
      items.forEach(item => {
        if (!/^[a-z0-9-]+$/.test(item.id)) return;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = 'ai-news.html#' + item.id;
        const time = document.createElement('time');
        time.dateTime = item.date;
        time.textContent = item.date;
        const title = document.createElement('span');
        title.textContent = item.title;
        a.append(time, title);
        li.append(a);
        fragment.append(li);
      });
      if (fragment.childElementCount) list.replaceChildren(fragment);
    });
  }).catch(() => { /* Keep the usable, dated fallback headlines. */ });
})();
