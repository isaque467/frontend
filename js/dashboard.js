import { apiRequest } from './api.js';
import { createCard, showSkeleton, formatTempo } from './components.js';

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
    updateCharts(statsData, podioData);
  } catch (error) {
    console.error('Usando dados mock (backend offline):', error);
    const mockStats = {
      total_users: 127,
      total_corredores: 45,
      total_voltas: 892,
      lider: { numero: 7, nome: 'Isaque Silva', tempo_total: 125.456 },
      voltas_por_corredor: [
        { corredor: 'Corredor #7', total: 89 },
        { corredor: 'Corredor #12', total: 76 },
        { corredor: 'Corredor #3', total: 64 },
        { corredor: 'Corredor #19', total: 52 }
      ]
    };
    const mockPodio = [
      { numero: 7, nome: 'Isaque Silva', equipe: 'Equipe Alpha', tempo_total: 125.456, melhor_volta: 28.123 },
      { numero: 12, nome: 'João Santos', equipe: 'Equipe Beta', tempo_total: 127.891, melhor_volta: 28.456 },
      { numero: 3, nome: 'Maria Oliveira', equipe: 'Equipe Gamma', tempo_total: 129.234, melhor_volta: 28.789 }
    ];
    
    renderStats(mockStats);
    renderPodioDashboard(mockPodio);
    updateCharts(mockStats, mockPodio);
    document.querySelector('#podioDashboard .no-data')?.remove();
  }
}

function renderStats(data) {
  statsDiv.innerHTML = `
    <div class="enhanced-stat-card users-card">
      <div class="stat-icon">👤</div>
      <div class="stat-number animate-number" data-target="${data.total_users || 0}">0</div>
      <div class="stat-label">Total Usuários</div>
      <div class="progress-bar-container">
        <div class="progress-bar" data-progress="75"></div>
      </div>
    </div>
    <div class="enhanced-stat-card runners-card">
      <div class="stat-icon">🏎️</div>
      <div class="stat-number animate-number" data-target="${data.total_corredores || 0}">0</div>
      <div class="stat-label">Corredores Cadastrados</div>
      <div class="progress-bar-container">
        <div class="progress-bar" data-progress="60"></div>
      </div>
    </div>
    <div class="enhanced-stat-card laps-card">
      <div class="stat-icon">⏱️</div>
      <div class="stat-number animate-number" data-target="${data.total_voltas || 0}">0</div>
      <div class="stat-label">Voltas Registradas</div>
      <div class="progress-bar-container">
        <div class="progress-bar" data-progress="45"></div>
      </div>
    </div>
    <div class="enhanced-stat-card leader-card">
      <div class="stat-icon">🏆</div>
      ${data.lider ? `
        <div class="stat-number leader-number">#1 ${data.lider.numero}</div>
        <div class="leader-name">${data.lider.nome}</div>
        <div class="leader-time">${formatTempo(data.lider.tempo_total)}</div>
      ` : `
        <div class="stat-number" style="color: #888;">--</div>
        <div class="stat-label">Sem Líder</div>
        <div class="leader-time">Aguardando...</div>
      `}
    </div>
  `;
  animateNumbers();
}

function renderPodioDashboard(podio) {
  const podiumDiv = document.getElementById('podioDashboard');
  let html = '<h2 class="section-title">🥇 Pódio em Tempo Real 🏁</h2>';

  if (!podio || podio.length === 0) {
    html += '<div class="no-data">🚀 Nenhuma volta registrada ainda</div>';
  } else {
    html += `
      <div class="podio">
        ${podio.slice(0,3).map((pos, index) => {
          const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
          const posClass = ['podio-1', 'podio-2', 'podio-3'][index];
          return `
            <div class="podio-position ${posClass}">
              <div class="medal">${medal}</div>
              <div class="podio-card">
                <div class="podio-header">
                  <span class="podio-rank">${index + 1}º</span>
                  <span class="podio-number">#${pos.numero}</span>
                </div>
                <div class="podio-driver">${pos.nome}</div>
                <div class="podio-team">${pos.equipe || 'Independente'}</div>
                <div class="podio-time">${formatTempo(pos.tempo_total)}</div>
                <div class="podio-best-lap">Melhor volta: ${formatTempo(pos.melhor_volta)}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  podiumDiv.innerHTML = html;
}

function formatTempo(tempo) {
  if (!tempo) return '00:00.000';
  // O tempo pode vir como string do MySQL (TIME) ou número
  if (typeof tempo === 'string') {
    // Formato HH:MM:SS ou MM:SS
    const parts = tempo.split(':');
    if (parts.length === 3) {
      const minutos = parseInt(parts[0]) * 60 + parseInt(parts[1]);
      const segundos = parseInt(parts[2]);
      return `${minutos}:${segundos.toString().padStart(2, '0')}.000`;
    }
    return tempo;
  }
  const minutos = Math.floor(tempo / 60);
  const segundos = Math.floor(tempo % 60);
  const milisegundos = Math.round((tempo % 1) * 1000);
  return `${minutos}:${segundos.toString().padStart(2, '0')}.${milisegundos.toString().padStart(3, '0')}`;
}

// Funções visuais
let leadersChart, voltasChart;

function initCharts() {
  const ctxLeaders = document.getElementById('leadersChart')?.getContext('2d');
  const ctxVoltas = document.getElementById('voltasChart')?.getContext('2d');
  
  if (ctxLeaders) {
    leadersChart = new Chart(ctxLeaders, {
      type: 'bar',
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' } },
          x: { grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }
  
  if (ctxVoltas) {
    voltasChart = new Chart(ctxVoltas, {
      type: 'doughnut',
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
  }
}

function updateCharts(statsData, podioData) {
  if (leadersChart && podioData) {
    const labels = podioData.slice(0,5).map(p => p.nome);
    const data = podioData.slice(0,5).map(p => p.tempo_total || 0);
    leadersChart.data = { labels, datasets: [{ label: 'Tempo Total', data, backgroundColor: ['#ffd700', '#c0c0c0', '#cd7f32', '#ff9100', '#ff1744'] }] };
    leadersChart.update('none');
  }
  
  if (voltasChart && statsData) {
    const voltasTotals = statsData.voltas_por_corredor || [];
    voltasChart.data = {
      labels: voltasTotals.map(v => v.corredor),
      datasets: [{ data: voltasTotals.map(v => v.total), backgroundColor: ['#ff1744', '#ff9100', '#4ade80', '#ffd700'] }]
    };
    voltasChart.update('none');
  }
}

function animateNumbers() {
  document.querySelectorAll('.animate-number').forEach(num => {
    const target = parseInt(num.dataset.target);
    const increment = target / 100;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      num.textContent = Math.floor(current).toLocaleString();
    }, 20);
  });
}

// Inicializar charts
initCharts();

// Auto update a cada 5s
updateInterval = setInterval(loadDashboard, 5000);

// Carregar inicial
loadDashboard();

