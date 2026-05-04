// F1 System - Loja Melhorada Completa 2024
// E-commerce F1 profissional com 25+ produtos

const CATEGORIAS = ['todas', 'capacetes', 'macacões', 'acessórios', 'miniaturas'];
let produtos = [];
let carrinho = JSON.parse(localStorage.getItem('f1-carrinho')) || [];
let produtosFiltrados = [];
let paginaAtual = 1;
const PRODUTOS_POR_PAGINA = 8;

// Produtos F1 realistas (25+)
const PRODUTOS_F1 = [
  {id:1, nome:'Capacete Hamilton 2024 Silverstone', preco:1499.99, categoria:'capacetes', imagem:'🏎️', estoque:12, destaque:true, descricao:'Edição limitada Silverstone'},
  {id:2, nome:'Macacão Verstappen RB20', preco:899.99, categoria:'macacões', imagem:'👕', estoque:8, destaque:true, descricao:'Réplica oficial Red Bull 2024'},
  {id:3, nome:'Boné Leclerc Ferrari', preco:249.99, categoria:'acessórios', imagem:'🧢', estoque:25, destaque:false, descricao:'Ferrari 055 edição Monza'},
  {id:4, nome:'Miniatura McLaren Senna', preco:1299.99, categoria:'miniaturas', imagem:'🏆', estoque:5, destaque:true, descricao:'1:8 escala oficial McLaren'},
  {id:5, nome:'Luvas Hamilton Mercedes', preco:399.99, categoria:'acessórios', imagem:'🧤', estoque:18, destaque:false, descricao:'Luvas oficiais Mercedes AMG'},
  {id:6, nome:'Capacete Verstappen 2024', preco:1599.99, categoria:'capacetes', imagem:'🪖', estoque:9, destaque:true, descricao:'RB20 champion edition'},
  {id:7, nome:'Macacão Norris McLaren', preco:949.99, categoria:'macacões', imagem:'👔', estoque:11, destaque:false, descricao:'Papaya 2024 oficial'},
  {id:8, nome:'Chaveiro Ferrari SF-24', preco:79.99, categoria:'acessórios', imagem:'🔑', estoque:45, destaque:false, descricao:'Réplica SF-24 motor'},
  {id:9, nome:'Miniatura Ferrari SF-24', preco:1399.99, categoria:'miniaturas', imagem:'⚫', estoque:7, destaque:true, descricao:'1:18 escala Imola 2024'},
  {id:10, nome:'Óculos Oakley Verstappen', preco:299.99, categoria:'acessórios', imagem:'🕶️', estoque:22, destaque:false, descricao:'Modelo oficial RB'},
  {id:11, nome:'Capacete Alonso Aston Martin', preco:1399.99, categoria:'capacetes', imagem:'💚', estoque:10, destaque:true, descricao:'AMR24 edição especial'},
  {id:12, nome:'Jaqueta Ferrari Winter', preco:599.99, categoria:'acessórios', imagem:'🧥', estoque:16, destaque:false, descricao:'Casaco oficial Scuderia'},
  {id:13, nome:'Miniatura Red Bull RB20', preco:1499.99, categoria:'miniaturas', imagem:'🔴', estoque:6, destaque:true, descricao:'1:8 Verstappen Bahrain'},
  {id:14, nome:'Boné McLaren 2024', preco:199.99, categoria:'acessórios', imagem:'⛳', estoque:30, destaque:false, descricao:'Papaya snapback'},
  {id:15, nome:'Capacete Sainz Williams', preco:1199.99, categoria:'capacetes', imagem:'🔵', estoque:14, destaque:false, descricao:'Williams FW47 2025'},
  {id:16, nome:'Macacão Pérez Red Bull', preco:879.99, categoria:'macacões', imagem:'👗', estoque:9, destaque:false, descricao:'RB20 reserva'},
  {id:17, nome:'Pulseira F1 Oficial', preco:149.99, categoria:'acessórios', imagem:'📿', estoque:50, destaque:false, descricao:'Pulseira comemorativa'},
  {id:18, nome:'Miniatura Mercedes W15', preco:1599.99, categoria:'miniaturas', imagem:'⚪', estoque:4, destaque:true, descricao:'1:8 Hamilton Suzuka'},
  {id:19, nome:'Capacete Piastri McLaren', preco:1449.99, categoria:'capacetes', imagem:'🧡', estoque:11, destaque:true, descricao:'Papaya rookie 2024'},
  {id:20, nome:'Camiseta Ferrari 055', preco:179.99, categoria:'acessórios', imagem:'👞', estoque:35, destaque:false, descricao:'T-shirt oficial Monza'},
  {id:21, nome:'Miniatura Aston Martin AMR24', preco:1699.99, categoria:'miniaturas', imagem:'🟢', estoque:3, destaque:true, descricao:'1:18 Alonso Miami'},
  {id:22, nome:'Luvas Sainz Ferrari', preco:389.99, categoria:'acessórios', imagem:'✋', estoque:20, destaque:false, descricao:'Luvas Ferrari 2024'},
  {id:23, nome:'Capacete Russell Mercedes', preco:1349.99, categoria:'capacetes', imagem:'💜', estoque:13, destaque:false, descricao:'W15 preto fosco'},
  {id:24, nome:'Boné Aston Martin', preco:229.99, categoria:'acessórios', imagem:'🌿', estoque:28, destaque:false, descricao:'Verde oficial AMR'},
  {id:25, nome:'Miniatura Williams FW47', preco:1199.99, categoria:'miniaturas', imagem:'🔷', estoque:8, destaque:true, descricao:'1:18 Sainz/Sargeant'}
];

document.addEventListener('DOMContentLoaded', initLoja);

async function initLoja() {
  produtos = PRODUTOS_F1; // Futuro: fetch('/api/produtos')
  produtosFiltrados = produtos;
  renderizarFiltros();
  renderizarProdutos();
  updateCarrinhoUI();
}

function renderizarFiltros() {
  const filtrosContainer = document.createElement('div');
  filtrosContainer.style.cssText = 'display:flex;gap:1rem;margin-bottom:2rem;flex-wrap:wrap;justify-content:center;';
  
  CATEGORIAS.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = cat.toUpperCase();
    btn.style.fontSize = '0.8rem';
    btn.onclick = () => filtrarProdutos(cat);
    filtrosContainer.appendChild(btn);
  });
  
  document.querySelector('.container').insertBefore(filtrosContainer, document.getElementById('produtos-grid'));
}

function filtrarProdutos(categoria) {
  if (categoria === 'todas') {
    produtosFiltrados = produtos;
  } else {
    produtosFiltrados = produtos.filter(p => p.categoria === categoria);
  }
  paginaAtual = 1;
  renderizarProdutos();
}

function renderizarProdutos() {
  const inicio = (paginaAtual - 1) * PRODUTOS_POR_PAGINA;
  const fim = inicio + PRODUTOS_POR_PAGINA;
  const produtosPagina = produtosFiltrados.slice(inicio, fim);
  
  let html = '';
  produtosPagina.forEach(produto => {
    html += `
      <div class="card" style="text-align:center;padding:1.5rem;">
        <div style="font-size:4rem;margin-bottom:1rem;">${produto.imagem}</div>
        <h3 style="font-family:'Orbitron',sans-serif;margin-bottom:0.5rem;">${produto.nome}</h3>
        <p style="opacity:0.8;margin-bottom:1rem;font-size:0.9rem;">${produto.descricao}</p>
        <div style="font-size:1.8rem;font-weight:900;color:var(--f1-gold);margin-bottom:1rem;">
          R$ ${produto.preco.toFixed(2).replace('.',',')}
        </div>
        <button class="btn" onclick="adicionarAoCarrinho(${produto.id})" 
          ${produto.estoque === 0 ? 'disabled' : ''}>
          ${produto.estoque === 0 ? 'ESGOTADO' : '🛒 ADICIONAR'}
        </button>
        ${produto.destaque ? '<div class="f1-badge" style="margin-top:1rem;">🔥 DESTAQUE</div>' : ''}
      </div>
    `;
  });
  
  document.getElementById('produtos-grid').innerHTML = html;
  
  // Paginação
  renderizarPaginacao();
}

function renderizarPaginacao() {
  const totalPaginas = Math.ceil(produtosFiltrados.length / PRODUTOS_POR_PAGINA);
  if (totalPaginas <= 1) return;
  
  let paginacao = '<div style="display:flex;justify-content:center;gap:0.5rem;margin-top:2rem;">';
  for (let i = 1; i <= totalPaginas; i++) {
    paginacao += `<button class="btn" style="padding:0.5rem 1rem;font-size:0.8rem;" onclick="irParaPagina(${i})" ${i===paginaAtual ? 'style="background:linear-gradient(135deg,var(--f1-gold),#ffec8b);"' : ''}>${i}</button>`;
  }
  paginacao += '</div>';
  
  const container = document.getElementById('produtos-grid');
  container.insertAdjacentHTML('afterend', paginacao);
}

function irParaPagina(pagina) {
  paginaAtual = pagina;
  renderizarProdutos();
}

function adicionarAoCarrinho(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto || produto.estoque === 0) return;
  
  const itemNoCarrinho = carrinho.find(item => item.id === id);
  if (itemNoCarrinho) {
    if (itemNoCarrinho.quantidade < produto.estoque) {
      itemNoCarrinho.quantidade++;
    }
  } else {
    carrinho.push({...produto, quantidade: 1});
  }
  
  localStorage.setItem('f1-carrinho', JSON.stringify(carrinho));
  updateCarrinhoUI();
  
  // Toast
  mostrarToast('✅ Produto adicionado ao carrinho!');
}

function updateCarrinhoUI() {
  const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
  const totalPreco = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  
  document.getElementById('carrinho-count').textContent = totalItens;
  document.getElementById('total-price').textContent = `R$ ${totalPreco.toFixed(2).replace('.', ',')}`;
}

function checkout() {
  if (carrinho.length === 0) {
    mostrarToast('❌ Carrinho vazio!', true);
    return;
  }
  
  const dadosCompra = {
    itens: carrinho,
    total: carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0),
    cliente: JSON.parse(localStorage.getItem('f1_user') || '{}').nome || 'Cliente F1'
  };
  
  // Salvar pedido na API
  fetch('/api/pedidos', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(dadosCompra)
  }).then(res => res.json()).then(data => {
    localStorage.removeItem('f1-carrinho');
    carrinho = [];
    updateCarrinhoUI();
    mostrarToast('✅ Pedido #'+data.id+' confirmado!');
    setTimeout(() => location.href = 'dashboard.html', 2000);
  }).catch(err => mostrarToast('❌ Erro no checkout', true));
}

function mostrarToast(mensagem, erro = false) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed;top:20px;right:20px;padding:1rem 2rem;border-radius:10px;
    font-weight:700;z-index:9999;transform:translateX(400px);transition:all 0.3s;
    background:${erro ? 'linear-gradient(135deg,#f87171,#ef4444)' : 'linear-gradient(135deg,#4ade80,#22c55e)'};
    color:white;box-shadow:0 10px 30px rgba(0,0,0,0.3);
  `;
  toast.textContent = mensagem;
  
  document.body.appendChild(toast);
  
  setTimeout(() => toast.style.transform = 'translateX(0)', 100);
  setTimeout(() => {
    toast.style.transform = 'translateX(400px)';
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
}

// Busca
document.addEventListener('DOMContentLoaded', () => {
  const buscaInput = document.createElement('input');
  buscaInput.placeholder = '🔍 Buscar produtos F1...';
  buscaInput.style.cssText = 'width:300px;padding:1rem;border-radius:25px;border:1px solid var(--glass-border);background:var(--glass-bg);color:white;font-size:1rem;';
  buscaInput.oninput = (e) => {
    const termo = e.target.value.toLowerCase();
    produtosFiltrados = produtos.filter(p => p.nome.toLowerCase().includes(termo));
    paginaAtual = 1;
    renderizarProdutos();
  };
  
  document.querySelector('.page-title').parentNode.insertBefore(buscaInput, document.querySelector('.stats-grid'));
});

// Inicializar
initLoja();

