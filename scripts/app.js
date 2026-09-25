/* ============================================================
   MANDALORIAN TERMINAL — portfolio command console
   Vanilla JS. No dependencies. No build step.
   ============================================================ */

const PROMPT = 'operator@mando:~$';
const cmdInput = document.getElementById('cmdInput');
const output = document.getElementById('terminalOutput');
let history = [];
let histPos = 0;
let profile = {};

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- safety ---------- */

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

/* ---------- rendering ---------- */

function printBlock(lines) {
  const frag = document.createDocumentFragment();
  lines.forEach(line => {
    const div = document.createElement('div');
    div.innerHTML = line;
    frag.appendChild(div);
  });
  output.appendChild(frag);
  output.scrollTop = output.scrollHeight;
}

function typeOutput(html) {
  const div = document.createElement('div');
  output.appendChild(div);

  if (prefersReducedMotion) {
    div.innerHTML = html;
    output.scrollTop = output.scrollHeight;
    return;
  }

  // Reveal pre-built HTML progressively without re-parsing markup per
  // character: render once, then wipe visible text back with a CSS clip.
  div.innerHTML = html;
  const text = div.textContent || '';
  const full = div.innerHTML;
  const steps = Math.min(text.length, 400); // cap work on very long output
  if (steps <= 1) {
    output.scrollTop = output.scrollHeight;
    return;
  }
  div.style.visibility = 'hidden';
  const plain = document.createElement('span');
  plain.className = 'boot-line';
  output.insertBefore(plain, div);
  let i = 0;
  const speed = 6; // ms per revealed char, short by design
  (function step() {
    i += Math.ceil(text.length / steps);
    plain.textContent = text.slice(0, i);
    output.scrollTop = output.scrollHeight;
    if (i < text.length) {
      setTimeout(step, speed);
    } else {
      plain.remove();
      div.style.visibility = 'visible';
      div.innerHTML = full;
      output.scrollTop = output.scrollHeight;
    }
  })();
}

function clearScreen() {
  output.innerHTML = '';
}

function panel(label, html) {
  return `<div class="out-panel"><div class="out-label">${escapeHtml(label)}</div>${html}</div>`;
}

/* ---------- greetings ---------- */

const tips = [
  '↑ / ↓ ile komut geçmişinde gezinin.',
  '`theme` komutuyla temayı değiştirin.',
  '`open github|linkedin|medium` ile bağlantı açın.',
  '`download-cv` ile özgeçmişi indirin.',
  'Tab tuşuyla komut tamamlayın.',
];

function greetingByHour(h) {
  if (h < 5) return 'İyi geceler';
  if (h < 12) return 'Günaydın';
  if (h < 18) return 'İyi günler';
  return 'İyi akşamlar';
}

function renderMotd() {
  const now = new Date();
  const tip = tips[Math.floor(Math.random() * tips.length)];
  const greet = greetingByHour(now.getHours());
  const name = profile.name || 'Selim Enes Çevik';
  const role = profile.role || 'Cloud Platform & DevOps Engineer';

  printBlock([
    `<span class="out-dim">──────────────────────────────────────────</span>`,
    `<strong>${escapeHtml(name)}</strong> <span class="out-dim">//</span> ${escapeHtml(role)}`,
    `<span class="out-dim">──────────────────────────────────────────</span>`,
    '',
    `${greet}. Başlamak için <code>help</code> yazın.`,
    `<span class="out-dim">Popüler: about · experience · skills · contact</span>`,
    `<span class="out-dim">İpucu: ${escapeHtml(tip)}</span>`,
    '',
  ]);
}

/* ---------- boot sequence ---------- */

const BOOT_LINES = [
  'INITIALIZING SYSTEM...',
  { text: 'LOADING PROFILE MODULE', ok: true },
  { text: 'LOADING PLATFORM MODULE', ok: true },
  { text: 'LOADING CLOUD MODULE', ok: true },
  { text: 'INTEGRITY CHECK', ok: true },
  '',
  'SYSTEM STATUS: ONLINE',
  'WELCOME, OPERATOR.',
];

function runBoot(done) {
  if (prefersReducedMotion) {
    done();
    return;
  }
  let idx = 0;
  const el = document.createElement('div');
  output.appendChild(el);

  function skip() {
    document.removeEventListener('keydown', skip);
    document.removeEventListener('click', skip);
    el.remove();
    done();
  }
  document.addEventListener('keydown', skip, { once: true });
  document.addEventListener('click', skip, { once: true });

  function next() {
    if (idx >= BOOT_LINES.length) {
      document.removeEventListener('keydown', skip);
      document.removeEventListener('click', skip);
      setTimeout(() => { el.remove(); done(); }, 120);
      return;
    }
    const item = BOOT_LINES[idx++];
    const line = document.createElement('div');
    line.className = 'boot-line';
    if (typeof item === 'object') {
      line.innerHTML = `${escapeHtml(item.text)}<span class="boot-ok">${item.ok ? ' ... OK' : ''}</span>`;
    } else {
      line.textContent = item;
    }
    el.appendChild(line);
    output.scrollTop = output.scrollHeight;
    setTimeout(next, 90);
  }
  next();
}

/* ---------- ascii (Mandalorian silhouette, decorative) ---------- */

const MANDO_ASCII = [
  '⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣤⣤⣤⣤⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
  '⠀⠀⠀⠀⠀⠀⡠⠔⠋⠁⠀⠀⣿⡇⢸⣿⠀⠀⠈⠙⠢⢄⠀⠀⠀⠀⠀⠀',
  '⠀⠀⠀⠀⡠⠊⠀⠀⠀⠀⠀⠀⣿⡇⢸⣿⠀⠀⠀⠀⠀⠀⠑⢄⠀⠀⠀⠀',
  '⠀⠀⠀⡴⠁⠀⠀⠀⠀⠀⠀⠀⣿⡇⢸⣿⠀⠀⠀⠀⠀⠀⠀⠈⢆⠀⠀⠀',
  '⠀⠀⢰⠁⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⢸⣿⠀⠀⠀⠀⠀⠀⠀⠀⠈⡆⠀⠀',
  '⠀⢀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⢸⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀',
  '⡔⠚⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⢸⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠓⢢',
  '⡇⢀⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣇⣸⣿⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⡀⢸',
  '⠇⠘⠻⢿⣿⣷⣶⣤⣤⣄⣀⣀⣈⡛⢛⣁⣀⣀⣠⣤⣤⣶⣾⣿⡿⠟⠃⢸',
  '⡷⣤⣀⠀⠈⠉⠙⠛⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠛⠋⠉⠁⠀⣀⣤⢾',
  '⢳⠈⠻⣿⣶⣄⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⣠⣶⣿⠟⠁⡞',
  '⢸⠀⠀⠈⠻⣿⣷⣄⠀⠀⠀⢿⣿⣿⣿⣿⡟⠀⠀⠀⣠⣿⣿⠟⠁⠀⠀⡇',
  '⢸⠀⠀⠀⡈⠈⠻⣿⣆⠀⠀⢸⣿⣿⣿⣿⡇⠀⠀⣰⣿⠟⠁⢃⠀⠀⠀⡇',
  '⢸⠀⠀⠠⠁⠀⠀⠘⢿⡄⠀⢸⣿⣿⣿⣿⡇⠀⢰⡿⠃⠀⠀⠈⠄⠀⠀⡇',
  '⢸⠀⢀⠁⠀⠀⠀⠀⠈⣿⠀⢸⣿⣿⣿⣿⡇⠀⣿⠁⠀⠀⠀⠀⠈⡀⠀⡇',
  '⠀⠑⠛⠢⣄⠀⠀⠀⠀⠘⡇⢸⣿⣿⣿⣿⡇⢸⠃⠀⠀⠀⠀⣠⠔⠛⠊⠀',
  '⠀⠀⠀⠀⠀⠑⠢⣀⠀⠀⢷⢸⣿⣿⣿⣿⠇⡞⠀⠀⣀⠔⠋⠀⠀⠀⠀⠀',
  '⠀⠀⠀⠀⠀⠀⠀⠀⠑⠢⣸⠀⣿⣿⣿⣿⠀⣇⠔⠊⠀⠀⠀⠀⠀⠀⠀⠀',
  '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠒⠛⠛⠛⠛⠚⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
  '        THIS IS THE WAY.        ',
];

/* ---------- data boot ---------- */

fetch('data/profile.json')
  .then(r => {
    if (!r.ok) throw new Error('profile fetch failed: ' + r.status);
    return r.json();
  })
  .then(j => { profile = j; init(); })
  .catch(() => {
    profile = {};
    init();
    typeOutput('<span class="out-err">UYARI: profil verisi yüklenemedi. Bazı komutlar eksik veri döndürebilir.</span>');
  });

function init() {
  runBoot(() => {
    renderMotd();
    handleHash();
  });
  wireMobileKeys();
}

/* ---------- hash deep link ---------- */

function handleHash() {
  const hash = decodeURIComponent(location.hash.replace('#', ''));
  if (!hash) return;
  if (!commands[hash.split(' ')[0]]) {
    typeOutput(`<span class="out-err">Bilinmeyen rota: #${escapeHtml(hash)}</span>\n`);
    return;
  }
  echo(hash);
  runCommand(hash);
}
window.addEventListener('hashchange', handleHash);

/* ---------- echo & commands ---------- */

function echo(cmd) {
  const div = document.createElement('div');
  div.innerHTML = `<span class="prompt">${PROMPT}</span> `;
  div.appendChild(document.createTextNode(cmd));
  output.appendChild(div);
}

const commands = {
  help() {
    const rows = Object.keys(commands).sort().map(c => `  ${c}`).join('\n');
    typeOutput(panel('AVAILABLE COMMANDS', `<pre style="margin:4px 0;white-space:pre-wrap;">${escapeHtml(rows)}</pre>`));
  },
  about() {
    typeOutput(panel('ABOUT', `<p style="margin:4px 0;">${escapeHtml(profile.about || 'Veri bulunamadı.')}</p>`));
  },
  skills() {
    const arr = profile.skills || [];
    if (!arr.length) { typeOutput(panel('SKILLS', '<span class="out-dim">Veri bulunamadı.</span>')); return; }
    const rows = arr.map(s => `<div>▹ ${escapeHtml(s)}</div>`).join('');
    typeOutput(panel('SKILLS', rows));
  },
  experience() {
    const list = profile.experience || [];
    if (!list.length) { typeOutput(panel('EXPERIENCE', '<span class="out-dim">Veri bulunamadı.</span>')); return; }
    const rows = list.map(e => {
      const details = (e.details || []).map(d => `<div class="out-dim">  · ${escapeHtml(d)}</div>`).join('');
      return `<div style="margin-bottom:8px;"><strong>${escapeHtml(e.company)}</strong> — ${escapeHtml(e.role)} <span class="out-dim">(${escapeHtml(e.years)})</span>${details}</div>`;
    }).join('');
    typeOutput(panel('EXPERIENCE', rows));
  },
  education() {
    const list = profile.education || [];
    if (!list.length) { typeOutput(panel('EDUCATION', '<span class="out-dim">Veri bulunamadı.</span>')); return; }
    const rows = list.map(e =>
      `<div><strong>${escapeHtml(e.institution)}</strong> — ${escapeHtml(e.degree)} <span class="out-dim">(${escapeHtml(e.years)})</span></div>`
    ).join('');
    typeOutput(panel('EDUCATION', rows));
  },
  links() {
    const links = profile.links || {};
    const entries = Object.entries(links);
    if (!entries.length) { typeOutput(panel('LINKS', '<span class="out-dim">Veri bulunamadı.</span>')); return; }
    const rows = entries.map(([k, v]) =>
      `<div>${escapeHtml(k)}: <a href="${escapeHtml(v)}" target="_blank" rel="noopener noreferrer">${escapeHtml(v)}</a></div>`
    ).join('');
    typeOutput(panel('LINKS', rows));
  },
  contact() {
    const c = profile.contact || {};
    const li = profile.links && profile.links.linkedin;
    const rows = [
      c.email ? `<div>EMAIL &nbsp; <a href="mailto:${escapeHtml(c.email)}">${escapeHtml(c.email)}</a></div>` : '',
      c.phone ? `<div>PHONE &nbsp; ${escapeHtml(c.phone)}</div>` : '',
      li ? `<div>LINKEDIN &nbsp; <a href="${escapeHtml(li)}" target="_blank" rel="noopener noreferrer">profile</a></div>` : '',
    ].filter(Boolean).join('');
    typeOutput(panel('CONTACT', rows || '<span class="out-dim">Veri bulunamadı.</span>'));
  },
  clear() {
    clearScreen();
  },
  theme() {
    document.body.classList.toggle('light');
    typeOutput(`<span class="out-ok">Tema değiştirildi.</span>`);
  },
  motd() {
    renderMotd();
  },
  system() {
    const now = new Date().toISOString();
    typeOutput(panel('SYSTEM', [
      `<div>STATUS &nbsp; <span class="out-ok">ONLINE</span></div>`,
      `<div>MODE &nbsp;&nbsp;&nbsp; PORTFOLIO</div>`,
      `<div>SESSION &nbsp; LOCAL (client-side only, no tracking)</div>`,
      `<div>CLOCK &nbsp;&nbsp;&nbsp; ${escapeHtml(now)}</div>`,
    ].join('')));
  },
  'download-cv'() {
    const url = profile.cv || 'assets/cv/Selim_Enes_Cevik_CV.pdf';
    window.open(url, '_blank', 'noopener,noreferrer');
  },
  open(args) {
    if (!args.length) {
      typeOutput('Usage: open &lt;github|linkedin|medium|project-id&gt;\n');
      return;
    }
    const key = args[0];
    const url = (profile.links && profile.links[key]) ||
      ((profile.projects || []).find(p => p.id === key)?.url);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      typeOutput('<span class="out-err">Bağlantı bulunamadı.</span>\n');
    }
  },
  ascii() {
    printBlock(MANDO_ASCII.map(l => escapeHtml(l)));
  },
};

const commandList = Object.keys(commands);

/* ---------- keyboard handling ---------- */

function submitCurrentInput() {
  const value = cmdInput.value.trim();
  echo(value);
  runCommand(value);
  if (value) history.push(value);
  histPos = history.length;
  cmdInput.value = '';
}

cmdInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    submitCurrentInput();
  } else if (e.key === 'ArrowUp') {
    if (histPos > 0) {
      histPos--;
      cmdInput.value = history[histPos];
      setTimeout(() => cmdInput.setSelectionRange(cmdInput.value.length, cmdInput.value.length), 0);
    }
    e.preventDefault();
  } else if (e.key === 'ArrowDown') {
    if (histPos < history.length - 1) {
      histPos++;
      cmdInput.value = history[histPos];
    } else {
      histPos = history.length;
      cmdInput.value = '';
    }
    e.preventDefault();
  } else if (e.key === 'Tab') {
    e.preventDefault();
    const val = cmdInput.value;
    const matches = commandList.filter(c => c.startsWith(val));
    if (matches.length === 1) {
      cmdInput.value = matches[0] + ' ';
    } else if (matches.length > 1) {
      typeOutput(escapeHtml(matches.join('  ')) + '\n');
    }
  } else if (e.key === 'Escape') {
    cmdInput.value = '';
  } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
    e.preventDefault();
    clearScreen();
  }
});

/* ---------- mobile shortcut row ---------- */

function wireMobileKeys() {
  document.querySelectorAll('.mobile-key').forEach(btn => {
    btn.addEventListener('click', () => {
      cmdInput.focus();
      const key = btn.dataset.key;
      if (key === 'Enter') {
        submitCurrentInput();
        return;
      }
      if (key === 'ctrl-l') {
        clearScreen();
        return;
      }
      cmdInput.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    });
  });
}

/* ---------- focus ---------- */

function focusCmd() {
  if (!cmdInput) return;
  if (document.visibilityState === 'visible') cmdInput.focus();
}

document.addEventListener('click', e => {
  const tag = e.target.closest('a, button, [data-no-focus]');
  if (tag) return;
  focusCmd();
});

window.addEventListener('load', focusCmd);
document.addEventListener('visibilitychange', focusCmd);

output.addEventListener('click', e => {
  if (e.target.classList.contains('copy-btn')) {
    const text = e.target.dataset.copy;
    navigator.clipboard.writeText(text).then(() => {
      e.target.textContent = 'copied';
      setTimeout(() => (e.target.textContent = 'copy'), 1200);
    });
  }
});

/* ---------- command runner ---------- */

function runCommand(line) {
  const [cmd, ...args] = line.split(' ').filter(Boolean);
  if (!cmd) return;
  const fn = commands[cmd];
  if (fn) {
    fn(args);
  } else {
    typeOutput(`<span class="out-err">Command not found: ${escapeHtml(cmd)}</span>\nType <code>help</code>.\n`);
  }
}
