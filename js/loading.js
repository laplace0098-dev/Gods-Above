/* ─── LOADING SCREEN ─── */
let loadingDone = false;
const enterBtn = document.getElementById('enter-btn');
const loadingPct = document.getElementById('loading-pct');

let pct = 0;
const loadInterval = setInterval(() => {
  pct += Math.random() * 4 + 1;
  if (pct >= 100) {
    pct = 100;
    clearInterval(loadInterval);
    loadingDone = true;
    setTimeout(() => { enterBtn.classList.add('ready'); }, 600);
  }
  loadingPct.textContent = Math.floor(pct) + '%';
}, 60);

function enterSite() {
  if (!loadingDone) return;
  document.getElementById('screen-loading').classList.add('hidden');
  const main = document.getElementById('page-main');
  main.style.display = 'block';
  setTimeout(() => main.classList.add('visible'), 50);
  setTimeout(startTensionGauge, 700);
}
