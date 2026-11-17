/* BREW LAB — демо Telegram Mini App кав'ярні. Чистий JS, без залежностей. */
(() => {
  'use strict';

  /* ================= Telegram-адаптер ================= */
  // Усередині Telegram використовуємо рідні MainButton / BackButton / haptic.
  // У звичайному браузері все працює через запасну кнопку внизу.
  const tg = window.Telegram && window.Telegram.WebApp;
  const inTg = !!(tg && tg.initData);

  if (tg) {
    try { tg.ready(); tg.expand(); tg.disableVerticalSwipes && tg.disableVerticalSwipes(); } catch { /* старі клієнти */ }
  }
  document.body.classList.toggle('in-tg', inTg);

  // Повноекранний режим: Telegram малює свої елементи (статус-бар, «Закрити», «⋯») поверх сторінки,
  // тому верх контенту треба опустити на safeAreaInset + contentSafeAreaInset.
  const FULLSCREEN_FALLBACK_TOP = 96; // якщо клієнт не передав відступи
  function applyInsets() {
    if (!inTg) return;
    let top = 0;
    try {
      top = ((tg.safeAreaInset && tg.safeAreaInset.top) || 0) + ((tg.contentSafeAreaInset && tg.contentSafeAreaInset.top) || 0);
      if (tg.isFullscreen) top = Math.max(top, FULLSCREEN_FALLBACK_TOP);
    } catch { top = 0; }
    document.documentElement.style.setProperty('--top-pad', top + 'px');
    let cover = document.getElementById('topCover');
    if (top > 0 && !cover) { cover = document.createElement('div'); cover.id = 'topCover'; cover.className = 'top-cover'; document.body.appendChild(cover); }
    if (cover) cover.hidden = top === 0;
  }
  if (inTg) {
    applyInsets();
    ['safeAreaChanged', 'contentSafeAreaChanged', 'fullscreenChanged', 'viewportChanged'].forEach((ev) => tg.onEvent(ev, applyInsets));
    setTimeout(applyInsets, 300); // значення від клієнта можуть прийти з затримкою
    setTimeout(applyInsets, 1200);
  }

  const haptic = {
    tap() { try { tg.HapticFeedback.impactOccurred('light'); } catch { /* немає API */ } },
    ok() { try { tg.HapticFeedback.notificationOccurred('success'); } catch { /* немає API */ } },
    warn() { try { tg.HapticFeedback.notificationOccurred('warning'); } catch { /* немає API */ } },
  };

  const mainBar = document.getElementById('mainBar');
  const mainBtn = document.getElementById('mainBtn');
  let mainHandler = null;

  const Main = {
    show(text, handler, enabled = true) {
      if (inTg) {
        const b = tg.MainButton;
        if (mainHandler) b.offClick(mainHandler);
        mainHandler = handler;
        b.setText(text);
        b.onClick(handler);
        enabled ? b.enable() : b.disable();
        b.show();
      } else {
        mainHandler = handler;
        mainBtn.textContent = text;
        mainBtn.disabled = !enabled;
        mainBar.hidden = false;
      }
    },
    hide() {
      if (inTg) { if (mainHandler) tg.MainButton.offClick(mainHandler); tg.MainButton.hide(); }
      else mainBar.hidden = true;
      mainHandler = null;
    },
  };
  mainBtn.addEventListener('click', () => { if (!inTg && mainHandler) mainHandler(); });

  const Back = {
    handler: null,
    show(handler) {
      if (!inTg) return;
      if (this.handler) tg.BackButton.offClick(this.handler);
      this.handler = handler;
      tg.BackButton.onClick(handler);
      tg.BackButton.show();
    },
    hide() {
      if (!inTg) return;
      if (this.handler) tg.BackButton.offClick(this.handler);
      this.handler = null;
      tg.BackButton.hide();
    },
  };

  /* ================= Дані ================= */
  const img = (id, w, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=75`;

  const CATS = [
    { id: 'coffee', title: 'Кава', emoji: '☕' },
    { id: 'cold', title: 'Холодне', emoji: '🧊' },
    { id: 'tea', title: 'Чай і какао', emoji: '🍵' },
    { id: 'sweet', title: 'Десерти', emoji: '🥐' },
  ];

  const SIZES = {
    cup: [{ id: 's', label: 'S', vol: '250 мл', d: -15 }, { id: 'm', label: 'M', vol: '350 мл', d: 0 }, { id: 'l', label: 'L', vol: '450 мл', d: 20 }],
    espresso: [{ id: 's', label: 'Single', vol: '30 мл', d: 0 }, { id: 'd', label: 'Double', vol: '60 мл', d: 25 }],
    none: [],
  };
  const ADDONS = {
    milk: { name: 'Рослинне молоко', hint: 'вівсяне або мигдальне', price: 25 },
    syrup: { name: 'Сироп', hint: 'ваніль, карамель, фундук', price: 15 },
    shot: { name: 'Додатковий шот', hint: '+30 мл еспресо', price: 30 },
    warm: { name: 'Підігріти', hint: 'за 30 секунд', price: 0 },
  };

  // Бренд, позиції та ціни вигадані. Фото — Unsplash (вільна ліцензія).
  const ITEMS = [
    { id: 'e1', cat: 'coffee', name: 'Еспресо', desc: 'Класичний шот із насиченим смаком і щільною кремою.', price: 55, size: 'espresso', add: [], photo: '1559496417-e7f25cb247f3' },
    { id: 'e2', cat: 'coffee', name: 'Американо', desc: 'Еспресо з гарячою водою. Чистий, легкий смак без зайвої гіркоти.', price: 70, size: 'cup', add: ['shot', 'syrup'], photo: '1771736385651-c071580a9d78' },
    { id: 'e3', cat: 'coffee', name: 'Капучино', desc: 'Еспресо, ніжна молочна піна та оксамитова текстура.', price: 95, size: 'cup', add: ['milk', 'syrup', 'shot'], photo: '1760306081298-93e10f2be897', badge: 'Хіт' },
    { id: 'e4', cat: 'coffee', name: 'Лате', desc: 'Багато молока, м’який вершковий смак і візерунок зверху.', price: 105, size: 'cup', add: ['milk', 'syrup', 'shot'], photo: '1758205080201-b1abf57e96af' },
    { id: 'e5', cat: 'coffee', name: 'Флет вайт', desc: 'Подвійний еспресо з тонким шаром мікропіни. Для любителів міцної кави.', price: 110, size: 'cup', add: ['milk', 'shot'], photo: '1620052087057-bfd8235f5874' },
    { id: 'e6', cat: 'coffee', name: 'Раф ванільний', desc: 'Еспресо, вершки та ванільний цукор. Густий і солодкий.', price: 125, size: 'cup', add: ['milk', 'shot'], photo: '1541167760496-1628856ab772', badge: 'Новинка' },
    { id: 'c1', cat: 'cold', name: 'Колд брю', desc: 'Кава холодної екстракції 14 годин. Гладкий смак із нотами шоколаду.', price: 110, size: 'cup', add: ['syrup'], photo: '1770299258214-2f2f44f4c336' },
    { id: 'c2', cat: 'cold', name: 'Айс-лате карамель', desc: 'Холодне молоко, лід, еспресо та солона карамель.', price: 125, size: 'cup', add: ['milk', 'shot'], photo: '1517701550927-30cf4ba1dba5', badge: 'Хіт' },
    { id: 'c3', cat: 'cold', name: 'Матча-лате з льодом', desc: 'Японська матча, холодне молоко та лід. Свіжий трав’яний смак.', price: 135, size: 'cup', add: ['milk'], photo: '1775846933630-3c1531299e5a' },
    { id: 'c4', cat: 'cold', name: 'Лимонад м’ята-лайм', desc: 'Домашній лимонад із лаймом, свіжою м’ятою та содовою.', price: 95, size: 'cup', add: [], photo: '1575596510825-f748919a2bf7' },
    { id: 't1', cat: 'tea', name: 'Матча лате', desc: 'Гаряча матча на молоці. Спокійна бадьорість без кави.', price: 130, size: 'cup', add: ['milk', 'syrup'], photo: '1766426910014-63a302fa137e' },
    { id: 't2', cat: 'tea', name: 'Гарячий шоколад', desc: 'Густий бельгійський шоколад на молоці з маршмелоу.', price: 95, size: 'cup', add: ['milk', 'syrup'], photo: '1637572815755-c4b80092dce1' },
    { id: 't3', cat: 'tea', name: 'Чай трав’яний', desc: 'Збір із м’яти, ромашки та липи. Заварюємо при вас.', price: 65, size: 'cup', add: ['syrup'], photo: '1788132604222-561f96ff70bc' },
    { id: 'd1', cat: 'sweet', name: 'Круасан масляний', desc: 'Хрусткий шарами, вершкове масло, випікаємо щоранку.', price: 75, size: 'none', add: ['warm'], photo: '1691480162735-9b91238080f6' },
    { id: 'd2', cat: 'sweet', name: 'Чізкейк ягідний', desc: 'Ніжний сирний крем на пісочній основі та лісові ягоди.', price: 135, size: 'none', add: [], photo: '1779282159217-226d9e831c03', badge: 'Хіт' },
    { id: 'd3', cat: 'sweet', name: 'Чізкейк Нью-Йорк', desc: 'Класичний щільний чізкейк і ягідний соус.', price: 130, size: 'none', add: [], photo: '1524351199678-941a58a3df50' },
    { id: 'd4', cat: 'sweet', name: 'Брауні', desc: 'Вологий шоколадний брауні з хрусткою скоринкою.', price: 90, size: 'none', add: ['warm'], photo: '1777647364657-2319b02095de' },
    { id: 'd5', cat: 'sweet', name: 'Печиво з шоколадом', desc: 'М’яке всередині, хрусткі краї, шматочки шоколаду.', price: 45, size: 'none', add: [], photo: '1767339300211-00be83435c63' },
  ];
  const byId = (id) => ITEMS.find((i) => i.id === id);
  const isDrink = (it) => it.cat !== 'sweet';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = (n) => new Intl.NumberFormat('uk-UA').format(Math.round(n)) + ' ₴';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem('bl:' + k)); return v ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem('bl:' + k, JSON.stringify(v)); } catch { /* приватний режим */ } },
  };

  function toast(msg) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    $('#toasts').appendChild(el);
    setTimeout(() => { el.classList.add('is-out'); setTimeout(() => el.remove(), 300); }, 2200);
  }

  /* ================= Тема та привітання ================= */
  const root = document.documentElement;
  const metaTheme = $('meta[name="theme-color"]');
  function applyTheme() {
    const scheme = (tg && tg.colorScheme) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    root.dataset.theme = scheme;
    const bg = getComputedStyle(root).getPropertyValue('--bg').trim();
    if (metaTheme) metaTheme.content = bg;
    if (inTg) { try { tg.setHeaderColor(bg); tg.setBackgroundColor(bg); } catch { /* старі клієнти */ } }
  }
  applyTheme();
  if (inTg) tg.onEvent('themeChanged', applyTheme);
  else matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

  const user = inTg && tg.initDataUnsafe && tg.initDataUnsafe.user;
  if (user && user.first_name) {
    $('#hello').textContent = `Привіт, ${user.first_name}!`;
    $('#avatar').textContent = user.first_name.trim()[0].toUpperCase();
  }

  /* ================= Статус «відчинено» (Київ) ================= */
  const OPEN = 8 * 60;
  const CLOSE = 21 * 60;
  function kyivMinutes() {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Kyiv', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    return +p.hour * 60 + +p.minute;
  }
  function renderOpen() {
    const m = kyivMinutes();
    const open = m >= OPEN && m < CLOSE;
    $('#dot').classList.toggle('is-open', open);
    $('#openText').textContent = open ? (CLOSE - m <= 60 ? 'Відчинено · зачиняємось о 21:00' : 'Відчинено · до 21:00') : (m < OPEN ? 'Зачинено · відчинимось о 08:00' : 'Зачинено · відчинимось завтра о 08:00');
  }
  renderOpen();
  setInterval(renderOpen, 60000);

  /* ================= Лояльність ================= */
  let drinksTotal = store.get('drinks', 0);
  const cycle = () => drinksTotal % 7;
  const giftReady = () => cycle() === 6;

  function renderLoyalty(animateFrom) {
    const c = cycle();
    $('#stamps').innerHTML = Array.from({ length: 7 }, (_, i) => {
      if (i === 6) return `<li class="is-gift ${giftReady() ? 'is-ready' : ''}">🎁</li>`;
      return `<li class="${i < c ? 'is-full' : ''}">${i < c ? '☕' : ''}</li>`;
    }).join('');
    const left = 6 - c;
    $('#loyaltyHint').textContent = giftReady()
      ? 'Наступна кава — у подарунок!'
      : `До подарунка ще ${left} ${left === 1 ? 'кава' : left < 5 ? 'кави' : 'кав'}`;
    if (animateFrom !== undefined) $$('#stamps li').forEach((li, i) => { if (i >= animateFrom && li.classList.contains('is-full')) li.animate([{ transform: 'scale(.3)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1.04)' }], { duration: 600, easing: 'ease-out' }); });
  }

  /* ================= Меню ================= */
  let cart = store.get('cart', []).filter((l) => byId(l.id));
  const priceFrom = (it) => it.price + Math.min(0, ...SIZES[it.size].map((s) => s.d), 0);
  const unitPrice = (l) => {
    const it = byId(l.id);
    const sz = SIZES[it.size].find((s) => s.id === l.size);
    return it.price + (sz ? sz.d : 0) + l.add.reduce((s, a) => s + ADDONS[a].price, 0);
  };
  const inCartQty = (id) => cart.filter((l) => l.id === id).reduce((s, l) => s + l.qty, 0);

  function renderMenu() {
    $('#cats').innerHTML = CATS.map((c, i) => `<button class="cat ${i === 0 ? 'is-on' : ''}" data-cat="${c.id}">${c.emoji} ${c.title}</button>`).join('');
    $('#menu').innerHTML = CATS.map((c) => {
      const list = ITEMS.filter((i) => i.cat === c.id);
      return `<section class="sec" id="sec-${c.id}" data-sec="${c.id}">
        <h2>${c.emoji} ${c.title} <small>${list.length}</small></h2>
        <div class="items">${list.map((it, i) => itemHtml(it, i)).join('')}</div>
      </section>`;
    }).join('');
  }
  function itemHtml(it, i) {
    const q = inCartQty(it.id);
    const sized = SIZES[it.size].length > 1 && it.size === 'cup';
    return `<button class="item" style="--i:${i}" data-item="${it.id}" aria-label="${esc(it.name)}, ${fmt(it.price)}">
      <span class="item__img"><img src="${img(it.photo, 240, 240)}" alt="${esc(it.name)}" loading="lazy" width="120" height="120">
        ${it.badge ? `<span class="badge">${it.badge}</span>` : ''}${q ? `<span class="in-cart">${q}</span>` : ''}</span>
      <span class="item__body">
        <span><h3>${esc(it.name)}</h3><p>${esc(it.desc)}</p></span>
        <span class="item__foot"><span class="price">${sized ? '<small>від</small>' : ''}${fmt(sized ? priceFrom(it) : it.price)}</span><span class="add" aria-hidden="true">+</span></span>
      </span>
    </button>`;
  }
  function refreshBadges() {
    $$('.item').forEach((el) => {
      const q = inCartQty(el.dataset.item);
      const box = $('.item__img', el);
      let b = $('.in-cart', box);
      if (q && !b) { b = document.createElement('span'); b.className = 'in-cart'; box.appendChild(b); }
      if (b) { if (q) b.textContent = q; else b.remove(); }
    });
  }

  $('#cats').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    haptic.tap();
    $('#sec-' + b.dataset.cat).scrollIntoView({ behavior: 'smooth' });
  });
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const id = en.target.dataset.sec;
      $$('.cat').forEach((c) => {
        const on = c.dataset.cat === id;
        c.classList.toggle('is-on', on);
        if (on) c.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
      });
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  $('#menu').addEventListener('click', (e) => {
    const b = e.target.closest('[data-item]');
    if (b) openItem(b.dataset.item);
  });

  /* ================= Стан інтерфейсу ================= */
  const itemSheet = $('#itemSheet');
  const cartSheet = $('#cartSheet');
  const scrim = $('#scrim');
  let ui = 'menu'; // menu | item | cart | done

  function cartCount() { return cart.reduce((s, l) => s + l.qty, 0); }
  function gift() {
    if (!giftReady()) return { amount: 0, name: '' };
    const drinks = cart.filter((l) => isDrink(byId(l.id)));
    if (!drinks.length) return { amount: 0, name: '' };
    const cheapest = drinks.reduce((a, b) => (unitPrice(a) <= unitPrice(b) ? a : b));
    return { amount: unitPrice(cheapest), name: byId(cheapest.id).name };
  }
  function totals() {
    const subtotal = cart.reduce((s, l) => s + unitPrice(l) * l.qty, 0);
    const g = gift();
    return { subtotal, gift: g, total: subtotal - g.amount };
  }

  function setUi(next) {
    ui = next;
    itemSheet.classList.toggle('is-open', ui === 'item');
    cartSheet.classList.toggle('is-open', ui === 'cart' || ui === 'done');
    itemSheet.setAttribute('aria-hidden', String(ui !== 'item'));
    cartSheet.setAttribute('aria-hidden', String(ui !== 'cart' && ui !== 'done'));
    const sheetOpen = ui !== 'menu';
    scrim.hidden = !sheetOpen;
    document.body.classList.toggle('is-locked', sheetOpen);
    sheetOpen ? Back.show(closeTop) : Back.hide();
    syncMain();
  }
  function closeTop() { if (ui === 'done') finishDone(); else setUi('menu'); }

  function syncMain() {
    if (ui === 'item') return Main.show(`Додати в кошик · ${fmt(itemDraftPrice())}`, addDraftToCart);
    if (ui === 'cart') { if (!cart.length) return Main.hide(); return Main.show(`Замовити · ${fmt(totals().total)}`, placeOrder, !!pickup); }
    if (ui === 'done') return Main.show('Готово', finishDone);
    if (cart.length) return Main.show(`Кошик · ${cartCount()} · ${fmt(totals().total)}`, openCart);
    Main.hide();
  }
  scrim.addEventListener('click', closeTop);
  $$('[data-close]').forEach((b) => b.addEventListener('click', closeTop));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && ui !== 'menu') closeTop(); });

  /* ================= Шторка позиції ================= */
  let draft = null;
  const draftUnit = () => unitPrice({ id: draft.id, size: draft.size, add: [...draft.add] });
  const itemDraftPrice = () => draftUnit() * draft.qty;

  function openItem(id) {
    const it = byId(id);
    const sizes = SIZES[it.size];
    draft = { id, size: sizes.length ? (it.size === 'cup' ? 'm' : sizes[0].id) : null, add: new Set(), qty: 1 };
    haptic.tap();
    $('#itemBody').innerHTML = `
      <div class="hero"><img src="${img(it.photo, 900, 620)}" alt="${esc(it.name)}"></div>
      <div class="pad">
        <div><h2>${esc(it.name)}</h2><p class="lead">${esc(it.desc)}</p></div>
        ${sizes.length ? `<div class="group"><h4>Розмір</h4><div class="seg" id="seg">${sizes.map((s) => `<button type="button" data-size="${s.id}" class="${s.id === draft.size ? 'is-on' : ''}">${s.label}<small>${s.vol}${s.d ? ` · ${s.d > 0 ? '+' : '−'}${Math.abs(s.d)} ₴` : ''}</small></button>`).join('')}</div></div>` : ''}
        ${it.add.length ? `<div class="group"><h4>Добавки</h4>${it.add.map((a) => `<label class="opt"><span><input type="checkbox" data-add="${a}"><span><b>${ADDONS[a].name}</b><br><em>${ADDONS[a].hint}</em></span></span><span>${ADDONS[a].price ? '+' + ADDONS[a].price + ' ₴' : 'безкоштовно'}</span></label>`).join('')}</div>` : ''}
        <div class="rowbetween"><b>Кількість</b><div class="qty"><button type="button" data-q="-1" aria-label="Менше">−</button><span id="dq">1</span><button type="button" data-q="1" aria-label="Більше">+</button></div></div>
      </div>`;
    $('#itemBody').scrollTop = 0;
    setUi('item');
  }
  $('#itemBody').addEventListener('click', (e) => {
    const s = e.target.closest('[data-size]');
    if (s) { draft.size = s.dataset.size; $$('[data-size]').forEach((b) => b.classList.toggle('is-on', b === s)); haptic.tap(); return syncMain(); }
    const q = e.target.closest('[data-q]');
    if (q) { draft.qty = Math.min(9, Math.max(1, draft.qty + +q.dataset.q)); $('#dq').textContent = draft.qty; haptic.tap(); syncMain(); }
  });
  $('#itemBody').addEventListener('change', (e) => {
    const a = e.target.closest('[data-add]');
    if (!a) return;
    a.checked ? draft.add.add(a.dataset.add) : draft.add.delete(a.dataset.add);
    haptic.tap();
    syncMain();
  });

  function addDraftToCart() {
    const add = [...draft.add].sort();
    const key = `${draft.id}|${draft.size}|${add.join(',')}`;
    const line = cart.find((l) => l.key === key);
    if (line) line.qty = Math.min(9, line.qty + draft.qty); else cart.push({ key, id: draft.id, size: draft.size, add, qty: draft.qty });
    saveCart();
    haptic.ok();
    toast(`${byId(draft.id).name} додано в кошик`);
    setUi('menu');
  }
  function saveCart() { store.set('cart', cart); refreshBadges(); }

  /* ================= Кошик ================= */
  let pickup = null;
  let comment = '';

  function pickupOptions() {
    const m = kyivMinutes();
    const out = [];
    const fmtT = (t, pre) => `${pre}${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
    if (m >= OPEN && m < CLOSE - 20) {
      out.push({ id: 'asap', label: 'Якнайшвидше · ~10 хв' });
      for (let t = Math.ceil((m + 20) / 15) * 15, n = 0; t <= CLOSE - 15 && n < 4; t += 15, n++) out.push({ id: 't' + t, label: fmtT(t, '') });
    } else {
      const pre = m < OPEN ? 'сьогодні ' : 'завтра ';
      for (let t = OPEN + 15, n = 0; n < 4; t += 30, n++) out.push({ id: 't' + t, label: fmtT(t, pre) });
    }
    return out;
  }

  function renderCart() {
    const body = $('#cartBody');
    if (!cart.length) {
      body.innerHTML = `<div class="empty"><div class="emoji">☕</div><h3>Кошик порожній</h3><p>Оберіть каву чи десерт у меню — і вони з’являться тут.</p></div><button class="sheetbtn sheetbtn--ghost" data-back-menu>До меню</button>`;
      return;
    }
    const opts = pickupOptions();
    if (!pickup || !opts.some((o) => o.id === pickup)) pickup = opts[0].id;
    const t = totals();
    body.innerHTML = `
      <div class="cart-head"><h2>Ваше замовлення</h2></div>
      <div class="lines">${cart.map((l) => {
        const it = byId(l.id);
        const sz = SIZES[it.size].find((s) => s.id === l.size);
        const extra = [sz ? sz.label : '', ...l.add.map((a) => ADDONS[a].name.toLowerCase())].filter(Boolean).join(' · ');
        return `<div class="line" data-key="${esc(l.key)}">
          <img src="${img(it.photo, 120, 120)}" alt="">
          <div><h4>${esc(it.name)}</h4><small>${esc(extra || 'без добавок')}</small>
            <div class="qty"><button data-lq="-1" aria-label="Менше">−</button><span>${l.qty}</span><button data-lq="1" aria-label="Більше">+</button></div></div>
          <b>${fmt(unitPrice(l) * l.qty)}</b>
        </div>`;
      }).join('')}</div>
      ${t.gift.amount ? `<div class="gift">🎁 Подарункова кава: ${esc(t.gift.name)} безкоштовно (−${fmt(t.gift.amount)})</div>` : ''}
      <div class="cart-block"><h4>Коли забрати · Хрещатик, 20</h4>
        <div class="times">${opts.map((o) => `<button class="time ${o.id === pickup ? 'is-on' : ''}" data-time="${o.id}">${o.label}</button>`).join('')}</div></div>
      <div class="cart-block"><h4>Коментар для баристи</h4><textarea id="cmt" rows="2" placeholder="Наприклад: без цукру">${esc(comment)}</textarea></div>
      <div class="sum">
        <div><span>Позицій</span><span>${cartCount()}</span></div>
        <div><span>Сума</span><span>${fmt(t.subtotal)}</span></div>
        ${t.gift.amount ? `<div><span>Подарунок</span><span>−${fmt(t.gift.amount)}</span></div>` : ''}
        <div class="total"><span>До сплати на місці</span><b>${fmt(t.total)}</b></div>
      </div>`;
  }

  function openCart() {
    renderCart();
    $('#cartBody').scrollTop = 0;
    haptic.tap();
    setUi('cart');
  }

  $('#cartBody').addEventListener('click', (e) => {
    if (e.target.closest('[data-back-menu]')) return setUi('menu');
    const tm = e.target.closest('[data-time]');
    if (tm) { pickup = tm.dataset.time; $$('.time').forEach((b) => b.classList.toggle('is-on', b === tm)); haptic.tap(); return syncMain(); }
    const lq = e.target.closest('[data-lq]');
    if (lq) {
      const key = lq.closest('.line').dataset.key;
      const l = cart.find((x) => x.key === key);
      l.qty += +lq.dataset.lq;
      cart = cart.filter((x) => x.qty > 0);
      if (l.qty > 9) l.qty = 9;
      saveCart();
      haptic.tap();
      if (!cart.length) setUi('cart');
      renderCart();
      syncMain();
    }
  });
  $('#cartBody').addEventListener('input', (e) => { if (e.target.id === 'cmt') comment = e.target.value; });

  /* ================= Оформлення ================= */
  let timers = [];
  function placeOrder() {
    if (!cart.length || !pickup) { haptic.warn(); return toast('Оберіть час, щоб замовити'); }
    const t = totals();
    const drinks = cart.filter((l) => isDrink(byId(l.id))).reduce((s, l) => s + l.qty, 0);
    const before = cycle();
    const num = 'BL-' + String(Math.floor(100 + Math.random() * 900));
    const when = pickupOptions().find((o) => o.id === pickup) || { label: '' };
    const lines = cart.map((l) => `${byId(l.id).name} ×${l.qty}`).join(', ');

    drinksTotal += drinks;
    store.set('drinks', drinksTotal);
    cart = [];
    store.set('cart', cart);
    refreshBadges();
    renderLoyalty(before);
    haptic.ok();

    $('#cartBody').innerHTML = `
      <div class="done">
        <div class="tick">✓</div>
        <h2>Замовлення прийнято!</h2>
        <span class="num">${num}</span>
        <p>${esc(lines)}<br>Забрати: ${esc(when.label)} · Хрещатик, 20<br>До сплати на місці: <b>${fmt(t.total)}</b></p>
        ${drinks ? `<div class="stamp-add">☕ +${drinks} ${drinks === 1 ? 'штамп' : drinks < 5 ? 'штампи' : 'штампів'} на картці лояльності</div>` : ''}
        <ol class="track" id="track">
          <li class="is-done">Замовлення прийнято</li>
          <li class="is-now">Готуємо</li>
          <li>Готово, забирайте ☕</li>
        </ol>
        <p style="font-size:.78rem">Демо-версія: замовлення нікуди не надсилається.</p>
      </div>`;
    comment = '';
    setUi('done');

    // Демо-імітація статусу: прийнято → готуємо → готово
    timers.forEach(clearTimeout);
    timers = [
      setTimeout(() => stepTrack(2), 4000),
      setTimeout(() => stepTrack(3), 8000),
    ];
  }
  function stepTrack(n) {
    const items = $$('#track li');
    if (!items.length) return;
    items.forEach((li, i) => { li.classList.toggle('is-done', i < n); li.classList.toggle('is-now', i === n); });
    if (n >= 3) { haptic.ok(); toast('Замовлення готове! Забирайте ☕'); }
  }
  function finishDone() {
    timers.forEach(clearTimeout);
    setUi('menu');
    $('#menu').scrollIntoView({ behavior: 'smooth' });
  }

  /* ================= Старт ================= */
  renderMenu();
  $$('.sec').forEach((s) => spy.observe(s));
  renderLoyalty();
  setUi('menu');
})();
