/* =========================================================================
   pt.js — tradução das descrições de item (inglês → português)
   Estratégia: 1) mapa exato dos templates mais comuns
               2) regras por padrão (regex) p/ textos parametrizados
               3) glossário palavra-a-palavra como fallback
   Mantém nomes próprios (Pokémon, itens) intactos.
   ========================================================================= */

/* naturezas (Pokémon) */
const NATURES = {
  hardy: 'Robusta', lonely: 'Solitária', brave: 'Corajosa', adamant: 'Determinada',
  naughty: 'Travessa', bold: 'Audaciosa', docile: 'Dócil', relaxed: 'Relaxada',
  impish: 'Brincalhona', lax: 'Preguiçosa', timid: 'Tímida', hasty: 'Apressada',
  serious: 'Séria', jolly: 'Alegre', naive: 'Ingênua', modest: 'Modesta',
  mild: 'Branda', quiet: 'Quieta', bashful: 'Envergonhada', rash: 'Impulsiva',
  calm: 'Calma', gentle: 'Gentil', sassy: 'Atrevida', careful: 'Cautelosa',
  quirky: 'Peculiar'
};

/* palavras recorrentes em nomes de gema/recurso (usadas dentro dos templates) */
const TOKEN = {
  'Legendary': 'Lendária', 'Marvel': 'Maravilhosa', 'Universal': 'Universal',
  'Purchase Coupons': 'Cupons de Compra', 'Universal Shards': 'Fragmentos Universais'
};
function tok(s) { return TOKEN[s.trim()] || s; }

/* tipos de Pokémon */
const TYPES = {
  Normal: 'Normal', Fire: 'Fogo', Water: 'Água', Grass: 'Planta', Electric: 'Elétrico',
  Ice: 'Gelo', Fighting: 'Lutador', Poison: 'Venenoso', Ground: 'Terrestre', Flying: 'Voador',
  Psychic: 'Psíquico', Bug: 'Inseto', Rock: 'Pedra', Ghost: 'Fantasma', Dragon: 'Dragão',
  Dark: 'Sombrio', Steel: 'Aço', Fairy: 'Fada'
};
function typeStr(s) {
  return s.replace(/\b(Normal|Fire|Water|Grass|Electric|Ice|Fighting|Poison|Ground|Flying|Psychic|Bug|Rock|Ghost|Dragon|Dark|Steel|Fairy)\b/g, w => TYPES[w] || w)
          .replace(/-type/gi, '').replace(/\s+and\s+/gi, ' e ');
}

/* 1) Mapa exato (templates de maior frequência) */
const DESC_MAP = {
  'The exclusive title can be used after getting it': 'Título exclusivo — pode ser usado após obtê-lo.',
  'You can use the exclusive avatar frame after getting it': 'Moldura de avatar exclusiva — pode ser usada após obtê-la.',
  'The exclusive avatar can be used after getting it': 'Avatar exclusivo — pode ser usado após obtê-lo.',
  'Open to randomly get various items': 'Abra para obter vários itens aleatórios.',
  'Rare Evolution materials needed for Pokémon evolution': 'Material de evolução raro, necessário para evoluir o Pokémon.',
  'Ordinary Evolution materials needed for Pokémon evolution': 'Material de evolução comum, necessário para evoluir o Pokémon.',
  'Mysterious item that can change the Individual Value of the Pokémon': 'Item misterioso que altera o IV (Valor Individual) do Pokémon.',
  'Mysterious item that can change the personality of the Pokémon': 'Item misterioso que altera a natureza do Pokémon.',
  'Candies obtained during the Halloween event, open to obtain mysterious item rewards': 'Doces obtidos durante o evento de Halloween; abra para ganhar recompensas misteriosas.',
  '狂欢盛典活动中掉落的道具，可以在活动期间兑换限定奖励': 'Item que cai durante o evento de gala; pode ser trocado por recompensas limitadas durante o evento.'
};

/* 2) Regras por padrão (a 1ª que casar vence) */
const RULES = [
  [/^Amulet awakening material for Pok[eé]mon with (.+?) as its (?:primary|main) attribute\.?$/i,
    m => `Material de despertar de amuleto para Pokémon dos tipos ${typeStr(m[1])} (atributo principal).`],
  [/^Amulet awakening material for (.+?)\.?$/i,
    m => `Material de despertar de amuleto para ${typeStr(m[1])}.`],
  [/^Necessary item for (.+?)\.?$/i, m => `Item necessário para ${_glossary(m[1])}.`],
  [/^Essential item for (.+?)\.?$/i, m => `Item essencial para ${_glossary(m[1])}.`],
  [/^Exclusive item for (.+?)\.?$/i, m => `Item exclusivo para ${_glossary(m[1])}.`],
  [/^(.+?) must have material\.?$/i, m => `Material obrigatório para ${_glossary(m[1])}.`],
  [/^A necessary item for upgrading Pok[eé]mons? to (.+?) and contains elemental power\.?$/i,
    m => `Item necessário para evoluir o Pokémon até ${m[1]}; carrega poder elemental.`],
  [/^A necessary item for (.+?)\.?$/i, m => `Item necessário para ${_glossary(m[1])}.`],
  [/^Open to select (?:an?\s+)?(.+?)\.?$/i, m => `Abra para escolher ${_glossary(m[1])}.`],
  [/^You can use (?:the\s+)?(.+?) after getting it\.?$/i, m => `${_glossary(m[1])} — pode ser usado após obtê-lo.`],
  [/^After opening,?\s*you(?:'ll| will)?\s*(?:can\s+)?(?:randomly\s+)?(?:get|obtain) (.+?)\.?$/i, m => `Ao abrir, você recebe ${_glossary(m[1])}.`],
  [/^After opening,?\s*(.+?)\.?$/i, m => `Ao abrir, ${_glossary(m[1])}.`],
  [/^For unlocking (.+?)\.?$/i, m => `Para desbloquear ${_glossary(m[1])}.`],
  [/^It can be (.+?)\.?$/i, m => `Pode ser ${_glossary(m[1])}.`],
  [/^Can be given to the Pok[eé]mon as food to increase ([\d,]+) EXP\.?$/i,
    m => `Pode ser dado ao Pokémon como alimento para ganhar ${m[1]} de EXP.`],
  [/^When a Pok[eé]mon smells this mint, it becomes ([a-z]+)\.?$/i,
    m => `Quando o Pokémon cheira esta hortelã, fica com a natureza ${NATURES[m[1].toLowerCase()] || m[1]}.`],
  [/^Exclusive evolution material for (.+?) to evolve (?:in)?to (.+?)\.?$/i,
    m => `Material de evolução exclusivo de ${m[1]} para evoluir até ${m[2]}.`],
  [/^(.+?) Explorer Device Components?\.?$/i,
    m => `Componente do Aparelho Explorador de ${m[1]}.`],
  [/^(.+?) drill components?\.?$/i,
    m => `Componente de broca de ${m[1]}.`],
  [/^Open to randomly get (.+?) and other items\.?$/i,
    m => `Abra para obter aleatoriamente ${tok(m[1])} e outros itens.`],
  [/^Open to randomly get (.+?)\.?$/i,
    m => `Abra para obter ${tok(m[1])} aleatoriamente.`],
  [/^Open to select an? (.+?) Gem\.?$/i,
    m => `Abra para escolher uma Gema ${tok(m[1])}.`],
  [/^Open to (?:randomly )?(?:get|obtain) (.+?)\.?$/i,
    m => `Abra para obter ${tok(m[1])}.`],
  [/^Open can have a chance (?:to get|resource reward)\.?(.*)$/i,
    () => `Ao abrir, há chance de ganhar recompensas.`],
  [/^Used to (.+?)\.?$/i,
    m => `Usado para ${_glossary(m[1])}.`],
  [/^Can be used to (.+?)\.?$/i,
    m => `Pode ser usado para ${_glossary(m[1])}.`],
  [/^Can be used for (.+?)\.?$/i,
    m => `Pode ser usado para ${_glossary(m[1])}.`],
  [/^(.+?) material,\s*(.+?) quality\.?$/i,
    m => `Material de ${_glossary(m[1])} — qualidade ${_glossary(m[2])}.`]
];

/* 3) Glossário de fallback (palavra-a-palavra, preserva maiúsc. inicial) */
const GLOSSARY = [
  /* frases (antes das palavras soltas) */
  [/\bas its (?:primary|main) attribute\b/gi, 'como atributo principal'],
  [/\b(?:primary|main) attribute\b/gi, 'atributo principal'],
  [/\bsecondary attribute\b/gi, 'atributo secundário'],
  [/\bmust have material\b/gi, 'material obrigatório'],
  [/\bmedium quality\b/gi, 'qualidade média'],
  [/\bhigh quality\b/gi, 'qualidade alta'],
  [/\blow quality\b/gi, 'qualidade baixa'],
  [/\bguard position\b/gi, 'posição de guarda'],
  [/\belemental power\b/gi, 'poder elemental'],
  [/\bLegendary\b/gi, 'Lendária'], [/\bMarvel\b/gi, 'Maravilhosa'],
  [/\bupgrading\b/gi, 'evoluir'], [/\bcontains\b/gi, 'contém'],
  [/\bunlocking\b/gi, 'desbloqueio de'], [/\bopening\b/gi, 'abertura'],
  [/\bas its\b/gi, 'como'], [/\bwith\b/gi, 'com'], [/\bin the\b/gi, 'no'],
  [/\bprimary\b/gi, 'principal'], [/\bsecondary\b/gi, 'secundário'],
  [/\battributes?\b/gi, 'atributo'], [/\bposition\b/gi, 'posição'],
  [/\baverage\b/gi, 'média'], [/\bmedium\b/gi, 'média'],
  /* tipos de Pokémon */
  [/\bNormal-type\b/gi, 'do tipo Normal'], [/\bGrass\b/gi, 'Planta'], [/\bBug\b/gi, 'Inseto'],
  [/\bGround\b/gi, 'Terrestre'], [/\bPsychic\b/gi, 'Psíquico'], [/\bDark\b/gi, 'Sombrio'],
  [/\bPoison\b/gi, 'Venenoso'], [/\bGhost\b/gi, 'Fantasma'], [/\bDragon\b/gi, 'Dragão'],
  [/\bFairy\b/gi, 'Fada'], [/\bFighting\b/gi, 'Lutador'], [/\bFlying\b/gi, 'Voador'],
  [/\bSteel\b/gi, 'Aço'], [/\b-type\b/gi, ''],
  /* sistemas do servidor */
  [/\btrinket\b/gi, 'berloque'], [/\binscription\b/gi, 'inscrição'],
  [/\bbreakthrough\b/gi, 'avanço'], [/\bascend\b/gi, 'ascensão'],
  [/\benhance\b/gi, 'aprimorar'], [/\benhancement\b/gi, 'aprimoramento'],
  [/\bbadge\b/gi, 'emblema'], [/\btalent\b/gi, 'talento'],
  [/\bupgrade\b/gi, 'aprimoramento'], [/\bawakening\b/gi, 'despertar'],
  [/\bamulet\b/gi, 'amuleto'], [/\bunlock\b/gi, 'desbloquear'],
  [/\brefining\b/gi, 'refino'], [/\brefine\b/gi, 'refinar'],
  [/\bessential\b/gi, 'essencial'], [/\bnecessary\b/gi, 'necessário'],
  [/\bquality\b/gi, 'qualidade'], [/\bcommon\b/gi, 'comum'],
  [/\bframes\b/gi, 'molduras'], [/\bcan be used\b/gi, 'pode ser usado'],
  [/\bused\b/gi, 'usado'], [/\bobtained\b/gi, 'obtido'], [/\bobtain\b/gi, 'obter'],
  [/\bPok[eé]mons?\b/gi, 'Pokémon'],
  [/\bexclusive\b/gi, 'exclusivo'],
  [/\bevolution materials?\b/gi, 'material de evolução'],
  [/\bevolution\b/gi, 'evolução'],
  [/\bto evolve\b/gi, 'para evoluir'],
  [/\bevolve\b/gi, 'evoluir'],
  [/\bmaterials\b/gi, 'materiais'], [/\bmaterial\b/gi, 'material'],
  [/\bavatar frame\b/gi, 'moldura de avatar'],
  [/\bavatar\b/gi, 'avatar'], [/\btitle\b/gi, 'título'], [/\bframe\b/gi, 'moldura'],
  [/\bcomponents?\b/gi, 'componente'], [/\bdevice\b/gi, 'aparelho'], [/\bexplorer\b/gi, 'explorador'],
  [/\bopen to\b/gi, 'abra para'], [/\bopen\b/gi, 'abrir'],
  [/\brandomly\b/gi, 'aleatoriamente'], [/\brandom\b/gi, 'aleatório'],
  [/\bcan be used\b/gi, 'pode ser usado'],
  [/\bafter getting it\b/gi, 'após obtê-lo'],
  [/\bto get\b/gi, 'para obter'], [/\bto obtain\b/gi, 'para obter'],
  [/\bget\b/gi, 'obter'], [/\bobtain\b/gi, 'obter'],
  [/\bvarious items\b/gi, 'vários itens'], [/\bother items\b/gi, 'outros itens'],
  [/\bitems\b/gi, 'itens'], [/\bitem\b/gi, 'item'],
  [/\brare\b/gi, 'raro'], [/\bordinary\b/gi, 'comum'], [/\bneeded\b/gi, 'necessário'],
  [/\bmysterious\b/gi, 'misterioso'], [/\bincrease\b/gi, 'aumentar'], [/\bfood\b/gi, 'alimento'],
  [/\bgems?\b/gi, 'gema'], [/\bshards?\b/gi, 'fragmentos'], [/\bcoupons?\b/gi, 'cupons'],
  [/\brewards?\b/gi, 'recompensa'], [/\bchance\b/gi, 'chance'], [/\bevents?\b/gi, 'evento'],
  [/\bduring\b/gi, 'durante'], [/\bcandies\b/gi, 'doces'], [/\bcandy\b/gi, 'doce'],
  [/\bpersonality\b/gi, 'natureza'], [/\battribute\b/gi, 'atributo'], [/\bskill\b/gi, 'habilidade'],
  [/\bexperience\b/gi, 'experiência'], [/\blevel\b/gi, 'nível'],
  [/\bcan have a chance\b/gi, 'tem chance de'], [/\bresource reward\b/gi, 'recompensa de recurso']
];

function _glossary(t) {
  let out = t;
  for (const [re, rep] of GLOSSARY) out = out.replace(re, rep);
  return out;
}

/* tradutor principal */
function translateDesc(raw) {
  if (!raw) return '';
  let t = String(raw).trim().replace(/\s+/g, ' ');
  const wrapped = /^["“](.*)["”]$/.test(t);
  if (wrapped) t = t.replace(/^["“]|["”]$/g, '').trim();
  let res;
  if (DESC_MAP[t]) res = DESC_MAP[t];
  else {
    res = null;
    for (const [re, fn] of RULES) { const m = t.match(re); if (m) { res = fn(m); break; } }
    if (res == null) res = _glossary(t);
  }
  return wrapped ? '“' + res + '”' : res;
}

if (typeof window !== 'undefined') window.translateDesc = translateDesc;
if (typeof module !== 'undefined') module.exports = { translateDesc, NATURES };
