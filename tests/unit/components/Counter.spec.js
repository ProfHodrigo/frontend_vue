import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from '@/components/Counter.vue'

describe('Counter.vue', () => {
  it('deve renderizar o contador com valor inicial 0', () => {
    const wrapper = mount(Counter)
    expect(wrapper.find('.count').text()).toBe('0')
  })

  it('deve incrementar o contador', async () => {
    const wrapper = mount(Counter)
    const botaoIncrementar = wrapper.findAll('button')[2]
    
    await botaoIncrementar.trigger('click')
    expect(wrapper.find('.count').text()).toBe('1')
    
    await botaoIncrementar.trigger('click')
    expect(wrapper.find('.count').text()).toBe('2')
  })

  it('deve decrementar o contador', async () => {
    const wrapper = mount(Counter)
    const botaoIncrementar = wrapper.findAll('button')[2]
    const botaoDecrementar = wrapper.findAll('button')[0]
    
    // Incrementar primeiro
    await botaoIncrementar.trigger('click')
    await botaoIncrementar.trigger('click')
    expect(wrapper.find('.count').text()).toBe('2')
    
    // Decrementar
    await botaoDecrementar.trigger('click')
    expect(wrapper.find('.count').text()).toBe('1')
  })

  it('não deve permitir valores negativos', async () => {
    const wrapper = mount(Counter)
    const botaoDecrementar = wrapper.findAll('button')[0]
    
    await botaoDecrementar.trigger('click')
    expect(wrapper.find('.count').text()).toBe('0')
  })

  it('deve desabilitar botão decrementar quando count é 0', () => {
    const wrapper = mount(Counter)
    const botaoDecrementar = wrapper.findAll('button')[0]
    
    expect(botaoDecrementar.attributes('disabled')).toBeDefined()
  })

  it('deve habilitar botão decrementar quando count > 0', async () => {
    const wrapper = mount(Counter)
    const botaoIncrementar = wrapper.findAll('button')[2]
    const botaoDecrementar = wrapper.findAll('button')[0]
    
    await botaoIncrementar.trigger('click')
    expect(botaoDecrementar.attributes('disabled')).toBeUndefined()
  })

  it('deve resetar o contador para 0', async () => {
    const wrapper = mount(Counter)
    const botaoIncrementar = wrapper.findAll('button')[2]
    const botaoReset = wrapper.findAll('button')[1]
    
    // Incrementar
    await botaoIncrementar.trigger('click')
    await botaoIncrementar.trigger('click')
    await botaoIncrementar.trigger('click')
    expect(wrapper.find('.count').text()).toBe('3')
    
    // Resetar
    await botaoReset.trigger('click')
    expect(wrapper.find('.count').text()).toBe('0')
  })
})
