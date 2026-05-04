// MOCK DATA F1 - Funcional sem backend
export const mockDashboard = {
  total_users: 247,
  total_corredores: 38,
  total_voltas: 1247,
  lider: {
    numero: 17,
    nome: 'Max Verstappen',
    equipe: 'Red Bull',
    tempo_total: '1:24.567'
  },
  voltas_por_corredor: [
    {corredor: 'Verstappen', total: 187},
    {corredor: 'Leclerc', total: 165},
    {corredor: 'Perez', total: 152},
    {corredor: 'Hamilton', total: 139}
  ]
};

export const mockPodio = [
  {
    numero: '17',
    nome: 'Max Verstappen',
    equipe: 'Red Bull',
    tempo_total: '1:24.567',
    melhor_volta: '1:23.892'
  },
  {
    numero: '16',
    nome: 'Charles Leclerc',
    equipe: 'Ferrari',
    tempo_total: '1:25.123',
    melhor_volta: '1:24.456'
  },
  {
    numero: '11',
    nome: 'Sergio Perez',
    equipe: 'Red Bull',
    tempo_total: '1:25.789',
    melhor_volta: '1:24.901'
  }
];

