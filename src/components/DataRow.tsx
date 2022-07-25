import { Row, useTheme } from 'native-base'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode | ReactNode[]
}

const DataRow: React.FC<Props> = ({ children }) => {
  const { space } = useTheme()

  return (
    <Row
      borderBottomWidth={1}
      borderBottomColor="gray.400"
      paddingBottom={space['0.5']}>
      {children}
    </Row>
  )
}
export default DataRow
