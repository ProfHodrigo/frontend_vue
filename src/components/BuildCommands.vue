<template>
  <div class="build-info">
    <h4>Comandos de Build</h4>
    <p class="text-muted">Scripts e processos de build para diferentes ambientes</p>
    
    <div class="command-grid">
      <!-- Development -->
      <div class="command-card">
        <div class="command-header development">
          <i class="bi bi-code-slash"></i>
          Development
        </div>
        <div class="command-body">
          <div class="command-item">
            <code>npm run dev</code>
            <span class="command-desc">Servidor de desenvolvimento</span>
          </div>
          <div class="command-item">
            <code>npm run lint</code>
            <span class="command-desc">Verificar codigo</span>
          </div>
        </div>
      </div>

      <!-- Staging -->
      <div class="command-card">
        <div class="command-header staging">
          <i class="bi bi-layers"></i>
          Staging
        </div>
        <div class="command-body">
          <div class="command-item">
            <code>npm run build:staging</code>
            <span class="command-desc">Build para staging</span>
          </div>
          <div class="command-item">
            <code>npm run preview</code>
            <span class="command-desc">Preview do build</span>
          </div>
        </div>
      </div>

      <!-- Production -->
      <div class="command-card">
        <div class="command-header production">
          <i class="bi bi-rocket-takeoff"></i>
          Production
        </div>
        <div class="command-body">
          <div class="command-item">
            <code>npm run build</code>
            <span class="command-desc">Build otimizado</span>
          </div>
          <div class="command-item">
            <code>npm run deploy</code>
            <span class="command-desc">Deploy para producao</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Otimizacoes -->
    <div class="optimization-section mt-4">
      <h5>Otimizacoes de Build</h5>
      <ul class="optimization-list">
        <li>
          <i class="bi bi-check-circle-fill text-success"></i>
          Code Splitting automatico
        </li>
        <li>
          <i class="bi bi-check-circle-fill text-success"></i>
          Minificacao com Terser
        </li>
        <li>
          <i class="bi bi-check-circle-fill text-success"></i>
          Tree Shaking
        </li>
        <li>
          <i class="bi bi-check-circle-fill text-success"></i>
          Lazy Loading de rotas
        </li>
        <li>
          <i class="bi bi-check-circle-fill text-success"></i>
          Asset optimization
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BuildCommands'
}
</script>

<style scoped>
.build-info {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.command-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.command-card {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.command-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.command-header {
  padding: 1rem;
  color: white;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.command-header.development {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.command-header.staging {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.command-header.production {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.command-body {
  padding: 1.5rem;
}

.command-item {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.command-item:last-child {
  margin-bottom: 0;
}

.command-item code {
  background: #2d3748;
  color: #68d391;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  display: inline-block;
}

.command-desc {
  color: #6c757d;
  font-size: 0.875rem;
  padding-left: 0.75rem;
}

.optimization-section h5 {
  color: #495057;
  margin-bottom: 1rem;
}

.optimization-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.optimization-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.optimization-list i {
  font-size: 1.25rem;
}
</style>
