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

const tips = [
  "↑/↓ ile komut geçmişi",
  "`theme` ile tema değiştir",
  "`open github` ile GitHub’ı aç",
  "`download-cv` ile CV indir",
  "`projects` sonra `projects <ad>` ile detaylar"
];

function greetingByHour(h) {
  if (h < 5) return "İyi geceler";
  if (h < 12) return "Günaydın";
  if (h < 18) return "İyi günler";
  return "İyi akşamlar";
}

function renderMotd() {
  const now = new Date();
  const tip = tips[Math.floor(Math.random() * tips.length)];
  const greet = greetingByHour(now.getHours());
  printBlock([
    "  ____      _        ",
    " |  _ \\ ___| |_ __ _ ",
    " | |_) / _ \\ __/ _` |",
    "Welcome 👋 — type `help` to begin.",
    "",
    `${greet}! Ben Selim Enes Çevik — Platform & Cloud-Native (OpenShift/K8s, Ceph, S3, CI/CD, Ansible).`,
    "Şu an Türk Telekom’da Ceph Team Lead.",
    "",
    "Sık kullanılanlar: `about`, `projects`, `links`",
    `İpucu: ${tip}`
  ]);
}

fetch('data/profile.json')
  .then(r => r.json())
  .then(j => { profile = j; init(); });

function init() {
  renderMotd();
  handleHash();
}

function handleHash() {
  const hash = decodeURIComponent(location.hash.replace('#',''));
  if (!hash) return;
  runCommand(hash);
}

function echo(cmd) {
  const line = `<span class="prompt">${PROMPT}</span> ${cmd}`;
  output.innerHTML += line + '<br>';
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

const commands = {
  help() {
    const cmds = Object.keys(commands).join(', ');
    typeOutput(`Komutlar: ${cmds}\n`);
  },
  about() {
    typeOutput(profile.about + '\n');
  },
  skills() {
    typeOutput(profile.skills.map(s => '• ' + s).join('\n') + '\n');
  },
  experience() {
    let out = '';
    profile.experience.forEach(e => {
      out += `• ${e.company} — ${e.role} (${e.years})\n`;
      e.details.forEach(d => out += `  - ${d}\n`);
    });
    typeOutput(out);
  },
  projects(args) {
    if (!args.length) {
      typeOutput(profile.projects.map(p => `${p.id} — ${p.name}`).join('\n') + '\n');
      return;
    }
    const proj = profile.projects.find(p => p.id === args[0]);
    if (proj) {
      let out = `${proj.name}\n${proj.desc}\n`;
      if (proj.tech && proj.tech.length) out += `Teknolojiler: ${proj.tech.join(', ')}\n`;
      if (proj.url) out += `Bağlantı: <a href="${proj.url}" target="_blank">${proj.url}</a>\n`;
      typeOutput(out);
    } else {
      typeOutput('Proje bulunamadı\n');
    }
  },
  certs() {
    const text = profile.certs.join('\n');
    const id = 'cert-' + Date.now();
    output.innerHTML += `<div><button class="copy-btn" data-copy="${text.replace(/"/g,'&quot;')}">kopyala</button><pre>${text}</pre></div>`;
  },
  writing() {
    typeOutput(`Medium: <a href="${profile.writing.medium}" target="_blank">${profile.writing.medium}</a>\n`);
  },
  links() {
    const out = Object.entries(profile.links).map(([k,v]) => `${k}: <a href="${v}" target="_blank">${v}</a>`).join('\n');
    typeOutput(out + '\n');
  },
  contact() {
    typeOutput(`E-posta: <a href="mailto:${profile.contact.email}">${profile.contact.email}</a>\nPGP yoksa düz mail.\nLinkedIn: <a href="${profile.links.linkedin}" target="_blank">profil</a>\n`);
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
    window.open('assets/cv/Selim_Enes_Cevik_CV_2025.pdf', '_blank');
  },
  open(args) {
    if (!args.length) {
      typeOutput('Kullanım: open <github|linkedin|medium|proje-id>\n');
      return;
    }
    const key = args[0];
    const url = profile.links[key] || (profile.projects.find(p=>p.id===key)?.url);
    if (url) {
      window.open(url, '_blank');
    } else {
      typeOutput('Bağlantı bulunamadı\n');
    }
  }
};

const commandList = Object.keys(commands);

cmdInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const value = cmdInput.value.trim();
    echo(value);
    runCommand(value);
    history.push(value);
    histPos = history.length;
    cmdInput.value = '';
  } else if (e.key === 'ArrowUp') {
    if (histPos > 0) {
      histPos--;
      cmdInput.value = history[histPos];
      setTimeout(()=>cmdInput.setSelectionRange(cmdInput.value.length, cmdInput.value.length),0);
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

function runCommand(line) {
  const [cmd, ...args] = line.split(' ').filter(Boolean);
  if (!cmd) return;
  const fn = commands[cmd];
  if (fn) {
    fn(args);
  } else {
    typeOutput(`Komut bulunamadı: ${cmd}\nhelp yazınız.\n`);
  }
}

output.addEventListener('click', e => {
  if (e.target.classList.contains('copy-btn')) {
    const text = e.target.dataset.copy;
    navigator.clipboard.writeText(text).then(() => {
      e.target.textContent = 'kopyalandı';
      setTimeout(() => (e.target.textContent = 'kopyala'), 2000);
    });
  }
});

window.addEventListener('hashchange', handleHash);

const input = document.getElementById('cmdInput');

function focusCmd() {
  if (!input) return;
  if (document.visibilityState === 'visible') input.focus();
}

document.addEventListener('click', (e) => {
  const tag = (e.target.closest('a, button, [data-no-focus]'));
  if (tag) return;
  focusCmd();
});

window.addEventListener('load', focusCmd);
document.addEventListener('visibilitychange', focusCmd);