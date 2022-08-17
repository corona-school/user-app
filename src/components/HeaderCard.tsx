import { View, Text, Box, useTheme, Heading, Row } from 'native-base'
import { ReactNode } from 'react'

type Props = {
  children?: ReactNode | ReactNode[]
  title?: string
  leftContent?: ReactNode | ReactNode[]
  rightContent?: ReactNode | ReactNode[]
}

const HeaderCard: React.FC<Props> = ({
  children,
  title,
  leftContent,
  rightContent
}) => {
  const { space } = useTheme()

  return (
    <Box
      bgColor="primary.900"
      paddingY={space['0.5']}
      borderBottomRadius={8}
      zIndex={9999}>
      <Box
        h={'56px'}
        paddingX={space['1']}
        position="fixed"
        top="0"
        left="0"
        right="0"
        bgColor="primary.900"
        zIndex="1">
        <Row alignItems="center">
          <Box flex={1}>{leftContent}</Box>
          <Heading color="lightText" flex="1" textAlign={'center'}>
            {title}
          </Heading>
          <Box flex={1} alignItems="flex-end">
            {rightContent}
          </Box>
        </Row>
      </Box>
      {children && (
        <Box paddingX={space['1']} paddingTop={'56px'}>
          {children}
        </Box>
      )}
    </Box>
  )
}
export default HeaderCard
