import { View, Text } from 'native-base'
import { Fragment, ReactNode } from 'react'
import { Platform } from 'react-native'

type Props = { className: string; children: ReactNode | ReactNode[] }

const CSSWrapper: React.FC<Props> = ({ className, children }) => {
  const Base = ({
    children,
    className
  }: {
    children: ReactNode | ReactNode[]
    className: string
  }) =>
    Platform.OS !== 'web' ? (
      <>{children}</>
    ) : (
      <div className={className}>{children}</div>
    )

  return <Base className={className}>{children}</Base>
}
export default CSSWrapper
