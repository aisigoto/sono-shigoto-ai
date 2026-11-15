(() => {
  const filters = document.querySelector('.keiko-filters');
  if (!filters) return;
  filters.hidden = false;
  const buttons = [...filters.querySelectorAll('button')];
  const entries = [...document.querySelectorAll('.keiko-entry')];
  function select(value) {
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === value)));
    entries.forEach(entry => { entry.hidden = value !== 'all' && (value === 'investment' ? !['investment', 'market'].includes(entry.dataset.category) : entry.dataset.category !== value); });
  }
  filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (button) select(button.dataset.filter);
  });
  function revealAnchor() {
    const entry = entries.find(item => '#' + item.id === location.hash);
    if (entry && entry.hidden) { select('all'); entry.scrollIntoView(); }
  }
  window.addEventListener('hashchange', revealAnchor);
  revealAnchor();
})();
