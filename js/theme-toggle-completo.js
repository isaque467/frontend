// F1 System - Theme Toggle Completo e Profissional 2024

class F1ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('f1-theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    this.themeToggle = null;
    this.init();
  }

  init() {
    this.createToggleButton();
    this.applyTheme(this.currentTheme);
    this.bindEvents();
  }

  createToggleButton() {
    this.themeToggle = document.createElement('button');
    this.themeToggle.className = 'theme-toggle btn';
    this.themeToggle.title = 'Alternar tema claro/escuro';
    this.updateToggleIcon();
    
    // Adicionar ao header
    const header = document.querySelector('.header .nav');
    if (header && !header.querySelector('.theme-toggle')) {
      header.appendChild(this.themeToggle);
    }
  }

  bindEvents() {
    this.themeToggle?.addEventListener('click', () => this.toggleTheme());
    
    // Detectar mudança preferência do sistema
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (!localStorage.getItem('f1-theme')) {
        this.currentTheme = e.matches ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
      }
    });
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('f1-theme', this.currentTheme);
    this.applyTheme(this.currentTheme);
    this.lightsOutEffect();
  }

  applyTheme(theme) {
    const root = document.documentElement;
    const body = document.body;
    
    // Limpar classes anteriores
    body.classList.remove('light-theme', 'dark-theme');
    
    if (theme === 'light') {
      // Light theme vars
      root.style.setProperty('--f1-black', '#f8f9fa');
      root.style.setProperty('--f1-dark', '#e9ecef');
      root.style.setProperty('--glass-bg', 'rgba(248,249,250,0.92)');
      root.style.setProperty('--glass-border', 'rgba(0,0,0,0.12)');
      root.style.setProperty('--text-primary', '#1a1a2e');
      root.style.setProperty('--text-secondary', '#3a3a4a');
      body.classList.add('light-theme');
      document.querySelector('.theme-toggle')?.classList.add('light');
    } else {
      // Dark theme vars (padrão F1)
      root.style.setProperty('--f1-black', '#050508');
      root.style.setProperty('--f1-dark', '#0a0a14');
      root.style.setProperty('--glass-bg', 'rgba(255,255,255,0.03)');
      root.style.setProperty('--glass-border', 'rgba(255,255,255,0.08)');
      root.style.setProperty('--text-primary', '#e0e0e0');
      root.style.setProperty('--text-secondary', '#a0a0a0');
      body.classList.add('dark-theme');
      document.querySelector('.theme-toggle')?.classList.remove('light');
    }
    
    this.updateToggleIcon();
  }

  updateToggleIcon() {
    if (this.themeToggle) {
      this.themeToggle.innerHTML = this.currentTheme === 'light' ? '🌙' : '☀️';
    }
  }

  lightsOutEffect() {
    // LEDs piscam durante transição
    const leds = document.querySelectorAll('.led-panel::before, .header::before, .logo::after');
    leds.forEach(led => {
      led.style.animationDuration = '0.1s';
      led.style.animationIterationCount = '3';
    });
    
    setTimeout(() => {
      leds.forEach(led => {
        led.style.animationDuration = '2s';
        led.style.animationIterationCount = 'infinite';
      });
    }, 400);
  }

  // API pública
  getCurrentTheme() { return this.currentTheme; }
  setTheme(theme) { this.currentTheme = theme; this.applyTheme(theme); }
}

// Inicializar globalmente
const f1Theme = new F1ThemeManager();

// Export para módulos
window.f1Theme = f1Theme;
export { f1Theme };
