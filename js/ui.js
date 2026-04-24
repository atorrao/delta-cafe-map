/* ═══════════════════════════════════════════════════
   UI — Interface rendering & helpers  v4
   ═══════════════════════════════════════════════════ */

const UI = {
  openModal(id)  { document.getElementById(id).classList.add('open'); },
  closeModal(id) { document.getElementById(id).classList.remove('open'); },
  showErr(id, msg) { const el=document.getElementById(id); el.textContent=msg; el.classList.add('show'); },
  hideErr(id) { document.getElementById(id).classList.remove('show'); },
  togglePass(inputId, btn) {
    const el = document.getElementById(inputId);
    el.type  = el.type === 'password' ? 'text' : 'password';
    btn.textContent = el.type === 'password' ? 'Mostrar' : 'Ocultar';
  },

  _toastTimer: null,
  toast(msg, type) {
    type = type || 'info';
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.style.background = type==='error' ? '#9b2335' : type==='success' ? '#1e5c38' : '#2C1810';
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
    if (App.currentUser) {
      var lv  = Gamification.getLevel(App.currentUser.points || 0);
      var svg = Gamification.getAvatarSVG(App.currentUser.points||0, App.currentUser.selectedAvatar);
      var adminBtn = (App.currentUser.role === 'admin')
        ? '<button class="tbtn tbtn-ghost tbtn-admin" onclick="UI.openAdminPanel()" style="font-size:11px;padding:6px 12px;margin-right:6px;border-color:rgba(200,168,75,.5);color:rgba(245,238,216,.85);">Admin</button>'
        : '';
      el.innerHTML =
        adminBtn +
        '<div class="avatar-btn" onclick="UI.openProfileOverlay()" title="' + App.currentUser.name + '">' +
          '<div class="avatar-svg-wrap">' + svg + '</div>' +
          '<div class="avatar-level-badge" style="background:' + lv.color + ';">' + lv.level + '</div>' +
        '</div>';
    } else {
      el.innerHTML =
        '<button class="tbtn tbtn-ghost" onclick="Auth.showModal(\'login\')">Entrar</button>' +
        '<button class="tbtn tbtn-red" onclick="Auth.showModal(\'register\')">Registar</button>';
    }
  },

  openProfileOverlay: function() {
    if (!App.currentUser) { Auth.showModal('login'); return; }
    UI.closeAllOverlays();
    UI.renderProfile();
    document.getElementById('profile-overlay').classList.remove('hidden');
  },

  _editMode: false,
  _selectedAvatar: null,

  toggleEditMode: function() {
    UI._editMode = !UI._editMode;
    var view = document.getElementById('account-view');
    var edit = document.getElementById('account-edit');
    var btn  = document.querySelector('.edit-toggle-btn');
    if (!view || !edit) return;
    view.style.display = UI._editMode ? 'none' : 'block';
    edit.style.display = UI._editMode ? 'block' : 'none';
    if (btn) btn.textContent = UI._editMode ? 'Cancelar' : 'Editar';
    if (UI._editMode) {
      var u = App.currentUser;
      UI._selectedAvatar = (u.selectedAvatar !== undefined) ? u.selectedAvatar
        : Gamification.getLevel(u.points||0).level - 1;
    }
  },

  selectAvatar: function(index) {
    UI._selectedAvatar = index;
    document.querySelectorAll('.avatar-pick-option').forEach(function(el, i) {
      el.classList.toggle('selected', i === index);
    });
  },

  saveProfile: function() {
    var name  = (document.getElementById('edit-name')  || {value:''}).value.trim();
    var email = (document.getElementById('edit-email') || {value:''}).value.trim().toLowerCase();
    var pass  = (document.getElementById('edit-pass')  || {value:''}).value;

    if (!name)  { UI.toast('O nome não pode estar vazio.', 'error'); return; }
    if (!email) { UI.toast('O email não pode estar vazio.', 'error'); return; }

    var users    = Store.getUsers();
    var oldEmail = App.currentUser.email;

    if (email !== oldEmail && users[email]) {
      UI.toast('Este email já está em uso.', 'error'); return;
    }
    if (pass && pass.length > 0 && pass.length < 6) {
      UI.toast('Password deve ter 6+ caracteres.', 'error'); return;
    }

    var updated = Object.assign({}, users[oldEmail], { name: name, email: email });
    if (pass && pass.length >= 6) updated.password = pass;
    if (UI._selectedAvatar !== null) updated.selectedAvatar = UI._selectedAvatar;

    if (email !== oldEmail) delete users[oldEmail];
    users[email] = updated;
    Store.saveUsers(users);

    var safe = Object.assign({}, updated);
    delete safe.password;
    safe.avatar = name[0].toUpperCase();
    App.currentUser = safe;
    Store.saveSession(safe);

    UI._editMode = false;
    UI.renderProfile();
    UI.renderTopbar();
    UI.toast('Perfil atualizado com sucesso.');
  },

  renderProfile: function() {
    if (!App.currentUser) return;
    var u   = App.currentUser;
    var pts = u.points || 0;
    var lv  = Gamification.getLevel(pts);
    var nextLv   = Gamification.getNextLevel(pts);
    var progress = Gamification.calcProgress(pts);
    var mySpots  = App.locations.filter(function(l){ return l.ownerEmail === u.email; });
    var totalUp  = mySpots.reduce(function(s,l){ return s+(l.upvotes||0); }, 0);
    var allPrize = Gamification.getAllPrizeLevels();
    var firstName = u.name.split(' ')[0];

    // Group spots by type
    var spotsByType = {};
    mySpots.forEach(function(l){
      if (!spotsByType[l.type]) spotsByType[l.type] = [];
      spotsByType[l.type].push(l);
    });

    var html = '';

    // ── HERO ──────────────────────────────────────────────────
    html += '<div class="profile-hero">';
    html += '<div class="profile-user-row">';
    html += '<div class="profile-bigav" style="border-color:' + lv.color + '70;">';
    html += '<div class="profile-avatar-svg">' + Gamification.getAvatarSVG(pts, u.selectedAvatar) + '</div>';
    html += '</div>';
    html += '<div class="profile-user-info">';
    html += '<div class="profile-greeting">Olá, ' + firstName + '</div>';
    html += '<div class="profile-level-pill" style="background:' + lv.bg + ';color:' + lv.fg + ';border-color:' + lv.color + '50;">Nível ' + lv.level + ' &nbsp;·&nbsp; ' + lv.name + '</div>';
    html += '<div class="profile-since">Membro desde ' + new Date(u.joined).toLocaleDateString('pt-PT',{month:'long',year:'numeric'}) + '</div>';
    html += '</div></div>';
    html += '<div class="profile-stats-row profile-stats-2">';
    html += '<div class="profile-stat"><div class="profile-stat-num">' + pts + '</div><div class="profile-stat-lbl">Pontos</div></div>';
    html += '<div class="profile-stat"><div class="profile-stat-num">' + (u.contributions||0) + '</div><div class="profile-stat-lbl">Locais</div></div>';
    html += '</div></div>';

    // ── ACCOUNT CARD ──────────────────────────────────────────
    // Build avatar options for view
    var avatarViewHtml = '';
    LEVEL_AVATARS.forEach(function(svg, i) {
      var lvNum    = i + 1;
      var unlocked = lv.level >= lvNum;
      var selIdx   = (u.selectedAvatar !== undefined) ? u.selectedAvatar : lv.level - 1;
      var isCur    = selIdx === i;
      avatarViewHtml += '<div class="avatar-option ' + (unlocked?'unlocked':'locked') + ' ' + (isCur?'current':'') + '" title="Nível ' + lvNum + (unlocked?'':' — bloqueado') + '">';
      avatarViewHtml += '<div style="width:32px;height:32px;opacity:' + (unlocked?1:0.3) + ';">' + svg + '</div></div>';
    });

    // Build avatar options for edit picker
    var avatarPickHtml = '';
    LEVEL_AVATARS.forEach(function(svg, i) {
      var lvNum    = i + 1;
      var unlocked = lv.level >= lvNum;
      var selIdx   = (u.selectedAvatar !== undefined) ? u.selectedAvatar : lv.level - 1;
      var isCur    = selIdx === i;
      avatarPickHtml += '<div class="avatar-pick-option ' + (unlocked?'':'locked') + ' ' + (isCur?'selected':'') + '" onclick="UI.selectAvatar(' + i + ')" title="Nível ' + lvNum + '">' + svg + '</div>';
    });

    html += '<div class="profile-card" id="account-card">';
    html += '<div style="display:flex;align-items:center;margin-bottom:14px;">';
    html += '<div class="card-section-title" style="margin-bottom:0;">Os Meus Dados</div>';
    html += '<button class="edit-toggle-btn" onclick="UI.toggleEditMode()">Editar</button>';
    html += '</div>';

    // View mode
    html += '<div id="account-view">';
    html += '<div class="account-field"><span class="account-label">Username</span><span class="account-value">' + u.email.split('@')[0] + '</span></div>';
    html += '<div class="account-field"><span class="account-label">Nome</span><span class="account-value">' + u.name + '</span></div>';
    html += '<div class="account-field"><span class="account-label">E-mail</span><span class="account-value">' + u.email + '</span></div>';
    html += '<div class="account-field"><span class="account-label">Password</span><span class="account-value">••••••••</span></div>';
    html += '</div>';

    // Edit mode
    html += '<div id="account-edit" style="display:none;">';
    html += '<div class="account-field-edit"><label class="account-label">Nome</label><input class="account-edit-input" id="edit-name" value="' + u.name + '" placeholder="O teu nome"></div>';
    html += '<div class="account-field-edit"><label class="account-label">E-mail</label><input class="account-edit-input" id="edit-email" type="email" value="' + u.email + '"></div>';
    html += '<div class="account-field-edit"><label class="account-label">Nova Password (deixa em branco para manter)</label><input class="account-edit-input" id="edit-pass" type="password" placeholder="••••••••"></div>';
    html += '<div class="account-field-edit" style="border-bottom:none;"><label class="account-label">Escolher Avatar</label>';
    html += '<div class="avatar-picker-grid">' + avatarPickHtml + '</div></div>';
    html += '<div class="edit-actions">';
    html += '<button class="btn-cancel-edit" onclick="UI.toggleEditMode()">Cancelar</button>';
    html += '<button class="btn-save" onclick="UI.saveProfile()">Guardar</button>';
    html += '</div></div></div>';
    // ── LEVEL PROGRESS ────────────────────────────────────────
    html += '<div class="profile-card">';
    html += '<div class="card-section-title">Progressão</div>';
    html += '<div class="level-header-row">';
    html += '<div class="level-name-badge" style="background:' + lv.bg + ';color:' + lv.fg + ';border:1px solid ' + lv.color + '40;">Nível ' + lv.level + ' — ' + lv.name + '</div>';
    if (nextLv) {
      html += '<div class="level-next-label">próximo: <span style="color:' + nextLv.color + ';font-weight:600;">' + nextLv.name + '</span></div>';
    } else {
      html += '<div class="level-next-label" style="color:var(--car);">Nível máximo</div>';
    }
    html += '</div>';
    html += '<p class="level-description">' + lv.description + '</p>';
    if (nextLv) {
      html += '<div class="level-bar-wrap">';
      html += '<div class="level-bar"><div class="level-fill" style="width:' + progress + '%;background:' + lv.barColor + ';"></div></div>';
      html += '<div class="level-bar-labels"><span>' + pts + ' pts</span><span>' + (nextLv.minPts - pts) + ' pts para ' + nextLv.name + '</span></div>';
      html += '</div>';
    }
    html += '</div>';

    // ── MY SPOTS ─────────────────────────────────────────────
    html += '<div class="profile-card">';
    html += '<div class="card-section-title">Os Meus Locais (' + mySpots.length + ')</div>';
    if (mySpots.length === 0) {
      html += '<p class="no-spots-msg">Ainda não adicionaste nenhum local.</p>';
    } else {
      Object.keys(spotsByType).forEach(function(type){
        var spots = spotsByType[type];
        var cfg   = TYPE_CONFIG[type] || { label: type, color: '#888' };
        html += '<div class="spots-type-group">';
        html += '<div class="spots-type-header">';
        html += '<span class="spots-type-dot" style="background:' + cfg.color + ';"></span>';
        html += '<span class="spots-type-name" style="color:' + cfg.color + ';">' + cfg.label + '</span>';
        html += '<span class="spots-type-count">' + spots.length + '</span>';
        html += '</div>';
        spots.forEach(function(l){
          html += '<div class="spot-list-item">';
          html += '<div class="spot-list-color-bar" style="background:' + cfg.color + ';"></div>';
          html += '<div class="spot-list-info">';
          html += '<div class="spot-list-name">' + l.name + '</div>';
          html += '<div class="spot-list-loc">' + l.city + ', ' + l.country + '</div>';
          html += '</div>';
          html += '<div class="spot-list-right">';
          html += '<span class="spot-badge ' + (l.verified?'spot-badge-ok':'spot-badge-pend') + '">' + (l.verified?'Verificado':'Pendente') + '</span>';
          html += '</div></div>';
        });
        html += '</div>';
      });
    }
    html += '</div>';

    // ── PRIZES ───────────────────────────────────────────────
    html += '<div class="profile-card">';
    html += '<div class="card-section-title">Prémios</div>';
    html += '<div class="prizes-timeline">';
    allPrize.forEach(function(lev){
      var unlocked = pts >= lev.minPts;
      html += '<div class="prize-row ' + (unlocked?'prize-unlocked':'prize-locked') + '">';
      html += '<div class="prize-indicator">';
      html += '<div class="prize-dot" style="background:' + (unlocked?lev.color:'#ddd') + ';' + (unlocked?'box-shadow:0 0 0 3px '+lev.color+'25;':'') + '"></div>';
      html += '<div class="prize-line"></div></div>';
      html += '<div class="prize-body">';
      html += '<div class="prize-level-label" style="color:' + (unlocked?lev.color:'#bbb') + ';">Nível ' + lev.level + ' — ' + lev.name + '</div>';
      html += '<div class="prize-title' + (unlocked?'':' prize-blurred') + '">' + lev.prize.name + '</div>';
      if (unlocked) {
        html += '<div class="prize-desc-text">' + lev.prize.desc + '</div>';
        html += '<div class="prize-code-row"><span class="prize-code-label">Código:</span><code class="prize-code">' + lev.prize.code + '</code></div>';
      } else {
        html += '<div class="prize-locked-msg">Disponível a partir de ' + lev.minPts + ' pontos</div>';
      }
      html += '</div></div>';
    });
    html += '</div></div>';

    // ── EARN POINTS ───────────────────────────────────────────
    html += '<div class="profile-card">';
    html += '<div class="card-section-title">Como ganhar pontos</div>';
    html += '<div class="earn-grid">';
    var earns = [
      ['Primeiro local adicionado', '+40 pts bónus'],
      ['Adicionar um local',        '+15 pts'],
    ];
    earns.forEach(function(e){
      html += '<div class="earn-item"><div class="earn-dot" style="background:' + lv.color + ';"></div><div class="earn-label">' + e[0] + '</div><div class="earn-pts" style="color:' + lv.color + ';">' + e[1] + '</div></div>';
    });
    html += '</div></div>';

    // ── LOGOUT ───────────────────────────────────────────────
    html += '<div class="profile-card" style="padding:0;">';
    html += '<button class="logout-btn" onclick="Auth.logout()">Terminar Sessão</button>';
    html += '</div>';


    document.getElementById('profile-body').innerHTML = html;
  },

  renderRanking: function() {
    var users    = Store.getUsers();
    var allUsers = Object.values(users).map(function(u){
      return { name:u.name, avatar:u.avatar||u.name[0], pts:u.points||0, contributions:u.contributions||0, country:u.country||'Portugal' };
    }).sort(function(a,b){ return b.pts-a.pts; });

    function renderList(list, tab) {
      return list.map(function(u, i) {
        var lv   = Gamification.getLevel(u.pts);
        var isMe = App.currentUser && u.name===App.currentUser.name;
        var rc   = ['#b07d2e','#8c9aaa','#c0571e'][i] || 'var(--mut)';
        var sz   = i < 3 ? '18px' : '13px';
        return '<div class="ranking-row ' + (isMe?'me':'') + '">' +
          '<div class="rank-pos" style="color:' + rc + ';font-weight:700;font-size:' + sz + '">' + (i+1) + '</div>' +
          '<div class="rank-av">' + u.avatar + '</div>' +
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

/* ── Registration pending screen ── */
UI.showRegistrationPending = function() {
  UI.closeAllOverlays();
  var el = document.getElementById('pending-overlay');
  if (el) { el.classList.remove('hidden'); return; }
  // Create overlay dynamically
  var ov = document.createElement('div');
  ov.id = 'pending-overlay';
  ov.className = 'overlay';
  ov.style.cssText = 'display:flex;align-items:center;justify-content:center;background:var(--d-foam);';
  ov.innerHTML =
    '<div style="text-align:center;padding:2rem;max-width:340px;">' +
      '<div style="font-size:48px;margin-bottom:16px;">☕</div>' +
      '<h2 style="font-family:Poppins,sans-serif;font-size:1.3rem;color:var(--d-espresso);margin-bottom:10px;">Registo recebido!</h2>' +
      '<p style="font-size:13px;color:var(--mut);line-height:1.7;margin-bottom:20px;">O teu pedido foi enviado e está a aguardar aprovação pelo administrador. Receberás acesso assim que for aprovado.</p>' +
      '<button onclick="document.getElementById(&quot;pending-overlay&quot;).classList.add(&quot;hidden&quot;)" style="padding:10px 24px;background:var(--d-red);color:#fff;border:none;border-radius:8px;font-family:Poppins,sans-serif;font-size:13px;font-weight:600;cursor:pointer;">Voltar ao Mapa</button>' +
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
  if (!matches.length) {
    container.innerHTML = '<p class="no-results">Nenhum local encontrado.</p>';
    return;
  }
  var html = '';
  matches.forEach(function(loc){
    var cfg = TYPE_CONFIG[loc.type] || {label:loc.type, color:'#888'};
    html += '<div class="search-result-item" onclick="UI._mobileSelectResult(\'' + loc.id + '\')">' +
      '<div class="sr-dot" style="background:'+cfg.color+';"></div>' +
      '<div class="sr-info">' +
        '<div class="sr-name">'+loc.name+'</div>' +
        '<div class="sr-meta">'+cfg.label+' · '+loc.city+', '+loc.country+'</div>' +
      '</div></div>';
  });
  container.innerHTML = html;
};

UI._mobileSelectResult = function(id) {
  UI.closeMobileSearch();
  UI.showTab('map');
  setTimeout(function(){ Map.flyTo(id); }, 300);
};

App.closeAllOverlays = function() { UI.closeAllOverlays(); };



