import { NativeBaseProvider } from "native-base";
import Theme from "../src/Theme";
import React from "react";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

// TODO: Unfortunately the following does not work for MDX files?
export const decorators = [
  (Story) => (
    <NativeBaseProvider theme={Theme}>
      <Story />
    </NativeBaseProvider>
  ),
];