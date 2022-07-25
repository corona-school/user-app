import { extendTheme } from 'native-base'

const Theme = extendTheme({
  fontSizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18
  },
  components: {
    Heading: {
      defaultProps: {
        fontSize: 'xl'
      }
    }
  }
})

export default Theme
