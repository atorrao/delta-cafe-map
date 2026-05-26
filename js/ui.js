/* ═══════════════════════════════════════════════════
   UI — Interface rendering & helpers  v6
   ═══════════════════════════════════════════════════ */

const UI = {
  openModal(id)  { document.getElementById(id).classList.add('open'); },
  closeModal(id) { document.getElementById(id).classList.remove('open'); },
  showErr(id, msg) { const el=document.getElementById(id); el.textContent=msg; el.classList.add('show'); },
  hideErr(id) { document.getElementById(id).classList.remove('show'); },

  _toastTimer: null,
  toast(msg, type) {
    type = type || 'info';
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.style.background = type==='error' ? '#a13a1e' : type==='success' ? '#1e5c38' : '#542916';
    el.style.display = 'block';
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(function(){ el.style.display='none'; }, 3500);
  },

  closeOverlay(id) { document.getElementById(id).classList.add('hidden'); },
  closeAllOverlays: function() {
    ['profile-overlay','ranking-overlay','admin-overlay'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
  },

  showTab: function(tab) {
    document.querySelectorAll('.bnav-btn').forEach(function(b) {
      b.classList.toggle('active', b.dataset.view===tab);
    });
    if (tab==='map') {
      UI.closeAllOverlays();
    } else if (tab==='ranking') {
      UI.closeAllOverlays();
      UI.renderRanking();
      document.getElementById('ranking-overlay').classList.remove('hidden');
    } else if (tab==='profile') {
      UI.closeAllOverlays();
      if (App.currentUser) { UI.renderProfile(); document.getElementById('profile-overlay').classList.remove('hidden'); }
      else Auth.showModal('login');
    } else if (tab==='add') {
      Auth.requireLogin(function(){ Map.startAdd(); });
    }
  },

  renderTopbar: function() {
    var el = document.getElementById('tb-right');
    var searchBtn = '<button id="mobile-search-btn" onclick="UI.showMobileSearch()" aria-label="Pesquisar" style="width:38px;height:38px;border-radius:var(--r-sm);background:rgba(86,65,48,.08);border:1px solid rgba(86,65,48,.2);color:var(--ink-new);display:none;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;"><svg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' fill=\'none\' viewBox=\'0 0 24 24\' stroke-width=\'2\' stroke=\'currentColor\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z\'/></svg></button>';
    if (App.currentUser) {
      var lv  = Gamification.getLevel(App.currentUser.points || 0);
      var svg = Gamification.getAvatarSVG(App.currentUser.points||0, App.currentUser.selectedAvatar);
      var adminBtn = (App.currentUser.role === 'admin')
        ? '<button class="tbtn tbtn-ghost tbtn-admin" onclick="UI.openAdminPanel()" style="font-size:11px;padding:6px 12px;margin-right:6px;">Admin</button>'
        : '';
      el.innerHTML =
        searchBtn + adminBtn +
        '<div class="avatar-btn" onclick="UI.openProfileOverlay()" title="' + App.currentUser.name + '">' +
          '<div class="avatar-svg-wrap">' + svg + '</div>' +
          '<div class="avatar-level-badge" style="background:' + lv.color + ';">' + lv.level + '</div>' +
        '</div>';
    } else {
      el.innerHTML =
        searchBtn +
        '<button class="tbtn tbtn-ghost" onclick="Auth.showModal(\'login\')">Entrar</button>' +
        '<button class="tbtn tbtn-red" onclick="Auth.showModal(\'register\')">Registar</button>';
    }
    /* Show search btn on mobile */
    var sb = document.getElementById('mobile-search-btn');
    if (sb) sb.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
  },

  openProfileOverlay: function() {
    if (!App.currentUser) { Auth.showModal('login'); return; }
    UI.closeAllOverlays();
    UI._activeProfileTab = 'pontos';
    UI.renderProfile();
    document.getElementById('profile-overlay').classList.remove('hidden');
  },

  _editMode: false,
  _selectedAvatar: null,
  _activeProfileTab: 'pontos',
  _showNewPass: false,

  /* ── Extract dominant colour from level for hero tinting ── */
  _heroStyle: function(lv) {
    var c = lv.color;
    // Parse hex to rgb for gradient
    var r = parseInt(c.slice(1,3),16);
    var g = parseInt(c.slice(3,5),16);
    var b = parseInt(c.slice(5,7),16);
    return 'background:linear-gradient(145deg,rgba('+r+','+g+','+b+',.85) 0%,rgba('+Math.max(0,r-40)+','+Math.max(0,g-30)+','+Math.max(0,b-20)+',.95) 100%);';
  },

  switchProfileTab: function(tab) {
    UI._activeProfileTab = tab;
    document.querySelectorAll('.profile-tab').forEach(function(b) {
      b.classList.toggle('active', b.dataset.tab === tab);
    });
    document.querySelectorAll('.ph-hex').forEach(function(b) {
      b.classList.toggle('ph-hex-active', b.dataset.tab === tab);
    });
    document.querySelectorAll('.profile-tab-panel').forEach(function(p) {
      p.classList.toggle('active', p.id === 'ptab-' + tab);
    });
  },

  toggleEditMode: function() {
    UI._editMode = !UI._editMode;
    UI._showNewPass = false;
    var view = document.getElementById('account-view');
    var edit = document.getElementById('account-edit');
    var btn  = document.querySelector('.edit-toggle-btn');
    if (!view || !edit) return;
    view.style.display = UI._editMode ? 'none' : 'block';
    edit.style.display = UI._editMode ? 'block' : 'none';
    if (btn) btn.textContent = UI._editMode ? 'Cancelar' : 'Editar';
    if (UI._editMode) {
      var u = App.currentUser;
      UI._selectedAvatar = (u.selectedAvatar !== undefined && u.selectedAvatar !== null)
        ? u.selectedAvatar
        : Gamification.getLevel(u.points||0).level - 1;
    }
  },

  toggleNewPassField: function() {
    UI._showNewPass = !UI._showNewPass;
    var wrap = document.getElementById('new-pass-wrap');
    var btn  = document.getElementById('toggle-pass-btn');
    if (wrap) wrap.style.display = UI._showNewPass ? 'block' : 'none';
    if (btn)  btn.textContent = UI._showNewPass ? 'Cancelar alteração' : 'Alterar password';
  },

  toggleViewPassword: function(btn) {
    var display = document.getElementById('pw-display');
    var eyeOff  = btn.querySelector('.eye-off');
    var eyeOn   = btn.querySelector('.eye-on');
    if (!display) return;
    var u = App.currentUser;
    if (display.textContent === '••••••••') {
      /* fetch real password from Supabase */
      DB.getUser(u.email).then(function(row) {
        if (row && row.password) {
          display.textContent = row.password;
          if (eyeOff) eyeOff.style.display = 'none';
          if (eyeOn)  eyeOn.style.display  = '';
        }
      }).catch(function(){ display.textContent = '(erro ao carregar)'; });
    } else {
      display.textContent = '••••••••';
      if (eyeOff) eyeOff.style.display = '';
      if (eyeOn)  eyeOn.style.display  = 'none';
    }
  },

  selectAvatar: function(index) {
    var lv = Gamification.getLevel(App.currentUser.points||0);
    if (index >= lv.level) return; // locked
    UI._selectedAvatar = index;
    document.querySelectorAll('.avatar-pick-option').forEach(function(el, i) {
      el.classList.toggle('selected', i === index);
    });
  },

  saveProfile: async function() {
    var name  = (document.getElementById('edit-name')  || {value:''}).value.trim();
    var email = (document.getElementById('edit-email') || {value:''}).value.trim().toLowerCase();
    var pass  = UI._showNewPass ? ((document.getElementById('edit-pass') || {value:''}).value) : '';

    if (!name)  { UI.toast('O nome não pode estar vazio.', 'error'); return; }
    if (!email) { UI.toast('O email não pode estar vazio.', 'error'); return; }
    if (pass && pass.length > 0 && pass.length < 6) {
      UI.toast('A nova password deve ter 6+ caracteres.', 'error'); return;
    }

    var updateData = { name: name, email: email };
    if (pass && pass.length >= 6) updateData.password = pass;
    if (UI._selectedAvatar !== null) updateData.selected_avatar = UI._selectedAvatar;

    try {
      await DB.updateUser(App.currentUser.email, updateData);
      var safe = Object.assign({}, App.currentUser, { name: name, email: email });
      if (UI._selectedAvatar !== null) safe.selectedAvatar = UI._selectedAvatar;
      delete safe.password;
      App.currentUser = safe;
      DB.saveSession(safe);
      UI._editMode = false;
      UI._showNewPass = false;
      UI.renderProfile();
      UI.renderTopbar();
      UI.toast('Perfil atualizado com sucesso.', 'success');
    } catch(e) {
      UI.toast('Erro ao guardar. Tenta novamente.', 'error');
    }
  },

  deleteAccount: async function() {
    if (!confirm('Tens a certeza que queres apagar a tua conta? Esta ação é irreversível.')) return;
    if (!confirm('Última confirmação: todos os teus dados serão removidos permanentemente.')) return;
    try {
      await DB.deleteUser(App.currentUser.email);
      DB.clearSession();
      App.setUser(null);
      UI.closeAllOverlays();
      UI.toast('Conta apagada com sucesso.');
      setTimeout(function(){ location.reload(); }, 1500);
    } catch(e) {
      UI.toast('Erro ao apagar conta. Tenta mais tarde.', 'error');
    }
  },

  /* ══════════════════════════════════════════════════
     RENDER PROFILE — layout com hero grande + hexágonos
  ══════════════════════════════════════════════════ */
  renderProfile: function() {
    if (!App.currentUser) return;
    var u        = App.currentUser;
    var pts      = u.points || 0;
    var lv       = Gamification.getLevel(pts);
    var nextLv   = Gamification.getNextLevel(pts);
    var progress = Gamification.calcProgress(pts);
    var mySpots  = App.locations.filter(function(l){ return l.ownerEmail === u.email; });
    var allPrize = Gamification.getAllPrizeLevels();
    var firstName = u.name.split(' ')[0];

    /* Cor dominante do nível para o hero */
    var c  = lv.color;
    var r  = parseInt(c.slice(1,3),16);
    var g  = parseInt(c.slice(3,5),16);
    var b  = parseInt(c.slice(5,7),16);
    var heroStyle = 'background:linear-gradient(160deg,rgba('+r+','+g+','+b+',.92) 0%,rgba('+Math.max(0,r-50)+','+Math.max(0,g-40)+','+Math.max(0,b-30)+',.98) 100%);';

    var spotsByType = {};
    mySpots.forEach(function(l){
      if (!spotsByType[l.type]) spotsByType[l.type] = [];
      spotsByType[l.type].push(l);
    });

    /* Foto guardada localmente */
    var photoKey = 'profile_photo_' + u.email;
    var photoData = '';
    try { photoData = localStorage.getItem(photoKey) || ''; } catch(e){}

    var html = '';

    /* ════════════════════════
       HERO grande
    ════════════════════════ */
    html += '<div class="ph-hero" style="' + heroStyle + '">';

    /* Foto / avatar com botão de upload */
    html += '<div class="ph-photo-wrap">';
    if (photoData) {
      html += '<img src="' + photoData + '" class="ph-photo" alt="Foto de perfil">';
    } else {
      html += '<div class="ph-photo ph-photo-avatar">' + Gamification.getAvatarSVG(pts, u.selectedAvatar) + '</div>';
    }
    html += '<label class="ph-photo-upload-btn" title="Alterar foto">';
    html += '  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" /></svg>';
    html += '  <input type="file" accept="image/*" style="display:none;" onchange="UI._uploadPhoto(this)">';
    html += '</label>';
    html += '</div>';

    /* Nome, nível, stats */
    html += '<div class="ph-hero-info">';
    html += '  <div class="ph-name">' + u.name + '</div>';
    html += '  <div class="ph-level" style="background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.3);">Nível ' + lv.level + ' · ' + lv.name + '</div>';
    html += '  <div class="ph-stats">';
    html += '    <div class="ph-stat"><div class="ph-stat-num">' + pts + '</div><div class="ph-stat-lbl">Pontos</div></div>';
    html += '    <div class="ph-stat-div"></div>';
    html += '    <div class="ph-stat"><div class="ph-stat-num">' + mySpots.length + '</div><div class="ph-stat-lbl">Locais</div></div>';
    html += '    <div class="ph-stat-div"></div>';
    html += '    <div class="ph-stat"><div class="ph-stat-num">' + lv.level + '</div><div class="ph-stat-lbl">Nível</div></div>';
    html += '  </div>';
    html += '</div>';

    /* Barra de progresso */
    if (nextLv) {
      html += '<div class="ph-progress">';
      html += '  <div class="ph-progress-bar"><div class="ph-progress-fill" style="width:' + progress + '%;background:rgba(255,255,255,.8);"></div></div>';
      html += '  <div class="ph-progress-lbl"><span>' + pts + ' pts</span><span>faltam ' + (nextLv.minPts - pts) + ' pts para ' + nextLv.name + '</span></div>';
      html += '</div>';
    }

    /* Navegação hexagonal */
    html += '<div class="ph-hex-nav">';
    var tabs = [
      { id:'pontos', icon:'<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/></svg>', label:'Pontos' },
      { id:'locais', icon:'<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/></svg>', label:'Locais' },
      { id:'dados',  icon:'<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>', label:'Dados' },
    ];
    tabs.forEach(function(t) {
      var isActive = (UI._activeProfileTab === t.id);
      html += '<button class="ph-hex' + (isActive?' ph-hex-active':'') + '" data-tab="' + t.id + '" onclick="UI.switchProfileTab(\'' + t.id + '\')">';
      html += '  <div class="ph-hex-inner">';
      html += '    ' + t.icon;
      html += '    <span>' + t.label + '</span>';
      html += '  </div>';
      html += '</button>';
    });
    html += '</div>';

    html += '</div>'; /* fim ph-hero */

    /* ════════════════════════
       CONTEÚDO DAS TABS
    ════════════════════════ */
    html += '<div class="ph-content">';

    /* ── TAB 1: Pontos ── */
    html += '<div class="profile-tab-panel" id="ptab-pontos">';

    html += '<div class="profile-card">';
    html += '  <div class="pts-big" style="color:' + lv.color + ';">' + pts + '<span class="pts-big-lbl">pts</span></div>';
    html += '  <div class="level-header-row" style="margin-top:12px;">';
    html += '    <div class="level-name-badge" style="background:' + lv.bg + ';color:' + lv.fg + ';border:1px solid ' + lv.color + '40;">Nível ' + lv.level + ' — ' + lv.name + '</div>';
    if (nextLv) {
      html += '    <div class="level-next-label">Próximo: <span style="color:' + nextLv.color + ';font-weight:700;">' + nextLv.name + '</span></div>';
    } else {
      html += '    <div class="level-next-label" style="color:' + lv.color + ';">Nível máximo ✨</div>';
    }
    html += '  </div>';
    if (nextLv) {
      html += '  <div class="level-bar-wrap" style="margin-top:10px;">';
      html += '    <div class="level-bar"><div class="level-fill" style="width:' + progress + '%;background:' + lv.barColor + ';"></div></div>';
      html += '    <div class="level-bar-labels"><span>' + pts + ' pts</span><span>faltam ' + (nextLv.minPts - pts) + ' pts</span></div>';
      html += '  </div>';
    }
    html += '</div>';

    html += '<div class="profile-card">';
    html += '  <div class="card-section-title">Como ganhar pontos</div>';
    html += '  <div class="earn-grid">';
    [['Primeiro local adicionado','+40 pts bónus'],['Adicionar um local','+15 pts']].forEach(function(e){
      html += '<div class="earn-item"><div class="earn-dot" style="background:' + lv.color + ';"></div><div class="earn-label">' + e[0] + '</div><div class="earn-pts" style="color:' + lv.color + ';">' + e[1] + '</div></div>';
    });
    html += '  </div>';
    html += '</div>';

    html += '<div class="profile-card">';
    html += '  <div class="card-section-title">Prémios</div>';
    html += '  <div class="prizes-timeline">';
    allPrize.forEach(function(lev){
      var unlocked = pts >= lev.minPts;
      html += '<div class="prize-row">';
      html += '  <div class="prize-indicator"><div class="prize-dot" style="background:' + (unlocked?lev.color:'#ddd') + ';' + (unlocked?'box-shadow:0 0 0 3px '+lev.color+'25;':'') + '"></div><div class="prize-line"></div></div>';
      html += '  <div class="prize-body">';
      html += '    <div class="prize-level-label" style="color:' + (unlocked?lev.color:'#bbb') + ';">Nível ' + lev.level + ' — ' + lev.name + '</div>';
      html += '    <div class="prize-title' + (unlocked?'':' prize-blurred') + '">' + lev.prize.name + '</div>';
      if (unlocked) {
        html += '    <div class="prize-desc-text">' + lev.prize.desc + '</div>';
        html += '    <div class="prize-code-row"><span class="prize-code-label">Código:</span><code class="prize-code">' + lev.prize.code + '</code></div>';
      } else {
        html += '    <div class="prize-locked-msg">Disponível a partir de ' + lev.minPts + ' pontos</div>';
      }
      html += '  </div>';
      html += '</div>';
    });
    html += '  </div>';
    html += '</div>';
    html += '</div>'; /* fim ptab-pontos */

    /* ── TAB 2: Locais ── */
    html += '<div class="profile-tab-panel" id="ptab-locais">';
    html += '<div class="profile-card">';
    html += '  <div class="card-section-title">Os Meus Locais (' + mySpots.length + ')</div>';
    if (mySpots.length === 0) {
      html += '  <div class="empty-state-sm"><div style="font-size:2rem;margin-bottom:8px;">📍</div><p>Ainda não adicionaste nenhum local.</p></div>';
    } else {
      Object.keys(spotsByType).forEach(function(type){
        var spots = spotsByType[type];
        var cfg   = TYPE_CONFIG[type] || { label: type, color: '#888' };
        html += '<div class="spots-type-group">';
        html += '  <div class="spots-type-header"><span class="spots-type-dot" style="background:' + cfg.color + ';"></span><span class="spots-type-name" style="color:' + cfg.color + ';">' + cfg.label + '</span><span class="spots-type-count">' + spots.length + '</span></div>';
        spots.forEach(function(l){
          var dddUrl = l.dddeltaUrl || l.dddelta_url;
          html += '<div class="spot-list-item">';
          html += '  <div class="spot-list-color-bar" style="background:' + cfg.color + ';"></div>';
          html += '  <div class="spot-list-info">';
          html += '    <div class="spot-list-name">' + l.name + '</div>';
          html += '    <div class="spot-list-loc">' + l.city + ', ' + l.country + '</div>';
          html += '    <div class="spot-list-actions">';
          html += '      <button class="spot-action-btn" onclick="UI.closeOverlay(\'profile-overlay\');setTimeout(function(){Map.flyTo(\''+l.id+'\');},200);">Ver no mapa</button>';
          if (dddUrl) html += '      <a class="spot-action-btn spot-action-link" href="' + dddUrl + '" target="_blank" rel="noopener">Saber mais</a>';
          html += '    </div>';
          html += '  </div>';
          html += '  <div class="spot-list-right"><span class="spot-badge ' + (l.verified?'spot-badge-ok':'spot-badge-pend') + '">' + (l.verified?'Verificado':'Pendente') + '</span></div>';
          html += '</div>';
        });
        html += '</div>';
      });
    }
    html += '</div>';
    html += '</div>'; /* fim ptab-locais */

    /* ── TAB 3: Dados ── */
    html += '<div class="profile-tab-panel" id="ptab-dados">';

    var selIdx = (u.selectedAvatar !== undefined && u.selectedAvatar !== null) ? u.selectedAvatar : lv.level - 1;
    var avatarPickHtml = '';
    LEVEL_AVATARS.forEach(function(svg, i) {
      var lvNum    = i + 1;
      var unlocked = lv.level >= lvNum;
      var isSel    = selIdx === i;
      avatarPickHtml += '<div class="avatar-pick-option ' + (!unlocked?'locked':'') + ' ' + (isSel?'selected':'') + '"';
      if (unlocked) avatarPickHtml += ' onclick="UI.selectAvatar(' + i + ')"';
      avatarPickHtml += ' title="Nível ' + lvNum + (unlocked?'':' — bloqueado') + '">' + svg;
      if (!unlocked) avatarPickHtml += '<div class="avatar-lock-icon">🔒</div>';
      avatarPickHtml += '</div>';
    });

    html += '<div class="profile-card" id="account-card">';
    html += '  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">';
    html += '    <div class="card-section-title" style="margin-bottom:0;">Dados da conta</div>';
    html += '    <button class="edit-toggle-btn" onclick="UI.toggleEditMode()">Editar</button>';
    html += '  </div>';

    html += '  <div id="account-view">';
    html += '    <div class="account-field"><span class="account-label">Nome</span><span class="account-value">' + u.name + '</span></div>';
    html += '    <div class="account-field"><span class="account-label">E-mail</span><span class="account-value">' + u.email + '</span></div>';
    html += '    <div class="account-field" style="border-bottom:none;"><span class="account-label">Password</span>';
    html += '      <div class="pass-view-wrap"><span class="account-value" id="pw-display">••••••••</span>';
    html += '        <button type="button" class="pass-view-eye" onclick="UI.toggleViewPassword(this)" tabindex="-1">';
    html += '          <svg class="eye-off" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" style="width:17px;height:17px;"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>';
    html += '          <svg class="eye-on" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" style="width:17px;height:17px;display:none;"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>';
    html += '        </button></div></div>';
    html += '    <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--brd);">';
    html += '      <div class="account-label" style="margin-bottom:8px;">Avatar actual</div>';
    html += '      <div class="avatar-picker-grid" style="pointer-events:none;">' + avatarPickHtml + '</div>';
    html += '      <p style="font-size:10px;color:var(--mut-lt);margin-top:6px;">Os avatares com 🔒 desbloqueiam com mais pontos</p>';
    html += '    </div>';
    html += '  </div>';

    html += '  <div id="account-edit" style="display:none;">';
    html += '    <div class="account-field-edit"><label class="account-label">Nome</label><input class="account-edit-input" id="edit-name" value="' + u.name + '"></div>';
    html += '    <div class="account-field-edit"><label class="account-label">E-mail</label><input class="account-edit-input" id="edit-email" type="email" value="' + u.email + '"></div>';
    html += '    <div class="account-field-edit" style="border-bottom:none;">';
    html += '      <button id="toggle-pass-btn" class="btn-toggle-pass" type="button" onclick="UI.toggleNewPassField()">Alterar password</button>';
    html += '      <div id="new-pass-wrap" style="display:none;margin-top:10px;"><label class="account-label">Nova Password</label>';
    html += '        <div class="pass-wrap"><input class="account-edit-input" id="edit-pass" type="password" placeholder="Mínimo 6 caracteres" style="padding-right:44px;">';
    html += '          <button type="button" class="pass-toggle" tabindex="-1" onclick="togglePassEye(this)">';
    html += '            <svg class="eye-off" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" style="width:18px;height:18px;"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>';
    html += '            <svg class="eye-on" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" style="width:18px;height:18px;display:none;"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>';
    html += '          </button></div></div></div>';
    html += '    <div class="account-field-edit" style="border-bottom:none;padding-top:14px;"><label class="account-label">Escolher avatar</label>';
    html += '      <div class="avatar-picker-grid">' + avatarPickHtml + '</div></div>';
    html += '    <div class="edit-actions">';
    html += '      <button class="btn-cancel-edit" onclick="UI.toggleEditMode()">Cancelar</button>';
    html += '      <button class="btn-save" onclick="UI.saveProfile()">Guardar</button>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    html += '<div class="profile-card profile-session-card">';
    html += '  <button class="btn-logout-sm btn-full-w" onclick="Auth.logout()">Terminar sessão</button>';
    html += '  <button class="btn-delete-sm btn-full-w" onclick="UI.deleteAccount()">Apagar conta</button>';
    html += '</div>';
    html += '</div>'; /* fim ptab-dados */

    html += '</div>'; /* fim ph-content */

    document.getElementById('profile-body').innerHTML = html;
    UI.switchProfileTab(UI._activeProfileTab || 'pontos');
  },

  /* Upload de foto de perfil */
  _uploadPhoto: function(input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      var key = 'profile_photo_' + App.currentUser.email;
      try { localStorage.setItem(key, e.target.result); } catch(err) {}
      UI.renderProfile();
      UI.renderTopbar();
    };
    reader.readAsDataURL(file);
  },


  /* ══════════════════════════════
     RANKING
  ══════════════════════════════ */
  renderRanking: async function() {
    var allUsers = [];
    try {
      var rows = await DB.getAllUsers();
      allUsers = rows.map(function(u){
        return {
          name: u.name, pts: u.points||0,
          contributions: u.contributions||0,
          country: u.country||'Portugal',
          selectedAvatar: u.selected_avatar !== undefined ? u.selected_avatar : null,
          points: u.points||0
        };
      }).sort(function(a,b){ return b.pts-a.pts; });
    } catch(e) {
      // fallback
      var users = Store.getUsers();
      allUsers = Object.values(users).map(function(u){
        return { name:u.name, pts:u.points||0, contributions:u.contributions||0, country:u.country||'Portugal', selectedAvatar:u.selectedAvatar||null, points:u.points||0 };
      }).sort(function(a,b){ return b.pts-a.pts; });
    }

    function renderList(list, tab) {
      if (!list.length) return '<p class="no-spots-msg" style="padding:16px 0;">Nenhum utilizador ainda.</p>';
      return list.map(function(u, i) {
        var lv   = Gamification.getLevel(u.pts);
        var isMe = App.currentUser && u.name===App.currentUser.name;
        var rc   = ['#b07d2e','#8c9aaa','#c0571e'][i] || 'var(--mut)';
        var sz   = i < 3 ? '18px' : '13px';
        var avSvg = Gamification.getAvatarSVG(u.pts, u.selectedAvatar);
        return '<div class="ranking-row ' + (isMe?'me':'') + '">' +
          '<div class="rank-pos" style="color:' + rc + ';font-weight:700;font-size:' + sz + '">' + (i+1) + '</div>' +
          '<div class="rank-av" style="background:' + lv.color + '20;border:2px solid ' + lv.color + '40;">' + avSvg + '</div>' +
          '<div class="rank-info">' +
            '<div class="rank-name">' + u.name + (isMe?' <span class="rank-you">tu</span>':'') + '</div>' +
            '<div class="rank-level" style="color:' + lv.color + ';">' + lv.name + '</div>' +
            '<div class="rank-country">' + u.country + '</div>' +
          '</div>' +
          '<div class="rank-score">' +
            '<div class="rank-pts">' + (tab==='pts'?u.pts:u.contributions) + '</div>' +
            '<div class="rank-pts-lbl">' + (tab==='pts'?'pontos':'locais') + '</div>' +
          '</div></div>';
      }).join('');
    }

    var levelsTableHtml = LEVELS.map(function(lv){
      return '<div class="levels-table-row">' +
        '<div class="levels-table-dot" style="background:' + lv.color + ';"></div>' +
        '<div class="levels-table-info">' +
          '<div class="levels-table-name">' + lv.name + '</div>' +
          '<div class="levels-table-range">' + lv.minPts + (lv.maxPts===Infinity?'+ pts':'–'+lv.maxPts+' pts') + '</div>' +
        '</div>' +
        '<div class="levels-table-prize">' + (lv.prize?lv.prize.name:'—') + '</div>' +
      '</div>';
    }).join('');

    var sortedByLocs = allUsers.slice().sort(function(a,b){ return b.contributions-a.contributions; });

    document.getElementById('ranking-body').innerHTML =
      '<div class="ranking-tabs">' +
        '<button class="rtab on" id="rtab-pts" onclick="UI._switchRankTab(\'pts\')">Pontuação</button>' +
        '<button class="rtab" id="rtab-locs" onclick="UI._switchRankTab(\'locs\')">Locais</button>' +
      '</div>' +
      '<div id="rank-list-pts">' + renderList(allUsers,'pts') + '</div>' +
      '<div id="rank-list-locs" style="display:none">' + renderList(sortedByLocs,'locs') + '</div>' +
      '<div class="levels-table-card">' +
        '<div class="card-section-title">Tabela de Níveis</div>' +
        levelsTableHtml +
      '</div>';
  },

  _switchRankTab: function(tab) {
    ['pts','locs'].forEach(function(t){
      document.getElementById('rtab-'+t).classList.toggle('on', t===tab);
      document.getElementById('rank-list-'+t).style.display = t===tab?'block':'none';
    });
  }
};

function toast(msg, type) { UI.toast(msg, type); }

/* ── Registration pending ── */
UI.showRegistrationPending = function() {
  UI.closeAllOverlays();
  var el = document.getElementById('pending-overlay');
  if (el) { el.classList.remove('hidden'); return; }
  var ov = document.createElement('div');
  ov.id = 'pending-overlay';
  ov.className = 'overlay';
  ov.style.cssText = 'display:flex;align-items:center;justify-content:center;background:var(--nuage);';
  ov.innerHTML =
    '<div style="text-align:center;padding:2rem;max-width:340px;">' +
      '<div style="font-size:48px;margin-bottom:16px;">☕</div>' +
      '<h2 style="font-family:var(--font-serif);font-size:1.3rem;color:var(--espresso);margin-bottom:10px;font-style:italic;">Registo recebido!</h2>' +
      '<p style="font-size:13px;color:var(--mut);line-height:1.7;margin-bottom:20px;">O teu pedido foi enviado e está a aguardar aprovação pelo administrador.</p>' +
      '<button onclick="document.getElementById(&quot;pending-overlay&quot;).classList.add(&quot;hidden&quot;)" style="padding:10px 24px;background:var(--terre-cuite);color:#fff;border:none;border-radius:8px;font-family:var(--font-body);font-size:13px;font-weight:600;cursor:pointer;">Voltar ao Mapa</button>' +
    '</div>';
  document.getElementById('app').appendChild(ov);
};

/* ── Admin Panel ── */
UI.openAdminPanel = function() { Admin.open().catch(function(e){ console.error('Admin panel error:', e); UI.toast('Erro ao carregar painel admin.', 'error'); }); };

/* ── Mobile search ── */
UI.showMobileSearch = function() {
  document.querySelectorAll('.bnav-btn').forEach(function(b){b.classList.toggle('active',b.dataset.view==='search');});
  UI.closeAllOverlays();
  document.getElementById('mobile-search-overlay').classList.remove('hidden');
  setTimeout(function(){ var el=document.getElementById('mobile-search-input'); if(el)el.focus(); }, 200);
};
UI.closeMobileSearch = function() {
  document.getElementById('mobile-search-overlay').classList.add('hidden');
  document.querySelectorAll('.bnav-btn').forEach(function(b){b.classList.toggle('active',b.dataset.view==='map');});
};
UI.clearMobileSearch = function() {
  var el = document.getElementById('mobile-search-input');
  if(el) el.value = '';
  document.getElementById('mobile-search-results').innerHTML = '<p class="no-results" style="padding:20px 0;">Pesquisa por cidade, país ou nome do local.</p>';
};
UI.mobileSearch = function(q) {
  var container = document.getElementById('mobile-search-results');
  if (!container) return;
  if (!q || q.length < 2) {
    container.innerHTML = '<p class="no-results" style="padding:20px 0;">Pesquisa por cidade, país ou nome do local.</p>';
    return;
  }
  var matches = App.locations.filter(function(l){
    return (l.name+' '+l.city+' '+l.country+(l.address||'')).toLowerCase().indexOf(q.toLowerCase()) !== -1;
  }).slice(0,12);
  if (!matches.length) { container.innerHTML = '<p class="no-results">Nenhum local encontrado.</p>'; return; }
  var html = '';
  matches.forEach(function(loc){
    var cfg = TYPE_CONFIG[loc.type] || {label:loc.type, color:'#888'};
    html += '<div class="search-result-item" onclick="UI._mobileSelectResult(\'' + loc.id + '\')">' +
      '<div class="sr-dot" style="background:'+cfg.color+';"></div>' +
      '<div class="sr-info"><div class="sr-name">'+loc.name+'</div><div class="sr-meta">'+cfg.label+' · '+loc.city+', '+loc.country+'</div></div></div>';
  });
  container.innerHTML = html;
};
UI._mobileSelectResult = function(id) {
  UI.closeMobileSearch(); UI.showTab('map');
  setTimeout(function(){ Map.flyTo(id); }, 300);
};
App.closeAllOverlays = function() { UI.closeAllOverlays(); };
