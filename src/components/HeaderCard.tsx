import { Box, useTheme, Heading, Row } from 'native-base'
import { ReactNode, useEffect } from 'react'

type Props = {
  children?: ReactNode | ReactNode[]
  title?: string
  leftContent?: ReactNode | ReactNode[]
  rightContent?: ReactNode | ReactNode[]
  portal?: any
}

const HeaderCard: React.FC<Props> = ({
  children,
  title,
  leftContent,
  rightContent,
  portal
}) => {
  const { space, sizes } = useTheme()

  useEffect(() => {
    portal && portal(children)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box
      bgColor="primary.900"
      paddingY={`${sizes['headerPaddingYPx']}px`}
      borderBottomRadius={8}
      zIndex={9999}>
      <Box
        h={`${sizes['headerSizePx']}px`}
        paddingX={space['1']}
        position="fixed"
        top="0"
        left="0"
        right="0"
        bgColor="primary.900"
        zIndex="1">
        <Row alignItems="center" justifyContent={'center'} h="100%">
          <Box flex={1} flexGrow={0}>
            {leftContent}
          </Box>
          <Heading color="lightText" flex="1" textAlign={'center'}>
            {title}
          </Heading>
          <Box flex={1} alignItems="flex-end" flexGrow={0}>
            {rightContent}
          </Box>
        </Row>
      </Box>
      {/* {children && (
        <Box paddingX={space['1']} paddingTop={'56px'}>
          {children}
        </Box>
      )} */}
    </Box>
  )
}
export default HeaderCard
