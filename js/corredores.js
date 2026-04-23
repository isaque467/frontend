import { apiRequest } from './api.js';

const corredorForm = document.getElementById('corredorForm');
const listaCorredores = document.getElementById('listaCorredores');
const corredorMessage = document.getElementById('corredorMessage');

async function loadCorredores() {
  try {
    const corredores = await apiRequest('/corredores');
    renderCorredores(corredores);
  } catch (error) {
    listaCorredores.innerHTML = '<p style="color: #ff1744;">Erro ao carregar corredores</p>';
  }
}

function renderCorredores(corredores) {
  if (corredores.length === 0) {
    listaCorredores.innerHTML = '<p>Nenhum corredor cadastrado</p>';
    return;
  }
  
  listaCorredores.innerHTML = `
    <div style="overflow-x: auto;">
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
              <td>${c.id}</td>
              <td style="font-size: 1.5rem; font-weight: bold; color: #ff1744;">#${c.numero}</td>
              <td>${c.nome}</td>
              <td>${c.equipe}</td>
              <td>${new Date(c.created_at).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

corredorForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const nome = document.getElementById('nome').value;
  const numero = parseInt(document.getElementById('numero').value);
  const equipe = document.getElementById('equipe').value;
  
  const submitBtn = corredorForm.querySelector('button');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<div class="loading"></div> Cadastrando...';
  submitBtn.disabled = true;
  
  try {
    await apiRequest('/corredores', {
      method: 'POST',
      body: JSON.stringify({ nome, numero, equipe })
    });
    
    corredorMessage.innerHTML = '<div style="color: #4caf50;">✅ Corredor cadastrado!</div>';
    corredorForm.reset();
    loadCorredores(); // Reload list
    
  } catch (error) {
    corredorMessage.innerHTML = `<div style="color: #ff1744;">❌ ${error.message}</div>`;
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});

// Load initial list
loadCorredores();
