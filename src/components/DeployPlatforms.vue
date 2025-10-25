<template>
  <div class="deploy-platforms">
    <h4>Plataformas de Deploy</h4>
    <p class="text-muted">Opcoes de hospedagem para aplicacoes Vue.js</p>
    
    <div class="platforms-grid">
      <!-- Netlify -->
      <div class="platform-card netlify">
        <div class="platform-icon">
          <i class="bi bi-cloud-upload"></i>
        </div>
        <h5>Netlify</h5>
        <p>Deploy gratuito com CI/CD integrado</p>
        <ul class="features">
          <li>Deploy automatico via Git</li>
          <li>Preview de Pull Requests</li>
          <li>CDN global</li>
          <li>SSL gratuito</li>
        </ul>
        <div class="deploy-command">
          <code>netlify deploy --prod</code>
        </div>
      </div>

      <!-- Vercel -->
      <div class="platform-card vercel">
        <div class="platform-icon">
          <i class="bi bi-lightning"></i>
        </div>
        <h5>Vercel</h5>
        <p>Otimizado para frameworks frontend</p>
        <ul class="features">
          <li>Edge Network global</li>
          <li>Instant rollbacks</li>
          <li>Analytics integrado</li>
          <li>Preview deployments</li>
        </ul>
        <div class="deploy-command">
          <code>vercel --prod</code>
        </div>
      </div>

      <!-- AWS S3 -->
      <div class="platform-card aws">
        <div class="platform-icon">
          <i class="bi bi-hdd-network"></i>
        </div>
        <h5>AWS S3</h5>
        <p>Infraestrutura escalavel da Amazon</p>
        <ul class="features">
          <li>Controle total</li>
          <li>CloudFront CDN</li>
          <li>Altamente escalavel</li>
          <li>Pay-as-you-go</li>
        </ul>
        <div class="deploy-command">
          <code>npm run deploy:aws</code>
        </div>
      </div>

      <!-- Docker -->
      <div class="platform-card docker">
        <div class="platform-icon">
          <i class="bi bi-box"></i>
        </div>
        <h5>Docker</h5>
        <p>Containerizacao para qualquer ambiente</p>
        <ul class="features">
          <li>Portabilidade total</li>
          <li>Isolamento</li>
          <li>Facil escalonamento</li>
          <li>Multi-ambiente</li>
        </ul>
        <div class="deploy-command">
          <code>docker-compose up -d</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeployPlatforms'
}
</script>

<style scoped>
.deploy-platforms {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.platforms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.platform-card {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.platform-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.platform-card.netlify::before {
  background: #00c7b7;
}

.platform-card.vercel::before {
  background: #000000;
}

.platform-card.aws::before {
  background: #ff9900;
}

.platform-card.docker::before {
  background: #2496ed;
}

.platform-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

.platform-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.netlify .platform-icon {
  background: #e6f9f7;
  color: #00c7b7;
}

.vercel .platform-icon {
  background: #f0f0f0;
  color: #000000;
}

.aws .platform-icon {
  background: #fff3e6;
  color: #ff9900;
}

.docker .platform-icon {
  background: #e6f3fb;
  color: #2496ed;
}

.platform-card h5 {
  color: #212529;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.platform-card > p {
  color: #6c757d;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.features {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.features li {
  color: #495057;
  font-size: 0.875rem;
  padding: 0.375rem 0;
  padding-left: 1.25rem;
  position: relative;
}

.features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #28a745;
  font-weight: 700;
}

.deploy-command {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.deploy-command code {
  background: #2d3748;
  color: #68d391;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  display: block;
  text-align: center;
}
</style>
