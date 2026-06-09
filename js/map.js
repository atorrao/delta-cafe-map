/* ═══════════════════════════════════════════════════
   MAP — Lógica do mapa Leaflet  v5
   ═══════════════════════════════════════════════════ */

var Map = (function() {
  var _map, _markers = [], _addMode = false;
  var _pendingCoords = null, _selId = null, _activeType = 'all';
  var _tiles = {};

  function init() {
    _map = L.map('map', { zoomControl: true, attributionControl: false }).setView([39.5, -8.0], 6);

    _tiles.streets   = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19, subdomains: 'abcd' });
    _tiles.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 });
    _tiles.sat_lbl   = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, opacity: 0.85 });
    _tiles.terrain   = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17, subdomains: 'abc' });
    _tiles.satellite.addTo(_map);
    _tiles.sat_lbl.addTo(_map);
    // Mark satellite as default
    setTimeout(function(){
      var btns=document.querySelectorAll(".layer-btn");
      btns.forEach(function(b){b.classList.toggle("active",b.dataset.layer==="satellite");});
    },100);

    _map.on('click', function(e) {
      if (!_addMode) return;
      _pendingCoords = { lat: e.latlng.lat, lng: e.latlng.lng };
      var coordsLbl = document.getElementById('add-coords-lbl');
      if (coordsLbl) coordsLbl.textContent = 'A obter morada...';
      UI.hideErr('add-err');
      UI.openModal('add-modal');
      // Reverse geocode from map click
      _reverseGeocode(_pendingCoords.lat, _pendingCoords.lng, function(result) {
        var addrEl = document.getElementById('add-addr');
        if (addrEl) addrEl.value = result.address;
        _pendingCity    = result.city;
        _pendingCountry = result.country;
        if (coordsLbl) coordsLbl.textContent = result.display || (_pendingCoords.lat.toFixed(5) + ', ' + _pendingCoords.lng.toFixed(5));
      });
    });

    renderMarkers();
    renderSidebarStatic(); // official points (no location needed)

    // Go to user location on startup
    _locateOnStart();
  }

  function _locateOnStart() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        var lat = pos.coords.latitude, lng = pos.coords.longitude;
        _map.setView([lat, lng], 17);
        L.circleMarker([lat, lng], {
          radius: 8, color: '#2C1810', fillColor: '#C8A84B', fillOpacity: 0.85, weight: 2.5
        }).addTo(_map).bindPopup('<strong>A tua localização</strong>');
        /* Store for sidebar refresh */
        Map._userLat = lat;
        Map._userLng = lng;
        // Show nearest Delta alert
        _showNearestAlert(lat, lng);
        // Populate nearby cafés in sidebar
        renderSidebarNearby(lat, lng);
      },
      function() {
        // Permission denied or unavailable — stay on default Portugal view
      },
      { timeout: 6000, enableHighAccuracy: true, maximumAge: 60000 }
    );
  }

  function setLayer(name) {
    Object.values(_tiles).forEach(function(l) { if (_map.hasLayer(l)) _map.removeLayer(l); });
    if (name === 'satellite') { _tiles.satellite.addTo(_map); _tiles.sat_lbl.addTo(_map); }
    else if (name === 'terrain') { _tiles.terrain.addTo(_map); }
    else { _tiles.satellite.addTo(_map);
    _tiles.sat_lbl.addTo(_map);
    // Mark satellite as default
    setTimeout(function(){
      var btns=document.querySelectorAll(".layer-btn");
      btns.forEach(function(b){b.classList.toggle("active",b.dataset.layer==="satellite");});
    },100); }
    document.querySelectorAll('.layer-btn').forEach(function(b) {
      b.classList.toggle('active', b.dataset.layer === name);
    });
  }

  function _reverseGeocode(lat, lng, callback) {
    var url = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat + '&lon=' + lng + '&zoom=18&addressdetails=1&accept-language=pt';
    fetch(url, { headers: { 'Accept': 'application/json' } })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        var a = d.address || {};
        var road     = a.road || a.pedestrian || a.footway || a.path || a.street || '';
        var num      = a.house_number ? ' ' + a.house_number : '';
        var postcode = a.postcode || '';
        var city     = a.city || a.town || a.municipality || a.village || a.county || '';
        var country  = a.country || '';
        // Build full address string
        var parts = [];
        if (road) parts.push(road + num);
        if (postcode) parts.push(postcode);
        if (city) parts.push(city);
        var address = parts.slice(0,2).join(', '); // road + postcode
        var display = d.display_name ? d.display_name.split(',').slice(0,3).join(',') : (address || lat.toFixed(4) + ', ' + lng.toFixed(4));
        callback({ address: address, city: city, country: country, display: display });
      })
      .catch(function() {
        callback({ address: '', city: '', country: 'Portugal', display: lat.toFixed(5) + ', ' + lng.toFixed(5) });
      });
  }

  function _haversine(lat1, lng1, lat2, lng2) {
    var R = 6371, dLat = (lat2-lat1)*Math.PI/180, dLng = (lng2-lng1)*Math.PI/180;
    var a = Math.sin(dLat/2)*Math.sin(dLat/2) +
            Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*
            Math.sin(dLng/2)*Math.sin(dLng/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  function _showNearestAlert(userLat, userLng) {
    var visible = App.locations.filter(function(l) {
      return l.verified && !(l.status === 'pending' && l.ownerEmail);
    });
    if (!visible.length) return;

    var nearest = null, minDist = Infinity;
    visible.forEach(function(l) {
      var d = _haversine(userLat, userLng, l.lat, l.lng);
      if (d < minDist) { minDist = d; nearest = l; }
    });
    if (!nearest) return;

    var distStr = minDist < 1
      ? Math.round(minDist * 1000) + ' m'
      : minDist.toFixed(1) + ' km';

    var cfg = TYPE_CONFIG[nearest.type] || TYPE_CONFIG['cafe'];
    var iconEl = document.getElementById('na-icon');
    if (iconEl) {
      iconEl.style.background = cfg.color;
      iconEl.innerHTML = getPanelIcon(nearest.type);
    }
    var nameEl = document.getElementById('na-name');
    if (nameEl) nameEl.textContent = nearest.name;
    var distEl = document.getElementById('na-dist');
    if (distEl) distEl.textContent = distStr + ' · ' + nearest.city;

    var goBtn = document.getElementById('na-go');
    if (goBtn) goBtn.onclick = function() {
      document.getElementById('nearest-alert').classList.add('hidden');
      flyTo(nearest.id);
    };

    var alert = document.getElementById('nearest-alert');
    if (alert) {
      alert.classList.remove('hidden');
      // Auto-hide after 8 seconds
      setTimeout(function() { alert.classList.add('hidden'); }, 8000);
    }
  }

  /* ── Sidebar: Official Points ── */
  function renderSidebarStatic() {
    var officialEl = document.getElementById('official-list');
    if (!officialEl) return;
    var official = App.locations.filter(function(l) {
      return l.type !== 'cafe';
    });
    if (!official.length) {
      officialEl.innerHTML = '<p class="sidebar-empty">Sem locais disponíveis.</p>';
      return;
    }

    // Group by type
    var groups = {};
    Object.keys(TYPE_CONFIG).forEach(function(k) {
      if (k !== 'cafe') groups[k] = [];
    });
    official.forEach(function(l) {
      if (groups[l.type]) groups[l.type].push(l);
    });

    var html = '';
    Object.keys(groups).forEach(function(k) {
      var locs = groups[k];
      if (!locs.length) return;
      var v = TYPE_CONFIG[k];
      html += '<div class="sidebar-accordion">';
      html += '<div class="sidebar-accordion-header" data-key="' + k + '">' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<span class="fitem-dot" style="background:' + v.color + ';flex-shrink:0;"></span>' +
          '<span class="sidebar-acc-label">' + v.label + '</span>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:6px;">' +
          '<span class="fitem-count">' + locs.length + '</span>' +
          '<span class="sidebar-acc-arrow">›</span>' +
        '</div>' +
      '</div>';
      html += '<div class="sidebar-accordion-body" id="acc-' + k + '" style="display:none;">';
      locs.forEach(function(loc) {
        html += '<div class="sidebar-loc-item loc-official" data-id="' + loc.id + '">' +
          '<div class="sidebar-loc-info">' +
            '<div class="sidebar-loc-name">' + loc.name + '</div>' +
            '<div class="sidebar-loc-meta">' + (loc.city ? loc.city : '') + (loc.country ? ', ' + loc.country : '') + '</div>' +
          '</div>' +
        '</div>';
      });
      html += '</div></div>';
    });

    officialEl.innerHTML = html;

    // Accordion click handlers
    officialEl.querySelectorAll('.sidebar-accordion-header').forEach(function(header) {
      header.addEventListener('click', function() {
        var key   = header.dataset.key;
        var body  = document.getElementById('acc-' + key);
        var arrow = header.querySelector('.sidebar-acc-arrow');
        var open  = body.style.display !== 'none';
        body.style.display  = open ? 'none' : 'block';
        arrow.style.transform = open ? '' : 'rotate(90deg)';
        header.classList.toggle('sidebar-accordion-open', !open);
      });
    });

    // Location item click
    officialEl.querySelectorAll('.sidebar-loc-item').forEach(function(el) {
      el.addEventListener('click', function() { Map.flyTo(el.dataset.id); });
    });
  }

  function setOfficialFilter() {}

  /* ── Sidebar: Nearby Cafés ── */
  /* ── Sidebar: Nearby Cafés ── */
  function renderSidebarNearby(userLat, userLng) {
    var nearbyEl = document.getElementById('nearby-list');
    if (!nearbyEl) return;

    var RADIUS_KM = 1.5;
    var withDist = App.locations
      .filter(function(l) { return l.lat && l.lng; })
      .map(function(l) {
        return { loc: l, dist: _haversine(userLat, userLng, l.lat, l.lng) };
      })
      .filter(function(x) { return x.dist <= RADIUS_KM; })
      .sort(function(a, b) { return a.dist - b.dist; })
      .slice(0, 15); /* max 15 results */

    if (!withDist.length) {
      nearbyEl.innerHTML = '<p class="sidebar-empty">Nenhum local num raio de 1.5 km</p>';
      return;
    }

    var html = '';
    withDist.forEach(function(x) {
      var loc    = x.loc;
      var cfg    = TYPE_CONFIG[loc.type] || TYPE_CONFIG['cafe'];
      var distStr = x.dist < 1 ? Math.round(x.dist*1000)+' m' : x.dist.toFixed(1)+' km';
      var isOfficial = loc.verified && (!loc.ownerEmail || loc.ownerEmail === 'admin@delta.pt');
      html += '<div class="sidebar-loc-item ' + (isOfficial ? 'loc-official' : 'loc-user') + '" data-id="' + loc.id + '">' +
        '<span class="sidebar-loc-dot" style="background:' + cfg.color + ';flex-shrink:0;"></span>' +
        '<div class="sidebar-loc-info">' +
          '<div class="sidebar-loc-name">' + loc.name + '</div>' +
          '<div class="sidebar-loc-meta">' + cfg.label + ' · ' + distStr + '</div>' +
        '</div>' +
        '<span class="sidebar-loc-dist">' + distStr + '</span>' +
      '</div>';
    });
    nearbyEl.innerHTML = html;
    nearbyEl.querySelectorAll('.sidebar-loc-item').forEach(function(el) {
      el.addEventListener('click', function(){ Map.flyTo(el.dataset.id); closeSidebar(); });
    });
  }


  function setType(t) {
    _activeType = t;
    renderMarkers();
  }

  function renderMarkers() {
    _markers.forEach(function(m) { m.remove(); });
    _markers = [];
    var q  = (document.getElementById('global-search') || {value:''}).value || '';
    var filtered = App.locations.filter(function(l) {
      if (_activeType !== 'all' && l.type !== _activeType) return false;
      if (q && !_matchSearch(l, q)) return false;
      return true;
    });

    filtered.forEach(function(loc) {
      var svgHtml = getMarkerSVG(loc.type, '#ffffff');
      var icon = L.divIcon({
        className: '',
        html: '<div style="width:32px;height:40px;cursor:pointer;">' + svgHtml + '</div>',
        iconSize: [32, 40], iconAnchor: [16, 40]
      });
      var m = L.marker([loc.lat, loc.lng], { icon: icon }).addTo(_map);
      m.on('click', function() { openPanel(loc.id); });
      _markers.push(m);
    });
  }

  function _matchSearch(loc, q) {
    var s = (loc.name + ' ' + loc.city + ' ' + loc.country + ' ' + (loc.address||'')).toLowerCase();
    return s.indexOf(q.toLowerCase()) !== -1;
  }

  function search(q) {
    var clearBtn = document.getElementById('search-clear');
    if (clearBtn) clearBtn.style.display = q ? 'flex' : 'none';

    renderMarkers();

    var resultsBox  = document.getElementById('search-results-box');
    var resultsList = document.getElementById('search-results-list');
    if (!resultsBox || !resultsList) return;

    if (!q || q.length < 2) {
      resultsBox.style.display = 'none';
      return;
    }

    var matches = App.locations.filter(function(l) { return _matchSearch(l, q); })
      .slice(0, 8);

    if (matches.length === 0) {
      resultsBox.style.display = 'block';
      resultsList.innerHTML = '<p class="no-results">Nenhum local encontrado.</p>';
      return;
    }

    var html = '';
    matches.forEach(function(loc) {
      var cfg = TYPE_CONFIG[loc.type] || TYPE_CONFIG['cafe'];
      html += '<div class="search-result-item" onclick="Map.flyTo(\'' + loc.id + '\')">' +
        '<div class="sr-dot" style="background:' + cfg.color + ';"></div>' +
        '<div class="sr-info">' +
          '<div class="sr-name">' + loc.name + '</div>' +
          '<div class="sr-meta">' + cfg.label + ' · ' + loc.city + ', ' + loc.country + '</div>' +
        '</div>' +
        '</div>';
    });
    resultsList.innerHTML = html;
    resultsBox.style.display = 'block';
  }

  function clearSearch() {
    var input = document.getElementById('global-search');
    if (input) input.value = '';
    var clearBtn = document.getElementById('search-clear');
    if (clearBtn) clearBtn.style.display = 'none';
    var resultsBox = document.getElementById('search-results-box');
    if (resultsBox) resultsBox.style.display = 'none';
    renderMarkers();
  }

  function flyTo(id) {
    var loc = App.locations.find(function(l) { return l.id === id; });
    if (!loc) return;
    _map.flyTo([loc.lat, loc.lng], 15, { duration: 1.2 });
    setTimeout(function() { openPanel(id); }, 1300);
    // close search results
    var resultsBox = document.getElementById('search-results-box');
    if (resultsBox) resultsBox.style.display = 'none';
  }

  function openPanel(id) {
    var loc = App.locations.find(function(l) { return l.id === id; });
    if (!loc) return;
    _selId = id;
    var cfg = TYPE_CONFIG[loc.type] || TYPE_CONFIG['cafe'];

    /* Try to get photo from localStorage or loc object */
    var photoData = loc.photo || '';
    if (!photoData) {
      try { photoData = localStorage.getItem('spot_photo_' + id) || ''; } catch(e){}
    }

    var panel = document.getElementById('spot-panel');

    /* Build panel HTML dynamically to include photo */
    var dddUrl = loc.dddeltaUrl || loc.dddelta_url;
    var html = '';
    html += '<div class="sp-drag-handle"></div>';

    /* Photo strip — if exists */
    if (photoData) {
      html += '<div class="sp-photo-strip"><img src="' + photoData + '" alt="' + loc.name + '"></div>';
    }

    html += '<div class="sp-header">';
    html += '  <div class="sp-icon-wrap" id="sp-icon" style="background:' + cfg.color + ';">' + getPanelIcon(loc.type) + '</div>';
    html += '  <div class="sp-header-info">';
    if (dddUrl) html += '<div class="sp-badge-historia">Café com História</div>';
    html += '    <div class="sp-name">' + loc.name + '</div>';
    html += '    <div class="sp-sub">' + cfg.label + ' · ' + loc.city + ', ' + loc.country + '</div>';
    if (loc.address) html += '    <div class="sp-addr">' + loc.address + '</div>';
    html += '  </div>';
    html += '  <button class="sp-close-btn" onclick="Map.closePanel()">×</button>';
    html += '</div>';

    /* Tags */
    var tags = '<span class="spot-tag ' + (loc.verified ? 'tag-verified' : 'tag-pending') + '">' + (loc.verified ? 'Verificado' : 'Pendente') + '</span>';
    if (loc.hours) tags += '<span class="spot-tag tag-hours">' + loc.hours + '</span>';
    html += '<div class="sp-tags" id="sp-tags">' + tags + '</div>';

    /* Note */
    if (loc.note) html += '<div class="sp-note">"' + loc.note + '"</div>';

    /* Saber mais */
    if (dddUrl) {
      html += '<a href="' + dddUrl + '" target="_blank" rel="noopener" class="spot-saberMais">';
      html += '  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>';
      html += '  Saber mais';
      html += '</a>';
    }

    /* Added by */
    if (App.currentUser) {
      html += '<div class="sp-added" id="sp-by">Adicionado por <strong>' + loc.addedBy + '</strong></div>';
    }

    panel.innerHTML = html;
    panel.classList.remove('hidden');
  }

  function closePanel() {
    var p = document.getElementById('spot-panel');
    if (p) p.classList.add('hidden');
    _selId = null;
  }

  function startAdd() {
    _addMode = true;
    _pendingCoords = null;
    document.getElementById('add-banner').classList.add('active');
    document.getElementById('map').classList.add('crosshair');
    var fab = document.querySelector('.fab-add');
    if (fab) fab.style.display = 'none';
    closePanel();
    UI.showTab('map');

    // Reset form
    var nameEl = document.getElementById('add-name');
    if (nameEl) nameEl.value = '';
    var hoursEl = document.getElementById('add-hours');
    if (hoursEl) hoursEl.value = '';
    var noteEl = document.getElementById('add-note');
    if (noteEl) noteEl.value = '';
    document.querySelectorAll('.ptag.on').forEach(function(t){ t.classList.remove('on'); });
    UI.hideErr('add-err');

    // Try to get user location and open modal
    var coordsLbl = document.getElementById('add-coords-lbl');
    if (coordsLbl) coordsLbl.textContent = 'A detectar a tua localização...';

    UI.openModal('add-modal');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(pos) {
          _pendingCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          if (coordsLbl) coordsLbl.textContent = 'Localização detectada. A obter morada...';
          _map.flyTo([_pendingCoords.lat, _pendingCoords.lng], 15, { duration: 1 });
          // Reverse geocode via Nominatim
          _reverseGeocode(_pendingCoords.lat, _pendingCoords.lng, function(result) {
            var addrEl = document.getElementById('add-addr');
            if (addrEl) addrEl.value = result.address;
            _pendingCity    = result.city;
            _pendingCountry = result.country;
            if (coordsLbl) coordsLbl.textContent = result.display || 'Morada detectada';
          });
        },
        function() {
          if (coordsLbl) coordsLbl.textContent = 'Localização não disponível — clica no mapa para marcar o local';
          UI.closeModal('add-modal');
          UI.toast('Clica no mapa para marcar o local');
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      if (coordsLbl) coordsLbl.textContent = 'Clica no mapa para marcar o local';
      UI.closeModal('add-modal');
    }
  }

  function cancelAdd() {
    _addMode = false;
    _pendingCoords = null;
    document.getElementById('add-banner').classList.remove('active');
    document.getElementById('map').classList.remove('crosshair');
    var fab = document.querySelector('.fab-add');
    if (fab) fab.style.display = 'flex';
    UI.closeModal('add-modal');
  }

  /* ── Duplicate detection ── */
  function _levenshtein(a, b) {
    a = a.toLowerCase(); b = b.toLowerCase();
    var m = a.length, n = b.length;
    var dp = [];
    for (var i = 0; i <= m; i++) { dp[i] = [i]; }
    for (var j = 0; j <= n; j++) { dp[0][j] = j; }
    for (var i = 1; i <= m; i++) {
      for (var j = 1; j <= n; j++) {
        dp[i][j] = a[i-1] === b[j-1]
          ? dp[i-1][j-1]
          : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
      }
    }
    return dp[m][n];
  }

  function _findNearbyDuplicates(name, lat, lng, radiusMeters) {
    return App.locations.filter(function(l) {
      if (!l.lat || !l.lng) return false;
      var dist = _haversine(lat, lng, l.lat, l.lng) * 1000; // metres
      if (dist > radiusMeters) return false;
      // Name similarity: exact match or levenshtein within 40% of longer name
      var maxLen = Math.max(name.length, l.name.length);
      var lev = _levenshtein(name, l.name);
      return lev / maxLen < 0.4;
    }).map(function(l) {
      return {
        loc: l,
        dist: Math.round(_haversine(lat, lng, l.lat, l.lng) * 1000)
      };
    }).sort(function(a, b) { return a.dist - b.dist; });
  }

  function _showDuplicateAlert(duplicates, onConfirmNew) {
    // Remove any existing duplicate alert
    var existing = document.getElementById('duplicate-alert');
    if (existing) existing.remove();

    var best = duplicates[0];
    var distStr = best.dist < 1000 ? best.dist + 'm' : (best.dist/1000).toFixed(1) + 'km';

    var el = document.createElement('div');
    el.id = 'duplicate-alert';
    el.innerHTML =
      '<div class="dup-alert-overlay">' +
        '<div class="dup-alert-card">' +
          '<div class="dup-alert-icon">📍</div>' +
          '<div class="dup-alert-title">Local já existe?</div>' +
          '<div class="dup-alert-msg">Encontrámos um local próximo com um nome parecido:<br>' +
            '<strong>' + best.loc.name + '</strong> <span class="dup-alert-dist">(' + distStr + ')</span>' +
          '</div>' +
          '<div class="dup-alert-actions">' +
            '<button class="dup-btn dup-btn-yes" id="dup-yes">Sim, é o mesmo</button>' +
            '<button class="dup-btn dup-btn-no"  id="dup-no">Não, é diferente</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(el);

    document.getElementById('dup-yes').addEventListener('click', function() {
      el.remove();
      // Fly to the existing location
      Map.flyTo(best.loc.id);
      UI.toast('Local já existe no mapa. A mostrar o local existente.');
    });
    document.getElementById('dup-no').addEventListener('click', function() {
      el.remove();
      onConfirmNew();
    });
  }

  function submitSpot() {
    UI.hideErr('add-err');
    var name     = (document.getElementById('add-name')  || {value:''}).value.trim();
    var hours    = (document.getElementById('add-hours') || {value:''}).value.trim();
    var note     = (document.getElementById('add-note')  || {value:''}).value.trim();
    var type     = (document.getElementById('add-type')  || {value:'cafe'}).value;
    var products = [];
    document.querySelectorAll('.ptag.on').forEach(function(t) { products.push(t.dataset.p); });

    if (!name)          { UI.showErr('add-err', 'O nome do local é obrigatório.'); return; }
    if (!_pendingCoords){ UI.showErr('add-err', 'Localização não detectada. Fecha e clica no mapa para marcar o local.'); return; }

    // Check for nearby duplicates before saving
    var duplicates = _findNearbyDuplicates(name, _pendingCoords.lat, _pendingCoords.lng, 50);
    if (duplicates.length) {
      _showDuplicateAlert(duplicates, function() { _doSaveSpot(name, hours, note, type, products); });
      return;
    }
    _doSaveSpot(name, hours, note, type, products);
  }

  function _doSaveSpot(name, hours, note, type, products) {
    var isFirst = App.locations.filter(function(l) { return l.ownerEmail === App.currentUser.email; }).length === 0;
    var oldPts  = App.currentUser.points || 0;
    var oldLv   = Gamification.getLevel(oldPts);

    var addrVal = (document.getElementById('add-addr')||{value:''}).value.trim();

    /* Read photo if uploaded */
    var photoData = '';
    var photoInput = document.getElementById('add-photo-file');
    if (photoInput && photoInput._compressedData) {
      photoData = photoInput._compressedData;
    }

    var loc = {
      id: 'u-' + Date.now(), name: name,
      country: _pendingCountry || 'Portugal',
      city: _pendingCity || '',
      address: addrVal,
      hours: hours || null, note: note || null,
      type: type, products: products,
      lat: _pendingCoords.lat, lng: _pendingCoords.lng,
      verified: true,
      status: 'approved',
      addedBy: App.currentUser.name,
      ownerEmail: App.currentUser.email, upvotes: 0,
      photo: photoData || null,
      createdAt: new Date().toISOString()
    };

    /* Save photo to localStorage keyed by loc id */
    if (photoData) {
      try { localStorage.setItem('spot_photo_' + loc.id, photoData); } catch(e){}
    }

    App.locations.push(loc);
    App.saveLocation(loc);

    var earned = Gamification.addPoints(App.currentUser.email, 'ADD_LOCATION');
    if (isFirst) earned += Gamification.addPoints(App.currentUser.email, 'FIRST_LOCATION');
    if (photoData) earned += Gamification.addPoints(App.currentUser.email, 'ADD_PHOTO');

    App.currentUser.contributions = (App.currentUser.contributions || 0) + 1;
    App.currentUser.points = (App.currentUser.points || 0) + earned;
    DB.saveSession(App.currentUser);
    DB.updateUser(App.currentUser.email, {
      contributions: App.currentUser.contributions,
      points: App.currentUser.points
    }).catch(function(e){ console.warn('updateUser failed:', e); });

    renderMarkers();
    UI.renderTopbar();
    cancelAdd();
    UI.toast('Local submetido! +' + earned + ' pontos' + (photoData ? ' (inclui bónus foto 📷)' : '') + '.');

    var newLv = Gamification.getLevel(App.currentUser.points);
    if (newLv.level > oldLv.level) {
      setTimeout(function() { UI.toast('Subiste para Nível ' + newLv.level + ' — ' + newLv.name + '!'); }, 1800);
    }
  }

  function locateMe() {
    if (!navigator.geolocation) { UI.toast('Geolocalização não disponível.'); return; }
    navigator.geolocation.getCurrentPosition(function(pos) {
      _map.setView([pos.coords.latitude, pos.coords.longitude], 14);
      L.circleMarker([pos.coords.latitude, pos.coords.longitude], {
        radius: 9, color: '#1a6eb5', fillColor: '#3b9ae1', fillOpacity: .35, weight: 2
      }).addTo(_map).bindPopup('A tua localização').openPopup();
    }, function() { UI.toast('Não foi possível obter a localização.'); });
  }

  function fitAll() {
    if (_markers.length) _map.fitBounds(L.featureGroup(_markers).getBounds().pad(.1));
    else _map.setView([39.5, -8.0], 6);
  }

  return {
    init: init, setLayer: setLayer, setType: setType,
    search: search, clearSearch: clearSearch, flyTo: flyTo,
    renderMarkers: renderMarkers,
    renderSidebarStatic: renderSidebarStatic,
    renderSidebarNearby: renderSidebarNearby,
    openPanel: openPanel, closePanel: closePanel,
    startAdd: startAdd, cancelAdd: cancelAdd, submitSpot: submitSpot,
    locateMe: locateMe, fitAll: fitAll
  };
})();
