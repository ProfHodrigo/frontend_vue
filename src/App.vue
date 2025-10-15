<template>
  <div id="app" class="aula3-wrapper">
    <div class="aula3-card">
      <h1>Vue.js - Aula 3</h1>
      <p class="desc">Material da aula e exercícios:</p>
      <ul class="links">
        <li>
          <a href="https://github.com/ProfHodrigo/frontend_vue/blob/aula-03-api/aulas/Aula3.md" target="_blank">Aula3.md</a>
        </li>
        <li>
          <a href="https://github.com/ProfHodrigo/frontend_vue/blob/aula-03-api/aulas/Exercicio1.md" target="_blank">Exercicio1.md</a>
        </li>
        <li>
          <a href="https://github.com/ProfHodrigo/frontend_vue/blob/aula-03-api/aulas/Exercicio2.md" target="_blank">Exercicio2.md</a>
        </li>
        <li>
          <a href="https://github.com/ProfHodrigo/frontend_vue/blob/aula-03-api/aulas/Exercicio3.md" target="_blank">Exercicio3.md</a>
        </li>
      </ul>
      <p class="footer">Prof. Rodrigo Viana &mdash; <a href="https://axios-http.com/" target="_blank">Axios Docs</a></p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app.aula3-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.aula3-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(102,126,234,0.15);
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.aula3-card h1 {
  margin-bottom: 0.5rem;
  font-size: 2.2rem;
  color: #667eea;
  letter-spacing: 1px;
}

.aula3-card .desc {
  color: #555;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.aula3-card .links {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}
.aula3-card .links li {
  margin-bottom: 0.7rem;
}
.aula3-card .links a {
  color: #764ba2;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.08rem;
  transition: color 0.2s;
}
.aula3-card .links a:hover {
  color: #667eea;
  text-decoration: underline;
}
.aula3-card .footer {
  margin-top: 1.5rem;
  color: #aaa;
  font-size: 0.95rem;
}
.aula3-card .footer a {
  color: #aaa;
  text-decoration: underline;
}
</style>