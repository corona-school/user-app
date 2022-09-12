export type NavigationItems = {
  [key: string]: {
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    label: string
    disabled?: boolean
  }
}
