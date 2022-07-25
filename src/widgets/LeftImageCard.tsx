import { View, Text, Row, Box, VStack, useTheme } from 'native-base'
import { ReactNode } from 'react'
import Card from '../components/Card'
import Tag from '../components/Tag'

type Props = { children: ReactNode | ReactNode[] }

const LeftImageCard: React.FC<Props> = ({ children }) => {
  const { space } = useTheme()
  return (
    <Card flexibleWidth>
      <Row>
        <Box w={100} bg={'gray.600'}></Box>
        <VStack
          paddingX={space['0.5']}
          paddingY={space['1']}
          flex="1"
          space={space['0.5']}>
          {children}
        </VStack>
      </Row>
    </Card>
  )
}
export default LeftImageCard
