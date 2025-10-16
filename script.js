(function(){
  const html = document.documentElement;
  const header = document.getElementById('header');
  const navList = document.getElementById('navList');
  const hamburger = document.getElementById('hamburger');
  const themeToggle = document.getElementById('themeToggle');
  const langSelect = document.getElementById('langSelect');
  const backToTop = document.getElementById('backToTop');

  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  const savedTheme = localStorage.getItem('theme');
  html.setAttribute('data-theme', (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark');
  function renderThemeIcon() {
    themeToggle.innerHTML = html.getAttribute('data-theme') === 'light' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    themeToggle.classList.toggle('active', html.getAttribute('data-theme') === 'light');
  }
  renderThemeIcon();
  themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    renderThemeIcon();
  });

  const mq = window.matchMedia('(max-width: 900px)');
  const updateNavMode = () => {
    if (mq.matches) {
      // Small screens: keep inline row (CSS handles layout). Hide hamburger.
      navList.classList.remove('open');
      navList.style = '';
      hamburger.style.display = 'none';
    } else {
      // Desktop: normal inline row as well; hamburger hidden.
      navList.classList.remove('open');
      navList.style = '';
      hamburger.style.display = 'none';
    }
  };
  updateNavMode();
  mq.addEventListener('change', updateNavMode);
  // Hamburger no longer used, but keep a safe listener.
  hamburger.addEventListener('click', () => { /* no-op: inline nav */ });
  navList.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { navList.classList.remove('open'); updateNavMode(); }));

  const onScroll = () => {
    if (window.scrollY > 8) header.classList.add('scrolled'); else header.classList.remove('scrolled');
    const show = window.scrollY > 300;
    backToTop.style.opacity = show ? '1' : '0';
    backToTop.style.visibility = show ? 'visible' : 'hidden';
    backToTop.style.transform = show ? 'translateY(0)' : 'translateY(8px)';
  };
  window.addEventListener('scroll', onScroll);
  onScroll();
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const id = this.getAttribute('href');
      if (id.length > 1) {
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        const y = el.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  document.querySelectorAll('[data-external]').forEach(a => { a.setAttribute('target','_blank'); a.setAttribute('rel','noopener noreferrer'); });

  const sections = Array.from(document.querySelectorAll('main section'));
  const navLinks = Array.from(navList.querySelectorAll('a'));
  const setActive = () => {
    const pos = window.scrollY + 80;
    let currentId = 'hero';
    for (const sec of sections) if (sec.offsetTop <= pos) currentId = sec.id;
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + currentId));
  };
  window.addEventListener('scroll', setActive);
  setActive();

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.transition = 'opacity 500ms ease, transform 500ms ease'; e.target.style.opacity = 1; e.target.style.transform = 'translateY(0)'; io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  document.querySelectorAll('.project, .skill-card, .contact-card, .cert').forEach(el => { el.style.opacity = 0; el.style.transform = 'translateY(12px)'; io.observe(el); });

  function bindTilt(selector){
    document.querySelectorAll(selector).forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${x*6}deg) rotateX(${ -y*6}deg) translateY(-2px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(700px) rotateY(0) rotateX(0)';
      });
    });
  }
  bindTilt('.project, .skill-card, .contact-card, .cert');

  const i18n = window.__I18N__;
  function applyTranslations(lang) {
    const dict = i18n[lang] || i18n.uz;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const path = el.getAttribute('data-i18n');
      const value = path.split('.').reduce((acc, k) => acc && acc[k], dict);
      if (typeof value === 'string') el.textContent = value;
    });
    document.documentElement.lang = lang;
  }

  let savedLang = localStorage.getItem('lang') || 'uz';
  langSelect.value = savedLang;
  applyTranslations(savedLang);
  langSelect.addEventListener('change', () => {
    const lang = langSelect.value;
    localStorage.setItem('lang', lang);
    applyTranslations(lang);
  });

  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const result = document.getElementById('formResult');

    let valid = true;
    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';
    result.textContent = '';

    const lang = localStorage.getItem('lang') || 'uz';
    const t = {
      nameReq: { uz: 'Ism kiritilishi shart', en: 'Name is required', tr: 'İsim gerekli', ru: 'Введите имя' },
      emailReq: { uz: "To'g'ri email kiriting", en: 'Valid email required', tr: 'Geçerli e-posta gerekli', ru: 'Нужен корректный email' },
      msgShort: { uz: 'Xabar juda qisqa', en: 'Message too short', tr: 'Mesaj çok kısa', ru: 'Слишком короткое сообщение' },
      sent: { uz: 'Xabar yuborildi (demo)!', en: 'Message sent (demo)!', tr: 'Mesaj gönderildi (demo)!', ru: 'Сообщение отправлено (демо)!' }
    };

    if (!name.value.trim()) { nameError.textContent = t.nameReq[lang]; valid = false; }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    if (!emailOk) { emailError.textContent = t.emailReq[lang]; valid = false; }
    if (message.value.trim().length < 5) { messageError.textContent = t.msgShort[lang]; valid = false; }

    if (!valid) return;
    setTimeout(() => { result.textContent = t.sent[lang]; form.reset(); }, 400);
  });
})();
