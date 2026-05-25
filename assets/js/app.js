/* Shared helpers for the Pokédex catalog pages */

/* ---- Inline SVG icons ---- */
const POKEBALL_SVG = '<svg class="pokeball" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="#fff" stroke="#20232A" stroke-width="3"/><path d="M2.3 22a22 22 0 0 1 43.4 0H32a8 8 0 0 0-16 0H2.3Z" fill="#E3350D" stroke="#20232A" stroke-width="3" stroke-linejoin="round"/><circle cx="24" cy="24" r="7" fill="#fff" stroke="#20232A" stroke-width="3"/></svg>';
const GEM_SVG = '<svg class="shard-gem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 3h12l4 6-10 12L2 9l4-6Z" fill="#FFC83D" stroke="#9E1B07" stroke-width="1.5" stroke-linejoin="round"/><path d="m2 9h20M9 3 6 9l6 12M15 3l3 6-6 12" stroke="#9E1B07" stroke-width="1.2" stroke-linejoin="round" opacity=".7"/></svg>';

/* ---- Tier color helper (by star level) ---- */
const STAR_TIER = { '10': 'var(--t10)', '4': 'var(--t4)', '3': 'var(--t3)', '2': 'var(--t2)' };
function starColor(star) { return STAR_TIER[star] || 'var(--ink-3)'; }

const QUALITY_VAR = { '1':'--q1','2':'--q2','3':'--q3','4':'--q4','5':'--q5','6':'--q6','7':'--q7' };
function qualityColor(q) { return `var(${QUALITY_VAR[q] || '--q1'})`; }

/* ---- Utilities ---- */
function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function debounce(fn, ms) {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

/* ---- Toast + clipboard ---- */
let _toastTimer;
function ensureToast() {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  return el;
}
function showToast(html) {
  const el = ensureToast();
  el.innerHTML = html;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 1900);
}
async function copyGift(code, label) {
  try {
    await navigator.clipboard.writeText(code);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = code; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch {}
    ta.remove();
  }
  showToast(`✅ Copiado ${label ? '<b>' + escapeHtml(label) + '</b> ' : ''}<code>${escapeHtml(code)}</code>`);
}

/* clean Pokémon list (drop the Chinese header row) */
function pokemonDex() {
  return (typeof POKEMONS !== 'undefined' ? POKEMONS : []).filter(p => p.name_en && p.name_en !== '名字');
}
