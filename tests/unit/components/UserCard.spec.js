import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserCard from '@/components/UserCard.vue'

describe('UserCard.vue', () => {
  const usuarioMock = {
    nome: 'João Silva',
    email: 'joao@email.com',
    cargo: 'Desenvolvedor'
  }

  it('deve renderizar informações do usuário', () => {
    const wrapper = mount(UserCard, {
      props: { user: usuarioMock }
    })

    expect(wrapper.find('h3').text()).toBe('João Silva')
    expect(wrapper.find('.user-email').text()).toBe('joao@email.com')
    expect(wrapper.find('.user-cargo').text()).toBe('Desenvolvedor')
  })

  it('deve mostrar iniciais quando não há avatar', () => {
    const wrapper = mount(UserCard, {
      props: { user: usuarioMock }
    })

    expect(wrapper.find('.avatar-placeholder').text()).toBe('JS')
  })

  it('deve mostrar apenas primeira inicial para nome único', () => {
    const wrapper = mount(UserCard, {
      props: {
        user: {
          nome: 'João',
          email: 'joao@email.com'
        }
      }
    })

    expect(wrapper.find('.avatar-placeholder').text()).toBe('J')
  })

  it('deve mostrar imagem quando avatar está presente', () => {
    const usuarioComAvatar = {
      ...usuarioMock,
      avatar: 'https://example.com/avatar.jpg'
    }

    const wrapper = mount(UserCard, {
      props: { user: usuarioComAvatar }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/avatar.jpg')
    expect(img.attributes('alt')).toBe('João Silva')
  })

  it('deve exibir botão editar por padrão', () => {
    const wrapper = mount(UserCard, {
      props: { user: usuarioMock }
    })

    expect(wrapper.find('.btn-edit').exists()).toBe(true)
  })

  it('deve ocultar botão editar quando showEditButton é false', () => {
    const wrapper = mount(UserCard, {
      props: {
        user: usuarioMock,
        showEditButton: false
      }
    })

    expect(wrapper.find('.btn-edit').exists()).toBe(false)
  })

  it('deve ocultar botão excluir por padrão', () => {
    const wrapper = mount(UserCard, {
      props: { user: usuarioMock }
    })

    expect(wrapper.find('.btn-delete').exists()).toBe(false)
  })

  it('deve exibir botão excluir quando showDeleteButton é true', () => {
    const wrapper = mount(UserCard, {
      props: {
        user: usuarioMock,
        showDeleteButton: true
      }
    })

    expect(wrapper.find('.btn-delete').exists()).toBe(true)
  })

  it('deve emitir evento edit ao clicar em editar', async () => {
    const wrapper = mount(UserCard, {
      props: { user: usuarioMock }
    })

    await wrapper.find('.btn-edit').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('edit')
    expect(wrapper.emitted('edit')).toHaveLength(1)
    expect(wrapper.emitted('edit')[0]).toEqual([usuarioMock])
  })

  it('deve emitir evento delete ao clicar em excluir', async () => {
    const usuarioComId = {
      ...usuarioMock,
      id: 123
    }

    const wrapper = mount(UserCard, {
      props: {
        user: usuarioComId,
        showDeleteButton: true
      }
    })

    await wrapper.find('.btn-delete').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('delete')
    expect(wrapper.emitted('delete')).toHaveLength(1)
    expect(wrapper.emitted('delete')[0]).toEqual([123])
  })

  it('deve emitir email ao deletar usuário sem id', async () => {
    const wrapper = mount(UserCard, {
      props: {
        user: usuarioMock,
        showDeleteButton: true
      }
    })

    await wrapper.find('.btn-delete').trigger('click')

    expect(wrapper.emitted('delete')[0]).toEqual(['joao@email.com'])
  })

  it('não deve renderizar cargo quando não fornecido', () => {
    const usuarioSemCargo = {
      nome: 'Maria Santos',
      email: 'maria@email.com'
    }

    const wrapper = mount(UserCard, {
      props: { user: usuarioSemCargo }
    })

    expect(wrapper.find('.user-cargo').exists()).toBe(false)
  })
})
