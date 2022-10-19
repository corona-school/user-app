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

  const setUserType = (user: LFUserType) => _setUserType(user)

  return { userType, setUserType } as LernFair
}

const useLernfair = () => {
  return useContext(LernfairContext)
}

export default useLernfair
