import { Box, PresenceTransition } from 'native-base'
import { createContext, ReactNode, useMemo } from 'react'
import CSSWrapper from '../components/CSSWrapper'
import useModal from '../hooks/useModal'
import '../web/scss/widgets/FullPageModal.scss'

type Props = {}
export type IModalTheme = 'light' | 'dark' | 'image'
type IModalContent = {
  show: boolean
  content: ReactNode
  variant?: IModalTheme
  setShow: (show: boolean) => any
  setContent: (content: ReactNode) => any
  setVariant: (variant: IModalTheme) => any
}

export const ModalContext = createContext<IModalContent>({
  show: false,
  content: null,
  variant: 'light',
  setShow: () => null,
  setContent: () => null,
  setVariant: () => null
})

const FullPageModal: React.FC<Props> = () => {
  const { show, content, variant } = useModal()

  const bgColor = useMemo(() => {
    switch (variant) {
      case 'dark':
        return 'primary.900'
      case 'image':
        return 'pink.500' // TODO
      case 'light':
      default:
        return 'lightText'
    }
  }, [variant])

  return (
    <CSSWrapper className={`fullpagemodal ${show ? 'show' : ''}`}>
      <Box bgColor={bgColor} w="100%" h="100%" testID="fullpagemodal">
        <Box testID="fullpagemodal__content" h="100%">
          {content}
        </Box>
      </Box>
    </CSSWrapper>
  )
}
export default FullPageModal
