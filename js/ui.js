/* ═══════════════════════════════════════════════════
   UI — Interface rendering & helpers
   ═══════════════════════════════════════════════════ */

const UI = {

  /* ── Modal helpers ── */
  openModal(id) { document.getElementById(id).classList.add('open'); },
  closeModal(id) { document.getElementById(id).classList.remove('open'); },

  showErr(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.classList.add('show');
  },
  hideErr(id) { document.getElementById(id).classList.remove('show'); },

  togglePass(inputId, btn) {
    const el = document.getElementById(inputId);
    el.type = el.type === 'password' ? 'text' : 'password';
    btn.textContent = el.type === 'password' ? '👁' : '🙈';
  },

  /* ── Toast ── */
  _toastTimer: null,
  toast(msg, type = 'info') {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.style.background = type === 'error' ? '#c0392b' : type === 'success' ? '#1a5c2e' : '#1a0a00';
    el.style.display = 'block';
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.style.display = 'none', 3500);
  },

  /* ── Overlay helpers ── */
  closeOverlay(id) { document.getElementById(id).classList.add('hidden'); },
  closeAllOverlays() {
    ['profile-overlay', 'ranking-overlay'].forEach(id =>
      document.getElementById(id).classList.add('hidden')
    );
  },

  /* ── Tab navigation (mobile) ── */
  showTab(tab) {
    document.querySelectorAll('.bnav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === tab));
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
      const lv = Gamification.getLevel(App.currentUser.points || 0);
      el.innerHTML = `
        <button class="tbtn tbtn-add" id="add-btn" onclick="Auth.requireLogin(Map.startAdd)">+ Adicionar</button>
        <div class="avatar-btn" onclick="UI.openProfileOverlay()" title="${App.currentUser.name}">
          ${App.currentUser.avatar}
          <div class="avatar-level-badge">${lv.level}</div>
        </div>`;
    } else {
      el.innerHTML = `
        <button class="tbtn tbtn-ghost" onclick="Auth.showModal('login')">Entrar</button>
        <button class="tbtn tbtn-red" onclick="Auth.showModal('register')">Registar</button>`;
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
    const u = App.currentUser;
    const pts = u.points || 0;
    const lv = Gamification.getLevel(pts);
    const nextLv = Gamification.getNextLevel(pts);
    const progress = Gamification.calcProgress(pts);
    const mySpots = App.locations.filter(l => l.ownerEmail === u.email);
    const totalUpvotes = mySpots.reduce((s, l) => s + (l.upvotes || 0), 0);
    const unlockedPrizes = Gamification.getUnlockedPrizes(pts);
    const lockedPrizes = Gamification.getLockedPrizes(pts);
    const allPrizeLevels = LEVELS.filter(l => l.prize);

    document.getElementById('profile-body').innerHTML = `

      <!-- HERO -->
      <div class="profile-hero">
        <div class="profile-user-row">
          <div class="profile-bigav">
            ${u.avatar}
            <div class="profile-level-ring"></div>
          </div>
          <div>
            <div class="profile-name">${u.name}</div>
            <div class="profile-rank">${lv.emoji} ${lv.name} · Nível ${lv.level}</div>
            <div class="profile-since">Membro desde ${new Date(u.joined).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}</div>
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
            <div class="profile-stat-num">${totalUpvotes}</div>
            <div class="profile-stat-lbl">Upvotes</div>
          </div>
        </div>
      </div>

      <!-- LEVEL PROGRESS -->
      <div class="level-card">
        <div class="level-card-title">Nível Atual</div>
        <div class="level-badge" style="background:linear-gradient(135deg,${lv.color}22,${lv.color}11);border:1px solid ${lv.color}55;color:${lv.color};">
          ${lv.emoji} ${lv.name}
        </div>
        <p style="font-size:12px;color:var(--mut);margin-bottom:12px;">${lv.description}</p>
        ${nextLv ? `
        <div class="level-progress-wrap">
          <div class="level-progress-labels">
            <span>${pts} pts</span>
            <span>${nextLv.minPts} pts → ${nextLv.emoji} ${nextLv.name}</span>
          </div>
          <div class="level-bar"><div class="level-fill" style="width:${progress}%;background:linear-gradient(90deg,${lv.color},${lv.color}aa);"></div></div>
        </div>
        <p class="level-next-msg">Faltam <strong>${nextLv.minPts - pts} pontos</strong> para subires de nível!</p>
        ` : `<p style="font-size:12px;color:var(--car);font-weight:600;">🌟 Atingiste o nível máximo!</p>`}
      </div>

      <!-- HOW TO EARN POINTS -->
      <div class="level-card">
        <div class="level-card-title">Como ganhar pontos</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          ${[
            ['📍', 'Adicionar local', '+30 pts'],
            ['⭐', 'Primeiro local', '+50 pts bónus'],
            ['👍', 'Receber upvote', '+5 pts'],
            ['✅', 'Local verificado', '+20 pts'],
          ].map(([e, l, p]) => `
            <div style="background:#faf7f0;border-radius:8px;padding:10px;display:flex;align-items:center;gap:8px;">
              <span style="font-size:18px;">${e}</span>
              <div>
                <div style="font-size:11px;font-weight:600;color:var(--esp);">${l}</div>
                <div style="font-size:10px;color:var(--car);font-weight:700;">${p}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>

      <!-- PRIZES -->
      <div class="level-card">
        <div class="level-card-title">🎁 Os Teus Prémios (${unlockedPrizes.length}/${allPrizeLevels.length} desbloqueados)</div>
        <div class="prizes-grid">
          ${allPrizeLevels.map(lev => {
            const unlocked = pts >= lev.minPts;
            return Gamification.renderPrizeCard(lev.prize, unlocked);
          }).join('')}
        </div>
        ${unlockedPrizes.length === 0 ? `
          <p style="font-size:12px;color:var(--mut);text-align:center;padding:10px 0;">
            Adiciona locais para desbloquear prémios! Começa agora com <strong>+30 pontos</strong> no primeiro local.
          </p>` : ''}
      </div>

      <!-- MY SPOTS -->
      ${mySpots.length ? `
      <div class="level-card">
        <div class="level-card-title">Os Meus Locais (${mySpots.length})</div>
        ${mySpots.map(l => {
          const cfg = TYPE_CONFIG[l.type] || TYPE_CONFIG['cafe'];
          return `<div class="spot-list-item">
            <div class="spot-list-icon">${cfg.emoji}</div>
            <div class="spot-list-info">
              <div class="spot-list-name">${l.name}</div>
              <div class="spot-list-loc">${l.city}, ${l.country}</div>
            </div>
            <div class="spot-list-upvotes">👍 ${l.upvotes}</div>
            <span class="spot-badge ${l.verified ? 'spot-badge-ok' : 'spot-badge-pend'}">${l.verified ? '✓' : '⏳'}</span>
          </div>`;
        }).join('')}
      </div>` : ''}

      <!-- LOGOUT -->
      <div style="padding-bottom:24px;">
        <button class="mbtn mbtn-ghost mbtn-full" onclick="Auth.logout()">Terminar Sessão</button>
      </div>
    `;
  },

  /* ── Ranking ── */
  renderRanking() {
    const users = Store.getUsers();
    const allUsers = Object.values(users).map(u => ({
      name: u.name,
      avatar: u.avatar || u.name[0],
      pts: u.points || 0,
      contributions: u.contributions || 0,
      country: u.country || 'Portugal'
    })).sort((a, b) => b.pts - a.pts);

    const medals = ['🥇', '🥈', '🥉'];
    const renderList = (list, tab) => list.map((u, i) => {
      const lv = Gamification.getLevel(u.pts);
      const isMe = App.currentUser && u.name === App.currentUser.name;
      return `<div class="ranking-row ${isMe ? 'me' : ''}">
        <div class="rank-pos">${medals[i] || `<span style="font-size:13px;color:var(--mut)">${i + 1}</span>`}</div>
        <div class="rank-av" style="font-size:${u.avatar.length > 1 ? '12px' : '16px'}">${u.avatar}</div>
        <div class="rank-info">
          <div class="rank-name">${u.name} ${isMe ? '<span style="font-size:10px;color:var(--car);">(tu)</span>' : ''}</div>
          <div class="rank-level">${lv.emoji} ${lv.name}</div>
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
        <button class="rtab on" id="rtab-pts" onclick="UI._switchRankTab('pts')">⭐ Pontuação</button>
        <button class="rtab" id="rtab-locs" onclick="UI._switchRankTab('locs')">📍 Locais</button>
      </div>
      <div id="rank-list-pts">${renderList(allUsers, 'pts')}</div>
      <div id="rank-list-locs" style="display:none">${renderList([...allUsers].sort((a,b)=>b.contributions-a.contributions), 'locs')}</div>

      <div style="margin-top:20px;background:#fff;border-radius:14px;border:1px solid var(--brd);padding:16px;">
        <div style="font-size:11px;font-weight:600;color:var(--mut);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Tabela de Níveis</div>
        ${LEVELS.map(lv => `
          <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--brd);">
            <span style="font-size:18px;">${lv.emoji}</span>
            <div style="flex:1;">
              <div style="font-size:12px;font-weight:600;color:var(--esp);">${lv.name}</div>
              <div style="font-size:10px;color:var(--mut);">${lv.minPts}${lv.maxPts === Infinity ? '+ pts' : '–' + lv.maxPts + ' pts'}</div>
            </div>
            ${lv.prize ? `<span style="font-size:18px;">${lv.prize.emoji}</span>` : '<span style="width:18px;"></span>'}
            <div style="text-align:right;">
              <div style="font-size:10px;color:var(--car);font-weight:600;">${lv.prize ? lv.prize.name : '–'}</div>
            </div>
          </div>`).join('')}
      </div>
    `;
  },

  _switchRankTab(tab) {
    ['pts', 'locs'].forEach(t => {
      document.getElementById(`rtab-${t}`).classList.toggle('on', t === tab);
      document.getElementById(`rank-list-${t}`).style.display = t === tab ? 'block' : 'none';
    });
  }
};

// Global helpers referenced in HTML
function toast(msg, type) { UI.toast(msg, type); }
