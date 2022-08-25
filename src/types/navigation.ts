import { ReactNode } from 'react'

export type NavigationItems = {
  [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}
