import { apiRequest } from './api.js';

const voltaForm = document.getElementById('voltaForm');
const ultimasVoltas = document.getElementById('ultimasVoltas');
const voltaMessage = document.getElementById('voltaMessage');

// Load corredores for select
async function loadCorredoresSelect() {
  try {
    const corredores = await apiRequest('/corredores');
    const select = document.getElementById('corredor_id');
    select.innerHTML = '<option value="">Selecionar...</option>' + 
      corredores.map(c => `<option value="${c.id}">#${c.numero} - ${c.nome} (${c.equipe})</option>`).join('');
  } catch (error) {
    console.error('Erro carregando corredores:', error);
  }
}

async function loadUltimasVoltas() {
  try {
    const voltas = await apiRequest('/voltas');
    renderUltimasVoltas(voltas);
  } catch (error) {
    ultimasVoltas.innerHTML = '<p style="color: #ff1744;">Erro ao carregar voltas</p>';
  }
}

function renderUltimasVoltas(voltas) {
  if (voltas.length === 0) {
    ultimasVoltas.innerHTML = '<p>Nenhuma volta registrada</p>';
    return;
  }
  
  ultimasVoltas.innerHTML = `
    <div style="overflow-x: auto;">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Corredor</th>
            <th>Volta</th>
            <th>Tempo</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          ${voltas.slice(0, 10).map(v => `
            <tr>
              <td>${v.id}</td>
              <td>${v.corredor_nome}</td>
              <td>#${v.numero_volta}</td>
              <td style="font-weight: bold; color: #4caf50;">${formatTempo(v.tempo_volta)}</td>
              <td>${new Date(v.created_at).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function formatTempo(tempo) {
  const mins = Math.floor(tempo);
  const secs = Math.floor((tempo % 1) * 60);
  const ms = Math.round(((tempo % 1) * 60 % 1) * 1000);
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

voltaForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const corredor_id = parseInt(document.getElementById('corredor_id').value);
  const numero_volta = parseInt(document.getElementById('numero_volta').value);
  const tempo_volta = parseFloat(document.getElementById('tempo_volta').value);
  
  const submitBtn = voltaForm.querySelector('button');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<div class="loading"></div> Registrando...';
  submitBtn.disabled = true;
  
  try {
    await apiRequest('/voltas', {
      method: 'POST',
      body: JSON.stringify({ corredor_id, numero_volta, tempo_volta })
    });
    
    voltaMessage.innerHTML = '<div style="color: #4caf50;">✅ Volta registrada! Dados atualizados automaticamente.</div>';
    voltaForm.reset();
    loadUltimasVoltas();
    
  } catch (error) {
    voltaMessage.innerHTML = `<div style="color: #ff1744;">❌ ${error.message}</div>`;
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});

// Load initial data
loadCorredoresSelect();
loadUltimasVoltas();

// Auto refresh voltas every 3s
setInterval(loadUltimasVoltas, 3000);
