import {
  Flex,
  Row,
  Box,
  ArrowBackIcon,
  Pressable,
  Link,
  ArrowForwardIcon,
  Modal
} from 'native-base'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState
} from 'react'
import { useNavigate } from 'react-router-dom'
import OnBoardingSkipModal from '../widgets/OnBoardingSkipModal'

type Props = {
  children: ReactNode | ReactNode[]
  onSkip?: () => any
  onPrev?: (currentIndex: number) => any
  onNext?: (currentIndex: number) => any
  loop?: boolean
  isOnboarding?: boolean
  onFinish?: () => any
}

export type IViewPagerContext = {
  currentIndex: number
  itemCount: number
  setCurrentIndex: Dispatch<SetStateAction<number>>
}
export const ViewPagerContext = createContext<IViewPagerContext>({
  currentIndex: 0,
  setCurrentIndex: () => null,
  itemCount: 0
})

const ViewPager: React.FC<Props> = ({
  children,
  onSkip, // unused right now
  onPrev,
  onNext,
  loop,
  isOnboarding,
  onFinish
}) => {
  const navigate = useNavigate()

  const isMultiple = Array.isArray(children)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [cancelModal, setCancelModal] = useState<boolean>(false)

  return (
    <ViewPagerContext.Provider
      value={{
        currentIndex,
        setCurrentIndex,
        itemCount: !isMultiple ? 1 : children?.length
      }}>
      <Flex h="100%" flex="1" flexGrow={1}>
        <Flex flex="1" position="relative" justifyContent={'center'}>
          {isMultiple &&
            children.map(
              (c, index) => index === currentIndex && <Flex flex="1">{c}</Flex>
            )}
        </Flex>
        <Row backgroundColor="primary.900" width="100%" bottom="0">
          <Box
            flexDirection="row"
            width="100%"
            padding="14px"
            alignItems="center"
            justifyContent={'space-between'}>
            <Pressable
              onPress={() => {
                let i =
                  currentIndex > 0
                    ? currentIndex - 1
                    : loop
                    ? (isMultiple && children?.length - 1) || 0
                    : 0
                setCurrentIndex(i)
                onPrev && onPrev(i)
              }}>
              <Box
                width="32px"
                height="32px"
                backgroundColor="primary.100"
                justifyContent="center"
                alignItems="center"
                borderRadius="50%">
                <ArrowBackIcon color="primary.900" />
              </Box>
            </Pressable>
            {isOnboarding && (
              <Box>
                <Link
                  onPress={() => setCancelModal(true)}
                  _text={{
                    color: 'lightText',
                    fontWeight: '700',
                    textDecoration: 'none',
                    fontSize: '14px'
                  }}>
                  Überspringen
                </Link>
              </Box>
            )}
            <Pressable
              onPress={() => {
                let i =
                  currentIndex < (isMultiple && children?.length - 1)
                    ? currentIndex + 1
                    : loop
                    ? 0
                    : currentIndex
                setCurrentIndex(i)

                if (isMultiple) {
                  if (currentIndex + 1 === children?.length) {
                    onFinish && onFinish()
                  } else {
                    onNext && onNext(i)
                  }
                } else {
                  onFinish && onFinish()
                }
              }}>
              <Box
                width="32px"
                height="32px"
                backgroundColor="primary.100"
                justifyContent="center"
                alignItems="center"
                borderRadius="50%">
                <ArrowForwardIcon color="primary.900" />
              </Box>
            </Pressable>
          </Box>
        </Row>
        <Modal
          bg="modalbg"
          isOpen={cancelModal}
          onClose={() => setCancelModal(false)}>
          <OnBoardingSkipModal
            onPressClose={() => setCancelModal(false)}
            onPressDefaultButton={() => setCancelModal(false)}
            onPressOutlineButton={() => navigate('/')}
          />
        </Modal>
      </Flex>
    </ViewPagerContext.Provider>
  )
}

export default ViewPager
