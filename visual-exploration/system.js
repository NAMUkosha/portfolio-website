(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const cards = $$('.c-card');

  /* ---- Toast & copy ----------------------------------------------------- */
  const toast = $('#c-toast');
  let toastTimer = 0;
  const notify = message => {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1500);
  };

  const copy = async text => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.append(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      return ok;
    }
  };

  /* ---- Sidebar counts ---------------------------------------------------- */
  const countFor = category => category === 'all' ? cards.length : cards.filter(card => card.dataset.cat === category).length;
  $$('[data-count]').forEach(el => { el.textContent = countFor(el.dataset.count); });

  /* ---- Filtering & search ------------------------------------------------ */
  const title = $('#c-title');
  const count = $('#c-count');
  const empty = $('#c-empty');
  const filters = $$('#c-filters button');
  const search = $('#c-search');
  const searchToggle = $('#c-search-toggle');
  const searchInput = $('#c-search-input');
  let activeCategory = 'all';
  let query = '';

  const categoryLabel = key => key === 'all' ? 'All components' : (filters.find(button => button.dataset.filter === key)?.querySelector('span')?.textContent || key);

  const render = () => {
    const needle = query.trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const haystack = `${card.dataset.name} ${card.dataset.cat} ${card.dataset.tokens || ''}`.toLowerCase();
      const matchesCategory = activeCategory === 'all' || card.dataset.cat === activeCategory;
      const matchesQuery = !needle || haystack.includes(needle);
      card.hidden = !(matchesCategory && matchesQuery);
      if (!card.hidden) visible += 1;
    });
    title.textContent = categoryLabel(activeCategory);
    count.textContent = `${visible} ${visible === 1 ? 'item' : 'items'}`;
    empty.hidden = visible > 0;
    filters.forEach(button => button.classList.toggle('is-active', button.dataset.filter === activeCategory));
  };

  filters.forEach(button => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.filter;
      render();
    });
  });

  const openSearch = () => {
    search.classList.add('is-open');
    searchToggle.setAttribute('aria-expanded', 'true');
    searchInput.focus();
  };

  const closeSearch = () => {
    search.classList.remove('is-open');
    searchToggle.setAttribute('aria-expanded', 'false');
    if (query) {
      query = '';
      searchInput.value = '';
      render();
    }
  };

  searchToggle.addEventListener('click', () => {
    if (search.classList.contains('is-open')) closeSearch();
    else openSearch();
  });

  searchInput.addEventListener('input', () => {
    query = searchInput.value;
    render();
  });

  searchInput.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeSearch();
      searchToggle.focus();
    }
  });

  addEventListener('keydown', event => {
    if (event.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
      event.preventDefault();
      openSearch();
    }
  });

  $('#c-clear').addEventListener('click', () => {
    query = '';
    searchInput.value = '';
    activeCategory = 'all';
    render();
  });

  /* ---- Navigation specimen ---------------------------------------------- */
  const nav = $('#c-nav');
  if (nav) {
    const selection = $('.ui-nav__selection', nav);
    const items = $$('.ui-nav__item', nav);
    const moveTo = item => {
      const navRect = nav.getBoundingClientRect();
      const rect = item.getBoundingClientRect();
      selection.style.width = `${rect.width}px`;
      selection.style.transform = `translateX(${rect.left - navRect.left - nav.clientLeft - selection.offsetLeft}px)`;
    };
    items.forEach(item => item.addEventListener('click', () => {
      items.forEach(other => other.removeAttribute('aria-current'));
      item.setAttribute('aria-current', 'page');
      moveTo(item);
    }));
    requestAnimationFrame(() => moveTo(items.find(item => item.hasAttribute('aria-current')) || items[0]));
    addEventListener('resize', () => moveTo(items.find(item => item.hasAttribute('aria-current')) || items[0]));
    document.fonts?.ready.then(() => moveTo(items.find(item => item.hasAttribute('aria-current')) || items[0]));
  }

  $$('.d-tab-demo').forEach(list=>{
    const tabs=$$('[role=tab]',list);
    const select=tab=>tabs.forEach(item=>{item.setAttribute('aria-selected',String(item===tab));item.tabIndex=item===tab?0:-1;});
    tabs.forEach(tab=>tab.addEventListener('click',()=>select(tab)));
    list.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const index=tabs.indexOf(document.activeElement);const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;select(tabs[next]);tabs[next].focus();});
  });

  /* ---- Motion demo ------------------------------------------------------- */
  const motion = $('#c-motion');
  const replay = $('#c-replay');
  if (motion && replay) {
    replay.addEventListener('click', () => {
      motion.classList.remove('is-replaying');
      void motion.offsetWidth;
      motion.classList.add('is-replaying');
      setTimeout(() => motion.classList.remove('is-replaying'), 1200);
    });
  }

  /* ---- Sheet ------------------------------------------------------------- */
  const sheet = $('#c-sheet');
  const sheetPreview = $('#c-sheet-preview');
  const sheetTitle = $('#c-sheet-title');
  const sheetDesc = $('#c-sheet-desc');
  const sheetCat = $('#c-sheet-cat');
  const sheetTokens = $('#c-sheet-tokens');
  const sheetTokenWrap = $('#c-sheet-token-wrap');
  const sheetCode = $('#c-sheet-code');
  const sheetCodeWrap = $('#c-sheet-code-wrap');
  const sheetUsed = $('#c-sheet-used');

  const openSheet = card => {
    const stage = $('.c-stage', card);
    const clone = stage.cloneNode(true);
    clone.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
    sheetPreview.replaceChildren(clone);
    sheetPreview.inert = true;

    sheetCat.textContent = categoryLabel(card.dataset.cat).replace('&amp;', '&');
    sheetTitle.textContent = card.dataset.name;
    sheetDesc.textContent = card.dataset.desc || '';

    const tokens = (card.dataset.tokens || '').split(/\s+/).filter(Boolean);
    sheetTokenWrap.hidden = tokens.length === 0;
    sheetTokens.replaceChildren(...tokens.map(token => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = token;
      button.title = `Copy ${token}`;
      button.addEventListener('click', async () => {
        if (await copy(token)) notify(`Copied ${token}`);
      });
      return button;
    }));

    const code = card.dataset.code || '';
    sheetCodeWrap.hidden = !code;
    sheetCode.textContent = code;

    sheetUsed.textContent = card.dataset.used ? `Used in ${card.dataset.used}` : '';
    sheetUsed.hidden = !card.dataset.used;

    if (typeof sheet.showModal === 'function') sheet.showModal();
    else sheet.setAttribute('open', '');
  };

  const closeSheet = () => {
    if (typeof sheet.close === 'function') sheet.close();
    else sheet.removeAttribute('open');
  };

  $('#c-grid').addEventListener('click', event => {
    const trigger = event.target.closest('.c-open');
    if (!trigger) return;
    const card = cards.find(item => item.dataset.id === trigger.dataset.open);
    if (card) openSheet(card);
  });

  $('#c-sheet-close').addEventListener('click', closeSheet);
  $('#c-copy-code').addEventListener('click', async () => {
    if (await copy(sheetCode.textContent)) notify('Code copied');
  });

  sheet.addEventListener('click', event => {
    if (event.target !== sheet) return;
    const rect = sheet.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeSheet();
  });

  /* ---- Password dialog --------------------------------------------------- */
  const dialog = $('#c-dialog');
  $('#c-dialog-open').addEventListener('click', () => dialog.showModal());
  $('#c-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) dialog.close();
  });
  $('#c-dialog-form').addEventListener('submit', event => {
    event.preventDefault();
    notify('Demo only — the real reader handles the password');
    dialog.close();
  });

  /* ---- Token list -------------------------------------------------------- */
  const tokenDialog = $('#c-token-dialog');
  const tokenList = $('#c-token-list');
  const tokenCounts = [$('#c-token-count'), $('#c-token-total')];
  let tokensRendered = false;

  const groupOf = name => {
    if (/^--ds-(paper|ink|muted|faint|line|accent|text|border|surface)/.test(name)) return 'Colour';
    if (/^--ds-(font|type|weight|leading|tracking)/.test(name)) return 'Type';
    if (/^--ds-space/.test(name)) return 'Space';
    if (/^--ds-(page|reading|copy|heading|home|section)/.test(name)) return 'Layout';
    if (/^--ds-radius/.test(name)) return 'Radius';
    if (/^--ds-(glass|shadow)/.test(name)) return 'Glass & elevation';
    if (/^--ds-(ease|dur)/.test(name)) return 'Motion';
    if (/^--ds-(control|access|card|icon|dialog|dark|light|chip|nav|credential|link|danger|badge|blur|underline|backdrop)/.test(name)) return 'Components';
    if (/^--ds-z-/.test(name)) return 'Depth';
    if (/^--ds-focus/.test(name)) return 'Focus';
    return 'Other';
  };
  const groupOrder = ['Colour', 'Type', 'Space', 'Layout', 'Radius', 'Glass & elevation', 'Motion', 'Components', 'Depth', 'Focus', 'Other'];
  let tokenEntries = [];

  const renderTokens = () => {
    if (tokensRendered) return;
    tokensRendered = true;
    const fragment = document.createDocumentFragment();
    let group = '';
    tokenEntries.forEach(([name, value]) => {
      const current = groupOf(name);
      if (current !== group) {
        group = current;
        const label = document.createElement('p');
        label.className = 'c-token-group';
        label.textContent = group;
        fragment.append(label);
      }
      const row = document.createElement('div');
      row.className = 'c-token-row';
      row.title = `Copy ${name}`;
      const code = document.createElement('code');
      code.textContent = name;
      const val = document.createElement('span');
      val.textContent = value;
      row.append(code, val);
      row.addEventListener('click', async () => {
        if (await copy(`${name}: ${value};`)) notify(`Copied ${name}`);
      });
      fragment.append(row);
    });
    tokenList.replaceChildren(fragment);
  };

  $$('#c-tokens-open,#c-tokens-mobile').forEach(trigger=>trigger.addEventListener('click', () => {
    renderTokens();
    tokenDialog.showModal();
  }));
  $('#c-token-close').addEventListener('click', () => tokenDialog.close());
  tokenDialog.addEventListener('click', event => {
    if (event.target !== tokenDialog) return;
    const rect = tokenDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) tokenDialog.close();
  });

  fetch('tokens.css')
    .then(response => response.text())
    .then(css => {
      const seen = new Map();
      [...css.matchAll(/(--ds-[a-z0-9-]+)\s*:\s*([^;]+);/g)].forEach(([, name, value]) => {
        if (!seen.has(name)) seen.set(name, value.replace(/\s+/g, ' ').trim());
      });
      if (tokenDialog.open) tokensRendered = false;
      tokenEntries = [...seen].sort((a, b) => {
        const group = groupOrder.indexOf(groupOf(a[0])) - groupOrder.indexOf(groupOf(b[0]));
        return group || a[0].localeCompare(b[0]);
      });
      tokenCounts.forEach(el => { if (el) el.textContent = tokenEntries.length; });
      if (tokenDialog.open) renderTokens();
    })
    .catch(() => {
      tokenCounts.forEach(el => { if (el) el.textContent = '182'; });
    });

  render();
})();
