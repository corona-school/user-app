import { View, Text, Box, PresenceTransition } from 'native-base'
import { createContext, ReactNode, useContext } from 'react'
import CSSWrapper from '../components/CSSWrapper'
import useModal from '../hooks/useModal'
import '../web/scss/widgets/FullPageModal.scss'
import RatingCard from './RatingCard'

type Props = {}

type IModalContent = {
  show: boolean
  content: ReactNode
  setShow: (show: boolean) => any
  setContent: (content: ReactNode) => any
}
export const ModalContext = createContext<IModalContent>({
  show: false,
  content: null,
  setShow: () => null,
  setContent: () => null
})

const FullPageModal: React.FC<Props> = () => {
  const { show, content } = useContext(ModalContext)

  return (
    <CSSWrapper className={`fullpagemodal ${show ? 'show' : ''}`}>
      <Box bgColor={'primary.900'} w="100%" h="100%">
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
          <Box>{content}</Box>
        </PresenceTransition>
      </Box>
    </CSSWrapper>
  )
}
export default FullPageModal
