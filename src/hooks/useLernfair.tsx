import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from 'react'
import { User as LFUser } from '../types/lernfair/User'

type LernFair = {
  user: LFUser | null
  setUser?: (user: LFUser) => SetStateAction<LFUser>
}

const LernfairContext = createContext<LernFair>({ user: null })

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
  const [user, _setUser] = useState<LFUser>()

  const setUser = (user: LFUser) => _setUser(prev => ({ ...prev, ...user }))

  return { user, setUser } as LernFair
}

const useLernfair = () => {
  return useContext(LernfairContext)
}

export default useLernfair
