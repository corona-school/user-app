import { Heading, Box, Row, Column, useTheme } from 'native-base'
import { ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode[] | ReactNode[]
}

const TwoColGrid: React.FC<Props> = ({ children, title }) => {
  const { space } = useTheme()
  return (
    <Box paddingX={space['1']}>
      <Row paddingY={space['0.5']}>
        {title && <Heading flex="1">{title}</Heading>}
      </Row>
      <Row flexWrap="wrap">
        {children.map((child, i) => (
          <Column
            key={`item-${i}`}
            flexBasis={'50%'}
            paddingLeft={i % 2 === 0 ? 0 : space['0.5']}
            paddingRight={i % 2 === 0 ? space['0.5'] : 0}
            paddingBottom={space['1']}>
            {child}
          </Column>
        ))}
      </Row>
    </Box>
  )
}
export default TwoColGrid
