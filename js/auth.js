/* ═══════════════════════════════════════════════════
   AUTH — Autenticação e gestão de utilizadores
   ═══════════════════════════════════════════════════ */

/* ── Storage helpers ── */
const Store = {
  getUsers()       { try { return JSON.parse(localStorage.getItem('dcm_users') || '{}'); } catch { return {}; } },
  saveUsers(u)     { try { localStorage.setItem('dcm_users', JSON.stringify(u)); } catch {} },
  getSession()     { try { return JSON.parse(localStorage.getItem('dcm_session') || 'null'); } catch { return null; } },
  saveSession(s)   { try { localStorage.setItem('dcm_session', JSON.stringify(s)); } catch {} },
  getLocs()        { try { return JSON.parse(localStorage.getItem('dcm_locs') || '[]'); } catch { return []; } },
  saveLocs(l)      { try { localStorage.setItem('dcm_locs', JSON.stringify(l)); } catch {} },
};

const Auth = {
  mode: 'login', // 'login' | 'register'

  init() {
    // Ensure admin account always exists
    const users = Store.getUsers();
    if (!users['admin@delta.pt']) {
      users['admin@delta.pt'] = {
        email: 'admin@delta.pt',
        name: 'Admin Delta',
        avatar: 'A',
        password: 'admin1234',
        joined: '2024-01-01T00:00:00Z',
        contributions: 5,
        points: 200,
        upvotesReceived: 0,
        country: 'Portugal'
      };
      Store.saveUsers(users);
    }

    // Restore session
    const sess = Store.getSession();
    if (sess) {
      // Refresh from stored users
      const u = users[sess.email];
      if (u) {
        const { password: _, ...safe } = u;
        Store.saveSession(safe);
        return safe;
      }
    }
    return null;
  },

  showModal(mode = 'login') {
    this.mode = mode;
    const isReg = mode === 'register';
    document.getElementById('auth-title').textContent = isReg ? 'Criar Conta' : 'Iniciar Sessão';
    document.getElementById('auth-sub').textContent = isReg ? 'Junta-te à comunidade Delta Map' : 'Entra para explorar e contribuir';
    document.getElementById('auth-name-row').classList.toggle('hidden', !isReg);
    document.getElementById('auth-conf-row').classList.toggle('hidden', !isReg);
    document.getElementById('auth-btn').textContent = isReg ? 'Criar conta' : 'Entrar';
    document.getElementById('auth-sw-txt').textContent = isReg ? 'Já tens conta? ' : 'Não tens conta? ';
    document.getElementById('auth-sw-lnk').textContent = isReg ? 'Entrar' : 'Registar';
    document.getElementById('demo-hint').style.display = isReg ? 'none' : 'block';
    UI.hideErr('auth-err');
    ['a-name', 'a-email', 'a-pass', 'a-conf'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    UI.openModal('auth-modal');
    setTimeout(() => document.getElementById('a-email').focus(), 250);
  },

  toggleMode() {
    this.showModal(this.mode === 'login' ? 'register' : 'login');
  },

  submit() {
    UI.hideErr('auth-err');
    const email = document.getElementById('a-email').value.trim().toLowerCase();
    const pass = document.getElementById('a-pass').value;
    if (!email || !pass) { UI.showErr('auth-err', 'Preenche email e palavra-passe.'); return; }

    const users = Store.getUsers();

    if (this.mode === 'login') {
      const u = users[email];
      if (!u || u.password !== pass) { UI.showErr('auth-err', 'Email ou palavra-passe incorretos.'); return; }
      const { password: _, ...safe } = u;
      Store.saveSession(safe);
      App.setUser(safe);
      UI.closeModal('auth-modal');
      UI.toast(`Bem-vindo/a de volta, ${safe.name}! ☕`, 'success');

    } else {
      const name = document.getElementById('a-name').value.trim();
      const conf = document.getElementById('a-conf').value;
      if (!name) { UI.showErr('auth-err', 'Insere o teu nome.'); return; }
      if (users[email]) { UI.showErr('auth-err', 'Este email já está registado.'); return; }
      if (pass !== conf) { UI.showErr('auth-err', 'As palavras-passe não coincidem.'); return; }
      if (pass.length < 6) { UI.showErr('auth-err', 'Palavra-passe precisa de 6 ou mais caracteres.'); return; }

      const user = {
        email, name,
        avatar: name[0].toUpperCase(),
        password: pass,
        joined: new Date().toISOString(),
        contributions: 0,
        points: 10, // welcome bonus
        upvotesReceived: 0,
        country: 'Portugal'
      };
      users[email] = user;
      Store.saveUsers(users);
      const { password: _, ...safe } = user;
      Store.saveSession(safe);
      App.setUser(safe);
      UI.closeModal('auth-modal');
      UI.toast(`Bem-vindo/a, ${name}! Ganhaste 10 pontos de boas-vindas ☕`, 'success');
    }
  },

  logout() {
    Store.saveSession(null);
    App.setUser(null);
    UI.toast('Sessão terminada. Até logo! ☕');
  },

  requireLogin(callback) {
    if (App.currentUser) {
      if (typeof callback === 'function') callback();
    } else {
      Auth.showModal('login');
    }
  }
};
