// F1 System - CRUD Manager Profissional

export class CrudManager {
  constructor(tableSelector, apiEndpoint) {
    this.table = document.querySelector(tableSelector);
    this.endpoint = apiEndpoint;
    this.data = [];
    this.init();
  }

  async init() {
    await this.loadData();
    this.renderTable();
    this.bindEvents();
  }

  async loadData() {
    try {
      this.data = await apiRequest(this.endpoint);
      this.renderTable();
    } catch (error) {
      console.error('Erro carregando dados:', error);
    }
  }

  renderTable() {
    this.table.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          ${this.data.map(item => `
            <tr>
              <td>${item.id}</td>
              <td contenteditable="true" data-field="nome">${item.nome}</td>
              <td contenteditable="true" data-field="email">${item.email}</td>
              <td>
                <button onclick="crud.save(${item.id})" class="btn">💾</button>
                <button onclick="crud.delete(${item.id})" class="btn" style="background: #f87171;">🗑️</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  async save(id) {
    const row = this.table.querySelector(`tr[data-id="${id}"]`) || event.target.closest('tr');
    const nome = row.querySelector('[data-field="nome"]').textContent;
    
    try {
      await apiRequest(`${this.endpoint}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ nome })
      });
      this.loadData(); // Reload
      showToast('Salvo com sucesso!', 'success');
    } catch (error) {
      showToast('Erro ao salvar', 'error');
    }
  }

  async delete(id) {
    if (!confirm('Confirmar exclusão?')) return;
    
    try {
      await apiRequest(`${this.endpoint}/${id}`, { method: 'DELETE' });
      this.loadData();
      showToast('Excluído!', 'success');
    } catch (error) {
      showToast('Erro ao excluir', 'error');
    }
  }
}

// Toast system
export function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.remove(), 3000);
}

// Global instance
window.crud = new CrudManager('#crud-table', '/api/users');

