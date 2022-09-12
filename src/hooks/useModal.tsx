import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from 'react'
import { IModalTheme } from '../widgets/FullPageModal'

type LFModal = {
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
  content: ReactNode
  setContent: Dispatch<SetStateAction<ReactNode>>
  variant: IModalTheme
  setVariant: Dispatch<SetStateAction<IModalTheme>>
}

export const LFModalContext = createContext<LFModal>({
  show: false,
  content: null,
  variant: 'light',
  setShow: () => null,
  setContent: () => null,
  setVariant: () => null
})

export const LFModalProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const modal = useProvideModal()
  return (
    <LFModalContext.Provider value={modal}>{children}</LFModalContext.Provider>
  )
}

const useModal = () => {
  return useContext(LFModalContext)
}

const useProvideModal = () => {
  const [show, setShow] = useState<boolean>(false)
  const [content, setContent] = useState<ReactNode>()
  const [variant, setVariant] = useState<IModalTheme>('light')

  return { show, setShow, content, setContent, variant, setVariant }
}
export default useModal
