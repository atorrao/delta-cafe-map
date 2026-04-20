/* ═══════════════════════════════════════
   DATA — Seed locations & type config
   ═══════════════════════════════════════ */

const TYPE_CONFIG = {
  "cafe":               { label: "Café / Pastelaria",    color: "#c0392b", emoji: "☕" },
  "loja-oficial":       { label: "Loja Delta Oficial",   color: "#8b1a10", emoji: "🏪" },
  "delta-q":            { label: "Delta Q",              color: "#8e44ad", emoji: "🔴" },
  "supermercado":       { label: "Supermercado",          color: "#27ae60", emoji: "🛒" },
  "loja-especializada": { label: "Loja Especializada",   color: "#2980b9", emoji: "🏬" },
  "loja-portuguesa":    { label: "Loja Portuguesa",      color: "#e67e22", emoji: "🇵🇹" },
  "restaurante":        { label: "Restaurante / Hotel",  color: "#16a085", emoji: "🍽️" },
  "fabrica":            { label: "Fábrica / Museu",      color: "#c0392b", emoji: "🏭" },
  "distribuidor":       { label: "Distribuidor B2B",     color: "#7f8c8d", emoji: "📦" },
};

const PRODUCTS = [
  "Espresso", "Delta Q Cápsulas", "Café Moído", "Café em Grão",
  "Café Solúvel", "Descafeinado", "Máquinas Delta Q", "Acessórios", "Loja Gourmet"
];

const COUNTRIES = [
  "Portugal","Espanha","França","Alemanha","Reino Unido","Suíça",
  "Luxemburgo","Bélgica","Países Baixos","Itália","Angola","Moçambique",
  "Brasil","Andorra","Irlanda","Suécia","Noruega","Dinamarca"
];

const SEED_LOCATIONS = [
  // ── PORTUGAL ──────────────────────────────────────────────────────────────
  {
    id:"pt-1", name:"Loja Delta — Lisboa Chiado",
    lat:38.7100, lng:-9.1400, country:"Portugal", city:"Lisboa",
    type:"loja-oficial", address:"Rua do Carmo 2, 1200-094 Lisboa",
    hours:"Seg-Sáb 09h-20h, Dom 10h-19h",
    verified:true, addedBy:"Delta Oficial", upvotes:87,
    products:["Espresso","Delta Q Cápsulas","Café Moído","Café em Grão","Máquinas Delta Q","Acessórios","Loja Gourmet"],
    note:"Loja principal da Delta em Lisboa. Experiência de degustação disponível."
  },
  {
    id:"pt-2", name:"Café A Brasileira",
    lat:38.7108, lng:-9.1419, country:"Portugal", city:"Lisboa",
    type:"cafe", address:"R. Garrett 120, 1200-205 Lisboa",
    hours:"Seg-Dom 08h-02h",
    verified:true, addedBy:"Delta Oficial", upvotes:124,
    products:["Espresso","Café Moído"],
    note:"Histórico café lisboeta, serve Delta Espresso desde sempre."
  },
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
    id:"pt-5", name:"Continente Colombo",
    lat:38.7570, lng:-9.1770, country:"Portugal", city:"Lisboa",
    type:"supermercado", address:"Centro Colombo, Lisboa",
    verified:true, addedBy:"Delta Oficial", upvotes:38,
    products:["Espresso","Delta Q Cápsulas","Café Moído","Café em Grão","Descafeinado"]
  },
  {
    id:"pt-6", name:"Pingo Doce Marquês de Pombal",
    lat:38.7227, lng:-9.1491, country:"Portugal", city:"Lisboa",
    type:"supermercado", address:"Av. Fontes Pereira de Melo 3, Lisboa",
    verified:true, addedBy:"Delta Oficial", upvotes:29,
    products:["Delta Q Cápsulas","Café Moído","Descafeinado"]
  },
  {
    id:"pt-7", name:"Loja Delta — Porto Clérigos",
    lat:41.1463, lng:-8.6153, country:"Portugal", city:"Porto",
    type:"loja-oficial", address:"R. dos Clérigos 4, 4050-164 Porto",
    hours:"Seg-Sáb 09h-20h, Dom 10h-19h",
    verified:true, addedBy:"Delta Oficial", upvotes:74,
    products:["Espresso","Delta Q Cápsulas","Café Moído","Café em Grão","Máquinas Delta Q","Acessórios","Loja Gourmet"]
  },
  {
    id:"pt-8", name:"Café Majestic — Porto",
    lat:41.1478, lng:-8.6088, country:"Portugal", city:"Porto",
    type:"cafe", address:"R. de Santa Catarina 112, Porto",
    hours:"Seg-Sáb 09h30-23h",
    verified:true, addedBy:"Delta Oficial", upvotes:98,
    products:["Espresso","Café Moído"],
    note:"Um dos cafés mais belos do mundo, serve Delta Espresso."
  },
  {
    id:"pt-9", name:"Delta Q — NorteShopping",
    lat:41.1850, lng:-8.6480, country:"Portugal", city:"Porto",
    type:"delta-q", address:"NorteShopping, Porto",
    hours:"Seg-Dom 10h-23h",
    verified:true, addedBy:"Delta Oficial", upvotes:33,
    products:["Delta Q Cápsulas","Máquinas Delta Q","Acessórios"]
  },
  {
    id:"pt-10", name:"Fábrica Delta — Campo Maior",
    lat:39.0150, lng:-7.0700, country:"Portugal", city:"Campo Maior",
    type:"fabrica", address:"Campo Maior, Alentejo",
    hours:"Visitas: Ter-Dom 10h-17h",
    verified:true, addedBy:"Delta Oficial", upvotes:203,
    products:["Espresso","Café Moído","Café em Grão","Loja Gourmet"],
    note:"A origem do Delta! Visitas guiadas à fábrica e museu do café. Loja exclusiva."
  },
  {
    id:"pt-11", name:"El Corte Inglés — Lisboa",
    lat:38.7265, lng:-9.1526, country:"Portugal", city:"Lisboa",
    type:"loja-especializada", address:"Av. António Augusto Aguiar, Lisboa",
    hours:"Seg-Dom 10h-22h",
    verified:true, addedBy:"Delta Oficial", upvotes:22,
    products:["Delta Q Cápsulas","Café Moído","Loja Gourmet"]
  },
  {
    id:"pt-12", name:"Continente Braga Minho Center",
    lat:41.5518, lng:-8.4229, country:"Portugal", city:"Braga",
    type:"supermercado", address:"Minho Center, Braga",
    verified:true, addedBy:"Delta Oficial", upvotes:18,
    products:["Delta Q Cápsulas","Café Moído","Descafeinado"]
  },
  {
    id:"pt-13", name:"Pingo Doce Faro Shopping",
    lat:37.0194, lng:-7.9322, country:"Portugal", city:"Faro",
    type:"supermercado", address:"Faro Shopping, Faro",
    verified:true, addedBy:"Delta Oficial", upvotes:14,
    products:["Delta Q Cápsulas","Café Moído"]
  },
  {
    id:"pt-14", name:"Café Arcádia — Coimbra",
    lat:40.2094, lng:-8.4268, country:"Portugal", city:"Coimbra",
    type:"cafe", address:"R. Ferreira Borges, Coimbra",
    hours:"Seg-Dom 08h-21h",
    verified:true, addedBy:"Delta Oficial", upvotes:31,
    products:["Espresso","Café Moído"]
  },
  {
    id:"pt-15", name:"Hotel Bairro Alto — Lisboa",
    lat:38.7139, lng:-9.1464, country:"Portugal", city:"Lisboa",
    type:"restaurante", address:"Praça Luís de Camões 2, Lisboa",
    hours:"Todos os dias 07h-22h",
    verified:true, addedBy:"Delta Oficial", upvotes:45,
    products:["Espresso","Descafeinado"],
    note:"Serve Delta Espresso em contexto de luxo. Excelente experiência."
  },
  // ── EUROPA ────────────────────────────────────────────────────────────────
  {
    id:"eu-1", name:"Supermercado Lusitânia — Paris",
    lat:48.8566, lng:2.3785, country:"França", city:"Paris",
    type:"loja-portuguesa", address:"Rue de la Roquette 87, Paris 11e",
    hours:"Seg-Sáb 09h-20h",
    verified:true, addedBy:"Delta Oficial", upvotes:64,
    products:["Delta Q Cápsulas","Café Moído","Café em Grão"]
  },
  {
    id:"eu-2", name:"Casa de Portugal — Londres Stockwell",
    lat:51.4741, lng:-0.1216, country:"Reino Unido", city:"Londres",
    type:"loja-portuguesa", address:"Stockwell Road 155, London SW9",
    hours:"Seg-Sáb 09h-19h",
    verified:true, addedBy:"Delta Oficial", upvotes:48,
    products:["Delta Q Cápsulas","Café Moído"]
  },
  {
    id:"eu-3", name:"Mercearia Portuguesa — Luxemburgo",
    lat:49.6117, lng:6.1319, country:"Luxemburgo", city:"Luxemburgo",
    type:"loja-portuguesa", address:"Rue de Hollerich 12, Luxembourg",
    hours:"Seg-Sáb 08h30-19h30",
    verified:true, addedBy:"Delta Oficial", upvotes:77,
    products:["Delta Q Cápsulas","Café Moído","Café em Grão","Espresso"]
  },
  {
    id:"eu-4", name:"Supermercado Cactus — Luxemburgo",
    lat:49.600, lng:6.120, country:"Luxemburgo", city:"Luxemburgo",
    type:"supermercado", address:"Luxembourg City",
    verified:true, addedBy:"Delta Oficial", upvotes:36,
    products:["Delta Q Cápsulas","Café Moído"]
  },
  {
    id:"eu-5", name:"Loja Portuguesa — Genebra",
    lat:46.2044, lng:6.1432, country:"Suíça", city:"Genebra",
    type:"loja-portuguesa", address:"Rue de Carouge 40, Genève",
    hours:"Seg-Sáb 09h-19h",
    verified:true, addedBy:"Delta Oficial", upvotes:53,
    products:["Delta Q Cápsulas","Café Moído","Café em Grão"]
  },
  {
    id:"eu-6", name:"El Corte Inglés — Madrid",
    lat:40.4200, lng:-3.6920, country:"Espanha", city:"Madrid",
    type:"loja-especializada", address:"Calle de Preciados 3, Madrid",
    hours:"Seg-Sáb 10h-22h, Dom 11h-21h",
    verified:true, addedBy:"Delta Oficial", upvotes:39,
    products:["Delta Q Cápsulas","Café Moído","Café em Grão"]
  },
  {
    id:"eu-7", name:"Mercadona — Barcelona",
    lat:41.3851, lng:2.1734, country:"Espanha", city:"Barcelona",
    type:"supermercado", address:"Carrer de Balmes, Barcelona",
    verified:true, addedBy:"Delta Oficial", upvotes:19,
    products:["Café Moído","Descafeinado"]
  },
  {
    id:"eu-8", name:"Mercearia Lusa — Bruxelas",
    lat:50.8503, lng:4.3517, country:"Bélgica", city:"Bruxelas",
    type:"loja-portuguesa", address:"Rue de Laeken 80, Bruxelles",
    hours:"Ter-Sáb 10h-19h",
    verified:true, addedBy:"Delta Oficial", upvotes:29,
    products:["Delta Q Cápsulas","Café Moído"]
  },
  {
    id:"eu-9", name:"Importadora Ibérica — Frankfurt",
    lat:50.1109, lng:8.6821, country:"Alemanha", city:"Frankfurt",
    type:"distribuidor", address:"Hanauer Landstraße, Frankfurt",
    verified:true, addedBy:"Delta Oficial", upvotes:13,
    products:["Café Moído","Café em Grão"]
  },
  {
    id:"eu-10", name:"Loja Portuguesa — Lausanne",
    lat:46.5197, lng:6.6323, country:"Suíça", city:"Lausanne",
    type:"loja-portuguesa", address:"Avenue de Rhodanie, Lausanne",
    hours:"Ter-Sáb 09h-18h30",
    verified:true, addedBy:"Delta Oficial", upvotes:34,
    products:["Delta Q Cápsulas","Café Moído"]
  },
  {
    id:"eu-11", name:"Loja Portuguesa — Zurique",
    lat:47.3769, lng:8.5417, country:"Suíça", city:"Zurique",
    type:"loja-portuguesa", address:"Langstrasse, Zürich",
    verified:true, addedBy:"Delta Oficial", upvotes:27,
    products:["Delta Q Cápsulas","Café Moído"]
  },
  {
    id:"eu-12", name:"Mercearia Portuguesa — Roterdão",
    lat:51.9244, lng:4.4777, country:"Países Baixos", city:"Roterdão",
    type:"loja-portuguesa", address:"Schiedamseweg, Rotterdam",
    verified:true, addedBy:"Delta Oficial", upvotes:18,
    products:["Delta Q Cápsulas","Café Moído"]
  },
];
