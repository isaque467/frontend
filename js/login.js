import { apiRequest } from './api.js';

const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  
  const submitBtn = loginForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<div class="loading"></div> Carregando...';
  submitBtn.disabled = true;
  
  try {
    const data = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha })
    });
    
    loginMessage.innerHTML = `<div style="color: #4caf50; font-weight: bold;">✅ ${data.message}</div>`;
    
    // Salvar user no localStorage (simples)
    localStorage.setItem('f1_user', JSON.stringify(data.user));
    
    // Redirecionar para dashboard em 2s
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
    
  } catch (error) {
    loginMessage.innerHTML = `<div style="color: #ff1744; font-weight: bold;">❌ ${error.message}</div>`;
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});

// Verificar se já logado
if (localStorage.getItem('f1_user')) {
  window.location.href = 'dashboard.html';
}
