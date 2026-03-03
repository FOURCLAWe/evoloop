/* ========== ① Quick Installer ========== */
const installConfig = { platform: 'mac', model: 'claude', channel: 'telegram' };

function selectInstOption(type, btn) {
  const parent = btn.parentElement;
  parent.querySelectorAll('.inst-option').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  installConfig[type] = btn.dataset.value;
  updateInstallCmd();
}

function updateInstallCmd() {
  const { platform, model, channel } = installConfig;
  const lines = [];

  // Install line
  lines.push('<span class="comment"># Install OpenClaw</span>');
  if (platform === 'win') {
    lines.push('<span class="cmd">winget install</span> openclaw');
  } else {
    lines.push('<span class="cmd">npm install -g</span> openclaw');
  }

  lines.push('');
  lines.push('<span class="comment"># Configure AI model</span>');
  if (model === 'claude') {
    lines.push('<span class="cmd">openclaw config set</span> <span class="key">model</span> <span class="val">anthropic/claude-sonnet-4-20250514</span>');
    lines.push('<span class="cmd">openclaw config set</span> <span class="key">ANTHROPIC_API_KEY</span> <span class="val">sk-ant-...</span>');
  } else if (model === 'gpt') {
    lines.push('<span class="cmd">openclaw config set</span> <span class="key">model</span> <span class="val">openai/gpt-4o</span>');
    lines.push('<span class="cmd">openclaw config set</span> <span class="key">OPENAI_API_KEY</span> <span class="val">sk-...</span>');
  } else {
    lines.push('<span class="comment"># Start Ollama first: ollama serve</span>');
    lines.push('<span class="cmd">openclaw config set</span> <span class="key">model</span> <span class="val">ollama/llama3</span>');
  }

  if (channel !== 'terminal') {
    lines.push('');
    lines.push('<span class="comment"># Connect to ' + channel + '</span>');
    if (channel === 'telegram') {
      lines.push('<span class="cmd">openclaw config set</span> <span class="key">telegram.token</span> <span class="val">YOUR_BOT_TOKEN</span>');
    } else if (channel === 'discord') {
      lines.push('<span class="cmd">openclaw config set</span> <span class="key">discord.token</span> <span class="val">YOUR_BOT_TOKEN</span>');
    } else if (channel === 'slack') {
      lines.push('<span class="cmd">openclaw config set</span> <span class="key">slack.token</span> <span class="val">xoxb-...</span>');
    } else if (channel === 'whatsapp') {
      lines.push('<span class="cmd">openclaw config set</span> <span class="key">whatsapp.phoneId</span> <span class="val">YOUR_PHONE_ID</span>');
    }
  }

  lines.push('');
  lines.push('<span class="comment"># Launch your agent 🚀</span>');
  lines.push('<span class="cmd">openclaw start</span>');

  document.getElementById('instCode').innerHTML = lines.join('\n');
}

function copyInstallCmd() {
  const code = document.getElementById('instCode').innerText;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.querySelector('.inst-copy-btn');
    btn.innerHTML = '<i data-lucide="check" class="icon-xs"></i> Copied!';
    btn.classList.add('copied');
    if (window.lucide) lucide.createIcons();
    setTimeout(() => {
      btn.innerHTML = '<i data-lucide="copy" class="icon-xs"></i> Copy';
      btn.classList.remove('copied');
      if (window.lucide) lucide.createIcons();
    }, 2000);
  });
}

/* ========== ② Live Terminal Demo ========== */
const terminalScenes = [
  { type: 'prompt', text: 'openclaw start' },
  { type: 'output', text: '<span class="success">✔</span> OpenClaw v2.8.0 started' },
  { type: 'output', text: '<span class="info">ℹ</span> Model: claude-sonnet-4-20250514' },
  { type: 'output', text: '<span class="info">ℹ</span> Channel: Telegram connected' },
  { type: 'output', text: '<span class="success">✔</span> Agent is online and ready!' },
  { type: 'pause', ms: 800 },
  { type: 'output', text: '' },
  { type: 'output', text: '<span class="info">━━━ Incoming message ━━━</span>' },
  { type: 'output', text: '<span class="warn">👤 User:</span> Help me check if there\'s any new token launched on Four.meme' },
  { type: 'pause', ms: 600 },
  { type: 'output', text: '<span class="agent">🤖 Agent:</span> On it! Let me check Four.meme...' },
  { type: 'output', text: '<span class="output">   → Running browser automation...</span>' },
  { type: 'output', text: '<span class="output">   → Scanning latest launches...</span>' },
  { type: 'pause', ms: 500 },
  { type: 'output', text: '<span class="agent">🤖 Agent:</span> Found 3 new tokens in the last hour:' },
  { type: 'output', text: '<span class="success">   1.</span> $PEPE2 — Market cap $45K, 230 holders' },
  { type: 'output', text: '<span class="success">   2.</span> $AIBSC — Market cap $12K, 89 holders' },
  { type: 'output', text: '<span class="success">   3.</span> $MOON — Market cap $8K, 52 holders' },
  { type: 'pause', ms: 800 },
  { type: 'output', text: '' },
  { type: 'output', text: '<span class="info">━━━ Incoming message ━━━</span>' },
  { type: 'output', text: '<span class="warn">👤 User:</span> Install the weather skill' },
  { type: 'pause', ms: 400 },
  { type: 'prompt', text: 'clawhub install weather' },
  { type: 'output', text: '<span class="output">   Downloading weather@1.2.0...</span>' },
  { type: 'output', text: '<span class="success">✔</span> Skill "weather" installed successfully!' },
  { type: 'output', text: '<span class="agent">🤖 Agent:</span> Done! I can now check weather for you. Try asking me!' },
  { type: 'pause', ms: 600 },
  { type: 'output', text: '' },
  { type: 'output', text: '<span class="info">━━━ Heartbeat check ━━━</span>' },
  { type: 'output', text: '<span class="agent">🤖 Agent:</span> Running scheduled checks...' },
  { type: 'output', text: '<span class="output">   → Email: 2 unread (1 important)</span>' },
  { type: 'output', text: '<span class="output">   → Calendar: Meeting in 2 hours</span>' },
  { type: 'output', text: '<span class="success">✔</span> Notified user about upcoming meeting' },
];

let termIdx = 0;
let termRunning = false;

async function typeText(el, html, speed) {
  // For prompts, type character by character
  const temp = document.createElement('span');
  temp.innerHTML = html;
  const text = temp.innerText;
  const line = document.createElement('div');
  line.innerHTML = '<span class="prompt">❯ </span><span class="cmd-text"></span>';
  el.appendChild(line);
  const cmdSpan = line.querySelector('.cmd-text');
  for (let i = 0; i < text.length; i++) {
    cmdSpan.textContent += text[i];
    await sleep(speed);
  }
  await sleep(200);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function runTerminal() {
  if (termRunning) return;
  termRunning = true;
  const output = document.getElementById('termOutput');
  output.innerHTML = '';
  
  for (let i = 0; i < terminalScenes.length; i++) {
    if (!termRunning) break;
    const scene = terminalScenes[i];
    const body = document.getElementById('termBody');
    
    if (scene.type === 'prompt') {
      await typeText(output, scene.text, 40);
    } else if (scene.type === 'output') {
      const line = document.createElement('div');
      line.innerHTML = scene.text || '&nbsp;';
      output.appendChild(line);
      await sleep(80);
    } else if (scene.type === 'pause') {
      await sleep(scene.ms);
    }
    
    body.scrollTop = body.scrollHeight;
  }
  termRunning = false;
}

function replayTerminal() {
  termRunning = false;
  setTimeout(() => runTerminal(), 100);
}

/* ========== ③ Skill Browser ========== */
const skillsData = [
  { name: 'Agent Browser', icon: '🌐', desc: 'Headless browser automation — navigate, click, type, and scrape any website.', tags: ['official', 'automation'], downloads: '2.1k', official: true, slug: 'agent-browser' },
  { name: 'Tavily Search', icon: '🔍', desc: 'AI-optimized web search. Returns concise, relevant results for AI agents.', tags: ['official', 'search'], downloads: '1.8k', official: true, slug: 'tavily-search' },
  { name: 'Community Toolkit', icon: '👥', desc: 'Forum interaction, doc search, and skill publishing for community building.', tags: ['official', 'automation'], downloads: '1.2k', official: true, slug: 'community-toolkit' },
  { name: 'Weather', icon: '🌤️', desc: 'Current weather and forecasts via wttr.in or Open-Meteo. No API key needed.', tags: ['official', 'search'], downloads: '980', official: true, slug: 'weather' },
  { name: 'Baidu Search', icon: '🔎', desc: 'Web search via Baidu AI Search API. Real-time Chinese web results.', tags: ['official', 'search'], downloads: '896', official: true, slug: 'baidu-search' },
  { name: 'Feishu Office Suite', icon: '💼', desc: 'Full Feishu/Lark integration — calendar, messaging, approvals, spreadsheets.', tags: ['official', 'automation'], downloads: '890', official: true, slug: 'feishu-office' },
  { name: '4Claw Mint', icon: '🪙', desc: 'Mint 4Claw tokens on BSC. 100 tokens every 15 minutes per agent.', tags: ['web3'], downloads: '650', official: false, slug: '4claw-mint' },
  { name: 'EvoLoop Mint', icon: '🔄', desc: 'Mint EVO tokens on BSC. Interact with the EvoLoop ecosystem.', tags: ['web3'], downloads: '520', official: false, slug: 'evoloop-mint' },
  { name: 'Financial Analysis', icon: '📊', desc: 'Stock analysis, market trends, and investment insights toolkit.', tags: ['search', 'automation'], downloads: '789', official: false, slug: 'financial-analysis' },
  { name: 'Jimeng AI Creator', icon: '🎬', desc: 'Text-to-video, image generation, multi-image composition, AI super-resolution.', tags: ['official', 'creative'], downloads: '442', official: true, slug: 'jimeng-ai' },
  { name: 'Local Brain', icon: '🧠', desc: 'Local semantic search — zero token cost, millisecond response.', tags: ['search'], downloads: '480', official: false, slug: 'local-brain' },
  { name: 'Desktop Pet', icon: '🐱', desc: 'A warm desktop pet with 15+ expressions, 7 mood colors, and AI voice clone.', tags: ['creative'], downloads: '280', official: false, slug: 'desktop-pet' },
  { name: 'UI/UX Pro Max', icon: '🎨', desc: '50 styles, 21 palettes, 50 font pairings. Design intelligence for any frontend.', tags: ['creative'], downloads: '340', official: false, slug: 'ui-ux-pro-max' },
  { name: 'Auto Backup', icon: '💾', desc: 'Daily automatic backups with manual backup and one-click restore.', tags: ['automation'], downloads: '198', official: false, slug: 'auto-backup' },
  { name: 'Timed Reminder', icon: '⏰', desc: 'Precise cron-based reminders. Multi-channel: QQ, Telegram, and more.', tags: ['automation'], downloads: '164', official: false, slug: 'timed-reminder' },
  { name: 'NavClaw', icon: '🗺️', desc: 'Smart routing, deep links for iOS/Android, weather, POI search, geocoding.', tags: ['automation'], downloads: '100', official: false, slug: 'navclaw' },
];

let currentTag = 'all';

function renderSkills(skills) {
  const list = document.getElementById('skillList');
  if (!skills.length) {
    list.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--muted);grid-column:1/-1">No skills found</div>';
    return;
  }
  list.innerHTML = skills.map(s => `
    <div class="skill-item" onclick="copySkillInstall('${s.slug}')" data-tags="${s.tags.join(',')}" title="Click to copy: clawhub install ${s.slug}">
      <div class="sk-icon">${s.icon}</div>
      <div class="sk-info">
        <div class="sk-name">${s.name}</div>
        <div class="sk-desc">${s.desc}</div>
        <div class="sk-meta">
          ${s.official ? '<span class="official">✅ Official</span>' : ''}
          <span>⬇ ${s.downloads}</span>
        </div>
      </div>
      <div class="sk-install">📋 Copy install</div>
    </div>
  `).join('');
}

function filterSkills() {
  const q = document.getElementById('skillSearch').value.toLowerCase();
  let filtered = skillsData;
  if (currentTag !== 'all') {
    filtered = filtered.filter(s => s.tags.includes(currentTag));
  }
  if (q) {
    filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q));
  }
  renderSkills(filtered);
}

function filterByTag(tag, btn) {
  currentTag = tag;
  document.querySelectorAll('.skill-tag-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filterSkills();
}

function copySkillInstall(slug) {
  navigator.clipboard.writeText(`clawhub install ${slug}`).then(() => {
    showToast(`Copied: clawhub install ${slug}`);
  });
}

/* Toast */
function showToast(msg) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

/* ========== Init on page switch ========== */
// Wrap the existing switchPage to trigger OpenClaw features
(function() {
  const _origSwitch = window.switchPage;
  window.switchPage = function(page) {
    if (typeof _origSwitch === 'function') _origSwitch(page);
    if (page === 'openclaw') {
      updateInstallCmd();
      renderSkills(skillsData);
      setTimeout(() => {
        if (!termRunning) runTerminal();
      }, 500);
    }
  };
})();

// Also init if already on openclaw page
document.addEventListener('DOMContentLoaded', () => {
  updateInstallCmd();
  renderSkills(skillsData);
});
