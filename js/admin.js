/* ═══════════════════════════════════════════════════
   ADMIN PANEL — gestão de utilizadores
   ═══════════════════════════════════════════════════ */

var Admin = {

  open: function() {
    if (!App.currentUser || App.currentUser.role !== 'admin') {
      UI.toast('Acesso não autorizado.', 'error');
      return;
    }
    UI.closeAllOverlays();
    Admin.render();
    document.getElementById('admin-overlay').classList.remove('hidden');
  },

  render: function() {
    var users    = Store.getUsers();
    var allUsers = Object.values(users).filter(function(u) {
      return u.email !== 'admin@delta.pt' && u.email !== 'admin';
    });
    allUsers.sort(function(a, b) { return new Date(b.joined) - new Date(a.joined); });

    var pending  = allUsers.filter(function(u) { return (u.status||'pending') === 'pending';  });
    var approved = allUsers.filter(function(u) { return u.status === 'approved'; });
    var inactive = allUsers.filter(function(u) { return u.status === 'inactive' || u.status === 'rejected'; });

    var html = '';

    // ── Stats ─────────────────────────────────────────────────
    html += '<div class="admin-stats">' +
      '<div class="admin-stat-cell"><div class="admin-stat-num">' + allUsers.length + '</div><div class="admin-stat-lbl">Total</div></div>' +
      '<div class="admin-stat-cell" style="border-color:#2e7d5e;"><div class="admin-stat-num" style="color:#1a6b3c;">' + approved.length + '</div><div class="admin-stat-lbl">Aprovados</div></div>' +
      '<div class="admin-stat-cell" style="border-color:#b07d2e;"><div class="admin-stat-num" style="color:#92400e;">' + pending.length + '</div><div class="admin-stat-lbl">Pendentes</div></div>' +
      '<div class="admin-stat-cell" style="border-color:#9ca3af;"><div class="admin-stat-num" style="color:#6b7280;">' + inactive.length + '</div><div class="admin-stat-lbl">Inativos</div></div>' +
    '</div>';

    // ── Pending section ────────────────────────────────────────
    if (pending.length > 0) {
      html += '<div class="admin-card admin-card-pending">';
      html += '<div class="card-section-title" style="color:#92400e;display:flex;align-items:center;gap:8px;">' +
        '<span style="display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;background:#92400e;color:#fff;border-radius:50%;font-size:10px;font-weight:800;">' + pending.length + '</span>' +
        'Pendentes de Aprovação' +
        '</div>';
      pending.forEach(function(u) { html += Admin._userRow(u); });
      html += '</div>';
    }

    // ── Create new user ────────────────────────────────────────
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
        '<button class="admin-btn admin-btn-approve" style="padding:9px 24px;font-size:12px;margin-top:4px;" onclick="Admin.createUser()">+ Criar Utilizador</button>' +
        '<div class="err-box" id="create-err" style="margin-top:10px;"></div>' +
      '</div>' +
    '</div>';

    // ── All users ──────────────────────────────────────────────
    html += '<div class="admin-card">';
    html += '<div class="card-section-title">Todos os Utilizadores (' + allUsers.length + ')</div>';
    if (!allUsers.length) {
      html += '<p class="no-spots-msg">Nenhum utilizador registado ainda.</p>';
    } else {
      allUsers.forEach(function(u) { html += Admin._userRow(u); });
    }
    html += '</div>';

    document.getElementById('admin-body').innerHTML = html;
  },

  _userRow: function(u) {
    var st  = u.status || 'pending';
    var pts = u.points || 0;
    var lv  = Gamification.getLevel(pts);
    var cnt = App.locations.filter(function(l) { return l.ownerEmail === u.email; }).length;

    var SL = { approved:'Aprovado', pending:'Pendente', inactive:'Inativo', rejected:'Recusado' };
    var SC = { approved:'#1a6b3c', pending:'#92400e', inactive:'#6b7280', rejected:'#7a1524' };
    var SB = { approved:'#e6f4ec', pending:'#fef3e2', inactive:'#f3f4f6', rejected:'#fde8eb' };

    var joinedDate = '';
    try { joinedDate = new Date(u.joined).toLocaleDateString('pt-PT',{day:'numeric',month:'short',year:'numeric'}); } catch(e) {}

    return '<div class="admin-user-row" data-email="' + u.email + '">' +
      '<div class="admin-user-av" style="background:var(--d-red);">' + (u.avatar||u.name[0]) + '</div>' +
      '<div class="admin-user-info">' +
        '<div class="admin-user-name">' + u.name + '</div>' +
        '<div class="admin-user-email">' + u.email + '</div>' +
        '<div class="admin-user-meta">' +
          joinedDate +
          ' &middot; ' + pts + ' pts' +
          ' &middot; ' + cnt + ' locais' +
          ' &middot; <span style="color:' + lv.color + ';font-weight:600;">' + lv.name + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="admin-user-right">' +
        '<span class="admin-status-badge" style="background:' + (SB[st]||'#f3f4f6') + ';color:' + (SC[st]||'#666') + ';">' + (SL[st]||st) + '</span>' +
        '<div class="admin-actions">' +
          (st==='pending'  ? '<button class="admin-btn admin-btn-approve" data-act="approve" data-em="' + u.email + '">Aprovar</button>' : '') +
          (st==='pending'  ? '<button class="admin-btn admin-btn-reject"  data-act="reject"  data-em="' + u.email + '">Recusar</button>' : '') +
          (st==='approved' ? '<button class="admin-btn admin-btn-inactive" data-act="inactive" data-em="' + u.email + '">Desativar</button>' : '') +
          (st==='inactive'||st==='rejected' ? '<button class="admin-btn admin-btn-approve" data-act="approve" data-em="' + u.email + '">Reativar</button>' : '') +
          '<button class="admin-btn admin-btn-reset" data-act="reset" data-em="' + u.email + '">Reset Pass</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  },

  createUser: function() {
    var errEl = document.getElementById('create-err');
    var showErr = function(msg) { errEl.textContent=msg; errEl.classList.add('show'); };
    errEl.classList.remove('show');

    var name   = (document.getElementById('new-u-name')  ||{value:''}).value.trim();
    var email  = (document.getElementById('new-u-email') ||{value:''}).value.trim().toLowerCase();
    var pass   = (document.getElementById('new-u-pass')  ||{value:''}).value.trim();
    var status = (document.getElementById('new-u-status')||{value:'approved'}).value;

    if (!name)         { showErr('O nome é obrigatório.');         return; }
    if (!email)        { showErr('O email é obrigatório.');        return; }
    if (!pass)         { showErr('A password é obrigatória.');     return; }
    if (pass.length<6) { showErr('Password precisa de 6+ caracteres.'); return; }

    var users = Store.getUsers();
    if (users[email])  { showErr('Este email já está registado.'); return; }

    users[email] = {
      email: email, name: name,
      avatar: name[0].toUpperCase(),
      password: pass, role: 'user', status: status,
      joined: new Date().toISOString(),
      contributions: 0, points: 0
    };
    Store.saveUsers(users);
    UI.toast('Utilizador ' + name + ' criado com sucesso!', 'success');
    Admin.render();
  },

  handleAction: function(act, id) {
    // Location actions
    if (act === 'approve-loc') {
      var loc = App.locations.find(function(l){ return l.id === id; });
      if (loc) { loc.verified = true; loc.status = 'approved'; App.saveUserLocations(); Map.renderMarkers(); UI.toast('Local aprovado e publicado!', 'success'); Admin.render(); }
      return;
    }
    if (act === 'reject-loc') {
      var idx = App.locations.findIndex(function(l){ return l.id === id; });
      if (idx > -1) { App.locations.splice(idx, 1); App.saveUserLocations(); UI.toast('Local recusado.'); Admin.render(); }
      return;
    }
    // User actions
    var users = Store.getUsers();
    if (!users[id]) return;
    if (act === 'approve') {
      users[id].status = 'approved';
      UI.toast(users[id].name + ' aprovado/a.');
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

// Event delegation — all admin action buttons
document.addEventListener('click', function(e) {
  var btn = e.target.closest('[data-act]');
  if (!btn) return;
  var act   = btn.getAttribute('data-act');
  var email = btn.getAttribute('data-em');
  if (act && email) Admin.handleAction(act, email);
});
