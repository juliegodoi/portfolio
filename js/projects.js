/* =========================================================
  Projetos (repositórios do GitHub)
  Cada projeto tem textos em PT/EN e uma mini-cena animada.
  As cenas usam o mesmo motor das skills (data-at, data-type...).
  Para adicionar um projeto, copie um bloco do array PROJECTS.
========================================================= */
(function () {
  let n = 0;

  /* Texto traduzível: o PT vai no HTML e o EN é registrado em I18N_EN */
  const tx = (pt, en) => {
    const key = `pj.${++n}`;
    window.I18N_EN[key] = en;
    return `<span data-i18n="${key}">${pt}</span>`;
  };

  /* Texto digitado traduzível */
  const typed = (pt, en, at, speed = 40) => {
    const key = `pj.${++n}`;
    window.I18N_EN[key] = en;
    return `<span data-type="${pt}" data-i18n="${key}" data-at="${at}" data-speed="${speed}"></span>`;
  };

  const cmd = (text, speed = 40) => (
    `<p class="term__cmd"><span class="ok">$</span> <span data-type="${text}" data-at="200" data-speed="${speed}"></span></p>`
  );
  const afterCmd = (text, speed = 40) => 200 + text.length * speed + 350;

  /* Linha de resultado de um runner: ✓ verde, ⚠ âmbar */
  const lines = (start, step, items) => items.map((item, i) => (
    `<p class="pl ${item.cls || ''}" data-at="${start + i * step}">${item.html}</p>`
  )).join('');

  const ok = (html) => ({ html: `<span class="ok">✓</span> ${html}` });
  const warn = (html) => ({ html: `<span class="warn">⚠</span> ${html}`, cls: 'pl--warn' });
  const muted = (html) => ({ html, cls: 'muted' });

  const scenes = {
    lacrei() {
      const stages = [['push', 300], ['install', 900], ['cypress + cucumber', 1600], ['report', 2400]];
      return `
        <p class="ci__head muted">GitHub Actions · master</p>
        <div class="ci">
          ${stages.map(([label, at]) => `<span class="ci__stage" data-at="${at}" data-keep>${label}</span>`).join('<i class="ci__link"></i>')}
        </div>
        ${lines(2800, 400, [
          muted(tx('Funcionalidade: cadastro de paciente', 'Feature: patient sign-up')),
          ok(tx('Cenário: cadastro com dados válidos', 'Scenario: sign-up with valid data')),
          ok(tx('artefatos: report.html · vídeos', 'artifacts: report.html · videos')),
        ])}`;
    },

    serverestFront() {
      const c = 'npx playwright test';
      return cmd(c) + lines(afterCmd(c), 380, [
        ok(tx('cadastro › usuário comum', 'sign-up › regular user')),
        ok(tx('cadastro › administrador', 'sign-up › admin user')),
        ok(tx('cadastro › e-mail já em uso', 'sign-up › email already in use')),
        ok(tx('login › com sucesso', 'login › success')),
        ok(tx('login › senha incorreta', 'login › wrong password')),
      ]) + `<p class="pl run__foot" data-at="${afterCmd(c) + 2100}"><span class="ok">11 passed</span> <span class="pill">chromium</span><span class="pill">faker</span></p>`;
    },

    serverestApi() {
      const c = 'newman run ServeRest.postman_collection.json';
      const req = (method, path, status, cls = '') => (
        `<span class="verb verb--${method.toLowerCase()}">${method}</span> ${path} <b class="code ${cls}">${status}</b>`
      );
      return cmd(c, 26) + lines(afterCmd(c, 26), 380, [
        { html: req('POST', '/usuarios', '201') },
        { html: req('POST', '/login', '200') },
        { html: req('POST', `/produtos ${tx('(sem token)', '(no token)')}`, '401') },
        { html: req('GET', '/produtos/:id', '200') },
        warn(tx('token decodificável em Base64 expõe dados da sessão', 'token decodes from Base64 and exposes session data')),
      ]);
    },

    desktop() {
      return `
        <div class="todo">
          <div class="mock__bar"><i></i><i></i><i></i><span>To-Do · Electron</span></div>
          <div class="todo__body">
            <p class="todo__input">${typed('Revisar casos de teste', 'Review test cases', 300)}</p>
            <ul class="todo__list">
              <li class="todo__item"><span class="todo__check"></span>${tx('Estudar Playwright', 'Study Playwright')}</li>
              <li class="todo__item todo__item--new" data-at="1700">
                <span class="todo__check" data-at="2500" data-keep></span>
                ${tx('Revisar casos de teste', 'Review test cases')}
                <span class="todo__x" data-at="3500" data-keep>×</span>
              </li>
            </ul>
          </div>
        </div>
        ${lines(4300, 0, [{ html: `<span class="ok">✓ 3 passed</span> <span class="muted">· ${tx('3 prints de evidência', '3 evidence screenshots')}</span>`, cls: 'run__foot' }])}`;
    },

    selenium() {
      const c = 'mvn clean test';
      return cmd(c) + lines(afterCmd(c), 420, [
        muted('[INFO] Running CadastroTest'),
        ok('cadastroComSucesso'),
        ok('cadastroComEmailDuplicado'),
        muted('Tests run: 2, Failures: 0, Errors: 0'),
        { html: '<b class="ok">BUILD SUCCESS</b>' },
      ]);
    },

    webAutomation() {
      const c = 'npx cypress run';
      return cmd(c) + lines(afterCmd(c), 400, [
        ok(tx('login com sucesso', 'login succeeds')),
        ok(tx('login com e-mail inválido', 'login with invalid email')),
        ok(tx('login com senha inválida', 'login with invalid password')),
        ok(tx('cadastro com sucesso', 'sign-up succeeds')),
        warn(tx('nome só com espaço é aceito → bug reportado', 'blank-space name is accepted → bug reported')),
      ]);
    },

  };

  window.PROJECTS = [
    {
      repo: 'lacrei-qa',
      cat: 'web',
      title: 'Lacrei Saúde · QA',
      origin: tx('Teste técnico', 'Technical assessment'),
      desc: tx(
        'Suíte de testes do sistema de pacientes em staging: casos de teste manuais, bugs e sugestões de melhoria documentados, e automação do fluxo de cadastro com Cypress + Cucumber rodando no GitHub Actions.',
        'Test suite for the patient system in staging: documented manual test cases, bugs and improvement suggestions, plus sign-up flow automation with Cypress + Cucumber running on GitHub Actions.'
      ),
      tags: ['Cypress', 'Cucumber', 'GitHub Actions', 'Mochawesome'],
      loop: 7000,
      scene: scenes.lacrei,
    },
    {
      repo: 'serverest-front-tests',
      cat: 'web',
      title: 'ServeRest · Front-end',
      origin: tx('Projeto de estudo', 'Study project'),
      desc: tx(
        '11 cenários E2E de login e cadastro com Playwright e TypeScript, usando fixtures com Faker para gerar os dados. Os testes manuais e os bugs encontrados estão documentados no Notion.',
        '11 end-to-end login and sign-up scenarios with Playwright and TypeScript, using Faker fixtures to generate data. Manual tests and bugs found are documented in Notion.'
      ),
      tags: ['Playwright', 'TypeScript', 'Faker'],
      loop: 7000,
      scene: scenes.serverestFront,
    },
    {
      repo: 'serverest-api-tests',
      cat: 'api',
      title: 'ServeRest · API',
      origin: tx('Projeto de estudo', 'Study project'),
      desc: tx(
        'Coleção Postman executada com Newman, focada na jornada do administrador: autenticação, validade do token e regras de produtos. Nos testes, encontrei uma vulnerabilidade no token que expõe dados da sessão.',
        'Postman collection run with Newman, focused on the admin journey: authentication, token lifetime and product rules. While testing, I found a token vulnerability that exposes session data.'
      ),
      tags: ['Postman', 'Newman', 'REST'],
      loop: 7500,
      scene: scenes.serverestApi,
    },
    {
      repo: 'playwright-desktop',
      cat: 'desktop',
      title: 'To-Do · Desktop',
      origin: tx('Projeto de estudo', 'Study project'),
      desc: tx(
        'Automação de um aplicativo desktop em Electron com Playwright: criar, concluir e excluir tarefas, gerando prints como evidência de cada etapa.',
        'Automation of an Electron desktop app with Playwright: create, complete and delete tasks, saving screenshots as evidence of each step.'
      ),
      tags: ['Playwright', 'Electron', 'JavaScript'],
      loop: 6500,
      scene: scenes.desktop,
    },
    {
      repo: 'selenium-java',
      cat: 'web',
      title: 'ServeRest · Selenium',
      origin: tx('Projeto de estudo', 'Study project'),
      desc: tx(
        'Testes de interface do cadastro de usuários com Java, Selenium WebDriver e JUnit 5: cadastro com sucesso e bloqueio de e-mail duplicado, com relatório HTML gerado pelo Maven.',
        'UI tests for user sign-up with Java, Selenium WebDriver and JUnit 5: successful sign-up and duplicate-email blocking, with an HTML report generated by Maven.'
      ),
      tags: ['Java', 'Selenium', 'JUnit 5', 'Maven'],
      loop: 6500,
      scene: scenes.selenium,
    },
    {
      repo: 'web-automation',
      cat: 'web',
      title: tx('Login e cadastro · Cypress', 'Login & sign-up · Cypress'),
      origin: 'Bootcamp QA Turbo · QAZANDO',
      desc: tx(
        'Cenários manuais documentados (requisito, passos, resultado esperado e obtido), automação dos fluxos com Cypress e reporte do bug encontrado no cadastro.',
        'Documented manual scenarios (requirement, steps, expected and actual result), flow automation with Cypress and a report of the bug found in sign-up.'
      ),
      tags: ['Cypress', 'JavaScript'],
      loop: 6500,
      scene: scenes.webAutomation,
    },
  ];
})();
