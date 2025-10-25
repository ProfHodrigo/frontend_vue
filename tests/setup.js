import { config } from '@vue/test-utils'

// Configurações globais para todos os testes
config.global.mocks = {
  // Adicione mocks globais aqui se necessário
}

config.global.stubs = {
  // Adicione stubs globais aqui se necessário
}

// Mock de console para testes mais limpos (opcional)
global.console = {
  ...console,
  // Descomente para silenciar warnings em testes
  // warn: vi.fn(),
  // error: vi.fn(),
}
