// Realtime Laps Feed Sidebar
class RealtimeFeed {
constructor(container) {
    this.container = container;
    this.laps = [];
    this.init();
  }
  
  init() {
    this.ws = new WebSocket('ws://localhost:3000');
    this.ws.onmessage = (event) => this.addLap(JSON.parse(event.data));
    this.render();
    setInterval(() => this.scrollFeed(), 3000);
  }
  
  addLap(lap) {
    this.laps.unshift(lap);
    if (this.laps.length > 50) this.laps.pop();
    this.render();
  }
  
  render() {
    this.container.innerHTML = this.laps.map(lap => `
      <div class="live-lap glass-card">
        🏎️ #${lap.numero} ${lap.nome} - ${lap.tempo} (${lap.pos}º)
      </div>
    `).join('');
  }
  
  scrollFeed() {
    this.container.style.transform = 'translateX(-10%)';
    setTimeout(() => this.container.style.transform = 'translateX(0)', 500);
  }
}
  
// Usage
const feed = new RealtimeFeed(document.getElementById('live-feed'));
