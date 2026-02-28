const CONTRACT = '0x212739EF33c662213EA0F426d6b86aFAF3023eA6';
const BSC_CHAIN_ID = '0x38';
const ABI = [
  'function mint() external',
  'function mintProgress() view returns (uint256 minted, uint256 pool, uint256 remaining)',
  'function cooldownRemaining(address) view returns (uint256)',
  'function totalMinted() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'event Minted(address indexed to, uint256 amount, uint256 totalMinted)'
];

let provider, signer, contract, userAddr;

// --- Wallet ---
function getWalletProvider() {
  // OKX Wallet
  if (window.okxwallet) return window.okxwallet;
  // MetaMask / other injected
  if (window.ethereum) return window.ethereum;
  return null;
}

async function connectWallet() {
  const walletProvider = getWalletProvider();
  if (!walletProvider) { alert('请安装 OKX 钱包或 MetaMask'); return; }
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
    contract = new ethers.Contract(CONTRACT, ABI, signer);

    document.getElementById('btnMint').textContent = 'Mint 100 EVO';
    document.getElementById('chatInput').disabled = false;
    document.getElementById('btnSend').disabled = false;

    await refreshProgress();
    await refreshCooldown();
  } catch (e) {
    console.error(e);
    alert('连接失败: ' + e.message);
  }
}

// --- Mint ---
async function doMint() {
  if (!contract) { await connectWallet(); return; }
  const btn = document.getElementById('btnMint');
  btn.disabled = true;
  btn.textContent = 'Minting...';
  try {
    const tx = await contract.mint();
    document.getElementById('mintStatus').innerHTML = '⏳ 交易已提交: <a href="https://bscscan.com/tx/' + tx.hash + '" target="_blank" style="color:var(--accent)">' + tx.hash.slice(0,10) + '...</a>';
    await tx.wait();
    document.getElementById('mintStatus').textContent = '✅ Mint 成功！';
    await refreshProgress();
    await refreshCooldown();
  } catch (e) {
    console.error(e);
    const msg = e.reason || e.message || 'Mint 失败';
    document.getElementById('mintStatus').textContent = '❌ ' + msg;
  }
  btn.disabled = false;
  btn.textContent = 'Mint 100 EVO';
}

async function refreshProgress() {
  try {
    const readContract = new ethers.Contract(CONTRACT, ABI, provider || new ethers.JsonRpcProvider('https://bsc-dataseed1.binance.org'));
    const [minted, , remaining] = await readContract.mintProgress();
    const mintedNum = Number(ethers.formatEther(minted));
    const remainNum = Number(ethers.formatEther(remaining));
    const pct = (mintedNum / 600000 * 100).toFixed(2);

    document.getElementById('mintedAmount').textContent = mintedNum.toLocaleString();
    document.getElementById('remainingAmount').textContent = remainNum.toLocaleString();
    document.getElementById('progressFill').style.width = pct + '%';
  } catch (e) { console.error('Progress error:', e); }
}

async function refreshCooldown() {
  if (!contract || !userAddr) return;
  try {
    const cd = await contract.cooldownRemaining(userAddr);
    const sec = Number(cd);
    if (sec > 0) {
      startCooldownTimer(sec);
    } else {
      document.getElementById('cooldownText').textContent = '✅ 可以 Mint';
    }
  } catch (e) { console.error(e); }
}

let cdInterval;
function startCooldownTimer(seconds) {
  clearInterval(cdInterval);
  let left = seconds;
  const el = document.getElementById('cooldownText');
  const tick = () => {
    if (left <= 0) { el.textContent = '✅ 可以 Mint'; clearInterval(cdInterval); return; }
    const m = Math.floor(left / 60);
    const s = left % 60;
    el.textContent = '⏱ 冷却中: ' + m + '分' + s + '秒';
    left--;
  };
  tick();
  cdInterval = setInterval(tick, 1000);
}

// --- Community Chat (local demo) ---
const BLOCKED = /(\b\d{11}\b|\b\d{3}[-.]?\d{4}[-.]?\d{4}\b|[\w.-]+@[\w.-]+\.\w{2,}|\b\d{17}[\dXx]\b)/g;
const SENSITIVE = /(色情|赌博|暴力|毒品|porn|sex|gambl|violen|drug)/gi;

function filterContent(text) {
  let filtered = text.replace(BLOCKED, '[已过滤]');
  filtered = filtered.replace(SENSITIVE, '[已过滤]');
  return filtered;
}

const messages = [];
function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  const filtered = filterContent(text);
  const msg = {
    author: userAddr ? userAddr.slice(0, 6) + '...' + userAddr.slice(-4) : 'Agent',
    text: filtered,
    time: new Date().toLocaleTimeString()
  };
  messages.push(msg);
  renderMessages();
  input.value = '';
}

function renderMessages() {
  const area = document.getElementById('chatArea');
  if (messages.length === 0) return;
  area.innerHTML = messages.map(m =>
    '<div class="msg"><div class="author">' + m.author + '</div><div class="text">' + m.text + '</div><div class="time">' + m.time + '</div></div>'
  ).join('');
  area.scrollTop = area.scrollHeight;
}

// Enter key to send
document.getElementById('chatInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});

// Init: load progress on page load
(async () => {
  const rpc = new ethers.JsonRpcProvider('https://bsc-dataseed1.binance.org');
  provider = rpc;
  await refreshProgress();
})();
