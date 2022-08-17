import {
  Text,
  Row,
  Box,
  CircleIcon,
  useTheme,
  Link,
  SunIcon,
  Center
} from 'native-base'
import { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import CSSWrapper from './CSSWrapper'

type Props = {}

const navItems = {
  dashboard: null,
  profile: null,
  appointments: null,
  explore: null,
  help: null
}

const BottomNavigationBar: React.FC<Props> = () => {
  const location = useLocation()
  const { space } = useTheme()

  const path = useMemo(() => {
    const p = location.pathname.replace('/', '')
    if (Object.keys(navItems).includes(p)) return p
    return 'dashboard'
  }, [location.pathname])

  return (
    <Row
      h={'54px'}
      bgColor="lightText"
      borderTopWidth={1}
      borderTopColor="primary.500"
      justifyContent={'space-between'}
      alignItems={'center'}
      paddingX={space['1']}>
      {Object.entries(navItems).map(([key, icon]) => (
        <Link href={key}>
          <Center>
            <CSSWrapper className="navigation__item">
              <CircleIcon
                size="35px"
                color={key === path ? 'primary.900' : 'transparent'}
              />
              <CSSWrapper className="navigation__item__icon">
                <SunIcon color={key === path ? 'lightText' : 'primary.900'} />
              </CSSWrapper>
            </CSSWrapper>
          </Center>
        </Link>
      ))}
    </Row>
  )
}
export default BottomNavigationBar
