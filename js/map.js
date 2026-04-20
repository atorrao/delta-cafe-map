/* ═══════════════════════════════════════════════════
   MAP — Lógica do mapa Leaflet
   ═══════════════════════════════════════════════════ */

const Map = (() => {
  let _map = null;
  let _markers = [];
  let _addMode = false;
  let _pendingCoords = null;
  let _selId = null;
  let _activeType = 'all';

  /* ── Init ── */
  function init() {
    _map = L.map('map', { zoomControl: true, attributionControl: false })
      .setView([39.5, -8.0], 6);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19, subdomains: 'abcd'
    }).addTo(_map);

    _map.on('click', e => {
      if (!_addMode) return;
      _pendingCoords = { lat: e.latlng.lat, lng: e.latlng.lng };
      document.getElementById('add-coords-lbl').textContent =
        `📍 ${_pendingCoords.lat.toFixed(5)}, ${_pendingCoords.lng.toFixed(5)} — preenche os dados abaixo`;
      UI.hideErr('add-err');
      UI.openModal('add-modal');
    });

    buildTypeFilters();
    buildCountrySelect();
    renderMarkers();
  }

  /* ── Filters ── */
  function buildTypeFilters() {
    const counts = {};
    App.locations.forEach(l => { counts[l.type] = (counts[l.type] || 0) + 1; });

    const el = document.getElementById('type-filters');
    const rows = [
      ['all', 'Todos', null, App.locations.length],
      ...Object.entries(TYPE_CONFIG).map(([k, v]) => [k, v.label, v.color, counts[k] || 0])
    ];
    el.innerHTML = rows.map(([k, l, c, n]) => `
      <div class="fitem ${k === 'all' ? 'on' : ''}" data-t="${k}" onclick="Map.setType('${k}')">
        ${c ? `<span class="fitem-dot" style="background:${c};"></span>` : '<span style="width:9px;"></span>'}
        <span>${l}</span>
        <span class="fitem-count">${n}</span>
      </div>`).join('');
  }

  function setType(t) {
    _activeType = t;
    document.querySelectorAll('.fitem').forEach(el => el.classList.toggle('on', el.dataset.t === t));
    renderMarkers();
  }

  function buildCountrySelect() {
    const sel = document.getElementById('country-sel');
    const cur = sel.value;
    const cs = [...new Set(App.locations.map(l => l.country))].sort();
    sel.innerHTML = '<option value="all">🌍 Todos os países</option>' +
      cs.map(c => `<option value="${c}"${c === cur ? ' selected' : ''}>${c}</option>`).join('');

    // Also populate datalist for add form
    const dl = document.getElementById('countries-list');
    if (dl) dl.innerHTML = COUNTRIES.map(c => `<option value="${c}">`).join('');
  }

  /* ── Render markers ── */
  function renderMarkers() {
    _markers.forEach(m => m.remove());
    _markers = [];

    const q = (document.getElementById('global-search') || {}).value || '';
    const ct = (document.getElementById('country-sel') || {}).value || 'all';

    const filtered = App.locations.filter(l => {
      if (_activeType !== 'all' && l.type !== _activeType) return false;
      if (ct !== 'all' && l.country !== ct) return false;
      if (q && !`${l.name} ${l.city} ${l.country} ${l.address || ''}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });

    filtered.forEach(loc => {
      const cfg = TYPE_CONFIG[loc.type] || TYPE_CONFIG['cafe'];
      const isNew = !loc.verified;
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:24px;height:24px;
          background:${cfg.color};
          border:2.5px solid #fff;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 2px 8px rgba(0,0,0,.28);
          cursor:pointer;
          ${isNew ? 'outline:2px dashed '+cfg.color+';outline-offset:3px;' : ''}
        "></div>`,
        iconSize: [24, 24], iconAnchor: [12, 24]
      });
      const m = L.marker([loc.lat, loc.lng], { icon }).addTo(_map);
      m.on('click', () => openPanel(loc.id));
      _markers.push(m);
    });

    renderStats();
    renderTopContributors();
  }

  function search(q) { renderMarkers(); }

  /* ── Spot Panel ── */
  function openPanel(id) {
    const loc = App.locations.find(l => l.id === id);
    if (!loc) return;
    _selId = id;
    const cfg = TYPE_CONFIG[loc.type] || TYPE_CONFIG['cafe'];

    document.getElementById('sp-icon').textContent = cfg.emoji;
    document.getElementById('sp-icon').style.background = cfg.color + '1a';
    document.getElementById('sp-name').textContent = loc.name;
    document.getElementById('sp-sub').textContent = `${cfg.label} · ${loc.city}, ${loc.country}`;
    document.getElementById('sp-addr').textContent = loc.address || '';

    // Tags
    const tags = [];
    tags.push(`<span class="spot-tag ${loc.verified ? 'tag-verified' : 'tag-pending'}">${loc.verified ? '✓ Verificado' : '⏳ Pendente'}</span>`);
    tags.push(`<span class="spot-tag tag-type">${cfg.label}</span>`);
    if (loc.hours) tags.push(`<span class="spot-tag tag-hours">🕐 ${loc.hours}</span>`);
    document.getElementById('sp-tags').innerHTML = tags.join('');

    document.getElementById('sp-prods').innerHTML = (loc.products || []).map(p => `<span class="chip">${p}</span>`).join('');

    let byHtml = `Adicionado por <strong>${loc.addedBy}</strong>`;
    if (loc.note) byHtml += `<br><em style="color:#aaa;font-size:10px;">"${loc.note}"</em>`;
    document.getElementById('sp-by').innerHTML = byHtml;
    document.getElementById('sp-upv').textContent = loc.upvotes || 0;

    document.getElementById('spot-panel').classList.remove('hidden');
  }

  function closePanel() {
    document.getElementById('spot-panel').classList.add('hidden');
    _selId = null;
  }

  function upvote() {
    if (!App.currentUser) { Auth.showModal('login'); return; }
    const loc = App.locations.find(l => l.id === _selId);
    if (!loc) return;
    loc.upvotes = (loc.upvotes || 0) + 1;
    App.saveUserLocations();
    document.getElementById('sp-upv').textContent = loc.upvotes;

    // Points for upvote giver
    Gamification.addPoints(App.currentUser.email, 'UPVOTE_GIVEN');
    // Points for location owner (if not seed)
    if (loc.ownerEmail) {
      Gamification.addPoints(loc.ownerEmail, 'UPVOTE_RECEIVED');
    }
    UI.toast('👍 Obrigado pelo voto!');
  }

  function report() {
    if (!App.currentUser) { Auth.showModal('login'); return; }
    UI.toast('Reporte enviado. Obrigado pela ajuda! ⚠️');
  }

  /* ── Add mode ── */
  function startAdd() {
    _addMode = true;
    document.getElementById('add-banner').classList.add('active');
    document.getElementById('map').classList.add('crosshair');
    const btn = document.getElementById('add-btn');
    if (btn) { btn.textContent = '✖ Cancelar'; btn.classList.add('active'); }
    closePanel();
    // On mobile, switch to map tab
    UI.showTab('map');
    UI.toast('Clica no mapa para marcar o local 📍');
  }

  function cancelAdd() {
    _addMode = false;
    _pendingCoords = null;
    document.getElementById('add-banner').classList.remove('active');
    document.getElementById('map').classList.remove('crosshair');
    const btn = document.getElementById('add-btn');
    if (btn) { btn.textContent = '+ Adicionar'; btn.classList.remove('active'); }
    UI.closeModal('add-modal');
  }

  function clearAddForm() {
    ['add-name', 'add-city', 'add-addr', 'add-hours', 'add-note'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const ct = document.getElementById('add-country');
    if (ct) ct.value = 'Portugal';
    const ty = document.getElementById('add-type');
    if (ty) ty.selectedIndex = 0;
    document.querySelectorAll('.ptag').forEach(t => t.classList.remove('on'));
    UI.hideErr('add-err');
  }

  function submitSpot() {
    UI.hideErr('add-err');
    const name = document.getElementById('add-name').value.trim();
    const country = document.getElementById('add-country').value.trim();
    const city = document.getElementById('add-city').value.trim();
    const addr = document.getElementById('add-addr').value.trim();
    const hours = document.getElementById('add-hours').value.trim();
    const note = document.getElementById('add-note').value.trim();
    const type = document.getElementById('add-type').value;
    const products = [...document.querySelectorAll('.ptag.on')].map(t => t.dataset.p);

    if (!name) { UI.showErr('add-err', 'O nome do local é obrigatório.'); return; }
    if (!country) { UI.showErr('add-err', 'O país é obrigatório.'); return; }
    if (!city) { UI.showErr('add-err', 'A cidade é obrigatória.'); return; }
    if (!_pendingCoords) { UI.showErr('add-err', 'Ainda não clicaste no mapa. Fecha este formulário e clica no local exato.'); return; }

    const isFirst = App.locations.filter(l => l.ownerEmail === App.currentUser.email).length === 0;

    const loc = {
      id: 'u-' + Date.now(),
      name, country, city,
      address: addr,
      hours: hours || null,
      note: note || null,
      type, products,
      lat: _pendingCoords.lat,
      lng: _pendingCoords.lng,
      verified: false,
      addedBy: App.currentUser.name,
      ownerEmail: App.currentUser.email,
      upvotes: 0,
      createdAt: new Date().toISOString()
    };

    App.locations.push(loc);
    App.saveUserLocations();

    // Gamification points
    const pts = Gamification.addPoints(App.currentUser.email, 'ADD_LOCATION');
    if (isFirst) Gamification.addPoints(App.currentUser.email, 'FIRST_LOCATION');

    // Update user contributions count
    const users = Store.getUsers();
    if (users[App.currentUser.email]) {
      users[App.currentUser.email].contributions = (users[App.currentUser.email].contributions || 0) + 1;
      Store.saveUsers(users);
      App.currentUser.contributions = users[App.currentUser.email].contributions;
      App.currentUser.points = users[App.currentUser.email].points;
      Store.saveSession(App.currentUser);
    }

    buildTypeFilters();
    buildCountrySelect();
    renderMarkers();
    UI.renderTopbar();

    cancelAdd();

    const totalPts = pts + (isFirst ? POINT_RULES.FIRST_LOCATION : 0);
    UI.toast(`Local adicionado! +${totalPts} pontos ☕`, 'success');

    // Check level up
    const newLevel = Gamification.getLevel(App.currentUser.points);
    const oldLevel = Gamification.getLevel(App.currentUser.points - totalPts);
    if (newLevel.level > oldLevel.level) {
      setTimeout(() => UI.toast(`🎉 Subiste para ${newLevel.emoji} ${newLevel.name}! Desbloqueaste novos prémios!`, 'success'), 2000);
    }
  }

  /* ── Stats ── */
  function renderStats() {
    const users = Store.getUsers();
    const countries = new Set(App.locations.map(l => l.country)).size;
    document.getElementById('stats-grid').innerHTML = [
      ['📍', App.locations.length, 'Locais'],
      ['🌍', countries, 'Países'],
      ['✅', App.locations.filter(l => l.verified).length, 'Verificados'],
      ['👥', Object.keys(users).length, 'Membros'],
    ].map(([e, v, l]) => `<div class="stat-cell"><div class="stat-emoji">${e}</div><div class="stat-num">${v}</div><div class="stat-lbl">${l}</div></div>`).join('');
  }

  function renderTopContributors() {
    const users = Store.getUsers();
    const top = Object.values(users)
      .map(u => ({ name: u.name, pts: u.points || 0, avatar: u.avatar || u.name[0] }))
      .sort((a, b) => b.pts - a.pts)
      .slice(0, 5);

    const medals = ['🥇', '🥈', '🥉'];
    document.getElementById('top-list').innerHTML = top.map((u, i) => {
      const lv = Gamification.getLevel(u.pts);
      return `<div class="top-item">
        <span class="top-rank">${medals[i] || (i + 1) + '.'}</span>
        <div class="top-av">${u.avatar}</div>
        <div class="top-name">${u.name}</div>
        <span class="top-level">${lv.emoji}</span>
        <span class="top-pts">${u.pts}pts</span>
      </div>`;
    }).join('');
  }

  /* ── Map helpers ── */
  function locateMe() {
    if (!navigator.geolocation) { UI.toast('Geolocalização não disponível.', 'error'); return; }
    navigator.geolocation.getCurrentPosition(pos => {
      _map.setView([pos.coords.latitude, pos.coords.longitude], 13);
      L.circleMarker([pos.coords.latitude, pos.coords.longitude], {
        radius: 10, color: '#2980b9', fillColor: '#2980b9', fillOpacity: .3, weight: 2
      }).addTo(_map).bindPopup('📍 A tua localização').openPopup();
    }, () => UI.toast('Não foi possível obter a localização.', 'error'));
  }

  function fitAll() {
    if (App.locations.length) {
      const group = L.featureGroup(_markers);
      if (_markers.length) _map.fitBounds(group.getBounds().pad(.1));
      else _map.setView([39.5, -8.0], 6);
    }
  }

  return { init, renderMarkers, setType, search, openPanel, closePanel, upvote, report, startAdd, cancelAdd, submitSpot, locateMe, fitAll, buildTypeFilters, buildCountrySelect };
})();
