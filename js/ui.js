/* ═══════════════════════════════════════════════════
   UI — Interface rendering & helpers
   ═══════════════════════════════════════════════════ */

const UI = {

  openModal(id)  { document.getElementById(id).classList.add('open'); },
  closeModal(id) { document.getElementById(id).classList.remove('open'); },

  showErr(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.classList.add('show');
  },
  hideErr(id) { document.getElementById(id).classList.remove('show'); },

  togglePass(inputId, btn) {
    const el = document.getElementById(inputId);
    el.type  = el.type === 'password' ? 'text' : 'password';
    btn.textContent = el.type === 'password' ? 'Mostrar' : 'Ocultar';
  },

  /* ── Toast ── */
  _toastTimer: null,
  toast(msg, type = 'info') {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.style.background =
      type === 'error'   ? '#9b2335' :
      type === 'success' ? '#1e5c38' : '#1a0a00';
    el.style.display = 'block';
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.style.display = 'none', 3500);
  },

  /* ── Overlays ── */
  closeOverlay(id) { document.getElementById(id).classList.add('hidden'); },
  closeAllOverlays() {
    ['profile-overlay', 'ranking-overlay']
      .forEach(id => document.getElementById(id).classList.add('hidden'));
  },

  /* ── Tab navigation ── */
  showTab(tab) {
    document.querySelectorAll('.bnav-btn')
      .forEach(b => b.classList.toggle('active', b.dataset.view === tab));
    if (tab === 'map') {
      this.closeAllOverlays();
    } else if (tab === 'ranking') {
      this.closeAllOverlays();
      this.renderRanking();
      document.getElementById('ranking-overlay').classList.remove('hidden');
    } else if (tab === 'profile') {
      this.closeAllOverlays();
      if (App.currentUser) {
        this.renderProfile();
        document.getElementById('profile-overlay').classList.remove('hidden');
      } else {
        Auth.showModal('login');
      }
    } else if (tab === 'add') {
      Auth.requireLogin(() => Map.startAdd());
    }
  },

  /* ── Topbar ── */
  renderTopbar() {
    const el = document.getElementById('tb-right');
    if (App.currentUser) {
      const lv  = Gamification.getLevel(App.currentUser.points || 0);
      const ini = App.currentUser.avatar || App.currentUser.name[0];
      el.innerHTML = `
        <button class="tbtn tbtn-add" id="add-btn" onclick="Auth.requireLogin(Map.startAdd)">+ Adicionar</button>
        <div class="avatar-btn" onclick="UI.openProfileOverlay()" title="${App.currentUser.name}">
          <span class="avatar-ini">${ini}</span>
          <div class="avatar-level-badge" style="background:${lv.color};">${lv.level}</div>
        </div>`;
    } else {
      el.innerHTML = `
        <button class="tbtn tbtn-ghost" onclick="Auth.showModal('login')">Entrar</button>
        <button class="tbtn tbtn-red"   onclick="Auth.showModal('register')">Registar</button>`;
    }
  },

  /* ── Profile ── */
  openProfileOverlay() {
    if (!App.currentUser) { Auth.showModal('login'); return; }
    this.closeAllOverlays();
    this.renderProfile();
    document.getElementById('profile-overlay').classList.remove('hidden');
  },

  renderProfile() {
    if (!App.currentUser) return;
    const u        = App.currentUser;
    const pts      = u.points || 0;
    const lv       = Gamification.getLevel(pts);
    const nextLv   = Gamification.getNextLevel(pts);
    const progress = Gamification.calcProgress(pts);
    const mySpots  = App.locations.filter(l => l.ownerEmail === u.email);
    const totalUp  = mySpots.reduce((s, l) => s + (l.upvotes || 0), 0);
    const allPrize = Gamification.getAllPrizeLevels();
    const firstName = u.name.split(' ')[0];

    document.getElementById('profile-body').innerHTML = `

      <!-- HERO -->
      <div class="profile-hero">
        <div class="profile-user-row">
          <div class="profile-bigav" style="border-color:${lv.color}60;">
            <span>${u.avatar}</span>
          </div>
          <div class="profile-user-info">
            <div class="profile-greeting">Olá, ${firstName}</div>
            <div class="profile-level-pill" style="background:${lv.bg};color:${lv.fg};border-color:${lv.color}50;">
              Nível ${lv.level} &nbsp;·&nbsp; ${lv.name}
            </div>
            <div class="profile-since">Membro desde ${new Date(u.joined).toLocaleDateString('pt-PT',{month:'long',year:'numeric'})}</div>
          </div>
        </div>
        <div class="profile-stats-row">
          <div class="profile-stat">
            <div class="profile-stat-num">${pts}</div>
            <div class="profile-stat-lbl">Pontos</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-num">${u.contributions || 0}</div>
            <div class="profile-stat-lbl">Locais</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-num">${totalUp}</div>
            <div class="profile-stat-lbl">Upvotes</div>
          </div>
        </div>
      </div>

      <!-- LEVEL PROGRESS -->
      <div class="profile-card">
        <div class="card-section-title">Progressão</div>
        <div class="level-header-row">
          <div class="level-name-badge" style="background:${lv.bg};color:${lv.fg};border:1px solid ${lv.color}40;">
            Nível ${lv.level} — ${lv.name}
          </div>
          ${nextLv ? `<div class="level-next-label">próximo: <span style="color:${nextLv.color};font-weight:600;">${nextLv.name}</span></div>` : '<div class="level-next-label" style="color:var(--car);">Nível máximo</div>'}
        </div>
        <p class="level-description">${lv.description}</p>
        ${nextLv ? `
          <div class="level-bar-wrap">
            <div class="level-bar">
              <div class="level-fill" style="width:${progress}%;background:${lv.barColor};"></div>
            </div>
            <div class="level-bar-labels">
              <span>${pts} pts</span>
              <span>${nextLv.minPts - pts} pts para ${nextLv.name}</span>
            </div>
          </div>` : ''}
      </div>

      <!-- HOW TO EARN -->
      <div class="profile-card">
        <div class="card-section-title">Como ganhar pontos</div>
        <div class="earn-grid">
          ${[
            ['Adicionar local',      '+25 pts', lv.color],
            ['Primeiro local',       '+40 pts bónus', lv.color],
            ['Receber upvote',       '+8 pts', lv.color],
            ['Local verificado',     '+30 pts', lv.color],
          ].map(([label, pts, c]) => `
            <div class="earn-item">
              <div class="earn-dot" style="background:${c};"></div>
              <div class="earn-label">${label}</div>
              <div class="earn-pts" style="color:${c};">${pts}</div>
            </div>`).join('')}
        </div>
      </div>

      <!-- PRIZES -->
      <div class="profile-card">
        <div class="card-section-title">Prémios</div>
        <div class="prizes-timeline">
          ${allPrize.map(lev => {
            const unlocked = pts >= lev.minPts;
            const active   = lv.level === lev.level;
            return `
            <div class="prize-row ${unlocked ? 'prize-unlocked' : 'prize-locked'} ${active ? 'prize-active' : ''}">
              <div class="prize-indicator">
                <div class="prize-dot" style="background:${unlocked ? lev.color : '#ccc'};box-shadow:${unlocked ? '0 0 0 3px '+lev.color+'25' : 'none'};"></div>
                <div class="prize-line"></div>
              </div>
              <div class="prize-body">
                <div class="prize-level-label" style="color:${unlocked ? lev.color : '#bbb'};">Nível ${lev.level} — ${lev.name}</div>
                <div class="prize-title ${unlocked ? '' : 'prize-blurred'}">${lev.prize.name}</div>
                ${unlocked ? `
                  <div class="prize-desc-text">${lev.prize.desc}</div>
                  <div class="prize-code-row">
                    <span class="prize-code-label">Código:</span>
                    <code class="prize-code">${lev.prize.code}</code>
                  </div>` : `<div class="prize-locked-msg">Disponível a partir de ${lev.minPts} pontos</div>`}
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- MY SPOTS -->
      <div class="profile-card">
        <div class="card-section-title">Os Meus Locais (${mySpots.length})</div>
        ${mySpots.length ? mySpots.map(l => {
          const cfg = TYPE_CONFIG[l.type] || TYPE_CONFIG['cafe'];
          return `<div class="spot-list-item">
            <div class="spot-list-color-bar" style="background:${cfg.color};"></div>
            <div class="spot-list-info">
              <div class="spot-list-name">${l.name}</div>
              <div class="spot-list-meta">
                <span class="spot-list-type" style="color:${cfg.color};">${cfg.label}</span>
                <span class="spot-list-loc">${l.city}, ${l.country}</span>
              </div>
            </div>
            <div class="spot-list-right">
              <div class="spot-upvote-count">${l.upvotes || 0} <span>upvotes</span></div>
              <span class="spot-badge ${l.verified ? 'spot-badge-ok' : 'spot-badge-pend'}">${l.verified ? 'Verificado' : 'Pendente'}</span>
            </div>
          </div>`;
        }).join('') : '<p class="no-spots-msg">Ainda não adicionaste nenhum local. Começa por explorar o mapa!</p>'}
      </div>

      <!-- LOGOUT -->
      <div class="profile-card" style="padding:0;">
        <button class="logout-btn" onclick="Auth.logout()">Terminar Sessão</button>
      </div>
    `;
  },

  /* ── Ranking ── */
  renderRanking() {
    const users    = Store.getUsers();
    const allUsers = Object.values(users).map(u => ({
      name: u.name, avatar: u.avatar || u.name[0],
      pts: u.points || 0, contributions: u.contributions || 0,
      country: u.country || 'Portugal'
    })).sort((a, b) => b.pts - a.pts);

    const renderList = (list, tab) => list.map((u, i) => {
      const lv   = Gamification.getLevel(u.pts);
      const isMe = App.currentUser && u.name === App.currentUser.name;
      const rankColor = ['#b07d2e','#8c9aaa','#c0571e'][i] || 'var(--mut)';
      return `<div class="ranking-row ${isMe ? 'me' : ''}">
        <div class="rank-pos" style="color:${rankColor};font-weight:700;font-size:${i<3?'18px':'13px'}">${i + 1}</div>
        <div class="rank-av">${u.avatar}</div>
        <div class="rank-info">
          <div class="rank-name">${u.name}${isMe ? ' <span class="rank-you">tu</span>' : ''}</div>
          <div class="rank-level" style="color:${lv.color};">${lv.name}</div>
          <div class="rank-country">${u.country}</div>
        </div>
        <div class="rank-score">
          <div class="rank-pts">${tab === 'pts' ? u.pts : u.contributions}</div>
          <div class="rank-pts-lbl">${tab === 'pts' ? 'pontos' : 'locais'}</div>
        </div>
      </div>`;
    }).join('');

    document.getElementById('ranking-body').innerHTML = `
      <div class="ranking-tabs">
        <button class="rtab on" id="rtab-pts"  onclick="UI._switchRankTab('pts')">Pontuação</button>
        <button class="rtab"    id="rtab-locs" onclick="UI._switchRankTab('locs')">Locais</button>
      </div>
      <div id="rank-list-pts">${renderList(allUsers, 'pts')}</div>
      <div id="rank-list-locs" style="display:none">${renderList([...allUsers].sort((a,b)=>b.contributions-a.contributions),'locs')}</div>

      <div class="levels-table-card">
        <div class="card-section-title">Tabela de Níveis</div>
        ${LEVELS.map(lv => `
          <div class="levels-table-row">
            <div class="levels-table-dot" style="background:${lv.color};"></div>
            <div class="levels-table-info">
              <div class="levels-table-name">${lv.name}</div>
              <div class="levels-table-range">${lv.minPts}${lv.maxPts===Infinity?'+ pts':'–'+lv.maxPts+' pts'}</div>
            </div>
            <div class="levels-table-prize">${lv.prize ? lv.prize.name : '—'}</div>
          </div>`).join('')}
      </div>
    `;
  },

  _switchRankTab(tab) {
    ['pts','locs'].forEach(t => {
      document.getElementById(`rtab-${t}`).classList.toggle('on', t === tab);
      document.getElementById(`rank-list-${t}`).style.display = t === tab ? 'block' : 'none';
    });
  }
};

function toast(msg, type) { UI.toast(msg, type); }
