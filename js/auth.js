/* ═══════════════════════════════════════════════════
   AUTH — Autenticação, aprovação e gestão
   ═══════════════════════════════════════════════════ */

const Store = {
  getUsers()     { try { return JSON.parse(localStorage.getItem('dcm_users') || '{}'); } catch { return {}; } },
  saveUsers(u)   { try { localStorage.setItem('dcm_users', JSON.stringify(u)); } catch {} },
  getSession()   { try { return JSON.parse(localStorage.getItem('dcm_session') || 'null'); } catch { return null; } },
  saveSession(s) { try { localStorage.setItem('dcm_session', JSON.stringify(s)); } catch {} },
  getLocs()      { try { return JSON.parse(localStorage.getItem('dcm_locs') || '[]'); } catch { return []; } },
  saveLocs(l)    { try { localStorage.setItem('dcm_locs', JSON.stringify(l)); } catch {} },
};

const Auth = {
  mode: 'login',

  init() {
    const users = Store.getUsers();

    // Ensure admin account always exists and is approved
    // Main admin — email login
    if (!users['admin@delta.pt']) {
      users['admin@delta.pt'] = {
        email: 'admin@delta.pt', name: 'Administrador', avatar: 'A',
        password: 'admin1234', role: 'admin', status: 'approved',
        joined: '2024-01-01T00:00:00Z',
        contributions: 0, points: 500, selectedAvatar: 5
      };
    } else {
      users['admin@delta.pt'].role = 'admin';
      users['admin@delta.pt'].status = 'approved';
    }

    // Simple admin alias — login: admin / 1234
    if (!users['admin']) {
      users['admin'] = {
        email: 'admin', name: 'Admin', avatar: 'A',
        password: '1234', role: 'admin', status: 'approved',
        joined: '2024-01-01T00:00:00Z',
        contributions: 0, points: 500, selectedAvatar: 5
      };
    } else {
      users['admin'].role = 'admin';
      users['admin'].status = 'approved';
    }

    Store.saveUsers(users);

    const sess = Store.getSession();
    if (sess) {
      const u = users[sess.email];
      if (u && u.status === 'approved') {
        const { password: _, ...safe } = u;
        Store.saveSession(safe);
        return safe;
      } else {
        Store.saveSession(null);
        return null;
      }
    }
    return null;
  },

  showModal(mode = 'login') {
    this.mode = mode;
    const isReg = mode === 'register';
    document.getElementById('auth-title').textContent   = isReg ? 'Criar Conta' : 'Iniciar Sessão';
    document.getElementById('auth-sub').textContent     = isReg ? 'Registo sujeito a aprovação' : 'Entra para explorar e contribuir';
    document.getElementById('auth-name-row').classList.toggle('hidden', !isReg);
    document.getElementById('auth-conf-row').classList.toggle('hidden', !isReg);
    document.getElementById('auth-btn').textContent     = isReg ? 'Pedir Registo' : 'Entrar';
    document.getElementById('auth-sw-txt').textContent  = isReg ? 'Já tens conta? ' : 'Não tens conta? ';
    document.getElementById('auth-sw-lnk').textContent  = isReg ? 'Entrar' : 'Registar';
    document.getElementById('demo-hint').style.display  = isReg ? 'none' : 'block';
    UI.hideErr('auth-err');
    ['a-name','a-email','a-pass','a-conf'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    UI.openModal('auth-modal');
    setTimeout(() => document.getElementById('a-email').focus(), 250);
  },

  toggleMode() { this.showModal(this.mode === 'login' ? 'register' : 'login'); },

  submit() {
    UI.hideErr('auth-err');
    const email = document.getElementById('a-email').value.trim().toLowerCase();
    const pass  = document.getElementById('a-pass').value.trim();
    if (!email || !pass) { UI.showErr('auth-err', 'Preenche email e palavra-passe.'); return; }
    const users = Store.getUsers();

    if (this.mode === 'login') {
      const u = users[email];
      if (!u) { UI.showErr('auth-err', 'Não existe nenhuma conta com este email.'); return; }
      if (u.password !== pass) { UI.showErr('auth-err', 'Palavra-passe incorreta.'); return; }
      if (u.status === 'pending')   { UI.showErr('auth-err', 'A tua conta está a aguardar aprovação pelo administrador.'); return; }
      if (u.status === 'inactive')  { UI.showErr('auth-err', 'A tua conta foi desativada. Contacta o administrador.'); return; }
      if (u.status === 'rejected')  { UI.showErr('auth-err', 'O teu registo foi recusado. Contacta o administrador.'); return; }
      const { password: _, ...safe } = u;
      Store.saveSession(safe);
      App.setUser(safe);
      UI.closeModal('auth-modal');
      UI.toast('Bem-vindo/a, ' + safe.name + '!');

    } else {
      const name = document.getElementById('a-name').value.trim();
      const conf = document.getElementById('a-conf').value;
      if (!name)             { UI.showErr('auth-err', 'Insere o teu nome.'); return; }
      if (users[email])      { UI.showErr('auth-err', 'Este email já está registado.'); return; }
      if (pass !== conf)     { UI.showErr('auth-err', 'As palavras-passe não coincidem.'); return; }
      if (pass.length < 6)   { UI.showErr('auth-err', 'Palavra-passe precisa de 6 ou mais caracteres.'); return; }

      const user = {
        email, name, avatar: name[0].toUpperCase(), password: pass,
        role: 'user', status: 'pending',
        joined: new Date().toISOString(),
        contributions: 0, points: 0
      };
      users[email] = user;
      Store.saveUsers(users);
      UI.closeModal('auth-modal');
      UI.showRegistrationPending();
    }
  },

  logout() {
    Store.saveSession(null);
    App.setUser(null);
    // Close all overlays, go to map
    UI.closeAllOverlays();
    // Re-render markers (will hide "added by" on seed locs — already handled)
    Map.renderMarkers();
    UI.toast('Sessão terminada.');
  },

  requireLogin(callback) {
    if (App.currentUser) {
      if (typeof callback === 'function') callback();
    } else {
      Auth.showModal('login');
    }
  },

  isAdmin() {
    return App.currentUser && App.currentUser.role === 'admin';
  }
};
