// Theme Toggle F1 System
const THEME_KEY = 'f1-theme';
const themes = {
  dark: {
    '--bg-primary': '#050508',
    '--bg-secondary': '#0a0a14',
    '--text-primary': '#e0e0e0',
    '--glass-bg': 'rgba(255,255,255,0.03)',
    '--glass-border': 'rgba(255,255,255,0.08)'
  },
  light: {
    '--bg-primary': '#f8f9ff',
    '--bg-secondary': '#ffffff',
    '--text-primary': '#1a1a2e',
    '--glass-bg': 'rgba(255,255,255,0.85)',
    '--glass-border': 'rgba(0,0,0,0.08)'
  }
};

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  document.body.dataset.theme = saved;
  applyTheme(saved);
  
  // Toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'theme-toggle-btn';
  toggleBtn.innerHTML = '🌙';
  toggleBtn.title = 'Alternar tema';
  toggleBtn.onclick = toggleTheme;
  document.querySelector('.header .nav')?.appendChild(toggleBtn);
}

function applyTheme(theme) {
  Object.entries(themes[theme]).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}

function toggleTheme() {
  const current = document.body.dataset.theme || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  
  document.body.dataset.theme = next;
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
  
  // Update button
  document.querySelector('.theme-toggle-btn').innerHTML = next === 'dark' ? '☀️' : '🌙';
}

// Particles integration
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;z-index:-1;pointer-events:none;';
  document.body.appendChild(canvas);
  
  import('./particles.js').then(({ F1Particles }) => {
    new F1Particles(canvas);
  });
}

// Speedometer for leader
function createSpeedometer(value = 0) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 200 140');
  svg.className = 'speedometer';
  svg.innerHTML = `
    <defs>
      <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff1744"/>
        <stop offset="50%" stop-color="#ffd700"/>
        <stop offset="100%" stop-color="#4ade80"/>
      </linearGradient>
    </defs>
    <path d="M10 120 Q100 20 190 120" stroke="url(#speedGrad)" stroke-width="12" fill="none" stroke-linecap="round"/>
    <circle cx="100" cy="110" r="8" fill="#fff" stroke="#000" stroke-width="2"/>
    <text x="100" y="135" text-anchor="middle" font-family="Orbitron" font-size="16" font-weight="bold" fill="#fff" filter="url(#glow)">${Math.round(value)}s</text>
  `;
  return svg;
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initParticles();
  
  // Add speedometer to leader card
  const leaderInterval = setInterval(() => {
    const leaderCard = document.querySelector('.leader-card');
    if (leaderCard && !leaderCard.querySelector('.speedometer')) {
      const speedo = createSpeedometer(125);
      leaderCard.appendChild(speedo);
      clearInterval(leaderInterval);
    }
  }, 100);
});

