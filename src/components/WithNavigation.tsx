import { View, useBreakpointValue, useTheme, Row, Column } from 'native-base'
import HeaderCard from './HeaderCard'
import { NavigationItems } from '../types/navigation'
import BottomNavigationBar from './BottomNavigationBar'
import { ReactNode, useState } from 'react'

import LFHomeIcon from '../assets/icons/lernfair/lf-home.svg'
import LFAppointmentIcon from '../assets/icons/lernfair/lf-calendar.svg'
import LFMatchingIcon from '../assets/icons/lernfair/lf-matching.svg'
import LFGroupIcon from '../assets/icons/lernfair/lf-users.svg'
import LFHelpIcon from '../assets/icons/lernfair/lf-question.svg'
import SideBarMenu from './SideBarMenu'
import SettingsButton from './SettingsButton'

const navItems: NavigationItems = {
  dashboard: { label: 'Dashboard', icon: LFHomeIcon },
  appointments: { label: 'Termine', icon: LFAppointmentIcon, disabled: true },
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
}

const WithNavigation: React.FC<Props> = ({
  children,
  headerLeft,
  headerRight,
  headerContent,
  headerTitle,
  isSidebarMenu = true
}) => {
  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })
  const [view, setView] = useState(null)
  const { sizes } = useTheme()
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
          leftContent={headerLeft}
          rightContent={isSidebarMenu ? <SettingsButton /> : ''}
          title={headerTitle}
          portal={setView}>
          {headerContent}
        </HeaderCard>
        <View flex="1" overflowY={'scroll'}>
          <Row maxW="100%" flexWrap={'wrap'} overflowX="hidden">
            <Column>
              <SideBarMenu
                show={!isMobile}
                navItems={navItems}
                paddingTop={'72px'}
              />
            </Column>
            <Column flex="1">
              {(view && (
                <>
                  <View h={`${headerHeight}px`}></View>
                  {view}
                </>
              )) || <View h={`${sizes['headerSizePx']}px`}></View>}
              {children}
            </Column>
          </Row>
        </View>
      </View>
      <BottomNavigationBar show={isMobile} navItems={navItems} />
    </View>
  )
}
export default WithNavigation
