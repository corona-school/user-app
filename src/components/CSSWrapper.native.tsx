import { ReactNode } from 'react'

type Props = { className: string; children: ReactNode | ReactNode[] }

const CSSWrapper: React.FC<Props> = ({ children }) => {
  return <>{children}</>
}
export default CSSWrapper
