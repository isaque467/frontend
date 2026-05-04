import { apiRequest } from './api.js';

const resumo = document.getElementById('resumo-pedido');
const totalEl = document.getElementById('final-total');

const carrinho = JSON.parse(localStorage.getItem('f1-pedido') || '[]');
const produtosDemo = [
  { id: 1, nome: 'Capacete Senna', preco: 1299.99 },
  { id: 2, nome: 'Macacão Hamilton', preco: 899.99 },
  { id: 3, nome: 'Boné Verstappen', preco: 199.99 },
  { id: 4, nome: 'Camiseta Leclerc', preco: 249.99 }
];

function renderResumo() {
  let html = '';
  let total = 0;
  
  carrinho.forEach(item => {
    const produto = produtosDemo.find(p => p.id === item.id);
    if (produto) {
      const subtotal = produto.preco * item.qtd;
      total += subtotal;
      html += `
        <div class="produto-checkout">
          <span>${produto.nome} x${item.qtd}</span>
          <span>R$ ${subtotal.toFixed(2)}</span>
        </div>
      `;
    }
  });
  
  html += `<hr style="border-color: var(--glass-border);">`;
  html += `<div style="font-size: 1.5rem; font-weight: 700; text-align: right;">Total: <span id="total-valor">R$ ${total.toFixed(2)}</span></div>`;
  
  resumo.innerHTML = html;
  totalEl.textContent = `R$ ${total.toFixed(2)}`;
}

window.confirmarPedido = async () => {
  try {
    // Simular pagamento
    const pedido = {
      itens: carrinho,
      total: parseFloat(totalEl.textContent.replace('R$ ', '')),
      status: 'pendente',
      timestamp: new Date().toISOString()
    };
    
    // Enviar para API (mock)
    const response = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido)
    });
    
    if (response.ok) {
      localStorage.removeItem('f1-carrinho');
      localStorage.removeItem('f1-pedido');
      showToast('✅ Pedido confirmado! Obrigado!', 'success');
      setTimeout(() => location.href = 'dashboard.html', 2000);
    }
  } catch (error) {
    showToast('❌ Erro no pagamento', 'error');
  }
};

function showToast(message, type) {
  const toast = document.createElement('div');
  toast.className = `toast message-${type}`;
  toast.style.cssText = `
    position: fixed; top: 20px; right: 20px; 
    padding: 1rem 2rem; border-radius: 10px;
    color: white; font-weight: 600; z-index: 9999;
    background: ${type === 'success' ? '#4ade80' : '#f87171'};
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.remove(), 3000);
}

renderResumo();

