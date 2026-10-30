// Side view of the mouth (facing left) showing where a sound is made: tongue shape, lips,
// soft palate, the point of contact and the path of the air. Used by the vowel and consonant
// pages. Mouth.forConsonant(ipa) / Mouth.forVowel(qualities) build a spec; Mouth.svg(spec)
// draws it; Mouth.caption(spec) describes it in words.
const Mouth = (() => {
  // ---------- Tongue shapes ----------
  // Each is the tongue's upper surface, from just behind the lower teeth back to its root.
  const TIP = 'M66 172';
  const ROOT = 'L192 200 L190 205 Q120 205 66 175 Z';
  const TONGUES = {
    rest: 'Q64 154 80 150 Q130 132 170 140 Q188 148 190 175',
    alveolar: 'Q58 150 66 132 Q72 126 80 132 Q110 140 150 140 Q185 144 190 175',
    retroflex: 'Q62 142 76 126 Q84 116 88 124 Q100 140 140 140 Q185 142 190 175',
    palatal: 'Q64 156 76 150 Q92 112 120 110 Q160 112 178 138 Q190 150 190 175',
    velar: 'Q64 156 80 152 Q120 148 150 128 Q165 110 184 112 Q194 130 190 175',
    velarLow: 'Q64 156 80 152 Q120 148 152 134 Q168 120 184 123 Q194 136 190 175',
  };

  // Vowel qualities: where the highest point of the tongue is, how open the jaw is,
  // and whether the lips are rounded. Keys follow Stuart Jay Raj's symbols.
  const VOWELS = {
    i: { peak: [104, 117], jaw: 0, name: 'front of the tongue raised high' },
    'ɨ': { peak: [152, 116], jaw: 0, name: 'tongue raised high and pulled back, lips spread' },
    u: { peak: [170, 117], jaw: 0, round: true, name: 'back of the tongue raised high, lips rounded' },
    e: { peak: [106, 125], jaw: 3, name: 'front of the tongue half raised' },
    'ə': { peak: [148, 128], jaw: 3, name: 'tongue relaxed in the middle (schwa)' },
    o: { peak: [168, 126], jaw: 3, round: true, name: 'back of the tongue half raised, lips rounded' },
    'æ': { peak: [108, 137], jaw: 6, name: 'front of the tongue low' },
    'ɔ': { peak: [168, 137], jaw: 6, round: true, name: 'back of the tongue low, lips rounded' },
    a: { peak: [140, 148], jaw: 10, name: 'tongue low and the mouth open' },
  };

  const vowelTongue = ([x, y]) =>
    `Q64 156 78 152 Q${x - 35} ${y} ${x} ${y} Q${x + 25} ${y} 188 ${Math.max(y + 30, 152)} Q191 162 190 175`;

  // ---------- Consonants ----------
  const PLACES = {
    bilabial: { tongue: 'rest', lips: 'closed', contact: [42, 145], name: 'both lips' },
    labiodental: { tongue: 'rest', lips: 'teeth', contact: [59, 148], name: 'lower lip against the upper teeth' },
    alveolar: { tongue: 'alveolar', contact: [68, 129], name: 'tongue tip on the ridge behind the upper teeth' },
    palatal: { tongue: 'palatal', contact: [116, 110], name: 'middle of the tongue against the hard palate' },
    velar: { tongue: 'velar', contact: [182, 112], name: 'back of the tongue against the soft palate' },
    glottal: { tongue: 'rest', contact: [206, 228], name: 'in the throat (the vocal folds)' },
  };

  function placeOf(ipa) {
    if (/^[kŋ]/.test(ipa)) return 'velar';
    if (/^(tɕ|j)/.test(ipa)) return 'palatal';
    if (/^[tdnslr]/.test(ipa)) return 'alveolar';
    if (/^[bpm]/.test(ipa)) return 'bilabial';
    if (/^f/.test(ipa)) return 'labiodental';
    if (/^w/.test(ipa)) return 'velar'; // with rounded lips
    return 'glottal'; // h, ʔ
  }

  function mannerOf(ipa) {
    if (/^[mnŋ]/.test(ipa)) return 'nasal';
    if (/^[sfh]/.test(ipa)) return 'fricative';
    if (/^[jwlr]/.test(ipa)) return 'approximant';
    return 'stop'; // k t p b d tɕ ʔ (tɕ is an affricate: a stop released into a hiss)
  }

  function forConsonant(ipa) {
    const place = placeOf(ipa);
    const manner = mannerOf(ipa);
    const p = PLACES[place];
    const spec = {
      kind: 'consonant', ipa, place, manner,
      tongue: TONGUES[manner === 'nasal' && place === 'velar' ? 'velarLow' : p.tongue],
      lips: ipa[0] === 'w' ? 'round' : p.lips || 'open',
      velum: manner === 'nasal' ? 'down' : 'up',
      contact: manner === 'nasal' && place === 'velar' ? [183, 123] : p.contact,
      // An approximant only narrows the gap, so its point is shown as a ring rather than a dot.
      touch: manner !== 'approximant' && ipa !== 'h',
      flow: ipa === 'ʔ' ? null : manner === 'nasal' ? 'nasal' : 'oral',
      puff: ipa.includes('ʰ'),
      voiced: /^[bdmnŋjwlr]/.test(ipa),
      jaw: 0,
    };
    if (ipa === 'h') spec.contact = null;
    return spec;
  }

  // `qualities` is one vowel (['i']) or a glide from the first to the last (['a', 'i']).
  // 'm' as the last item means the vowel closes onto the lips (อำ).
  function forVowel(qualities) {
    const [first, ...rest] = qualities;
    const v = VOWELS[first];
    const spec = {
      kind: 'vowel', qualities, tongue: vowelTongue(v.peak), peak: v.peak,
      lips: v.round ? 'round' : 'open', velum: 'up', contact: null, touch: false,
      flow: 'oral', puff: false, voiced: true, jaw: v.jaw,
    };
    const last = rest[rest.length - 1];
    if (last === 'm') spec.ghost = { lips: 'closed', tongue: TONGUES.rest };
    else if (last) {
      const g = VOWELS[last];
      spec.ghost = { tongue: vowelTongue(g.peak), peak: g.peak, lips: g.round ? 'round' : null };
    }
    return spec;
  }

  // ---------- Drawing ----------
  const LIPS = {
    open: ['', ''],
    closed: ['', 'translate(0 -10)'],
    teeth: ['', 'translate(9 -8)'],
    round: ['translate(-6 2)', 'translate(-6 -5)'],
  };

  const UPPER_LIP = 'M42 104 Q28 118 30 130 Q33 140 46 139 L56 137 L56 116 Z';
  const LOWER_LIP = 'M58 150 L44 150 Q32 152 32 162 Q34 170 48 170 L60 168 Z';

  function svg(spec) {
    const [upperT, lowerT] = LIPS[spec.lips];
    const jaw = spec.jaw ? `translate(0 ${spec.jaw})` : '';
    const velum = spec.velum === 'down'
      ? 'M168 100 Q190 104 198 136 Q188 134 182 122 Q175 112 168 108 Z'
      : 'M168 100 Q195 99 213 106 Q197 116 168 108 Z';
    // Oral air passes over the tongue's highest point (or the point of contact) and out the lips.
    const [wx, wy] = spec.peak ? [spec.peak[0], spec.peak[1] - 5]
      : spec.contact && spec.contact[0] < 200 && spec.place !== 'bilabial' && spec.place !== 'labiodental'
        ? spec.contact : [130, 125];
    const flow = spec.flow === 'nasal'
      ? 'M206 224 L205 150 Q206 112 190 92 Q140 72 44 100'
      : `M206 224 L203 168 Q${wx + 45} ${wy - 2} ${wx} ${wy} Q${(wx + 36) / 2} ${wy} 36 145`;
    let ghost = '';
    if (spec.ghost) {
      if (spec.ghost.lips) {
        const [gu, gl] = LIPS[spec.ghost.lips];
        ghost += `<path class="m-ghost" d="${UPPER_LIP}" transform="${gu}"/><path class="m-ghost" d="${LOWER_LIP}" transform="${gl}"/>`;
      }
      ghost += `<path class="m-ghost" d="${TIP} ${spec.ghost.tongue} ${ROOT}"/>`;
      if (spec.peak && spec.ghost.peak) {
        ghost += `<path class="m-move" d="M${spec.peak[0]} ${spec.peak[1] - 4} L${spec.ghost.peak[0]} ${spec.ghost.peak[1] - 4}" marker-end="url(#m-head)"/>`;
      }
    }
    const contact = spec.contact
      ? `<circle class="m-contact${spec.touch ? '' : ' near'}" cx="${spec.contact[0]}" cy="${spec.contact[1]}" r="6"/>`
      : '';
    const puff = spec.puff
      ? '<g class="m-puff"><path d="M24 138 L10 134"/><path d="M24 145 L8 145"/><path d="M24 152 L10 156"/></g>'
      : '';
    const voice = spec.voiced ? '<path class="m-voice" d="M196 228 l3 -4 l3 8 l3 -8 l3 8 l3 -8 l3 4"/>' : '';
    return `<svg class="mouth" viewBox="0 0 240 240" role="img" aria-label="${caption(spec)}">
  <defs><marker id="m-head" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z"/></marker></defs>
  <path class="m-head" d="M75 0 L60 48 L22 90 Q24 102 42 104 L50 135 L52 168 Q36 175 38 192 Q45 205 90 207 L130 240 L240 240 L240 0 Z"/>
  <path class="m-air" d="M44 104 Q50 70 80 62 Q150 55 205 82 L214 104 Q190 100 168 100 Q100 92 44 104 Z"/>
  <path class="m-air" d="M36 141 L56 138 L66 131 Q74 117 92 112 Q130 100 168 108 L168 100 Q190 99 214 104 L216 232 L196 232 L190 205 Q120 205 66 175 L62 152 L36 152 Z"/>
  <path class="m-head m-soft" d="${velum}"/>
  <path class="m-tongue" d="${TIP} ${spec.tongue} ${ROOT}"/>
  <path class="m-tooth" d="M56 136 L57 150 L63 149 L66 131 Z"/>
  <g transform="${jaw}"><path class="m-tooth" d="M60 166 L57 153 L63 152 L66 168 Z"/></g>
  <path class="m-head m-lip" d="${UPPER_LIP}" transform="${upperT}"/>
  <g transform="${jaw}"><path class="m-head m-lip" d="${LOWER_LIP}" transform="${lowerT}"/></g>
  ${ghost}
  ${spec.flow ? `<path class="m-flow" d="${flow}" marker-end="url(#m-head)"/>` : ''}
  ${puff}${voice}${contact}
</svg>`;
  }

  const MANNERS = {
    stop: 'air stopped, then released',
    nasal: 'air goes out through the nose',
    fricative: 'air hisses through a narrow gap',
    approximant: 'the gap narrows but air flows freely',
  };

  function caption(spec) {
    if (spec.kind === 'vowel') {
      const [first, ...rest] = spec.qualities;
      const last = rest[rest.length - 1];
      let text = VOWELS[first].name;
      if (last === 'm') text += ', then the lips close (m)';
      else if (last) text += `, gliding to ${VOWELS[last].name}`;
      return text.charAt(0).toUpperCase() + text.slice(1);
    }
    const parts = [PLACES[spec.place].name];
    if (spec.ipa === 'ʔ') parts.push('a catch in the throat');
    else if (spec.ipa === 'h') parts.push('breath through an open throat');
    else if (spec.ipa[0] === 'w') parts.push('lips rounded', MANNERS.approximant);
    else parts.push(MANNERS[spec.manner]);
    if (spec.puff) parts.push('with a puff of air');
    if (spec.voiced) parts.push('voice on');
    const text = parts.join(' · ');
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  return { forConsonant, forVowel, svg, caption };
})();
