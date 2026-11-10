/* =========================================================
  Julie Godoi — Portfólio QA
  JavaScript puro, organizado em pequenos módulos.
========================================================= */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;

/* ---------- Dados da stack (edite aqui para atualizar o site) ----------
  Cada item: [nome, o que é (PT), o que é (EN)].
  O ícone vem de icons.js pelo mesmo nome. */
const STACK = [
  {
    key: 'stack.daily',
    label: 'No dia a dia',
    desc: ['O que eu uso hoje no trabalho.', 'What I use at work today.'],
    items: [
      ['Playwright', 'testes E2E multinavegador', 'cross-browser E2E testing'],
      ['TypeScript', 'JavaScript com tipagem', 'typed JavaScript'],
      ['Docker', 'conteinerização', 'containerization'],
      ['Postgres', 'banco relacional open source', 'open-source relational database'],
      ['SQL', 'linguagem de consulta', 'query language'],
      ['Redmine', 'gestão de projetos e issues', 'project and issue tracking'],
      ['Appium', 'automação de apps mobile', 'mobile app automation'],
      ['Java', 'linguagem orientada a objetos', 'object-oriented language'],
      ['Selenium', 'automação de navegadores', 'browser automation'],
      ['Gherkin', 'escrita de cenários de teste', 'test scenario language'],
      ['BDD', 'guiado por comportamento', 'behavior-driven development'],
      ['Codex', 'agente de código da OpenAI', "OpenAI's coding agent"],
      ['Bruno', 'cliente de APIs', 'API client'],
    ],
  },
  {
    key: 'stack.known',
    label: 'Já trabalhei e conheço',
    desc: ['Ferramentas que já usei em outros trabalhos e projetos.', 'Tools I have used in other jobs and projects.'],
    items: [
      ['Cypress', 'testes E2E em JavaScript', 'JavaScript E2E testing'],
      ['Jest', 'testes unitários em JavaScript', 'JavaScript unit testing'],
      ['Postman', 'plataforma para APIs', 'API platform'],
      ['k6', 'testes de carga', 'load testing'],
      ['JavaScript', 'linguagem da web', 'language of the web'],
      ['HTML', 'estrutura de páginas web', 'web page markup'],
      ['CSS', 'estilização de páginas', 'web page styling'],
      ['SCSS', 'pré-processador de CSS', 'CSS preprocessor'],
      ['PHP', 'linguagem para back-end', 'back-end language'],
      ['React', 'biblioteca de interfaces', 'UI library'],
      ['Laravel', 'framework PHP', 'PHP framework'],
      ['MySQL', 'banco de dados relacional', 'relational database'],
      ['DBeaver', 'cliente de banco de dados', 'database client'],
      ['DevTools', 'ferramentas do navegador', 'browser developer tools'],
      ['Git', 'controle de versão', 'version control'],
      ['GitHub', 'hospedagem de código', 'code hosting'],
      ['Grafana', 'dashboards e monitoramento', 'dashboards and monitoring'],
      ['Jira', 'gestão de projetos ágeis', 'agile project management'],
      ['Trello', 'quadros kanban', 'kanban boards'],
      ['ClickUp', 'gestão de tarefas', 'task management'],
      ['Claude', 'assistente de IA da Anthropic', "Anthropic's AI assistant"],
      ['ChatGPT', 'assistente de IA da OpenAI', "OpenAI's AI assistant"],
      ['Gemini', 'assistente de IA do Google', "Google's AI assistant"],
      ['Cursor', 'editor de código com IA', 'AI code editor'],
      ['Antigravity', 'IDE com agentes do Google', "Google's agentic IDE"],
    ],
  },
];

/* Ícone genérico para itens sem logo (ex.: SQL) */
const FALLBACK_ICON = '<svg class="icon-line" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v13c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-13M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"/></svg>';

/* =========================================================
  Idioma (PT / EN)
  O português vem do próprio HTML; o inglês vem de i18n.js.
  Na primeira visita, segue o idioma do navegador (ver <head>).
 ========================================================= */
const I18N_PT = {
  'meta.title': document.title,
  'meta.description': document.querySelector('meta[name="description"]').content,
  'nav.open': 'Abrir menu',
  'nav.close': 'Fechar menu',
};

const t = (key) => {
  const dict = root.dataset.lang === 'en' ? window.I18N_EN : I18N_PT;
  return (dict && dict[key]) ?? I18N_PT[key] ?? key;
};

/* Guarda o texto original (PT) de cada elemento traduzível */
function captureDefaults() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    I18N_PT[el.dataset.i18n] = el.dataset.type ?? el.textContent.trim().replace(/\s+/g, ' ');
  });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    I18N_PT[el.dataset.i18nHtml] = el.innerHTML.trim().replace(/\s+/g, ' ');
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    I18N_PT[el.dataset.i18nAria] = el.getAttribute('aria-label');
  });
}

function applyLang(lang) {
  root.dataset.lang = lang;
  root.lang = lang === 'en' ? 'en' : 'pt-BR';
  document.title = t('meta.title');
  document.querySelector('meta[name="description"]').content = t('meta.description');

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = t(el.dataset.i18n);
    if (el.dataset.type !== undefined) {
      // texto digitado nas cenas: troca o alvo; se já estava escrito, atualiza na hora
      el.dataset.type = value;
      if (el.textContent) el.textContent = value;
    } else if (el.hasAttribute('data-scramble')) {
      cancelAnimationFrame(el._scramble);
      el.dataset.final = value;
      el.setAttribute('aria-label', value);
      el.textContent = value;
    } else {
      el.textContent = value;
    }
  });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });
  document.querySelectorAll('[data-set-lang]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.setLang === lang));
  });

  const toggle = document.querySelector('.nav__toggle');
  if (toggle) toggle.setAttribute('aria-label', t(toggle.getAttribute('aria-expanded') === 'true' ? 'nav.close' : 'nav.open'));
}

function initLang() {
  captureDefaults();
  applyLang(root.dataset.lang === 'en' ? 'en' : 'pt');

  document.querySelectorAll('[data-set-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.setLang;
      if (lang === root.dataset.lang) return;
      try { localStorage.setItem('jg-lang', lang); } catch (e) { /* modo privado */ }
      applyLang(lang);
      document.querySelectorAll('.section__title[data-scramble]').forEach((el) => scramble(el, 700));
    });
  });
}

/* =========================================================
  Tema claro / escuro
  Na primeira visita, segue a preferência do sistema.
========================================================= */
function initTheme() {
  const btn = document.querySelector('.theme-toggle');
  const media = window.matchMedia('(prefers-color-scheme: light)');

  const setTheme = (theme, save) => {
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'light' ? '#F7F8F6' : '#0B0D0E';
    if (save) {
      try { localStorage.setItem('jg-theme', theme); } catch (e) { /* modo privado */ }
    }
    document.dispatchEvent(new CustomEvent('themechange'));
  };

  setTheme(root.dataset.theme === 'light' ? 'light' : 'dark', false);

  btn.addEventListener('click', () => {
    root.classList.add('theme-anim');
    setTheme(root.dataset.theme === 'light' ? 'dark' : 'light', true);
    setTimeout(() => root.classList.remove('theme-anim'), 400);
  });

  // Se a pessoa nunca escolheu, acompanha mudanças do sistema
  media.addEventListener('change', (e) => {
    let saved = null;
    try { saved = localStorage.getItem('jg-theme'); } catch (err) { /* modo privado */ }
    if (!saved) setTheme(e.matches ? 'light' : 'dark', false);
  });
}

/* ---------- Typewriter ---------- */
function typeWriter(el, speed = 70) {
  const text = el.dataset.text || '';
  if (REDUCED_MOTION) {
    el.textContent = text;
    return Promise.resolve();
  }
  el.textContent = '';
  let i = 0;
  return new Promise((resolve) => {
    const tick = () => {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(tick, speed + Math.random() * 40);
      else resolve();
    };
    tick();
  });
}

function initTypewriters() {
  document.querySelectorAll('.type').forEach((el) => setTimeout(() => typeWriter(el), 300));
}

/* ---------- Boot sequence do hero (spinner → [ OK ]) ---------- */
function initBoot() {
  const code = document.querySelector('.boot code');
  if (!code) return;
  const lines = code.innerHTML.split('\n');
  code.innerHTML = lines.map((l) => `<span class="line">${l}</span>`).join('');

  const frames = ['|', '/', '-', '\\'];
  code.querySelectorAll('.line').forEach((line, i) => {
    const status = line.querySelector('.ok');
    if (REDUCED_MOTION) {
      line.classList.add('is-on');
      return;
    }
    status.classList.replace('ok', 'is-pending');
    status.textContent = '[ .. ]';

    setTimeout(() => {
      line.classList.add('is-on');
      let f = 0;
      const spin = setInterval(() => {
        status.textContent = `[ ${frames[f % 4]}${frames[f % 4]} ]`;
        f++;
      }, 70);
      setTimeout(() => {
        clearInterval(spin);
        status.classList.replace('is-pending', 'ok');
        status.textContent = '[ OK ]';
      }, 520);
    }, 600 + i * 450);
  });
}

/* ---------- Texto "decodificando" (scramble) ---------- */
const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#01';

function scramble(el, duration = 550) {
  const final = el.dataset.final || el.textContent;
  el.dataset.final = final;
  if (REDUCED_MOTION) return;
  cancelAnimationFrame(el._scramble);
  const start = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const solved = Math.floor(p * final.length);
    el.textContent = [...final].map((ch, i) => (
      i < solved || ch === ' ' ? ch : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
    )).join('');
    if (p < 1) el._scramble = requestAnimationFrame(step);
  };
  el._scramble = requestAnimationFrame(step);
}

function initScramble() {
  document.querySelectorAll('[data-scramble]').forEach((el) => {
    el.dataset.final = el.textContent;
    el.setAttribute('aria-label', el.textContent);
    el.addEventListener('mouseenter', () => scramble(el));
    el.addEventListener('focus', () => scramble(el));
  });

  const name = document.querySelector('.hero__name');
  if (name) setTimeout(() => scramble(name, 1100), 200);

  // Títulos das seções "decodificam" quando aparecem na tela
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      scramble(entry.target, 900);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.section__title[data-scramble]').forEach((el) => observer.observe(el));
}

/* =========================================================
  Avatar em ASCII
  Desenha em <canvas> a partir de AVATAR_ASCII (avatar-ascii.js):
  cada célula guarda um brilho de 0 a f, que vira um caractere.
  Há uma versão para cada tema (no claro, os tons são invertidos).
  - entrada: as linhas "compilam" de cima para baixo
  - mouse: os caracteres por perto embaralham na cor de destaque
  - ocioso: pequenos glitches de linha de vez em quando
  - clique: redesenha
========================================================= */
const ASCII_RAMP = " .'`:-~=+*x#%&@@";
const ASCII_GLYPHS = '01<>/\\{}[]#*+=-:;$';

function initAsciiAvatar() {
  const fig = document.querySelector('.avatar');
  const canvas = fig && fig.querySelector('.avatar__canvas');
  const src = window.AVATAR_ASCII;
  if (!canvas || !src) return;

  const ctx = canvas.getContext('2d');
  const { cols, rows } = src;
  const total = cols * rows;

  const parse = (lines) => {
    const out = new Uint8Array(total);
    lines.forEach((line, r) => {
      for (let c = 0; c < cols; c++) out[r * cols + c] = parseInt(line[c], 16);
    });
    return out;
  };
  const maps = { dark: parse(src.dark), light: parse(src.light) };

  const revealAt = new Float32Array(total);
  const randomGlyph = () => ASCII_GLYPHS[Math.floor(Math.random() * ASCII_GLYPHS.length)];

  let levels = maps.dark;
  let ink = '213, 221, 216';
  let accent = '74, 222, 128';
  let minAlpha = 0.16;   // opacidade dos caracteres mais fracos
  let weight = 500;
  let cw = 0, ch = 0, dpr = 1;
  let start = 0, last = 0, raf = 0, visible = false;
  let mouse = { x: -1e4, y: -1e4 };
  let glitch = { row: -1, shift: 0, until: 0 };

  const readTheme = () => {
    const styles = getComputedStyle(root);
    const light = root.dataset.theme === 'light';
    ink = styles.getPropertyValue('--ascii-ink').trim();
    accent = styles.getPropertyValue('--ascii-accent').trim();
    levels = light ? maps.light : maps.dark;
    // No fundo claro, traço mais forte e mais opaco para manter o contraste
    minAlpha = light ? 0.38 : 0.16;
    weight = light ? 600 : 500;
    ctx.font = `${weight} ${ch}px "Fira Code", monospace`;
  };

  const schedule = () => {
    start = performance.now();
    for (let i = 0; i < total; i++) {
      const r = Math.floor(i / cols);
      revealAt[i] = 150 + (r / rows) * 1300 + Math.random() * 450;
    }
  };

  const resize = () => {
    const size = fig.clientWidth;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    cw = canvas.width / cols;
    ch = canvas.height / rows;
    ctx.font = `${weight} ${ch}px "Fira Code", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  };

  const draw = (now) => {
    const t = now - start;
    const radius = canvas.width * 0.14;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!REDUCED_MOTION && now > glitch.until && Math.random() < 0.012) {
      glitch = {
        row: Math.floor(Math.random() * rows),
        shift: Math.round((Math.random() - 0.5) * 8),
        until: now + 90 + Math.random() * 140,
      };
    }
    const glitchOn = now < glitch.until;

    for (let r = 0; r < rows; r++) {
      const y = (r + 0.5) * ch;
      const shift = glitchOn && Math.abs(r - glitch.row) < 2 ? glitch.shift * cw : 0;

      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const lv = levels[i];
        const x = (c + 0.5) * cw + shift;
        const left = revealAt[i] - t;

        // Ainda "compilando": ruído colorido antes do caractere final
        if (left > 0) {
          if (left < 420 && (lv > 0 || Math.random() < 0.05)) {
            ctx.fillStyle = `rgba(${accent}, ${0.25 + Math.random() * 0.4})`;
            ctx.fillText(randomGlyph(), x, y);
          }
          continue;
        }
        if (lv === 0) continue;

        const d = Math.hypot(x - mouse.x, y - mouse.y);
        const near = d < radius ? 1 - d / radius : 0;
        const alpha = minAlpha + (lv / 15) * (1 - minAlpha);

        if (near > 0 && Math.random() < near * 0.45) {
          ctx.fillStyle = `rgba(${accent}, ${Math.min(1, alpha + 0.2)})`;
          ctx.fillText(randomGlyph(), x, y);
        } else if (Math.random() < 0.0008) {
          ctx.fillStyle = `rgba(${accent}, .8)`;
          ctx.fillText(randomGlyph(), x, y);
        } else {
          ctx.fillStyle = `rgba(${ink}, ${alpha})`;
          ctx.fillText(ASCII_RAMP[lv], x, y);
        }
      }
    }
  };

  const loop = (now) => {
    raf = requestAnimationFrame(loop);
    if (now - last < 1000 / 24) return; // ~24 fps, ritmo de terminal
    last = now;
    draw(now);
  };

  const startLoop = () => {
    if (REDUCED_MOTION) {
      start = -1e9;
      draw(performance.now());
      return;
    }
    if (!raf) raf = requestAnimationFrame(loop);
  };
  const stopLoop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  fig.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse = { x: (e.clientX - rect.left) * dpr, y: (e.clientY - rect.top) * dpr };
  });
  fig.addEventListener('pointerleave', () => { mouse = { x: -1e4, y: -1e4 }; });
  fig.addEventListener('click', () => { if (!REDUCED_MOTION) schedule(); });

  // Troca de tema: novas cores e redesenho rápido
  document.addEventListener('themechange', () => {
    readTheme();
    if (REDUCED_MOTION) draw(performance.now());
    else schedule();
  });

  new ResizeObserver(() => {
    resize();
    if (REDUCED_MOTION || !visible) draw(performance.now());
  }).observe(fig);

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) startLoop();
    else stopLoop();
  }).observe(fig);

  readTheme();
  resize();
  // Espera a Fira Code carregar para não desenhar com a fonte de fallback
  document.fonts.ready.then(() => {
    resize();
    schedule();
    if (visible) startLoop();
  });
}

/* ---------- Stack ---------- */
function renderStack() {
  const list = document.getElementById('stack-list');
  if (!list) return;

  const icons = window.STACK_ICONS || {};
  const en = window.I18N_EN;
  let n = 0;

  list.innerHTML = STACK.map((group) => {
    en[`${group.key}.desc`] = group.desc[1];
    const tools = group.items.map(([name, pt, enText]) => {
      const key = `stack.item.${name.toLowerCase().replace(/\W/g, '')}`;
      en[key] = enText;
      return `
        <li class="tool" style="--i:${n++}">
          <span class="tool__icon" aria-hidden="true">${icons[name] || FALLBACK_ICON}</span>
          <span class="tool__text"><b>${name}</b><small data-i18n="${key}">${pt}</small></span>
        </li>`;
    }).join('');

    return `
      <section class="stack__group">
        <header class="stack__head">
          <h3><span data-i18n="${group.key}">${group.label}</span></h3>
          <p data-i18n="${group.key}.desc">${group.desc[0]}</p>
        </header>
        <ul class="stack__grid">${tools}</ul>
      </section>`;
  }).join('');
}

/* =========================================================
  Cenas das skills
  Cada elemento com data-at="ms" ganha .is-on nesse momento.
  - data-type="texto"  → digita o texto
  - data-count="200"   → conta de 0 até o valor (data-suffix opcional)
  - data-keep          → não começa invisível, só troca de estado
  A cena roda em loop (data-loop="ms") enquanto estiver visível.
========================================================= */
function buildBars(scene) {
  scene.querySelectorAll('[data-bars]').forEach((wrap) => {
    const values = wrap.dataset.bars.split(',').map(Number);
    wrap.innerHTML = values.map((v, i) => `<span style="--h:${v}%;--i:${i}"></span>`).join('');
  });
}

function createScene(scene) {
  const steps = [...scene.querySelectorAll('[data-at]')];
  const loop = Number(scene.dataset.loop) || 8000;
  let timers = [];

  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  const typeText = (el) => {
    const text = el.dataset.type;
    const speed = Number(el.dataset.speed) || 45;
    el.classList.add('typing');
    text.split('').forEach((_, i) => {
      later(() => {
        el.textContent = text.slice(0, i + 1);
        if (i === text.length - 1) el.classList.remove('typing');
      }, i * speed);
    });
  };

  const countUp = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const frames = 24;
    for (let f = 1; f <= frames; f++) {
      later(() => {
        const eased = 1 - Math.pow(1 - f / frames, 3);
        el.textContent = Math.round(target * eased) + suffix;
      }, f * 40);
    }
  };

  const activate = (el, instant) => {
    el.classList.add('is-on');
    if (el.dataset.type !== undefined) {
      if (instant) el.textContent = el.dataset.type;
      else typeText(el);
    }
    if (el.dataset.count !== undefined) {
      if (instant) el.textContent = el.dataset.count + (el.dataset.suffix || '');
      else countUp(el);
    }
  };

  const reset = () => {
    timers.forEach(clearTimeout);
    timers = [];
    steps.forEach((el) => {
      el.classList.remove('is-on', 'typing');
      if (el.dataset.type !== undefined) el.textContent = '';
      if (el.dataset.count !== undefined) el.textContent = '0' + (el.dataset.suffix || '');
    });
  };

  const play = () => {
    reset();
    if (REDUCED_MOTION) {
      steps.forEach((el) => activate(el, true));
      return;
    }
    steps.forEach((el) => later(() => activate(el), Number(el.dataset.at)));
    later(play, loop);
  };

  reset();
  return { play, stop: reset };
}

function initScenes() {
  const scenes = document.querySelectorAll('.scene');
  const controllers = new Map();

  scenes.forEach((scene) => {
    buildBars(scene);
    controllers.set(scene, createScene(scene));
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const ctrl = controllers.get(entry.target);
      if (entry.isIntersecting) ctrl.play();
      else if (!REDUCED_MOTION) ctrl.stop();
    });
  }, { threshold: 0.4 });

  scenes.forEach((scene) => observer.observe(scene));
}

/* =========================================================
  Projetos: cards gerados a partir de PROJECTS (projects.js)
========================================================= */
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid || !window.PROJECTS) return;

  grid.innerHTML = window.PROJECTS.map((p) => `
    <article class="project reveal" data-cat="${p.cat}">
      <div class="project__visual" aria-hidden="true">
        <div class="scene scene--mini" data-loop="${p.loop}">${p.scene()}</div>
      </div>
      <div class="project__body">
        <p class="project__origin">${p.origin}</p>
        <h3 class="project__title">${p.title}</h3>
        <p class="project__desc">${p.desc}</p>
        <ul class="project__tags">${p.tags.map((tag) => `<li>${tag}</li>`).join('')}</ul>
        <a class="project__link" href="https://github.com/juliegodoi/${p.repo}" target="_blank" rel="noopener">
          <span class="project__repo">github.com/juliegodoi/${p.repo}</span>
          <span class="project__arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  `).join('');
}

/* Filtros por categoria, com contagem e transição suave */
function initFilters() {
  const buttons = document.querySelectorAll('.filter');
  const cards = [...document.querySelectorAll('.project')];
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    const cat = btn.dataset.filter;
    const count = cat === 'all' ? cards.length : cards.filter((c) => c.dataset.cat === cat).length;
    btn.querySelector('small').textContent = count;
    if (!count) btn.hidden = true;

    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));

      // Guarda onde cada card visível estava antes de filtrar
      const before = new Map(cards.filter((c) => !c.hidden).map((c) => [c, c.getBoundingClientRect()]));

      // Esconde/mostra de uma vez: o grid se reorganiza sem buracos
      cards.forEach((card) => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.hidden = !show;
        if (show) card.classList.add('is-visible');
      });
      if (REDUCED_MOTION) return;

      // Anima a partir da posição antiga (técnica FLIP): quem fica desliza, quem volta aparece
      cards.filter((c) => !c.hidden).forEach((card) => {
        const old = before.get(card);
        if (old) {
          const now = card.getBoundingClientRect();
          const dx = old.left - now.left;
          const dy = old.top - now.top;
          if (dx || dy) {
            card.animate(
              [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
              { duration: 450, easing: 'cubic-bezier(.2, .8, .2, 1)' }
            );
          }
        } else {
          card.animate(
            [{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }],
            { duration: 350, easing: 'ease-out' }
          );
        }
      });
    });
  });
}

/* =========================================================
  Trajetória: abas (Experiência / Formação)
  ========================================================= */
function initTabs() {
  const tabs = [...document.querySelectorAll('.tab')];
  const ink = document.querySelector('.tabs__ink');
  if (!tabs.length) return;

  const moveInk = (tab) => {
    ink.style.width = `${tab.offsetWidth}px`;
    ink.style.transform = `translateX(${tab.offsetLeft}px)`;
  };

  const select = (tab) => {
    tabs.forEach((t) => {
      const active = t === tab;
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      panel.hidden = !active;
      if (active) {
        panel.classList.remove('is-entering');
        void panel.offsetWidth; // reinicia a animação de entrada
        panel.classList.add('is-entering');
      }
    });
    moveInk(tab);
    if (tab.id === 'tab-edu') animateEdu();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    // Setas do teclado trocam de aba (padrão de acessibilidade de tabs)
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      next.focus();
      select(next);
    });
  });

  // Recalcula a barrinha quando o texto muda de idioma ou a tela muda de tamanho
  const current = () => tabs.find((t) => t.getAttribute('aria-selected') === 'true');
  new ResizeObserver(() => moveInk(current())).observe(document.querySelector('.tabs'));
  document.fonts.ready.then(() => moveInk(current()));
}

/* Progresso do curso calculado pela data de hoje */
function animateEdu() {
  const wrap = document.querySelector('.edu__progress');
  if (!wrap) return;
  const start = new Date(wrap.dataset.start).getTime();
  const end = new Date(wrap.dataset.end).getTime();
  const elapsed = Math.min(1, Math.max(0, (Date.now() - start) / (end - start)));

  const semesters = wrap.querySelectorAll('.semesters li');
  // Conta só semestres já concluídos (ex.: 5 de 6 = 83%)
  const doneCount = elapsed >= 1 ? semesters.length : Math.floor(elapsed * semesters.length);
  const pct = Math.round((doneCount / semesters.length) * 100);
  semesters.forEach((li, i) => {
    li.classList.remove('is-done', 'is-current');
    setTimeout(() => {
      if (i < doneCount) li.classList.add('is-done');
      else if (i === doneCount && pct < 100) li.classList.add('is-current');
    }, REDUCED_MOTION ? 0 : 150 + i * 120);
  });

  const bar = wrap.querySelector('.edu__bar i');
  const value = wrap.querySelector('.edu__value');
  bar.style.width = '0';
  requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = `${pct}%`; }));

  if (REDUCED_MOTION) {
    value.textContent = `${pct}%`;
    return;
  }
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - t0) / 1200);
    value.textContent = `${Math.round(pct * (1 - Math.pow(1 - p, 3)))}%`;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* Linha do tempo: a linha "se desenha" conforme a rolagem */
function initTimeline() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;
  const items = timeline.querySelectorAll('.tl');

  const update = () => {
    const rect = timeline.getBoundingClientRect();
    const middle = window.innerHeight * 0.6;
    const progress = Math.min(1, Math.max(0, (middle - rect.top) / rect.height));
    timeline.style.setProperty('--fill', progress.toFixed(4));
    items.forEach((item) => {
      item.classList.toggle('is-reached', item.getBoundingClientRect().top < middle);
    });
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* =========================================================
  Avatares em pixels (estilo identicon)
  Cada nome gera sempre o mesmo desenho 5×5, espelhado no meio.
========================================================= */
function hashString(text) {
  // FNV-1a: transforma o nome num número estável
  let h = 2166136261;
  for (const ch of text) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function initPixelAvatars() {
  document.querySelectorAll('.px-avatar').forEach((el) => {
    let bits = hashString(el.dataset.seed);
    const cells = [];
    for (let r = 0; r < 5; r++) {
      const row = [];
      for (let c = 0; c < 3; c++) {
        row.push(bits & 1);
        bits >>>= 1;
      }
      cells.push(...row, row[1], row[0]); // espelha as colunas 0 e 1
    }
    el.innerHTML = cells.map((on) => `<i class="${on ? 'on' : ''}"></i>`).join('');
  });
}

/* Efeito "recompilar": o avatar vira ruído e volta ao desenho */
function glitchAvatar(el) {
  if (!el || REDUCED_MOTION) return;
  const cells = [...el.children];
  let frame = 0;
  clearInterval(el._glitch);
  el._glitch = setInterval(() => {
    cells.forEach((cell, i) => {
      const settled = i < (frame / 8) * cells.length;
      cell.classList.toggle('noise', !settled && Math.random() < 0.45);
    });
    if (++frame > 8) {
      clearInterval(el._glitch);
      cells.forEach((cell) => cell.classList.remove('noise'));
    }
  }, 60);
}

/* Depoimentos: destaque passa de um card para o outro */
function initQuotes() {
  const quotes = [...document.querySelectorAll('.quote')];
  if (quotes.length < 2 || REDUCED_MOTION) return;
  let i = 0;
  let timer = null;
  const highlight = () => {
    quotes.forEach((q, j) => {
      const active = j === i;
      if (active && !q.classList.contains('is-active')) glitchAvatar(q.querySelector('.px-avatar'));
      q.classList.toggle('is-active', active);
    });
    i = (i + 1) % quotes.length;
  };
  const section = document.getElementById('depoimentos');
  new IntersectionObserver(([entry]) => {
    clearInterval(timer);
    if (entry.isIntersecting) {
      highlight();
      timer = setInterval(highlight, 4000);
    }
  }, { threshold: 0.3 }).observe(section);
  // Ao passar o mouse, o card sob o cursor assume o destaque
  quotes.forEach((q, j) => q.addEventListener('mouseenter', () => { i = j; highlight(); }));
}

/* =========================================================
   Contato: caça ao bug (interativo)
   O bug passeia pela janela. Com o mouse, o cursor vira uma lupa;
   clicar (ou tocar) no bug esmaga e mostra um ✓. Sem interação,
   o bug só continua andando.
   ========================================================= */
function initQaArt() {
  const art = document.querySelector('.qa-art');
  if (!art) return;

  const body = art.querySelector('.qa-art__body');
  const bug = art.querySelector('.qa-bug');
  const lens = art.querySelector('.qa-lens');
  const fx = art.querySelector('.qa-fx');
  const glyphs = [...art.querySelectorAll('.qa-burst i')];
  const hint = art.querySelector('.qa-hint');
  const score = art.querySelector('.qa-score');
  const scoreValue = score.querySelector('b');
  const status = art.querySelector('.qa-status');
  const statusText = art.querySelector('.qa-status__text');

  // textos de status em PT (o EN vem de i18n.js)
  Object.assign(I18N_PT, {
    'qa.pop': 'corrigido!',
    'qa.searching': 'procurando',
    'qa.found': 'bug encontrado',
    'qa.fixed': 'corrigido',
    'qa.hintTouch': 'toque no bug para corrigir',
  });
  if (window.matchMedia('(hover: none)').matches) {
    hint.dataset.i18n = 'qa.hintTouch';
    hint.textContent = t('qa.hintTouch');
  }

  const SPEED = 75;          // px por segundo passeando
  const FLEE_SPEED = 240;    // px por segundo fugindo

  let mode = 'off';          // off | walking | caught
  let visible = false;
  let pointer = null;        // posição do mouse dentro da janela
  let walkTimer = null;
  let flees = 0;
  let caught = 0;

  const rand = (min, max) => min + Math.random() * (max - min);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const setStatus = (state, key) => {
    status.dataset.state = state;
    statusText.dataset.i18n = key;
    statusText.textContent = t(key);
  };
  const place = (el, x, y) => { el.style.transform = `translate(${x}px, ${y}px)`; };
  const jump = (el, x, y) => {
    el.style.transition = 'none';
    place(el, x, y);
    void el.offsetWidth;
    el.style.transition = '';
  };
  const restart = (el, cls) => {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  };

  // posição real do bug agora (mesmo no meio de um movimento)
  const bugPos = () => {
    const b = body.getBoundingClientRect();
    const r = bug.getBoundingClientRect();
    return { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height / 2 };
  };

  // anda até (x, y) virado para a direção do movimento
  const moveTo = (x, y, speed = SPEED) => {
    const from = bugPos();
    const dist = Math.hypot(x - from.x, y - from.y);
    const duration = Math.max(0.3, dist / speed);
    bug.style.setProperty('--rot', `${Math.atan2(y - from.y, x - from.x) * 180 / Math.PI + 90}deg`);
    bug.style.transition = `transform ${duration}s linear, opacity .3s`;
    place(bug, x, y);
    clearTimeout(walkTimer);
    walkTimer = setTimeout(wander, duration * 1000 + rand(150, 700));
  };

  const wander = () => {
    if (mode !== 'walking' || REDUCED_MOTION) return;
    const w = body.clientWidth;
    const h = body.clientHeight;
    moveTo(rand(w * 0.12, w * 0.88), rand(h * 0.15, h * 0.78));
  };

  const spawn = () => {
    if (!visible) { mode = 'off'; return; }
    const w = body.clientWidth;
    const h = body.clientHeight;
    bug.classList.remove('is-squashed');
    flees = 0;
    mode = 'walking';
    if (REDUCED_MOTION) {
      jump(bug, rand(w * 0.25, w * 0.75), rand(h * 0.25, h * 0.7));
      bug.style.opacity = '1';
      return;
    }
    // entra por um dos lados
    const fromLeft = Math.random() < 0.5;
    jump(bug, fromLeft ? -30 : w + 30, rand(h * 0.2, h * 0.75));
    bug.style.opacity = '1';
    bug.classList.add('is-walking');
    if (!pointer) setStatus('watch', 'qa.watching');
    wander();
  };

  const catchBug = async () => {
    if (mode !== 'walking') return;
    mode = 'caught';
    clearTimeout(walkTimer);

    // congela o bug onde ele está
    const p = bugPos();
    bug.style.transition = 'none';
    place(bug, p.x, p.y);
    bug.classList.remove('is-walking');

    bug.style.transition = '';
    bug.classList.add('is-squashed');
    if (!pointer) lens.classList.remove('is-on', 'is-found');

    // o efeito fica sempre um pouco para dentro, para não ser cortado na borda
    const w = body.clientWidth;
    const h = body.clientHeight;
    const fxX = Math.min(w - 56, Math.max(56, p.x));
    const fxY = Math.min(h - 44, Math.max(84, p.y));

    // sorteia caractere, direção e giro de cada fragmento
    glyphs.forEach((g, i) => {
      const angle = (i / glyphs.length) * Math.PI * 2 + rand(-0.3, 0.3);
      const radius = rand(46, 84);
      g.textContent = '01{};<>/#*'[Math.floor(Math.random() * 10)];
      g.style.setProperty('--dx', `${Math.cos(angle) * radius}px`);
      g.style.setProperty('--dy', `${Math.sin(angle) * radius}px`);
      g.style.setProperty('--r', `${rand(-160, 160)}deg`);
    });

    place(fx, fxX, fxY);
    if (REDUCED_MOTION) fx.classList.add('is-static');
    else {
      restart(fx, 'is-on');
      restart(body, 'is-flash');
    }
    setStatus('fixed', 'qa.fixed');

    caught += 1;
    scoreValue.textContent = caught;
    score.classList.add('is-on');
    restart(score, 'is-bump');
    hint.classList.add('is-hidden');

    await sleep(1700);
    bug.style.opacity = '0';
    fx.classList.remove('is-on', 'is-static');
    await sleep(500);
    if (pointer) setStatus('scan', 'qa.searching');
    spawn();
  };

  // ---------- interação ----------
  const localPoint = (e) => {
    const b = body.getBoundingClientRect();
    return { x: e.clientX - b.left, y: e.clientY - b.top };
  };

  body.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse') return;
    pointer = localPoint(e);
    body.classList.add('is-hunting');
    lens.classList.remove('is-found');
    lens.classList.add('is-on', 'is-follow');
    place(lens, pointer.x, pointer.y);
    setStatus('scan', 'qa.searching');
  });

  body.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    pointer = localPoint(e);
    place(lens, pointer.x, pointer.y);
    if (mode !== 'walking') return;

    const p = bugPos();
    const dist = Math.hypot(p.x - pointer.x, p.y - pointer.y);
    const near = dist < 24;
    lens.classList.toggle('is-found', near);
    setStatus(near ? 'found' : 'scan', near ? 'qa.found' : 'qa.searching');

    // o bug foge um pouco quando a lupa chega perto (no máximo 2 vezes)
    if (!REDUCED_MOTION && dist < 70 && dist > 24 && flees < 2) {
      flees += 1;
      const w = body.clientWidth;
      const h = body.clientHeight;
      const len = dist || 1;
      const x = Math.min(w - 20, Math.max(20, p.x + ((p.x - pointer.x) / len) * 110));
      const y = Math.min(h - 30, Math.max(20, p.y + ((p.y - pointer.y) / len) * 110));
      moveTo(x, y, FLEE_SPEED);
    }
  });

  body.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse') return;
    pointer = null;
    body.classList.remove('is-hunting');
    lens.classList.remove('is-on', 'is-follow', 'is-found');
    if (mode === 'walking') setStatus('watch', 'qa.watching');
  });

  // clique/toque perto do bug conta como acerto
  body.addEventListener('pointerdown', (e) => {
    if (mode !== 'walking') return;
    const q = localPoint(e);
    const p = bugPos();
    if (Math.hypot(p.x - q.x, p.y - q.y) < 32) catchBug();
  });

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && mode === 'off') spawn();
  }, { threshold: 0.3 }).observe(art);
}

/* ---------- Borda que acompanha o mouse nos cards ---------- */
function initSpotlight() {
  document.querySelectorAll('.skill, .pillar, .contact__item, .project, .tl__card, .quote').forEach((card) => {
    card.classList.add('spot');
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
}

/* ---------- Linha de progresso da rolagem ---------- */
function initScrollLine() {
  const toTop = document.querySelector('.to-top');
  const update = () => {
    const max = root.scrollHeight - root.clientHeight;
    root.style.setProperty('--progress', max > 0 ? (root.scrollTop / max).toFixed(4) : 0);
    // botão "voltar ao topo" aparece depois de passar do hero
    if (toTop) toTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
  };
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
      document.querySelector('.nav__brand').focus({ preventScroll: true });
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  els.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 80}ms`;
    observer.observe(el);
  });
}

/* ---------- Navegação mobile + link ativo ---------- */
function initNav() {
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('nav-menu');
  const links = menu.querySelectorAll('a');

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', t(open ? 'nav.close' : 'nav.open'));
  };

  toggle.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
  links.forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

  // Destaca a seção visível no menu
  const sections = [...links].map((a) => document.querySelector(a.getAttribute('href')));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => s && observer.observe(s));
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  renderStack();      // antes do idioma, para as linhas também serem traduzidas
  renderProjects();
  initScramble();
  initLang();
  initTheme();
  initNav();
  initAsciiAvatar();
  initBoot();
  initTypewriters();
  initScenes();
  initFilters();
  initTabs();
  initTimeline();
  initPixelAvatars();
  initQuotes();
  initQaArt();
  initSpotlight();
  initScrollLine();
  initReveal();
});
