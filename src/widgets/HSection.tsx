import { Box, Heading, Link, Row, useTheme } from 'native-base'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  title?: string
  showAll?: boolean
  children: ReactNode | ReactNode[]
  onShowAll?: () => any
  smallTitle?: boolean
  isDark?: boolean
  scrollable?: boolean
}

const HSection: React.FC<Props> = ({
  title,
  isDark = false,
  showAll = false,
  scrollable = true,
  children,
  onShowAll,
  smallTitle
}) => {
  const { space, fontSizes } = useTheme()
  const { t } = useTranslation()
  return (
    <Box>
      <Row
        alignItems={'center'}
        justifyContent={'flex-end'}
        marginX={-space['1']}
        paddingX={space['1']}
        paddingY={space['0.5']}>
        {title && (
          <Heading
            color={isDark ? 'lightText' : 'primary.900'}
            flex="1"
            fontSize={smallTitle ? fontSizes['md'] : fontSizes['xl']}>
            {title}
          </Heading>
        )}
        {showAll && <Link onPress={onShowAll}>{t('all')}</Link>}
      </Row>
      <Row
        flexWrap={'nowrap'}
        paddingX={space['1']}
        overflowX={scrollable ? 'scroll' : 'hidden'}
        space={space['1']}
        marginX={-space['1']}
        paddingBottom={space['1']}>
        {children}
      </Row>
    </Box>
  )
}
export default HSection
