/* ═══════════════════════════════════════
   DATA — Tipos, ícones e localizações  v7
   ═══════════════════════════════════════ */

const DELTA = {
  red:      '#a13a1e',
  redDark:  '#7d2c15',
  gold:     '#f1c166',
  goldLt:   '#f5d08a',
  espresso: '#542916',
  roast:    '#6b3a1f',
  brown:    '#b79858',
  teal:     '#88b8ce',
};

const TYPE_CONFIG = {
  'cafe':         { label: 'Café',                color: '#E8820C'  },
  'restaurante':  { label: 'Restaurante',          color: '#c0571e'  },
  'outro':        { label: 'Outro Estabelecimento',color: '#7a6a5a'  },
  'loja-oficial': { label: 'Loja Delta',           color: '#542916'  },
  'delta-q':      { label: 'Delta Q',              color: '#b79858'  },
  'espresso':     { label: 'Delta Espresso',       color: '#a13a1e'  },
  'fabrica':      { label: 'Fábrica / Museu',      color: '#f1c166'  },
  'historia':     { label: 'Café com História',    color: '#6b8c5a'  },
};

const MARKER_TYPE = {
  'cafe':         'cup',
  'restaurante':  'cup',
  'outro':        'cup',
  'loja-oficial': 'capsule',
  'delta-q':      'capsule',
  'espresso':     'capsule',
  'fabrica':      'capsule',
  'historia':     'cup',
};

function getMarkerSVG(type, iconColor) {
  var c   = iconColor || '#ffffff';
  var uid = 'u' + Math.floor(Math.random()*99999);
  var bg  = (TYPE_CONFIG[type] || TYPE_CONFIG['cafe']).color;

  if (MARKER_TYPE[type] === 'cup') {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">' +
      '<defs><filter id="d'+uid+'" x="-30%" y="-20%" width="160%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,.35)"/></filter></defs>' +
      '<g filter="url(#d'+uid+')">' +
        '<path d="M18 2C10.3 2 4 8.3 4 16c0 9.8 14 28 14 28s14-18.2 14-28C32 8.3 25.7 2 18 2z" fill="'+bg+'"/>' +
        '<circle cx="18" cy="16" r="11" fill="rgba(255,255,255,0.12)"/>' +
        '<rect x="11" y="13" width="10" height="8" rx="1.8" fill="'+c+'" opacity="0.95"/>' +
        '<path d="M21 14.5 Q25.5 14.5 25.5 17 Q25.5 19.5 21 19.5" fill="none" stroke="'+c+'" stroke-width="1.8" stroke-linecap="round" opacity="0.95"/>' +
        '<line x1="10" y1="21.3" x2="23" y2="21.3" stroke="'+c+'" stroke-width="0.9" opacity="0.5"/>' +
        '<path d="M14 11 Q14.6 9.2 14 7.5" fill="none" stroke="'+c+'" stroke-width="1.2" stroke-linecap="round" opacity="0.65"/>' +
        '<path d="M17.5 10.5 Q18.1 8.7 17.5 7" fill="none" stroke="'+c+'" stroke-width="1.2" stroke-linecap="round" opacity="0.65"/>' +
        '<path d="M21 11 Q21.6 9.2 21 7.5" fill="none" stroke="'+c+'" stroke-width="1.2" stroke-linecap="round" opacity="0.65"/>' +
      '</g></svg>';
  } else {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">' +
      '<defs><filter id="d'+uid+'" x="-30%" y="-20%" width="160%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,.35)"/></filter></defs>' +
      '<g filter="url(#d'+uid+')">' +
        '<path d="M18 2C10.3 2 4 8.3 4 16c0 9.8 14 28 14 28s14-18.2 14-28C32 8.3 25.7 2 18 2z" fill="'+bg+'"/>' +
        '<circle cx="18" cy="16" r="11" fill="rgba(255,255,255,0.12)"/>' +
        '<ellipse cx="18" cy="22" rx="7" ry="2" fill="none" stroke="'+c+'" stroke-width="1" opacity="0.65"/>' +
        '<path d="M11 21.5 L12.5 10 Q18 8 23.5 10 L25 21.5 Q18 24 11 21.5Z" fill="'+c+'" opacity="0.95"/>' +
        '<ellipse cx="18" cy="9.5" rx="2.5" ry="1.4" fill="none" stroke="'+c+'" stroke-width="1.3" opacity="0.85"/>' +
        '<line x1="21" y1="11.5" x2="22" y2="21" stroke="rgba(255,255,255,0.3)" stroke-width="1.1" stroke-linecap="round"/>' +
      '</g></svg>';
  }
}

function getPanelIcon(type) {
  var isCup = (MARKER_TYPE[type] === 'cup');
  if (isCup) {
    return '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="28" height="28">' +
      '<rect x="6" y="13" width="14" height="11" rx="2" fill="white" opacity="0.95"/>' +
      '<path d="M20 15 Q26 15 26 19 Q26 23 20 23" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.95"/>' +
      '<line x1="5" y1="24.5" x2="22" y2="24.5" stroke="white" stroke-width="1.2" opacity="0.5"/>' +
      '<path d="M10 11 Q10.8 9 10 7" fill="none" stroke="white" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>' +
      '<path d="M14 10.5 Q14.8 8.5 14 6.5" fill="none" stroke="white" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>' +
      '<path d="M18 11 Q18.8 9 18 7" fill="none" stroke="white" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>' +
    '</svg>';
  } else {
    return '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="28" height="28">' +
      '<ellipse cx="16" cy="25" rx="9" ry="2.5" fill="none" stroke="white" stroke-width="1.2" opacity="0.7"/>' +
      '<path d="M7 24 L10 8 Q16 5.5 22 8 L25 24 Q16 27 7 24Z" fill="white" opacity="0.95"/>' +
      '<ellipse cx="16" cy="7.5" rx="3" ry="1.8" fill="none" stroke="white" stroke-width="1.5" opacity="0.9"/>' +
      '<line x1="21" y1="10" x2="22.5" y2="23" stroke="rgba(255,255,255,0.35)" stroke-width="1.2" stroke-linecap="round"/>' +
    '</svg>';
  }
}

const PRODUCTS = ['Café Moído','Café em Grão','Cápsulas Delta','Descafeinado'];

const COUNTRIES = [
  'Portugal','Espanha','França','Alemanha','Reino Unido','Suíça',
  'Luxemburgo','Bélgica','Países Baixos','Itália','Angola','Moçambique',
  'Brasil','Andorra','Irlanda','Suécia','Noruega','Dinamarca'
];

const SEED_LOCATIONS = [
  // ── LOJAS DELTA OFICIAL
  { id:'lo-1', name:'Loja Delta — Lisboa Chiado', lat:38.7100, lng:-9.1400, country:'Portugal', city:'Lisboa', type:'loja-oficial', address:'Rua do Carmo 2, 1200-094 Lisboa', hours:'Seg-Sáb 09h-20h, Dom 10h-19h', verified:true, addedBy:'Delta Oficial', products:['Espresso','Delta Q Cápsulas','Café Moído','Café em Grão','Máquinas Delta Q'], note:'Loja principal da Delta em Lisboa.' },
  { id:'lo-2', name:'Loja Delta — Porto Clérigos', lat:41.1463, lng:-8.6153, country:'Portugal', city:'Porto', type:'loja-oficial', address:'R. dos Clérigos 4, 4050-164 Porto', hours:'Seg-Sáb 09h-20h, Dom 10h-19h', verified:true, addedBy:'Delta Oficial', products:['Espresso','Delta Q Cápsulas','Café Moído','Café em Grão','Máquinas Delta Q'] },
  { id:'lo-3', name:'Loja Delta — Genebra', lat:46.2044, lng:6.1432, country:'Suíça', city:'Genebra', type:'loja-oficial', address:'Rue de Carouge 40, Genève', hours:'Ter-Sáb 09h-19h', verified:true, addedBy:'Delta Oficial', products:['Delta Q Cápsulas','Café Moído','Café em Grão'] },
  { id:'lo-4', name:'Loja Delta — Luxemburgo', lat:49.6117, lng:6.1319, country:'Luxemburgo', city:'Luxemburgo', type:'loja-oficial', address:'Rue de Hollerich 12, Luxembourg', hours:'Seg-Sáb 08h30-19h30', verified:true, addedBy:'Delta Oficial', products:['Delta Q Cápsulas','Café Moído','Café em Grão','Espresso'] },

  // ── DELTA Q
  { id:'dq-1', name:'Delta Q — Centro Colombo', lat:38.7576, lng:-9.1763, country:'Portugal', city:'Lisboa', type:'delta-q', address:'Centro Colombo Piso 1, Lisboa', hours:'Seg-Dom 10h-23h', verified:true, addedBy:'Delta Oficial', products:['Delta Q Cápsulas','Máquinas Delta Q','Acessórios'] },
  { id:'dq-2', name:'Delta Q — Vasco da Gama', lat:38.7681, lng:-9.0941, country:'Portugal', city:'Lisboa', type:'delta-q', address:'C.C. Vasco da Gama, Lisboa', hours:'Seg-Dom 10h-23h', verified:true, addedBy:'Delta Oficial', products:['Delta Q Cápsulas','Máquinas Delta Q','Acessórios'] },
  { id:'dq-3', name:'Delta Q — NorteShopping', lat:41.1850, lng:-8.6480, country:'Portugal', city:'Porto', type:'delta-q', address:'NorteShopping, Porto', hours:'Seg-Dom 10h-23h', verified:true, addedBy:'Delta Oficial', products:['Delta Q Cápsulas','Máquinas Delta Q','Acessórios'] },

  // ── FÁBRICA
  { id:'fa-1', name:'Fábrica Delta — Campo Maior', lat:39.0150, lng:-7.0700, country:'Portugal', city:'Campo Maior', type:'fabrica', address:'Av. Calouste Gulbenkian, Campo Maior', hours:'Visitas: Ter-Dom 10h-17h', verified:true, addedBy:'Delta Oficial', products:['Espresso','Café Moído','Loja Gourmet'], note:'A origem do Delta. Visitas guiadas à fábrica e museu do café.' },

  // ── DELTA ESPRESSO
  { id:'de-1', name:'Delta Espresso — Loures Shopping', lat:38.8341, lng:-9.1561, country:'Portugal', city:'Loures', type:'espresso', address:'Av. Descobertas 90, 2670-457 Loures', hours:'Seg-Dom 10h-23h', verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },
  { id:'de-2', name:'Delta Espresso — UBBO Shopping', lat:38.7790, lng:-9.2193, country:'Portugal', city:'Amadora', type:'espresso', address:'UBBO Shopping, Av. Cruzeiro Seixas 5', hours:'Seg-Dom 10h-23h', verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },
  { id:'de-3', name:'Delta Espresso — Albufeira Terrace', lat:37.0914, lng:-8.2398, country:'Portugal', city:'Albufeira', type:'espresso', address:'R. do Município 32, 8200-161 Albufeira', verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },
  { id:'de-4', name:'Delta Espresso — Forum Algarve', lat:37.0289, lng:-7.9446, country:'Portugal', city:'Faro', type:'espresso', address:'Forum Algarve, N125 Km 103, Faro', verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },
  { id:'de-5', name:'Delta Espresso — RioSul Shopping', lat:38.6168, lng:-9.1176, country:'Portugal', city:'Seixal', type:'espresso', address:'RioSul Shopping, Av. Libertadores de Timor', verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },
  { id:'de-6', name:'Delta Espresso — Mar Shopping Algarve', lat:37.0850, lng:-8.0390, country:'Portugal', city:'Almancil', type:'espresso', address:'Mar Shopping, Av. Algarve, 8135-182 Almancil', verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },
  { id:'de-7', name:'Delta Espresso — Aqua Portimão', lat:37.1360, lng:-8.5370, country:'Portugal', city:'Portimão', type:'espresso', address:'Aqua Portimão, R. de São Pedro 72', verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },
  { id:'de-8', name:'Delta Espresso — Tavira Plaza', lat:37.1250, lng:-7.6510, country:'Portugal', city:'Tavira', type:'espresso', address:'R. Almirante Cândido dos Reis 247, Tavira', verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },
  { id:'de-9', name:'Delta Espresso — Alegro Montijo', lat:38.7050, lng:-8.9740, country:'Portugal', city:'Montijo', type:'espresso', address:'Alegro Montijo, R. da Azinheira 1', verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },
  { id:'de-10', name:'Delta Espresso — Alegro Sintra', lat:38.7619, lng:-9.3069, country:'Portugal', city:'Agualva-Cacém', type:'espresso', address:'Alegro Sintra, Rua Particular ao Estádio', verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },

  // ── CAFÉ / RESTAURANTE
  { id:'ca-1', name:'Café A Brasileira', lat:38.7108, lng:-9.1419, country:'Portugal', city:'Lisboa', type:'cafe', address:'R. Garrett 120, 1200-205 Lisboa', hours:'Seg-Dom 08h-02h', verified:true, addedBy:'Delta Oficial', products:['Espresso'], note:'Histórico café lisboeta, serve Delta Espresso.' },
  { id:'ca-2', name:'Café Majestic', lat:41.1478, lng:-8.6088, country:'Portugal', city:'Porto', type:'cafe', address:'R. de Santa Catarina 112, 4000-442 Porto', hours:'Seg-Sáb 09h30-23h', verified:true, addedBy:'Delta Oficial', products:['Espresso'], note:'Um dos cafés mais belos do mundo.' },
  { id:'ca-3', name:'Bairro Alto Hotel', lat:38.7139, lng:-9.1464, country:'Portugal', city:'Lisboa', type:'cafe', address:'Praça Luís de Camões 2, 1200-243 Lisboa', hours:'Todos os dias 07h-22h', verified:true, addedBy:'Delta Oficial', products:['Espresso','Descafeinado'] },

  // ── CAFÉS COM HISTÓRIA — D de Delta ──────────────────────────
  { id:'cafe-vianna-braga', photo:'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80', name:'Café Vianna', type:'cafe', lat:41.5518, lng:-8.4229, country:'Portugal', city:'Braga', address:'Praça da República, Braga', hours:'Seg–Dom 08:00–24:00', note:'O mais antigo café de Braga, 167 anos de portas abertas para a Praça da República.', products:['Expresso','Abatanado','Delta Q'], verified:true, status:'approved', addedBy:'admin', upvotes:12, dddeltaUrl:'https://dddelta.com/cafe-vianna/' },
  { id:'cafe-piolho-porto', photo:'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', name:'O Piolho', type:'cafe', lat:41.1496, lng:-8.6109, country:'Portugal', city:'Porto', address:'Praça Carlos Alberto, Porto', hours:'Seg–Sex 08:00–02:00 | Sáb–Dom 10:00–02:00', note:'Mais de um século de história no Porto. Foi aqui servido o primeiro expresso da cidade.', products:['Expresso','Cimbalino','Delta Q'], verified:true, status:'approved', addedBy:'admin', upvotes:18, dddeltaUrl:'https://dddelta.com/o-piolho/' },
  { id:'pastelaria-gomes-vilareal', photo:'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80', name:'Pastelaria Gomes', type:'cafe', lat:41.2996, lng:-7.7439, country:'Portugal', city:'Vila Real', address:'Vila Real', hours:'Seg–Dom 07:30–20:00', note:'Prestes a cumprir 100 anos, já na terceira geração com a quarta de mãos na massa.', products:['Expresso','Abatanado','Pastelaria'], verified:true, status:'approved', addedBy:'admin', upvotes:8, dddeltaUrl:'https://dddelta.com/pastaleria-gomes-vila-real/' },
  { id:'pastelaria-o-forno', name:'Pastelaria O Forno', type:'cafe', lat:39.7436, lng:-8.8071, country:'Portugal', city:'Leiria', address:'Leiria, Portugal', hours:'Seg–Dom 07:00–20:00', note:'Vasta doçaria regional cozida em fornos elétricos. Tradição e autenticidade.', products:['Expresso','Delta Q','Pastelaria Regional'], verified:true, status:'approved', addedBy:'admin', upvotes:6, dddeltaUrl:'https://dddelta.com/pastelaria-o-forno/' },
  { id:'casa-pao-de-lo-alfeizerao', name:'Casa Pão de Ló de Alfeizerão', type:'cafe', lat:39.6578, lng:-8.9812, country:'Portugal', city:'Alfeizerão', address:'Alfeizerão, Caldas da Rainha', hours:'Ter–Dom 09:00–18:00', note:'Desde 1925. O Pão de Ló de Alfeizerão é uma herança e um motivo de peregrinação.', products:['Café','Pão de Ló','Doçaria Regional'], verified:true, status:'approved', addedBy:'admin', upvotes:14, dddeltaUrl:'https://dddelta.com/casa-pao-de-lo-de-alfeizerao/' },
  { id:'nova-sbe-lounge-carcavelos', name:'Lounge Delta — Nova SBE', type:'espresso', lat:38.6837, lng:-9.3417, country:'Portugal', city:'Carcavelos', address:'Nova School of Business and Economics, Carcavelos', hours:'Seg–Sex 08:00–20:00', note:'Lounge inaugurado em homenagem ao fundador da Delta Cafés, na Nova SBE.', products:['Expresso','Delta Q','Abatanado'], verified:true, status:'approved', addedBy:'admin', upvotes:5, dddeltaUrl:'https://dddelta.com/lounge-com-historia/' },
  { id:'amalias-flavours-barcelona', name:"Amalia's Flavours", type:'cafe', lat:41.3851, lng:2.1734, country:'Espanha', city:'Barcelona', address:'Barcelona, Espanha', hours:'Seg–Dom 09:00–20:00', note:'Um pedaço de Portugal no coração de Barcelona. Café e pastelaria portuguesa.', products:['Expresso','Delta Q','Pastelaria Portuguesa'], verified:true, status:'approved', addedBy:'admin', upvotes:9, dddeltaUrl:'https://dddelta.com/amalias-flavours-barcelona/' },
  { id:'casa-dani-madrid', photo:'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&q=80', name:'Casa Dani', type:'cafe', lat:40.4253, lng:-3.6830, country:'Espanha', city:'Madrid', address:'Mercado de la Paz, Madrid', hours:'Seg–Sáb 08:00–17:00', note:'Se a tortilha espanhola fosse religião, a Casa Dani seria o seu templo. Café Delta incluído.', products:['Expresso','Delta','Tortilha'], verified:true, status:'approved', addedBy:'admin', upvotes:11, dddeltaUrl:'https://dddelta.com/casa-dani-tortilha-cafe/' },
  { id:'cafe-du-chateau-paris', photo:'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80', name:'Café du Château', type:'cafe', lat:48.8566, lng:2.3522, country:'França', city:'Paris', address:'Paris, França', hours:'Seg–Dom 08:00–22:00', note:'Incontornável em Paris. César Martins, o proprietário, garante que não é exagero.', products:['Expresso','Delta Q','Café Filtrado'], verified:true, status:'approved', addedBy:'admin', upvotes:7, dddeltaUrl:'https://dddelta.com/incontornavel-em-paris-voila/' },
  { id:'baron-tavernier-suica', photo:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', name:'Baron Tavernier — Lago Léman', type:'cafe', lat:46.4312, lng:6.9201, country:'Suíça', city:'Lago Léman', address:'Região do Lago Léman, Suíça', hours:'Seg–Dom 10:00–22:00', note:'Vista deslumbrante para o Lago Léman, numa região classificada como Património UNESCO.', products:['Expresso','Delta','Café da Manhã'], verified:true, status:'approved', addedBy:'admin', upvotes:10, dddeltaUrl:'https://dddelta.com/baron-tavernier/' },
  { id:'cepam-sao-paulo', name:'CEPAM', type:'cafe', lat:-23.5558, lng:-46.5250, country:'Brasil', city:'São Paulo', address:'Zona Leste, São Paulo, Brasil', hours:'Seg–Dom 05:00–22:00', note:'A maior padaria da América Latina, num bairro tradicional da zona leste de São Paulo.', products:['Café','Delta','Padaria'], verified:true, status:'approved', addedBy:'admin', upvotes:13, dddeltaUrl:'https://dddelta.com/cepam-maior-padaria-da-america-latina/' },
  { id:'cafe-nota10-sao-paulo', name:'Café Nota 10', type:'cafe', lat:-23.6012, lng:-46.6962, country:'Brasil', city:'São Paulo', address:'Avenida de Portugal, Brooklin, São Paulo', hours:'Seg–Dom 06:00–22:00', note:'Na avenida de Portugal no Brooklin, onde se bebe café português em São Paulo.', products:['Expresso','Delta Q','Pastelaria'], verified:true, status:'approved', addedBy:'admin', upvotes:8, dddeltaUrl:'https://dddelta.com/cafe-nota-10-sao-paulo/' },

  // ── CAFÉS COM HISTÓRIA — adicionais ───────────────────────────
  { id:'beirao-luxemburgo', name:'Um Beirão no Luxemburgo', type:'cafe', lat:49.6117, lng:6.1319, country:'Luxemburgo', city:'Luxemburgo', address:'Luxemburgo', note:'Um restaurante no Luxemburgo que se mantém o mais português possível, da carta à equipa.', products:['Expresso','Delta'], verified:true, status:'approved', addedBy:'admin', upvotes:6, dddeltaUrl:'https://dddelta.com/beirao-luxemburgo/' },

  { id:'papacorda-lisboa', name:"Pap'Açorda", type:'cafe', lat:38.7125, lng:-9.1448, country:'Portugal', city:'Lisboa', address:'Rua da Atalaia 57-59, Bairro Alto, Lisboa', note:'Aberto em 1981 no Bairro Alto, um ícone da cozinha portuguesa de Lisboa.', products:['Expresso','Delta'], verified:true, status:'approved', addedBy:'admin', upvotes:14, dddeltaUrl:'https://dddelta.com/papacorda/' },

  { id:'golf-club-lausanne', name:'Golf Club de Lausanne', type:'cafe', lat:46.5197, lng:6.6323, country:'Suíça', city:'Lausanne', address:'Route du Golf 3, Lausanne, Suíça', note:'Sabores portugueses em Lausanne — o consumo de café duplicou desde que passaram a usar Delta.', products:['Expresso','Delta Diamond'], verified:true, status:'approved', addedBy:'admin', upvotes:5, dddeltaUrl:'https://dddelta.com/sabores-portugueses-lousanne/' },

  { id:'pastelaria-ramos-aveiro', name:'Pastelaria Ramos', type:'cafe', lat:40.6405, lng:-8.6538, country:'Portugal', city:'Aveiro', address:'Aveiro, Portugal', note:'De mercearia fina a salão de chá — interiores nostálgicos e vitrines recheadas.', products:['Expresso','Delta','Pastelaria'], verified:true, status:'approved', addedBy:'admin', upvotes:9, dddeltaUrl:'https://dddelta.com/pastelaria-ramos/' },

  { id:'ser-tuga-singapura', name:'Ser Tuga — Singapura', type:'cafe', lat:1.3521, lng:103.8198, country:'Singapura', city:'Singapura', address:'Singapura', note:'Haverá algo mais "tuga" do que o saudosismo de um português longe do seu país? Por isso se bebe café Delta.', products:['Expresso','Delta'], verified:true, status:'approved', addedBy:'admin', upvotes:7, dddeltaUrl:'https://dddelta.com/ser-tuga-singapura/' },

  { id:'cafe-central-caldas', name:'Café Central', type:'cafe', lat:39.3992, lng:-9.1336, country:'Portugal', city:'Caldas da Rainha', address:'Caldas da Rainha, Portugal', note:'Café desde o século XIX e Central desde os anos 1930.', products:['Expresso','Delta'], verified:true, status:'approved', addedBy:'admin', upvotes:10, dddeltaUrl:'https://dddelta.com/cafe-central-caldas/' },

  { id:'pastelaria-riviera-albufeira', name:'Pastelaria Riviera', type:'cafe', lat:37.0884, lng:-8.2495, country:'Portugal', city:'Albufeira', address:'Albufeira, Algarve', note:'Alguém de Lagos deseja um Dom Rodrigo? Vem à Riviera.', products:['Expresso','Delta','Doçaria Regional'], verified:true, status:'approved', addedBy:'admin', upvotes:11, dddeltaUrl:'https://dddelta.com/pastelaria-riviera-em-6-pontos/' },

  { id:'cafe-lac-genebra', name:'Café avec vue sur le lac', type:'cafe', lat:46.2044, lng:6.1432, country:'Suíça', city:'Genebra', address:'Lago de Genebra, Suíça', note:'Vista privilegiada para o lago de Genebra com café Delta.', products:['Expresso','Delta'], verified:true, status:'approved', addedBy:'admin', upvotes:8, dddeltaUrl:'https://dddelta.com/cafe-com-vista-para-o-lago-genebra/' },

  { id:'pastelaria-mexicana-lisboa', name:'Pastelaria Mexicana', type:'cafe', lat:38.7274, lng:-9.1493, country:'Portugal', city:'Lisboa', address:'Lisboa, Portugal', note:'Em 2015 o grupo Chimarrão adquiriu a Pastelaria Mexicana — em equipa que ganha, não se mexe.', products:['Expresso','Delta','Pastelaria'], verified:true, status:'approved', addedBy:'admin', upvotes:13, dddeltaUrl:'https://dddelta.com/pastelaria-mexicana/' },

  { id:'cafe-oriente-madrid', name:'Café de Oriente', type:'cafe', lat:40.4180, lng:-3.7148, country:'Espanha', city:'Madrid', address:'Plaza de Oriente 2, Madrid', note:'Um café madrileno de grande elegância junto ao Palácio Real.', products:['Expresso','Delta'], verified:true, status:'approved', addedBy:'admin', upvotes:12, dddeltaUrl:'https://dddelta.com/madrileno-cafe-oriente/' },

  { id:'la-maree-bruxelas', name:'La Marée', type:'cafe', lat:50.8465, lng:4.3517, country:'Bélgica', city:'Bruxelas', address:'Grand Place, Bruxelas, Bélgica', note:'No belga La Marée, bebe-se Delta — num dos espaços mais icónicos de Bruxelas.', products:['Expresso','Delta'], verified:true, status:'approved', addedBy:'admin', upvotes:9, dddeltaUrl:'https://dddelta.com/no-belga-la-maree-bebe-se-delta-2/' },

  { id:'golden-gate-funchal', name:'Golden Gate Grand Café', type:'cafe', lat:32.6669, lng:-16.9241, country:'Portugal', city:'Funchal', address:'Avenida Arriaga, Funchal, Madeira', note:'Assistiu à passagem dos séculos XIX e XX, da esplanada da "Esquina do Mundo".', products:['Expresso','Delta'], verified:true, status:'approved', addedBy:'admin', upvotes:15, dddeltaUrl:'https://dddelta.com/golden-gate-grand-cafe/' },

  { id:'cafe-praga', name:'Café em Praga', type:'cafe', lat:50.0755, lng:14.4378, country:'República Checa', city:'Praga', address:'Praga, República Checa', note:'Delta chega ao coração da Europa Central, numa cidade de cafés históricos.', products:['Expresso','Delta'], verified:true, status:'approved', addedBy:'admin', upvotes:7, dddeltaUrl:'https://dddelta.com/um-cafe-em-praga/' },

  { id:'cafe-majestic-seculo', name:'Café Majestic — Um Século', type:'cafe', lat:41.1478, lng:-8.6088, country:'Portugal', city:'Porto', address:'R. de Santa Catarina 112, Porto', note:'Um século da elegante vida de café — o Majestic é um monumento vivo do Porto.', products:['Expresso','Delta'], verified:true, status:'approved', addedBy:'admin', upvotes:20, dddeltaUrl:'https://dddelta.com/um-seculo-da-elegante-vida-de-cafe/' },

  { id:'paris-porto-cafe', name:'Café Paris-Porto', type:'cafe', lat:48.8566, lng:2.3522, country:'França', city:'Paris', address:'Paris, França', note:'Paris-Porto num segundo — onde a saudade e o café Delta se encontram.', products:['Expresso','Delta'], verified:true, status:'approved', addedBy:'admin', upvotes:8, dddeltaUrl:'https://dddelta.com/paris-porto-num-segundo/' },

  { id:'louvre-michaelense', name:'Louvre Michaelense', type:'cafe', lat:37.7398, lng:-25.6685, country:'Portugal', city:'Ponta Delgada', address:'Centro Histórico, Ponta Delgada, Açores', note:'Tem nome francês, mas o Louvre Michaelense fica no coração de Ponta Delgada.', products:['Expresso','Delta'], verified:true, status:'approved', addedBy:'admin', upvotes:11, dddeltaUrl:'https://dddelta.com/louvre-michaelense/' },

  { id:'cafe-arcada-coimbra', name:'Café Arcada', type:'cafe', lat:40.2056, lng:-8.4195, country:'Portugal', city:'Coimbra', address:'Coimbra, Portugal', note:'Oito décadas de história numa das cidades universitárias mais emblemáticas de Portugal.', products:['Expresso','Delta'], verified:true, status:'approved', addedBy:'admin', upvotes:13, dddeltaUrl:'https://dddelta.com/oito-decadas-de-cafe-arcada/' },

  { id:'gostinho-portuga', name:'Gostinho Portuga', type:'cafe', lat:48.8566, lng:2.3522, country:'França', city:'Paris', address:'Paris, França', note:'Um gostinho "portuga" em Paris — cozinha portuguesa e café Delta.', products:['Expresso','Delta'], verified:true, status:'approved', addedBy:'admin', upvotes:9, dddeltaUrl:'https://dddelta.com/gostinho-portuga/' },

  { id:'cafe-paraiso-porto', name:'Café Paraíso', type:'cafe', lat:41.1496, lng:-8.6109, country:'Portugal', city:'Porto', address:'Porto, Portugal', note:'Um clássico do Porto, com décadas de história e café Delta.', products:['Expresso','Delta'], verified:true, status:'approved', addedBy:'admin', upvotes:16, dddeltaUrl:'https://dddelta.com/cafe-paraiso/' },

  { id:'bekarei-berlim', name:'Bekarei', type:'cafe', lat:52.5200, lng:13.4050, country:'Alemanha', city:'Berlim', address:'Berlim, Alemanha', note:'A padaria portuguesa que serve Delta em Berlim e conquistou os alemães.', products:['Expresso','Delta','Pastelaria Portuguesa'], verified:true, status:'approved', addedBy:'admin', upvotes:14, dddeltaUrl:'https://dddelta.com/bekarei-serve-delta-em-berlim/' },

  { id:'guarany-porto', name:'Guarany — O Café dos Músicos', type:'cafe', lat:41.1472, lng:-8.6099, country:'Portugal', city:'Porto', address:'Rua de Sá da Bandeira, Porto', note:'O café dos músicos do Porto, palco de histórias e encontros desde o século XX.', products:['Expresso','Delta'], verified:true, status:'approved', addedBy:'admin', upvotes:18, dddeltaUrl:'https://dddelta.com/guarany-o-cafe-dos-musicos/' },

  { id:'joey-bats-manhattan', name:'Joey Bats Café', type:'cafe', lat:40.7580, lng:-73.9855, country:'Estados Unidos', city:'Nova Iorque', address:'Manhattan, Nova Iorque, EUA', note:'Café e nata em Manhattan — Delta cruzou o Atlântico e chegou ao coração de Nova Iorque.', products:['Expresso','Delta','Pastel de Nata'], verified:true, status:'approved', addedBy:'admin', upvotes:17, dddeltaUrl:'https://dddelta.com/joey-bats-cafe-em-manhattan/' },

  { id:'pastelaria-havaneza-setubal', name:'Pastelaria Havaneza', type:'cafe', lat:38.5243, lng:-8.8926, country:'Portugal', city:'Setúbal', address:'Setúbal, Portugal', note:'Desde 1900 — mais de um século de doçaria e café no coração de Setúbal.', products:['Expresso','Delta','Pastelaria'], verified:true, status:'approved', addedBy:'admin', upvotes:12, dddeltaUrl:'https://dddelta.com/pastelaria-havaneza-desde-1900/' },

  { id:'glamour-cannes', name:'Café com Glamour em Cannes', type:'cafe', lat:43.5528, lng:7.0174, country:'França', city:'Cannes', address:'Cannes, França', note:'O glamour do café em Cannes — Delta na cidade do cinema e do luxo.', products:['Expresso','Delta'], verified:true, status:'approved', addedBy:'admin', upvotes:10, dddeltaUrl:'https://dddelta.com/o-glamour-do-cafe-em-cannes/' },

  { id:'faruque-odivelas', name:'A Faruque', type:'cafe', lat:38.7946, lng:-9.1858, country:'Portugal', city:'Odivelas', address:'Odivelas, Portugal', note:'Um café de bairro com história e identidade própria em Odivelas.', products:['Expresso','Delta'], verified:true, status:'approved', addedBy:'admin', upvotes:8, dddeltaUrl:'https://dddelta.com/757-2/' },

  { id:'sorry-espresso-seul', name:'Sorry Espresso Bar', type:'cafe', lat:37.5665, lng:126.9780, country:'Coreia do Sul', city:'Seul', address:'Seul, Coreia do Sul', note:'O espresso bar que pede desculpa — Delta em pleno coração de Seul.', products:['Expresso','Delta'], verified:true, status:'approved', addedBy:'admin', upvotes:11, dddeltaUrl:'https://dddelta.com/sorry-espresso-bar-seul/' },

  { id:'brasileira-braga', name:'A Brasileira — Braga', type:'cafe', lat:41.5505, lng:-8.4268, country:'Portugal', city:'Braga', address:'Braga, Portugal', note:'115 anos d\'A Brasileira — um símbolo de Braga que atravessou mais de um século.', products:['Expresso','Delta'], verified:true, status:'approved', addedBy:'admin', upvotes:19, dddeltaUrl:'https://dddelta.com/a-brasileira-braga/' },
];
