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
        _map.setView([lat, lng], 14);
        L.circleMarker([lat, lng], {
          radius: 8, color: '#2C1810', fillColor: '#C8A84B', fillOpacity: 0.85, weight: 2.5
        }).addTo(_map).bindPopup('<strong>A tua localização</strong>');
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
      return l.type !== 'cafe' && (l.verified || !l.ownerEmail);
    });
    if (!official.length) {
      officialEl.innerHTML = '<p class="sidebar-empty">Sem locais disponíveis.</p>';
      return;
    }
    var counts = {};
    official.forEach(function(l) { counts[l.type] = (counts[l.type] || 0) + 1; });

    // Type filter chips
    var chips = '<div class="sidebar-type-filters">';
    chips += '<div class="fitem on" data-filter="all">'+
      '<span style="width:9px;display:inline-block;"></span>'+
      '<span>Todos</span><span class="fitem-count">' + official.length + '</span></div>';
    Object.keys(TYPE_CONFIG).forEach(function(k) {
      if (k === 'cafe' || !counts[k]) return;
      var v = TYPE_CONFIG[k];
      chips += '<div class="fitem" data-filter="' + k + '">'+
        '<span class="fitem-dot" style="background:' + v.color + ';"></span>'+
        '<span>' + v.label + '</span><span class="fitem-count">' + counts[k] + '</span></div>';
    });
    chips += '</div>';

    // Location rows
    var rows = '<div id="official-items">';
    official.forEach(function(loc) {
      var cfg = TYPE_CONFIG[loc.type] || { label: loc.type, color: '#888' };
      rows += '<div class="sidebar-loc-item" data-type="' + loc.type + '" data-id="' + loc.id + '">'+
        '<span class="sidebar-loc-dot" style="background:' + cfg.color + ';"></span>'+
        '<div class="sidebar-loc-info">'+
          '<div class="sidebar-loc-name">' + loc.name + '</div>'+
          '<div class="sidebar-loc-meta">' + cfg.label + (loc.city ? ' · ' + loc.city : '') + '</div>'+
        '</div></div>';
    });
    rows += '</div>';
    officialEl.innerHTML = chips + rows;

    // Attach click handlers after DOM insertion
    officialEl.querySelectorAll('.fitem').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var filter = btn.dataset.filter;
        officialEl.querySelectorAll('.fitem').forEach(function(b){ b.classList.toggle('on', b.dataset.filter===filter); });
        officialEl.querySelectorAll('.sidebar-loc-item').forEach(function(el){
          el.style.display = (filter==='all' || el.dataset.type===filter) ? '' : 'none';
        });
      });
    });
    officialEl.querySelectorAll('.sidebar-loc-item').forEach(function(el) {
      el.addEventListener('click', function(){ Map.flyTo(el.dataset.id); });
    });
  }

  function setOfficialFilter() {} // handled via event delegation above

  /* ── Sidebar: Nearby Cafés ── */
  /* ── Sidebar: Nearby Cafés ── */
  function renderSidebarNearby(userLat, userLng) {
    var nearbyEl = document.getElementById('nearby-list');
    if (!nearbyEl) return;
    var cafes = App.locations.filter(function(l) {
      return l.type === 'cafe' && (l.verified || !l.ownerEmail);
    });
    var withDist = cafes.map(function(l) {
      return { loc: l, dist: _haversine(userLat, userLng, l.lat, l.lng) };
    }).filter(function(x) { return x.dist <= 5; });
    withDist.sort(function(a, b) { return a.dist - b.dist; });
    if (!withDist.length) {
      nearbyEl.innerHTML = '<p class="sidebar-empty">Nenhum Local Encontrado</p>';
      return;
    }
    var html = '';
    withDist.forEach(function(x) {
      var loc = x.loc;
      var distStr = x.dist < 1 ? Math.round(x.dist*1000)+' m' : x.dist.toFixed(1)+' km';
      html += '<div class="sidebar-loc-item" data-id="' + loc.id + '">' +
        '<span class="sidebar-loc-dot" style="background:' + TYPE_CONFIG['cafe'].color + ';"></span>' +
        '<div class="sidebar-loc-info">' +
          '<div class="sidebar-loc-name">' + loc.name + '</div>' +
          '<div class="sidebar-loc-meta">' + distStr + (loc.city ? ' · ' + loc.city : '') + '</div>' +
        '</div>' +
        '<span class="sidebar-loc-dist">' + distStr + '</span>' +
      '</div>';
    });
    nearbyEl.innerHTML = html;
    nearbyEl.querySelectorAll('.sidebar-loc-item').forEach(function(el) {
      el.addEventListener('click', function(){ Map.flyTo(el.dataset.id); });
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
      // Hide user-submitted pending locations from public map
      if (l.ownerEmail && !l.verified && (l.status === 'pending' || !l.status)) return false;
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

    // Icon — flat icon only (no pin), white on brand color
    var iconEl = document.getElementById('sp-icon');
    if (iconEl) {
      iconEl.style.background = cfg.color;
      iconEl.innerHTML = getPanelIcon(loc.type);
    }

    var nameEl = document.getElementById('sp-name');
    if (nameEl) nameEl.textContent = loc.name;

    var subEl = document.getElementById('sp-sub');
    if (subEl) subEl.textContent = cfg.label + ' · ' + loc.city + ', ' + loc.country;

    var addrEl = document.getElementById('sp-addr');
    if (addrEl) addrEl.textContent = loc.address || '';

    var tagsEl = document.getElementById('sp-tags');
    if (tagsEl) {
      var tags = '';
      tags += '<span class="spot-tag ' + (loc.verified ? 'tag-verified' : 'tag-pending') + '">' + (loc.verified ? 'Verificado' : 'Pendente') + '</span>';
      if (loc.hours) tags += '<span class="spot-tag tag-hours">' + loc.hours + '</span>';
      tagsEl.innerHTML = tags;
    }

    var prodsEl = document.getElementById('sp-prods');
    if (prodsEl) prodsEl.innerHTML = ''; // products hidden from card

    var byEl = document.getElementById('sp-by');
    if (byEl) {
      var byHtml = '';
      // Only show submitter info when logged in
      if (App.currentUser) {
        byHtml = 'Adicionado por <strong>' + loc.addedBy + '</strong>';
      }
      if (loc.note) byHtml += '<div class="spot-note">"' + loc.note + '"</div>';
      byEl.innerHTML = byHtml;
    }

    document.getElementById('spot-panel').classList.remove('hidden');
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

    var isFirst = App.locations.filter(function(l) { return l.ownerEmail === App.currentUser.email; }).length === 0;
    var oldPts  = App.currentUser.points || 0;
    var oldLv   = Gamification.getLevel(oldPts);

    var addrVal = (document.getElementById('add-addr')||{value:''}).value.trim();
    var loc = {
      id: 'u-' + Date.now(), name: name,
      country: _pendingCountry || 'Portugal',
      city: _pendingCity || '',
      address: addrVal,
      hours: hours || null, note: note || null,
      type: type, products: products,
      lat: _pendingCoords.lat, lng: _pendingCoords.lng,
      verified: false,
      status: 'pending',
      addedBy: App.currentUser.name,
      ownerEmail: App.currentUser.email, upvotes: 0,
      createdAt: new Date().toISOString()
    };
    App.locations.push(loc);
    App.saveLocation(loc); // async — saves to Supabase

    var earned = Gamification.addPoints(App.currentUser.email, 'ADD_LOCATION');
    if (isFirst) earned += Gamification.addPoints(App.currentUser.email, 'FIRST_LOCATION');

    // Update user points and contributions in Supabase
    App.currentUser.contributions = (App.currentUser.contributions || 0) + 1;
    App.currentUser.points = (App.currentUser.points || 0) + earned;
    DB.saveSession(App.currentUser);
    DB.updateUser(App.currentUser.email, {
      contributions: App.currentUser.contributions,
      points: App.currentUser.points
    }).catch(function(e){ console.warn('updateUser failed:', e); });

    renderMarkers();
    renderSidebarStatic(); // official points (no location needed)
    UI.renderTopbar();
    cancelAdd();
    UI.toast('Local submetido para aprovação! +' + earned + ' pontos.');

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
    renderMarkers: renderMarkers, buildTypeFilters: buildTypeFilters,
    openPanel: openPanel, closePanel: closePanel,
    startAdd: startAdd, cancelAdd: cancelAdd, submitSpot: submitSpot,
    locateMe: locateMe, fitAll: fitAll
  };
})();
