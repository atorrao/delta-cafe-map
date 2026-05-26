/* ═══════════════════════════════════════════════════
   GAMIFICATION — Níveis, prémios, avatares temáticos
   ═══════════════════════════════════════════════════ */

// 9 coffee SVG avatars — precise faithful recreation
const LEVEL_AVATARS = [

  // 1 — Tall rectangular mug, grey, right handle, shadow strip, one steam
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="9" y="15" width="20" height="19" rx="1.5" fill="#e6e0da" stroke="#6b3028" stroke-width="1.6"/>' +
    '<rect x="26" y="15" width="3" height="19" rx="0" fill="#d0c9c2" stroke="none"/>' +
    '<line x1="26" y1="15" x2="26" y2="34" stroke="#6b3028" stroke-width="1"/>' +
    '<path d="M29 20 Q34 20 34 24.5 Q34 29 29 29" fill="none" stroke="#6b3028" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M18 12.5 Q19 10.5 18 9" fill="none" stroke="#6b3028" stroke-width="1.3" stroke-linecap="round"/>' +
  '</svg>',

  // 2 — Espresso cup + saucer, light grey, right handle, one steam
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="19.5" cy="30" rx="12" ry="2" fill="#e6e0da" stroke="#6b3028" stroke-width="1.4"/>' +
    '<path d="M11 21.5 Q10 27 19.5 27 Q29 27 28 21.5 Z" fill="#e6e0da" stroke="#6b3028" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<rect x="11" y="17.5" width="17" height="4.5" rx="2.2" fill="#e6e0da" stroke="#6b3028" stroke-width="1.4"/>' +
    '<path d="M28 18.5 Q32 18.5 32 21 Q32 23.5 28 23.5" fill="none" stroke="#6b3028" stroke-width="1.4" stroke-linecap="round"/>' +
    '<path d="M18 15 Q18.8 13 18 11.5" fill="none" stroke="#6b3028" stroke-width="1.2" stroke-linecap="round"/>' +
  '</svg>',

  // 3 — Dark tea cup + saucer + teabag (orange) + steam
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

  // 4 — Two coffee beans, warm brown, overlapping, centre crease each
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="18" cy="23" rx="7.5" ry="10" fill="#c87838" stroke="#6b3028" stroke-width="1.5" transform="rotate(-35 18 23)"/>' +
    '<path d="M14 17.5 Q18 23 14 28.5" fill="none" stroke="#6b3028" stroke-width="1.4" stroke-linecap="round" transform="rotate(-35 18 23)"/>' +
    '<ellipse cx="24" cy="21" rx="7" ry="9.5" fill="#b86828" stroke="#6b3028" stroke-width="1.5" transform="rotate(20 24 21)"/>' +
    '<path d="M20.5 15.5 Q24 21 20.5 26.5" fill="none" stroke="#6b3028" stroke-width="1.4" stroke-linecap="round" transform="rotate(20 24 21)"/>' +
  '</svg>',

  // 5 — Takeaway: orange cylinder, grey bottom band, double grey lid with slit
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M14.5 16.5 L13.5 34 Q13.5 36 20 36 Q26.5 36 26.5 34 L25.5 16.5 Z" fill="#ec7e1c" stroke="#6b3028" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<path d="M13.8 29.5 L13.5 34 Q13.5 36 20 36 Q26.5 36 26.5 34 L26.2 29.5 Z" fill="#d0c9c2" stroke="none"/>' +
    '<line x1="13.8" y1="29.5" x2="26.2" y2="29.5" stroke="#6b3028" stroke-width="1.3"/>' +
    '<rect x="13" y="12.5" width="14" height="4.5" rx="0.5" fill="#e6e0da" stroke="#6b3028" stroke-width="1.4"/>' +
    '<rect x="14" y="9.5" width="12" height="3.5" rx="1.8" fill="#e6e0da" stroke="#6b3028" stroke-width="1.3"/>' +
    '<line x1="16.5" y1="11.2" x2="23.5" y2="11.2" stroke="#6b3028" stroke-width="0.9" opacity="0.6"/>' +
  '</svg>',

  // 6 — Trapezoid mug: wider top, narrower base, right shadow, handle, one steam
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M9.5 15 L11.5 32 Q12 34 20 34 Q28 34 28.5 32 L30.5 15 Z" fill="#e6e0da" stroke="#6b3028" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<path d="M26.5 15.5 L28 31.5 Q28.3 33.5 28.5 32 L30.5 15 Z" fill="#d0c9c2" stroke="none"/>' +
    '<line x1="26.5" y1="15.5" x2="28" y2="32" stroke="#6b3028" stroke-width="0.9" opacity="0.6"/>' +
    '<path d="M28.5 20 Q34 20 34 25 Q34 30 28.5 30" fill="none" stroke="#6b3028" stroke-width="1.5" stroke-linecap="round"/>' +
    '<path d="M19 12 Q20 10 19 8.5" fill="none" stroke="#6b3028" stroke-width="1.3" stroke-linecap="round"/>' +
  '</svg>',

  // 7 — Round kettle: big dome, thin curved spout left, orange C-handle right, brown knob
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M7 27 Q7 13 20 13 Q33 13 33 27 Q33 35 20 35 Q7 35 7 27 Z" fill="#e6e0da" stroke="#6b3028" stroke-width="1.5"/>' +
    '<path d="M28 14 Q33 18 33 27 Q33 32 28.5 34.5" fill="none" stroke="#d0c9c2" stroke-width="5" stroke-linecap="round" opacity="0.55"/>' +
    '<rect x="15" y="10.5" width="10" height="3.5" rx="1.8" fill="#e6e0da" stroke="#6b3028" stroke-width="1.3"/>' +
    '<rect x="18.5" y="7.5" width="3" height="3.5" rx="1" fill="#8b5a28" stroke="#6b3028" stroke-width="1"/>' +
    '<path d="M7 24 Q3.5 23 3.5 20 Q3.5 17 6.5 17" fill="none" stroke="#6b3028" stroke-width="1.5" stroke-linecap="round"/>' +
    '<path d="M33 21 Q39 21 39 27 Q39 33 33 33" fill="none" stroke="#ec7e1c" stroke-width="2.5" stroke-linecap="round"/>' +
  '</svg>',

  // 8 — Moka pot: narrow upper trapezoid, wider lower with 6 ribs, small brown handle, brown knob
  '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M16 21 L17 12 Q17.5 9 20 9 Q22.5 9 23 12 L24 21 Z" fill="#e6e0da" stroke="#6b3028" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<rect x="18.5" y="6.5" width="3" height="3" rx="1" fill="#8b5a28" stroke="#6b3028" stroke-width="1"/>' +
    '<line x1="15" y1="21" x2="25" y2="21" stroke="#6b3028" stroke-width="1.5"/>' +
    '<path d="M15 21 L14 37 Q14 38.5 20 38.5 Q26 38.5 26 37 L25 21 Z" fill="#e6e0da" stroke="#6b3028" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<line x1="16.5" y1="22" x2="16" y2="37" stroke="#6b3028" stroke-width="1" opacity="0.5"/>' +
    '<line x1="17.8" y1="21.5" x2="17.5" y2="37.5" stroke="#6b3028" stroke-width="1" opacity="0.5"/>' +
    '<line x1="19.2" y1="21.5" x2="19.2" y2="38" stroke="#6b3028" stroke-width="1" opacity="0.5"/>' +
    '<line x1="20.8" y1="21.5" x2="20.8" y2="38" stroke="#6b3028" stroke-width="1" opacity="0.5"/>' +
    '<line x1="22.2" y1="21.5" x2="22.5" y2="37.5" stroke="#6b3028" stroke-width="1" opacity="0.5"/>' +
    '<line x1="23.5" y1="22" x2="24" y2="37" stroke="#6b3028" stroke-width="1" opacity="0.5"/>' +
    '<path d="M25 24 Q29 24 29 28.5 Q29 33 25 33" fill="none" stroke="#8b5a28" stroke-width="2" stroke-linecap="round"/>' +
  '</svg>',

  // 9 — Round carafe: oval body, dark coffee bottom half, orange collar+spout, large orange handle right, grey shadow left
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

const LEVELS = [const LEVELS = [
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
