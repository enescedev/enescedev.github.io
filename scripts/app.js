
const PROMPT = 'enescedev@portfolio:~$';
const cmdInput = document.getElementById('cmdInput');
const output = document.getElementById('terminalOutput');
let history = [];
let histPos = 0;
let profile = {};


function printBlock(lines) {
  output.innerHTML += lines.join('<br>') + '<br>';
  output.scrollTop = output.scrollHeight;
}

function typeOutput(text) {
  let i = 0;
  function step() {
    if (i < text.length) {
      const ch = text[i];
      output.innerHTML += ch === '\n' ? '<br>' : ch;
      output.scrollTop = output.scrollHeight;
      i++;
      setTimeout(step, 15);
    } else {
      output.innerHTML += '<br>';
      output.scrollTop = output.scrollHeight;
    }
  }
  step();
}

function clearScreen() {
  output.innerHTML = '';
}


const tips = [
  "Use ↑/↓ to navigate command history.",
  "Toggle theme with `theme`.",
  "Open links with `open github|linkedin|medium`.",
  "Download your CV via `download-cv`.",
  "Try `projects` and then `projects <id>` for details."
];

function greetingByHour(h) {
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

/* ---------- Mandalorian ASCII ---------- */

const MANDO_ASCII = [
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣤⣤⣤⣤⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⡠⠔⠋⠁⠀⠀⣿⡇⢸⣿⠀⠀⠈⠙⠢⢄⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⡠⠊⠀⠀⠀⠀⠀⠀⣿⡇⢸⣿⠀⠀⠀⠀⠀⠀⠑⢄⠀⠀⠀⠀",
  "⠀⠀⠀⡴⠁⠀⠀⠀⠀⠀⠀⠀⣿⡇⢸⣿⠀⠀⠀⠀⠀⠀⠀⠈⢆⠀⠀⠀",
  "⠀⠀⢰⠁⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⢸⣿⠀⠀⠀⠀⠀⠀⠀⠀⠈⡆⠀⠀",
  "⠀⢀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⢸⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀",
  "⡔⠚⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⢸⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠓⢢",
  "⡇⢀⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣇⣸⣿⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⡀⢸",
  "⠇⠘⠻⢿⣿⣷⣶⣤⣤⣄⣀⣀⣈⡛⢛⣁⣀⣀⣠⣤⣤⣶⣾⣿⡿⠟⠃⢸",
  "⡷⣤⣀⠀⠈⠉⠙⠛⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠛⠋⠉⠁⠀⣀⣤⢾",
  "⢳⠈⠻⣿⣶⣄⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⣠⣶⣿⠟⠁⡞",
  "⢸⠀⠀⠈⠻⣿⣷⣄⠀⠀⠀⢿⣿⣿⣿⣿⡟⠀⠀⠀⣠⣿⣿⠟⠁⠀⠀⡇",
  "⢸⠀⠀⠀⡈⠈⠻⣿⣆⠀⠀⢸⣿⣿⣿⣿⡇⠀⠀⣰⣿⠟⠁⢃⠀⠀⠀⡇",
  "⢸⠀⠀⠠⠁⠀⠀⠘⢿⡄⠀⢸⣿⣿⣿⣿⡇⠀⢰⡿⠃⠀⠀⠈⠄⠀⠀⡇",
  "⢸⠀⢀⠁⠀⠀⠀⠀⠈⣿⠀⢸⣿⣿⣿⣿⡇⠀⣿⠁⠀⠀⠀⠀⠈⡀⠀⡇",
  "⠀⠑⠛⠢⣄⠀⠀⠀⠀⠘⡇⢸⣿⣿⣿⣿⡇⢸⠃⠀⠀⠀⠀⣠⠔⠛⠊⠀",
  "⠀⠀⠀⠀⠀⠑⠢⣀⠀⠀⢷⢸⣿⣿⣿⣿⠇⡞⠀⠀⣀⠔⠋⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠑⠢⣸⠀⣿⣿⣿⣿⠀⣇⠔⠊⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠒⠛⠛⠛⠛⠚⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "        THIS IS THE WAY.        ",

];

function renderMotd() {
  const now = new Date();
  const tip = tips[Math.floor(Math.random() * tips.length)];
  const greet = greetingByHour(now.getHours());

  printBlock([
    ...MANDO_ASCII,
    "",
    "Welcome — type `help` to begin.",
    "",
    `${greet}! I'm Selim Enes Çevik — Cloud Platform & DevOps Engineer".`,
    "",
    "Popular: \u0060about\u0060, \u0060projects\u0060, \u0060links\u0060",
    `Tip: ${tip}`
  ]);
}

/* ---------- Matrix intro (code rain) ---------- */

function startMatrixRain(durationMs = 3500) {
  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-intro';
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100vw',
    height: '100vh',
    zIndex: '9999',
    pointerEvents: 'none',
    opacity: '1',
    transition: 'opacity 600ms ease'
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w, h, columns, drops;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const fontSize = 14;
    columns = Math.floor(w / fontSize);
    drops = new Array(columns).fill(1 + Math.floor(Math.random() * 20));
    ctx.font = `${fontSize}px monospace`;
  }
  window.addEventListener('resize', resize);
  resize();

  const glyphs = "アァカサタナハマヤラワガザダバパ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let raf;
  function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < drops.length; i++) {
      const text = glyphs[Math.floor(Math.random() * glyphs.length)];
      ctx.fillStyle = "#0f0";
      ctx.fillText(text, i * 14, drops[i] * 14);
      drops[i]++;

      // random reset
      if (drops[i] * 14 > h && Math.random() > 0.975) {
        drops[i] = 0;
      }
    }
    raf = requestAnimationFrame(draw);
  }
  draw();

  // auto stop + fade out
  setTimeout(() => {
    canvas.style.opacity = '0';
    setTimeout(() => {
      cancelAnimationFrame(raf);
      canvas.remove();
      window.removeEventListener('resize', resize);
      // After intro finishes, show MOTD
      renderMotd();
    }, 700);
  }, durationMs);
}

/* ---------- data boot ---------- */

fetch('data/profile.json')
  .then(r => r.json())
  .then(j => { profile = j; init(); });

function init() {
  // Kick off Matrix intro first; MOTD will render after fade-out.
  startMatrixRain(3600);
  handleHash();
}

/* ---------- hash deep link ---------- */

function handleHash() {
  const hash = decodeURIComponent(location.hash.replace('#', ''));
  if (!hash) return;
  runCommand(hash);
}
window.addEventListener('hashchange', handleHash);

/* ---------- echo & commands ---------- */

function echo(cmd) {
  const line = `<span class="prompt">${PROMPT}</span> ${cmd}`;
  output.innerHTML += line + '<br>';
}

const commands = {
  help() {
    const cmds = Object.keys(commands).join(', ');
    typeOutput(`Commands: ${cmds}\n`);
  },
  about() {
    typeOutput((profile.about || '') + '\n');
  },
  skills() {
    const arr = profile.skills || [];
    typeOutput(arr.map(s => '• ' + s).join('\n') + '\n');
  },
  experience() {
    let out = '';
    (profile.experience || []).forEach(e => {
      out += `• ${e.company} — ${e.role} (${e.years})\n`;
      (e.details || []).forEach(d => out += `  - ${d}\n`);
    });
    typeOutput(out || 'No experience data\n');
  },
  projects(args) {
    const list = profile.projects || [];
    if (!args.length) {
      typeOutput(list.map(p => `${p.id} — ${p.name}`).join('\n') + '\n');
      return;
    }
    const proj = list.find(p => p.id === args[0]);
    if (proj) {
      let out = `${proj.name}\n${proj.desc}\n`;
      if (proj.tech && proj.tech.length) out += `Tech: ${proj.tech.join(', ')}\n`;
      if (proj.url) out += `Link: <a href="${proj.url}" target="_blank">${proj.url}</a>\n`;
      typeOutput(out);
    } else {
      typeOutput('Project not found\n');
    }
  },
  certs() {
    const text = (profile.certs || []).join('\n');
    output.innerHTML += `<div><button class="copy-btn" data-copy="${text.replace(/"/g,'&quot;')}">copy</button><pre>${text}</pre></div>`;
  },
  writing() {
    const m = profile?.writing?.medium;
    typeOutput(m ? `Medium: <a href="${m}" target="_blank">${m}</a>\n` : 'No writing link\n');
  },
  links() {
    const links = profile.links || {};
    const out = Object.entries(links).map(([k,v]) => `${k}: <a href="${v}" target="_blank">${v}</a>`).join('\n');
    typeOutput((out ? out : 'No links') + '\n');
  },
  contact() {
    const mail = profile?.contact?.email ? `Email: <a href="mailto:${profile.contact.email}">${profile.contact.email}</a>` : '';
    const phone = profile?.contact?.phone ? `Phone: ${profile.contact.phone}` : '';
    const li = profile?.links?.linkedin ? `LinkedIn: <a href="${profile.links.linkedin}" target="_blank">profile</a>` : '';
    typeOutput([mail, phone, li].filter(Boolean).join('\n') + '\n');
  },
  clear() {
    clearScreen();
  },
  theme() {
    document.body.classList.toggle('light');
  },
  motd() {
    renderMotd();
  },
  'download-cv'() {
    const url = profile.cv || 'assets/cv/Selim_Enes_Cevik_CV_2025.pdf';
    window.open(url, '_blank');
  },
  open(args) {
    if (!args.length) {
      typeOutput('Usage: open <github|linkedin|medium|project-id>\n');
      return;
    }
    const key = args[0];
    const url = (profile.links && profile.links[key]) || ((profile.projects || []).find(p => p.id === key)?.url);
    if (url) {
      window.open(url, '_blank');
    } else {
      typeOutput('Link not found\n');
    }
  },
  ascii() {
    // Optional: reprint Mandalorian ASCII any time
    printBlock(MANDO_ASCII);
  }
};

const commandList = Object.keys(commands);

/* ---------- keyboard handling ---------- */

cmdInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const value = cmdInput.value.trim();
    echo(value);
    runCommand(value);
    if (value) history.push(value);
    histPos = history.length;
    cmdInput.value = '';
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
      typeOutput(matches.join('  ') + '\n');
    }
  } else if (e.key === 'Escape') {
    cmdInput.value = '';
  } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
    e.preventDefault();
    clearScreen();
  }
});

/* ---------- click-to-focus + copy buttons ---------- */

function focusCmd() {
  if (!cmdInput) return;
  if (document.visibilityState === 'visible') cmdInput.focus();
}

document.addEventListener('click', (e) => {
  const tag = (e.target.closest('a, button, [data-no-focus]'));
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
    typeOutput(`Command not found: ${cmd}\nType \`help\`.\n`);
  }
}