import { apiRequest } from './api.js';
import { createCard, showSkeleton } from './components.js';

const grid = document.getElementById('produtos-grid');
const countEl = document.getElementById('carrinho-count');
const totalEl = document.getElementById('total-price');
let carrinho = JSON.parse(localStorage.getItem('f1-carrinho')) || [];

async function loadLoja() {
  showSkeleton(grid, 8);
  
  try {
    const produtos = await apiRequest('/api/produtos');
    grid.innerHTML = '';
    
    produtos.forEach(produto => {
      const card = document.createElement('div');
      card.className = 'card stat-card produto-card';
      card.innerHTML = `
        <img src="${produto.imagem || '/placeholder.png'}" alt="${produto.nome}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px;">
        <h3>${produto.nome}</h3>
        <div class="equipe">${produto.categoria}</div>
        <div class="podio-tempo">R$ ${parseFloat(produto.preco).toFixed(2)}</div>
        <div>Estoque: ${produto.estoque}</div>
        <button class="btn" onclick="addCarrinho(${produto.id})">Adicionar 🛒</button>
      `;
      grid.appendChild(card);
    });
    
    updateCarrinhoUI();
  } catch (error) {
    grid.innerHTML = '<div class="message-error">Erro ao carregar loja</div>';
  }
}

window.addCarrinho = (id) => {
  carrinho.push({ id, qtd: 1 });
  localStorage.setItem('f1-carrinho', JSON.stringify(carrinho));
  updateCarrinhoUI();
  showToast('Adicionado ao carrinho!', 'success');
};

function updateCarrinhoUI() {
  countEl.textContent = carrinho.length;
  const total = carrinho.reduce((sum, item) => sum + (item.preco || 0), 0);
  totalEl.textContent = `R$ ${total.toFixed(2)}`;
}

window.checkout = () => {
  if (carrinho.length === 0) {
    showToast('Carrinho vazio', 'error');
    return;
  }
  
  localStorage.setItem('f1-pedido', JSON.stringify(carrinho));
  showToast('Pedido criado! Redirecionando...', 'success');
  setTimeout(() => location.href = 'checkout.html', 1000);
};

loadLoja();

