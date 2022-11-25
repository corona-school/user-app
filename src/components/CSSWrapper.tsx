import { ReactNode } from 'react'

type Props = {
  className: string
  children: ReactNode | ReactNode[]
  style?: Object
}

const CSSWrapper: React.FC<Props> = ({ className, children, style }) => {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}
export default CSSWrapper
