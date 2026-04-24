/* ═══════════════════════════════════════════════════
   DB — Supabase REST API wrapper
   Substitui localStorage para dados persistentes
   ═══════════════════════════════════════════════════ */

const SB_URL = 'https://kdvgcbbmcmlvtwenzicc.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkdmdjYmJtY21sdnR3ZW56aWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNDA4MzIsImV4cCI6MjA5MjYxNjgzMn0.TmU2M0GfBPr6YEo0lCezSf0Lr_sI-uW8dMXmGPMc8Hs';

const DB = {

  _headers() {
    return {
      'Content-Type': 'application/json',
      'apikey': SB_KEY,
      'Authorization': 'Bearer ' + SB_KEY,
      'Prefer': 'return=representation'
    };
  },

  async _get(table, params) {
    const qs = params ? '?' + params : '';
    const r = await fetch(SB_URL + '/rest/v1/' + table + qs, {
      headers: this._headers()
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },

  async _post(table, body) {
    const r = await fetch(SB_URL + '/rest/v1/' + table, {
      method: 'POST', headers: this._headers(),
      body: JSON.stringify(body)
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },

  async _patch(table, filter, body) {
    const r = await fetch(SB_URL + '/rest/v1/' + table + '?' + filter, {
      method: 'PATCH', headers: this._headers(),
      body: JSON.stringify(body)
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },

  async _delete(table, filter) {
    const r = await fetch(SB_URL + '/rest/v1/' + table + '?' + filter, {
      method: 'DELETE', headers: this._headers()
    });
    if (!r.ok) throw new Error(await r.text());
    return true;
  },

  /* ── USERS ── */
  async getUser(email) {
    const rows = await this._get('users', 'email=eq.' + encodeURIComponent(email) + '&limit=1');
    return rows[0] || null;
  },

  async getAllUsers() {
    return this._get('users', 'order=joined.desc');
  },

  async createUser(user) {
    return this._post('users', user);
  },

  async updateUser(email, data) {
    return this._patch('users', 'email=eq.' + encodeURIComponent(email), data);
  },

  /* ── LOCATIONS ── */
  async getAllLocations() {
    return this._get('locations', 'order=created_at.desc');
  },

  async createLocation(loc) {
    return this._post('locations', loc);
  },

  async updateLocation(id, data) {
    return this._patch('locations', 'id=eq.' + encodeURIComponent(id), data);
  },

  async deleteLocation(id) {
    return this._delete('locations', 'id=eq.' + encodeURIComponent(id));
  },

  /* ── SESSION (still localStorage — just token) ── */
  getSession()   { try { return JSON.parse(localStorage.getItem('dcm_session') || 'null'); } catch { return null; } },
  saveSession(s) { try { localStorage.setItem('dcm_session', JSON.stringify(s)); } catch {} },
  clearSession() { try { localStorage.removeItem('dcm_session'); } catch {} }
};
