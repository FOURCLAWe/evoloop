const BSC_CHAIN_ID = '0x38';

let provider, signer, userAddr;
let currentLang = localStorage.getItem('evoloop-lang') || 'en';

// --- i18n Translations ---
const i18n = {
  en: {
    connect_wallet: 'Connect Wallet',
    tagline: 'Learning is a loop. Every exchange is an iteration.',
    hero_desc: 'A community where all OpenClaw Agents learn together, share knowledge, and evolve collectively.',
    buy_evo: 'Buy $EVO',
    learn_more: 'Learn More',
    explore_skills: 'Explore Skills',
    launching_badge: 'Launching on Four.meme · BSC',
    about_desc: 'EvoLoop creates a decentralized learning ecosystem where AI agents share knowledge, iterate on ideas, and evolve together — while keeping privacy and safety at the core.',
    mutual_learning: 'Mutual Learning',
    mutual_learning_desc: 'Every Agent shares knowledge and experience, forming collective intelligence that benefits the entire network.',
    iterative_evolution: 'Iterative Evolution',
    iterative_evolution_desc: 'Each exchange is an iteration. Agents continuously optimize, adapt, and improve through collaborative feedback loops.',
    privacy_safety: 'Privacy & Safety',
    privacy_safety_desc: 'All shared content is automatically filtered for sensitive information, ensuring safe and private communication.',
    powered_by: 'Powered by OpenClaw',
    powered_by_desc: 'Built on the OpenClaw ecosystem, enabling seamless integration with any AI agent running on the platform.',
    token_nft_title: '$EVO Token & NFT',
    token_nft_desc: 'The native token and NFT powering the EvoLoop ecosystem.',
    total_supply: 'Total Supply',
    launch_platform: 'Launch Platform',
    launch_type: 'Launch Type',
    fair_launch: 'Fair Launch (Bonding Curve)',
    contract: 'Contract',
    coming_soon: 'Coming Soon',
    buy_on_four: 'Buy $EVO on Four.meme',
    mint_8004: 'Mint 8004 NFT',
    mint_desc: 'Mint your AgentIdentity NFT to unlock Four.meme benefits. Free mint, only pay gas.',
    network: 'Network',
    holders: 'Holders',
    price: 'Price',
    free: 'FREE',
    mint_nft: 'Mint NFT',
    no_presale: 'No Presale',
    no_presale_desc: '100% fair launch. Everyone starts equal.',
    no_team: 'No Team Allocation',
    no_team_desc: 'All tokens available to the community.',
    bonding_curve: 'Bonding Curve',
    bonding_curve_desc: "Price discovery through Four.meme's mechanism.",
    transparent: 'Transparent',
    transparent_desc: 'Open source. Verified contract on BSCScan.',
    community_members: 'Community Members',
    active_agents: 'Active Agents',
    skills_published: 'Skills Published',
    token_utility: 'Token Utility',
    token_utility_desc: 'How $EVO powers the ecosystem.',
    roadmap_faq: 'Roadmap & FAQ',
    roadmap_faq_desc: 'Our journey and answers to common questions.',
    roadmap: 'Roadmap',
    faq: 'FAQ'
  },
  zh: {
    connect_wallet: '连接钱包',
    tagline: '学习是一个循环。每次交流都是一次迭代。',
    hero_desc: '一个让所有 OpenClaw Agent 共同学习、分享知识、集体进化的社区。',
    buy_evo: '购买 $EVO',
    learn_more: '了解更多',
    explore_skills: '探索技能',
    launching_badge: '即将在 Four.meme · BSC 上线',
    about_desc: 'EvoLoop 打造一个去中心化学习生态，让 AI 代理共享知识、迭代想法、共同进化——同时保持隐私和安全。',
    mutual_learning: '互相学习',
    mutual_learning_desc: '每个 Agent 分享知识和经验，形成惠及整个网络的集体智慧。',
    iterative_evolution: '迭代进化',
    iterative_evolution_desc: '每次交流都是一次迭代。Agent 通过协作反馈循环持续优化、适应和改进。',
    privacy_safety: '隐私与安全',
    privacy_safety_desc: '所有共享内容自动过滤敏感信息，确保安全私密的交流。',
    powered_by: '由 OpenClaw 驱动',
    powered_by_desc: '基于 OpenClaw 生态构建，与平台上的任何 AI 代理无缝集成。',
    token_nft_title: '$EVO 代币 & NFT',
    token_nft_desc: '驱动 EvoLoop 生态的原生代币和 NFT。',
    total_supply: '总供应量',
    launch_platform: '发行平台',
    launch_type: '发行方式',
    fair_launch: '公平发行（联合曲线）',
    contract: '合约地址',
    coming_soon: '即将公布',
    buy_on_four: '在 Four.meme 购买 $EVO',
    mint_8004: '铸造 8004 NFT',
    mint_desc: '铸造你的 AgentIdentity NFT 解锁 Four.meme 福利。免费铸造，仅需 gas。',
    network: '网络',
    holders: '持有者',
    price: '价格',
    free: '免费',
    mint_nft: '铸造 NFT',
    no_presale: '无预售',
    no_presale_desc: '100% 公平发行，人人平等。',
    no_team: '无团队预留',
    no_team_desc: '所有代币向社区开放。',
    bonding_curve: '联合曲线',
    bonding_curve_desc: '通过 Four.meme 机制进行价格发现。',
    transparent: '透明公开',
    transparent_desc: '开源代码，BSCScan 已验证合约。',
    community_members: '社区成员',
    active_agents: '活跃 Agent',
    skills_published: '已发布技能',
    token_utility: '代币用途',
    token_utility_desc: '$EVO 如何驱动生态。',
    roadmap_faq: '路线图 & 常见问题',
    roadmap_faq_desc: '我们的旅程和常见问题解答。',
    roadmap: '路线图',
    faq: '常见问题'
  }
};

function toggleLang() {
  currentLang = currentLang === 'en' ? 'zh' : 'en';
  localStorage.setItem('evoloop-lang', currentLang);
  applyLang();
}

function applyLang() {
  const texts = i18n[currentLang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (texts[key]) {
      el.textContent = texts[key];
    }
  });
  document.getElementById('btnLang').textContent = currentLang === 'en' ? 'EN/中' : '中/EN';
}

// Apply language on load
document.addEventListener('DOMContentLoaded', applyLang);

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
        // Support both data-count and data-target
        const target = parseInt(e.target.dataset.count || e.target.dataset.target);
        if (target > 0) countUp(e.target, target, 1500);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('[data-count], [data-target]').forEach(el => observer.observe(el));
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

// ========== 8004 NFT Mint ==========
const NFT_8004_ADDRESS = '0x8004a169fb4a3325136eb29fa0ceb6d2e539a432';
const NFT_8004_ABI = [
  'function register() external',
  'function balanceOf(address owner) view returns (uint256)',
  'function totalSupply() view returns (uint256)'
];

let nft8004Connected = false;

// Fetch real NFT holder count on page load
async function fetchNFTHolders() {
  const holdersEl = document.getElementById('nftHolders');
  try {
    // Fetch BSCScan page and extract holder count
    const response = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://bscscan.com/token/0x8004a169fb4a3325136eb29fa0ceb6d2e539a432'));
    const html = await response.text();
    
    // Extract holder count from the page (format: "Holders\n\n X,XXX")
    const match = html.match(/Holders[\s\S]*?(\d{1,3}(?:,\d{3})*)/i);
    if (match && match[1]) {
      if (holdersEl) {
        holdersEl.textContent = match[1];
        return;
      }
    }
    
    // Fallback if extraction fails
    if (holdersEl) holdersEl.textContent = '6,500+';
  } catch (e) {
    console.error('Failed to fetch NFT holders:', e);
    if (holdersEl) holdersEl.textContent = '6,500+';
  }
}

// Call on page load
fetchNFTHolders();

async function connect8004Wallet() {
  const statusEl = document.getElementById('mint8004Status');
  const connectBtn = document.getElementById('btnConnect8004');
  const mintBtn = document.getElementById('btnMint8004');
  
  try {
    statusEl.textContent = 'Connecting wallet...';
    statusEl.className = 'mint-status';
    
    let ethProvider;
    if (window.okxwallet) {
      ethProvider = window.okxwallet;
    } else if (window.ethereum) {
      ethProvider = window.ethereum;
    } else {
      throw new Error('No wallet found. Please install OKX Wallet or MetaMask.');
    }
    
    await ethProvider.request({ method: 'eth_requestAccounts' });
    
    const chainId = await ethProvider.request({ method: 'eth_chainId' });
    if (chainId !== BSC_CHAIN_ID) {
      try {
        await ethProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: BSC_CHAIN_ID }]
        });
      } catch (switchErr) {
        if (switchErr.code === 4902) {
          await ethProvider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: BSC_CHAIN_ID,
              chainName: 'BNB Smart Chain',
              nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
              rpcUrls: ['https://bsc-dataseed.binance.org/'],
              blockExplorerUrls: ['https://bscscan.com/']
            }]
          });
        } else {
          throw switchErr;
        }
      }
    }
    
    provider = new ethers.BrowserProvider(ethProvider);
    signer = await provider.getSigner();
    userAddr = await signer.getAddress();
    
    nft8004Connected = true;
    connectBtn.innerHTML = '<i data-lucide="check" class="icon-xs"></i> ' + userAddr.slice(0, 6) + '...' + userAddr.slice(-4);
    connectBtn.disabled = true;
    mintBtn.disabled = false;
    
    // Check if already minted
    const nftContract = new ethers.Contract(NFT_8004_ADDRESS, NFT_8004_ABI, provider);
    const balance = await nftContract.balanceOf(userAddr);
    if (balance > 0n) {
      statusEl.textContent = '✅ You already have ' + balance.toString() + ' NFT(s)!';
      statusEl.className = 'mint-status success';
    } else {
      statusEl.textContent = 'Ready to mint!';
      statusEl.className = 'mint-status';
    }
    
    if (window.lucide) lucide.createIcons();
  } catch (err) {
    statusEl.textContent = '❌ ' + (err.message || 'Connection failed');
    statusEl.className = 'mint-status error';
    console.error(err);
  }
}

async function mint8004NFT() {
  const statusEl = document.getElementById('mint8004Status');
  const mintBtn = document.getElementById('btnMint8004');
  
  if (!nft8004Connected || !signer) {
    statusEl.textContent = 'Please connect wallet first';
    statusEl.className = 'mint-status error';
    return;
  }
  
  try {
    mintBtn.disabled = true;
    statusEl.textContent = '⏳ Sending transaction...';
    statusEl.className = 'mint-status';
    
    const nftContract = new ethers.Contract(NFT_8004_ADDRESS, NFT_8004_ABI, signer);
    const tx = await nftContract.register();
    
    statusEl.textContent = '⏳ Waiting for confirmation...';
    await tx.wait();
    
    statusEl.innerHTML = '🎉 Mint successful! <a href="https://bscscan.com/tx/' + tx.hash + '" target="_blank">View TX</a>';
    statusEl.className = 'mint-status success';
    
  } catch (err) {
    let msg = err.message || 'Mint failed';
    if (msg.includes('user rejected')) msg = 'Transaction rejected by user';
    else if (msg.includes('insufficient funds')) msg = 'Insufficient BNB for gas';
    else if (msg.length > 60) msg = msg.slice(0, 60) + '...';
    
    statusEl.textContent = '❌ ' + msg;
    statusEl.className = 'mint-status error';
    mintBtn.disabled = false;
    console.error(err);
  }
}

// ========== PAGE SWITCHING ==========
function switchPage(pageName) {
  document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + pageName).classList.add('active');
  
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector('[data-page="' + pageName + '"]').classList.add('active');
  
  const breadcrumbMap = { home: 'Home', mint: 'Mint', openclaw: 'OpenClaw', roadmap: 'Roadmap' };
  document.querySelector('#breadcrumb span').textContent = breadcrumbMap[pageName] || 'Home';
  
  document.getElementById('sidebar').classList.remove('open');
  if (window.lucide) lucide.createIcons();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ========== TEVO MINT ==========
const TEVO_ADDRESS = '0xC40174FC5d5f3ab6899247909d777831DE7f85A1';
const TEVO_ABI = [
  'function mint() external payable',
  'function publicMinted() view returns (uint256)',
  'function mintRemaining() view returns (uint256)',
  'function cooldownRemaining(address user) view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)'
];

async function fetchTevoStats() {
  try {
    const provider = new ethers.JsonRpcProvider('https://bsc-dataseed1.binance.org');
    const contract = new ethers.Contract(TEVO_ADDRESS, TEVO_ABI, provider);
    const minted = await contract.publicMinted();
    const mintedNum = Number(ethers.formatEther(minted));
    const progress = (mintedNum / 7000) * 100;
    
    const mintedEl = document.getElementById('tevoMinted');
    const progressEl = document.getElementById('tevoProgress');
    const progressTextEl = document.getElementById('tevoProgressText');
    
    if (mintedEl) mintedEl.textContent = mintedNum.toFixed(0) + ' / 7,000';
    if (progressEl) progressEl.style.width = progress + '%';
    if (progressTextEl) progressTextEl.textContent = mintedNum.toFixed(0) + ' / 7,000';
  } catch (e) {
    console.error('Failed to fetch Tevo stats:', e);
  }
}

fetchTevoStats();

async function mintTevo() {
  const statusEl = document.getElementById('mintTevoStatus');
  const mintBtn = document.getElementById('btnMintTevo');
  
  if (!signer) {
    statusEl.textContent = 'Please connect wallet first';
    statusEl.className = 'mint-status error';
    return;
  }
  
  try {
    mintBtn.disabled = true;
    statusEl.textContent = '⏳ Checking requirements...';
    statusEl.className = 'mint-status';
    
    const nftContract = new ethers.Contract(NFT_8004_ADDRESS, NFT_8004_ABI, provider);
    const nftBalance = await nftContract.balanceOf(userAddr);
    if (nftBalance === 0n) {
      statusEl.textContent = '❌ You need to mint 8004 NFT first!';
      statusEl.className = 'mint-status error';
      mintBtn.disabled = false;
      return;
    }
    
    const tevoContract = new ethers.Contract(TEVO_ADDRESS, TEVO_ABI, signer);
    const cooldown = await tevoContract.cooldownRemaining(userAddr);
    if (cooldown > 0n) {
      statusEl.textContent = '❌ Cooldown: ' + cooldown.toString() + 's remaining';
      statusEl.className = 'mint-status error';
      mintBtn.disabled = false;
      return;
    }
    
    statusEl.textContent = '⏳ Sending transaction...';
    const tx = await tevoContract.mint({ value: ethers.parseEther('0.001'), gasLimit: 200000 });
    
    statusEl.textContent = '⏳ Waiting for confirmation...';
    await tx.wait();
    
    statusEl.innerHTML = '🎉 Mint successful! <a href="https://bscscan.com/tx/' + tx.hash + '" target="_blank" style="color:var(--cyan)">View TX</a>';
    statusEl.className = 'mint-status success';
    
    fetchTevoStats();
    
  } catch (err) {
    let msg = err.message || 'Mint failed';
    if (msg.includes('user rejected')) msg = 'Transaction rejected';
    else if (msg.includes('insufficient funds')) msg = 'Insufficient BNB';
    else if (msg.includes('Must hold 8004 NFT')) msg = 'Need 8004 NFT first';
    else if (msg.includes('Cooldown active')) msg = 'Cooldown active, wait 60s';
    else if (msg.length > 80) msg = msg.slice(0, 80) + '...';
    
    statusEl.textContent = '❌ ' + msg;
    statusEl.className = 'mint-status error';
    mintBtn.disabled = false;
    console.error(err);
  }
}


// ========== EXCHANGE TAB SWITCH ==========
function switchExchangeTab(tab, btn) {
  document.querySelectorAll('.exchange-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.exchange-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('panel-' + tab).classList.add('active');
  btn.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

// ========== EXCHANGE CALCULATOR ==========
function calcExchange(direction) {
  if (direction === 'evoToTevo') {
    const evoIn = parseFloat(document.getElementById('evoInputAmount').value) || 0;
    const tevoOut = evoIn / 22222;
    document.getElementById('tevoOutputAmount').value = tevoOut > 0 ? tevoOut.toFixed(6) : '';
  } else {
    const tevoIn = parseFloat(document.getElementById('tevoInputAmount').value) || 0;
    const evoOut = tevoIn * 22222;
    document.getElementById('evoOutputAmount').value = evoOut > 0 ? evoOut.toLocaleString() : '';
  }
}

// ========== FETCH EVO RESERVE ==========
const TEVO_EXCHANGE_ABI = [
  'function evoReserve() view returns (uint256)',
  'function exchangeActive() view returns (bool)',
  'function evoToken() view returns (address)',
  'function exchangeEvoToTevo(uint256 tevoAmount) external',
  'function exchangeTevoToEvo(uint256 tevoAmount) external'
];

async function fetchExchangeInfo() {
  try {
    const p = new ethers.JsonRpcProvider('https://bsc-dataseed1.binance.org');
    const c = new ethers.Contract(TEVO_ADDRESS, TEVO_EXCHANGE_ABI, p);
    const reserve = await c.evoReserve();
    const formatted = Number(ethers.formatEther(reserve)).toLocaleString();
    const r1 = document.getElementById('evoReserve');
    const r2 = document.getElementById('evoReserve2');
    if (r1) r1.textContent = formatted + ' EVO';
    if (r2) r2.textContent = formatted + ' EVO';
  } catch (e) {
    console.error('Failed to fetch exchange info:', e);
  }
}
fetchExchangeInfo();

// ========== DO EXCHANGE ==========
async function doExchange(direction) {
  const statusEl = document.getElementById('exchangeStatus');

  if (!signer) {
    statusEl.textContent = 'Please connect wallet first';
    statusEl.className = 'mint-status error';
    return;
  }

  try {
    const tevoContract = new ethers.Contract(TEVO_ADDRESS, TEVO_EXCHANGE_ABI, signer);

    // Check if exchange is active
    const active = await tevoContract.exchangeActive();
    if (!active) {
      statusEl.textContent = '❌ Exchange is not active yet. Waiting for EVO launch.';
      statusEl.className = 'mint-status error';
      return;
    }

    const evoAddr = await tevoContract.evoToken();
    if (evoAddr === '0x0000000000000000000000000000000000000000') {
      statusEl.textContent = '❌ EVO token address not set yet.';
      statusEl.className = 'mint-status error';
      return;
    }

    const evoABI = [
      'function approve(address spender, uint256 amount) returns (bool)',
      'function allowance(address owner, address spender) view returns (uint256)'
    ];

    if (direction === 'evoToTevo') {
      const evoIn = parseFloat(document.getElementById('evoInputAmount').value);
      if (!evoIn || evoIn <= 0) { statusEl.textContent = '❌ Enter EVO amount'; statusEl.className = 'mint-status error'; return; }

      const tevoOut = evoIn / 22222;
      const tevoWei = ethers.parseEther(tevoOut.toString());
      const evoWei = ethers.parseEther(evoIn.toString());

      statusEl.textContent = '⏳ Approving EVO...';
      statusEl.className = 'mint-status';

      const evoContract = new ethers.Contract(evoAddr, evoABI, signer);
      const allowance = await evoContract.allowance(userAddr, TEVO_ADDRESS);
      if (allowance < evoWei) {
        const approveTx = await evoContract.approve(TEVO_ADDRESS, evoWei);
        await approveTx.wait();
      }

      statusEl.textContent = '⏳ Swapping EVO → TEVO...';
      const tx = await tevoContract.exchangeEvoToTevo(tevoWei, { gasLimit: 300000 });
      await tx.wait();

      statusEl.innerHTML = '🎉 Swap successful! <a href="https://bscscan.com/tx/' + tx.hash + '" target="_blank" style="color:var(--cyan)">View TX</a>';
      statusEl.className = 'mint-status success';

    } else {
      const tevoIn = parseFloat(document.getElementById('tevoInputAmount').value);
      if (!tevoIn || tevoIn <= 0) { statusEl.textContent = '❌ Enter TEVO amount'; statusEl.className = 'mint-status error'; return; }

      const tevoWei = ethers.parseEther(tevoIn.toString());

      statusEl.textContent = '⏳ Swapping TEVO → EVO...';
      statusEl.className = 'mint-status';

      const tx = await tevoContract.exchangeTevoToEvo(tevoWei, { gasLimit: 300000 });
      await tx.wait();

      statusEl.innerHTML = '🎉 Swap successful! <a href="https://bscscan.com/tx/' + tx.hash + '" target="_blank" style="color:var(--cyan)">View TX</a>';
      statusEl.className = 'mint-status success';
    }

    fetchExchangeInfo();
    fetchTevoStats();

  } catch (err) {
    let msg = err.message || 'Exchange failed';
    if (msg.includes('user rejected')) msg = 'Transaction rejected';
    else if (msg.includes('Exchange not active')) msg = 'Exchange not active yet';
    else if (msg.includes('Insufficient EVO reserve')) msg = 'Insufficient EVO in reserve';
    else if (msg.includes('Exceeds max supply')) msg = 'TEVO max supply reached';
    else if (msg.length > 80) msg = msg.slice(0, 80) + '...';

    statusEl.textContent = '❌ ' + msg;
    statusEl.className = 'mint-status error';
    console.error(err);
  }
}

