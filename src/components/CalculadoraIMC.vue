<template>
  <div class="calculadora-imc-card">
    <div class="card">
      <div class="card-header bg-info text-white">
        <h4 class="mb-0">
          <i class="fas fa-heartbeat me-2"></i>
          Exercício 3 - Calculadora de IMC
        </h4>
      </div>
      <div class="card-body">
        <!-- Formulário -->
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">
                <i class="fas fa-weight me-1"></i>
                Peso (kg):
              </label>
              <input 
                v-model.number="peso"
                type="number"
                class="form-control"
                placeholder="Ex: 70"
                step="0.1"
                min="0"
              >
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">
                <i class="fas fa-ruler-vertical me-1"></i>
                Altura (m):
              </label>
              <input 
                v-model.number="altura"
                type="number"
                class="form-control"
                placeholder="Ex: 1.75"
                step="0.01"
                min="0"
              >
            </div>
          </div>
        </div>

        <!-- Resultado -->
        <div v-if="peso > 0 && altura > 0" class="mt-4">
          <!-- Display do IMC -->
          <div class="text-center mb-4">
            <h2 class="display-4 fw-bold mb-0" :class="'text-' + classificacao.cor">
              {{ imc.toFixed(2) }}
            </h2>
            <p class="text-muted">Seu IMC</p>
          </div>

          <!-- Classificação -->
          <div class="alert mb-4" :class="'alert-' + classificacao.cor">
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <h5 class="mb-1">
                  <i :class="'fas fa-' + classificacao.icone + ' me-2'"></i>
                  {{ classificacao.nome }}
                </h5>
                <p class="mb-0 small">{{ classificacao.descricao }}</p>
              </div>
              <i :class="'fas fa-' + classificacao.icone + ' fa-3x opacity-25'"></i>
            </div>
          </div>

          <!-- Tabela de Referência -->
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-table me-2"></i>
                Tabela de Referência
              </h6>
            </div>
            <div class="card-body p-0">
              <table class="table table-sm table-hover mb-0">
                <tbody>
                  <tr 
                    v-for="(ref, index) in tabelaReferencia" 
                    :key="index"
                    :class="{ 'table-active fw-bold': ref.nome === classificacao.nome }"
                  >
                    <td>
                      <i :class="'fas fa-circle text-' + ref.cor + ' me-2'"></i>
                      {{ ref.nome }}
                    </td>
                    <td class="text-end">{{ ref.faixa }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Dicas -->
          <div class="alert alert-light mt-3">
            <small class="text-muted">
              <i class="fas fa-info-circle me-1"></i>
              <strong>Dica:</strong> {{ classificacao.dica }}
            </small>
          </div>
        </div>

        <!-- Mensagem inicial -->
        <div v-else class="text-center py-4">
          <i class="fas fa-calculator fa-3x text-muted mb-3"></i>
          <p class="text-muted">Preencha peso e altura para calcular o IMC</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalculadoraIMC',
  data() {
    return {
      peso: null,
      altura: null,
      tabelaReferencia: [
        { nome: 'Abaixo do peso', faixa: 'Abaixo de 18.5', cor: 'primary' },
        { nome: 'Peso normal', faixa: '18.5 - 24.9', cor: 'success' },
        { nome: 'Sobrepeso', faixa: '25.0 - 29.9', cor: 'warning' },
        { nome: 'Obesidade Grau I', faixa: '30.0 - 34.9', cor: 'warning' },
        { nome: 'Obesidade Grau II', faixa: '35.0 - 39.9', cor: 'danger' },
        { nome: 'Obesidade Grau III', faixa: 'Acima de 40.0', cor: 'danger' }
      ]
    }
  },
  computed: {
    imc() {
      if (this.peso > 0 && this.altura > 0) {
        return this.peso / (this.altura * this.altura)
      }
      return 0
    },
    classificacao() {
      const imc = this.imc

      if (imc === 0) {
        return {
          nome: '',
          descricao: '',
          cor: 'secondary',
          icone: 'question',
          dica: ''
        }
      }

      if (imc < 18.5) {
        return {
          nome: 'Abaixo do peso',
          descricao: 'Você está abaixo do peso ideal',
          cor: 'primary',
          icone: 'arrow-down',
          dica: 'Consulte um nutricionista para ganhar peso de forma saudável.'
        }
      } else if (imc >= 18.5 && imc < 25) {
        return {
          nome: 'Peso normal',
          descricao: 'Parabéns! Seu peso está ideal',
          cor: 'success',
          icone: 'check-circle',
          dica: 'Mantenha uma alimentação equilibrada e pratique exercícios regularmente.'
        }
      } else if (imc >= 25 && imc < 30) {
        return {
          nome: 'Sobrepeso',
          descricao: 'Você está levemente acima do peso',
          cor: 'warning',
          icone: 'exclamation-triangle',
          dica: 'Considere adotar hábitos mais saudáveis e praticar atividades físicas.'
        }
      } else if (imc >= 30 && imc < 35) {
        return {
          nome: 'Obesidade Grau I',
          descricao: 'Atenção: obesidade moderada',
          cor: 'warning',
          icone: 'exclamation-circle',
          dica: 'Procure orientação médica e nutricional para um plano de emagrecimento.'
        }
      } else if (imc >= 35 && imc < 40) {
        return {
          nome: 'Obesidade Grau II',
          descricao: 'Cuidado: obesidade severa',
          cor: 'danger',
          icone: 'exclamation-triangle',
          dica: 'Consulte um médico urgentemente para avaliação e tratamento adequado.'
        }
      } else {
        return {
          nome: 'Obesidade Grau III',
          descricao: 'Alerta: obesidade mórbida',
          cor: 'danger',
          icone: 'exclamation-circle',
          dica: 'Procure ajuda médica imediatamente. Tratamento especializado é necessário.'
        }
      }
    }
  }
}
</script>

<style scoped>
.calculadora-imc-card {
  margin-bottom: 2rem;
}

.table-active {
  background-color: rgba(13, 110, 253, 0.1);
}

input[type="number"] {
  font-size: 1.1rem;
}

.fa-circle {
  font-size: 0.5rem;
  vertical-align: middle;
}
</style>
