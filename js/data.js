/* ═══════════════════════════════════════
   DATA — Tipos, ícones e localizações
   ═══════════════════════════════════════ */

// Delta brand palette
const DELTA = {
  red:      '#8B1A1A',
  redDark:  '#5C0F0F',
  gold:     '#C8A84B',
  goldLt:   '#E0C278',
  espresso: '#2C1810',
  roast:    '#4A2010',
  brown:    '#6B3A2A',
  teal:     '#1A5C52',
};

const TYPE_CONFIG = {
  'espresso':     { label: 'Delta Espresso',    color: DELTA.red     },
  'loja-oficial': { label: 'Loja Delta',         color: DELTA.espresso},
  'delta-q':      { label: 'Delta Q',            color: DELTA.brown   },
  'cafe':         { label: 'Café / Restaurante', color: '#E8820C'    },  // warm amber-orange, satellite-visible
  'fabrica':      { label: 'Fábrica / Museu',    color: DELTA.gold    },
};

// Which SVG icon per type
// 'cup'     = chávena fumegante  → Café/Restaurante
// 'capsule' = cápsula de café   → tudo o resto
const MARKER_TYPE = {
  'espresso':     'capsule',
  'loja-oficial': 'capsule',
  'delta-q':      'capsule',
  'cafe':         'cup',
  'fabrica':      'capsule',
};

function getMarkerSVG(type, iconColor) {
  var c = iconColor || '#ffffff';
  var uid = 'u' + Math.floor(Math.random()*99999);

  if (MARKER_TYPE[type] === 'cup') {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">' +
      '<defs><filter id="d' + uid + '"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,.4)"/></filter></defs>' +
      '<g filter="url(#d' + uid + ')">' +
        '<path d="M16 2C9.4 2 4 7.4 4 14c0 8.5 12 24 12 24s12-15.5 12-24C28 7.4 22.6 2 16 2z" fill="' + (TYPE_CONFIG[type]||TYPE_CONFIG['cafe']).color + '"/>' +
        '<circle cx="16" cy="14" r="9" fill="rgba(255,255,255,0.1)"/>' +
        '<rect x="10" y="11" width="9" height="7" rx="1.5" fill="' + c + '" opacity="0.95"/>' +
        '<path d="M19 12.5 Q23 12.5 23 15 Q23 17.5 19 17.5" fill="none" stroke="' + c + '" stroke-width="1.6" stroke-linecap="round" opacity="0.95"/>' +
        '<line x1="9" y1="18.2" x2="21" y2="18.2" stroke="' + c + '" stroke-width="0.8" opacity="0.5"/>' +
        '<path d="M12.5 9.5 Q13.1 8 12.5 6.5" fill="none" stroke="' + c + '" stroke-width="1.1" stroke-linecap="round" opacity="0.7"/>' +
        '<path d="M16 9 Q16.6 7.5 16 6" fill="none" stroke="' + c + '" stroke-width="1.1" stroke-linecap="round" opacity="0.7"/>' +
        '<path d="M19.5 9.5 Q20.1 8 19.5 6.5" fill="none" stroke="' + c + '" stroke-width="1.1" stroke-linecap="round" opacity="0.7"/>' +
      '</g></svg>';
  } else {
    // Capsule: dome top + conical body + flat rim base (icon 2 in reference)
    return '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">' +
      '<defs><filter id="d' + uid + '"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,.4)"/></filter></defs>' +
      '<g filter="url(#d' + uid + ')">' +
        '<path d="M16 2C9.4 2 4 7.4 4 14c0 8.5 12 24 12 24s12-15.5 12-24C28 7.4 22.6 2 16 2z" fill="' + (TYPE_CONFIG[type]||TYPE_CONFIG['loja-oficial']).color + '"/>' +
        /* dome top — rounded bump */
        '<path d="M12 13 Q12 7.5 16 7.5 Q20 7.5 20 13Z" fill="' + c + '" opacity="0.95"/>' +
        /* conical body widening downward */
        '<path d="M12 13 L10.5 19.5 Q16 21.5 21.5 19.5 L20 13Z" fill="' + c + '" opacity="0.92"/>' +
        /* flat rim / base ring */
        '<ellipse cx="16" cy="19.5" rx="5.5" ry="1.5" fill="' + c + '" opacity="0.7"/>' +
        '<ellipse cx="16" cy="19.5" rx="5.5" ry="1.5" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.8"/>' +
        /* dome highlight */
        '<ellipse cx="14.5" cy="10" rx="1.5" ry="1.8" fill="rgba(255,255,255,0.35)"/>' +
      '</g></svg>';
  }
}

const PRODUCTS = [
  'Espresso', 'Delta Q Cápsulas', 'Café Moído', 'Café em Grão',
  'Descafeinado', 'Máquinas Delta Q', 'Acessórios', 'Loja Gourmet'
];

const COUNTRIES = [
  'Portugal','Espanha','França','Alemanha','Reino Unido','Suíça',
  'Luxemburgo','Bélgica','Países Baixos','Itália','Angola','Moçambique',
  'Brasil','Andorra','Irlanda','Suécia','Noruega','Dinamarca'
];

const SEED_LOCATIONS = [
  // ── LOJAS DELTA OFICIAL ──────────────────────────────────────
  { id:'lo-1', name:'Loja Delta — Lisboa Chiado',
    lat:38.7100, lng:-9.1400, country:'Portugal', city:'Lisboa', type:'loja-oficial',
    address:'Rua do Carmo 2, 1200-094 Lisboa', hours:'Seg-Sáb 09h-20h, Dom 10h-19h',
    verified:true, addedBy:'Delta Oficial',
    products:['Espresso','Delta Q Cápsulas','Café Moído','Café em Grão','Máquinas Delta Q','Loja Gourmet'],
    note:'Loja principal da Delta em Lisboa.' },
  { id:'lo-2', name:'Loja Delta — Porto Clérigos',
    lat:41.1463, lng:-8.6153, country:'Portugal', city:'Porto', type:'loja-oficial',
    address:'R. dos Clérigos 4, 4050-164 Porto', hours:'Seg-Sáb 09h-20h, Dom 10h-19h',
    verified:true, addedBy:'Delta Oficial',
    products:['Espresso','Delta Q Cápsulas','Café Moído','Café em Grão','Máquinas Delta Q','Loja Gourmet'] },
  { id:'lo-3', name:'Loja Delta — Genebra',
    lat:46.2044, lng:6.1432, country:'Suíça', city:'Genebra', type:'loja-oficial',
    address:'Rue de Carouge 40, Genève', hours:'Ter-Sáb 09h-19h',
    verified:true, addedBy:'Delta Oficial',
    products:['Delta Q Cápsulas','Café Moído','Café em Grão'] },
  { id:'lo-4', name:'Loja Delta — Luxemburgo',
    lat:49.6117, lng:6.1319, country:'Luxemburgo', city:'Luxemburgo', type:'loja-oficial',
    address:'Rue de Hollerich 12, Luxembourg', hours:'Seg-Sáb 08h30-19h30',
    verified:true, addedBy:'Delta Oficial',
    products:['Delta Q Cápsulas','Café Moído','Café em Grão','Espresso'] },

  // ── DELTA Q ──────────────────────────────────────────────────
  { id:'dq-1', name:'Delta Q — Centro Colombo',
    lat:38.7576, lng:-9.1763, country:'Portugal', city:'Lisboa', type:'delta-q',
    address:'Centro Colombo Piso 1, Lisboa', hours:'Seg-Dom 10h-23h',
    verified:true, addedBy:'Delta Oficial', products:['Delta Q Cápsulas','Máquinas Delta Q','Acessórios'] },
  { id:'dq-2', name:'Delta Q — Vasco da Gama',
    lat:38.7681, lng:-9.0941, country:'Portugal', city:'Lisboa', type:'delta-q',
    address:'C.C. Vasco da Gama, Lisboa', hours:'Seg-Dom 10h-23h',
    verified:true, addedBy:'Delta Oficial', products:['Delta Q Cápsulas','Máquinas Delta Q','Acessórios'] },
  { id:'dq-3', name:'Delta Q — NorteShopping',
    lat:41.1850, lng:-8.6480, country:'Portugal', city:'Porto', type:'delta-q',
    address:'NorteShopping, Porto', hours:'Seg-Dom 10h-23h',
    verified:true, addedBy:'Delta Oficial', products:['Delta Q Cápsulas','Máquinas Delta Q','Acessórios'] },

  // ── FÁBRICA / MUSEU ──────────────────────────────────────────
  { id:'fa-1', name:'Fábrica Delta — Campo Maior',
    lat:39.0150, lng:-7.0700, country:'Portugal', city:'Campo Maior', type:'fabrica',
    address:'Av. Calouste Gulbenkian, Campo Maior, Alentejo', hours:'Visitas: Ter-Dom 10h-17h',
    verified:true, addedBy:'Delta Oficial',
    products:['Espresso','Café Moído','Café em Grão','Loja Gourmet'],
    note:'A origem do Delta. Visitas guiadas à fábrica e museu do café.' },

  // ── DELTA ESPRESSO (deltaespresso.com) ───────────────────────
  { id:'de-1', name:'Delta Espresso — Loures Shopping',
    lat:38.8341, lng:-9.1561, country:'Portugal', city:'Loures', type:'espresso',
    address:'Av. Descobertas 90, 2670-457 Loures', hours:'Seg-Dom 10h-23h',
    verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },
  { id:'de-2', name:'Delta Espresso — UBBO Shopping',
    lat:38.7790, lng:-9.2193, country:'Portugal', city:'Amadora', type:'espresso',
    address:'UBBO Shopping, Av. Cruzeiro Seixas 5, 2650-505 Brandoa', hours:'Seg-Dom 10h-23h',
    verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },
  { id:'de-3', name:'Delta Espresso — Albufeira Terrace',
    lat:37.0914, lng:-8.2398, country:'Portugal', city:'Albufeira', type:'espresso',
    address:'R. do Município 32, 8200-161 Albufeira',
    verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },
  { id:'de-4', name:'Delta Espresso — Forum Algarve',
    lat:37.0289, lng:-7.9446, country:'Portugal', city:'Faro', type:'espresso',
    address:'Forum Algarve, N125 Km 103, 8009-126 Faro',
    verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },
  { id:'de-5', name:'Delta Espresso — RioSul Shopping',
    lat:38.6168, lng:-9.1176, country:'Portugal', city:'Seixal', type:'espresso',
    address:'RioSul Shopping, Av. Libertadores de Timor, 2840-168 Seixal',
    verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },
  { id:'de-6', name:'Delta Espresso — Mar Shopping Algarve',
    lat:37.0850, lng:-8.0390, country:'Portugal', city:'Almancil', type:'espresso',
    address:'Mar Shopping, Av. Algarve, 8135-182 Almancil',
    verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },
  { id:'de-7', name:'Delta Espresso — Aqua Portimão',
    lat:37.1360, lng:-8.5370, country:'Portugal', city:'Portimão', type:'espresso',
    address:'Aqua Portimão, R. de São Pedro 72, 8500-448 Portimão',
    verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },
  { id:'de-8', name:'Delta Espresso — Tavira Plaza',
    lat:37.1250, lng:-7.6510, country:'Portugal', city:'Tavira', type:'espresso',
    address:'R. Almirante Cândido dos Reis 247, 8800-318 Tavira',
    verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },
  { id:'de-9', name:'Delta Espresso — Alegro Montijo',
    lat:38.7050, lng:-8.9740, country:'Portugal', city:'Montijo', type:'espresso',
    address:'Alegro Montijo, R. da Azinheira 1, 2879-100 Montijo',
    verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },
  { id:'de-10', name:'Delta Espresso — Alegro Sintra',
    lat:38.7680, lng:-9.3320, country:'Portugal', city:'Rio de Mouro', type:'espresso',
    address:'R. Alto do Forte IC19, 2635-018 Rio de Mouro',
    verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },

  // ── CAFÉ / RESTAURANTE ────────────────────────────────────────
  { id:'ca-1', name:'Café A Brasileira',
    lat:38.7108, lng:-9.1419, country:'Portugal', city:'Lisboa', type:'cafe',
    address:'R. Garrett 120, 1200-205 Lisboa', hours:'Seg-Dom 08h-02h',
    verified:true, addedBy:'Delta Oficial', products:['Espresso'],
    note:'Histórico café lisboeta, serve Delta Espresso.' },
  { id:'ca-2', name:'Café Majestic',
    lat:41.1478, lng:-8.6088, country:'Portugal', city:'Porto', type:'cafe',
    address:'R. de Santa Catarina 112, 4000-442 Porto', hours:'Seg-Sáb 09h30-23h',
    verified:true, addedBy:'Delta Oficial', products:['Espresso'],
    note:'Um dos cafés mais belos do mundo.' },
  { id:'ca-3', name:'Bairro Alto Hotel',
    lat:38.7139, lng:-9.1464, country:'Portugal', city:'Lisboa', type:'cafe',
    address:'Praça Luís de Camões 2, 1200-243 Lisboa', hours:'Todos os dias 07h-22h',
    verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },
];

/* ── Flat panel icon (no pin shape) ─────────────────────────────────────── */
function getPanelIcon(type) {
  var isCup = (MARKER_TYPE[type] === 'cup');
  if (isCup) {
    // Clean cup icon
    return '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="28" height="28">' +
      '<rect x="6" y="13" width="14" height="11" rx="2" fill="white" opacity="0.95"/>' +
      '<path d="M20 15 Q26 15 26 19 Q26 23 20 23" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.95"/>' +
      '<line x1="5" y1="24.5" x2="22" y2="24.5" stroke="white" stroke-width="1.2" opacity="0.5"/>' +
      '<path d="M10 11 Q10.8 9 10 7" fill="none" stroke="white" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>' +
      '<path d="M14 10.5 Q14.8 8.5 14 6.5" fill="none" stroke="white" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>' +
      '<path d="M18 11 Q18.8 9 18 7" fill="none" stroke="white" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>' +
    '</svg>';
  } else {
    // Panel capsule: dome + body + rim (icon 2 style)
    return '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="28" height="28">' +
      /* dome top */
      '<path d="M10 16 Q10 8 16 8 Q22 8 22 16Z" fill="white" opacity="0.95"/>' +
      /* conical body */
      '<path d="M10 16 L8.5 24 Q16 27 23.5 24 L22 16Z" fill="white" opacity="0.9"/>' +
      /* base rim */
      '<ellipse cx="16" cy="24" rx="7.5" ry="2" fill="white" opacity="0.7"/>' +
      '<ellipse cx="16" cy="24" rx="7.5" ry="2" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="0.8"/>' +
      /* dome shine */
      '<ellipse cx="13.5" cy="12" rx="2" ry="2.5" fill="rgba(255,255,255,0.4)"/>' +
    '</svg>';
  }
}
