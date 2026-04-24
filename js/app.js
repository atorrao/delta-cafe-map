/* ═══════════════════════════════════════════════════
   APP — Bootstrap e estado global
   ═══════════════════════════════════════════════════ */

const App = {
  currentUser: null,
  locations: [],

  init() {
    // Load seed + user locations
    this.locations = [...SEED_LOCATIONS];
    const userLocs = Store.getLocs();
    const seedIds = new Set(SEED_LOCATIONS.map(s => s.id));
    userLocs.forEach(l => {
      if (!seedIds.has(l.id)) {
        // Normalise older submissions that may lack status field
        if (!l.status && l.ownerEmail) l.status = 'pending';
        if (!l.status && !l.ownerEmail) l.status = 'approved';
        this.locations.push(l);
      }
    });

    // Init auth (restores session, ensures admin exists)
    this.currentUser = Auth.init();

    // Build add-spot type select and product tags
    const sel = document.getElementById('add-type');
    if (sel) {
      sel.innerHTML = Object.entries(TYPE_CONFIG)
        .map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('');
    }
    const ptWrap = document.getElementById('prod-tags');
    if (ptWrap) {
      ptWrap.innerHTML = PRODUCTS
        .map(p => `<span class="ptag" data-p="${p}" onclick="this.classList.toggle('on')">${p}</span>`).join('');
    }

    // Close modals on background click
    document.querySelectorAll('.modal-bg').forEach(bg => {
      bg.addEventListener('click', e => {
        if (e.target === bg) bg.classList.remove('open');
      });
    });

    // Topbar
    UI.renderTopbar();

    // Map
    Map.init();
  },

  setUser(user) {
    this.currentUser = user;
    UI.renderTopbar();
  },

  saveUserLocations() {
    const seedIds = new Set(SEED_LOCATIONS.map(s => s.id));
    Store.saveLocs(this.locations.filter(l => !seedIds.has(l.id)));
  }
};

window.addEventListener('load', () => App.init());
