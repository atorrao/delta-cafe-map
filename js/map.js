/* ═══════════════════════════════════════════════════
   MAP — Lógica do mapa Leaflet
   ═══════════════════════════════════════════════════ */

const Map = (() => {
  let _map       = null;
  let _markers   = [];
  let _addMode   = false;
  let _pendingCoords = null;
  let _selId     = null;
  let _activeType = 'all';
  let _layers    = {};
  let _currentLayer = 'streets';

  /* ── Init ── */
  function init() {
    _map = L.map('map', { zoomControl: true, attributionControl: false })
      .setView([39.5, -8.0], 6);

    // ── Tile layers ──
    _layers.streets = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      { maxZoom: 19, subdomains: 'abcd' }
    );
    _layers.satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19 }
    );
    _layers.satellite_labels = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19, opacity: 0.9 }
    );
    _layers.terrain = L.tileLayer(
      'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      { maxZoom: 17, subdomains: 'abc' }
    );

    _layers.streets.addTo(_map);

    _map.on('click', e => {
      if (!_addMode) return;
      _pendingCoords = { lat: e.latlng.lat, lng: e.latlng.lng };
      document.getElementById('add-coords-lbl').textContent =
        `${_pendingCoords.lat.toFixed(5)}, ${_pendingCoords.lng.toFixed(5)} — preenche os dados abaixo`;
      UI.hideErr('add-err');
      UI.openModal('add-modal');
    });

    buildTypeFilters();
    buildCountrySelect();
    renderMarkers();
  }

  /* ── Layer switcher ── */
  function setLayer(name) {
    // Remove current layers
    Object.values(_layers).forEach(l => { if (_map.hasLayer(l)) _map.removeLayer(l); });

    if (name === 'satellite') {
      _layers.satellite.addTo(_map);
      _layers.satellite_labels.addTo(_map);
    } else if (name === 'terrain') {
      _layers.terrain.addTo(_map);
    } else {
      _layers.streets.addTo(_map);
    }
    _currentLayer = name;

    // Update buttons
    document.querySelectorAll('.layer-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.layer === name)
    );
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
        ${c ? `<span class="fitem-dot" style="background:${c};"></span>` : '<span style="width:9px;display:inline-block;"></span>'}
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
    const cs  = [...new Set(App.locations.map(l => l.country))].sort();
    sel.innerHTML = '<option value="all">Todos os países</option>' +
      cs.map(c => `<option value="${c}"${c === cur ? ' selected' : ''}>${c}</option>`).join('');
    const dl = document.getElementById('countries-list');
    if (dl) dl.innerHTML = COUNTRIES.map(c => `<option value="${c}">`).join('');
  }

  /* ── Render markers ── */
  function renderMarkers() {
    _markers.forEach(m => m.remove());
    _markers = [];

    const q  = (document.getElementById('global-search') || {}).value || '';
    const ct = (document.getElementById('country-sel')   || {}).value || 'all';

    const filtered = App.locations.filter(l => {
      if (_activeType !== 'all' && l.type !== _activeType) return false;
      if (ct !== 'all' && l.country !== ct) return false;
      if (q && !`${l.name} ${l.city} ${l.country} ${l.address || ''}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });

    filtered.forEach(loc => {
      const cfg    = TYPE_CONFIG[loc.type] || TYPE_CONFIG['cafe'];
      const isNew  = !loc.verified;
      const border = isNew ? '#fff' : '#fff';
      const icon   = L.divIcon({
        className: '',
        html: `<div style="
          width:20px;height:20px;
          background:${cfg.color};
          border:2.5px solid ${border};
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 2px 6px rgba(0,0,0,.32);
          cursor:pointer;
          ${isNew ? `outline:2px dashed ${cfg.color};outline-offset:3px;` : ''}
        "></div>`,
        iconSize: [20, 20], iconAnchor: [10, 20]
      });
      const m = L.marker([loc.lat, loc.lng], { icon }).addTo(_map);
      m.on('click', () => openPanel(loc.id));
      _markers.push(m);
    });

    renderStats();
    renderTopContributors();
  }

  function search() { renderMarkers(); }

  /* ── Spot Panel ── */
  function openPanel(id) {
    const loc = App.locations.find(l => l.id === id);
    if (!loc) return;
    _selId = id;
    const cfg = TYPE_CONFIG[loc.type] || TYPE_CONFIG['cafe'];

    document.getElementById('sp-icon').style.background = cfg.color;
    document.getElementById('sp-icon').textContent      = '';
    document.getElementById('sp-name').textContent      = loc.name;
    document.getElementById('sp-sub').textContent       = `${cfg.label} · ${loc.city}, ${loc.country}`;
    document.getElementById('sp-addr').textContent      = loc.address || '';

    const tags = [];
    tags.push(`<span class="spot-tag ${loc.verified ? 'tag-verified' : 'tag-pending'}">${loc.verified ? 'Verificado' : 'Pendente'}</span>`);
    if (loc.hours) tags.push(`<span class="spot-tag tag-hours">${loc.hours}</span>`);
    document.getElementById('sp-tags').innerHTML  = tags.join('');
    document.getElementById('sp-prods').innerHTML = (loc.products || []).map(p => `<span class="chip">${p}</span>`).join('');

    let byHtml = `Adicionado por <strong>${loc.addedBy}</strong>`;
    if (loc.note) byHtml += `<div class="spot-note">"${loc.note}"</div>`;
    document.getElementById('sp-by').innerHTML   = byHtml;
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
    Gamification.addPoints(App.currentUser.email, 'UPVOTE_GIVEN');
    if (loc.ownerEmail) Gamification.addPoints(loc.ownerEmail, 'UPVOTE_RECEIVED');
    UI.toast('Voto registado.');
  }

  function report() {
    if (!App.currentUser) { Auth.showModal('login'); return; }
    UI.toast('Reporte enviado. Obrigado.');
  }

  /* ── Add mode ── */
  function startAdd() {
    _addMode = true;
    document.getElementById('add-banner').classList.add('active');
    document.getElementById('map').classList.add('crosshair');
    const btn = document.getElementById('add-btn');
    if (btn) { btn.textContent = 'Cancelar'; btn.classList.add('active'); }
    closePanel();
    UI.showTab('map');
    UI.toast('Clica no mapa para marcar o local.');
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

  function submitSpot() {
    UI.hideErr('add-err');
    const name    = document.getElementById('add-name').value.trim();
    const country = document.getElementById('add-country').value.trim();
    const city    = document.getElementById('add-city').value.trim();
    const addr    = document.getElementById('add-addr').value.trim();
    const hours   = document.getElementById('add-hours').value.trim();
    const note    = document.getElementById('add-note').value.trim();
    const type    = document.getElementById('add-type').value;
    const products = [...document.querySelectorAll('.ptag.on')].map(t => t.dataset.p);

    if (!name)    { UI.showErr('add-err', 'O nome do local é obrigatório.'); return; }
    if (!country) { UI.showErr('add-err', 'O país é obrigatório.'); return; }
    if (!city)    { UI.showErr('add-err', 'A cidade é obrigatória.'); return; }
    if (!_pendingCoords) { UI.showErr('add-err', 'Fecha este formulário e clica no mapa para definir a posição.'); return; }

    const isFirst = App.locations.filter(l => l.ownerEmail === App.currentUser.email).length === 0;
    const oldPts  = App.currentUser.points || 0;
    const oldLv   = Gamification.getLevel(oldPts);

    const loc = {
      id: 'u-' + Date.now(), name, country, city,
      address: addr, hours: hours || null, note: note || null,
      type, products,
      lat: _pendingCoords.lat, lng: _pendingCoords.lng,
      verified: false,
      addedBy: App.currentUser.name,
      ownerEmail: App.currentUser.email,
      upvotes: 0,
      createdAt: new Date().toISOString()
    };

    App.locations.push(loc);
    App.saveUserLocations();

    let earned = Gamification.addPoints(App.currentUser.email, 'ADD_LOCATION');
    if (isFirst) earned += Gamification.addPoints(App.currentUser.email, 'FIRST_LOCATION');

    const users = Store.getUsers();
    if (users[App.currentUser.email]) {
      users[App.currentUser.email].contributions = (users[App.currentUser.email].contributions || 0) + 1;
      Store.saveUsers(users);
      App.currentUser.contributions = users[App.currentUser.email].contributions;
      App.currentUser.points        = users[App.currentUser.email].points;
      Store.saveSession(App.currentUser);
    }

    buildTypeFilters();
    buildCountrySelect();
    renderMarkers();
    UI.renderTopbar();
    cancelAdd();

    UI.toast(`Local adicionado. +${earned} pontos.`);
    const newLv = Gamification.getLevel(App.currentUser.points);
    if (newLv.level > oldLv.level) {
      setTimeout(() => UI.toast(`Subiste para o nível ${newLv.level} — ${newLv.name}.`), 1800);
    }
  }

  /* ── Stats ── */
  function renderStats() {
    const users    = Store.getUsers();
    const countries = new Set(App.locations.map(l => l.country)).size;
    document.getElementById('stats-grid').innerHTML = [
      [App.locations.length,                             'Locais'],
      [countries,                                        'Países'],
      [App.locations.filter(l => l.verified).length,    'Verificados'],
      [Object.keys(users).length,                       'Membros'],
    ].map(([v, l]) => `<div class="stat-cell"><div class="stat-num">${v}</div><div class="stat-lbl">${l}</div></div>`).join('');
  }

  function renderTopContributors() {
    const users = Store.getUsers();
    const top   = Object.values(users)
      .map(u => ({ name: u.name, pts: u.points || 0, avatar: u.avatar || u.name[0] }))
      .sort((a, b) => b.pts - a.pts).slice(0, 5);

    document.getElementById('top-list').innerHTML = top.map((u, i) => {
      const lv = Gamification.getLevel(u.pts);
      return `<div class="top-item">
        <span class="top-rank" style="color:${i < 3 ? ['#b07d2e','#8c9aaa','#c0571e'][i] : 'var(--mut)'};">${i + 1}</span>
        <div class="top-av">${u.avatar}</div>
        <div class="top-name">${u.name}</div>
        <span class="top-level" style="color:${lv.color};">${lv.name}</span>
        <span class="top-pts">${u.pts}</span>
      </div>`;
    }).join('');
  }

  /* ── Map helpers ── */
  function locateMe() {
    if (!navigator.geolocation) { UI.toast('Geolocalização não disponível.'); return; }
    navigator.geolocation.getCurrentPosition(pos => {
      _map.setView([pos.coords.latitude, pos.coords.longitude], 14);
      L.circleMarker([pos.coords.latitude, pos.coords.longitude], {
        radius: 9, color: '#1a6eb5', fillColor: '#3b9ae1', fillOpacity: .35, weight: 2
      }).addTo(_map).bindPopup('A tua localização').openPopup();
    }, () => UI.toast('Não foi possível obter a localização.'));
  }

  function fitAll() {
    if (_markers.length) {
      _map.fitBounds(L.featureGroup(_markers).getBounds().pad(.1));
    } else {
      _map.setView([39.5, -8.0], 6);
    }
  }

  return {
    init, renderMarkers, setType, search,
    openPanel, closePanel, upvote, report,
    startAdd, cancelAdd, submitSpot,
    locateMe, fitAll, setLayer,
    buildTypeFilters, buildCountrySelect
  };
})();
