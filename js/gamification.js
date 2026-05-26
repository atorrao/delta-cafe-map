/* ═══════════════════════════════════════════════════
   GAMIFICATION — Níveis, prémios, avatares temáticos
   ═══════════════════════════════════════════════════ */

// 9 coffee SVG avatars — flat style, #f0ebe4 body, #564130 outline, #ec7e1c accent
const LEVEL_AVATARS = [

  // 1 — Espresso cup + saucer (row 1, col 1)
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="19" cy="28" rx="11" ry="2.5" fill="#f0ebe4" stroke="#564130" stroke-width="1.3"/>' +
    '<rect x="11" y="19" width="16" height="10" rx="3" fill="#f0ebe4" stroke="#564130" stroke-width="1.3"/>' +
    '<path d="M27 21.5 Q32 21.5 32 24.5 Q32 27.5 27 27.5" fill="none" stroke="#564130" stroke-width="1.3" stroke-linecap="round"/>' +
    '<path d="M16 17.5 Q16.5 15.5 16 14" fill="none" stroke="#564130" stroke-width="1.2" stroke-linecap="round"/>' +
    '<path d="M20.5 16.5 Q21 14.5 20.5 13" fill="none" stroke="#564130" stroke-width="1.2" stroke-linecap="round"/>' +
  '</svg>',

  // 2 — Tea cup with teabag (row 1, col 2)
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="19" cy="28" rx="11" ry="2.5" fill="#f0ebe4" stroke="#564130" stroke-width="1.3"/>' +
    '<rect x="11" y="19" width="16" height="10" rx="3" fill="#f0ebe4" stroke="#564130" stroke-width="1.3"/>' +
    '<path d="M27 21.5 Q32 21.5 32 24.5 Q32 27.5 27 27.5" fill="none" stroke="#564130" stroke-width="1.3" stroke-linecap="round"/>' +
    '<line x1="20" y1="15" x2="20" y2="22" stroke="#564130" stroke-width="1.1"/>' +
    '<rect x="17" y="11" width="6" height="5" rx="1.2" fill="#ec7e1c" stroke="#564130" stroke-width="1"/>' +
    '<line x1="23" y1="12" x2="25" y2="10" stroke="#564130" stroke-width="1" stroke-linecap="round"/>' +
  '</svg>',

  // 3 — Tall mug no saucer (row 1, col 3)
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="9" y="13" width="20" height="20" rx="3.5" fill="#f0ebe4" stroke="#564130" stroke-width="1.3"/>' +
    '<path d="M29 16 Q36 16 36 23 Q36 30 29 30" fill="none" stroke="#564130" stroke-width="1.5" stroke-linecap="round"/>' +
    '<path d="M16 11 Q16.6 9 16 7" fill="none" stroke="#564130" stroke-width="1.2" stroke-linecap="round"/>' +
    '<path d="M21 10 Q21.6 8 21 6" fill="none" stroke="#564130" stroke-width="1.2" stroke-linecap="round"/>' +
  '</svg>',

  // 4 — Takeaway orange cup (row 2, col 1)
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M13.5 16.5 L11.5 34 Q11.5 36 20 36 Q28.5 36 28.5 34 L26.5 16.5 Z" fill="#ec7e1c" stroke="#564130" stroke-width="1.3" stroke-linejoin="round"/>' +
    '<rect x="12.5" y="12" width="15" height="5.5" rx="2.8" fill="#f0ebe4" stroke="#564130" stroke-width="1.3"/>' +
    '<rect x="14.5" y="12" width="11" height="2.5" rx="1.2" fill="#564130" opacity="0.18"/>' +
    '<path d="M15 23 Q20 25 25 23" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.3" stroke-linecap="round"/>' +
  '</svg>',

  // 5 — Steaming angled mug (row 2, col 2)
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="8" y="16" width="22" height="18" rx="3.5" fill="#f0ebe4" stroke="#564130" stroke-width="1.3"/>' +
    '<path d="M30 19 Q37 19 37 25 Q37 31 30 31" fill="none" stroke="#564130" stroke-width="1.5" stroke-linecap="round"/>' +
    '<path d="M15 14 Q15.6 12 15 10" fill="none" stroke="#564130" stroke-width="1.2" stroke-linecap="round"/>' +
    '<path d="M19.5 13 Q20.1 11 19.5 9" fill="none" stroke="#564130" stroke-width="1.2" stroke-linecap="round"/>' +
    '<path d="M24 14 Q24.6 12 24 10" fill="none" stroke="#564130" stroke-width="1.2" stroke-linecap="round"/>' +
  '</svg>',

  // 6 — Coffee beans (row 3, col 1)
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="16" cy="24" rx="8" ry="11" fill="#8B5E3C" stroke="#564130" stroke-width="1.3" transform="rotate(-28 16 24)"/>' +
    '<path d="M12 17 Q16 24 12 31" fill="none" stroke="#564130" stroke-width="1.3" stroke-linecap="round" transform="rotate(-28 16 24)"/>' +
    '<ellipse cx="26" cy="20" rx="7" ry="10" fill="#a07040" stroke="#564130" stroke-width="1.3" transform="rotate(18 26 20)"/>' +
    '<path d="M22.5 14 Q26 20 22.5 26" fill="none" stroke="#564130" stroke-width="1.3" stroke-linecap="round" transform="rotate(18 26 20)"/>' +
  '</svg>',

  // 7 — Kettle with orange handle + spout curl (row 4, col 1)
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="20" cy="26" rx="13" ry="9.5" fill="#f0ebe4" stroke="#564130" stroke-width="1.3"/>' +
    '<rect x="18" y="13" width="4" height="4.5" rx="1" fill="#564130"/>' +
    '<ellipse cx="20" cy="17" rx="5" ry="1.5" fill="#f0ebe4" stroke="#564130" stroke-width="1.2"/>' +
    '<path d="M7 24 Q4 18 7 14 Q10 11 13 13" fill="none" stroke="#564130" stroke-width="1.3" stroke-linecap="round"/>' +
    '<path d="M33 22 Q38 19 37 26" fill="none" stroke="#ec7e1c" stroke-width="2" stroke-linecap="round"/>' +
  '</svg>',

  // 8 — Moka pot (row 4, col 2)
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M14 22 L12.5 34 Q12.5 36 20 36 Q27.5 36 27.5 34 L26 22 Z" fill="#f0ebe4" stroke="#564130" stroke-width="1.3" stroke-linejoin="round"/>' +
    '<path d="M13.5 22 Q10 17 12 11.5 Q14 8 20 8 Q26 8 28 11.5 Q30 17 26.5 22 Z" fill="#f0ebe4" stroke="#564130" stroke-width="1.3" stroke-linejoin="round"/>' +
    '<rect x="17.5" y="5" width="5" height="4" rx="1.5" fill="#564130"/>' +
    '<line x1="13.5" y1="22" x2="26.5" y2="22" stroke="#564130" stroke-width="1.3"/>' +
    '<rect x="14" y="27" width="12" height="2" rx="1" fill="#ec7e1c" opacity="0.8"/>' +
  '</svg>',

  // 9 — Glass coffee jug with dark coffee + orange handle (row 4, col 3)
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M11 13 L10 35 Q10 37 20 37 Q30 37 30 35 L29 13 Z" fill="#f0ebe4" stroke="#564130" stroke-width="1.3" stroke-linejoin="round"/>' +
    '<path d="M11 26 L10 35 Q10 37 20 37 Q30 37 30 35 L29 26 Z" fill="#564130" opacity="0.8"/>' +
    '<rect x="10" y="11" width="20" height="4" rx="2" fill="#f0ebe4" stroke="#564130" stroke-width="1.3"/>' +
    '<path d="M30 14 Q38 16 38 23 Q38 30 30 30" fill="none" stroke="#ec7e1c" stroke-width="2.2" stroke-linecap="round"/>' +
    '<path d="M13.5 11 Q11 8 13 6" fill="none" stroke="#564130" stroke-width="1.2" stroke-linecap="round"/>' +
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
  { level:4, name:'Especialista', minPts:300,  maxPts:799,
    color:'#c0571e', bg:'#fdf0ea', fg:'#7a2e0a', barColor:'#d4622a',
    description:'A tua contribuição tem impacto real.',
    prize:{ name:'Máquina Delta Q Compact', desc:'Uma máquina Delta Q Compact completamente gratuita', code:'DELTA-SPECIALIST' } },
  { level:5, name:'Embaixador',  minPts:800,  maxPts:1499,
    color:'#9b2335', bg:'#faeaec', fg:'#5c1020', barColor:'#b02a3e',
    description:'És uma referência da comunidade Delta Map.',
    prize:{ name:'Visita VIP Campo Maior', desc:'Visita exclusiva à fábrica com tour guiado, almoço e brunch', code:'DELTA-AMBASSADOR' } },
  { level:6, name:'Mestre',      minPts:1500, maxPts:2499,
    color:'#7a4a1e', bg:'#fdf5e6', fg:'#4a2a0a', barColor:'#9b6030',
    description:'O teu conhecimento é inigualável.',
    prize:{ name:'Kit Barista Delta', desc:'Kit completo de barista com acessórios premium Delta', code:'DELTA-MASTER' } },
  { level:7, name:'Especialista Sénior', minPts:2500, maxPts:3999,
    color:'#2e5e8a', bg:'#eaf2fa', fg:'#1a3a5a', barColor:'#3a7ab0',
    description:'Referência internacional do café Delta.',
    prize:{ name:'Experiência Delta Exclusiva', desc:'Experiência VIP exclusiva nas instalações Delta', code:'DELTA-SENIOR' } },
  { level:8, name:'Campeão',     minPts:4000, maxPts:6999,
    color:'#6b3a9a', bg:'#f5eafc', fg:'#3a1a5c', barColor:'#8a52b8',
    description:'Um campeão reconhecido pela comunidade Delta.',
    prize:{ name:'Subscrição Anual Premium', desc:'Cápsulas Delta Q ilimitadas durante 1 ano + kit exclusivo', code:'DELTA-CHAMPION' } },
  { level:9, name:'Lenda Delta', minPts:7000, maxPts:Infinity,
    color:'#1a0a00', bg:'#f5eed8', fg:'#1a0a00', barColor:'#c47f2e',
    description:'O nível mais alto. O Delta reconhece a tua dedicação.',
    prize:{ name:'Lenda Vitalícia', desc:'Acesso vitalício a todos os benefícios Delta + nomeação oficial', code:'DELTA-LEGEND' } },
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
