/* NORTH SOLE — демо-магазин кросівок. Чистий JS, без залежностей. */
(() => {
  'use strict';

  /* ================= Дані ================= */
  const img = (id, w, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=75`;
  const SIZES = [38, 39, 40, 41, 42, 43, 44, 45, 46];
  const FREE_FROM = 3000;
  const DELIVERY = 80;
  const PROMOS = { NORTH10: 0.1 };

  // Бренди й моделі вигадані. Фото — Unsplash (вільна ліцензія).
  const PRODUCTS = [
    { id: 'p1', name: 'Aero Lime Runner', brand: 'AERO', price: 3290, tag: 'new', pop: 98, photo: '1606107557195-0e29a4b5b4aa', type: 'Бігові', color: 'Лайм', desc: 'Легкі бігові кросівки з дихаючим верхом і пружною піною. Яскравий лайм помітний навіть у сутінках.' },
    { id: 'p2', name: 'Pastel Drift Low', brand: 'VOLTA', price: 3690, tag: 'new', pop: 90, photo: '1595950653106-6c9ebd614d3a', type: 'Лайфстайл', color: 'Пастель', desc: 'Низькі кросівки в ніжній пастельній гамі. Шкіряний верх і м’яка устілка для щоденних прогулянок.' },
    { id: 'p3', name: 'Crimson Court Low', brand: 'KRAFT', price: 2790, old: 3490, pop: 86, photo: '1656944227421-416b1d2186c9', type: 'Скейт', color: 'Червоний', desc: 'Скейтерський силует із підсиленим носком і товстим язиком. Витримує будь-який асфальт.' },
    { id: 'p4', name: 'Volt Red Racer', brand: 'AERO', price: 3490, pop: 80, photo: '1542291026-7eec264c27ff', type: 'Бігові', color: 'Червоний', desc: 'Швидкі кросівки для міських пробіжок. Сітчастий верх, стабільна п’ята, помітний червоний колір.' },
    { id: 'p5', name: 'Burgundy Skate Pro', brand: 'KRAFT', price: 2490, pop: 77, photo: '1525966222134-fcfa99b8ae77', type: 'Скейт', color: 'Бордовий', desc: 'Класична вулканізована підошва та замшеві вставки. Глибокий бордовий колір, що пасує до всього.' },
    { id: 'p6', name: 'Cloud White Classic', brand: 'NORTH SOLE', price: 2990, pop: 95, photo: '1608231387042-66d1773070a5', type: 'Класика', color: 'Білий', desc: 'Мінімалістична біла класика з натуральної шкіри. Універсальна пара на всі випадки.' },
    { id: 'p7', name: 'Court Hi-Low White', brand: 'VOLTA', price: 3190, pop: 83, photo: '1600269452121-4f2416e55c28', type: 'Лайфстайл', color: 'Білий', desc: 'Повсякденні кросівки на товстій підошві. Чисті лінії й акуратна прошивка.' },
    { id: 'p8', name: 'Sunset Max', brand: 'AERO', price: 4290, old: 5290, pop: 92, photo: '1600185365483-26d7a4cc7519', type: 'Лайфстайл', color: 'Білий/Помаранч', desc: 'Об’ємна амортизація та помаранчеві акценти. Комфорт на весь день і яскравий вигляд.' },
    { id: 'p9', name: 'Sandstone Low', brand: 'NORTH SOLE', price: 3390, tag: 'new', pop: 74, photo: '1603808033192-082d6919d3e1', type: 'Класика', color: 'Пісочний', desc: 'Пісочний нубук і біла підошва. Стримана пара для міського гардероба.' },
    { id: 'p10', name: 'Teal 95 Runner', brand: 'VOLTA', price: 4590, pop: 88, photo: '1550399865-ec7d23b18e8e', type: 'Бігові', color: 'Темно-бірюзовий', desc: 'Ретро-силует із помітною повітряною вставкою. Глибокий бірюзовий із білим шнурком.' },
    { id: 'p11', name: 'Midnight Force', brand: 'KRAFT', price: 3890, old: 4590, pop: 85, photo: '1543508282-6319a3e2621f', type: 'Лайфстайл', color: 'Чорний', desc: 'Чорні шкіряні кросівки з контрастним логотипом. Щільна підошва та стійкий до подряпин верх.' },
    { id: 'p12', name: 'High Top Ghost', brand: 'NORTH SOLE', price: 4990, pop: 70, photo: '1512374382149-233c42b6a83b', type: 'High-top', color: 'Білий', desc: 'Високі кросівки з фіксацією щиколотки. Білий верх із текстурою та м’який комір.' },
  ];
  const SPECS = (p) => [['Колір', p.color], ['Тип', p.type], ['Верх', 'Натуральна шкіра / текстиль'], ['Підошва', 'Гума'], ['Артикул', p.id.toUpperCase().replace('P', 'NS-') + '0']];

  const CITIES = ['Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро', 'Запоріжжя', 'Вінниця', 'Івано-Франківськ', 'Полтава', 'Чернівці'];
  const GUIDE = [[38, '5', '6', '24,0'], [39, '6', '6,5', '24,5'], [40, '6,5', '7', '25,0'], [41, '7,5', '8', '26,0'], [42, '8', '8,5', '26,5'], [43, '9', '9,5', '27,5'], [44, '9,5', '10', '28,0'], [45, '10,5', '11', '28,5'], [46, '11', '12', '29,5']];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = (n) => new Intl.NumberFormat('uk-UA').format(Math.round(n)) + ' ₴';
  const hash = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; };
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const inStock = (p, size) => hash(`${p.id}|${size}`) > 0.22;
  const stockCount = (p) => SIZES.filter((s) => inStock(p, s)).length;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const store = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem('ns:' + k)); return v ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem('ns:' + k, JSON.stringify(v)); } catch { /* приватний режим */ } },
  };

  /* ================= Стан ================= */
  const filters = { brands: new Set(), sizes: new Set(), maxPrice: 6000, sale: false, q: '', sort: 'pop', wishOnly: false };
  let cart = store.get('cart', []).filter((l) => byId(l.id));
  let wish = new Set(store.get('wish', []).filter(byId));
  let promo = store.get('promo', '');

  /* ================= Тости ================= */
  function toast(msg) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    $('#toasts').appendChild(el);
    setTimeout(() => { el.classList.add('is-out'); setTimeout(() => el.remove(), 300); }, 2600);
  }

  /* ================= Шапка, reveal ================= */
  const header = $('#header');
  addEventListener('scroll', () => header.classList.toggle('is-scrolled', scrollY > 10), { passive: true });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el) => {
    const sib = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    el.style.setProperty('--d', Math.min(sib.indexOf(el), 5) * 0.08 + 's');
    io.observe(el);
  });

  /* ================= Діалоги ================= */
  function openDlg(dlg) { if (!dlg.open) dlg.showModal(); document.body.classList.add('is-locked'); }
  $$('dialog').forEach((dlg) => {
    dlg.addEventListener('close', () => { if (!$$('dialog[open]').length) document.body.classList.remove('is-locked'); });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    $$('[data-close]', dlg).forEach((b) => b.addEventListener('click', () => dlg.close()));
  });

  /* ================= Фільтри ================= */
  const brands = [...new Set(PRODUCTS.map((p) => p.brand))];
  $('#fBrands').innerHTML = brands.map((b) => `<button type="button" class="chip" data-brand="${b}">${b}</button>`).join('');
  $('#fSizes').innerHTML = SIZES.map((s) => `<button type="button" class="size" data-size="${s}">${s}</button>`).join('');

  $('#fBrands').addEventListener('click', (e) => {
    const b = e.target.closest('[data-brand]'); if (!b) return;
    toggleSet(filters.brands, b.dataset.brand); render();
  });
  $('#fSizes').addEventListener('click', (e) => {
    const b = e.target.closest('[data-size]'); if (!b) return;
    toggleSet(filters.sizes, +b.dataset.size); render();
  });
  const toggleSet = (set, v) => (set.has(v) ? set.delete(v) : set.add(v));

  $('#fPrice').addEventListener('input', (e) => { filters.maxPrice = +e.target.value; render(); });
  $('#fSale').addEventListener('change', (e) => { filters.sale = e.target.checked; render(); });
  $('#sort').addEventListener('change', (e) => { filters.sort = e.target.value; render(); });
  $('#q').addEventListener('input', (e) => { filters.q = e.target.value.trim().toLowerCase(); render(); });
  $('#resetFilters').addEventListener('click', resetFilters);

  function resetFilters() {
    filters.brands.clear(); filters.sizes.clear();
    Object.assign(filters, { maxPrice: 6000, sale: false, q: '', wishOnly: false });
    $('#fPrice').value = 6000; $('#fSale').checked = false; $('#q').value = '';
    render();
  }

  const filtersEl = $('#filters');
  $('#filtersToggle').addEventListener('click', (e) => {
    const open = filtersEl.classList.toggle('is-open');
    e.currentTarget.setAttribute('aria-expanded', String(open));
  });

  function filtered() {
    let list = PRODUCTS.filter((p) =>
      (!filters.brands.size || filters.brands.has(p.brand)) &&
      (!filters.sizes.size || [...filters.sizes].some((s) => inStock(p, s))) &&
      p.price <= filters.maxPrice &&
      (!filters.sale || p.old) &&
      (!filters.q || `${p.name} ${p.brand} ${p.color} ${p.type}`.toLowerCase().includes(filters.q)) &&
      (!filters.wishOnly || wish.has(p.id)));
    const s = filters.sort;
    list = [...list].sort((a, b) =>
      s === 'asc' ? a.price - b.price :
      s === 'desc' ? b.price - a.price :
      s === 'new' ? (b.tag === 'new') - (a.tag === 'new') || b.pop - a.pop :
      b.pop - a.pop);
    return list;
  }

  /* ================= Каталог ================= */
  const gridEl = $('#grid');
  const heartSvg = '<svg viewBox="0 0 24 24" width="18" height="18" stroke-width="1.8" stroke-linejoin="round"><path d="M12 20.5s-8-4.7-8-10.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 8 2.3c0 5.9-8 10.6-8 10.6z"/></svg>';

  function cardHtml(p, i) {
    const left = stockCount(p);
    const discount = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
    return `
    <article class="card" style="--i:${i}" data-id="${p.id}">
      <button class="wish" data-wish="${p.id}" aria-pressed="${wish.has(p.id)}" aria-label="Додати в обране: ${esc(p.name)}">${heartSvg}</button>
      <button class="card__media" data-open="${p.id}" aria-label="Відкрити: ${esc(p.name)}">
        <img src="${img(p.photo, 640, 800)}" alt="${esc(p.name)}, ${esc(p.color.toLowerCase())}" loading="lazy" width="640" height="800">
        <span class="badges">
          ${p.tag === 'new' ? '<span class="badge badge--new">New</span>' : ''}
          ${discount ? `<span class="badge badge--sale">−${discount}%</span>` : ''}
          ${left <= 4 ? `<span class="badge badge--low">Залишилось ${left} р.</span>` : ''}
        </span>
        <span class="quick">Швидкий перегляд</span>
      </button>
      <div class="card__body">
        <p class="brand">${p.brand}</p>
        <h3>${esc(p.name)}</h3>
        <div class="price"><b>${fmt(p.price)}</b>${p.old ? `<s>${fmt(p.old)}</s>` : ''}</div>
      </div>
    </article>`;
  }

  function render() {
    const list = filtered();
    gridEl.innerHTML = list.length
      ? list.map(cardHtml).join('')
      : `<div class="empty"><h3>Нічого не знайдено</h3><p>Спробуйте змінити фільтри або скинути їх.</p><button class="btn btn--sm" data-reset>Скинути фільтри</button></div>`;
    $('#found').textContent = `Знайдено: ${list.length} з ${PRODUCTS.length}`;
    $('#priceOut').textContent = fmt(filters.maxPrice);

    $$('[data-brand]').forEach((b) => b.classList.toggle('is-on', filters.brands.has(b.dataset.brand)));
    $$('[data-size]', $('#fSizes')).forEach((b) => b.classList.toggle('is-on', filters.sizes.has(+b.dataset.size)));

    const tags = [
      ...[...filters.brands].map((b) => ({ t: b, rm: () => filters.brands.delete(b) })),
      ...[...filters.sizes].map((s) => ({ t: `Розмір ${s}`, rm: () => filters.sizes.delete(s) })),
      ...(filters.maxPrice < 6000 ? [{ t: `до ${fmt(filters.maxPrice)}`, rm: () => { filters.maxPrice = 6000; $('#fPrice').value = 6000; } }] : []),
      ...(filters.sale ? [{ t: 'Зі знижкою', rm: () => { filters.sale = false; $('#fSale').checked = false; } }] : []),
      ...(filters.wishOnly ? [{ t: 'Тільки обране', rm: () => { filters.wishOnly = false; } }] : []),
      ...(filters.q ? [{ t: `«${filters.q}»`, rm: () => { filters.q = ''; $('#q').value = ''; } }] : []),
    ];
    const activeEl = $('#active');
    activeEl.innerHTML = tags.map((x, i) => `<span class="tag">${esc(x.t)}<button type="button" data-rm="${i}" aria-label="Прибрати фільтр">×</button></span>`).join('');
    activeEl._tags = tags;
    const badge = $('#filtersBadge');
    badge.hidden = !tags.length;
    badge.textContent = `(${tags.length})`;
  }

  $('#active').addEventListener('click', (e) => {
    const b = e.target.closest('[data-rm]'); if (!b) return;
    $('#active')._tags[+b.dataset.rm].rm(); render();
  });

  gridEl.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) return resetFilters();
    const w = e.target.closest('[data-wish]');
    if (w) return toggleWish(w.dataset.wish);
    const o = e.target.closest('[data-open]');
    if (o) openProduct(o.dataset.open);
  });

  /* ================= Обране ================= */
  function toggleWish(id) {
    wish.has(id) ? wish.delete(id) : wish.add(id);
    store.set('wish', [...wish]);
    toast(wish.has(id) ? 'Додано в обране' : 'Прибрано з обраного');
    syncWish();
    if (filters.wishOnly) render();
  }
  function syncWish() {
    $$('[data-wish]').forEach((b) => b.setAttribute('aria-pressed', String(wish.has(b.dataset.wish))));
    const c = $('#wishCount');
    c.hidden = !wish.size;
    c.textContent = wish.size;
    c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
  }
  $('#wishBtn').addEventListener('click', () => {
    if (!wish.size) return toast('В обраному поки порожньо: натисніть ♥ на кросівках');
    filters.wishOnly = true;
    render();
    $('#catalog').scrollIntoView({ behavior: 'smooth' });
  });

  /* ================= Картка товару ================= */
  const prodDlg = $('#productDlg');
  const prodBody = $('#productBody');
  let current = { id: null, size: null };

  function openProduct(id) {
    const p = byId(id);
    current = { id, size: null };
    const discount = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
    prodBody.innerHTML = `
      <div class="product__img"><img src="${img(p.photo, 900, 1100)}" alt="${esc(p.name)}, ${esc(p.color.toLowerCase())}"></div>
      <div class="product__info">
        <div><p class="brand">${p.brand} · ${p.type}</p></div>
        <h2>${esc(p.name)}</h2>
        <div class="price"><b>${fmt(p.price)}</b>${p.old ? `<s>${fmt(p.old)}</s><i>−${discount}%</i>` : ''}</div>
        <p class="product__desc">${esc(p.desc)}</p>
        <fieldset class="product__sizes" id="pSizes">
          <legend>Розмір (EU) <button type="button" class="link link--sm" data-guide>Розмірна сітка</button></legend>
          <div class="sizes">${SIZES.map((s) => `<button type="button" class="size" data-psize="${s}" ${inStock(p, s) ? '' : 'disabled'}>${s}</button>`).join('')}</div>
        </fieldset>
        <p class="stock-note" id="stockNote">${stockCount(p) <= 4 ? `Залишилось лише ${stockCount(p)} розм.` : ''}</p>
        <div class="product__buy">
          <button class="btn" data-add>У кошик</button>
          <button class="icon-btn" data-wish="${p.id}" aria-pressed="${wish.has(p.id)}" aria-label="В обране">${heartSvg.replace('<svg', '<svg fill="none" stroke="currentColor"')}</button>
        </div>
        <dl class="specs">${SPECS(p).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        <ul class="perks"><li>Примірка у відділенні Нової пошти</li><li>14 днів на повернення</li><li>Безкоштовна доставка від ${fmt(FREE_FROM)}</li></ul>
      </div>`;
    openDlg(prodDlg);
  }

  prodBody.addEventListener('click', (e) => {
    const s = e.target.closest('[data-psize]');
    if (s) {
      current.size = +s.dataset.psize;
      $$('[data-psize]', prodBody).forEach((b) => b.classList.toggle('is-on', b === s));
      $('#stockNote').textContent = '';
      return;
    }
    if (e.target.closest('[data-guide]')) return openDlg($('#guideDlg'));
    const w = e.target.closest('[data-wish]');
    if (w) { toggleWish(w.dataset.wish); w.setAttribute('aria-pressed', String(wish.has(w.dataset.wish))); return; }
    if (e.target.closest('[data-add]')) {
      if (!current.size) {
        const f = $('#pSizes'); f.classList.remove('is-shake'); void f.offsetWidth; f.classList.add('is-shake');
        $('#stockNote').textContent = 'Оберіть розмір, щоб додати в кошик';
        return;
      }
      addToCart(current.id, current.size);
      prodDlg.close();
      openCart();
    }
  });
  $('#heroCard').addEventListener('click', () => openProduct('p1'));
  $('#sizeGuideBtn').addEventListener('click', () => openDlg($('#guideDlg')));
  $('#guideRows').innerHTML = GUIDE.map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('');

  /* ================= Кошик ================= */
  const cartDlg = $('#cartDlg');
  const lineKey = (l) => `${l.id}|${l.size}`;

  function addToCart(id, size) {
    const l = cart.find((x) => x.id === id && x.size === size);
    if (l) l.qty = Math.min(5, l.qty + 1); else cart.push({ id, size, qty: 1 });
    saveCart();
    toast('Додано в кошик');
  }
  function saveCart() { store.set('cart', cart); renderCart(); }

  function totals() {
    const subtotal = cart.reduce((s, l) => s + byId(l.id).price * l.qty, 0);
    const rate = PROMOS[promo] || 0;
    const discount = Math.round(subtotal * rate);
    const after = subtotal - discount;
    const delivery = !cart.length || after >= FREE_FROM ? 0 : DELIVERY;
    return { subtotal, discount, after, delivery, total: after + delivery };
  }

  function renderCart() {
    const count = cart.reduce((s, l) => s + l.qty, 0);
    const c = $('#cartCount');
    c.hidden = !count;
    c.textContent = count;
    c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');

    const body = $('#cartBody');
    const foot = $('#cartFoot');
    if (!cart.length) {
      body.innerHTML = `<div class="cart-empty"><h3>Кошик порожній</h3><p>Додайте кросівки з каталогу — і вони з’являться тут.</p><button class="btn" data-close-cart>До каталогу</button></div>`;
      foot.innerHTML = '';
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    const t = totals();
    const left = Math.max(0, FREE_FROM - t.after);
    body.innerHTML = `
      <div class="free-bar ${left ? '' : 'is-done'}" style="margin:0 -24px">
        <span>${left ? `До безкоштовної доставки лишилось ${fmt(left)}` : 'Доставка безкоштовна 🎉'}</span>
        <div class="free-bar__track"><div class="free-bar__fill" style="width:${Math.min(100, (t.after / FREE_FROM) * 100)}%"></div></div>
      </div>
      ${cart.map((l) => {
        const p = byId(l.id);
        return `<div class="line" data-key="${lineKey(l)}">
          <img src="${img(p.photo, 200, 240)}" alt="${esc(p.name)}">
          <div><h4>${esc(p.name)}</h4><small>${p.brand} · розмір ${l.size}</small>
            <div class="qty"><button data-dec aria-label="Менше">−</button><span>${l.qty}</span><button data-inc aria-label="Більше">+</button></div></div>
          <div class="line__side"><b>${fmt(p.price * l.qty)}</b><button class="line__rm" data-rm-line>Видалити</button></div>
        </div>`;
      }).join('')}`;
    foot.innerHTML = `
      <form class="promo" id="promoForm"><input type="text" id="promoIn" placeholder="Промокод" value="${esc(promo)}" aria-label="Промокод"><button class="btn btn--line btn--sm" type="submit">Застосувати</button></form>
      <p class="promo__msg ${promo && PROMOS[promo] ? 'ok' : ''}" id="promoMsg">${promo && PROMOS[promo] ? `Промокод ${esc(promo)}: −${PROMOS[promo] * 100}%` : ''}</p>
      <div class="sum">
        <div><span>Товари</span><span>${fmt(t.subtotal)}</span></div>
        ${t.discount ? `<div><span>Знижка</span><span>−${fmt(t.discount)}</span></div>` : ''}
        <div><span>Доставка Новою поштою</span><span>${t.delivery ? fmt(t.delivery) : 'безкоштовно'}</span></div>
        <div class="total"><span>Разом</span><b>${fmt(t.total)}</b></div>
      </div>
      <button class="btn btn--full" id="toCheckout">Оформити замовлення</button>`;
  }

  function openCart() { renderCart(); openDlg(cartDlg); }
  $('#cartBtn').addEventListener('click', openCart);

  cartDlg.addEventListener('click', (e) => {
    if (e.target.closest('[data-close-cart]')) { cartDlg.close(); $('#catalog').scrollIntoView({ behavior: 'smooth' }); return; }
    const line = e.target.closest('.line');
    if (line) {
      const l = cart.find((x) => lineKey(x) === line.dataset.key);
      if (e.target.closest('[data-inc]')) l.qty = Math.min(5, l.qty + 1);
      else if (e.target.closest('[data-dec]')) l.qty -= 1;
      else if (e.target.closest('[data-rm-line]')) l.qty = 0;
      else return;
      cart = cart.filter((x) => x.qty > 0);
      return saveCart();
    }
    if (e.target.closest('#toCheckout')) { cartDlg.close(); openCheckout(); }
  });
  cartDlg.addEventListener('submit', (e) => {
    if (e.target.id !== 'promoForm') return;
    e.preventDefault();
    const code = $('#promoIn').value.trim().toUpperCase();
    if (!code) { promo = ''; store.set('promo', ''); return renderCart(); }
    if (PROMOS[code]) { promo = code; store.set('promo', code); renderCart(); toast(`Промокод ${code} застосовано`); }
    else { const m = $('#promoMsg'); m.className = 'promo__msg err'; m.textContent = 'Такого промокоду немає. Спробуйте NORTH10'; }
  });

  /* ================= Оформлення ================= */
  const coDlg = $('#checkoutDlg');
  const coBody = $('#checkoutBody');

  const phoneMask = (input) => {
    let d = input.value.replace(/\D/g, '');
    if (d.length < 3 && '380'.startsWith(d) && d !== '0') { input.value = ''; return; }
    if (d.startsWith('380')) d = d.slice(3); else if (d.startsWith('80')) d = d.slice(2); else if (d.startsWith('0')) d = d.slice(1);
    d = d.slice(0, 9);
    let out = '+380';
    if (d.length > 0) out += ' (' + d.slice(0, 2);
    if (d.length >= 3) out += ') ' + d.slice(2, 5);
    if (d.length >= 6) out += '-' + d.slice(5, 7);
    if (d.length >= 8) out += '-' + d.slice(7, 9);
    input.value = out;
  };
  const phoneOk = (v) => v.replace(/\D/g, '').length === 12;

  function openCheckout() {
    if (!cart.length) return;
    const t = totals();
    coBody.innerHTML = `
      <h2>Оформлення замовлення</h2>
      <form class="form" id="coForm" novalidate>
        <div class="row2">
          <label>Ім’я<input type="text" name="name" placeholder="Як до вас звертатися" autocomplete="given-name"><small class="err">Введіть ім’я</small></label>
          <label>Телефон<input type="tel" name="phone" placeholder="+380 (__) ___-__-__" inputmode="tel" autocomplete="tel"><small class="err">Введіть номер повністю</small></label>
        </div>
        <div class="row2">
          <label>Місто<select name="city">${CITIES.map((c) => `<option>${c}</option>`).join('')}</select></label>
          <label>Нова пошта<select name="branch">${Array.from({ length: 12 }, (_, i) => `<option>Відділення №${i + 1}</option>`).join('')}${Array.from({ length: 4 }, (_, i) => `<option>Поштомат №${i + 101}</option>`).join('')}</select></label>
        </div>
        <fieldset class="pay">
          <legend style="margin-bottom:8px">Оплата</legend>
          <label><input type="radio" name="pay" value="cod" checked> Післяплата у відділенні</label>
          <label><input type="radio" name="pay" value="card"> Картка онлайн (демо)</label>
        </fieldset>
        <div class="order-sum">
          <div><span>Товари (${cart.reduce((s, l) => s + l.qty, 0)} шт.)</span><span>${fmt(t.subtotal)}</span></div>
          ${t.discount ? `<div><span>Знижка ${esc(promo)}</span><span>−${fmt(t.discount)}</span></div>` : ''}
          <div><span>Доставка</span><span>${t.delivery ? fmt(t.delivery) : 'безкоштовно'}</span></div>
          <div class="total"><span>До сплати</span><span>${fmt(t.total)}</span></div>
        </div>
        <button class="btn btn--full" type="submit">Підтвердити замовлення</button>
        <p class="muted" style="font-size:.78rem">Це демо-магазин: замовлення нікуди не надсилається, гроші не списуються.</p>
      </form>`;
    const f = $('#coForm');
    phoneMask(f.elements.phone);
    f.elements.phone.value = '';
    f.elements.phone.addEventListener('input', (e) => phoneMask(e.target));
    $$('input', f).forEach((i) => i.addEventListener('input', () => i.classList.remove('is-invalid')));
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const n = f.elements.name; const ph = f.elements.phone;
      let ok = true;
      const bad = (el, cond) => { el.classList.toggle('is-invalid', cond); if (cond) ok = false; };
      bad(n, n.value.trim().length < 2);
      bad(ph, !phoneOk(ph.value));
      if (!ok) return $('.is-invalid', f).focus();
      const num = 'NS-' + String(Math.floor(10000 + Math.random() * 90000));
      const total = totals().total;
      coBody.innerHTML = `
        <div class="success">
          <div class="tick"><svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#0a0a0a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></div>
          <h2>Дякуємо, ${esc(n.value.trim())}!</h2>
          <span class="num">${num}</span>
          <p>Замовлення на ${fmt(total)} прийнято. Доставка: ${esc(f.elements.city.value)}, ${esc(f.elements.branch.value)}. Менеджер зателефонує для підтвердження.</p>
          <p style="font-size:.8rem">Демо-версія: дані нікуди не надсилаються.</p>
          <button class="btn" data-close>Продовжити покупки</button>
        </div>`;
      $('[data-close]', coBody).addEventListener('click', () => coDlg.close());
      cart = []; promo = ''; store.set('promo', ''); saveCart();
    });
    openDlg(coDlg);
  }

  /* ================= Дроп: таймер і нагадування ================= */
  function nextDrop() {
    const d = new Date();
    d.setHours(18, 0, 0, 0);
    const add = (5 - d.getDay() + 7) % 7; // найближча п'ятниця
    d.setDate(d.getDate() + add);
    if (d <= new Date()) d.setDate(d.getDate() + 7);
    return d;
  }
  let dropAt = nextDrop();
  const units = Object.fromEntries($$('#countdown [data-u]').map((el) => [el.dataset.u, el]));
  function tick() {
    let diff = Math.max(0, dropAt - new Date());
    if (diff === 0) { dropAt = nextDrop(); diff = dropAt - new Date(); }
    const p = (n) => String(n).padStart(2, '0');
    units.d.textContent = p(Math.floor(diff / 864e5));
    units.h.textContent = p(Math.floor(diff / 36e5) % 24);
    units.m.textContent = p(Math.floor(diff / 6e4) % 60);
    units.s.textContent = p(Math.floor(diff / 1e3) % 60);
  }
  tick();
  setInterval(tick, 1000);

  const notify = $('#notify');
  notify.elements.phone.addEventListener('input', (e) => { phoneMask(e.target); e.target.classList.remove('is-invalid'); });
  notify.addEventListener('submit', (e) => {
    e.preventDefault();
    const ph = notify.elements.phone;
    const msg = $('#notifyMsg');
    if (!phoneOk(ph.value)) { ph.classList.add('is-invalid'); msg.textContent = 'Введіть номер повністю'; return; }
    msg.textContent = 'Готово! Нагадаємо за годину до старту (демо).';
    ph.value = '';
  });

  /* ================= Старт ================= */
  $('#year').textContent = new Date().getFullYear();
  render();
  syncWish();
  renderCart();
  if (matchMedia('(max-width: 900px)').matches) filtersEl.classList.remove('is-open');
})();
