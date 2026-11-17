/* RAZOR & CO. — лендінг барбершопу. Чистий JS, без залежностей. */
(() => {
  'use strict';

  /* ================= Данные ================= */
  const CATEGORIES = [
    { id: 'hair', title: 'Стрижки' },
    { id: 'beard', title: 'Борода' },
    { id: 'combo', title: 'Комплекси' },
    { id: 'care', title: 'Догляд' },
  ];

  const SERVICES = [
    { id: 's1', cat: 'hair', title: 'Чоловіча стрижка', desc: 'Консультація, миття голови, стрижка машинкою та ножицями, укладання.', price: 700, dur: 60 },
    { id: 's2', cat: 'hair', title: 'Fade / Скін-фейд', desc: 'Плавний перехід до шкіри, чіткі лінії, фінальне укладання.', price: 800, dur: 75 },
    { id: 's3', cat: 'hair', title: 'Дитяча стрижка', desc: 'Для хлопчиків від 5 до 12 років. Спокійно й без сліз.', price: 450, dur: 40 },
    { id: 's4', cat: 'beard', title: 'Оформлення бороди', desc: 'Моделювання форми, корекція контуру, догляд олією.', price: 500, dur: 40 },
    { id: 's5', cat: 'beard', title: 'Королівське гоління', desc: 'Небезпечна бритва, гарячі рушники, преміальні олії та бальзам.', price: 650, dur: 45 },
    { id: 's6', cat: 'combo', title: 'Стрижка + борода', desc: 'Найпопулярніший варіант: повний образ за один візит.', price: 1100, dur: 90 },
    { id: 's7', cat: 'combo', title: 'Батько + син', desc: 'Дві стрижки поспіль, вигода 15% на дитячу.', price: 1050, dur: 100 },
    { id: 's8', cat: 'combo', title: 'VIP «Під ключ»', desc: 'Стрижка, борода, гоління, зміцнювальна маска та масаж голови.', price: 1700, dur: 120 },
    { id: 's9', cat: 'care', title: 'Миття та укладання', desc: 'Глибоке очищення, доглядові засоби, укладання стайлінгом.', price: 300, dur: 25 },
    { id: 's10', cat: 'care', title: 'Камуфляж сивини', desc: 'Делікатне тонування, без ефекту «зафарбованості».', price: 600, dur: 40 },
  ];

  const MASTERS = [
    { id: 'm1', name: 'Артем Вовк', short: 'Артема', role: 'Старший барбер', exp: 9, rating: 4.9, mult: 1.2, mono: 'А', grad: 'linear-gradient(135deg,#6b4a1c,#c9a24b)', tag: 'Топ-майстер' },
    { id: 'm2', name: 'Нікіта Орлов', short: 'Нікіти', role: 'Барбер · Fade та класика', exp: 5, rating: 4.9, mult: 1, mono: 'Н', grad: 'linear-gradient(135deg,#1f3a3d,#4d8a85)', tag: 'Fade-експерт' },
    { id: 'm3', name: 'Максим Лисенко', short: 'Максима', role: 'Барбер · Борода та гоління', exp: 4, rating: 4.8, mult: 1, mono: 'М', grad: 'linear-gradient(135deg,#3b1f2a,#a2506b)', tag: 'Борода' },
  ];
  const ANY_MASTER = { id: 'any', name: 'Будь-який вільний', short: 'Будь-який', mult: 1 };

  // Фото — Unsplash (вільна ліцензія). Замініть на власні, коли будуть.
  const img = (id, w, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=75`;
  const MASTER_PHOTOS = {
    m1: { id: '1553521041-d168abd31de3', pos: '50% 30%' },
    m2: { id: '1640301133857-c4bc5789c1bb', pos: '50% 35%' },
    m3: { id: '1598524374912-6b0b0bab43dd', pos: '60% 20%' },
  };
  const GALLERY = [
    { id: '1647140655214-e4a2d914971f', alt: 'Стрижка ножицями', cls: 'tall' },
    { id: '1599351431202-1e0f0137899a', alt: 'Окантовка небезпечною бритвою' },
    { id: '1640301133543-41fe25ad6450', alt: 'Класичний fade' },
    { id: '1739302493888-6f96cbc37105', alt: 'Королівське гоління', cls: 'tall' },
    { id: '1621605815971-fbc98d665033', alt: 'Професійні інструменти', cls: 'wide' },
    { id: '1517832606299-7ae9b720a186', alt: 'Оформлення бороди' },
    { id: '1592647420148-bfcc177e2117', alt: 'Ретро-крісло барбера', cls: 'tall' },
    { id: '1605497788044-5a32c7078486', alt: 'Укладання після стрижки' },
  ];
  // Пари «до/після» — додайте реальні фото клієнтів (із їхньої згоди), і блок з'явиться сам:
  // { before: 'img/before-1.jpg', after: 'img/after-1.jpg', caption: 'Fade + борода' }
  const BEFORE_AFTER = [];

  const LOCALE = 'uk-UA';
  const fmt = (n) => new Intl.NumberFormat(LOCALE).format(Math.round(n)) + ' ₴';
  const DOW = ['нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  const MONTHS = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ================= Состояние записи ================= */
  const state = { service: null, master: null, date: null, time: null, step: 1 };

  /* ================= Шапка и меню ================= */
  const header = $('#header');
  const nav = $('#nav');
  const burger = $('#burger');
  const bookingEl = $('#booking');

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

  /* ================= Появление при скролле ================= */
  $$('.reveal').forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    el.style.setProperty('--d', Math.min(siblings.indexOf(el), 5) * 0.09 + 's');
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el) => io.observe(el));

  /* ================= Счётчики ================= */
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const plus = 'plus' in el.dataset;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const render = (v) => { el.textContent = new Intl.NumberFormat(LOCALE, { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(v) + (plus ? '+' : ''); };
    if (reduce) return render(target);
    const t0 = performance.now();
    const dur = 1600;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      render(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { animateCount(en.target); countIO.unobserve(en.target); } });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => countIO.observe(el));

  /* ================= Прайс с вкладками ================= */
  const tabsEl = $('#tabs');
  const listEl = $('#priceList');
  let activeCat = CATEGORIES[0].id;

  const renderTabs = () => {
    tabsEl.innerHTML = CATEGORIES.map((c) => `<button role="tab" class="tab ${c.id === activeCat ? 'is-active' : ''}" data-cat="${c.id}" aria-selected="${c.id === activeCat}">${c.title}</button>`).join('');
  };
  const renderPrices = () => {
    listEl.innerHTML = SERVICES.filter((s) => s.cat === activeCat).map((s, i) => `
      <li class="price-item" style="animation-delay:${i * 60}ms">
        <div><h3>${s.title}</h3><p>${s.desc}</p></div>
        <span class="price-item__dur">${s.dur} хв</span>
        <span class="price-item__price">${fmt(s.price)}</span>
        <button class="btn btn--small btn--ghost" data-pick="${s.id}">Обрати</button>
      </li>`).join('');
  };
  tabsEl.addEventListener('click', (e) => {
    const b = e.target.closest('.tab');
    if (!b) return;
    activeCat = b.dataset.cat;
    renderTabs();
    renderPrices();
  });
  listEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-pick]');
    if (!b) return;
    selectService(b.dataset.pick);
    goStep(2);
    bookingEl.scrollIntoView({ behavior: 'smooth' });
  });

  /* ================= Мастера (секция) ================= */
  $('#mastersGrid').innerHTML = MASTERS.map((m) => `
    <article class="master reveal">
      <div class="master__photo" style="--grad:${m.grad}">
        <img src="${img(MASTER_PHOTOS[m.id].id, 640)}" alt="${m.name}, ${m.role.toLowerCase()}" loading="lazy" width="640" height="672" style="object-position:${MASTER_PHOTOS[m.id].pos}">
        <span class="master__badge">${m.tag}</span>
      </div>
      <div class="master__body">
        <h3>${m.name}</h3>
        <p class="master__role">${m.role}</p>
        <div class="master__meta"><span><b>${m.exp}</b> років досвіду</span><span>★ <b>${m.rating}</b></span></div>
        <button class="btn btn--small btn--ghost" data-master="${m.id}">Записатися до ${m.short}</button>
      </div>
    </article>`).join('');
  $$('#mastersGrid .reveal').forEach((el, i) => { el.style.setProperty('--d', i * 0.1 + 's'); io.observe(el); });
  $('#mastersGrid').addEventListener('click', (e) => {
    const b = e.target.closest('[data-master]');
    if (!b) return;
    selectMaster(b.dataset.master);
    goStep(state.service ? 3 : 1);
    bookingEl.scrollIntoView({ behavior: 'smooth' });
  });

  /* ================= Мастер записи: рендер шагов ================= */
  const bkServices = $('#bkServices');
  const bkMasters = $('#bkMasters');
  const bkDates = $('#bkDates');
  const bkSlots = $('#bkSlots');
  const nextBtn = $('#bkNext');
  const backBtn = $('#bkBack');
  const navBox = $('#bkNav');
  const stepsEl = $('#steps');

  const masterById = (id) => (id === 'any' ? ANY_MASTER : MASTERS.find((m) => m.id === id));
  const serviceById = (id) => SERVICES.find((s) => s.id === id);
  const priceFor = () => (state.service ? serviceById(state.service).price * (state.master ? masterById(state.master).mult : 1) : 0);

  bkServices.innerHTML = SERVICES.map((s) => `
    <button type="button" class="choice" data-service="${s.id}">
      <span class="choice__title">${s.title}</span>
      <span class="choice__meta"><span>${s.dur} хв</span><b>${fmt(s.price)}</b></span>
    </button>`).join('');

  bkMasters.innerHTML = [ANY_MASTER, ...MASTERS].map((m) => `
    <button type="button" class="choice" data-master-pick="${m.id}">
      <span class="choice__title">${m.name}</span>
      <span class="choice__meta"><span>${m.role || 'Підберемо найближчий час'}</span>${m.mult > 1 ? '<b>+20%</b>' : ''}</span>
    </button>`).join('');

  bkServices.addEventListener('click', (e) => { const b = e.target.closest('[data-service]'); if (b) selectService(b.dataset.service); });
  bkMasters.addEventListener('click', (e) => { const b = e.target.closest('[data-master-pick]'); if (b) selectMaster(b.dataset.masterPick); });

  function selectService(id) {
    state.service = id;
    state.time = null;
    $$('[data-service]', bkServices).forEach((b) => b.classList.toggle('is-selected', b.dataset.service === id));
    renderSlots();
    updateSummary();
  }
  function selectMaster(id) {
    state.master = id;
    state.time = null;
    $$('[data-master-pick]', bkMasters).forEach((b) => b.classList.toggle('is-selected', b.dataset.masterPick === id));
    renderSlots();
    updateSummary();
  }

  /* --- Даты --- */
  const dateKey = (d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i); return d; });

  bkDates.innerHTML = days.map((d, i) => `
    <button type="button" class="date" data-date="${i}">
      <small>${i === 0 ? 'сьогодні' : DOW[d.getDay()]}</small>
      <b>${d.getDate()}</b>
    </button>`).join('');
  bkDates.addEventListener('click', (e) => {
    const b = e.target.closest('[data-date]');
    if (!b) return;
    state.date = +b.dataset.date;
    state.time = null;
    $$('.date', bkDates).forEach((x) => x.classList.toggle('is-selected', x === b));
    renderSlots();
    updateSummary();
  });

  /* --- Слоты: псевдослучайная «занятость», стабильная для даты/мастера --- */
  const hash = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; };

  const hoursFor = (dow) => (dow === 0 || dow === 6 ? [11, 21] : [10, 22]);

  // Усі слоти дня для майстра: { label, disabled }
  function slotsFor(dayIdx, masterId, dur) {
    const d = days[dayIdx];
    const [open, close] = hoursFor(d.getDay());
    const now = new Date();
    const slots = [];
    for (let m = open * 60; m + dur <= close * 60; m += 30) {
      const label = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
      const past = dayIdx === 0 && m <= now.getHours() * 60 + now.getMinutes() + 30;
      const busyChance = masterId === 'any' ? 0.25 : 0.42;
      const busy = hash(`${dateKey(d)}|${masterId || 'x'}|${label}`) < busyChance;
      slots.push({ label, disabled: past || busy });
    }
    return slots;
  }

  function renderSlots() {
    if (state.date === null) {
      bkSlots.innerHTML = '<p class="slots__empty">Оберіть дату, щоб побачити вільний час.</p>';
      return;
    }
    const slots = slotsFor(state.date, state.master, state.service ? serviceById(state.service).dur : 30);
    if (!slots.some((s) => !s.disabled)) {
      bkSlots.innerHTML = '<p class="slots__empty">На цей день вільних вікон немає. Спробуйте іншу дату або майстра.</p>';
      return;
    }
    bkSlots.innerHTML = slots.map((s) => `<button type="button" class="slot ${state.time === s.label ? 'is-selected' : ''}" data-time="${s.label}" ${s.disabled ? 'disabled' : ''}>${s.label}</button>`).join('');
  }
  bkSlots.addEventListener('click', (e) => {
    const b = e.target.closest('[data-time]');
    if (!b || b.disabled) return;
    state.time = b.dataset.time;
    $$('.slot', bkSlots).forEach((x) => x.classList.toggle('is-selected', x === b));
    updateSummary();
  });
  renderSlots();

  /* --- Сводка --- */
  const dateLabel = () => { if (state.date === null) return '—'; const d = days[state.date]; return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${DOW[d.getDay()]}`; };

  function updateSummary() {
    const s = state.service ? serviceById(state.service) : null;
    const m = state.master ? masterById(state.master) : null;
    $('#sumService').textContent = s ? s.title : '—';
    $('#sumMaster').textContent = m ? m.name : '—';
    $('#sumDate').textContent = dateLabel();
    $('#sumTime').textContent = state.time || '—';
    $('#sumPrice').textContent = fmt(priceFor());
    $('#sumDur').textContent = s ? `Тривалість: близько ${s.dur} хв` : '';
    refreshNav();
  }

  /* --- Навигация по шагам --- */
  const canNext = () => ({ 1: !!state.service, 2: !!state.master, 3: !!state.time && state.date !== null, 4: false })[state.step];

  function refreshNav() {
    nextBtn.disabled = !canNext();
    backBtn.classList.toggle('is-hidden', state.step === 1);
    navBox.classList.toggle('is-form', state.step === 4);
  }

  function goStep(n) {
    state.step = n;
    $$('.panel').forEach((p) => p.classList.toggle('is-active', +p.dataset.panel === n));
    $$('li', stepsEl).forEach((li) => {
      const k = +li.dataset.step;
      li.classList.toggle('is-active', k === n);
      li.classList.toggle('is-done', k < n);
    });
    if (n === 3) renderSlots();
    refreshNav();
  }
  nextBtn.addEventListener('click', () => { if (canNext()) goStep(state.step + 1); });
  backBtn.addEventListener('click', () => { if (state.step > 1) goStep(state.step - 1); });
  stepsEl.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (li && +li.dataset.step < state.step) goStep(+li.dataset.step);
  });

  /* ================= Форма ================= */
  const form = $('#bkForm');
  const phoneInput = form.elements.phone;

  phoneInput.addEventListener('input', () => {
    // Український формат: +380 (XX) XXX-XX-XX — 12 цифр разом із кодом країни
    let d = phoneInput.value.replace(/\D/g, '');
    // «стирання» префікса: +38 → порожньо, щоб поле можна було очистити
    if (d.length < 3 && '380'.startsWith(d) && d !== '0') { phoneInput.value = ''; return; }
    if (d.startsWith('380')) d = d.slice(3);
    else if (d.startsWith('80')) d = d.slice(2);
    else if (d.startsWith('0')) d = d.slice(1);
    d = d.slice(0, 9);
    let out = '+380';
    if (d.length > 0) out += ' (' + d.slice(0, 2);
    if (d.length >= 3) out += ') ' + d.slice(2, 5);
    if (d.length >= 6) out += '-' + d.slice(5, 7);
    if (d.length >= 8) out += '-' + d.slice(7, 9);
    phoneInput.value = out;
  });
  $$('input, textarea', form).forEach((el) => el.addEventListener('input', () => el.classList.remove('is-invalid')));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements.name;
    const agree = form.elements.agree;
    const agreeErr = $('.err--agree', form);
    let ok = true;
    const bad = (el, cond) => { el.classList.toggle('is-invalid', cond); if (cond) ok = false; };
    bad(name, name.value.trim().length < 2);
    bad(phoneInput, phoneInput.value.replace(/\D/g, '').length !== 12);
    agreeErr.classList.toggle('is-shown', !agree.checked);
    if (!agree.checked) ok = false;
    if (!ok) { const first = $('.is-invalid', form); if (first) first.focus(); return; }

    const s = serviceById(state.service);
    const m = masterById(state.master);
    $('#successText').innerHTML = `${name.value.trim()}, чекаємо на вас <b>${dateLabel()} о ${state.time}</b>.<br>${s.title} · майстер: ${m.name}.<br>До сплати: <b>${fmt(priceFor())}</b>.`;
    state.step = 5;
    $$('.panel').forEach((p) => p.classList.toggle('is-active', +p.dataset.panel === 5));
    stepsEl.classList.add('is-hidden');
    navBox.classList.add('is-hidden');
    bookingEl.scrollIntoView({ behavior: 'smooth' });
  });

  $('#bkReset').addEventListener('click', () => {
    Object.assign(state, { service: null, master: null, date: null, time: null });
    form.reset();
    $$('.is-selected').forEach((el) => el.classList.remove('is-selected'));
    stepsEl.classList.remove('is-hidden');
    navBox.classList.remove('is-hidden');
    renderSlots();
    updateSummary();
    goStep(1);
  });

  /* ================= «Живі» блоки: статус і найближче вікно ================= */
  const KYIV_DOW = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const pad2 = (n) => String(n).padStart(2, '0');

  function kyivNow() {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Kyiv', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((p) => [p.type, p.value]));
    return { dow: KYIV_DOW[parts.weekday], minutes: +parts.hour * 60 + +parts.minute };
  }

  function statusInfo() {
    const { dow, minutes } = kyivNow();
    const [open, close] = hoursFor(dow);
    if (minutes >= open * 60 && minutes < close * 60) {
      const left = close * 60 - minutes;
      return { open: true, text: left <= 60 ? `Зараз відчинено · зачиняємось о ${pad2(close)}:00` : `Зараз відчинено · до ${pad2(close)}:00` };
    }
    if (minutes < open * 60) return { open: false, text: `Зараз зачинено · відчинимось сьогодні о ${pad2(open)}:00` };
    const [nextOpen] = hoursFor((dow + 1) % 7);
    return { open: false, text: `Зараз зачинено · відчинимось завтра о ${pad2(nextOpen)}:00` };
  }

  function renderStatus() {
    const s = statusInfo();
    $$('[data-live-status]').forEach((el) => {
      el.textContent = s.text;
      el.parentElement.classList.toggle('is-open', s.open);
    });
  }

  function nearestSlot() {
    for (let i = 0; i < days.length; i++) {
      const free = slotsFor(i, 'any', 60).find((s) => !s.disabled);
      if (free) {
        const d = days[i];
        const when = i === 0 ? 'сьогодні' : i === 1 ? 'завтра' : `${d.getDate()} ${MONTHS[d.getMonth()]}`;
        return { dayIdx: i, time: free.label, text: `${when} о ${free.label}` };
      }
    }
    return null;
  }

  function renderNextSlot() {
    const n = nearestSlot();
    $$('[data-next-slot]').forEach((a) => {
      a.textContent = n ? n.text : 'дивіться в календарі';
      a.onclick = n ? () => {
        // Підставляємо дату в запис: клієнт одразу бачить цей день
        state.date = n.dayIdx;
        $$('.date', bkDates).forEach((x) => x.classList.toggle('is-selected', +x.dataset.date === n.dayIdx));
        renderSlots();
        updateSummary();
      } : null;
    });
  }

  renderStatus();
  renderNextSlot();
  setInterval(() => { renderStatus(); renderNextSlot(); }, 60000);

  /* ================= Галерея та lightbox ================= */
  const galleryEl = $('#gallery-grid');
  galleryEl.innerHTML = GALLERY.map((g, i) => `
    <button type="button" class="gallery__item ${g.cls ? 'g--' + g.cls : ''} reveal" data-i="${i}" aria-label="Відкрити фото: ${g.alt}">
      <img src="${img(g.id, g.cls === 'wide' ? 900 : 600, g.cls === 'tall' ? 900 : g.cls === 'wide' ? 450 : 600)}" alt="${g.alt}" loading="lazy">
    </button>`).join('');
  $$('.gallery__item', galleryEl).forEach((el) => io.observe(el));

  const lb = $('#lightbox');
  const lbImg = $('#lbImg');
  let lbIndex = 0;
  const showLb = (i) => {
    lbIndex = (i + GALLERY.length) % GALLERY.length;
    const g = GALLERY[lbIndex];
    lbImg.src = img(g.id, 1600);
    lbImg.alt = g.alt;
    $('#lbCap').textContent = `${g.alt} · ${lbIndex + 1} / ${GALLERY.length}`;
  };
  galleryEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    showLb(+b.dataset.i);
    lb.showModal();
  });
  $('#lbClose').addEventListener('click', () => lb.close());
  $('#lbPrev').addEventListener('click', () => showLb(lbIndex - 1));
  $('#lbNext').addEventListener('click', () => showLb(lbIndex + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
    if (e.key === 'ArrowRight') showLb(lbIndex + 1);
  });
  // Свайп на телефоні
  let touchX = null;
  lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) showLb(lbIndex + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  /* ================= До / після ================= */
  function renderCompare(pairs) {
    if (!pairs.length) return;
    $('#compareWrap').hidden = false;
    $('#compares').innerHTML = pairs.map((p) => `
      <figure class="compare" style="--pos:50%">
        <img src="${p.after}" alt="Після: ${p.caption || ''}" loading="lazy">
        <img class="compare__before" src="${p.before}" alt="До: ${p.caption || ''}" loading="lazy">
        <span class="compare__tag compare__tag--l">До</span><span class="compare__tag compare__tag--r">Після</span>
        <span class="compare__handle" aria-hidden="true"></span>
        <input type="range" min="0" max="100" value="50" aria-label="Порівняти до і після: ${p.caption || ''}">
        ${p.caption ? `<figcaption>${p.caption}</figcaption>` : ''}
      </figure>`).join('');
    $$('.compare input').forEach((r) => r.addEventListener('input', () => r.closest('.compare').style.setProperty('--pos', r.value + '%')));
  }
  renderCompare(BEFORE_AFTER);

  /* ================= Старт ================= */
  renderTabs();
  renderPrices();
  updateSummary();
  goStep(1);
  $('#year').textContent = new Date().getFullYear();
})();
