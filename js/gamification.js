/* ═══════════════════════════════════════════════════
   GAMIFICATION — Níveis, prémios e pontuação
   Curva: fácil 1→3, progressivamente difícil 4→6
   ═══════════════════════════════════════════════════ */

// Avatar por nível — SVG inline, progressivamente mais premium
const LEVEL_AVATARS = [
  // Nível 1 — círculo simples slate
  `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="#e8ecf0" stroke="#8c9aaa" stroke-width="2"/>
    <circle cx="20" cy="16" r="6" fill="#8c9aaa"/>
    <ellipse cx="20" cy="30" rx="9" ry="6" fill="#8c9aaa"/>
  </svg>`,
  // Nível 2 — verde com brilho
  `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="#e8f4ef" stroke="#2e7d5e" stroke-width="2"/>
    <circle cx="20" cy="16" r="6" fill="#2e7d5e"/>
    <ellipse cx="20" cy="30" rx="9" ry="6" fill="#2e7d5e"/>
    <circle cx="28" cy="12" r="4" fill="#52c49a" opacity="0.7"/>
  </svg>`,
  // Nível 3 — dourado
  `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="#fdf5e6" stroke="#b07d2e" stroke-width="2"/>
    <circle cx="20" cy="16" r="6" fill="#b07d2e"/>
    <ellipse cx="20" cy="30" rx="9" ry="6" fill="#b07d2e"/>
    <path d="M20 4 L21.5 8 L26 8 L22.5 11 L24 15 L20 12.5 L16 15 L17.5 11 L14 8 L18.5 8Z" fill="#e8a83a" opacity="0.85"/>
  </svg>`,
  // Nível 4 — cobre com escudo
  `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="#fdf0ea" stroke="#c0571e" stroke-width="2.5"/>
    <circle cx="20" cy="16" r="6" fill="#c0571e"/>
    <ellipse cx="20" cy="30" rx="9" ry="6" fill="#c0571e"/>
    <path d="M20 5 L27 9 L27 16 Q27 22 20 25 Q13 22 13 16 L13 9Z" fill="none" stroke="#d4622a" stroke-width="1.5" opacity="0.7"/>
  </svg>`,
  // Nível 5 — vinho com coroa
  `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="#faeaec" stroke="#9b2335" stroke-width="2.5"/>
    <circle cx="20" cy="16" r="6" fill="#9b2335"/>
    <ellipse cx="20" cy="30" rx="9" ry="6" fill="#9b2335"/>
    <path d="M13 13 L13 8 L16.5 11 L20 6 L23.5 11 L27 8 L27 13Z" fill="#b02a3e" opacity="0.85"/>
  </svg>`,
  // Nível 6 — espresso/preto com diamante
  `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="#1a0a00" stroke="#c47f2e" stroke-width="2.5"/>
    <circle cx="20" cy="16" r="6" fill="#c47f2e"/>
    <ellipse cx="20" cy="30" rx="9" ry="6" fill="#c47f2e"/>
    <polygon points="20,5 24,10 20,15 16,10" fill="#e8c36a" opacity="0.9"/>
    <polygon points="20,15 24,10 28,12 20,20" fill="#c49a3a" opacity="0.7"/>
    <polygon points="20,15 16,10 12,12 20,20" fill="#f0d080" opacity="0.7"/>
  </svg>`,
];

const LEVELS = [
  {
    level: 1, name: "Descobridor",
    minPts: 0,    maxPts: 29,
    color: "#8c9aaa", bg: "#f0f3f6", fg: "#3d4f5c",
    barColor: "#8c9aaa",
    description: "Estás a dar os primeiros passos.",
    prize: null
  },
  {
    level: 2, name: "Explorador",
    minPts: 30,   maxPts: 99,
    color: "#2e7d5e", bg: "#eaf4ef", fg: "#1a4a38",
    barColor: "#2e7d5e",
    description: "Já contribuíste para a comunidade.",
    prize: {
      name: "Desconto 10% Online",
      desc: "10% de desconto em qualquer compra na loja delta-cafes.pt",
      code: "DELTA-EXPLORER10"
    }
  },
  {
    level: 3, name: "Conhecedor",
    minPts: 100,  maxPts: 299,
    color: "#b07d2e", bg: "#fdf5e6", fg: "#6b4a0e",
    barColor: "#c49a3a",
    description: "O teu conhecimento do café Delta impressiona.",
    prize: {
      name: "Pack Degustação Delta",
      desc: "Pack com 4 variedades de café Delta entregue em casa",
      code: "DELTA-DEGUSTATION"
    }
  },
  {
    level: 4, name: "Especialista",
    minPts: 300,  maxPts: 799,
    color: "#c0571e", bg: "#fdf0ea", fg: "#7a2e0a",
    barColor: "#d4622a",
    description: "A tua contribuição tem impacto real na comunidade.",
    prize: {
      name: "Máquina Delta Q Compact",
      desc: "Uma máquina Delta Q Compact completamente gratuita",
      code: "DELTA-SPECIALIST"
    }
  },
  {
    level: 5, name: "Embaixador",
    minPts: 800,  maxPts: 1999,
    color: "#9b2335", bg: "#faeaec", fg: "#5c1020",
    barColor: "#b02a3e",
    description: "És uma referência da comunidade Delta Map.",
    prize: {
      name: "Visita VIP Campo Maior",
      desc: "Visita exclusiva à fábrica com tour guiado, almoço e brunch",
      code: "DELTA-AMBASSADOR"
    }
  },
  {
    level: 6, name: "Lenda Delta",
    minPts: 2000, maxPts: Infinity,
    color: "#1a0a00", bg: "#f5eed8", fg: "#1a0a00",
    barColor: "#c47f2e",
    description: "O nível mais alto. O Delta reconhece a tua dedicação.",
    prize: {
      name: "Subscrição Anual Ilimitada",
      desc: "Cápsulas Delta Q ilimitadas durante 1 ano + kit exclusivo de coleção",
      code: "DELTA-LEGEND"
    }
  }
];

const POINT_RULES = {
  ADD_LOCATION:    25,   // adicionar local
  UPVOTE_RECEIVED: 8,    // receber upvote
  UPVOTE_GIVEN:    1,    // dar upvote
  VERIFIED:        30,   // local verificado
  FIRST_LOCATION:  40,   // bónus primeiro local
};

const Gamification = {
  getLevel(pts) {
    return LEVELS.slice().reverse().find(l => pts >= l.minPts) || LEVELS[0];
  },
  getNextLevel(pts) {
    return LEVELS.find(l => l.minPts > pts) || null;
  },
  calcProgress(pts) {
    const cur = this.getLevel(pts), next = this.getNextLevel(pts);
    if (!next) return 100;
    return Math.min(100, Math.round(((pts - cur.minPts) / (next.minPts - cur.minPts)) * 100));
  },
  getAvatarSVG(pts, selectedAvatar) {
    if (selectedAvatar !== undefined && selectedAvatar !== null) {
      return LEVEL_AVATARS[selectedAvatar] || LEVEL_AVATARS[0];
    }
    const lv = this.getLevel(pts);
    return LEVEL_AVATARS[lv.level - 1] || LEVEL_AVATARS[0];
  },
  getAllPrizeLevels() { return LEVELS.filter(l => l.prize); },
  addPoints(userEmail, reason) {
    const users = Store.getUsers();
    if (!users[userEmail]) return 0;
    const pts = POINT_RULES[reason] || 0;
    users[userEmail].points = (users[userEmail].points || 0) + pts;
    Store.saveUsers(users);
    const sess = Store.getSession();
    if (sess && sess.email === userEmail) {
      sess.points = users[userEmail].points;
      Store.saveSession(sess);
    }
    return pts;
  }
};
