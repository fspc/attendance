import React from 'react'
import { RecoilRoot } from 'recoil'
import { MyThemeProvider } from '../imports/ui/contexts/theme-context'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => (
    <MyThemeProvider>
      <Story />
    </MyThemeProvider>
  ),
  (Story) => (
    <RecoilRoot>
      <Story />
    </RecoilRoot>
  ),
]
