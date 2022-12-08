import { View, useBreakpointValue, useTheme, Row, Column } from 'native-base'
import HeaderCard from './HeaderCard'
import { NavigationItems } from '../types/navigation'
import BottomNavigationBar from './BottomNavigationBar'
import { ReactNode } from 'react'

import LFHomeIcon from '../assets/icons/lernfair/lf-home.svg'
import LFMatchingIcon from '../assets/icons/lernfair/lf-1-1.svg'
import LFGroupIcon from '../assets/icons/lernfair/lf-course.svg'
import LFHelpIcon from '../assets/icons/lernfair/lf-question.svg'
import SideBarMenu from './SideBarMenu'
import SettingsButton from './SettingsButton'
import CenterLoadingSpinner from './CenterLoadingSpinner'

// TODO translations
const navItems: NavigationItems = {
  start: { label: 'Start', icon: LFHomeIcon },
  // appointments: { label: 'Termine', icon: LFAppointmentIcon, disabled: true },
  group: { label: 'Gruppe', icon: LFGroupIcon },
  matching: { label: 'Einzel', icon: LFMatchingIcon },
  hilfebereich: { label: 'Hilfe', icon: LFHelpIcon }
}

type Props = {
  children?: ReactNode | ReactNode[]
  headerLeft?: ReactNode | ReactNode[]
  headerRight?: ReactNode | ReactNode[]
  headerContent?: ReactNode | ReactNode[]
  headerTitle?: string
  isSidebarMenu?: boolean
  showBack?: boolean
  hideMenu?: boolean
  isLoading?: boolean
  onBack?: () => any
}

const WithNavigation: React.FC<Props> = ({
  children,
  headerLeft,
  headerRight,
  headerContent,
  headerTitle,
  isSidebarMenu = true,
  showBack,
  hideMenu,
  isLoading,
  onBack
}) => {
  const { sizes, space } = useTheme()
  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })

  const innerPaddingContent = useBreakpointValue({
    base: 0,
    lg: space['1']
  })

  // const [view, setView] = useState(null)

  const headerHeight = sizes['headerSizePx'] - sizes['headerPaddingYPx'] * 2
  return (
    <View flex="1">
      <View
        flex="1"
        display="flex"
        flexDirection="column"
        flexWrap="nowrap"
        overflow="hidden"
        w="100vw"
        h="100%">
        <HeaderCard
          onBack={onBack}
          showBack={showBack}
          leftContent={headerLeft}
          rightContent={
            headerRight ||
            (isSidebarMenu && !hideMenu ? <SettingsButton /> : '')
          }
          title={headerTitle}>
          {!isMobile && headerContent}
        </HeaderCard>
        <View flex="1" overflowY={'scroll'}>
          <Row maxW="100%" flexWrap={'wrap'} overflowX="hidden" flex="1">
            <Column>
              <SideBarMenu
                show={!isMobile}
                navItems={navItems}
                paddingTop={'72px'}
              />
            </Column>

            <Column flex="1" padding={innerPaddingContent}>
              {(!isLoading && (
                <>
                  {(isMobile && (
                    <>
                      <View h={`${headerHeight}px`}></View>
                      {headerContent}
                      <View h={`${headerHeight}px`}></View>
                    </>
                  )) || <View h={`${sizes['headerSizePx']}px`}></View>}
                  {children}
                </>
              )) || <CenterLoadingSpinner />}
            </Column>
          </Row>
        </View>
      </View>
      <BottomNavigationBar show={isMobile} navItems={navItems} />
    </View>
  )
}
export default WithNavigation
