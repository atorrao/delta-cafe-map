/* ═══════════════════════════════════════════════════
   GAMIFICATION — Níveis, prémios, avatares temáticos
   ═══════════════════════════════════════════════════ */

// Coffee-themed SVG avatars — inspired by flat coffee icon set
// All 40x40 viewBox, clean flat style with #ec7e1c amber accent
const LEVEL_AVATARS = [

  // Nível 1 — Chávena espresso com pires
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="9" y="20" width="18" height="11" rx="3" fill="#f0ebe4" stroke="#564130" stroke-width="1.4"/>' +
    '<path d="M27 22.5 Q32 22.5 32 25.5 Q32 28.5 27 28.5" fill="none" stroke="#564130" stroke-width="1.4" stroke-linecap="round"/>' +
    '<line x1="8" y1="31.5" x2="28" y2="31.5" stroke="#564130" stroke-width="1.4" stroke-linecap="round"/>' +
    '<path d="M16 18.5 Q16.6 16.5 16 14.5" fill="none" stroke="#564130" stroke-width="1.3" stroke-linecap="round"/>' +
    '<path d="M20 17.5 Q20.6 15.5 20 13.5" fill="none" stroke="#564130" stroke-width="1.3" stroke-linecap="round"/>' +
  '</svg>',

  // Nível 2 — Takeaway cup laranja
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M14 14 L12 33 Q12 35 20 35 Q28 35 28 33 L26 14 Z" fill="#ec7e1c"/>' +
    '<rect x="13" y="10" width="14" height="5" rx="2.5" fill="#f0ebe4" stroke="#564130" stroke-width="1.3"/>' +
    '<line x1="14.5" y1="14" x2="25.5" y2="14" stroke="#564130" stroke-width="1"/>' +
    '<rect x="15.5" y="10" width="9" height="2.5" rx="1.2" fill="#564130" opacity="0.15"/>' +
    '<path d="M15 20 Q20 22 25 20" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="1.2" stroke-linecap="round"/>' +
  '</svg>',

  // Nível 3 — Grãos de café
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="15" cy="22" rx="7" ry="10" fill="#8B5E3C" stroke="#564130" stroke-width="1.3" transform="rotate(-20 15 22)"/>' +
    '<path d="M11.5 16 Q15 22 11.5 28" fill="none" stroke="#564130" stroke-width="1.2" stroke-linecap="round" transform="rotate(-20 15 22)"/>' +
    '<ellipse cx="25" cy="21" rx="6.5" ry="9.5" fill="#a0713d" stroke="#564130" stroke-width="1.3" transform="rotate(15 25 21)"/>' +
    '<path d="M22 15.5 Q25 21 22 26.5" fill="none" stroke="#564130" stroke-width="1.2" stroke-linecap="round" transform="rotate(15 25 21)"/>' +
  '</svg>',

  // Nível 4 — Moka pot
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="13" y="20" width="14" height="13" rx="2" fill="#f0ebe4" stroke="#564130" stroke-width="1.4"/>' +
    '<path d="M14 20 Q10 16 12 12 Q14 9 20 9 Q26 9 28 12 Q30 16 26 20 Z" fill="#f0ebe4" stroke="#564130" stroke-width="1.4"/>' +
    '<rect x="18" y="6" width="4" height="4" rx="1" fill="#564130"/>' +
    '<line x1="13" y1="20" x2="27" y2="20" stroke="#564130" stroke-width="1.4"/>' +
    '<line x1="12.5" y1="28" x2="27.5" y2="28" stroke="#ec7e1c" stroke-width="1.5" stroke-linecap="round"/>' +
    '<path d="M15 24 Q20 26 25 24" fill="none" stroke="rgba(86,65,48,.2)" stroke-width="1"/>' +
  '</svg>',

  // Nível 5 — Caneca grande
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="9" y="18" width="19" height="16" rx="3" fill="#f0ebe4" stroke="#564130" stroke-width="1.4"/>' +
    '<path d="M28 20.5 Q34 20.5 34 25 Q34 29.5 28 29.5" fill="none" stroke="#564130" stroke-width="1.5" stroke-linecap="round"/>' +
    '<rect x="9" y="18" width="19" height="4" rx="3" fill="#ec7e1c" opacity="0.85"/>' +
    '<path d="M15 16 Q15.7 14 15 12" fill="none" stroke="#564130" stroke-width="1.3" stroke-linecap="round"/>' +
    '<path d="M20 15 Q20.7 13 20 11" fill="none" stroke="#564130" stroke-width="1.3" stroke-linecap="round"/>' +
    '<path d="M11 26 Q18 29 27 26" fill="none" stroke="rgba(86,65,48,.15)" stroke-width="1"/>' +
  '</svg>',

  // Nível 6 — French press (lenda)
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="12" y="12" width="16" height="22" rx="2" fill="#f0ebe4" stroke="#564130" stroke-width="1.4"/>' +
    '<rect x="12" y="28" width="16" height="6" rx="2" fill="#564130" opacity="0.85"/>' +
    '<line x1="14" y1="28" x2="26" y2="28" stroke="#564130" stroke-width="1.4"/>' +
    '<rect x="18" y="8" width="4" height="5" rx="1" fill="#ec7e1c"/>' +
    '<rect x="11" y="11" width="18" height="3" rx="1.5" fill="#ec7e1c" opacity="0.9"/>' +
    '<line x1="20" y1="13" x2="20" y2="28" stroke="#564130" stroke-width="1.3"/>' +
    '<rect x="16" y="19" width="8" height="1.5" rx=".75" fill="#564130" opacity="0.25"/>' +
    '<rect x="16" y="23" width="8" height="1.5" rx=".75" fill="#564130" opacity="0.25"/>' +
    '<path d="M10 12 Q8 18 10 26" fill="none" stroke="#ec7e1c" stroke-width="1.3" stroke-linecap="round"/>' +
    '<path d="M30 12 Q32 18 30 26" fill="none" stroke="#ec7e1c" stroke-width="1.3" stroke-linecap="round"/>' +
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
