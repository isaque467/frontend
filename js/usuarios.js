import { apiRequest } from './api.js';

const userForm = document.getElementById('userForm');
const userMessage = document.getElementById('userMessage');

userForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  
  const submitBtn = userForm.querySelector('button');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<div class="loading"></div> Criando...';
  submitBtn.disabled = true;
  
  try {
    await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify({ nome, email, senha })
    });
    
    userMessage.innerHTML = '<div style="color: #4caf50;">✅ Usuário criado com sucesso!</div>';
    userForm.reset();
    
  } catch (error) {
    userMessage.innerHTML = `<div style="color: #ff1744;">❌ ${error.message}</div>`;
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});
