import { Card as BaseCard } from 'native-base'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode | ReactNode[]
  flexibleWidth?: boolean
  variant?: 'normal' | 'dark'
}

const Card: React.FC<Props> = ({
  children,
  flexibleWidth = false,
  variant = 'normal'
}) => {
  return (
    <BaseCard
      shadow="none"
      bg={variant === 'normal' ? 'primary.100' : 'primary.900'}
      borderRadius={8}
      padding={0}
      w={flexibleWidth ? 'auto' : '180'}>
      {children}
    </BaseCard>
  )
}
export default Card
