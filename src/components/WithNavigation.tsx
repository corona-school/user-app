import { View, useBreakpointValue } from 'native-base'
import HeaderCard from './HeaderCard'
import SideBarMenu from './SideBarMenu'
import { NavigationItems } from '../types/navigation'
import BottomNavigationBar from './BottomNavigationBar'
import { ReactNode } from 'react'

const navItems: NavigationItems = {
  dashboard: null,
  appointments: null,
  explore: null,
  help: null
}

type Props = {
  children?: ReactNode | ReactNode[]
  headerLeft?: ReactNode | ReactNode[]
  headerRight?: ReactNode | ReactNode[]
  headerContent?: ReactNode | ReactNode[]
  headerTitle?: string
}

const WithNavigation: React.FC<Props> = ({
  children,
  headerLeft,
  headerRight,
  headerContent,
  headerTitle
}) => {
  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })

  return (
    <View h="100vh">
      <HeaderCard
        leftContent={headerLeft}
        rightContent={headerRight}
        title={headerTitle}>
        {headerContent}
      </HeaderCard>
      <View
        flex="1"
        overflowY="scroll"
        display="flex"
        flexDirection={'row'}
        flexWrap="nowrap"
        overflow="hidden"
        w="100vw"
        h="100vh"
        marginTop={'-72px'}
        paddingTop={'72px'}>
        {/* <SideBarMenu show={!isMobile} navItems={navItems} paddingTop={'72px'} /> */}

        <View flex="1">{children}</View>
      </View>
      <BottomNavigationBar show={isMobile} navItems={navItems} />
    </View>
  )
}
export default WithNavigation
