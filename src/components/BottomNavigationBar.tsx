import { Row, CircleIcon, useTheme, Link, Center } from 'native-base'
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
          {Object.entries(navItems).map(([key, Icon]) => (
            <Link href={key} key={key}>
              <Center>
                <CSSWrapper className="navigation__item">
                  <CircleIcon
                    size="35px"
                    color={key === path ? 'primary.900' : 'transparent'}
                  />
                  <CSSWrapper
                    className={`navigation__item__icon ${
                      key === path ? 'active' : ''
                    }`}>
                    <Icon
                      fill={
                        key === path
                          ? colors['lightText']
                          : colors['primary']['900']
                      }
                    />
                  </CSSWrapper>
                </CSSWrapper>
              </Center>
            </Link>
          ))}
        </Row>
      </>
    )) || <></>
  )
}
export default BottomNavigationBar
