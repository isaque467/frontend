import { apiRequest } from './api.js';

const rankingTable = document.getElementById('rankingTable');

async function loadRanking() {
  try {
    const ranking = await apiRequest('/relatorios/ranking');
    renderRanking(ranking);
  } catch (error) {
    rankingTable.innerHTML = '<p style="color: #ff1744; text-align: center;">Erro ao carregar ranking</p>';
  }
}

function renderRanking(ranking) {
  if (ranking.length === 0) {
    rankingTable.innerHTML = '<p style="text-align: center; opacity: 0.7;">Nenhum dado de corrida disponível</p>';
    return;
  }
  
  rankingTable.innerHTML = `
    <div style="overflow-x: auto;">
      <table class="table">
        <thead>
          <tr>
            <th>Pos.</th>
            <th style="width: 60px;">Nº</th>
            <th>Nome</th>
            <th>Equipe</th>
            <th>Melhor Volta</th>
            <th>Tempo Total</th>
            <th>Total Voltas</th>
          </tr>
        </thead>
        <tbody>
          ${ranking.map((r, index) => {
            const posClass = index === 0 ? 'style="background: rgba(255, 215, 0, 0.3);"' : '';
            return `
              <tr ${posClass}>
                <td style="font-size: 1.5rem; font-weight: bold;">${index + 1}º</td>
                <td style="font-size: 1.3rem; color: #ff1744;">#${r.numero}</td>
                <td style="font-weight: bold;">${r.nome}</td>
                <td>${r.equipe}</td>
                <td style="color: #4caf50;">${formatTempo(r.melhor_volta)}</td>
                <td style="color: #ff9100; font-weight: bold;">${formatTempo(r.tempo_total)}</td>
                <td>${r.total_voltas}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function formatTempo(tempo) {
  if (tempo >= 999) return 'N/A';
  const mins = Math.floor(tempo);
  const secs = Math.floor((tempo % 1) * 60);
  const ms = Math.round(((tempo % 1) * 60 % 1) * 1000);
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

// Auto update every 5s
setInterval(loadRanking, 5000);
loadRanking();
