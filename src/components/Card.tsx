import { Card as BaseCard } from 'native-base'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode | ReactNode[]
  flexibleWidth?: boolean
  variant?: 'normal' | 'dark'
  isFullHeight?: boolean
  width?: number | string
}

const Card: React.FC<Props> = ({
  children,
  flexibleWidth = false,
  variant = 'normal',
  isFullHeight = true,
  width
}) => {
  const p: { flex?: number } = {}

  if (isFullHeight) {
    p.flex = 1
  }

  return (
    <BaseCard
      shadow="none"
      bg={variant === 'normal' ? 'primary.100' : 'primary.900'}
      borderRadius={8}
      padding={0}
      w={width ? width : flexibleWidth ? 'auto' : '190'}
      {...p}>
      {children}
    </BaseCard>
  )
}
export default Card
