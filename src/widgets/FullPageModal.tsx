import { View, Text, Box, PresenceTransition } from 'native-base'
import { createContext, ReactNode, useContext, useMemo } from 'react'
import CSSWrapper from '../components/CSSWrapper'
import useModal from '../hooks/useModal'
import '../web/scss/widgets/FullPageModal.scss'
import RatingCard from './RatingCard'

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
  const { show, content, variant } = useContext(ModalContext)

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
        <PresenceTransition
          visible={show}
          initial={{
            translateY: 60,
            opacity: 0
          }}
          animate={{
            translateY: 0,
            opacity: 1,
            transition: {
              duration: 500,
              delay: 0.4
            }
          }}>
          <Box testID="fullpagemodal__content">{content}</Box>
        </PresenceTransition>
      </Box>
    </CSSWrapper>
  )
}
export default FullPageModal
