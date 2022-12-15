import React from "react"
import { NativeBaseProvider } from "native-base";
import Theme from "../src/Theme";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

// NOTE: Decorators are only applied to <Story> tags inside MDX!
export const decorators = [
  (Page: () => React.ReactElement) => (
    <NativeBaseProvider theme={Theme}>
      <Page/>
    </NativeBaseProvider>
  )
]