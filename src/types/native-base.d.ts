import Theme from '../Theme'

type ThemeType = typeof Theme

declare module 'native-base' {
  interface ICustomTheme extends ThemeType {}
}
