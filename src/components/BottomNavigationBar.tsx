import { Row, CircleIcon, useTheme, Link, Center, Text, Box } from 'native-base'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { NavigationItems } from '../types/navigation'
import CSSWrapper from './CSSWrapper'
import '../web/scss/components/BottomNavigationBar.scss'

type Props = {
  show?: boolean
  navItems: NavigationItems
}

const BottomNavigationBar: React.FC<Props> = ({ show = true, navItems }) => {
  const location = useLocation()
  const { space, colors } = useTheme()

  const path = useMemo(() => {
    const p = location.pathname.replace('/', '')
    if (Object.keys(navItems).includes(p)) return p
    return 'dashboard'
  }, [location.pathname, navItems])

  return (
    (show && (
      <>
        <Row
          h={'54px'}
          bgColor="lightText"
          borderTopWidth={1}
          borderTopColor="primary.500"
          justifyContent={'space-between'}
          alignItems={'center'}
          paddingX={space['1']}>
          {Object.entries(navItems).map(
            ([key, { label, icon: Icon, disabled }]) => (
              <Link href={disabled ? undefined : key} key={key}>
                <CSSWrapper className="navigation__item">
                  <Center>
                    <Box>
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
                      <CSSWrapper
                        className={`navigation__item__icon ${
                          !disabled && key === path ? 'active' : ''
                        }`}>
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
                    </Box>
                    <Text fontSize="xs">{label}</Text>
                  </Center>
                </CSSWrapper>
              </Link>
            )
          )}
        </Row>
      </>
    )) || <></>
  )
}
export default BottomNavigationBar
