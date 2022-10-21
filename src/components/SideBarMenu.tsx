import {
  View,
  Text,
  VStack,
  Link,
  Center,
  CircleIcon,
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
  const { space, colors } = useTheme()

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
          bgColor={'lightText'}
          style={{
            shadowColor: '#000000',
            shadowOpacity: 0.1,
            shadowRadius: 30,
            shadowOffset: { width: 2, height: 2 }
          }}
          w="240"
          top="0"
          left="0"
          bottom="0">
          {Object.entries(navItems).map(
            ([key, { label, icon: Icon, disabled }]) => (
              <Link href={disabled ? undefined : key} key={key}>
                <Row
                  alignItems={'center'}
                  paddingX={space['1']}
                  paddingY="15px">
                  <Center>
                    <CSSWrapper className="navigation__item">
                      <CircleIcon
                        size="35px"
                        color={
                          disabled
                            ? 'transparent'
                            : key === path
                            ? 'primary.900'
                            : 'transparent'
                        }
                      />
                      <CSSWrapper className="navigation__item__icon">
                        <Icon
                          fill={
                            disabled
                              ? colors['gray']['300']
                              : key === path
                              ? colors['lightText']
                              : colors['primary']['900']
                          }
                        />
                      </CSSWrapper>
                    </CSSWrapper>
                  </Center>
                  <Text
                    fontSize="lg"
                    fontWeight="500"
                    color={disabled ? colors['gray']['300'] : undefined}
                    marginLeft={space['0.5']}>
                    {label}
                  </Text>
                </Row>
              </Link>
            )
          )}
        </VStack>
      </View>
    )) || <></>
  )
}
export default SideBarMenu
