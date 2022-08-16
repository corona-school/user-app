import { extendTheme, theme } from 'native-base'
import { border } from 'native-base/lib/typescript/theme/styled-system'

const COLOR_PRIMARY_LIGHT = '#EDF4F3'
const COLOR_PRIMARY = '#82B1B0'
const COLOR_PRIMARY_DARK = '#2B4B51'
const COLOR_YELLOW = '#FEDA50'
const COLOR_DARKYELLOW = '#d0b345'
const COLOR_SECONDARY = COLOR_YELLOW
const COLOR_BLUE = '#405B73'
const COLOR_TERTIARY = COLOR_BLUE
const COLOR_RED = '#D45D3A'
const COLOR_DANGER = COLOR_RED
const COLOR_WARNING = COLOR_RED

const Theme = extendTheme({
  colors: {
    primary: {
      translucent: '#EDF4F316',
      darkTranslucent: 'rgba(31,76, 82, .73)',
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
    },
    warning: {
      100: COLOR_WARNING,
      200: COLOR_WARNING,
      300: COLOR_WARNING,
      400: COLOR_WARNING,
      500: COLOR_WARNING,
      600: COLOR_WARNING,
      700: COLOR_WARNING,
      800: COLOR_WARNING,
      900: COLOR_WARNING
    },
    danger: {
      100: COLOR_DANGER,
      200: COLOR_DANGER,
      300: COLOR_DANGER,
      400: COLOR_DANGER,
      500: COLOR_DANGER,
      600: COLOR_DANGER,
      700: COLOR_DANGER,
      800: COLOR_DANGER,
      900: COLOR_DANGER
    }, 
    darkText: COLOR_PRIMARY_DARK
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
        _text: {
          fontWeight: 600,
          fontSize: 14
        },
      },
      variants: {
        solid: {
          backgroundColor: COLOR_YELLOW,
          _text: {
            color: COLOR_PRIMARY_DARK,
            fontSize: 14,
            padding: "3px 5px"
          },
          _hover: {
            backgroundColor: COLOR_DARKYELLOW,
          }
        },
        secondary: {
          backgroundColor: COLOR_BLUE
        }, 
        outline: {
          _light: {
            borderColor: COLOR_PRIMARY,
            _text: {
              color: COLOR_PRIMARY_DARK
            }
          }
        },
        outlinelight: {
          borderColor: COLOR_PRIMARY,
          _light: {
            _text: {
              color: 'white'
            }
          }
        }
      }
    }
  },
  config: {
    initialColorMode: 'light'
  }
})

export default Theme
