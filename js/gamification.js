/* ═══════════════════════════════════════════════════
   GAMIFICATION — Níveis, prémios e pontuação
   Curva progressiva: fácil no início, difícil depois
   ═══════════════════════════════════════════════════ */

const LEVELS = [
  {
    level: 1, name: "Descobridor",
    minPts: 0, maxPts: 29,
    color: "#8c9aaa",           // cinza-azul slate
    bg: "#f0f3f6", fg: "#3d4f5c",
    barColor: "#8c9aaa",
    description: "Estás a dar os primeiros passos no mapa do Delta.",
    prize: null
  },
  {
    level: 2, name: "Explorador",
    minPts: 30, maxPts: 99,
    color: "#2e7d5e",           // verde escuro
    bg: "#eaf4ef", fg: "#1a4a38",
    barColor: "#2e7d5e",
    description: "Já contribuíste para a comunidade. Continua!",
    prize: {
      name: "Desconto 10% Online",
      desc: "10% de desconto em qualquer compra na loja delta-cafes.pt",
      icon: "D",
      code: "DELTA-EXPLORER10"
    }
  },
  {
    level: 3, name: "Conhecedor",
    minPts: 100, maxPts: 249,
    color: "#b07d2e",           // dourado
    bg: "#fdf5e6", fg: "#6b4a0e",
    barColor: "#c49a3a",
    description: "O teu conhecimento do café Delta impressiona.",
    prize: {
      name: "Pack Degustação Delta",
      desc: "Pack com 4 variedades de café Delta entregue em casa",
      icon: "P",
      code: "DELTA-DEGUSTATION"
    }
  },
  {
    level: 4, name: "Especialista",
    minPts: 250, maxPts: 599,
    color: "#c0571e",           // laranja-cobre
    bg: "#fdf0ea", fg: "#7a2e0a",
    barColor: "#d4622a",
    description: "A tua contribuição faz uma diferença real.",
    prize: {
      name: "Máquina Delta Q Compact",
      desc: "Uma máquina Delta Q Compact completamente gratuita",
      icon: "M",
      code: "DELTA-SPECIALIST"
    }
  },
  {
    level: 5, name: "Embaixador",
    minPts: 600, maxPts: 1199,
    color: "#9b2335",           // vinho escuro
    bg: "#faeaec", fg: "#5c1020",
    barColor: "#b02a3e",
    description: "És uma referência da comunidade Delta Map.",
    prize: {
      name: "Visita VIP Campo Maior",
      desc: "Visita exclusiva à fábrica com tour guiado, almoço e brunch",
      icon: "V",
      code: "DELTA-AMBASSADOR"
    }
  },
  {
    level: 6, name: "Lenda Delta",
    minPts: 1200, maxPts: Infinity,
    color: "#1a0a00",           // espresso puro
    bg: "#f5eed8", fg: "#1a0a00",
    barColor: "#c47f2e",
    description: "O nível mais alto. O Delta reconhece a tua dedicação.",
    prize: {
      name: "Subscrição Anual Ilimitada",
      desc: "Cápsulas Delta Q ilimitadas durante 1 ano + kit exclusivo de coleção",
      icon: "S",
      code: "DELTA-LEGEND"
    }
  }
];

const POINT_RULES = {
  ADD_LOCATION:    25,
  UPVOTE_RECEIVED: 8,
  UPVOTE_GIVEN:    1,
  VERIFIED:        30,
  FIRST_LOCATION:  40,
};

const Gamification = {

  getLevel(pts) {
    return LEVELS.slice().reverse().find(l => pts >= l.minPts) || LEVELS[0];
  },

  getNextLevel(pts) {
    return LEVELS.find(l => l.minPts > pts) || null;
  },

  calcProgress(pts) {
    const cur  = this.getLevel(pts);
    const next = this.getNextLevel(pts);
    if (!next) return 100;
    const range = next.minPts - cur.minPts;
    const done  = pts - cur.minPts;
    return Math.min(100, Math.round((done / range) * 100));
  },

  getUnlockedPrizes(pts) {
    return LEVELS.filter(l => pts >= l.minPts && l.prize);
  },

  getAllPrizeLevels() {
    return LEVELS.filter(l => l.prize);
  },

  addPoints(userEmail, reason, multiplier = 1) {
    const users = Store.getUsers();
    if (!users[userEmail]) return 0;
    const pts = (POINT_RULES[reason] || 0) * multiplier;
    users[userEmail].points = (users[userEmail].points || 0) + pts;
    Store.saveUsers(users);
    const sess = Store.getSession();
    if (sess && sess.email === userEmail) {
      sess.points = users[userEmail].points;
      Store.saveSession(sess);
    }
    return pts;
  },

  renderLevelPill(pts) {
    const lv = this.getLevel(pts);
    return `<span class="level-pill" style="background:${lv.bg};color:${lv.fg};border:1px solid ${lv.color}40;">Nível ${lv.level} · ${lv.name}</span>`;
  }
};
