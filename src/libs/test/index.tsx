// mockのprovider

import { MockedProvider } from '@apollo/client/testing'
import type { RenderOptions } from '@testing-library/react'
import { render } from '@testing-library/react'
import usersEvent from '@testing-library/user-event'
import type { FC, ReactElement, ReactNode } from 'react'

import { mocks } from './mock'

type AllTheProviderProps = {
  children: ReactNode
}

const AllTheProvider: FC<AllTheProviderProps> = ({ children }) => {
  return <MockedProvider mocks={mocks}>{children}</MockedProvider>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => ({
  user: usersEvent.setup(),
  ...render(ui, { wrapper: AllTheProvider, ...options }),
})

export { customRender }
