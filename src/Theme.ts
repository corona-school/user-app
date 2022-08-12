import { extendTheme, theme } from 'native-base'

const COLOR_PRIMARY_LIGHT = '#EDF4F3'
const COLOR_PRIMARY = '#82B1B0'
const COLOR_PRIMARY_DARK = '#2B4B51'
const COLOR_YELLOW = '#F4CC54'
const COLOR_SECONDARY = COLOR_YELLOW
const COLOR_BLUE = '#405B73'
const COLOR_TERTIARY = COLOR_BLUE

const Theme = extendTheme({
  colors: {
    primary: {
      100: COLOR_PRIMARY_LIGHT,
      200: COLOR_PRIMARY_LIGHT,
      300: COLOR_PRIMARY_LIGHT,
      400: COLOR_PRIMARY,
      500: COLOR_PRIMARY,
      600: COLOR_PRIMARY,
      700: COLOR_PRIMARY_DARK,
      800: COLOR_PRIMARY_DARK,
      900: COLOR_PRIMARY_DARK
    },
    secondary: {
      100: COLOR_SECONDARY,
      200: COLOR_SECONDARY,
      300: COLOR_SECONDARY,
      400: COLOR_SECONDARY,
      500: COLOR_SECONDARY,
      600: COLOR_SECONDARY,
      700: COLOR_SECONDARY,
      800: COLOR_SECONDARY,
      900: COLOR_SECONDARY
    },
    tertiary: {
      100: COLOR_TERTIARY,
      200: COLOR_TERTIARY,
      300: COLOR_TERTIARY,
      400: COLOR_TERTIARY,
      500: COLOR_TERTIARY,
      600: COLOR_TERTIARY,
      700: COLOR_TERTIARY,
      800: COLOR_TERTIARY,
      900: COLOR_TERTIARY
    }
  },
  fontSizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18
  },
  components: {
    Text: {
      defaultProps: {
        color: COLOR_PRIMARY_DARK
      }
    },
    Heading: {
      defaultProps: {
        fontSize: 'xl',
        color: COLOR_PRIMARY_DARK
      }
    },
    Button: {
      defaultProps: {
        backgroundColor: COLOR_YELLOW
      },
      variants: {
        secondary: {
          backgroundColor: COLOR_BLUE
        }
      }
    }
  },
  config: {
    initialColorMode: 'light'
  }
})

export default Theme
