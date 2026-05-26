/* ═══════════════════════════════════════════════════
   GAMIFICATION — Níveis, prémios, avatares temáticos
   ═══════════════════════════════════════════════════ */

// 6 coffee SVG avatars (removed 5, 6, 8)
const LEVEL_AVATARS = [

  // 1 — Tall rectangular mug
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="9" y="15" width="20" height="19" rx="1.5" fill="#e6e0da" stroke="#6b3028" stroke-width="1.6"/>' +
    '<rect x="26" y="15" width="3" height="19" rx="0" fill="#d0c9c2" stroke="none"/>' +
    '<line x1="26" y1="15" x2="26" y2="34" stroke="#6b3028" stroke-width="1"/>' +
    '<path d="M29 20 Q34 20 34 24.5 Q34 29 29 29" fill="none" stroke="#6b3028" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M18 12.5 Q19 10.5 18 9" fill="none" stroke="#6b3028" stroke-width="1.3" stroke-linecap="round"/>' +
  '</svg>',

  // 2 — Espresso cup + saucer
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="19.5" cy="30" rx="12" ry="2" fill="#e6e0da" stroke="#6b3028" stroke-width="1.4"/>' +
    '<path d="M11 21.5 Q10 27 19.5 27 Q29 27 28 21.5 Z" fill="#e6e0da" stroke="#6b3028" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<rect x="11" y="17.5" width="17" height="4.5" rx="2.2" fill="#e6e0da" stroke="#6b3028" stroke-width="1.4"/>' +
    '<path d="M28 18.5 Q32 18.5 32 21 Q32 23.5 28 23.5" fill="none" stroke="#6b3028" stroke-width="1.4" stroke-linecap="round"/>' +
    '<path d="M18 15 Q18.8 13 18 11.5" fill="none" stroke="#6b3028" stroke-width="1.2" stroke-linecap="round"/>' +
  '</svg>',

  // 3 — Dark tea cup + saucer + teabag
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="19.5" cy="30" rx="12" ry="2" fill="#e6e0da" stroke="#6b3028" stroke-width="1.4"/>' +
    '<path d="M11 21.5 Q10 27 19.5 27 Q29 27 28 21.5 Z" fill="#4a2818" stroke="#6b3028" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<rect x="11" y="17.5" width="17" height="4.5" rx="2.2" fill="#4a2818" stroke="#6b3028" stroke-width="1.4"/>' +
    '<path d="M28 18.5 Q32 18.5 32 21 Q32 23.5 28 23.5" fill="none" stroke="#6b3028" stroke-width="1.4" stroke-linecap="round"/>' +
    '<line x1="20.5" y1="13.5" x2="19.5" y2="20" stroke="#6b3028" stroke-width="1.2"/>' +
    '<rect x="18" y="10" width="5" height="4" rx="1" fill="#ec7e1c" stroke="#6b3028" stroke-width="1"/>' +
    '<line x1="23" y1="11" x2="25" y2="9" stroke="#6b3028" stroke-width="1.1" stroke-linecap="round"/>' +
    '<path d="M16.5 15 Q17.2 13 16.5 11.5" fill="none" stroke="#6b3028" stroke-width="1.2" stroke-linecap="round"/>' +
  '</svg>',

  // 4 — Two coffee beans
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="18" cy="23" rx="7.5" ry="10" fill="#c87838" stroke="#6b3028" stroke-width="1.5" transform="rotate(-35 18 23)"/>' +
    '<path d="M14 17.5 Q18 23 14 28.5" fill="none" stroke="#6b3028" stroke-width="1.4" stroke-linecap="round" transform="rotate(-35 18 23)"/>' +
    '<ellipse cx="24" cy="21" rx="7" ry="9.5" fill="#b86828" stroke="#6b3028" stroke-width="1.5" transform="rotate(20 24 21)"/>' +
    '<path d="M20.5 15.5 Q24 21 20.5 26.5" fill="none" stroke="#6b3028" stroke-width="1.4" stroke-linecap="round" transform="rotate(20 24 21)"/>' +
  '</svg>',

  // 5 — Round kettle (was #7)
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M7 27 Q7 13 20 13 Q33 13 33 27 Q33 35 20 35 Q7 35 7 27 Z" fill="#e6e0da" stroke="#6b3028" stroke-width="1.5"/>' +
    '<path d="M28 14 Q33 18 33 27 Q33 32 28.5 34.5" fill="none" stroke="#d0c9c2" stroke-width="5" stroke-linecap="round" opacity="0.55"/>' +
    '<rect x="15" y="10.5" width="10" height="3.5" rx="1.8" fill="#e6e0da" stroke="#6b3028" stroke-width="1.3"/>' +
    '<rect x="18.5" y="7.5" width="3" height="3.5" rx="1" fill="#8b5a28" stroke="#6b3028" stroke-width="1"/>' +
    '<path d="M7 24 Q3.5 23 3.5 20 Q3.5 17 6.5 17" fill="none" stroke="#6b3028" stroke-width="1.5" stroke-linecap="round"/>' +
    '<path d="M33 21 Q39 21 39 27 Q39 33 33 33" fill="none" stroke="#ec7e1c" stroke-width="2.5" stroke-linecap="round"/>' +
  '</svg>',

  // 6 — Round coffee carafe (was #9)
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="19" cy="27" rx="12" ry="12" fill="#e6e0da" stroke="#6b3028" stroke-width="1.5"/>' +
    '<path d="M10 20 Q7 24 7.5 30" fill="none" stroke="#d0c9c2" stroke-width="5" stroke-linecap="round" opacity="0.6"/>' +
    '<path d="M7.1 29 Q7.5 39 19 39 Q30.5 39 30.9 29 Z" fill="#4a2818" stroke="none"/>' +
    '<line x1="7.1" y1="29" x2="30.9" y2="29" stroke="#6b3028" stroke-width="1.2"/>' +
    '<rect x="14" y="14" width="10" height="2.5" rx="1.2" fill="#ec7e1c" stroke="#6b3028" stroke-width="1.2"/>' +
    '<path d="M15 14 Q12 12.5 13 10.5" fill="none" stroke="#6b3028" stroke-width="1.3" stroke-linecap="round"/>' +
    '<path d="M31 19 Q38 19 38 27 Q38 35 31 35" fill="none" stroke="#ec7e1c" stroke-width="2.8" stroke-linecap="round"/>' +
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
  { level:4, name:'Especialista', minPts:300,  maxPts:999,
    color:'#c0571e', bg:'#fdf0ea', fg:'#7a2e0a', barColor:'#d4622a',
    description:'A tua contribuição tem impacto real.',
    prize:{ name:'Máquina Delta Q Compact', desc:'Uma máquina Delta Q Compact completamente gratuita', code:'DELTA-SPECIALIST' } },
  { level:5, name:'Embaixador',  minPts:1000, maxPts:2499,
    color:'#9b2335', bg:'#faeaec', fg:'#5c1020', barColor:'#b02a3e',
    description:'És uma referência da comunidade Delta Map.',
    prize:{ name:'Visita VIP Campo Maior', desc:'Visita exclusiva à fábrica com tour guiado, almoço e brunch', code:'DELTA-AMBASSADOR' } },
  { level:6, name:'Lenda Delta', minPts:2500, maxPts:Infinity,
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
