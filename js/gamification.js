/* ═══════════════════════════════════════════════════
   GAMIFICATION — Níveis, prémios e pontuação
   ═══════════════════════════════════════════════════ */

const LEVELS = [
  {
    level: 1, name: "Curioso", emoji: "🌱",
    minPts: 0, maxPts: 49,
    color: "#7f8c8d",
    description: "Começaste a explorar o mundo do Delta!",
    prize: null
  },
  {
    level: 2, name: "Explorador", emoji: "🗺️",
    minPts: 50, maxPts: 149,
    color: "#27ae60",
    description: "Já tens o espírito de descoberta!",
    prize: {
      name: "Código de Desconto 10%",
      desc: "10% de desconto na loja online delta-cafes.pt",
      emoji: "🎟️",
      code: "DELTA-EXPLORER10"
    }
  },
  {
    level: 3, name: "Conhecedor", emoji: "☕",
    minPts: 150, maxPts: 349,
    color: "#e67e22",
    description: "O teu conhecimento do café Delta impressiona!",
    prize: {
      name: "Pack Delta Degustação",
      desc: "Pack com 4 variedades de café Delta enviado para casa",
      emoji: "🎁",
      code: "DELTA-DEGUSTATION"
    }
  },
  {
    level: 4, name: "Embaixador", emoji: "⭐",
    minPts: 350, maxPts: 699,
    color: "#c47f2e",
    description: "Ajudas a comunidade a encontrar o melhor café!",
    prize: {
      name: "Máquina Delta Q Compact",
      desc: "Uma máquina Delta Q Compact totalmente gratuita",
      emoji: "☕",
      code: "DELTA-AMBASSADOR"
    }
  },
  {
    level: 5, name: "Expert Delta", emoji: "🏆",
    minPts: 700, maxPts: 1199,
    color: "#c0392b",
    description: "Lenda viva do café Delta em Portugal e no Mundo!",
    prize: {
      name: "Experiência VIP Campo Maior",
      desc: "Visita exclusiva à fábrica com almoço, tour e brunch de café",
      emoji: "🌟",
      code: "DELTA-VIP-VISIT"
    }
  },
  {
    level: 6, name: "Lenda Delta", emoji: "🌟",
    minPts: 1200, maxPts: Infinity,
    color: "#8e44ad",
    description: "Atingiste o mais alto nível. O Delta agradece!",
    prize: {
      name: "Patrocínio Delta Anual",
      desc: "Subscrição anual ilimitada de cápsulas Delta Q + kit exclusivo",
      emoji: "💎",
      code: "DELTA-LEGEND"
    }
  }
];

const POINT_RULES = {
  ADD_LOCATION:    30,   // adicionar nova localização
  UPVOTE_RECEIVED: 5,    // receber upvote num local
  UPVOTE_GIVEN:    2,    // dar upvote
  VERIFIED:        20,   // local verificado pela equipa
  FIRST_LOCATION:  50,   // bónus pelo primeiro local
  CONSECUTIVE_DAY: 10,   // login em dias consecutivos
};

const Gamification = {

  getLevel(pts) {
    return LEVELS.slice().reverse().find(l => pts >= l.minPts) || LEVELS[0];
  },

  getNextLevel(pts) {
    return LEVELS.find(l => l.minPts > pts) || null;
  },

  calcProgress(pts) {
    const cur = this.getLevel(pts);
    const next = this.getNextLevel(pts);
    if (!next) return 100;
    const range = next.minPts - cur.minPts;
    const done = pts - cur.minPts;
    return Math.min(100, Math.round((done / range) * 100));
  },

  getUnlockedPrizes(pts) {
    return LEVELS.filter(l => pts >= l.minPts && l.prize);
  },

  getLockedPrizes(pts) {
    return LEVELS.filter(l => pts < l.minPts && l.prize);
  },

  addPoints(userEmail, reason, multiplier = 1) {
    const users = Store.getUsers();
    if (!users[userEmail]) return;
    const pts = (POINT_RULES[reason] || 0) * multiplier;
    users[userEmail].points = (users[userEmail].points || 0) + pts;
    Store.saveUsers(users);

    // Update session
    const sess = Store.getSession();
    if (sess && sess.email === userEmail) {
      sess.points = users[userEmail].points;
      Store.saveSession(sess);
    }
    return pts;
  },

  renderLevelBadge(pts, size = 'normal') {
    const lv = this.getLevel(pts);
    const small = size === 'small';
    return `<span style="display:inline-flex;align-items:center;gap:5px;background:linear-gradient(135deg,${lv.color}22,${lv.color}11);border:1px solid ${lv.color}44;color:${lv.color};padding:${small?'3px 8px':'5px 12px'};border-radius:20px;font-size:${small?'10px':'12px'};font-weight:700;">
      ${lv.emoji} ${lv.name}
    </span>`;
  },

  renderPrizeCard(prize, unlocked) {
    return `<div class="prize-card ${unlocked ? 'unlocked' : 'locked'}">
      ${!unlocked ? '<span class="prize-lock">🔒</span>' : ''}
      <div class="prize-emoji">${prize.emoji}</div>
      <div class="prize-name">${prize.name}</div>
      <div class="prize-desc">${unlocked ? prize.desc : '???'}</div>
      ${unlocked ? `<div style="margin-top:8px;font-size:10px;background:rgba(196,127,46,.15);color:#7a4010;padding:3px 8px;border-radius:6px;display:inline-block;">Código: <strong>${prize.code}</strong></div>` : ''}
    </div>`;
  }
};
