/* ═══════════════════════════════════════════════════
   ADMIN PANEL — tabs: Utilizadores | Locais  v2
   ═══════════════════════════════════════════════════ */

var Admin = {
  _tab: 'users',

  open: async function() {
    if (!App.currentUser || App.currentUser.role !== 'admin') {
      UI.toast('Acesso não autorizado.', 'error');
      return;
    }
    UI.closeAllOverlays();
    Admin._tab = 'users';
    document.getElementById('admin-overlay').classList.remove('hidden');
    document.getElementById('admin-body').innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;padding:60px;gap:12px;color:var(--mut);">' +
        '<div class="spinner"></div>' +
      '</div>';
    await Admin._loadAndRender();
  },

  render: function() {
    Admin._tab === 'locations' ? Admin._renderLocations() : Admin._renderUsers();
  },

  _sbUsers: [],

  _loadAndRender: async function() {
    try {
      const uRows = await DB.getAllUsers();
      Admin._sbUsers = uRows.filter(function(u){ return u.email !== 'admin@delta.pt' && u.email !== 'admin'; });
    } catch(e) { console.warn('load users:', e); Admin._sbUsers = []; }
    try {
      const rows = await DB.getAllLocations();
      const seedIds = new Set(SEED_LOCATIONS.map(s => s.id));
      App.locations = [...SEED_LOCATIONS];
      rows.forEach(function(l) {
        if (!seedIds.has(l.id)) {
          App.locations.push({
            id:l.id, name:l.name, type:l.type, lat:l.lat, lng:l.lng,
            country:l.country||'', city:l.city||'', address:l.address||'',
            hours:l.hours||null, note:l.note||null, products:l.products||[],
            verified:l.verified||false, status:l.status||'pending',
            addedBy:l.added_by||'', ownerEmail:l.owner_email||null,
            upvotes:l.upvotes||0, createdAt:l.created_at
          });
        }
      });
    } catch(e) { console.warn('loadAndRender:', e); }
    Admin.render();
  },

  /* ── TAB HEADER ── */
  _tabHeader: function() {
    var pendingUsers = Admin._sbUsers.filter(function(u){ return (u.status||'pending')==='pending'; }).length;
    var pendingLocs  = App.locations.filter(function(l){ return l.ownerEmail&&!l.verified&&(l.status==='pending'||!l.status); }).length;
    return '<div class="admin-tabs">' +
      '<button class="admin-tab '+(Admin._tab==='users'?'active':'')+'" onclick="Admin._switchTab(\'users\')">' +
        'Utilizadores'+(pendingUsers?' <span class="admin-tab-badge">'+pendingUsers+'</span>':'')+
      '</button>' +
      '<button class="admin-tab '+(Admin._tab==='locations'?'active':'')+'" onclick="Admin._switchTab(\'locations\')">' +
        'Locais Submetidos'+(pendingLocs?' <span class="admin-tab-badge">'+pendingLocs+'</span>':'')+
      '</button>' +
    '</div>';
  },

  _switchTab: function(tab) { Admin._tab = tab; Admin._loadAndRender(); },

  /* ── AVATAR helper — usa SVG do Gamification ou inicial ── */
  _avatarHtml: function(u, size) {
    size = size || 46;
    var pts = u.points || 0;
    var lv  = (typeof Gamification !== 'undefined') ? Gamification.getLevel(pts) : { color: '#a13a1e', bg: '#a13a1e' };
    var svg = '';
    try { svg = Gamification.getAvatarSVG(pts, u.selected_avatar !== undefined ? u.selected_avatar : u.selectedAvatar); } catch(e) {}
    if (svg) {
      return '<div class="admin-avatar-circle" style="background:'+lv.color+';width:'+size+'px;height:'+size+'px;border:2px solid '+lv.color+'40;">'+svg+'</div>';
    }
    var initial = (u.name||'?')[0].toUpperCase();
    return '<div class="admin-avatar-circle" style="background:'+lv.color+';width:'+size+'px;height:'+size+'px;font-size:'+(size/2.5)+'px;font-weight:700;color:#fff;">'+initial+'</div>';
  },

  /* ── USER ROW ── */
  _userRow: function(u) {
    var status   = u.status || 'pending';
    var lv       = (typeof Gamification !== 'undefined') ? Gamification.getLevel(u.points||0) : { name:'—', color:'#888' };
    var joinDate = '';
    try { joinDate = new Date(u.joined).toLocaleDateString('pt-PT',{day:'numeric',month:'short',year:'numeric'}); } catch(e){}

    var statusCfg = {
      approved : { bg:'rgba(136,184,206,.18)', color:'#1a5068', label:'Aprovado'  },
      pending  : { bg:'rgba(241,193,102,.2)',  color:'#7a4e10', label:'Pendente'  },
      inactive : { bg:'rgba(0,0,0,.06)',       color:'#6b7280', label:'Inativo'   },
      rejected : { bg:'rgba(161,58,30,.1)',    color:'#a13a1e', label:'Recusado'  },
    };
    var sc = statusCfg[status] || statusCfg.pending;

    var actions = '';
    if (status === 'pending') {
      actions += '<button class="admin-btn admin-btn-approve" data-act="approve" data-em="'+u.email+'">Aprovar</button>';
      actions += '<button class="admin-btn admin-btn-reject"  data-act="reject"  data-em="'+u.email+'">Recusar</button>';
    } else if (status === 'approved') {
      actions += '<button class="admin-btn admin-btn-inactive" data-act="inactive" data-em="'+u.email+'">Desativar</button>';
      actions += '<button class="admin-btn admin-btn-reset"    data-act="reset"    data-em="'+u.email+'">Reset PW</button>';
    } else {
      actions += '<button class="admin-btn admin-btn-approve" data-act="approve" data-em="'+u.email+'">Reativar</button>';
    }
    // Edit button always visible
    actions += '<button class="admin-btn admin-btn-edit" data-act="edit-user" data-em="'+u.email+'">Editar</button>';

    return '<div class="admin-profile-row">' +
      Admin._avatarHtml(u, 46) +
      '<div class="admin-user-details">' +
        '<div class="admin-user-name-row">' +
          '<span class="admin-user-fullname">'+u.name+'</span>' +
          '<span class="admin-status-badge" style="background:'+sc.bg+';color:'+sc.color+';">'+sc.label+'</span>' +
          (u.role==='admin'?'<span class="admin-status-badge" style="background:rgba(84,41,22,.1);color:var(--espresso);">Admin</span>':'')+
        '</div>' +
        '<div class="admin-user-email-sm">'+u.email+'</div>' +
        '<div class="admin-user-stats-sm">' +
          '<span style="color:'+lv.color+';font-weight:600;">'+lv.name+'</span>' +
          ' &middot; '+(u.points||0)+' pts' +
          ' &middot; '+(u.contributions||0)+' locais' +
          (joinDate?' &middot; desde '+joinDate:'') +
        '</div>' +
      '</div>' +
      '<div class="admin-row-right">' +
        '<div class="admin-actions">'+actions+'</div>' +
      '</div>' +
    '</div>';
  },

  /* ── USERS TAB ── */
  _renderUsers: function() {
    var allUsers = Admin._sbUsers.length ? Admin._sbUsers : [];
    allUsers.sort(function(a,b){ return new Date(b.joined)-new Date(a.joined); });

    var pending  = allUsers.filter(function(u){ return (u.status||'pending')==='pending'; });
    var approved = allUsers.filter(function(u){ return u.status==='approved'; });
    var inactive = allUsers.filter(function(u){ return u.status==='inactive'||u.status==='rejected'; });

    var html = Admin._tabHeader();

    /* Stats */
    html += '<div class="admin-stats">' +
      '<div class="admin-stat-cell admin-stat-clickable" data-filter="all"><div class="admin-stat-num">'+allUsers.length+'</div><div class="admin-stat-lbl">Total</div></div>' +
      '<div class="admin-stat-cell admin-stat-clickable" data-filter="approved" style="border-color:rgba(136,184,206,.5);"><div class="admin-stat-num" style="color:#1a5068;">'+approved.length+'</div><div class="admin-stat-lbl">Aprovados</div></div>' +
      '<div class="admin-stat-cell admin-stat-clickable" data-filter="pending"  style="border-color:rgba(241,193,102,.5);"><div class="admin-stat-num" style="color:#7a4e10;">'+pending.length+'</div><div class="admin-stat-lbl">Pendentes</div></div>' +
      '<div class="admin-stat-cell admin-stat-clickable" data-filter="inactive" style="border-color:rgba(0,0,0,.12);"><div class="admin-stat-num" style="color:#6b7280;">'+inactive.length+'</div><div class="admin-stat-lbl">Inativos</div></div>' +
    '</div>';
    html += '<div id="admin-user-filter-list" style="margin-bottom:14px;"></div>';

    /* Pending first */
    if (pending.length) {
      html += '<div class="admin-card admin-card-pending">';
      html += '<div class="card-section-title admin-pending-title"><span class="admin-badge-num">'+pending.length+'</span> Pendentes de Aprovação</div>';
      html += '<div class="admin-section">';
      pending.forEach(function(u){ html += Admin._userRow(u); });
      html += '</div></div>';
    }

    /* Create user */
    html += '<div class="admin-card">' +
      '<div class="card-section-title">Criar Novo Utilizador</div>' +
      '<div class="admin-create-form">' +
        '<div class="admin-form-row">' +
          '<div><label class="flabel" style="margin-top:0;">Nome *</label><input class="finput admin-inp" id="new-u-name" placeholder="Nome completo"></div>' +
          '<div><label class="flabel" style="margin-top:0;">Email *</label><input class="finput admin-inp" id="new-u-email" type="email" placeholder="email@exemplo.com"></div>' +
        '</div>' +
        '<div class="admin-form-row">' +
          '<div><label class="flabel">Password *</label><input class="finput admin-inp" id="new-u-pass" type="text" placeholder="Mínimo 6 caracteres"></div>' +
          '<div><label class="flabel">Estado inicial</label>' +
            '<select class="finput admin-inp" id="new-u-status"><option value="approved">Aprovado</option><option value="pending">Pendente</option></select>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;gap:8px;align-items:center;margin-top:12px;flex-wrap:wrap;">' +
          '<button class="admin-btn admin-btn-approve" style="padding:9px 20px;font-size:12px;" onclick="Admin.createUser()">+ Criar Utilizador</button>' +
          '<button class="admin-btn admin-btn-reset" style="padding:9px 16px;font-size:11px;" onclick="Admin.exportUsers()">Exportar</button>' +
          '<label class="admin-btn admin-btn-reset" style="padding:9px 16px;font-size:11px;cursor:pointer;">Importar<input type="file" accept=".json" style="display:none;" onchange="Admin.importUsers(this)"></label>' +
        '</div>' +
        '<div class="err-box" id="create-err" style="margin-top:10px;"></div>' +
      '</div>' +
    '</div>';

    /* All users */
    html += '<div class="admin-card">';
    html += '<div class="card-section-title">Todos os Utilizadores ('+allUsers.length+')</div>';
    if (!allUsers.length) {
      html += '<p class="no-spots-msg">Nenhum utilizador registado ainda.</p>';
    } else {
      html += '<div class="admin-section">';
      allUsers.forEach(function(u){ html += Admin._userRow(u); });
      html += '</div>';
    }
    html += '</div>';

    document.getElementById('admin-body').innerHTML = html;

    /* Clickable stats */
    document.querySelectorAll('.admin-stat-clickable').forEach(function(cell) {
      cell.addEventListener('click', function() {
        document.querySelectorAll('.admin-stat-clickable').forEach(function(c){ c.classList.remove('admin-stat-active'); });
        cell.classList.add('admin-stat-active');
        var filter = cell.dataset.filter;
        var listEl = document.getElementById('admin-user-filter-list');
        if (!listEl) return;
        var filtered = filter === 'all' ? allUsers : allUsers.filter(function(u){
          if (filter === 'inactive') return u.status === 'inactive' || u.status === 'rejected';
          return u.status === filter;
        });
        if (!filtered.length) {
          listEl.innerHTML = '<div class="admin-card"><p class="no-spots-msg">Nenhum utilizador nesta categoria.</p></div>';
          return;
        }
        var h = '<div class="admin-card"><div class="card-section-title">' +
          cell.querySelector('.admin-stat-lbl').textContent + ' (' + filtered.length + ')</div>' +
          '<div class="admin-section">';
        filtered.forEach(function(u){ h += Admin._userRow(u); });
        h += '</div></div>';
        listEl.innerHTML = h;
        listEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  },

  /* ── CREATE / EXPORT / IMPORT ── */
  createUser: async function() {
    var name   = (document.getElementById('new-u-name')||{value:''}).value.trim();
    var email  = (document.getElementById('new-u-email')||{value:''}).value.trim().toLowerCase();
    var pass   = (document.getElementById('new-u-pass')||{value:''}).value.trim();
    var status = (document.getElementById('new-u-status')||{value:'approved'}).value;
    var errEl  = document.getElementById('create-err');
    var showErr = function(m){ if(errEl){errEl.textContent=m;errEl.classList.add('show');} };
    if(errEl) errEl.classList.remove('show');
    if (!name)          { showErr('Nome obrigatório.');         return; }
    if (!email)         { showErr('Email obrigatório.');        return; }
    if (pass.length<6)  { showErr('Password mínimo 6 chars.'); return; }
    try {
      const existing = await DB.getUser(email);
      if (existing) { showErr('Este email já existe.'); return; }
      await DB.createUser({ email, name, avatar:name[0].toUpperCase(), password:pass, role:'user', status, joined:new Date().toISOString(), contributions:0, points:0 });
      UI.toast('Utilizador criado com sucesso!', 'success');
      await Admin._loadAndRender();
    } catch(e) { showErr('Erro ao criar utilizador.'); }
  },

  exportUsers: function() {
    var data = JSON.stringify(Admin._sbUsers, null, 2);
    var blob = new Blob([data], {type:'application/json'});
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href = url; a.download = 'utilizadores-delta.json'; a.click();
    URL.revokeObjectURL(url);
  },

  importUsers: function(input) {
    var file = input.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) { UI.toast('Formato inválido.', 'error'); return; }
        var existing = Store.getUsers();
        data.forEach(function(u){ if(u.email&&u.name&&u.password) existing[u.email]=u; });
        Store.saveUsers(existing);
        UI.toast('Utilizadores importados com sucesso!', 'success');
        Admin.render();
      } catch(err) { UI.toast('Erro ao importar ficheiro.', 'error'); }
    };
    reader.readAsText(file);
  },

  /* ── LOCATION ROW ── */
  _locRow: function(loc, isPending) {
    var cfg  = TYPE_CONFIG[loc.type] || { label: loc.type, color: '#888' };

    return '<div class="admin-loc-card' + (isPending ? ' admin-card-pending' : '') + '">' +
      '<div class="admin-loc-header">' +
        '<div class="admin-loc-dot-lg" style="background:' + cfg.color + ';"></div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div class="admin-loc-name">' + loc.name + '</div>' +
          '<div class="admin-loc-meta">' +
            cfg.label +
            (loc.city    ? ' &middot; ' + loc.city    : '') +
            (loc.country ? ', ' + loc.country          : '') +
            (loc.address ? '<br><span style="font-size:10px;color:var(--mut-lt);">📍 ' + loc.address + '</span>' : '') +
          '</div>' +
          (loc.note ? '<div class="admin-loc-note">"' + loc.note + '"</div>' : '') +
        '</div>' +
        '<span class="admin-status-badge" style="' + (isPending ? 'background:rgba(241,193,102,.2);color:#7a4e10;' : 'background:rgba(136,184,206,.18);color:#1a5068;') + '">' +
          (isPending ? 'Pendente' : 'Aprovado') +
        '</span>' +
      '</div>' +
      '<div class="admin-loc-footer">' +
        '<span class="admin-loc-submitter">Submetido por <strong>' + (loc.addedBy||'—') + '</strong></span>' +
        '<div class="admin-actions">' +
          '<button class="admin-btn admin-btn-edit" data-act="view-loc"  data-em="'+loc.id+'">Ver</button>' +
          '<button class="admin-btn admin-btn-edit" data-act="edit-loc"  data-em="'+loc.id+'">Editar</button>' +
          (isPending  ? '<button class="admin-btn admin-btn-approve" data-act="approve-loc" data-em="'+loc.id+'">✓ Aprovar</button>' : '') +
          (isPending  ? '<button class="admin-btn admin-btn-reject"  data-act="reject-loc"  data-em="'+loc.id+'">✕ Recusar</button>' : '') +
          (!isPending ? '<button class="admin-btn admin-btn-inactive" data-act="remove-loc" data-em="'+loc.id+'">Remover</button>'   : '') +
        '</div>' +
      '</div>' +
    '</div>';
  },

  /* ── LOCATIONS TAB ── */
  _renderLocations: function() {
    var pendingLocs  = App.locations.filter(function(l){ return l.ownerEmail&&!l.verified&&(l.status==='pending'||!l.status); });
    var approvedLocs = App.locations.filter(function(l){ return l.ownerEmail&&(l.verified||l.status==='approved'); });

    var html = Admin._tabHeader();

    if (pendingLocs.length) {
      html += '<div class="admin-card admin-card-pending">';
      html += '<div class="card-section-title admin-pending-title"><span class="admin-badge-num">'+pendingLocs.length+'</span> Aguardam Aprovação</div>';
      html += '<div style="display:flex;flex-direction:column;gap:10px;">';
      pendingLocs.forEach(function(loc){ html += Admin._locRow(loc, true); });
      html += '</div></div>';
    } else {
      html += '<div class="admin-card"><div class="card-section-title">Locais Pendentes</div><p class="no-spots-msg" style="padding:12px 0;">Nenhum local aguarda aprovação. ✓</p></div>';
    }

    if (approvedLocs.length) {
      html += '<div class="admin-card"><div class="card-section-title">Aprovados por Utilizadores ('+approvedLocs.length+')</div>';
      html += '<div style="display:flex;flex-direction:column;gap:10px;">';
      approvedLocs.forEach(function(loc){ html += Admin._locRow(loc, false); });
      html += '</div></div>';
    }

    document.getElementById('admin-body').innerHTML = html;
  },

  /* ── ACTIONS ── */
  handleAction: async function(act, id) {
    if (act === 'approve-loc') {
      var loc = App.locations.find(function(l){ return l.id===id; });
      if (loc) {
        loc.verified=true; loc.status='approved';
        await App.updateLocation(id,{verified:true,status:'approved'});
        Map.renderMarkers();
        UI.toast('Local aprovado e publicado!','success');
        await Admin._loadAndRender();
      }
      return;
    }
    if (act==='reject-loc'||act==='remove-loc') {
      var idx = App.locations.findIndex(function(l){ return l.id===id; });
      if (idx>-1) {
        App.locations.splice(idx,1);
        await App.removeLocation(id);
        Map.renderMarkers();
        UI.toast(act==='reject-loc'?'Local recusado.':'Local removido.');
        await Admin._loadAndRender();
      }
      return;
    }
    if (act === 'edit-user') {
      var u = Admin._sbUsers.find(function(u){ return u.email===id; });
      if (!u) return;
      var ov = document.createElement('div');
      ov.id = 'admin-edit-overlay';
      ov.style.cssText = 'position:fixed;inset:0;z-index:9600;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:24px;';
      ov.innerHTML =
        '<div style="background:var(--surface);border-radius:var(--r-xl);padding:28px 24px 24px;width:min(380px,100%);box-shadow:0 20px 60px rgba(0,0,0,.3);">' +
          '<div style="font-family:var(--font-display);font-size:1.1rem;font-weight:700;color:var(--ink-new);margin-bottom:20px;">Editar utilizador</div>' +
          '<div class="mfield"><label class="mfield-label">Nome</label><input class="mfield-input" id="eu-name" value="'+u.name+'"></div>' +
          '<div class="mfield"><label class="mfield-label">E-mail</label><input class="mfield-input" id="eu-email" value="'+u.email+'" disabled style="opacity:.5;"></div>' +
          '<div class="mfield"><label class="mfield-label">Pontos</label><input class="mfield-input" id="eu-pts" type="number" value="'+(u.points||0)+'"></div>' +
          '<div class="mfield"><label class="mfield-label">Estado</label>' +
            '<select class="mfield-input mfield-select" id="eu-status">' +
              '<option value="approved"'+(u.status==='approved'?' selected':'')+'>Aprovado</option>' +
              '<option value="pending"'+(u.status==='pending'?' selected':'')+'>Pendente</option>' +
              '<option value="inactive"'+(u.status==='inactive'?' selected':'')+'>Inativo</option>' +
            '</select>' +
          '</div>' +
          '<div style="display:flex;gap:10px;margin-top:20px;">' +
            '<button class="msheet-btn msheet-cancel" onclick="document.getElementById(\'admin-edit-overlay\').remove()">Cancelar</button>' +
            '<button class="msheet-btn msheet-submit" id="eu-save">Guardar</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(ov);
      document.getElementById('eu-save').addEventListener('click', async function() {
        var newName   = document.getElementById('eu-name').value.trim();
        var newPts    = parseInt(document.getElementById('eu-pts').value) || 0;
        var newStatus = document.getElementById('eu-status').value;
        if (!newName) { UI.toast('Nome obrigatório.','error'); return; }
        try {
          await DB.updateUser(u.email, { name:newName, points:newPts, status:newStatus });
          u.name=newName; u.points=newPts; u.status=newStatus;
          ov.remove();
          UI.toast('Utilizador actualizado.','success');
          Admin._loadAndRender();
        } catch(e) { UI.toast('Erro ao guardar.','error'); }
      });
      return;
    }

    if (act === 'view-loc') {
      var loc = App.locations.find(function(l){ return l.id===id; });
      if (!loc) return;
      var cfg = TYPE_CONFIG[loc.type] || { label:loc.type, color:'#888' };
      var photoData = loc.photo || '';
      if (!photoData) { try { photoData = localStorage.getItem('spot_photo_'+id)||''; } catch(e){} }
      var ov = document.createElement('div');
      ov.id = 'admin-view-overlay';
      ov.style.cssText = 'position:fixed;inset:0;z-index:9600;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:24px;';
      ov.innerHTML =
        '<div style="background:var(--surface);border-radius:var(--r-xl);width:min(400px,100%);box-shadow:0 20px 60px rgba(0,0,0,.3);overflow:hidden;">' +
          (photoData ? '<img src="'+photoData+'" style="width:100%;height:160px;object-fit:cover;display:block;">' : '') +
          '<div style="padding:24px 24px 20px;">' +
            '<div style="font-family:var(--font-display);font-size:1.15rem;font-weight:700;color:var(--ink-new);margin-bottom:6px;">'+loc.name+'</div>' +
            '<div style="font-size:12px;color:var(--mut);margin-bottom:14px;">'+cfg.label+(loc.city?(' · '+loc.city):'')+(loc.country?(', '+loc.country):'')+'</div>' +
            (loc.address ? '<div style="font-size:12px;color:var(--mut);margin-bottom:8px;">📍 '+loc.address+'</div>' : '') +
            (loc.hours   ? '<div style="font-size:12px;color:var(--mut);margin-bottom:8px;">🕐 '+loc.hours+'</div>' : '') +
            (loc.note    ? '<div style="font-size:12px;color:var(--mut);margin-bottom:8px;font-style:italic;">"'+loc.note+'"</div>' : '') +
            '<div style="font-size:11px;color:var(--mut-lt);margin-top:10px;">Adicionado por <strong>'+loc.addedBy+'</strong></div>' +
            '<button class="msheet-btn msheet-cancel" style="margin-top:16px;width:100%;" onclick="document.getElementById(\'admin-view-overlay\').remove()">Fechar</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(ov);
      return;
    }

    if (act === 'edit-loc') {
      var loc = App.locations.find(function(l){ return l.id===id; });
      if (!loc) return;
      var ov = document.createElement('div');
      ov.id = 'admin-editloc-overlay';
      ov.style.cssText = 'position:fixed;inset:0;z-index:9600;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:24px;';
      ov.innerHTML =
        '<div style="background:var(--surface);border-radius:var(--r-xl);padding:28px 24px 24px;width:min(400px,100%);max-height:88dvh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3);">' +
          '<div style="font-family:var(--font-display);font-size:1.1rem;font-weight:700;color:var(--ink-new);margin-bottom:20px;">Editar local</div>' +
          '<div class="mfield"><label class="mfield-label">Nome</label><input class="mfield-input" id="el-name" value="'+loc.name+'"></div>' +
          '<div class="mfield"><label class="mfield-label">Morada</label><input class="mfield-input" id="el-addr" value="'+(loc.address||'')+'"></div>' +
          '<div class="mfield"><label class="mfield-label">Cidade</label><input class="mfield-input" id="el-city" value="'+(loc.city||'')+'"></div>' +
          '<div class="mfield"><label class="mfield-label">País</label><input class="mfield-input" id="el-country" value="'+(loc.country||'')+'"></div>' +
          '<div class="mfield"><label class="mfield-label">Horário</label><input class="mfield-input" id="el-hours" value="'+(loc.hours||'')+'" placeholder="Ex: Seg–Sex 08h–20h"></div>' +
          '<div class="mfield"><label class="mfield-label">Nota</label><textarea class="mfield-input mfield-textarea" id="el-note" rows="2">'+(loc.note||'')+'</textarea></div>' +
          '<div style="display:flex;gap:10px;margin-top:20px;">' +
            '<button class="msheet-btn msheet-cancel" onclick="document.getElementById(\'admin-editloc-overlay\').remove()">Cancelar</button>' +
            '<button class="msheet-btn msheet-submit" id="el-save">Guardar</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(ov);
      document.getElementById('el-save').addEventListener('click', async function() {
        var updates = {
          name:    document.getElementById('el-name').value.trim() || loc.name,
          address: document.getElementById('el-addr').value.trim(),
          city:    document.getElementById('el-city').value.trim(),
          country: document.getElementById('el-country').value.trim(),
          hours:   document.getElementById('el-hours').value.trim() || null,
          note:    document.getElementById('el-note').value.trim() || null,
        };
        try {
          await App.updateLocation(id, updates);
          Object.assign(loc, updates);
          Map.renderMarkers();
          ov.remove();
          UI.toast('Local actualizado.','success');
          Admin._loadAndRender();
        } catch(e) { UI.toast('Erro ao guardar.','error'); }
      });
      return;
    }

    var updateData={}, toastMsg='';
    if      (act==='approve')  { updateData={status:'approved'};  toastMsg='Utilizador aprovado.'; }
    else if (act==='reject')   { updateData={status:'rejected'};  toastMsg='Registo recusado.'; }
    else if (act==='inactive') { updateData={status:'inactive'};  toastMsg='Conta desativada.'; }
    else if (act==='reset') {
      var np='Delta'+Math.floor(1000+Math.random()*9000);
      updateData={password:np}; toastMsg='Nova password: '+np;
    }
    try {
      await DB.updateUser(id,updateData);
      UI.toast(toastMsg,act==='approve'||act==='reset'?'success':'info');
      await Admin._loadAndRender();
    } catch(e) { UI.toast('Erro ao atualizar. Tenta novamente.','error'); }
  }
};

/* Event delegation */
document.addEventListener('click', function(e) {
  var btn=e.target.closest('[data-act]');
  if (!btn) return;
  var act=btn.getAttribute('data-act'), em=btn.getAttribute('data-em');
  if (act&&em) Admin.handleAction(act,em);
});
