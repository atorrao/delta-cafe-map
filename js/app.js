/* ═══════════════════════════════════════════════════
   APP — Bootstrap com Supabase
   ═══════════════════════════════════════════════════ */

const App = {
  currentUser: null,
  locations:   [],

  async init() {
    // Load seed locations immediately (always available)
    this.locations = [...SEED_LOCATIONS];

    // Init type select — tipos correctos correspondentes ao TYPE_CONFIG
    const sel = document.getElementById('add-type');
    if (sel) {
      sel.innerHTML = [
        '<option value="cafe">Café / Restaurante</option>',
        '<option value="espresso">Delta Espresso</option>',
        '<option value="delta-q">Delta Q</option>',
        '<option value="loja-oficial">Loja Delta</option>',
        '<option value="fabrica">Fábrica / Museu</option>',
      ].join('');
    }
    // Produtos — 2 opções
    const ptWrap = document.getElementById('prod-tags');
    if (ptWrap) {
      ptWrap.innerHTML = ['Café Moído','Café Cápsula']
        .map(p => `<span class="ptag" data-p="${p}" onclick="this.classList.toggle('on')">${p}</span>`).join('');
    }

    // Close modals on background click
    document.querySelectorAll('.modal-bg').forEach(bg => {
      bg.addEventListener('click', e => { if (e.target === bg) bg.classList.remove('open'); });
    });

    // Restore session
    this.currentUser = await Auth.init();
    UI.renderTopbar();

    // Load user locations from Supabase
    await this.loadLocations();

    // Init map
    Map.init();
    // Sidebar static points (no location needed)
    if (typeof Map.renderSidebarStatic === 'function') Map.renderSidebarStatic();
  },

  async loadLocations() {
    try {
      const rows = await DB.getAllLocations();
      const seedIds = new Set(SEED_LOCATIONS.map(s => s.id));
      rows.forEach(l => {
        if (!seedIds.has(l.id)) {
          // Map snake_case from DB to camelCase
          const loc = {
            id:         l.id,
            name:       l.name,
            type:       l.type,
            lat:        l.lat,
            lng:        l.lng,
            country:    l.country || '',
            city:       l.city    || '',
            address:    l.address || '',
            hours:      l.hours   || null,
            note:       l.note    || null,
            products:   l.products || [],
            verified:   l.verified || false,
            status:     l.status  || 'approved',
            addedBy:    l.added_by || '',
            ownerEmail: l.owner_email || null,
            upvotes:    l.upvotes || 0,
            photo:      l.photo   || null,
            createdAt:  l.created_at
          };
          this.locations.push(loc);
        }
      });
    } catch(e) {
      console.warn('Could not load locations from Supabase:', e);
      // Fallback to localStorage
      const local = Store.getLocs();
      const seedIds = new Set(SEED_LOCATIONS.map(s => s.id));
      local.forEach(l => { if (!seedIds.has(l.id)) { if (!l.status && l.ownerEmail) l.status='pending'; this.locations.push(l); } });
    }
  },

  async saveLocation(loc) {
    // Convert camelCase to snake_case for Supabase
    const row = {
      id:          loc.id,
      name:        loc.name,
      type:        loc.type,
      lat:         loc.lat,
      lng:         loc.lng,
      country:     loc.country || '',
      city:        loc.city    || '',
      address:     loc.address || '',
      hours:       loc.hours   || null,
      note:        loc.note    || null,
      products:    loc.products || [],
      verified:    loc.verified || false,
      status:      loc.status  || 'approved',
      added_by:    loc.addedBy || '',
      owner_email: loc.ownerEmail || null,
      upvotes:     loc.upvotes || 0,
      photo:       loc.photo   || null,
      created_at:  loc.createdAt || new Date().toISOString()
    };
    try {
      await DB.createLocation(row);
    } catch(e) {
      console.warn('Supabase save failed, using localStorage fallback:', e);
      Store.saveLocs(this.locations.filter(l => !SEED_LOCATIONS.find(s => s.id === l.id)));
    }
  },

  async updateLocation(id, data) {
    const row = {};
    if (data.verified !== undefined) row.verified = data.verified;
    if (data.status   !== undefined) row.status   = data.status;
    if (data.upvotes  !== undefined) row.upvotes  = data.upvotes;
    if (data.name     !== undefined) row.name     = data.name;
    if (data.address  !== undefined) row.address  = data.address;
    if (data.city     !== undefined) row.city     = data.city;
    if (data.country  !== undefined) row.country  = data.country;
    if (data.hours    !== undefined) row.hours    = data.hours;
    if (data.note     !== undefined) row.note     = data.note;
    if (data.photo    !== undefined) row.photo    = data.photo;
    if (data.type     !== undefined) row.type     = data.type;
    if (!Object.keys(row).length) return;
    try {
      await DB.updateLocation(id, row);
    } catch(e) {
      console.warn('updateLocation failed:', e);
      throw e; /* re-throw so caller can show error */
    }
  },

  async removeLocation(id) {
    try {
      await DB.deleteLocation(id);
    } catch(e) { console.warn('removeLocation failed:', e); }
  },

  // Legacy — keep for compatibility
  saveUserLocations() {
    Store.saveLocs(this.locations.filter(l => !SEED_LOCATIONS.find(s => s.id === l.id)));
  },

  setUser(user) {
    var wasLoggedIn = !!this.currentUser;
    this.currentUser = user;
    UI.renderTopbar();
    if (user && !wasLoggedIn) {
      UI.checkOnboarding();
    }
  },

  closeAllOverlays() { UI.closeAllOverlays(); }
};

window.addEventListener('load', () => App.init());
