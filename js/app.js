const BSC_CHAIN_ID = '0x38';

let provider, signer, userAddr;

// --- Particles ---
function initParticles() {
  const c = document.getElementById('particles');
  const ctx = c.getContext('2d');
  let w = c.width = window.innerWidth;
  let h = c.height = window.innerHeight;
  const particles = [];
  const count = Math.min(60, Math.floor(w * h / 15000));

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = window._particleColor || 'rgba(99, 102, 241, 0.5)';
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.strokeStyle = window._particleLine || 'rgba(99, 102, 241, 0.06)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        if (dx * dx + dy * dy < 15000) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('resize', () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; });
}

// --- Scroll Animations ---
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// --- Count Up ---
function countUp(el, target, duration) {
  const start = 0;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCountUp() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = 'true';
        const target = parseInt(e.target.dataset.count);
        if (target > 0) countUp(e.target, target, 1500);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}

// --- FAQ ---
function toggleFaq(el) {
  const item = el.parentElement;
  item.classList.toggle('open');
}

// --- Wallet ---
function getWalletProvider() {
  if (window.okxwallet) return window.okxwallet;
  if (window.ethereum) return window.ethereum;
  return null;
}

async function connectWallet() {
  const walletProvider = getWalletProvider();
  if (!walletProvider) { alert('Please install OKX Wallet or MetaMask'); return; }
  try {
    await walletProvider.request({ method: 'eth_requestAccounts' });
    const chainId = await walletProvider.request({ method: 'eth_chainId' });
    if (chainId !== BSC_CHAIN_ID) {
      await walletProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_CHAIN_ID }]
      }).catch(async () => {
        await walletProvider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: BSC_CHAIN_ID, chainName: 'BNB Smart Chain',
            rpcUrls: ['https://bsc-dataseed1.binance.org'],
            nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
            blockExplorerUrls: ['https://bscscan.com']
          }]
        });
      });
    }
    provider = new ethers.BrowserProvider(walletProvider);
    signer = await provider.getSigner();
    userAddr = await signer.getAddress();

    const short = userAddr.slice(0, 6) + '...' + userAddr.slice(-4);
    document.getElementById('btnWallet').textContent = short;
    document.getElementById('btnWallet').classList.add('connected');
    document.getElementById('chatInput').disabled = false;
    document.getElementById('btnSend').disabled = false;
  } catch (e) {
    console.error(e);
    alert('Connection failed: ' + e.message);
  }
}

// --- Mint (Coming Soon) ---
async function doMint() {
  alert('Token not launched yet. Stay tuned!');
}

// --- Community Chat ---
const BLOCKED = /(\b\d{11}\b|\b\d{3}[-.]?\d{4}[-.]?\d{4}\b|[\w.-]+@[\w.-]+\.\w{2,}|\b\d{17}[\dXx]\b)/g;
const SENSITIVE = /(色情|赌博|暴力|毒品|porn|sex|gambl|violen|drug)/gi;

function filterContent(text) {
  let filtered = text.replace(BLOCKED, '[filtered]');
  filtered = filtered.replace(SENSITIVE, '[filtered]');
  return filtered;
}

const messages = [];
function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  const filtered = filterContent(text);
  messages.push({
    author: userAddr ? userAddr.slice(0, 6) + '...' + userAddr.slice(-4) : 'Agent',
    text: filtered,
    time: new Date().toLocaleTimeString()
  });
  renderMessages();
  input.value = '';
}

function renderMessages() {
  const area = document.getElementById('chatArea');
  if (messages.length === 0) return;
  area.innerHTML = messages.map(m =>
    '<div class="msg"><div class="author">' + m.author +
    '</div><div class="text">' + m.text +
    '</div><div class="time">' + m.time + '</div></div>'
  ).join('');
  area.scrollTop = area.scrollHeight;
}

document.getElementById('chatInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});

// --- Init ---
(async () => {
  if (window.lucide) lucide.createIcons();
  initParticles();
  initScrollAnimations();
  initCountUp();
})();

// --- Mouse Glow ---
(function() {
  const glow = document.createElement('div');
  glow.className = 'mouse-glow';
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();

// --- Card Mouse Track ---
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
    card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
  });
});

// --- Button Ripple ---
document.querySelectorAll('.btn-mint, .btn-primary').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// --- Card Tilt ---
document.querySelectorAll('.card, .stat-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = 'perspective(600px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) translateY(-4px)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// --- Theme Toggle ---
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('evoloop-theme', next);
  updateThemeIcon(next);
  updateParticleColors(next);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.setAttribute('data-lucide', theme === 'light' ? 'moon' : 'sun');
    if (window.lucide) lucide.createIcons();
  }
}

function updateParticleColors(theme) {
  window._particleColor = theme === 'light' ? 'rgba(79, 70, 229, 0.4)' : 'rgba(99, 102, 241, 0.5)';
  window._particleLine = theme === 'light' ? 'rgba(79, 70, 229, 0.08)' : 'rgba(99, 102, 241, 0.06)';
}

// Init theme from localStorage
(function() {
  const saved = localStorage.getItem('evoloop-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);
    updateParticleColors(saved);
  }
})();
