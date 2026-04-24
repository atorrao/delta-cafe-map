/* ═══════════════════════════════════════════════════
   GAMIFICATION — Níveis, prémios, avatares temáticos
   ═══════════════════════════════════════════════════ */

// Coffee-themed SVG avatars, one per level
// All 40x40 viewBox, progressively more detailed/premium
const LEVEL_AVATARS = [

  // Nível 1 — Grão de café simples
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="20" cy="20" r="19" fill="#e8e2da" stroke="#b0a090" stroke-width="1.5"/>' +
    '<ellipse cx="20" cy="20" rx="10" ry="14" fill="#8B6347" opacity="0.9"/>' +
    '<path d="M20 8 Q20 20 20 32" fill="none" stroke="#6b4a2a" stroke-width="1.5" stroke-linecap="round"/>' +
    '<ellipse cx="20" cy="20" rx="10" ry="14" fill="none" stroke="#6b4a2a" stroke-width="1"/>' +
  '</svg>',

  // Nível 2 — Chávena de café
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="20" cy="20" r="19" fill="#e8f4ef" stroke="#2e7d5e" stroke-width="1.5"/>' +
    '<rect x="10" y="17" width="16" height="11" rx="2.5" fill="#2e7d5e" opacity="0.9"/>' +
    '<path d="M26 19 Q31 19 31 22 Q31 25 26 25" fill="none" stroke="#2e7d5e" stroke-width="2" stroke-linecap="round"/>' +
    '<line x1="9" y1="28.5" x2="27" y2="28.5" stroke="#2e7d5e" stroke-width="1.2" opacity="0.5"/>' +
    '<path d="M15 15 Q15.7 12.5 15 10.5" fill="none" stroke="#2e7d5e" stroke-width="1.3" stroke-linecap="round" opacity="0.7"/>' +
    '<path d="M20 14.5 Q20.7 12 20 10" fill="none" stroke="#2e7d5e" stroke-width="1.3" stroke-linecap="round" opacity="0.7"/>' +
  '</svg>',

  // Nível 3 — Cápsula Delta Q
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="20" cy="20" r="19" fill="#fdf5e6" stroke="#b07d2e" stroke-width="1.5"/>' +
    '<ellipse cx="20" cy="22" rx="9" ry="12" fill="#b07d2e" opacity="0.9"/>' +
    '<rect x="16.5" y="9" width="7" height="4" rx="2" fill="#b07d2e" opacity="0.9"/>' +
    '<ellipse cx="17" cy="19" rx="3" ry="5" fill="rgba(255,255,255,0.15)"/>' +
    '<path d="M13 31.5 Q20 35 27 31.5" fill="#b07d2e" opacity="0.5"/>' +
    '<circle cx="30" cy="11" r="4" fill="#e8c46a" opacity="0.8"/>' +
    '<path d="M29 11 L30 9.5 L31 11 L30 12.5Z" fill="#fff" opacity="0.8"/>' +
  '</svg>',

  // Nível 4 — Máquina de café espresso
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="20" cy="20" r="19" fill="#fdf0ea" stroke="#c0571e" stroke-width="1.5"/>' +
    '<rect x="9" y="13" width="22" height="16" rx="3" fill="#c0571e" opacity="0.9"/>' +
    '<rect x="12" y="16" width="8" height="7" rx="1.5" fill="rgba(255,255,255,0.2)"/>' +
    '<circle cx="27" cy="19" r="3.5" fill="rgba(255,255,255,0.3)"/>' +
    '<circle cx="27" cy="19" r="1.8" fill="rgba(255,255,255,0.6)"/>' +
    '<rect x="17" y="28" width="6" height="4" rx="1" fill="#c0571e" opacity="0.7"/>' +
    '<rect x="16" y="31" width="8" height="1.5" rx=".5" fill="#c0571e" opacity="0.5"/>' +
    '<line x1="20" y1="28" x2="20" y2="32" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>' +
  '</svg>',

  // Nível 5 — Barista / latte art (folha em leite)
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="20" cy="20" r="19" fill="#faeaec" stroke="#9b2335" stroke-width="2"/>' +
    '<ellipse cx="20" cy="22" rx="12" ry="10" fill="#9b2335" opacity="0.15"/>' +
    '<ellipse cx="20" cy="22" rx="11" ry="9" fill="#fff" opacity="0.95"/>' +
    '<path d="M20 14 Q24 18 20 30 Q16 18 20 14Z" fill="#9b2335" opacity="0.35"/>' +
    '<path d="M14 20 Q17 17 20 14 Q23 17 26 20" fill="none" stroke="#9b2335" stroke-width="1.2" opacity="0.3"/>' +
    '<path d="M13 23 Q16.5 20 20 22 Q23.5 20 27 23" fill="none" stroke="#9b2335" stroke-width="1" opacity="0.25"/>' +
    '<rect x="9" y="30" width="22" height="3" rx="1.5" fill="#9b2335" opacity="0.5"/>' +
    '<path d="M30" fill="none"/>' +
  '</svg>',

  // Nível 6 — Coroa / troféu espresso (lenda)
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="20" cy="20" r="19" fill="#1a0a00" stroke="#C8A84B" stroke-width="2"/>' +
    '<path d="M9 27 L9 16 L14 22 L20 11 L26 22 L31 16 L31 27 Z" fill="#C8A84B" opacity="0.9"/>' +
    '<rect x="8" y="27" width="24" height="3.5" rx="1.5" fill="#C8A84B" opacity="0.8"/>' +
    '<circle cx="20" cy="11" r="2.5" fill="#E0C278"/>' +
    '<circle cx="9"  cy="16" r="2"   fill="#E0C278"/>' +
    '<circle cx="31" cy="16" r="2"   fill="#E0C278"/>' +
    '<ellipse cx="20" cy="20" rx="5" ry="4" fill="rgba(200,168,75,0.15)"/>' +
  '</svg>',
];

const LEVELS = [
  { level:1, name:'Descobridor', minPts:0,    maxPts:29,
    color:'#8c9aaa', bg:'#f0f3f6', fg:'#3d4f5c', barColor:'#8c9aaa',
    description:'Estás a dar os primeiros passos.', prize:null },
  { level:2, name:'Explorador',  minPts:30,   maxPts:99,
    color:'#2e7d5e', bg:'#eaf4ef', fg:'#1a4a38', barColor:'#2e7d5e',
    description:'Já contribuíste para a comunidade.',
    prize:{ name:'Desconto 10% Online', desc:'10% de desconto em qualquer compra na loja delta-cafes.pt', code:'DELTA-EXPLORER10' } },
  { level:3, name:'Conhecedor',  minPts:100,  maxPts:299,
    color:'#b07d2e', bg:'#fdf5e6', fg:'#6b4a0e', barColor:'#c49a3a',
    description:'O teu conhecimento do café Delta impressiona.',
    prize:{ name:'Pack Degustação Delta', desc:'Pack com 4 variedades de café Delta entregue em casa', code:'DELTA-DEGUSTATION' } },
  { level:4, name:'Especialista',minPts:300,  maxPts:799,
    color:'#c0571e', bg:'#fdf0ea', fg:'#7a2e0a', barColor:'#d4622a',
    description:'A tua contribuição tem impacto real.',
    prize:{ name:'Máquina Delta Q Compact', desc:'Uma máquina Delta Q Compact completamente gratuita', code:'DELTA-SPECIALIST' } },
  { level:5, name:'Embaixador',  minPts:800,  maxPts:1999,
    color:'#9b2335', bg:'#faeaec', fg:'#5c1020', barColor:'#b02a3e',
    description:'És uma referência da comunidade Delta Map.',
    prize:{ name:'Visita VIP Campo Maior', desc:'Visita exclusiva à fábrica com tour guiado, almoço e brunch', code:'DELTA-AMBASSADOR' } },
  { level:6, name:'Lenda Delta', minPts:2000, maxPts:Infinity,
    color:'#1a0a00', bg:'#f5eed8', fg:'#1a0a00', barColor:'#c47f2e',
    description:'O nível mais alto. O Delta reconhece a tua dedicação.',
    prize:{ name:'Subscrição Anual Ilimitada', desc:'Cápsulas Delta Q ilimitadas durante 1 ano + kit exclusivo de coleção', code:'DELTA-LEGEND' } },
];

const POINT_RULES = {
  ADD_LOCATION:   15,
  UPVOTE_RECEIVED: 8,
  UPVOTE_GIVEN:    1,
  VERIFIED:       30,
  FIRST_LOCATION: 40,
};

const Gamification = {
  getLevel(pts) { return LEVELS.slice().reverse().find(l => pts >= l.minPts) || LEVELS[0]; },
  getNextLevel(pts) { return LEVELS.find(l => l.minPts > pts) || null; },
  calcProgress(pts) {
    var cur = this.getLevel(pts), next = this.getNextLevel(pts);
    if (!next) return 100;
    return Math.min(100, Math.round(((pts - cur.minPts) / (next.minPts - cur.minPts)) * 100));
  },
  getAvatarSVG(pts, selectedAvatar) {
    var idx = (selectedAvatar !== undefined && selectedAvatar !== null)
      ? selectedAvatar
      : this.getLevel(pts).level - 1;
    return LEVEL_AVATARS[idx] || LEVEL_AVATARS[0];
  },
  getAllPrizeLevels() { return LEVELS.filter(l => l.prize); },
  addPoints(userEmail, reason) {
    var pts = POINT_RULES[reason] || 0;
    // Update session immediately for UI responsiveness
    var sess = DB.getSession();
    if (sess && sess.email === userEmail) {
      sess.points = (sess.points || 0) + pts;
      DB.saveSession(sess);
    }
    // Persist to Supabase asynchronously
    if (App.currentUser && App.currentUser.email === userEmail) {
      var newPts = (App.currentUser.points || 0) + pts;
      DB.updateUser(userEmail, { points: newPts }).catch(function(e){ console.warn('points update failed:', e); });
    }
    return pts;
  }
};
