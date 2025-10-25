import { describe, it, expect } from 'vitest'
import { validarEmail, validarCPF, validarTelefone } from '@/utils/validators'

describe('validators.js', () => {
  describe('validarEmail', () => {
    it('deve validar emails corretos', () => {
      expect(validarEmail('teste@email.com')).toBe(true)
      expect(validarEmail('usuario.teste@dominio.com.br')).toBe(true)
      expect(validarEmail('email123@teste.org')).toBe(true)
    })

    it('deve rejeitar emails inválidos', () => {
      expect(validarEmail('email-sem-arroba.com')).toBe(false)
      expect(validarEmail('email@sem-dominio')).toBe(false)
      expect(validarEmail('email com espaço@teste.com')).toBe(false)
      expect(validarEmail('@dominio.com')).toBe(false)
      expect(validarEmail('email@')).toBe(false)
    })

    it('deve rejeitar string vazia', () => {
      expect(validarEmail('')).toBe(false)
    })

    it('deve rejeitar null e undefined', () => {
      expect(validarEmail(null)).toBe(false)
      expect(validarEmail(undefined)).toBe(false)
    })
  })

  describe('validarCPF', () => {
    it('deve validar CPF com 11 dígitos', () => {
      expect(validarCPF('12345678901')).toBe(true)
      expect(validarCPF('000.000.000-00')).toBe(true) // Remove pontuação
    })

    it('deve rejeitar CPF com menos de 11 dígitos', () => {
      expect(validarCPF('123456789')).toBe(false)
      expect(validarCPF('1234567890')).toBe(false)
    })

    it('deve rejeitar CPF com mais de 11 dígitos', () => {
      expect(validarCPF('123456789012')).toBe(false)
    })

    it('deve aceitar CPF formatado', () => {
      expect(validarCPF('123.456.789-01')).toBe(true)
    })

    it('deve rejeitar string vazia', () => {
      expect(validarCPF('')).toBe(false)
    })

    it('deve rejeitar null e undefined', () => {
      expect(validarCPF(null)).toBe(false)
      expect(validarCPF(undefined)).toBe(false)
    })

    it('deve remover caracteres não numéricos', () => {
      expect(validarCPF('123.456.789-01')).toBe(true)
      expect(validarCPF('123 456 789 01')).toBe(true)
    })
  })

  describe('validarTelefone', () => {
    it('deve validar telefone com 10 dígitos', () => {
      expect(validarTelefone('1234567890')).toBe(true)
    })

    it('deve validar telefone com 11 dígitos', () => {
      expect(validarTelefone('12345678901')).toBe(true)
    })

    it('deve validar telefone formatado', () => {
      expect(validarTelefone('(12) 3456-7890')).toBe(true)
      expect(validarTelefone('(12) 93456-7890')).toBe(true)
    })

    it('deve rejeitar telefone com menos de 10 dígitos', () => {
      expect(validarTelefone('123456789')).toBe(false)
    })

    it('deve rejeitar telefone com mais de 11 dígitos', () => {
      expect(validarTelefone('123456789012')).toBe(false)
    })

    it('deve rejeitar string vazia', () => {
      expect(validarTelefone('')).toBe(false)
    })

    it('deve rejeitar null e undefined', () => {
      expect(validarTelefone(null)).toBe(false)
      expect(validarTelefone(undefined)).toBe(false)
    })

    it('deve remover caracteres não numéricos', () => {
      expect(validarTelefone('(12) 3456-7890')).toBe(true)
      expect(validarTelefone('12 3456-7890')).toBe(true)
      expect(validarTelefone('12-3456-7890')).toBe(true)
    })
  })
})
