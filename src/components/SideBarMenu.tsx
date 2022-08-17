import {
  View,
  Text,
  useBreakpointValue,
  VStack,
  Link,
  Center,
  CircleIcon,
  SunIcon,
  Row,
  useTheme
} from 'native-base'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { NavigationItems } from '../types/navigation'
import CSSWrapper from './CSSWrapper'

type Props = {
  show?: boolean
  navItems: NavigationItems
  paddingTop?: string | number
}

const SideBarMenu: React.FC<Props> = ({ show, navItems, paddingTop }) => {
  const location = useLocation()
  const { space } = useTheme()

  const path = useMemo(() => {
    const p = location.pathname.replace('/', '')
    if (Object.keys(navItems).includes(p)) return p
    return 'dashboard'
  }, [location.pathname, navItems])

  return (
    (show && (
      <View w="240" h="100%">
        <VStack
          paddingTop={paddingTop}
          position="fixed"
          bgColor={'red.500'}
          w="240"
          top="0"
          left="0"
          bottom="0">
          {Object.entries(navItems).map(([key, item]) => (
            <Link href={key}>
              <Row alignItems={'center'} paddingX={space['0.5']}>
                <Center>
                  <CSSWrapper className="navigation__item">
                    <CircleIcon
                      size="35px"
                      color={key === path ? 'primary.900' : 'transparent'}
                    />
                    <CSSWrapper className="navigation__item__icon">
                      <SunIcon
                        color={key === path ? 'lightText' : 'primary.900'}
                      />
                    </CSSWrapper>
                  </CSSWrapper>
                </Center>
                <Text marginLeft={space['0.5']}>{key}</Text>
              </Row>
            </Link>
          ))}
        </VStack>
      </View>
    )) || <></>
  )
}
export default SideBarMenu
