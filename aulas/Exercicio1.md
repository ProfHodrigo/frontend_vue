# Teste 1 - Card de Produto Estilizado

## Objetivo do Exercício


Criar um componente de card de produto profissional e responsivo, utilizando Bootstrap 5 e SCSS. O card deve ter efeitos visuais atrativos, incluindo hover states, animações suaves e layout que se adapta perfeitamente de dispositivos móveis a desktops.

**O que você vai praticar:**
- Estruturação de componentes com Bootstrap
- Estilização avançada com SCSS
- Efeitos hover e transições CSS
- Design responsivo mobile-first
- Uso de variáveis e mixins SCSS
- Composição visual atrativa

## Contexto

Cards de produto são elementos fundamentais em e-commerce e aplicações de catálogo. Um card bem projetado deve:
- Apresentar informações de forma clara e organizada
- Ter visual atrativo que chame atenção do usuário
- Responder a interações com feedback visual
- Adaptar-se perfeitamente a diferentes tamanhos de tela
- Manter consistência com o design system da aplicação

## Passo 1: Criar o Componente Base

Crie o arquivo `src/components/ProductCard.vue`:

```vue
<template>
  <div class="product-card">
    <div class="card h-100">
      <!-- Badge de desconto -->
      <div v-if="produto.desconto" class="badge-desconto">
        -{{ produto.desconto }}%
      </div>
      
      <!-- Imagem do produto -->
      <div class="image-container">
        <img 
          :src="produto.imagem" 
          :alt="produto.nome"
          class="card-img-top"
        >
        <div class="image-overlay">
          <button class="btn-quick-view" @click="visualizarRapido">
            <i class="bi bi-eye"></i>
            Visualizar
          </button>
        </div>
      </div>
      
      <!-- Corpo do card -->
      <div class="card-body">
        <!-- Categoria -->
        <span class="categoria">{{ produto.categoria }}</span>
        
        <!-- Nome do produto -->
        <h5 class="card-title">{{ produto.nome }}</h5>
        
        <!-- Avaliação -->
        <div class="avaliacao">
          <span 
            v-for="n in 5" 
            :key="n"
            class="estrela"
            :class="{ 'preenchida': n <= produto.avaliacao }"
          >
            ★
          </span>
          <span class="total-avaliacoes">({{ produto.totalAvaliacoes }})</span>
        </div>
        
        <!-- Descrição curta -->
        <p class="descricao">{{ produto.descricao }}</p>
        
        <!-- Preços -->
        <div class="precos">
          <div v-if="produto.desconto" class="preco-container">
            <span class="preco-original">
              R$ {{ formatarPreco(produto.precoOriginal) }}
            </span>
            <span class="preco-atual">
              R$ {{ formatarPreco(produto.preco) }}
            </span>
          </div>
          <div v-else class="preco-container">
            <span class="preco-unico">
              R$ {{ formatarPreco(produto.preco) }}
            </span>
          </div>
        </div>
        
        <!-- Informações adicionais -->
        <div class="info-adicional">
          <span v-if="produto.estoque > 0" class="em-estoque">
            <i class="bi bi-check-circle"></i>
            Em estoque
          </span>
          <span v-else class="sem-estoque">
            <i class="bi bi-x-circle"></i>
            Indisponível
          </span>
          
          <span class="frete-gratis" v-if="produto.freteGratis">
            <i class="bi bi-truck"></i>
            Frete grátis
          </span>
        </div>
      </div>
      
      <!-- Footer do card -->
      <div class="card-footer">
        <button 
          class="btn-adicionar"
          :disabled="produto.estoque === 0"
          @click="adicionarAoCarrinho"
        >
          <i class="bi bi-cart-plus"></i>
          {{ produto.estoque > 0 ? 'Adicionar ao Carrinho' : 'Indisponível' }}
        </button>
        
        <button class="btn-favorito" @click="toggleFavorito">
          <i 
            class="bi" 
            :class="favorito ? 'bi-heart-fill' : 'bi-heart'"
          ></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  produto: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.nome && value.preco !== undefined && value.imagem
    }
  }
})

const emit = defineEmits(['adicionar-carrinho', 'visualizar', 'favoritar'])

const favorito = ref(false)

function formatarPreco(valor) {
  return valor.toFixed(2).replace('.', ',')
}

function adicionarAoCarrinho() {
  emit('adicionar-carrinho', props.produto)
}

function visualizarRapido() {
  emit('visualizar', props.produto)
}

function toggleFavorito() {
  favorito.value = !favorito.value
  emit('favoritar', { produto: props.produto, favorito: favorito.value })
}
</script>

<style lang="scss" scoped>
// Variáveis
$cor-primaria: #42b983;
$cor-secundaria: #2c3e50;
$cor-perigo: #e74c3c;
$cor-sucesso: #27ae60;
$cor-aviso: #f39c12;
$cor-estrela: #ffc107;

$cinza-claro: #f8f9fa;
$cinza-medio: #6c757d;
$cinza-escuro: #343a40;

$espacamento-sm: 0.5rem;
$espacamento-md: 1rem;
$espacamento-lg: 1.5rem;

$raio-borda: 12px;
$raio-badge: 20px;

$transicao-padrao: all 0.3s ease;
$sombra-hover: 0 8px 16px rgba(0, 0, 0, 0.15);

// Componente principal
.product-card {
  width: 100%;
  max-width: 350px;
  
  .card {
    border: 1px solid #e0e0e0;
    border-radius: $raio-borda;
    overflow: hidden;
    transition: $transicao-padrao;
    position: relative;
    
    &:hover {
      transform: translateY(-8px);
      box-shadow: $sombra-hover;
      
      .image-overlay {
        opacity: 1;
      }
    }
  }
}

// Badge de desconto
.badge-desconto {
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: $cor-perigo;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: $raio-badge;
  font-weight: bold;
  font-size: 0.875rem;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

// Container da imagem
.image-container {
  position: relative;
  overflow: hidden;
  background-color: $cinza-claro;
  aspect-ratio: 4 / 3;
  
  .card-img-top {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover .card-img-top {
    transform: scale(1.1);
  }
}

// Overlay da imagem
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: $transicao-padrao;
}

.btn-quick-view {
  background-color: white;
  color: $cor-secundaria;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: $transicao-padrao;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: $cor-primaria;
    color: white;
    transform: scale(1.05);
  }
  
  i {
    font-size: 1.2rem;
  }
}

// Corpo do card
.card-body {
  padding: $espacamento-lg;
}

.categoria {
  display: inline-block;
  background-color: $cinza-claro;
  color: $cor-secundaria;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: $espacamento-sm;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: $cor-secundaria;
  margin: $espacamento-sm 0;
  min-height: 2.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// Avaliação
.avaliacao {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: $espacamento-md;
  
  .estrela {
    color: #ddd;
    font-size: 1rem;
    
    &.preenchida {
      color: $cor-estrela;
    }
  }
  
  .total-avaliacoes {
    color: $cinza-medio;
    font-size: 0.875rem;
    margin-left: 0.25rem;
  }
}

.descricao {
  color: $cinza-medio;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: $espacamento-md;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// Preços
.precos {
  margin-bottom: $espacamento-md;
}

.preco-container {
  display: flex;
  align-items: center;
  gap: $espacamento-sm;
  flex-wrap: wrap;
}

.preco-original {
  color: $cinza-medio;
  font-size: 0.9rem;
  text-decoration: line-through;
}

.preco-atual,
.preco-unico {
  color: $cor-primaria;
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1;
}

// Informações adicionais
.info-adicional {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: $espacamento-md 0;
  border-top: 1px solid #e0e0e0;
  
  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    
    i {
      font-size: 1rem;
    }
  }
  
  .em-estoque {
    color: $cor-sucesso;
    font-weight: 600;
  }
  
  .sem-estoque {
    color: $cor-perigo;
    font-weight: 600;
  }
  
  .frete-gratis {
    color: $cor-primaria;
    font-weight: 600;
  }
}

// Footer
.card-footer {
  background-color: white;
  border-top: 1px solid #e0e0e0;
  padding: $espacamento-md $espacamento-lg;
  display: flex;
  gap: $espacamento-sm;
}

.btn-adicionar {
  flex: 1;
  background-color: $cor-primaria;
  color: white;
  border: none;
  padding: 0.875rem 1.25rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: $transicao-padrao;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    background-color: darken($cor-primaria, 10%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba($cor-primaria, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    background-color: $cinza-medio;
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  i {
    font-size: 1.1rem;
  }
}

.btn-favorito {
  background-color: white;
  color: $cor-perigo;
  border: 2px solid $cor-perigo;
  padding: 0.875rem;
  border-radius: 8px;
  cursor: pointer;
  transition: $transicao-padrao;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  
  &:hover {
    background-color: $cor-perigo;
    color: white;
    transform: scale(1.05);
  }
  
  i {
    font-size: 1.25rem;
  }
}

// Responsividade
@media (max-width: 576px) {
  .product-card {
    max-width: 100%;
  }
  
  .card-body {
    padding: $espacamento-md;
  }
  
  .preco-atual,
  .preco-unico {
    font-size: 1.5rem;
  }
  
  .btn-adicionar {
    font-size: 0.85rem;
    padding: 0.75rem 1rem;
  }
}
</style>
```

## Passo 2: Criar Exemplo de Uso

Crie ou atualize `src/views/ProdutosView.vue` para demonstrar o componente:

```vue
<template>
  <div class="produtos-view">
    <div class="container py-5">
      <h1 class="text-center mb-5">Nossos Produtos</h1>
      
      <div class="row g-4">
        <div 
          v-for="produto in produtos" 
          :key="produto.id"
          class="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex justify-content-center"
        >
          <ProductCard 
            :produto="produto"
            @adicionar-carrinho="handleAdicionarCarrinho"
            @visualizar="handleVisualizar"
            @favoritar="handleFavoritar"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'

const produtos = ref([
  {
    id: 1,
    nome: 'Notebook Gamer Pro',
    descricao: 'Notebook de alta performance para jogos e trabalho',
    categoria: 'Eletrônicos',
    preco: 4500.00,
    precoOriginal: 5500.00,
    desconto: 18,
    imagem: 'https://via.placeholder.com/400x300/42b983/ffffff?text=Notebook',
    avaliacao: 5,
    totalAvaliacoes: 128,
    estoque: 15,
    freteGratis: true
  },
  {
    id: 2,
    nome: 'Mouse Gamer RGB',
    descricao: 'Mouse ergonômico com iluminação RGB personalizável',
    categoria: 'Periféricos',
    preco: 199.90,
    precoOriginal: 299.90,
    desconto: 33,
    imagem: 'https://via.placeholder.com/400x300/e74c3c/ffffff?text=Mouse',
    avaliacao: 4,
    totalAvaliacoes: 89,
    estoque: 42,
    freteGratis: false
  },
  {
    id: 3,
    nome: 'Teclado Mecânico',
    descricao: 'Teclado mecânico com switches blue e retroiluminação',
    categoria: 'Periféricos',
    preco: 350.00,
    imagem: 'https://via.placeholder.com/400x300/3498db/ffffff?text=Teclado',
    avaliacao: 5,
    totalAvaliacoes: 56,
    estoque: 8,
    freteGratis: true
  },
  {
    id: 4,
    nome: 'Headset Premium',
    descricao: 'Headset com som surround 7.1 e microfone removível',
    categoria: 'Áudio',
    preco: 280.00,
    precoOriginal: 400.00,
    desconto: 30,
    imagem: 'https://via.placeholder.com/400x300/9b59b6/ffffff?text=Headset',
    avaliacao: 4,
    totalAvaliacoes: 72,
    estoque: 0,
    freteGratis: false
  }
])

function handleAdicionarCarrinho(produto) {
  console.log('Adicionar ao carrinho:', produto)
  alert(`${produto.nome} adicionado ao carrinho!`)
}

function handleVisualizar(produto) {
  console.log('Visualizar:', produto)
  alert(`Visualizando: ${produto.nome}`)
}

function handleFavoritar(dados) {
  console.log('Favoritar:', dados)
  const acao = dados.favorito ? 'adicionado aos' : 'removido dos'
  alert(`${dados.produto.nome} ${acao} favoritos!`)
}
</script>

<style scoped>
.produtos-view {
  background-color: #f8f9fa;
  min-height: 100vh;
}

h1 {
  color: #2c3e50;
  font-weight: 800;
}
</style>
```

## Passo 3: Adicionar Bootstrap Icons

Adicione o Bootstrap Icons no `index.html`:

```html
<head>
  <!-- ... outros links ... -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
</head>
```

Ou via npm:

```bash
npm install bootstrap-icons
```

E importe no `main.js`:

```javascript
import 'bootstrap-icons/font/bootstrap-icons.css'
```

## Passo 4: Testar o Componente

Execute a aplicação:

```bash
npm run dev
```

Acesse a página e verifique:

1. **Visual do card:**
   - Badge de desconto aparece apenas quando há desconto
   - Imagem com overlay ao passar o mouse
   - Informações organizadas e legíveis
   - Cores e espaçamentos adequados

2. **Efeitos hover:**
   - Card sobe ao passar o mouse
   - Imagem aumenta com zoom suave
   - Overlay aparece com botão "Visualizar"
   - Botões mudam de cor/escala

3. **Responsividade:**
   - Mobile (< 576px): 1 card por linha
   - Tablet (≥ 576px): 2 cards por linha
   - Desktop (≥ 992px): 3 cards por linha
   - Wide (≥ 1200px): 4 cards por linha

4. **Interatividade:**
   - Clicar em "Adicionar ao Carrinho" mostra alerta
   - Clicar no coração alterna favorito (preenchido/vazio)
   - Botão "Visualizar" aparece no hover da imagem
   - Produtos sem estoque mostram botão desabilitado

## Passo 5: Variações e Melhorias (Opcional)

### Variante Horizontal

```vue
<style lang="scss" scoped>
// Adicionar ao final
@media (min-width: 768px) {
  .product-card.horizontal {
    max-width: 100%;
    
    .card {
      flex-direction: row;
    }
    
    .image-container {
      width: 40%;
      aspect-ratio: 1/1;
    }
    
    .card-body {
      width: 60%;
    }
  }
}
</style>
```
