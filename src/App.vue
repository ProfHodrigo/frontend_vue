

<template>
	<div id="app">
		<!-- Tela de autenticação -->
		<div v-if="!usuarioLogado" class="container py-4">
			<div class="row justify-content-center">
				<div class="col-md-6">
					<LoginForm
						v-if="telaAtual === 'login'"
						@mostrar-cadastro="telaAtual = 'cadastro'"
						@login-sucesso="handleLoginSucesso"
					/>

					<CadastroForm
						v-else
						@mostrar-login="telaAtual = 'login'"
						@cadastro-sucesso="() => { telaAtual = 'login' }"
					/>
				</div>
			</div>
		</div>

		<!-- Aplicação principal (usuário logado) -->
		<div v-else>
			<header class="bg-primary text-white py-3">
				<div class="container d-flex justify-content-between align-items-center">
					<div>
						<h4 class="mb-0">
							<i class="fas fa-graduation-cap me-2"></i>
							Aula 7 - Autenticação JWT
						</h4>
						<small class="opacity-75">Exemplo de fluxo de login / cadastro</small>
					</div>

					<div class="d-flex align-items-center gap-3">
						<div class="text-end me-3">
							<div><strong>{{ usuarioLogado.nome }}</strong></div>
							<div class="small text-white-50">{{ usuarioLogado.email }}</div>
						</div>

						<div class="btn-group">
							<button class="btn btn-outline-light btn-sm" @click="atualizarPerfil">
								<i class="fas fa-sync me-1"></i> Atualizar
							</button>
							<button class="btn btn-outline-light btn-sm" @click="fazerLogout">
								<i class="fas fa-sign-out-alt me-1"></i> Sair
							</button>
						</div>
					</div>
				</div>
			</header>

			<main class="container my-4">
				<div class="row">
					<div class="col-md-8">
						<div class="card mb-3">
							<div class="card-body">
								<h5 class="card-title">Bem-vindo, {{ usuarioLogado.nome }}!</h5>
								<p class="card-text">Esta é a área protegida da aplicação.</p>

								<div class="d-flex gap-2">
									<button class="btn btn-primary btn-sm" @click="testarAPIProtegida" :disabled="testandoAPI">
										<i v-if="!testandoAPI" class="fas fa-shield-alt me-1"></i>
										<i v-else class="fas fa-spinner fa-spin me-1"></i>
										Testar API Protegida
									</button>
								</div>
							</div>
						</div>

						<div class="card">
							<div class="card-header">Log de Atividades</div>
							<div class="card-body p-2">
								<div v-if="logAtividades.length === 0" class="text-center text-muted py-3">
									<i class="fas fa-clipboard-list fa-2x mb-2"></i>
									<div>Nenhuma atividade registrada</div>
								</div>
								<div v-else>
									<div v-for="(item, idx) in logAtividades.slice().reverse()" :key="idx" class="py-2 border-bottom">
										<div class="d-flex justify-content-between">
											<div>
												<i :class="['fas', item.icone, 'me-2']"></i>
												<strong>{{ item.titulo }}</strong>
												<div class="small text-muted">{{ item.detalhes }}</div>
											</div>
											<small class="text-muted">{{ formatarTempo(item.timestamp) }}</small>
										</div>
									</div>
								</div>
							</div>
							<div class="card-footer text-end">
								<button class="btn btn-sm btn-outline-secondary" @click="limparLog">Limpar</button>
							</div>
						</div>
					</div>

					<div class="col-md-4">
						<div class="card">
							<div class="card-header">Token JWT</div>
							<div class="card-body">
								<textarea class="form-control small" rows="8" :value="tokenFormatado" readonly></textarea>
								<div class="d-grid mt-2">
									<button class="btn btn-outline-primary btn-sm" @click="copiarToken">Copiar Token</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	</div>
</template>

<script>
import AuthService from '@/services/AuthService'
import LoginForm from '@/components/LoginForm.vue'
import CadastroForm from '@/components/CadastroForm.vue'

export default {
	name: 'App',
	components: { LoginForm, CadastroForm },
	data() {
		return {
			telaAtual: 'login',
			usuarioLogado: null,
			dataLogin: null,
			testandoAPI: false,
			atualizandoPerfil: false,
			logAtividades: []
		}
	},
	computed: {
		tokenFormatado() {
			const token = AuthService.getToken()
			if (!token) return ''
			// quebra o token em linhas para melhor leitura
			return token.match(/.{1,60}/g)?.join('\n') || token
		}
	},
	async mounted() {
		// tentar restaurar sessão se houver token válido
		if (AuthService.isAuthenticated()) {
			this.usuarioLogado = AuthService.getCurrentUser()
			this.dataLogin = new Date().toLocaleString()
			this.adicionarLog('fa-sign-in-alt text-success', 'Sessão restaurada', `Olá ${this.usuarioLogado.nome}`)
			await this.atualizarPerfil()
		}
	},
	methods: {
		handleLoginSucesso(usuario) {
			this.usuarioLogado = usuario
			this.dataLogin = new Date().toLocaleString()
			this.adicionarLog('fa-sign-in-alt text-success', 'Login realizado', `Bem-vindo, ${usuario.nome}`)
		},

		async fazerLogout() {
			const ok = confirm('Deseja realmente sair?')
			if (!ok) return
			AuthService.logout()
			// após logout, recarregar a página para resetar estado
			window.location.href = '/'
		},

		async testarAPIProtegida() {
			this.testandoAPI = true
			try {
				const res = await AuthService.obterPerfil()
				if (res.sucesso) {
					this.adicionarLog('fa-shield-alt text-success', 'API protegida OK', 'Acesso autorizado')
					alert('API protegida acessível. Perfil atualizado.')
				} else {
					this.adicionarLog('fa-shield-alt text-danger', 'Erro API', res.mensagem || 'Erro desconhecido')
					alert('Erro: ' + (res.mensagem || 'Resposta inválida'))
				}
			} catch (err) {
				this.adicionarLog('fa-shield-alt text-danger', 'Exceção', err.message)
				alert('Erro inesperado: ' + err.message)
			} finally {
				this.testandoAPI = false
			}
		},

		async atualizarPerfil() {
			this.atualizandoPerfil = true
			try {
				const res = await AuthService.refreshUserData()
				if (res.sucesso) {
					this.usuarioLogado = res.usuario
					this.adicionarLog('fa-user-edit text-info', 'Perfil sincronizado', 'Dados atualizados do servidor')
				} else {
					this.adicionarLog('fa-user-edit text-warning', 'Falha ao atualizar', res.mensagem)
				}
			} catch (err) {
				this.adicionarLog('fa-user-edit text-danger', 'Erro', err.message)
			} finally {
				this.atualizandoPerfil = false
			}
		},

		copiarToken() {
			const token = AuthService.getToken()
			if (!token) return alert('Nenhum token disponível')
			navigator.clipboard.writeText(token).then(() => {
				this.adicionarLog('fa-copy text-info', 'Token copiado', 'Token copiado para a área de transferência')
				alert('Token copiado!')
			}).catch(() => alert('Falha ao copiar token'))
		},

		adicionarLog(icone, titulo, detalhes) {
			this.logAtividades.push({ icone, titulo, detalhes, timestamp: Date.now() })
			if (this.logAtividades.length > 50) this.logAtividades = this.logAtividades.slice(-50)
		},

		limparLog() { this.logAtividades = [] },

		formatarTempo(ts) { return new Date(ts).toLocaleString() }
	}
}
</script>

<style>
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
#app { min-height: 100vh; background: #f8f9fa; }
.card { box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.small { font-size: .85rem; }
.text-white-50 { color: rgba(255,255,255,0.85); }
</style>

