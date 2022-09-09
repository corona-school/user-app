import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import useApollo from './useApollo'

type LFRegistration = {
  firstname: string
  lastname: string
  email: string
  password: string
  setRegistrationData: (data: Partial<LFRegistration>) => any
}

const LFRegistrationContext = createContext<LFRegistration>({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  setRegistrationData: () => null
})

export const useRegistration = () => useContext(LFRegistrationContext)

export const RegistrationProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const reg = useRegistrationProvider()
  const { createToken } = useApollo()

  useEffect(() => {
    createToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <LFRegistrationContext.Provider value={reg}>
      {children}
    </LFRegistrationContext.Provider>
  )
}

const useRegistrationProvider = () => {
  const [firstname, setFirstname] = useState<string>('')
  const [lastname, setLastname] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const setRegistrationData = (data: LFRegistration) => {
    data.firstname && setFirstname(data.firstname)
    data.lastname && setLastname(data.lastname)
    data.email && setEmail(data.email)
    data.password && setPassword(data.password)
  }

  return {
    firstname,
    lastname,
    email,
    password,
    setRegistrationData
  } as LFRegistration
}

export default useRegistration
