import { apiRequest } from './api.js';

const corredorForm = document.getElementById('corredorForm');
const listaCorredores = document.getElementById('listaCorredores');
const corredorMessage = document.getElementById('corredorMessage');

async function loadCorredores() {
  try {
    const corredores = await apiRequest('/corredores');
    renderCorredores(corredores);
  } catch (error) {
    listaCorredores.innerHTML = '<p class="message-error">Erro ao carregar corredores</p>';
  }
}

function renderCorredores(corredores) {
  if (corredores.length === 0) {
    listaCorredores.innerHTML = '<p class="text-center" style="opacity: 0.7; padding: 2rem;">Nenhum corredor cadastrado</p>';
    return;
  }
  
  listaCorredores.innerHTML = `
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nº</th>
            <th>Nome</th>
            <th>Equipe</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          ${corredores.map(c => `
            <tr>
              <td><span class="f1-badge">${c.id}</span></td>
              <td style="font-family: 'Orbitron', sans-serif; font-size: 1.3rem; font-weight: 700; color: #ff1744; text-shadow: 0 0 10px rgba(255,23,68,0.5);">#${c.numero}</td>
              <td style="font-weight: 600;">${c.nome}</td>
              <td style="opacity: 0.8;">${c.equipe}</td>
              <td style="opacity: 0.6; font-size: 0.9rem;">${new Date(c.created_at).toLocaleDateString('pt-BR')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

corredorForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const nome = document.getElementById('nome').value.trim();
  const numero = parseInt(document.getElementById('numero').value);
  const equipe = document.getElementById('equipe').value.trim();
  
  // Validação
  if (!nome || !equipe || isNaN(numero) || numero < 1 || numero > 99) {
    corredorMessage.innerHTML = '<div class="message-error">❌ Preencha todos os campos corretamente (número: 1-99)</div>';
    return;
  }
  
  const submitBtn = corredorForm.querySelector('button');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<div class="loading"></div> Cadastrando...';
  submitBtn.disabled = true;
  corredorMessage.innerHTML = '';
  
  try {
    await apiRequest('/corredores', {
      method: 'POST',
      body: JSON.stringify({ nome, numero, equipe })
    });
    
    corredorMessage.innerHTML = '<div class="message-success">✅ Corredor cadastrado com sucesso!</div>';
    corredorForm.reset();
    loadCorredores();
    
    // Limpa mensagem após 3s
    setTimeout(() => {
      corredorMessage.innerHTML = '';
    }, 3000);
    
  } catch (error) {
    corredorMessage.innerHTML = `<div class="message-error">❌ ${error.message}</div>`;
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});

// Load initial list
loadCorredores();
