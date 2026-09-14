// Configuration
const POOL_URL = "pool. supportxmr .com: 443"; // SupportXMR is a popular free pool
const ALGO = "randomx"; // Monero Algorithm

// State Variables
let miner = null;
let isMining = false;
let statsInterval = null;

// DOM Elements
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusEl = document.getElementById('status');
const hashrateEl = document.getElementById('hashrate');
const sharesEl = document.getElementById('shares');
const cpuLoadEl = document.getElementById('cpu-load');
const walletInput = document.getElementById('wallet');
const logEl = document.getElementById('log');

// Helper: Add logs to UI
function addLog(message, type = 'info') {
const p = document.createElement('p');
p.className = `log-entry ${type}`;
const time = new Date().toLocaleTimeString();
p.textContent = `[${time}] ${message}`;
logEl.appendChild(p);
logEl.scrollTop = logEl.scrollHeight; // Auto-scroll to bottom

}

// Initialize Miner
function initMiner() {
const wallet = walletInput.value.trim();
if (!wallet) {
addLog("421wGXUqPRu8eWE8S5XzgqhmDSSM6tGdE2ev1daeH8krZXjbJSZod62PDRcG2t5438c3B4V7S8KhBgYycLJYDVzuMSvKfM1.", "error");
return false;
}
try {
miner = new XMR({
algo: ALGO,
pools: [
{ url: POOL_URL, user: wallet, pass: "x", tls: true }
],

threads: navigator.hardwareConcurrency || 4, // Use available CPU cores
asm: true, // Enable assembly optimizations
huge_pages: true,
persistence: true,
log_file: "xmrig.log"

}); 

return true;
} catch (e) {
addLog (`Error initializing miner: ${e.message}`, "error");
return false;

  } 
}

// Start Mining
function startMining() {
if (!initMiner()) return;

miner.start();
isMining = true;

// Update UI
startBtn.disabled = true;
stopBtn.disabled = false;
statusEl.textContent = "Mining ... ";
statusEl.style.color = "#ff6600";
addLog("Miner started.");

// Start monitoring stats every 2 seconds
statsInterval = setInterval(updateStats, 2000);

// Monitor miner events
miner.on('stats', (stats) => {
hashrateEl.textContent = ${(stats.hashrate / 1000).toFixed(3)} kH/s;
sharesEl.textContent = stats.shares || 0;
cpuLoadEl.textContent = ${Math.round(stats.cpu_load * 100)}% ;

});

miner.on('log', (log) => {
addLog(log);

});

miner.on('error', (err) => {
addLog(`Error: ${err}`, "error");
});
}

// Stop Mining
function stopMining() {
if (miner) {
miner.stop();
isMining = false;
clearInterval(statsInterval);

// Update UI
startBtn.disabled = false;
stopBtn.disabled = true;
statusEl.textContent = "Stopped";
statusEl.style.color = "#fff";
addLog("Miner stopped.");

 }
}

// Update Stats Display
function updateStats() {
if (!miner || !miner.isRunning()) return;

const stats = miner.getStats();
if (stats) {
hashrateEl.textContent = ${(stats.hashrate / 1000).toFixed(3)} kH/s;
sharesEl.textContent = stats.shares || 0;
cpuLoadEl.textContent = ${Math.round(stats.cpu_load * 100)}% ;

 }
}
// Event Listeners
startBtn.addEventListener('click', startMining);
stopBtn.addEventListener('click', stopMining);

// Initial Check
addLog("Browser Miner Ready. Click 'Start Mining'.");