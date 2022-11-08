import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from 'react'
import { User as LFUser, LFUserType } from '../types/lernfair/User'

type LernFair = {
  userType: LFUserType | null
  setUserType?: (user: LFUserType) => SetStateAction<LFUser>
  rootPath?: string
  setRootPath?: (path: string) => SetStateAction<string>
}

const LernfairContext = createContext<LernFair>({ userType: null })

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
  const [userType, _setUserType] = useState<LFUserType>()
  const [rootPath, _setRootPath] = useState<string>('dashboard')

  const setUserType = (user: LFUserType) => _setUserType(user)
  const setRootPath = (path: string) => _setRootPath(path)

  return { userType, setUserType, rootPath, setRootPath } as LernFair
}

const useLernfair = () => {
  return useContext(LernfairContext)
}

export default useLernfair
