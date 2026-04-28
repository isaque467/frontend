import { apiRequest } from './api.js';

const podioFull = document.getElementById('podioFull');

async function loadPodio() {
  try {
    const podio = await apiRequest('/podio');
    renderPodio(podio);
  } catch (error) {
    podioFull.innerHTML = '<div style="text-align: center; color: #ff1744;">Erro ao carregar pódio</div>';
  }
}

function renderPodio(podio) {
  if (!podio || podio.length === 0) {
    podioFull.innerHTML = '<div style="text-align: center; opacity: 0.7; font-size: 1.5rem;">⏳ Aguardando primeiras voltas...</div>';
    return;
  }

  const podiumPositions = ['🥇 PRIMEIRO', '🥈 SEGUNDO', '🥉 TERCEIRO'];

  podioFull.innerHTML = podiumPositions.map((posName, index) => {
    const pos = podio[index];
    if (!pos) return '';

    return `
      <div class="podio-pos ${index === 0 ? 'podio-1' : index === 1 ? 'podio-2' : 'podio-3'}" style="flex: 1;">
        <div class="podio-card">
          <div class="podio-posicao">${index + 1}</div>
          <div class="podio-nome">${pos.numero} - ${pos.nome}</div>
          <div class="podio-equipe">${pos.equipe || 'Sem turma'}</div>
          <div class="podio-tempo">${formatTempo(pos.tempo_total)}</div>
          <div class="podio-melhor">Melhor: ${formatTempo(pos.melhor_volta)}</div>
        </div>
      </div>
    `;
  }).join('');
}

function formatTempo(tempo) {
  if (!tempo) return '00:00.000';
  if (typeof tempo === 'string') {
    const parts = tempo.split(':');
    if (parts.length === 3) {
      const minutos = parseInt(parts[0]) * 60 + parseInt(parts[1]);
      const segundos = parseInt(parts[2]);
      return `${minutos}:${segundos.toString().padStart(2, '0')}.000`;
    }
    return tempo;
  }
  const mins = Math.floor(tempo);
  const secs = Math.floor((tempo % 1) * 60);
  const ms = Math.round(((tempo % 1) * 60 % 1) * 1000);
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

// Auto update every 3s
setInterval(loadPodio, 3000);
loadPodio();

