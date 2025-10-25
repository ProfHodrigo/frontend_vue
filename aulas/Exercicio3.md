# Teste 3 - Dashboard Responsivo

## Objetivo do Exercício


Desenvolver um dashboard administrativo responsivo completo com sidebar colapsável, cards informativos, tabelas e gráficos que se adaptam perfeitamente a diferentes tamanhos de tela, desde mobile até widescreen.

**O que você vai praticar:**
- Layout complexo com CSS Grid e Flexbox
- Sidebar responsivo com toggle
- Cards de estatísticas responsivos
- Tabelas adaptativas
- Design mobile-first
- Estados de carregamento
- Navegação responsiva

## Passo 1: Criar o Layout Principal

Crie `src/views/DashboardView.vue`:

```vue
<template>
  <div class="dashboard" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h4 v-if="!sidebarCollapsed">Admin Panel</h4>
        <h4 v-else>AP</h4>
      </div>
      
      <nav class="sidebar-nav">
        <a 
          v-for="item in menuItems"
          :key="item.id"
          href="#"
          class="nav-item"
          :class="{ active: item.id === activeItem }"
          @click.prevent="activeItem = item.id"
        >
          <i :class="item.icon"></i>
          <span v-if="!sidebarCollapsed">{{ item.label }}</span>
        </a>
      </nav>
    </aside>
    
    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <header class="dashboard-header">
        <button 
          class="btn-toggle-sidebar"
          @click="toggleSidebar"
        >
          <i class="bi bi-list"></i>
        </button>
        
        <h2>Dashboard</h2>
        
        <div class="header-actions">
          <button class="btn-icon">
            <i class="bi bi-bell"></i>
            <span class="badge-notification">3</span>
          </button>
          <button class="btn-icon">
            <i class="bi bi-person-circle"></i>
          </button>
        </div>
      </header>
      
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div 
          v-for="stat in stats"
          :key="stat.id"
          class="stat-card"
          :style="{ '--card-color': stat.color }"
        >
          <div class="stat-icon">
            <i :class="stat.icon"></i>
          </div>
          <div class="stat-info">
            <h3>{{ stat.value }}</h3>
            <p>{{ stat.label }}</p>
            <span class="stat-trend" :class="stat.trend">
              <i :class="stat.trend === 'up' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
              {{ stat.change }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Charts Section -->
      <div class="charts-section">
        <div class="chart-card">
          <div class="card-header">
            <h5>Vendas Mensais</h5>
            <select class="form-select form-select-sm">
              <option>Último mês</option>
              <option>Últimos 3 meses</option>
              <option>Últimos 6 meses</option>
            </select>
          </div>
          <div class="chart-placeholder">
            <div class="chart-bar" v-for="n in 12" :key="n" :style="{ height: Math.random() * 100 + '%' }"></div>
          </div>
        </div>
        
        <div class="chart-card">
          <div class="card-header">
            <h5>Categorias</h5>
          </div>
          <div class="categories-list">
            <div 
              v-for="cat in categories" 
              :key="cat.nome"
              class="category-item"
            >
              <span>{{ cat.nome }}</span>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: cat.percent + '%', backgroundColor: cat.color }"
                ></div>
              </div>
              <span class="percent">{{ cat.percent }}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Table Section -->
      <div class="table-card">
        <div class="card-header">
          <h5>Últimos Pedidos</h5>
          <div class="search-box">
            <i class="bi bi-search"></i>
            <input type="text" placeholder="Buscar pedidos..." v-model="searchQuery">
          </div>
        </div>
        
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Produto</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pedido in pedidosFiltrados" :key="pedido.id">
                <td data-label="ID">#{{ pedido.id }}</td>
                <td data-label="Cliente">{{ pedido.cliente }}</td>
                <td data-label="Produto">{{ pedido.produto }}</td>
                <td data-label="Valor">R$ {{ pedido.valor }}</td>
                <td data-label="Status">
                  <span class="badge" :class="`badge-${pedido.status}`">
                    {{ statusLabels[pedido.status] }}
                  </span>
                </td>
                <td data-label="Data">{{ pedido.data }}</td>
                <td data-label="Ações">
                  <button class="btn-table-action">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button class="btn-table-action">
                    <i class="bi bi-pencil"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const sidebarCollapsed = ref(false)
const activeItem = ref('dashboard')
const searchQuery = ref('')

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bi bi-speedometer2' },
  { id: 'produtos', label: 'Produtos', icon: 'bi bi-box-seam' },
  { id: 'pedidos', label: 'Pedidos', icon: 'bi bi-cart' },
  { id: 'clientes', label: 'Clientes', icon: 'bi bi-people' },
  { id: 'relatorios', label: 'Relatórios', icon: 'bi bi-graph-up' },
  { id: 'configuracoes', label: 'Configurações', icon: 'bi bi-gear' }
]

const stats = [
  {
    id: 1,
    icon: 'bi bi-currency-dollar',
    value: 'R$ 45.250',
    label: 'Receita Total',
    change: '+12.5%',
    trend: 'up',
    color: '#42b983'
  },
  {
    id: 2,
    icon: 'bi bi-cart-check',
    value: '156',
    label: 'Pedidos',
    change: '+8.2%',
    trend: 'up',
    color: '#3498db'
  },
  {
    id: 3,
    icon: 'bi bi-people',
    value: '2.543',
    label: 'Clientes',
    change: '+15.3%',
    trend: 'up',
    color: '#9b59b6'
  },
  {
    id: 4,
    icon: 'bi bi-box-seam',
    value: '89',
    label: 'Produtos',
    change: '-2.1%',
    trend: 'down',
    color: '#e67e22'
  }
]

const categories = [
  { nome: 'Eletrônicos', percent: 65, color: '#42b983' },
  { nome: 'Roupas', percent: 45, color: '#3498db' },
  { nome: 'Livros', percent: 30, color: '#9b59b6' },
  { nome: 'Outros', percent: 20, color: '#e67e22' }
]

const pedidos = ref([
  { id: 1001, cliente: 'João Silva', produto: 'Notebook', valor: '2.500,00', status: 'entregue', data: '20/10/2024' },
  { id: 1002, cliente: 'Maria Santos', produto: 'Mouse', valor: '150,00', status: 'pendente', data: '21/10/2024' },
  { id: 1003, cliente: 'Pedro Oliveira', produto: 'Teclado', valor: '300,00', status: 'enviado', data: '22/10/2024' },
  { id: 1004, cliente: 'Ana Costa', produto: 'Monitor', valor: '800,00', status: 'entregue', data: '23/10/2024' },
  { id: 1005, cliente: 'Carlos Pereira', produto: 'Webcam', valor: '250,00', status: 'cancelado', data: '24/10/2024' }
])

const statusLabels = {
  pendente: 'Pendente',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado'
}

const pedidosFiltrados = computed(() => {
  if (!searchQuery.value) return pedidos.value
  
  return pedidos.value.filter(p => 
    p.cliente.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    p.produto.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<style lang="scss" scoped>
$sidebar-width: 250px;
$sidebar-collapsed-width: 70px;
$header-height: 70px;
$cor-primaria: #42b983;
$cor-fundo: #f5f7fa;
$cor-borda: #e0e6ed;
$transicao: all 0.3s ease;

.dashboard {
  display: grid;
  grid-template-columns: $sidebar-width 1fr;
  min-height: 100vh;
  background-color: $cor-fundo;
  transition: $transicao;
  
  &.sidebar-collapsed {
    grid-template-columns: $sidebar-collapsed-width 1fr;
  }
}

// SIDEBAR
.sidebar {
  background-color: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  transition: $transicao;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: $sidebar-width;
  z-index: 1000;
  
  .sidebar-collapsed & {
    width: $sidebar-collapsed-width;
  }
}

.sidebar-header {
  padding: 1.5rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h4 {
    margin: 0;
    font-weight: 700;
  }
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: $transicao;
  
  i {
    font-size: 1.25rem;
    min-width: 20px;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  &.active {
    background-color: $cor-primaria;
    color: white;
  }
  
  .sidebar-collapsed & {
    justify-content: center;
    
    span {
      display: none;
    }
  }
}

// MAIN CONTENT
.main-content {
  margin-left: $sidebar-width;
  transition: $transicao;
  
  .sidebar-collapsed & {
    margin-left: $sidebar-collapsed-width;
  }
}

// HEADER
.dashboard-header {
  background-color: white;
  height: $header-height;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  gap: 2rem;
  border-bottom: 1px solid $cor-borda;
  position: sticky;
  top: 0;
  z-index: 100;
  
  h2 {
    flex: 1;
    margin: 0;
    color: #2c3e50;
  }
}

.btn-toggle-sidebar {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #2c3e50;
  padding: 0.5rem;
  transition: $transicao;
  
  &:hover {
    color: $cor-primaria;
  }
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-icon {
  position: relative;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #2c3e50;
  padding: 0.5rem;
  transition: $transicao;
  
  &:hover {
    color: $cor-primaria;
  }
}

.badge-notification {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #e74c3c;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 10px;
  min-width: 18px;
}

// STATS GRID
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  border-left: 4px solid var(--card-color);
  transition: $transicao;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background-color: var(--card-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.stat-info {
  flex: 1;
  
  h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.75rem;
    font-weight: 700;
    color: #2c3e50;
  }
  
  p {
    margin: 0 0 0.5rem 0;
    color: #6c757d;
    font-size: 0.9rem;
  }
}

.stat-trend {
  font-size: 0.85rem;
  font-weight: 600;
  
  &.up {
    color: #27ae60;
  }
  
  &.down {
    color: #e74c3c;
  }
}

// CHARTS SECTION
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  padding: 0 2rem 2rem 2rem;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h5 {
    margin: 0;
    color: #2c3e50;
    font-weight: 700;
  }
}

.chart-placeholder {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  height: 200px;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(180deg, $cor-primaria 0%, lighten($cor-primaria, 15%) 100%);
  border-radius: 4px 4px 0 0;
  transition: $transicao;
  
  &:hover {
    opacity: 0.8;
  }
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-item {
  display: grid;
  grid-template-columns: 120px 1fr 60px;
  align-items: center;
  gap: 1rem;
  
  span:first-child {
    font-weight: 600;
    color: #2c3e50;
  }
  
  .percent {
    text-align: right;
    color: #6c757d;
    font-weight: 600;
  }
}

.progress-bar {
  height: 10px;
  background-color: #e0e6ed;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.6s ease;
}

// TABLE SECTION
.table-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 0 2rem 2rem 2rem;
}

.search-box {
  position: relative;
  
  i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;
  }
  
  input {
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    border: 1px solid $cor-borda;
    border-radius: 6px;
    width: 250px;
    
    &:focus {
      outline: none;
      border-color: $cor-primaria;
    }
  }
}

.table-responsive {
  overflow-x: auto;
  margin-top: 1rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
  
  thead {
    background-color: #f8f9fa;
    
    th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #2c3e50;
      border-bottom: 2px solid $cor-borda;
    }
  }
  
  tbody {
    tr {
      border-bottom: 1px solid $cor-borda;
      transition: $transicao;
      
      &:hover {
        background-color: #f8f9fa;
      }
    }
    
    td {
      padding: 1rem;
      color: #6c757d;
    }
  }
}

.badge {
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  
  &.badge-pendente {
    background-color: #fff3cd;
    color: #856404;
  }
  
  &.badge-enviado {
    background-color: #cfe2ff;
    color: #084298;
  }
  
  &.badge-entregue {
    background-color: #d1e7dd;
    color: #0f5132;
  }
  
  &.badge-cancelado {
    background-color: #f8d7da;
    color: #842029;
  }
}

.btn-table-action {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: $transicao;
  
  &:hover {
    color: $cor-primaria;
  }
}

// RESPONSIVO
@media (max-width: 992px) {
  .dashboard {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    transform: translateX(-100%);
    
    .sidebar-collapsed & {
      transform: translateX(0);
      width: $sidebar-collapsed-width;
    }
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
  
  .charts-section {
    grid-template-columns: 1fr;
    padding: 0 1rem 1rem 1rem;
  }
  
  .table-card {
    margin: 0 1rem 1rem 1rem;
  }
  
  .table {
    thead {
      display: none;
    }
    
    tbody tr {
      display: block;
      margin-bottom: 1rem;
      border: 1px solid $cor-borda;
      border-radius: 8px;
    }
    
    td {
      display: grid;
      grid-template-columns: 120px 1fr;
      padding: 0.75rem 1rem;
      
      &::before {
        content: attr(data-label);
        font-weight: 600;
        color: #2c3e50;
      }
    }
  }
  
  .search-box input {
    width: 100%;
  }
}
</style>
```

## Passo 2: Testar o Dashboard

Execute e teste em diferentes resoluções:

```bash
npm run dev
```

Teste:
1. **Desktop:** Sidebar aberta, 4 cards de stats, tabela completa
2. **Tablet:** Sidebar colapsável, 2 cards por linha
3. **Mobile:** 1 card por linha, tabela transformada em cards