import { View, Text, Box, useTheme } from 'native-base'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode | ReactNode[]
}

const HeaderCard: React.FC<Props> = ({ children }) => {
  const { space } = useTheme()

  return (
    <Box bgColor="primary.900" padding={space['0.5']} borderBottomRadius={8}>
      {children}
    </Box>
  )
}
export default HeaderCard
