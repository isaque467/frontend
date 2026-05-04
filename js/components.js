// F1 SYSTEM - Component Library

/**
 * Card Component
 * @param {Object} data - Dados do corredor/user
 * @param {String} type - 'corredor' | 'user' | 'product'
 */
export function createCard(data, type = 'corredor') {
  const card = document.createElement('div');
  card.className = 'card glass-card';
  
  if (type === 'corredor') {
    card.innerHTML = `
      <div class="f1-badge">${data.numero || '#'}</div>
      <h3>${data.nome}</h3>
      <div class="equipe">${data.turma || data.equipe}</div>
      ${data.tempo_total ? `<div class="tempo">${formatTempo(data.tempo_total)}</div>` : ''}
    `;
  }
  
  card.addEventListener('click', () => animateCard(card));
  return card;
}

function animateCard(card) {
  card.style.transform = 'scale(1.02) translateY(-4px)';
  card.style.boxShadow = '0 20px 40px rgba(var(--f1-red), 0.3)';
  
  setTimeout(() => {
    card.style.transform = '';
    card.style.boxShadow = '';
  }, 200);
}

export function formatTempo(tempo) {
  if (!tempo) return '00:00.000';
  if (typeof tempo === 'string') {
    const parts = tempo.split(':');
    if (parts.length === 3) return tempo;
    return tempo;
  }
  const mins = Math.floor(tempo);
  const secs = Math.floor((tempo % 1) * 60);
  const ms = Math.round(((tempo % 1) * 60 % 1) * 1000);
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

/**
 * Skeleton Loading
 */
export function showSkeleton(container, count = 3) {
  container.innerHTML = Array(count).fill().map(() => `
    <div class="skeleton-card" style="animation: skeletonShimmer 1.5s infinite;">
      <div class="skeleton-line" style="height: 24px; margin: 8px 0; width: 80%;"></div>
      <div class="skeleton-line" style="height: 16px; opacity: 0.7; width: 60%;"></div>
    </div>
  `).join('');
}

