import { ReactNode } from 'react'

type Props = { className: string; children: ReactNode | ReactNode[] }

const CSSWrapper: React.FC<Props> = ({ className, children }) => {
  return <div className={className}>{children}</div>
}
export default CSSWrapper
