/* ═══════════════════════════════════════════════════
   ADMIN PANEL — tabs: Utilizadores | Locais
   ═══════════════════════════════════════════════════ */

var Admin = {
  _tab: 'users', // 'users' | 'locations'

  open: function() {
    if (!App.currentUser || App.currentUser.role !== 'admin') {
      UI.toast('Acesso não autorizado.', 'error');
      return;
    }
    UI.closeAllOverlays();
    Admin._tab = 'users';
    Admin.render();
    document.getElementById('admin-overlay').classList.remove('hidden');
  },

  render: function() {
    Admin._tab === 'locations' ? Admin._renderLocations() : Admin._renderUsers();
  },

  /* ── TAB HEADER ──────────────────────────────────────────── */
  _tabHeader: function() {
    var users    = Store.getUsers();
    var allUsers = Object.values(users).filter(function(u) {
      return u.email !== 'admin@delta.pt' && u.email !== 'admin';
    });
    var pendingUsers = allUsers.filter(function(u){ return (u.status||'pending') === 'pending'; }).length;
    var pendingLocs  = App.locations.filter(function(l){ return l.ownerEmail && !l.verified && (l.status === 'pending' || !l.status); }).length;

    return '<div class="admin-tabs">' +
      '<button class="admin-tab ' + (Admin._tab==='users'     ? 'active' : '') + '" onclick="Admin._switchTab(\'users\')">' +
        'Utilizadores' + (pendingUsers ? ' <span class="admin-tab-badge">' + pendingUsers + '</span>' : '') +
      '</button>' +
      '<button class="admin-tab ' + (Admin._tab==='locations' ? 'active' : '') + '" onclick="Admin._switchTab(\'locations\')">' +
        'Locais Submetidos' + (pendingLocs ? ' <span class="admin-tab-badge">' + pendingLocs + '</span>' : '') +
      '</button>' +
    '</div>';
  },

  _switchTab: function(tab) {
    Admin._tab = tab;
    Admin.render();
  },

  /* ── USERS TAB ───────────────────────────────────────────── */
  _renderUsers: function() {
    var users    = Store.getUsers();
    var allUsers = Object.values(users).filter(function(u) {
      return u.email !== 'admin@delta.pt' && u.email !== 'admin';
    });
    allUsers.sort(function(a,b){ return new Date(b.joined)-new Date(a.joined); });

    var pending  = allUsers.filter(function(u){ return (u.status||'pending')==='pending'; });
    var approved = allUsers.filter(function(u){ return u.status==='approved'; });
    var inactive = allUsers.filter(function(u){ return u.status==='inactive'||u.status==='rejected'; });

    var html = Admin._tabHeader();

    /* localStorage warning */
    html += '<div class="admin-warning">' +
      '<strong>Atenção:</strong> Os dados de utilizadores estão guardados localmente neste browser. ' +
      'Utilize "Exportar" e "Importar" para partilhar utilizadores entre dispositivos ou browsers.' +
    '</div>';

    /* Stats */
    html += '<div class="admin-stats">' +
      '<div class="admin-stat-cell"><div class="admin-stat-num">' + allUsers.length + '</div><div class="admin-stat-lbl">Total</div></div>' +
      '<div class="admin-stat-cell" style="border-color:#2e7d5e;"><div class="admin-stat-num" style="color:#1a6b3c;">' + approved.length + '</div><div class="admin-stat-lbl">Aprovados</div></div>' +
      '<div class="admin-stat-cell" style="border-color:#b07d2e;"><div class="admin-stat-num" style="color:#92400e;">' + pending.length + '</div><div class="admin-stat-lbl">Pendentes</div></div>' +
      '<div class="admin-stat-cell" style="border-color:#9ca3af;"><div class="admin-stat-num" style="color:#6b7280;">' + inactive.length + '</div><div class="admin-stat-lbl">Inativos</div></div>' +
    '</div>';

    /* Pending users first */
    if (pending.length) {
      html += '<div class="admin-card admin-card-pending">';
      html += '<div class="card-section-title admin-pending-title">' +
        '<span class="admin-badge-num">' + pending.length + '</span> Pendentes de Aprovação</div>';
      pending.forEach(function(u){ html += Admin._userRow(u); });
      html += '</div>';
    }

    /* Create user */
    html += '<div class="admin-card">' +
      '<div class="card-section-title">Criar Novo Utilizador</div>' +
      '<div class="admin-create-form">' +
        '<div class="admin-form-row">' +
          '<div><label class="flabel" style="margin-top:0;">Nome *</label>' +
            '<input class="finput" id="new-u-name" placeholder="Nome completo" style="font-size:13px;"></div>' +
          '<div><label class="flabel" style="margin-top:0;">Email *</label>' +
            '<input class="finput" id="new-u-email" type="email" placeholder="email@exemplo.com" style="font-size:13px;"></div>' +
        '</div>' +
        '<div class="admin-form-row">' +
          '<div><label class="flabel">Password *</label>' +
            '<input class="finput" id="new-u-pass" type="text" placeholder="Mínimo 6 caracteres" style="font-size:13px;"></div>' +
          '<div><label class="flabel">Estado inicial</label>' +
            '<select class="finput" id="new-u-status" style="font-size:13px;">' +
              '<option value="approved">Aprovado</option>' +
              '<option value="pending">Pendente</option>' +
            '</select></div>' +
        '</div>' +
        '<div style="display:flex;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap;">' +
          '<button class="admin-btn admin-btn-approve" style="padding:9px 24px;font-size:12px;" onclick="Admin.createUser()">+ Criar Utilizador</button>' +
          '<div class="admin-separator">|</div>' +
          '<button class="admin-btn admin-btn-reset" style="padding:9px 16px;font-size:11px;" onclick="Admin.exportUsers()">Exportar Utilizadores</button>' +
          '<label class="admin-btn admin-btn-reset" style="padding:9px 16px;font-size:11px;cursor:pointer;">' +
            'Importar Utilizadores' +
            '<input type="file" accept=".json" style="display:none;" onchange="Admin.importUsers(this)">' +
          '</label>' +
        '</div>' +
        '<div class="err-box" id="create-err" style="margin-top:10px;"></div>' +
      '</div>' +
    '</div>';

    /* All users */
    html += '<div class="admin-card">' +
      '<div class="card-section-title">Todos os Utilizadores (' + allUsers.length + ')</div>';
    if (!allUsers.length) {
      html += '<p class="no-spots-msg">Nenhum utilizador registado ainda.</p>';
    } else {
      allUsers.forEach(function(u){ html += Admin._userRow(u); });
    }
    html += '</div>';

    document.getElementById('admin-body').innerHTML = html;
  },

  _userRow: function(u) {
    var st  = u.status || 'pending';
    var pts = u.points || 0;
    var lv  = Gamification.getLevel(pts);
    var cnt = App.locations.filter(function(l){ return l.ownerEmail === u.email; }).length;
    var SL  = { approved:'Aprovado', pending:'Pendente', inactive:'Inativo', rejected:'Recusado' };
    var SC  = { approved:'#1a6b3c', pending:'#92400e', inactive:'#6b7280', rejected:'#7a1524' };
    var SB  = { approved:'#e6f4ec', pending:'#fef3e2', inactive:'#f3f4f6', rejected:'#fde8eb' };
    var joined = '';
    try { joined = new Date(u.joined).toLocaleDateString('pt-PT',{day:'numeric',month:'short',year:'numeric'}); } catch(e){}

    return '<div class="admin-user-row">' +
      '<div class="admin-user-av" style="background:var(--d-red);">' + (u.avatar||u.name[0]) + '</div>' +
      '<div class="admin-user-info">' +
        '<div class="admin-user-name">' + u.name + '</div>' +
        '<div class="admin-user-email">' + u.email + '</div>' +
        '<div class="admin-user-meta">' + joined + ' &middot; ' + pts + ' pts &middot; ' + cnt + ' locais &middot; <span style="color:' + lv.color + ';font-weight:600;">' + lv.name + '</span></div>' +
      '</div>' +
      '<div class="admin-user-right">' +
        '<span class="admin-status-badge" style="background:' + (SB[st]||'#f3f4f6') + ';color:' + (SC[st]||'#666') + ';">' + (SL[st]||st) + '</span>' +
        '<div class="admin-actions">' +
          (st==='pending'  ? '<button class="admin-btn admin-btn-approve" data-act="approve" data-em="' + u.email + '">Aprovar</button>' : '') +
          (st==='pending'  ? '<button class="admin-btn admin-btn-reject"  data-act="reject"  data-em="' + u.email + '">Recusar</button>'  : '') +
          (st==='approved' ? '<button class="admin-btn admin-btn-inactive" data-act="inactive" data-em="' + u.email + '">Desativar</button>' : '') +
          (st==='inactive'||st==='rejected' ? '<button class="admin-btn admin-btn-approve" data-act="approve" data-em="' + u.email + '">Reativar</button>' : '') +
          '<button class="admin-btn admin-btn-reset" data-act="reset" data-em="' + u.email + '">Reset Pass</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  },

  createUser: function() {
    var errEl = document.getElementById('create-err');
    errEl.classList.remove('show');
    var name   = (document.getElementById('new-u-name')  ||{value:''}).value.trim();
    var email  = (document.getElementById('new-u-email') ||{value:''}).value.trim().toLowerCase();
    var pass   = (document.getElementById('new-u-pass')  ||{value:''}).value.trim();
    var status = (document.getElementById('new-u-status')||{value:'approved'}).value;
    if (!name)        { errEl.textContent='O nome é obrigatório.';        errEl.classList.add('show'); return; }
    if (!email)       { errEl.textContent='O email é obrigatório.';       errEl.classList.add('show'); return; }
    if (!pass)        { errEl.textContent='A password é obrigatória.';    errEl.classList.add('show'); return; }
    if (pass.length<6){ errEl.textContent='Password precisa de 6+ chars.';errEl.classList.add('show'); return; }
    var users = Store.getUsers();
    if (users[email]) { errEl.textContent='Email já registado.';          errEl.classList.add('show'); return; }
    users[email] = { email:email, name:name, avatar:name[0].toUpperCase(), password:pass, role:'user', status:status, joined:new Date().toISOString(), contributions:0, points:0 };
    Store.saveUsers(users);
    UI.toast('Utilizador ' + name + ' criado!', 'success');
    Admin.render();
  },

  exportUsers: function() {
    var users = Store.getUsers();
    var data  = JSON.stringify(users, null, 2);
    var blob  = new Blob([data], {type:'application/json'});
    var url   = URL.createObjectURL(blob);
    var a     = document.createElement('a');
    a.href    = url;
    a.download= 'delta-users-' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
    UI.toast('Utilizadores exportados.');
  },

  importUsers: function(input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var imported = JSON.parse(e.target.result);
        var existing = Store.getUsers();
        // Merge — imported wins for new users, existing wins for admin
        Object.keys(imported).forEach(function(email) {
          if (email !== 'admin@delta.pt' && email !== 'admin') {
            existing[email] = imported[email];
          }
        });
        Store.saveUsers(existing);
        UI.toast('Utilizadores importados com sucesso!', 'success');
        Admin.render();
      } catch(err) {
        UI.toast('Erro ao importar ficheiro.', 'error');
      }
    };
    reader.readAsText(file);
  },

  /* ── LOCATIONS TAB ───────────────────────────────────────── */
  _renderLocations: function() {
    var pendingLocs = App.locations.filter(function(l){
      return l.ownerEmail && !l.verified && (l.status === 'pending' || !l.status);
    });
    var approvedLocs = App.locations.filter(function(l){
      return l.ownerEmail && (l.verified || l.status === 'approved');
    });

    var html = Admin._tabHeader();

    /* Pending locations */
    if (pendingLocs.length) {
      html += '<div class="admin-card admin-card-pending">';
      html += '<div class="card-section-title admin-pending-title">' +
        '<span class="admin-badge-num">' + pendingLocs.length + '</span> Aguardam Aprovação</div>';
      pendingLocs.forEach(function(loc){ html += Admin._locRow(loc, true); });
      html += '</div>';
    } else {
      html += '<div class="admin-card">' +
        '<div class="card-section-title">Locais Pendentes</div>' +
        '<p class="no-spots-msg" style="padding:12px 0;">Nenhum local aguarda aprovação.</p>' +
      '</div>';
    }

    /* Approved user locations */
    if (approvedLocs.length) {
      html += '<div class="admin-card">';
      html += '<div class="card-section-title">Locais Aprovados por Utilizadores (' + approvedLocs.length + ')</div>';
      approvedLocs.forEach(function(loc){ html += Admin._locRow(loc, false); });
      html += '</div>';
    }

    document.getElementById('admin-body').innerHTML = html;
  },

  _locRow: function(loc, isPending) {
    var cfg = TYPE_CONFIG[loc.type] || { label: loc.type, color: '#888' };
    var date = '';
    try { date = new Date(loc.createdAt||Date.now()).toLocaleDateString('pt-PT',{day:'numeric',month:'short',year:'numeric'}); } catch(e){}

    return '<div class="admin-user-row" style="border-left:4px solid ' + cfg.color + ';">' +
      '<div class="admin-user-av" style="background:' + cfg.color + ';font-size:18px;">📍</div>' +
      '<div class="admin-user-info">' +
        '<div class="admin-user-name">' + loc.name + '</div>' +
        '<div class="admin-user-email">' +
          (loc.address ? loc.address : '') +
          (loc.city    ? (loc.address ? ' · ' : '') + loc.city : '') +
          (loc.country ? ', ' + loc.country : '') +
        '</div>' +
        '<div class="admin-user-meta">' +
          cfg.label + ' &middot; submetido por <strong>' + loc.addedBy + '</strong>' +
          (date ? ' &middot; ' + date : '') +
        '</div>' +
      '</div>' +
      '<div class="admin-user-right">' +
        '<span class="admin-status-badge" style="' + (isPending ? 'background:#fef3e2;color:#92400e;' : 'background:#e6f4ec;color:#1a6b3c;') + '">' +
          (isPending ? 'Pendente' : 'Aprovado') +
        '</span>' +
        '<div class="admin-actions">' +
          (isPending ? '<button class="admin-btn admin-btn-approve" data-act="approve-loc" data-em="' + loc.id + '">Aprovar</button>' : '') +
          (isPending ? '<button class="admin-btn admin-btn-reject"  data-act="reject-loc"  data-em="' + loc.id + '">Recusar</button>'  : '') +
          (!isPending ? '<button class="admin-btn admin-btn-inactive" data-act="remove-loc" data-em="' + loc.id + '">Remover</button>' : '') +
        '</div>' +
      '</div>' +
    '</div>';
  },

  /* ── ACTIONS ─────────────────────────────────────────────── */
  handleAction: function(act, id) {
    /* Location actions */
    if (act === 'approve-loc') {
      var loc = App.locations.find(function(l){ return l.id === id; });
      if (loc) {
        loc.verified = true;
        loc.status   = 'approved';
        App.saveUserLocations();
        Map.renderMarkers();
        UI.toast('Local aprovado e publicado!', 'success');
        Admin.render();
      }
      return;
    }
    if (act === 'reject-loc' || act === 'remove-loc') {
      var idx = App.locations.findIndex(function(l){ return l.id === id; });
      if (idx > -1) {
        App.locations.splice(idx, 1);
        App.saveUserLocations();
        Map.renderMarkers();
        UI.toast(act === 'reject-loc' ? 'Local recusado.' : 'Local removido.');
        Admin.render();
      }
      return;
    }
    /* User actions */
    var users = Store.getUsers();
    if (!users[id]) return;
    if (act === 'approve') {
      users[id].status = 'approved';
      UI.toast(users[id].name + ' aprovado/a.', 'success');
    } else if (act === 'reject') {
      users[id].status = 'rejected';
      UI.toast('Registo recusado.');
    } else if (act === 'inactive') {
      users[id].status = 'inactive';
      UI.toast('Conta desativada.');
    } else if (act === 'reset') {
      var np = 'Delta' + Math.floor(1000 + Math.random()*9000);
      users[id].password = np;
      Store.saveUsers(users);
      UI.toast('Nova password: ' + np, 'success');
      return;
    }
    Store.saveUsers(users);
    Admin.render();
  }
};

/* Event delegation */
document.addEventListener('click', function(e) {
  var btn = e.target.closest('[data-act]');
  if (!btn) return;
  var act = btn.getAttribute('data-act');
  var em  = btn.getAttribute('data-em');
  if (act && em) Admin.handleAction(act, em);
});
