/* ═══════════════════════════════════════
   DATA — Seed locations & type config
   ═══════════════════════════════════════ */

// Tipos visíveis no mapa — apenas estes 5
// Delta brand palette
// Vermelho Delta: #8B1A1A  Dourado: #C8A84B  Espresso: #2C1810  Castanho médio: #6B3A2A
const TYPE_CONFIG = {
  "cafe":         { label: "Delta Espresso",     color: "#8B1A1A" },  // vermelho Delta
  "loja-oficial": { label: "Loja Delta Oficial",  color: "#2C1810" },  // espresso escuro
  "delta-q":      { label: "Delta Q",             color: "#6B3A2A" },  // castanho médio
  "restaurante":  { label: "Restaurante",          color: "#C8A84B" },  // dourado Delta
  "fabrica":      { label: "Fábrica / Museu",      color: "#4A2010" },  // castanho fundo
};

// Cup = chávena fumegante | Capsule = cápsula de café
const MARKER_ICONS = {
  "cafe":         "cup",
  "loja-oficial": "capsule",
  "delta-q":      "capsule",
  "restaurante":  "cup",
  "fabrica":      "capsule",
};

function getMarkerSVG(type, color) {
  const uid = Math.random().toString(36).substr(2,5);
  if (MARKER_ICONS[type] === "cup") {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <defs>
        <filter id="ds${uid}">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,.4)"/>
        </filter>
      </defs>
      <g filter="url(#ds${uid})">
        <path d="M16 2C9.4 2 4 7.4 4 14c0 8.5 12 24 12 24s12-15.5 12-24C28 7.4 22.6 2 16 2z" fill="${color}"/>
        <circle cx="16" cy="14" r="9" fill="rgba(255,255,255,0.12)"/>
        <!-- cup body -->
        <rect x="10.5" y="11.5" width="9" height="7" rx="1.5" fill="white" opacity="0.95"/>
        <!-- handle -->
        <path d="M19.5 13 Q23 13 23 15.5 Q23 18 19.5 18" fill="none" stroke="white" stroke-width="1.6" stroke-linecap="round" opacity="0.95"/>
        <!-- saucer line -->
        <line x1="9.5" y1="18.5" x2="20.5" y2="18.5" stroke="white" stroke-width="1" opacity="0.6"/>
        <!-- steam -->
        <path d="M13 10 Q13.6 8.5 13 7" fill="none" stroke="white" stroke-width="1.1" stroke-linecap="round" opacity="0.75"/>
        <path d="M16 9.5 Q16.6 8 16 6.5" fill="none" stroke="white" stroke-width="1.1" stroke-linecap="round" opacity="0.75"/>
        <path d="M19 10 Q19.6 8.5 19 7" fill="none" stroke="white" stroke-width="1.1" stroke-linecap="round" opacity="0.75"/>
      </g>
    </svg>`;
  } else {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <defs>
        <filter id="ds${uid}">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,.4)"/>
        </filter>
      </defs>
      <g filter="url(#ds${uid})">
        <path d="M16 2C9.4 2 4 7.4 4 14c0 8.5 12 24 12 24s12-15.5 12-24C28 7.4 22.6 2 16 2z" fill="${color}"/>
        <circle cx="16" cy="14" r="9" fill="rgba(255,255,255,0.12)"/>
        <!-- capsule body -->
        <ellipse cx="16" cy="15" rx="5" ry="7" fill="white" opacity="0.95"/>
        <!-- capsule top nozzle -->
        <rect x="14" y="7.5" width="4" height="2.5" rx="1.2" fill="white" opacity="0.9"/>
        <!-- capsule shine -->
        <ellipse cx="14" cy="13" rx="1.5" ry="2.5" fill="${color}" opacity="0.2"/>
        <!-- capsule bottom point -->
        <path d="M13 20 Q16 23.5 19 20" fill="white" opacity="0.6"/>
      </g>
    </svg>`;
  }
}

const PRODUCTS = [
  "Espresso", "Delta Q Cápsulas", "Café Moído", "Café em Grão",
  "Descafeinado", "Máquinas Delta Q", "Acessórios", "Loja Gourmet"
];

const COUNTRIES = [
  "Portugal","Espanha","França","Alemanha","Reino Unido","Suíça",
  "Luxemburgo","Bélgica","Países Baixos","Itália","Angola","Moçambique",
  "Brasil","Andorra","Irlanda","Suécia","Noruega","Dinamarca"
];

const SEED_LOCATIONS = [
  // ── LOJAS DELTA OFICIAL ─────────────────────────────────────
  {
    id:"pt-1", name:"Loja Delta — Lisboa Chiado",
    lat:38.7100, lng:-9.1400, country:"Portugal", city:"Lisboa",
    type:"loja-oficial", address:"Rua do Carmo 2, 1200-094 Lisboa",
    hours:"Seg-Sáb 09h-20h, Dom 10h-19h",
    verified:true, addedBy:"Delta Oficial", upvotes:87,
    products:["Espresso","Delta Q Cápsulas","Café Moído","Café em Grão","Máquinas Delta Q","Acessórios","Loja Gourmet"],
    note:"Loja principal da Delta em Lisboa."
  },
  {
    id:"pt-7", name:"Loja Delta — Porto Clérigos",
    lat:41.1463, lng:-8.6153, country:"Portugal", city:"Porto",
    type:"loja-oficial", address:"R. dos Clérigos 4, 4050-164 Porto",
    hours:"Seg-Sáb 09h-20h, Dom 10h-19h",
    verified:true, addedBy:"Delta Oficial", upvotes:74,
    products:["Espresso","Delta Q Cápsulas","Café Moído","Café em Grão","Máquinas Delta Q","Acessórios","Loja Gourmet"]
  },
  // ── DELTA Q ──────────────────────────────────────────────────
  {
    id:"pt-3", name:"Delta Q — Centro Colombo",
    lat:38.7576, lng:-9.1763, country:"Portugal", city:"Lisboa",
    type:"delta-q", address:"Centro Colombo Piso 1, Lisboa",
    hours:"Seg-Dom 10h-23h",
    verified:true, addedBy:"Delta Oficial", upvotes:52,
    products:["Delta Q Cápsulas","Máquinas Delta Q","Acessórios"]
  },
  {
    id:"pt-4", name:"Delta Q — Vasco da Gama",
    lat:38.7681, lng:-9.0941, country:"Portugal", city:"Lisboa",
    type:"delta-q", address:"C.C. Vasco da Gama, Lisboa",
    hours:"Seg-Dom 10h-23h",
    verified:true, addedBy:"Delta Oficial", upvotes:61,
    products:["Delta Q Cápsulas","Máquinas Delta Q","Acessórios"]
  },
  {
    id:"pt-9", name:"Delta Q — NorteShopping",
    lat:41.1850, lng:-8.6480, country:"Portugal", city:"Porto",
    type:"delta-q", address:"NorteShopping, Porto",
    hours:"Seg-Dom 10h-23h",
    verified:true, addedBy:"Delta Oficial", upvotes:33,
    products:["Delta Q Cápsulas","Máquinas Delta Q","Acessórios"]
  },
  // ── FÁBRICA / MUSEU ──────────────────────────────────────────
  {
    id:"pt-10", name:"Fábrica Delta — Campo Maior",
    lat:39.0150, lng:-7.0700, country:"Portugal", city:"Campo Maior",
    type:"fabrica", address:"Campo Maior, Alentejo",
    hours:"Visitas: Ter-Dom 10h-17h",
    verified:true, addedBy:"Delta Oficial", upvotes:203,
    products:["Espresso","Café Moído","Café em Grão","Loja Gourmet"],
    note:"A origem do Delta. Visitas guiadas à fábrica e museu do café."
  },
  // ── DELTA ESPRESSO (deltaespresso.com) ───────────────────────
  {
    id:"de-1", name:"Delta Espresso — Loures Shopping",
    lat:38.8341, lng:-9.1561, country:"Portugal", city:"Loures",
    type:"cafe", address:"Av. Descobertas 90, 2670-457 Loures, Piso 0/1",
    verified:true, addedBy:"Delta Oficial", upvotes:38,
    products:["Espresso","Descafeinado"]
  },
  {
    id:"de-2", name:"Delta Espresso — UBBO Shopping",
    lat:38.7790, lng:-9.2193, country:"Portugal", city:"Brandoa",
    type:"cafe", address:"UBBO Shopping Resort, Av. Cruzeiro Seixas 5-7, 2650-505 Brandoa",
    verified:true, addedBy:"Delta Oficial", upvotes:29,
    products:["Espresso","Descafeinado"]
  },
  {
    id:"de-3", name:"Delta Espresso — Albufeira Terrace",
    lat:37.0914, lng:-8.2398, country:"Portugal", city:"Albufeira",
    type:"cafe", address:"Albufeira Terrace, R. do Município 32, 8200-161 Albufeira",
    verified:true, addedBy:"Delta Oficial", upvotes:22,
    products:["Espresso","Descafeinado"]
  },
  {
    id:"de-4", name:"Delta Espresso — Forum Algarve",
    lat:37.0289, lng:-7.9446, country:"Portugal", city:"Faro",
    type:"cafe", address:"Forum Algarve, N125 Km 103, 8009-126 Faro",
    verified:true, addedBy:"Delta Oficial", upvotes:31,
    products:["Espresso","Descafeinado"]
  },
  {
    id:"de-5", name:"Delta Espresso — RioSul Shopping",
    lat:38.6168, lng:-9.1176, country:"Portugal", city:"Seixal",
    type:"cafe", address:"RioSul Shopping, Av. Libertadores de Timor Loro Sae, 2840-168 Seixal",
    verified:true, addedBy:"Delta Oficial", upvotes:19,
    products:["Espresso","Descafeinado"]
  },
  {
    id:"de-6", name:"Delta Espresso — Mar Shopping Algarve",
    lat:37.0850, lng:-8.0390, country:"Portugal", city:"Almancil",
    type:"cafe", address:"Mar Shopping, Av. Algarve, 8135-182 Almancil",
    verified:true, addedBy:"Delta Oficial", upvotes:17,
    products:["Espresso","Descafeinado"]
  },
  {
    id:"de-7", name:"Delta Espresso — Aqua Portimão",
    lat:37.1360, lng:-8.5370, country:"Portugal", city:"Portimão",
    type:"cafe", address:"Aqua Portimão, R. de São Pedro 72, 8500-448 Portimão",
    verified:true, addedBy:"Delta Oficial", upvotes:14,
    products:["Espresso","Descafeinado"]
  },
  {
    id:"de-8", name:"Delta Espresso — Tavira Plaza",
    lat:37.1250, lng:-7.6510, country:"Portugal", city:"Tavira",
    type:"cafe", address:"R. Almirante Cândido dos Reis 247, 8800-318 Tavira",
    verified:true, addedBy:"Delta Oficial", upvotes:11,
    products:["Espresso","Descafeinado"]
  },
  {
    id:"de-9", name:"Delta Espresso — Alegro Montijo",
    lat:38.7050, lng:-8.9740, country:"Portugal", city:"Montijo",
    type:"cafe", address:"Alegro Montijo, R. da Azinheira 1, 2879-100 Montijo",
    verified:true, addedBy:"Delta Oficial", upvotes:16,
    products:["Espresso","Descafeinado"]
  },
  {
    id:"de-10", name:"Delta Espresso — Alegro Sintra",
    lat:38.7680, lng:-9.3320, country:"Portugal", city:"Rio de Mouro",
    type:"cafe", address:"R. Alto do Forte IC19, 2635-018 Rio de Mouro",
    verified:true, addedBy:"Delta Oficial", upvotes:13,
    products:["Espresso","Descafeinado"]
  },
  // ── RESTAURANTE ──────────────────────────────────────────────
  {
    id:"pt-15", name:"Bairro Alto Hotel — Lisboa",
    lat:38.7139, lng:-9.1464, country:"Portugal", city:"Lisboa",
    type:"restaurante", address:"Praça Luís de Camões 2, Lisboa",
    hours:"Todos os dias 07h-22h",
    verified:true, addedBy:"Delta Oficial", upvotes:45,
    products:["Espresso","Descafeinado"],
    note:"Serve Delta Espresso."
  },
  // ── EUROPA ───────────────────────────────────────────────────
  {
    id:"eu-3", name:"Mercearia Portuguesa — Luxemburgo",
    lat:49.6117, lng:6.1319, country:"Luxemburgo", city:"Luxemburgo",
    type:"loja-oficial", address:"Rue de Hollerich 12, Luxembourg",
    hours:"Seg-Sáb 08h30-19h30",
    verified:true, addedBy:"Delta Oficial", upvotes:41,
    products:["Delta Q Cápsulas","Café Moído","Café em Grão","Espresso"]
  },
  {
    id:"eu-5", name:"Loja Delta — Genebra",
    lat:46.2044, lng:6.1432, country:"Suíça", city:"Genebra",
    type:"loja-oficial", address:"Rue de Carouge 40, Genève",
    hours:"Ter-Sáb 09h-19h",
    verified:true, addedBy:"Delta Oficial", upvotes:53,
    products:["Delta Q Cápsulas","Café Moído","Café em Grão"]
  },
];
