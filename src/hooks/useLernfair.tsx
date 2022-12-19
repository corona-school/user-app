import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from 'react'
type LernFair = {
  rootPath?: string
  setRootPath?: (path: string) => SetStateAction<string>
}

const LernfairContext = createContext<LernFair>({})

export const LernfairProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const lernfair = useLernfairProvider()
  return (
    <LernfairContext.Provider value={lernfair}>
      {children}
    </LernfairContext.Provider>
  )
}

const useLernfairProvider = () => {
  const [rootPath, setRootPath] = useState<string>('dashboard')

  return { rootPath, setRootPath } as LernFair
}

const useLernfair = () => {
  return useContext(LernfairContext)
}

export default useLernfair
