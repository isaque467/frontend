import { apiRequest } from './api.js';

const statsDiv = document.getElementById('stats');
const podioDashboard = document.getElementById('podioDashboard');

let updateInterval;

// Verificar login
if (!localStorage.getItem('f1_user')) {
  window.location.href = 'login.html';
}

// Carregar dashboard
async function loadDashboard() {
  try {
    const statsData = await apiRequest('/dashboard');
    const podioData = await apiRequest('/podio');
    
    renderStats(statsData);
    renderPodioDashboard(podioData);
  } catch (error) {
    console.error('Erro carregando dashboard:', error);
  }
}

function renderStats(data) {
  statsDiv.innerHTML = `
    <div class="card stat-card">
      <div class="stat-number">${data.total_users}</div>
      <div style="font-size: 1.2rem; opacity: 0.8;">👤 Usuários</div>
    </div>
    <div class="card stat-card">
      <div class="stat-number">${data.total_corredores}</div>
      <div style="font-size: 1.2rem; opacity: 0.8;">🏎️ Corredores</div>
    </div>
    <div class="card stat-card">
      <div class="stat-number">${data.total_voltas}</div>
      <div style="font-size: 1.2rem; opacity: 0.8;">⏱️ Voltas</div>
    </div>
    ${data.lider ? `
      <div class="card stat-card">
        <div class="stat-number" style="color: #ffd700;">#1 ${data.lider.numero}</div>
        <div style="font-size: 1.2rem;">🏆 ${data.lider.nome}</div>
        <div style="opacity: 0.8;">${formatTempo(data.lider.tempo_total)}</div>
      </div>
    ` : ''}
  `;
}

function renderPodioDashboard(podio) {
  let html = '<h2 style="text-align: center; margin-bottom: 2rem; color: #ff9100;">🏆 Pódio Atual</h2>';
  
  if (podio.length === 0) {
    html += '<div style="text-align: center; opacity: 0.7;">Nenhuma volta registrada ainda</div>';
  } else {
    html += `
      <div class="podio">
        ${podio.map((pos, index) => {
          const posClass = index === 0 ? 'podio-pos podio-1' : index === 1 ? 'podio-pos podio-2' : 'podio-pos podio-3';
          return `
            <div class="${posClass}">
              <div class="podio-card">
                <div class="podio-posicao">${index + 1}º</div>
                <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">${pos.numero} - ${pos.nome}</div>
                <div style="opacity: 0.8; margin-bottom: 1rem;">${pos.equipe}</div>
                <div style="font-size: 1.2rem; font-weight: bold;">${formatTempo(pos.tempo_total)}</div>
                <div style="opacity: 0.7; font-size: 0.9rem;">Melhor: ${formatTempo(pos.melhor_volta)}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
  
  podioDashboard.innerHTML = html;
}

function formatTempo(tempo) {
  if (!tempo) return '00:00.000';
  const minutos = Math.floor(tempo / 60);
  const segundos = Math.floor(tempo % 60);
  const milisegundos = Math.round((tempo % 1) * 1000);
  return `${minutos}:${segundos.toString().padStart(2, '0')}.${milisegundos.toString().padStart(3, '0')}`;
}

// Auto update a cada 5s
updateInterval = setInterval(loadDashboard, 5000);

// Carregar inicial
loadDashboard();
