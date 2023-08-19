import { screen, waitFor } from '@testing-library/react'
import { test, vi } from 'vitest'

import { customRender } from '@/libs/test'

import { TodoList } from '.'

test('render loading text correctly', () => {
  customRender(<TodoList />)

  expect(screen.getByText('Loading...')).toBeInTheDocument()
})

test('render title correctly', async () => {
  customRender(<TodoList />)

  expect(await screen.findByText('Todo List')).toBeInTheDocument()
})

test('add todo item correctly', async () => {
  const { user } = customRender(<TodoList />)
  const textbox = await screen.findByRole('textbox')
  await user.type(textbox, 'test3')
  await user.click(screen.getByRole('button', { name: 'Add' }))

  expect(await screen.findByText('🤙 test3')).toBeInTheDocument()
})

test('update todo item correctly', async () => {
  const { user } = customRender(<TodoList />)
  await user.click((await screen.findAllByRole('checkbox'))[0])

  await waitFor(() => {
    expect(screen.getAllByRole('checkbox')[0]).toBeChecked()
  })
})

test('delete todo item correctly', async () => {
  const { user } = customRender(<TodoList />)
  // MEMO:確認ダイアログのスパイを作成
  const windowConfirmSpy = vi.spyOn(window, 'confirm')
  windowConfirmSpy.mockImplementation(() => true)

  // 念の為、初期のTODO数を確認
  await waitFor(() => {
    expect(screen.getAllByRole('listitem').length).toBe(2)
  })

  await user.click((await screen.findAllByRole('button', { name: '🗑' }))[0])

  await waitFor(() => {
    expect(screen.getAllByRole('listitem').length).toBe(1)
  })

  // NOTE:別テストに影響が出ないようスパイをリストアする
  windowConfirmSpy.mockRestore()
})
