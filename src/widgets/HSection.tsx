import { Box, Heading, Link, Row, useTheme } from 'native-base'
import { ReactNode } from 'react'
import AppointmentCard from '../widgets/AppointmentCard'

type Props = {
  title?: string
  showAll?: boolean
  children: ReactNode | ReactNode[]
  onShowAll?: () => any
  smallTitle?: boolean
}

const HSection: React.FC<Props> = ({
  title,
  showAll = false,
  children,
  onShowAll,
  smallTitle
}) => {
  const { space, fontSizes } = useTheme()
  return (
    <Box>
      <Row
        alignItems={'center'}
        justifyContent={'flex-end'}
        paddingX={space['1']}
        paddingY={space['0.5']}>
        {title && (
          <Heading
            flex="1"
            fontSize={smallTitle ? fontSizes['md'] : fontSizes['xl']}>
            {title}
          </Heading>
        )}
        {showAll && <Link onPress={onShowAll}>Alle</Link>}
      </Row>
      <Row
        flexWrap={'nowrap'}
        paddingX={space['1']}
        overflowX="scroll"
        space={space['1']}
        paddingBottom={space['1']}>
        {children}
      </Row>
    </Box>
  )
}
export default HSection
