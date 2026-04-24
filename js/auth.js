/* ═══════════════════════════════════════════════════
   AUTH — Autenticação via Supabase
   ═══════════════════════════════════════════════════ */

/* Keep Store for backward compat (session only) */
const Store = {
  getSession()   { return DB.getSession(); },
  saveSession(s) { DB.saveSession(s); },
  clearSession() { DB.clearSession(); },
  /* Legacy localStorage helpers — used during migration */
  getUsers()     { try { return JSON.parse(localStorage.getItem('dcm_users') || '{}'); } catch { return {}; } },
  saveUsers(u)   { try { localStorage.setItem('dcm_users', JSON.stringify(u)); } catch {} },
  getLocs()      { try { return JSON.parse(localStorage.getItem('dcm_locs') || '[]'); } catch { return []; } },
  saveLocs(l)    { try { localStorage.setItem('dcm_locs', JSON.stringify(l)); } catch {} },
};

const Auth = {
  mode: 'login',

  async init() {
    const sess = DB.getSession();
    if (!sess) return null;
    try {
      const u = await DB.getUser(sess.email);
      if (u && u.status === 'approved') {
        const { password: _, ...safe } = u;
        DB.saveSession(safe);
        return safe;
      }
    } catch(e) { console.warn('Session restore failed:', e); }
    DB.clearSession();
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

  async submit() {
    UI.hideErr('auth-err');
    const email = document.getElementById('a-email').value.trim().toLowerCase();
    const pass  = document.getElementById('a-pass').value.trim();
    if (!email || !pass) { UI.showErr('auth-err', 'Preenche email e palavra-passe.'); return; }

    // Show loading
    const btn = document.getElementById('auth-btn');
    const orig = btn.textContent;
    btn.textContent = 'A aguardar...';
    btn.disabled = true;

    try {
      if (this.mode === 'login') {
        let u = await DB.getUser(email);
        btn.textContent = orig; btn.disabled = false;
        if (!u) { UI.showErr('auth-err', 'Não existe nenhuma conta com este email. As tabelas do Supabase podem ainda não ter sido criadas — consulta o administrador.'); return; }
        if (u.password !== pass) { UI.showErr('auth-err', 'Palavra-passe incorreta.'); return; }
        if (u.status === 'pending')  { UI.showErr('auth-err', 'A tua conta aguarda aprovação pelo administrador.'); return; }
        if (u.status === 'inactive') { UI.showErr('auth-err', 'A tua conta foi desativada. Contacta o administrador.'); return; }
        if (u.status === 'rejected') { UI.showErr('auth-err', 'O teu registo foi recusado. Contacta o administrador.'); return; }
        const { password: _, ...safe } = u;
        DB.saveSession(safe);
        App.setUser(safe);
        UI.closeModal('auth-modal');
        UI.toast('Bem-vindo/a, ' + safe.name + '!');

      } else {
        const name = document.getElementById('a-name').value.trim();
        const conf = document.getElementById('a-conf').value.trim();
        if (!name)           { btn.textContent=orig; btn.disabled=false; UI.showErr('auth-err', 'Insere o teu nome.'); return; }
        if (pass !== conf)   { btn.textContent=orig; btn.disabled=false; UI.showErr('auth-err', 'As palavras-passe não coincidem.'); return; }
        if (pass.length < 6) { btn.textContent=orig; btn.disabled=false; UI.showErr('auth-err', 'Palavra-passe precisa de 6+ caracteres.'); return; }
        const existing = await DB.getUser(email);
        if (existing)        { btn.textContent=orig; btn.disabled=false; UI.showErr('auth-err', 'Este email já está registado.'); return; }

        await DB.createUser({
          email, name, avatar: name[0].toUpperCase(), password: pass,
          role: 'user', status: 'pending',
          joined: new Date().toISOString(),
          contributions: 0, points: 0
        });
        btn.textContent = orig; btn.disabled = false;
        UI.closeModal('auth-modal');
        UI.showRegistrationPending();
      }
    } catch(e) {
      btn.textContent = orig; btn.disabled = false;
      UI.showErr('auth-err', 'Erro de ligação ao servidor. Verifica a ligação à internet e tenta novamente.');
      console.error(e);
    }
  },

  logout() {
    DB.clearSession();
    App.setUser(null);
    UI.closeAllOverlays();
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
