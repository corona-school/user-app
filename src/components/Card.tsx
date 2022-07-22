import { Card as BaseCard } from 'native-base'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode | ReactNode[]
  flexibleWidth?: boolean
}

const Card: React.FC<Props> = ({ children, flexibleWidth = false }) => {
  return (
    <BaseCard
      bg="gray.200"
      borderRadius={8}
      padding={0}
      w={flexibleWidth ? 'auto' : '180'}>
      {children}
    </BaseCard>
  )
}
export default Card
