import {
  Flex,
  Row,
  CircleIcon,
  useTheme,
  Button,
  Box,
  ArrowBackIcon,
  Pressable,
  Heading,
  Link,
  ArrowForwardIcon,
  Modal
} from 'native-base'
import { ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OnBoardingSkipModal from '../widgets/OnBoardingSkipModal'
import Bullet from './Bullet'

type Props = {
  children: ReactNode | ReactNode[]
  onSkip?: () => any
  onNext?: (currentIndex: number) => any
  loop?: boolean
  isOnboarding?: boolean
}

const ViewPager: React.FC<Props> = ({
  children,
  onSkip,
  onNext,
  loop,
  isOnboarding
}) => {
  const { space } = useTheme()
  const navigate = useNavigate()

  const isMultiple = Array.isArray(children)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [cancelModal, setCancelModal] = useState<boolean>(false)

  return (
    <Flex h="100%" flex="1" flexGrow={1}>
      <Flex flex="1" position="relative">
        {isMultiple &&
          children.map(
            (c, index) =>
              index === currentIndex && (
                <Flex flexBasis="100%" h="100%">
                  {c}
                </Flex>
              )
          )}
      </Flex>
      <Row
        backgroundColor="primary.900"
        width="100%"
        position="fixed"
        bottom="0">
        <Box
          flexDirection="row"
          width="100%"
          padding="14px"
          alignItems="center"
          justifyContent={'space-between'}>
          <Pressable
            onPress={() => {
              let i =
                currentIndex < (isMultiple && children?.length - 1)
                  ? currentIndex - 1
                  : loop
                  ? 0
                  : currentIndex
              setCurrentIndex(i)
              onSkip && onSkip()
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

              onNext && onNext(i)
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
  )
}

export default ViewPager
