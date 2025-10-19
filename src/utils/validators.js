/**
 * Sistema de validação simplificado
 */
export class FormValidator {
  constructor() {
    this.rules = {}
    this.errors = {}
  }
  
  setRules(fieldName, rules) {
    this.rules[fieldName] = rules
    return this
  }
  
  validateField(fieldName, value) {
    const rules = this.rules[fieldName]
    if (!rules) return true
    
    this.errors[fieldName] = []
    
    for (const rule of rules) {
      const result = this.executeRule(rule, value, fieldName)
      if (result !== true) {
        this.errors[fieldName].push(result)
      }
    }
    
    return this.errors[fieldName].length === 0
  }
  
  validate(data) {
    let isValid = true
    this.errors = {}
    
    for (const fieldName in this.rules) {
      const fieldValid = this.validateField(fieldName, data[fieldName])
      if (!fieldValid) isValid = false
    }
    
    return isValid
  }
  
  executeRule(rule, value, fieldName) {
    if (typeof rule === 'function') return rule(value, fieldName)
    if (typeof rule === 'object') return this.executeBuiltInRule(rule, value, fieldName)
    return this.executeBuiltInRule({ type: rule }, value, fieldName)
  }
  
  executeBuiltInRule(rule, value, fieldName) {
    switch (rule.type) {
      case 'required':
        return this.validateRequired(value) || 
               (rule.message || `${fieldName} é obrigatório`)
      case 'email':
        return this.validateEmail(value) || 
               (rule.message || 'Email inválido')
      case 'min':
        return this.validateMin(value, rule.value) || 
               (rule.message || `Mínimo ${rule.value} caracteres`)
      case 'cpf':
        return this.validateCPF(value) || 
               (rule.message || 'CPF inválido')
      default:
        return true
    }
  }
  
  validateRequired(value) {
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'string') return value.trim().length > 0
    return value !== null && value !== undefined && value !== ''
  }
  
  validateEmail(value) {
    if (!value) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }
  
  validateMin(value, min) {
    if (!value) return true
    return String(value).length >= min
  }
  
  validateCPF(value) {
    if (!value) return true
    const cpf = value.replace(/\D/g, '')
    if (cpf.length !== 11) return false
    return true // Simplificado para exemplo
  }
  
  getFieldErrors(fieldName) {
    return this.errors[fieldName] || []
  }
  
  hasFieldError(fieldName) {
    return this.getFieldErrors(fieldName).length > 0
  }
  
  getFirstFieldError(fieldName) {
    const errors = this.getFieldErrors(fieldName)
    return errors.length > 0 ? errors[0] : null
  }
  
  clearErrors(fieldName = null) {
    if (fieldName) {
      delete this.errors[fieldName]
    } else {
      this.errors = {}
    }
  }
}

// Validadores pré-definidos
export const validators = {
  cpf: (value) => {
    if (!value) return true
    const cpf = value.replace(/\D/g, '')
    return cpf.length === 11
  },
  
  phone: (value) => {
    if (!value) return true
    const phone = value.replace(/\D/g, '')
    return phone.length >= 10 && phone.length <= 11
  }
}