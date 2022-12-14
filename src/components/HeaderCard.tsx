import {
  Box,
  useTheme,
  Heading,
  Row,
  useBreakpointValue,
  Flex,
  HStack
} from 'native-base'
import { ReactNode, useEffect } from 'react'
import BackButton from './BackButton'

type Props = {
  children?: ReactNode | ReactNode[]
  title?: string
  leftContent?: ReactNode | ReactNode[]
  rightContent?: ReactNode | ReactNode[]
  portal?: any
  showBack?: boolean
}

const HeaderCard: React.FC<Props> = ({
  children,
  title,
  leftContent,
  rightContent,
  portal,
  showBack
}) => {
  const { space, sizes } = useTheme()

  const headerTitleSize = useBreakpointValue({
    base: 14,
    lg: 19
  })

  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })

  // useEffect(() => {
  //   portal && portal(children)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

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
          {showBack && (
            <Box mr={space['1']} position="absolute" left="0">
              <BackButton />
            </Box>
          )}

          <Box flex={1} flexGrow={0} minW="28px">
            {isMobile && leftContent}
          </Box>

          {(isMobile && (
            <Heading
              fontSize={headerTitleSize}
              color="lightText"
              flex="1"
              textAlign={'center'}>
              {title}
            </Heading>
          )) || (
            <Box position={'relative'} flex="1">
              {children}
            </Box>
          )}
          <HStack
            space={space['1']}
            flexDirection={'row'}
            justifyContent="center"
            alignItems="flex-end">
            {!isMobile && <Box>{leftContent}</Box>}
            <Box>{rightContent}</Box>
          </HStack>
        </Row>
      </Box>
      {isMobile && children && (
        <Box paddingX={space['1']} paddingTop={'56px'}>
          {children}
        </Box>
      )}
    </Box>
  )
}
export default HeaderCard
